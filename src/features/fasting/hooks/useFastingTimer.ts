import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { FASTING_SCHEMES } from '../data/schemes';
import { FASTING_PHASES } from '../data/stages';

export const useFastingTimer = () => {
  const [schemeId, setSchemeId] = useState(() => {
    const saved = localStorage.getItem('fasting_scheme');
    const exists = FASTING_SCHEMES.find(s => s.id === saved);
    return exists ? saved : FASTING_SCHEMES[0].id;
  });

  const [startTime, setStartTimeState] = useState<string | null>(() => localStorage.getItem('fasting_startTime'));
  const [elapsed, setElapsed] = useState(0);
  
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);
  const lastPhaseIndexRef = useRef<number>(-1);

  const scheme = FASTING_SCHEMES.find(s => s.id === schemeId) || FASTING_SCHEMES[0];
  const goalSeconds = scheme.hours * 3600;

  const setStartTime = (date: string | null) => {
    setStartTimeState(date);
    if (date) {
      localStorage.setItem('fasting_startTime', date);
      const now = dayjs();
      setElapsed(now.diff(dayjs(date), 'second'));
      
      const currentHours = now.diff(dayjs(date), 'hour');
      const currentPhase = FASTING_PHASES.findIndex(p => currentHours >= p.hoursStart);
      lastPhaseIndexRef.current = currentPhase;
    } else {
      localStorage.removeItem('fasting_startTime');
      setElapsed(0);
      lastPhaseIndexRef.current = -1;
    }
  };

  useEffect(() => {
    if (schemeId) localStorage.setItem('fasting_scheme', schemeId);
  }, [schemeId]);

  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }
    
    const update = () => {
        const start = dayjs(startTime);
        const now = dayjs();
        const diff = now.diff(start, 'second');
        setElapsed(diff);

        const currentHours = diff / 3600;
        const newPhaseIndex = FASTING_PHASES.findIndex(p => currentHours >= p.hoursStart && (!p.hoursEnd || currentHours < p.hoursEnd));
        
        if (newPhaseIndex !== -1 && newPhaseIndex !== lastPhaseIndexRef.current) {
            if (lastPhaseIndexRef.current !== -1) {
                // 👇 ПРОВЕРКА НАСТРОЕК
                const settings = JSON.parse(localStorage.getItem('user_settings') || '{}');
                // Если настройки нет - считаем true. Если есть и false - не показываем.
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
    };

    if (lastPhaseIndexRef.current === -1) {
        const start = dayjs(startTime);
        const currentHours = dayjs().diff(start, 'hour', true);
        lastPhaseIndexRef.current = FASTING_PHASES.findIndex(p => currentHours >= p.hoursStart);
    }

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const toggleFasting = () => {
    if (startTime) setStartTime(null);
    else {
        setStartTime(dayjs().toISOString());
        lastPhaseIndexRef.current = 0;
    }
  };

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
    setStartTime,
    notification,
    closeNotification: () => setNotification(null)
  };
};
