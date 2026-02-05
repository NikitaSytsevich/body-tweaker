import WebApp from '@twa-dev/sdk';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import type { HistoryRecord } from './types';

// ================= SECURITY CHECK =================
// Берем ключ из .env файла
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

// SECURITY: В продакшене обязательно должен быть задан VITE_STORAGE_KEY
if (import.meta.env.PROD && (!STORAGE_KEY || STORAGE_KEY === 'dev-key-change-in-prod-build')) {
  throw new Error(
    '[Security] VITE_STORAGE_KEY must be set in production builds. ' +
    'Add it to your .env.production file or build environment variables.'
  );
}

// Фолбек для разработки
const STORAGE_KEY_FINAL = STORAGE_KEY || 'dev-key-change-in-prod-build';

// Префикс, чтобы ключи не пересекались с другими приложениями
const KEY_PREFIX = 'bt_app_';

// OPTIMIZATION: Simple in-memory cache for frequently accessed values
const storageCache = new Map<string, { value: string; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds

// Константы для чанкинга (8 записей * ~400 байт < 4096 байт)
const HISTORY_CHUNK_SIZE = 8;
const HISTORY_MAX_CHUNKS = 125; // Поддержка до 1000 записей (125 * 8 = 1000)
const HISTORY_META_SUFFIX = '__meta';
const HISTORY_UPDATED_EVENT = 'bt:history-updated';
const STORAGE_READONLY_EVENT = 'bt:storage-readonly';

const getKey = (key: string) => `${KEY_PREFIX}${key}`;
const getHistoryMetaKey = (baseKey: string) => `${baseKey}${HISTORY_META_SUFFIX}`;

type HistoryMeta = {
  chunks: number;
  total: number;
  updatedAt: string;
};

export const HISTORY_UPDATED_EVENT_NAME = HISTORY_UPDATED_EVENT;
export const STORAGE_READONLY_EVENT_NAME = STORAGE_READONLY_EVENT;

const CLOUD_RETRY_DELAYS = import.meta.env.MODE === 'test' ? [0] : [150, 400, 900];
const CLOUD_READONLY_TTL = import.meta.env.MODE === 'test' ? 50 : 5 * 60 * 1000;
let cloudReadonlyUntil = 0;
let cloudReadonlyNotifiedUntil = 0;

// History operations queue to prevent concurrent read-modify-write races
const historyQueue = new Map<string, Promise<unknown>>();

const enqueueHistoryOp = <T>(key: string, task: () => Promise<T>): Promise<T> => {
  const previous = historyQueue.get(key) ?? Promise.resolve();
  const next = previous.then(task, task);
  historyQueue.set(key, next.catch(() => {}));
  return next;
};

const notifyHistoryUpdated = (baseKey: string) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT, { detail: { key: baseKey } }));
};

const notifyStorageReadonly = (reason?: unknown) => {
  if (typeof window === 'undefined') return;
  const message = reason instanceof Error ? reason.message : String(reason ?? '');
  window.dispatchEvent(
    new CustomEvent(STORAGE_READONLY_EVENT, {
      detail: {
        until: cloudReadonlyUntil,
        reason: message
      }
    })
  );
};

// Проверка: доступны ли облачные функции (Telegram Environment)
const isCloudAvailable = () => {
  return typeof WebApp !== 'undefined' && 
         WebApp.CloudStorage && 
         WebApp.isVersionAtLeast('6.9');
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isCloudWriteDisabled = () => Date.now() < cloudReadonlyUntil;

const setCloudReadonly = (reason?: unknown) => {
  const until = Date.now() + CLOUD_READONLY_TTL;
  if (until > cloudReadonlyUntil) {
    cloudReadonlyUntil = until;
  }
  if (cloudReadonlyNotifiedUntil < cloudReadonlyUntil) {
    cloudReadonlyNotifiedUntil = cloudReadonlyUntil;
    notifyStorageReadonly(reason);
  }
};

const clearCloudReadonly = () => {
  cloudReadonlyUntil = 0;
  cloudReadonlyNotifiedUntil = 0;
};

const retryCloud = async <T>(operation: () => Promise<T>): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= CLOUD_RETRY_DELAYS.length; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const delay = CLOUD_RETRY_DELAYS[attempt];
      if (delay == null) break;
      if (delay > 0) {
        await sleep(delay);
      }
    }
  }
  throw lastError;
};

