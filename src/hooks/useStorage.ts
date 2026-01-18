// src/hooks/useStorage.ts
import { useState, useEffect, useCallback } from 'react';
import { storageGetJSON, storageSetJSON } from '../utils/storage';

export function useStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Загрузка данных при монтировании
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const value = await storageGetJSON<T>(key, initialValue);
        if (isMounted) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error(`[useStorage] Error loading key "${key}":`, error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [key]); // initialValue исключен из зависимостей, чтобы избежать циклов

  // 2. Сеттер (обновляет UI мгновенно + сохраняет в облако)
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Оптимистичное обновление (UI реагирует сразу)
        setStoredValue(valueToStore);
        
        // Асинхронная запись
        await storageSetJSON(key, valueToStore);
      } catch (error) {
        console.error(`[useStorage] Error saving key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return { value: storedValue, setValue, isLoading };
}
