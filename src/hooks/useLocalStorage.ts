import { useState, useEffect, useCallback } from 'react';
import { safeLocalStorageGetJSON, safeLocalStorageSetJSON } from '../utils/localStorage';

/**
 * Хук для работы с localStorage с автоматической синхронизацией
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Инициализация состояния из localStorage или начального значения
  const [storedValue, setStoredValue] = useState<T>(() => {
    return safeLocalStorageGetJSON(key, initialValue);
  });

  // Обновление localStorage при изменении значения
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Поддержка функционального обновления
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        safeLocalStorageSetJSON(key, valueToStore);
      } catch (error) {
        console.error(`Ошибка сохранения в localStorage для ключа "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Синхронизация с изменениями в других вкладках
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Ошибка парсинга данных из storage event для ключа "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
