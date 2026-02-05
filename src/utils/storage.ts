import WebApp from '@twa-dev/sdk';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

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

const getKey = (key: string) => `${KEY_PREFIX}${key}`;
const getHistoryMetaKey = (baseKey: string) => `${baseKey}${HISTORY_META_SUFFIX}`;

type HistoryMeta = {
  chunks: number;
  total: number;
  updatedAt: string;
};

export const HISTORY_UPDATED_EVENT_NAME = HISTORY_UPDATED_EVENT;

const notifyHistoryUpdated = (baseKey: string) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT, { detail: { key: baseKey } }));
};

// Проверка: доступны ли облачные функции (Telegram Environment)
const isCloudAvailable = () => {
  return typeof WebApp !== 'undefined' && 
         WebApp.CloudStorage && 
         WebApp.isVersionAtLeast('6.9');
};

/**
 * Внутренняя функция шифрования
 */
const encrypt = (value: string): string => {
  try {
    return AES.encrypt(value, STORAGE_KEY_FINAL).toString();
  } catch (e) {
    console.error('Encryption error:', e);
    return value;
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

  if (isCloudAvailable()) {
    try {
      return new Promise((resolve) => {
        WebApp.CloudStorage.getItem(namespacedKey, (err, value) => {
          if (err) {
            console.warn('[Cloud] Get Error, falling back to local:', err);
            const decrypted = decrypt(localStorage.getItem(namespacedKey) || '');
            if (decrypted) {
              storageCache.set(namespacedKey, { value: decrypted, timestamp: Date.now() });
            }
            resolve(decrypted);
          } else {
            const decrypted = decrypt(value || '');
            if (decrypted) {
              storageCache.set(namespacedKey, { value: decrypted, timestamp: Date.now() });
            }
            resolve(decrypted);
          }
        });
      });
    } catch (e) {
      console.warn('[Cloud] Read failed, falling back to local', e);
    }
  }

  const decrypted = decrypt(localStorage.getItem(namespacedKey) || '');
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

  // OPTIMIZATION: Update cache immediately
  storageCache.set(namespacedKey, { value, timestamp: Date.now() });

  try {
    localStorage.setItem(namespacedKey, encrypted);
  } catch { /* ignore quota errors */ }

  if (isCloudAvailable()) {
    return new Promise((resolve) => {
      WebApp.CloudStorage.setItem(namespacedKey, encrypted, (err, stored) => {
        if (err) {
            console.error('[Cloud] Set Error:', err);
            resolve(false);
        } else {
            resolve(stored || false);
        }
      });
    });
  }

  return true;
}

/**
 * Асинхронное удаление
 * OPTIMIZATION: Invalidate cache on remove
 */
export async function storageRemove(key: string): Promise<boolean> {
  const namespacedKey = getKey(key);

  // OPTIMIZATION: Remove from cache
  storageCache.delete(namespacedKey);

  try {
    localStorage.removeItem(namespacedKey);
  } catch { /* ignore */ }
  
  if (isCloudAvailable()) {
    return new Promise((resolve) => {
      WebApp.CloudStorage.removeItem(namespacedKey, (err, deleted) => {
         resolve(!err && (deleted || false));
      });
    });
  }
  return true;
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
  // 1. Попытка миграции (если есть данные в старом ключе)
  const legacyData = await storageGetJSON<T[] | null>(baseKey, null);
  if (legacyData && Array.isArray(legacyData) && legacyData.length > 0) {
    console.log('[Storage] Migrating legacy history to chunks...');
    await storageSaveHistory(baseKey, legacyData);
    await storageRemove(baseKey);
    return legacyData;
  }

  // 2. Чтение чанков
  const meta = await storageGetJSON<HistoryMeta | null>(getHistoryMetaKey(baseKey), null);
  if (meta && meta.chunks === 0) return [];
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
  const maxItems = HISTORY_MAX_CHUNKS * HISTORY_CHUNK_SIZE;

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

  for (let i = 0; i < HISTORY_MAX_CHUNKS; i++) {
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

  const metaKey = getHistoryMetaKey(baseKey);
  if (list.length === 0) {
    await storageRemove(metaKey);
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

/**
 * Обновление истории (добавление в начало)
 */
export async function storageUpdateHistory<T>(
  key: string, 
  newItem: T, 
  maxItems: number = 1000
): Promise<T[]> {
  try {
    const currentList = await storageGetHistory<T>(key);
    // Добавляем в начало и обрезаем
    const newList = [newItem, ...currentList].slice(0, maxItems);
    await storageSaveHistory(key, newList);
    return newList;
  } catch (e) {
    console.error(`[Storage] Failed to update history for "${key}"`, e);
    return [];
  }
}