const cloudGetItem = (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.getItem(key, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value ?? null);
      }
    });
  });
};

const cloudSetItem = (key: string, value: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.setItem(key, value, (err, stored) => {
      if (err) {
        reject(err);
      } else {
        resolve(stored || false);
      }
    });
  });
};

const cloudRemoveItem = (key: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.removeItem(key, (err, deleted) => {
      if (err) {
        reject(err);
      } else {
        resolve(deleted || false);
      }
    });
  });
};

/**
 * Внутренняя функция шифрования
 */
const encrypt = (value: string): string | null => {
  try {
    return AES.encrypt(value, STORAGE_KEY_FINAL).toString();
  } catch (e) {
    console.error('Encryption error:', e);
    return null;
  }
};

/**
 * Внутренняя функция дешифровки
 */
const decrypt = (value: string): string | null => {
  if (!value) return null;
  try {
    const bytes = AES.decrypt(value, STORAGE_KEY_FINAL);
    const decryptedData = bytes.toString(encUtf8);

    if (!decryptedData && value.length > 0) {
      return value.startsWith('{') || value.startsWith('[') ? value : null;
    }
    return decryptedData;
  } catch {
    return value;
  }
};

const isHistoryRecord = (value: unknown): value is HistoryRecord => {
  if (!value || typeof value !== 'object') return false;
  const record = value as HistoryRecord;
  return (
    typeof record.id === 'string' &&
    (record.type === 'fasting' || record.type === 'breathing') &&
    typeof record.scheme === 'string' &&
    typeof record.startTime === 'string' &&
    typeof record.endTime === 'string' &&
    typeof record.durationSeconds === 'number' &&
    Number.isFinite(record.durationSeconds)
  );
};

const sanitizeHistoryList = <T>(list: T[]): T[] => {
  if (!list.length) return list;
  const filtered = (list as unknown[]).filter(isHistoryRecord) as T[];
  if (filtered.length !== list.length) {
    console.warn('[Storage] Dropped invalid history records during save');
  }
  return filtered;
};

// ================= API =================

/**
 * Асинхронное получение данных
 * OPTIMIZATION: Added caching for frequently accessed values
 */
export async function storageGet(key: string): Promise<string | null> {
  const namespacedKey = getKey(key);

  // OPTIMIZATION: Check cache first for frequently accessed values
  const cached = storageCache.get(namespacedKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }

  const readLocal = () => {
    try {
      return localStorage.getItem(namespacedKey) || '';
    } catch {
      return '';
    }
  };

  if (isCloudAvailable()) {
    try {
      const value = await retryCloud(() => cloudGetItem(namespacedKey));
      const decrypted = decrypt(value || '');
      if (decrypted) {
        storageCache.set(namespacedKey, { value: decrypted, timestamp: Date.now() });
      }
      return decrypted;
    } catch (e) {
      console.warn('[Cloud] Read failed, falling back to local', e);
    }
  }

  const decrypted = decrypt(readLocal());
  if (decrypted) {
    storageCache.set(namespacedKey, { value: decrypted, timestamp: Date.now() });
  }
  return decrypted;
}

/**
 * Асинхронное сохранение данных
 * OPTIMIZATION: Invalidate cache on set
 */
export async function storageSet(key: string, value: string): Promise<boolean> {
  const namespacedKey = getKey(key);
  const encrypted = encrypt(value);

  if (!encrypted) {
    console.warn('[Storage] Encryption failed, aborting write');
    return false;
  }

  // OPTIMIZATION: Update cache immediately
  storageCache.set(namespacedKey, { value, timestamp: Date.now() });

  let localOk = true;
  try {
    localStorage.setItem(namespacedKey, encrypted);
  } catch {
    localOk = false;
  }

  if (isCloudAvailable() && !isCloudWriteDisabled()) {
    try {
      const stored = await retryCloud(() => cloudSetItem(namespacedKey, encrypted));
      clearCloudReadonly();
      return localOk && stored;
    } catch (e) {
      console.error('[Cloud] Set Error:', e);
      setCloudReadonly(e);
      return localOk;
    }
  }

  return localOk;
}

