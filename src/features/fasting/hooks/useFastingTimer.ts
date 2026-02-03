// src/features/fasting/hooks/useFastingTimer.ts
// Если этот хук используется отдельно от TimerProvider, его нужно переписать так:
import { useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import { FASTING_SCHEMES } from '../data/schemes';
import { FASTING_PHASES } from '../data/stages';
import { 
  storageGet, 
  storageSet, 
  storageRemove, 
  storageUpdateHistory 
} from '../../../utils/storage'; // 👈 NEW
import type { HistoryRecord } from '../../../utils/types';

export const useFastingTimer = () => {
  const [schemeId, setSchemeId] = useState(FASTING_SCHEMES[0].id);
  const [startTime, setStartTimeState] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const lastPhaseIndexRef = useRef<number>(-1);

  const scheme = FASTING_SCHEMES.find(s => s.id === schemeId) || FASTING_SCHEMES[0];
  const goalSeconds = scheme.hours * 3600;

  // Инициализация
  useEffect(() => {
      const init = async () => {
          const sId = await storageGet('fasting_scheme');
          if(sId) setSchemeId(sId);

          const sTime = await storageGet('fasting_startTime');
          if(sTime) {
              setStartTimeState(sTime);
              const start = dayjs(sTime);
              const diff = dayjs().diff(start, 'hour');
              lastPhaseIndexRef.current = FASTING_PHASES.findIndex(p => diff >= p.hoursStart);
          }
      };
      init();
  }, []);

  const setStartTime = useCallback((date: string | null) => {
    setStartTimeState(date);
    if (date) {
      storageSet('fasting_startTime', date);
      // ... logic
    } else {
      storageRemove('fasting_startTime');
      // ... logic
    }
  }, []);

  // Сохранение схемы
  useEffect(() => {
     if (schemeId) storageSet('fasting_scheme', schemeId);
  }, [schemeId]);

  // Основной цикл такой же, но settings читаем асинхронно
  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }
    
    const update = () => {
        const start = dayjs(startTime);
        const now = dayjs();
        const diff = now.diff(start, 'second');
        const safeDiff = diff >= 0 ? diff : 0;
        setElapsed(safeDiff);

        if (safeDiff % 60 === 0) { 
            const currentHours = safeDiff / 3600;
            const newPhaseIndex = FASTING_PHASES.findIndex(p => currentHours >= p.hoursStart && (!p.hoursEnd || currentHours < p.hoursEnd));
            if (newPhaseIndex !== -1) {
                lastPhaseIndexRef.current = newPhaseIndex;
            }
        }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const toggleFasting = useCallback(() => {
    if (startTime) {
        const now = dayjs();
        const start = dayjs(startTime);
        const duration = now.diff(start, 'second');
        
        if (duration > 60) {
            const record: HistoryRecord = {
                id: Date.now().toString(),
                type: 'fasting',
                scheme: scheme.title,
                startTime: startTime,
                endTime: now.toISOString(),
                durationSeconds: duration
            };
            storageUpdateHistory('history_fasting', record);
        }
        setStartTime(null);
    } else {
        const nowStr = dayjs().toISOString();
        setStartTime(nowStr);
        lastPhaseIndexRef.current = 0;
    }
  }, [startTime, scheme.title, setStartTime]);

  const progress = Math.min((elapsed / goalSeconds) * 100, 100);
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    isFasting: !!startTime,
    scheme,
    setSchemeId,
    progress,
    elapsedFormatted: formatTime(elapsed),
    elapsed,
    toggleFasting,
    startTime,
    setStartTime
  };
};
