import WebApp from '@twa-dev/sdk';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

// Берем ключ из .env файла
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'dev-key-change-in-prod-build';

// Префикс, чтобы ключи не пересекались с другими приложениями
const KEY_PREFIX = 'bt_app_';

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
    
    // Если расшифровка вернула пустую строку, но исходник не пуст - 
    // возможно, данные не зашифрованы (миграция)
    if (!decryptedData && value.length > 0) {
      return value.startsWith('{') || value.startsWith('[') ? value : null;
    }
    return decryptedData;
  } catch {
    // Если упала ошибка (Malformed UTF-8), возвращаем "как есть"
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
      // Исправление 1: Убран 'reject', так как мы всегда делаем resolve (даже при ошибке фоллбэчимся)
      return new Promise((resolve) => {
        WebApp.CloudStorage.getItem(namespacedKey, (err, value) => {
          if (err) {
            console.warn('[Cloud] Get Error, falling back to local:', err);
            // Пробуем фоллбэк на локальное, если облако сбоит
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

  // Fallback to localStorage (Dev mode or Cloud unavailable)
  return decrypt(localStorage.getItem(namespacedKey) || '');
}

/**
 * Асинхронное сохранение данных
 */
export async function storageSet(key: string, value: string): Promise<boolean> {
  const namespacedKey = getKey(key);
  const encrypted = encrypt(value);

  // Всегда пишем и в локалку (для кэша/скорости)
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
            // Исправление 2: Гарантируем boolean, так как stored может быть undefined в типах SDK
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
         // Исправление 3: Гарантируем boolean
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

/**
 * Асинхронное обновление истории (Безопасное добавление в начало списка)
 */
export async function storageUpdateHistory<T>(
  key: string, 
  newItem: T, 
  maxItems: number = 1000
): Promise<T[]> {
  try {
    const currentList = await storageGetJSON<T[]>(key, []);
    // Добавляем в начало и обрезаем
    const newList = [newItem, ...currentList].slice(0, maxItems);
    await storageSetJSON(key, newList);
    return newList;
  } catch (e) {
    console.error(`[Storage] Failed to update history for "${key}"`, e);
    return [];
  }
}