/**
 * Асинхронное удаление
 * OPTIMIZATION: Invalidate cache on remove
 */
export async function storageRemove(key: string): Promise<boolean> {
  const namespacedKey = getKey(key);

  // OPTIMIZATION: Remove from cache
  storageCache.delete(namespacedKey);

  let localOk = true;
  try {
    localStorage.removeItem(namespacedKey);
  } catch {
    localOk = false;
  }
  
  if (isCloudAvailable() && !isCloudWriteDisabled()) {
    try {
      const deleted = await retryCloud(() => cloudRemoveItem(namespacedKey));
      clearCloudReadonly();
      return localOk && deleted;
    } catch (e) {
      console.error('[Cloud] Remove Error:', e);
      setCloudReadonly(e);
      return localOk;
    }
  }
  return localOk;
}

/**
 * Асинхронное получение JSON
 */
export async function storageGetJSON<T>(key: string, defaultValue: T): Promise<T> {
  const value = await storageGet(key);
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Асинхронное сохранение JSON
 */
export async function storageSetJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    const serialized = JSON.stringify(value);
    return await storageSet(key, serialized);
  } catch (e) {
    console.warn(`[Storage] JSON serialize error for "${key}":`, e);
    return false;
  }
}

// ================= NEW HISTORY API =================

/**
 * Чтение истории с поддержкой чанков и миграцией
 */
export async function storageGetHistory<T>(baseKey: string): Promise<T[]> {
  return enqueueHistoryOp(baseKey, () => getHistoryInternal<T>(baseKey));
}

async function getHistoryInternal<T>(baseKey: string): Promise<T[]> {
  // 1. Попытка миграции (если есть данные в старом ключе)
  const legacyData = await storageGetJSON<T[] | null>(baseKey, null);
  if (legacyData && Array.isArray(legacyData) && legacyData.length > 0) {
    console.log('[Storage] Migrating legacy history to chunks...');
    await saveHistoryInternal(baseKey, legacyData);
    await storageRemove(baseKey);
    return legacyData;
  }

  // 2. Чтение чанков
  const meta = await storageGetJSON<HistoryMeta | null>(getHistoryMetaKey(baseKey), null);
  if (!meta) {
    const recovered: T[] = [];

    for (let i = 0; i < HISTORY_MAX_CHUNKS; i++) {
      const chunk = await storageGetJSON<T[]>(`${baseKey}_${i}`, []);
      if (chunk.length > 0) {
        recovered.push(...chunk);
      }
    }

    if (recovered.length > 0) {
      await saveHistoryInternal(baseKey, recovered);
    } else {
      await storageSetJSON(getHistoryMetaKey(baseKey), {
        chunks: 0,
        total: 0,
        updatedAt: new Date().toISOString(),
      } satisfies HistoryMeta);
    }
    return recovered;
  }

  if (meta.chunks === 0) return [];
  const chunkCount = meta?.chunks && meta.chunks > 0
    ? Math.min(meta.chunks, HISTORY_MAX_CHUNKS)
    : HISTORY_MAX_CHUNKS;

  const chunks = await Promise.all(
    Array.from({ length: chunkCount }, (_, i) =>
      storageGetJSON<T[]>(`${baseKey}_${i}`, [])
    )
  );

  // 3. DATA SAFETY: Фильтрация null/undefined записей
  const allRecords = chunks.flat();
  return allRecords.filter((item): item is T => item != null);
}

/**
 * Сохранение истории в чанки
 * Строго соблюдает лимит HISTORY_MAX_CHUNKS
 */
export async function storageSaveHistory<T>(baseKey: string, list: T[]): Promise<boolean> {
  return enqueueHistoryOp(baseKey, () => saveHistoryInternal(baseKey, list));
}

