import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

/**
 * Безопасная работа с localStorage + Шифрование (AES)
 * Исправлено: Ключ вынесен в env, добавлена утилита для атомарного обновления списков.
 */

// Берем ключ из .env файла (нужно создать .env в корне и добавить VITE_STORAGE_KEY=твои_символы)
// Если ключа нет, используем фоллбэк (только для dev-режима)
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'dev-key-change-in-prod-build';

// Префикс, чтобы ключи не пересекались с другими приложениями на localhost
const KEY_PREFIX = 'bt_app_';

const getKey = (key: string) => `${KEY_PREFIX}${key}`;

/**
 * Получение и расшифровка значения
 */
export function safeLocalStorageGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const namespacedKey = getKey(key);
  try {
    const item = localStorage.getItem(namespacedKey);
    if (!item) return null;

    // 1. Пробуем расшифровать
    try {
      const bytes = AES.decrypt(item, STORAGE_KEY);
      const decryptedData = bytes.toString(encUtf8);
      
      // Если расшифровка вернула пустую строку, но исходник не пуст - 
      // возможно, данные не зашифрованы (миграция) или ключ не подошел.
      if (!decryptedData && item.length > 0) {
        // Пробуем вернуть как есть (для обратной совместимости)
        return item.startsWith('{') || item.startsWith('[') ? item : null;
      }
      return decryptedData;
    } catch {
      // 2. Если упала ошибка (Malformed UTF-8), возвращаем "как есть"
      return item;
    }
  } catch (e) {
    console.warn(`[Storage] Read error for "${key}":`, e);
    return null;
  }
}

/**
 * Шифрование и запись значения
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;

  const namespacedKey = getKey(key);
  try {
    const encrypted = AES.encrypt(value, STORAGE_KEY).toString();
    localStorage.setItem(namespacedKey, encrypted);
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.error('[Storage] Quota exceeded!');
      // Здесь можно добавить логику очистки старых логов, если нужно
    } else {
      console.warn(`[Storage] Write error for "${key}":`, e);
    }
    return false;
  }
}

/**
 * Удаление ключа
 */
export function safeLocalStorageRemove(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(getKey(key));
    return true;
  } catch {
    return false;
  }
}

/**
 * Полная очистка (удаляет только ключи этого приложения)
 */
export function safeLocalStorageClear(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Удаляем только свои ключи, чтобы не задеть другие приложения на домене
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(KEY_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    return true;
  } catch (e) {
    console.warn('[Storage] Clear error:', e);
    return false;
  }
}

/**
 * Получение и парсинг JSON
 */
export function safeLocalStorageGetJSON<T>(key: string, defaultValue: T): T {
  const value = safeLocalStorageGet(key);
  if (!value) return defaultValue;
  
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn(`[Storage] JSON parse error for "${key}":`, e);
    return defaultValue;
  }
}

/**
 * Сериализация и запись JSON
 */
export function safeLocalStorageSetJSON<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    return safeLocalStorageSet(key, serialized);
  } catch (e) {
    console.warn(`[Storage] JSON serialize error for "${key}":`, e);
    return false;
  }
}

/**
 * 🔥 NEW: Атомарное обновление списков (Истории)
 * Читает, добавляет в начало, обрезает лишнее, сохраняет.
 */
export function safeLocalStorageUpdateHistory<T>(
  key: string, 
  newItem: T, 
  maxItems: number = 1000
): T[] {
  try {
    const currentList = safeLocalStorageGetJSON<T[]>(key, []);
    const newList = [newItem, ...currentList].slice(0, maxItems);
    safeLocalStorageSetJSON(key, newList);
    return newList;
  } catch (e) {
    console.error(`[Storage] Failed to update history for "${key}"`, e);
    return [];
  }
}

/**
 * Проверка доступности хранилища
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
