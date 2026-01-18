import WebApp from '@twa-dev/sdk';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

// Берем ключ из .env файла
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'dev-key-change-in-prod-build';

// Префикс, чтобы ключи не пересекались с другими приложениями
const KEY_PREFIX = 'bt_app_';

// Константы для чанкинга (8 записей * ~400 байт < 4096 байт)
const HISTORY_CHUNK_SIZE = 8;
const HISTORY_MAX_CHUNKS = 50; // Хватит на 400 записей

const getKey = (key: string) => `${KEY_PREFIX}${key}`;

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
    return AES.encrypt(value, STORAGE_KEY).toString();
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
    const bytes = AES.decrypt(value, STORAGE_KEY);
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
 */
export async function storageGet(key: string): Promise<string | null> {
  const namespacedKey = getKey(key);

  if (isCloudAvailable()) {
    try {
      return new Promise((resolve) => {
        WebApp.CloudStorage.getItem(namespacedKey, (err, value) => {
          if (err) {
            console.warn('[Cloud] Get Error, falling back to local:', err);
            resolve(decrypt(localStorage.getItem(namespacedKey) || ''));
          } else {
            resolve(decrypt(value || ''));
          }
        });
      });
    } catch (e) {
      console.warn('[Cloud] Read failed, falling back to local', e);
    }
  }

  return decrypt(localStorage.getItem(namespacedKey) || '');
}

/**
 * Асинхронное сохранение данных
 */
export async function storageSet(key: string, value: string): Promise<boolean> {
  const namespacedKey = getKey(key);
  const encrypted = encrypt(value);

  try {
    localStorage.setItem(namespacedKey, encrypted);
  } catch (e) { /* ignore quota */ }

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
 */
export async function storageRemove(key: string): Promise<boolean> {
  const namespacedKey = getKey(key);
  
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
  const chunks = await Promise.all(
    Array.from({ length: HISTORY_MAX_CHUNKS }, (_, i) => 
      storageGetJSON<T[]>(`${baseKey}_${i}`, [])
    )
  );

  return chunks.flat();
}

/**
 * Сохранение истории в чанки
 */
export async function storageSaveHistory<T>(baseKey: string, list: T[]): Promise<boolean> {
  let success = true;
  
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