async function saveHistoryInternal<T>(baseKey: string, list: T[]): Promise<boolean> {
  const metaKey = getHistoryMetaKey(baseKey);
  const meta = await storageGetJSON<HistoryMeta | null>(metaKey, null);
  const maxItems = HISTORY_MAX_CHUNKS * HISTORY_CHUNK_SIZE;

  list = sanitizeHistoryList(list);

  // Warn and truncate if list exceeds maximum
  if (list.length > maxItems) {
    console.warn(
      `[Storage] History list exceeds maximum capacity (${list.length} > ${maxItems}). ` +
      `Truncating to ${maxItems} items. Consider increasing HISTORY_MAX_CHUNKS.`
    );
    list = list.slice(0, maxItems);
  }

  let success = true;
  const chunkCount = Math.ceil(list.length / HISTORY_CHUNK_SIZE);
  const prevChunkCount = meta?.chunks ?? 0;
  const maxChunkIndex = Math.max(prevChunkCount, chunkCount);

  for (let i = 0; i < maxChunkIndex; i++) {
    const chunk = list.slice(i * HISTORY_CHUNK_SIZE, (i + 1) * HISTORY_CHUNK_SIZE);
    const key = `${baseKey}_${i}`;

    if (chunk.length > 0) {
      const res = await storageSetJSON(key, chunk);
      if (!res) success = false;
    } else {
      // Удаляем пустые ключи, чтобы не занимать квоту
      await storageRemove(key);
    }
  }

  if (list.length === 0) {
    await storageSetJSON(metaKey, {
      chunks: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    } satisfies HistoryMeta);
  } else {
    await storageSetJSON(metaKey, {
      chunks: Math.min(chunkCount, HISTORY_MAX_CHUNKS),
      total: list.length,
      updatedAt: new Date().toISOString(),
    } satisfies HistoryMeta);
  }
  notifyHistoryUpdated(baseKey);
  return success;
}

async function updateHistoryIncremental<T>(
  baseKey: string,
  newItem: T,
  maxItems: number
): Promise<T[]> {
  const metaKey = getHistoryMetaKey(baseKey);
  const meta = await storageGetJSON<HistoryMeta | null>(metaKey, null);
  const maxAllowed = Math.min(maxItems, HISTORY_MAX_CHUNKS * HISTORY_CHUNK_SIZE);
  const allowedChunks = Math.ceil(maxAllowed / HISTORY_CHUNK_SIZE);
  let carry: T | null = newItem;
  let index = 0;

  while (carry && index < allowedChunks) {
    const key = `${baseKey}_${index}`;
    const rawChunk = await storageGetJSON<T[]>(key, []);
    const chunk = sanitizeHistoryList(rawChunk);
    const next = [carry, ...chunk];

    if (next.length > HISTORY_CHUNK_SIZE) {
      carry = next.pop() as T;
    } else {
      carry = null;
    }

    // Drop overflow beyond max allowed
    if ((index + 1) * HISTORY_CHUNK_SIZE >= maxAllowed) {
      carry = null;
    }

    await storageSetJSON(key, next);
    index += 1;
  }

  const currentTotal = meta?.total ?? 0;
  const newTotal = Math.min(currentTotal + 1, maxAllowed);
  const newChunkCount = Math.min(Math.max(meta?.chunks ?? 0, index), allowedChunks);

  await storageSetJSON(metaKey, {
    chunks: newChunkCount,
    total: newTotal,
    updatedAt: new Date().toISOString(),
  } satisfies HistoryMeta);

  notifyHistoryUpdated(baseKey);
  return getHistoryInternal<T>(baseKey);
}

/**
 * Обновление истории (добавление в начало)
 */
export async function storageUpdateHistory<T>(
  key: string, 
  newItem: T, 
  maxItems: number = 1000
): Promise<T[]> {
  return enqueueHistoryOp(key, async () => {
    try {
      if (!isHistoryRecord(newItem)) {
        console.warn('[Storage] Ignoring invalid history record');
        return getHistoryInternal<T>(key);
      }
      return updateHistoryIncremental<T>(key, newItem, maxItems);
    } catch (e) {
      console.error(`[Storage] Failed to update history for "${key}"`, e);
      return [];
    }
  });
}
