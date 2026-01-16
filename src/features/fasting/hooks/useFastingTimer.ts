import { useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import { FASTING_SCHEMES } from '../data/schemes';
import { FASTING_PHASES } from '../data/stages';
import { 
  safeLocalStorageGet, 
  safeLocalStorageSet, 
  safeLocalStorageRemove, 
  safeLocalStorageGetJSON,
  safeLocalStorageUpdateHistory // 👈 Новая функция
} from '../../../utils/localStorage';
import type { NotificationSettings, HistoryRecord } from '../../../utils/types';

export const useFastingTimer = () => {
  // 1. Инициализация (Ленивая)
  const [schemeId, setSchemeId] = useState(() => {
    const saved = safeLocalStorageGet('fasting_scheme');
    // Проверяем, существует ли такой ID (вдруг удалили схему из конфига)
    const exists = FASTING_SCHEMES.find(s => s.id === saved);
    return exists ? saved : FASTING_SCHEMES[0].id;
  });

  const [startTime, setStartTimeState] = useState<string | null>(() => safeLocalStorageGet('fasting_startTime'));
  const [elapsed, setElapsed] = useState(0);
  
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);
  const lastPhaseIndexRef = useRef<number>(-1);

  const scheme = FASTING_SCHEMES.find(s => s.id === schemeId) || FASTING_SCHEMES[0];
  const goalSeconds = scheme.hours * 3600;

  // 2. Умный сеттер времени
  const setStartTime = useCallback((date: string | null) => {
    setStartTimeState(date);
    
    if (date) {
      safeLocalStorageSet('fasting_startTime', date);
      const now = dayjs();
      const diff = now.diff(dayjs(date), 'second');
      setElapsed(diff >= 0 ? diff : 0);
      
      const currentHours = now.diff(dayjs(date), 'hour');
      const currentPhase = FASTING_PHASES.findIndex(p => currentHours >= p.hoursStart);
      lastPhaseIndexRef.current = currentPhase;
    } else {
      safeLocalStorageRemove('fasting_startTime');
      setElapsed(0);
      lastPhaseIndexRef.current = -1;
    }
  }, []);

  // 3. Сохранение схемы при изменении
  useEffect(() => {
    if (schemeId) {
      safeLocalStorageSet('fasting_scheme', schemeId);
    }
  }, [schemeId]);

  // 4. Основной цикл таймера
  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }
    
    const update = () => {
        const start = dayjs(startTime);
        const now = dayjs();
        const diff = now.diff(start, 'second');
        
        // Защита от отрицательного времени (если системное время перевели назад)
        const safeDiff = diff >= 0 ? diff : 0;
        setElapsed(safeDiff);

        // Проверка смены фазы (только если прошло достаточно времени)
        if (safeDiff % 60 === 0) { // Проверяем фазы только раз в минуту, экономим ресурсы
            const currentHours = safeDiff / 3600;
            const newPhaseIndex = FASTING_PHASES.findIndex(p => currentHours >= p.hoursStart && (!p.hoursEnd || currentHours < p.hoursEnd));
            
            if (newPhaseIndex !== -1 && newPhaseIndex !== lastPhaseIndexRef.current) {
                if (lastPhaseIndexRef.current !== -1) {
                    const settings = safeLocalStorageGetJSON<NotificationSettings>('user_settings', { fasting: true });
                    if (settings.fasting !== false) {
                        const phase = FASTING_PHASES[newPhaseIndex];
                        setNotification({
                            title: `Новый этап: ${phase.title}`,
                            message: phase.subtitle
                        });
                        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                    }
                }
                lastPhaseIndexRef.current = newPhaseIndex;
            }
        }
    };

    // Инициализация индекса фазы при маунте
    if (lastPhaseIndexRef.current === -1) {
        const start = dayjs(startTime);
        const currentHours = dayjs().diff(start, 'hour', true);
        lastPhaseIndexRef.current = FASTING_PHASES.findIndex(p => currentHours >= p.hoursStart);
    }

    // Запускаем сразу, чтобы не ждать 1 секунду до первого обновления
    update();
    
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // 5. Логика переключения (Старт / Стоп)
  const toggleFasting = useCallback(() => {
    if (startTime) {
        // --- СТОП ---
        const now = dayjs();
        const start = dayjs(startTime);
        const duration = now.diff(start, 'second');
        
        // Сохраняем, только если голодание длилось больше 1 минуты (защита от мискликов)
        if (duration > 60) {
            const record: HistoryRecord = {
                id: Date.now().toString(),
                type: 'fasting',
                scheme: scheme.title,
                startTime: startTime,
                endTime: now.toISOString(),
                durationSeconds: duration
            };

            // Используем новую безопасную утилиту
            safeLocalStorageUpdateHistory('history_fasting', record);
        }

        setStartTime(null);
    } else {
        // --- СТАРТ ---
        const nowStr = dayjs().toISOString();
        setStartTime(nowStr);
        lastPhaseIndexRef.current = 0;
    }
  }, [startTime, scheme.title, setStartTime]);

  const progress = Math.min((elapsed / goalSeconds) * 100, 100);

  // Форматирование вынесено в хук для удобства
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
    setStartTime,
    notification,
    closeNotification: useCallback(() => setNotification(null), [])
  };
};
