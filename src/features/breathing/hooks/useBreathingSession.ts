import { useState, useEffect, useRef, useCallback } from 'react';
import type { BreathLevel } from '../data/patterns';
import dayjs from 'dayjs';
import { soundManager } from '../../../utils/sounds';

export type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'finished';

export const useBreathingSession = (level: BreathLevel, sessionDurationMinutes: number) => {
  // --- STATE (UI) ---
  const [phase, setPhase] = useState<Phase>('idle');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  // --- REFS (MUTABLE LOGIC) ---
  const state = useRef({
    status: 'idle' as Phase,
    startTime: null as number | null,     
    phaseEndTime: 0,                      
    sessionEndTime: 0,                    
    isInfinite: false,
    timerId: null as number | null
  });

  // --- ENGINE ---
  
  const nextPhase = useCallback(() => {
    const current = state.current.status;
    let next: Phase = 'idle';
    let duration = 0;

    if (current === 'inhale') {
      next = 'hold';
      duration = level.hold;
      soundManager.playHold();
    } else if (current === 'hold') {
      next = 'exhale';
      duration = level.exhale;
      soundManager.playExhale();
    } else if (current === 'exhale') {
      next = 'inhale';
      duration = level.inhale;
      setCycles(c => c + 1);
      soundManager.playInhale();
    }

    const now = Date.now();
    state.current.status = next;
    state.current.phaseEndTime = now + (duration * 1000); 
    
    setPhase(next);
    setPhaseTimeLeft(duration);
    
    if (navigator.vibrate) navigator.vibrate(50);
  }, [level]);

  const tick = useCallback(() => {
    const now = Date.now();
    const s = state.current;

    // 1. Проверка завершения всей сессии
    if (!s.isInfinite && s.sessionEndTime > 0) {
      const remaining = Math.ceil((s.sessionEndTime - now) / 1000);
      
      if (remaining <= 0) {
        finishSession();
        return;
      }
      setTotalTimeLeft(remaining);
    }

    // 2. Проверка фазы
    const phaseRemaining = Math.ceil((s.phaseEndTime - now) / 1000);

    if (phaseRemaining <= 0) {
      nextPhase();
    } else {
      setPhaseTimeLeft(phaseRemaining);
    }
  }, [nextPhase]);

  // --- ACTIONS ---

  const saveToHistory = useCallback((endTimeStr: string, durationSec: number) => {
    if (durationSec < 15) return; 

    try {
      const record = {
        id: Date.now().toString(),
        type: 'breathing',
        scheme: `Уровень ${level.id} (${level.inhale}-${level.hold}-${level.exhale})`,
        startTime: dayjs(state.current.startTime).toISOString(),
        endTime: endTimeStr,
        durationSeconds: durationSec
      };

      const history = JSON.parse(localStorage.getItem('history_fasting') || '[]');
      localStorage.setItem('history_fasting', JSON.stringify([record, ...history]));
    } catch (error) {
      console.error('Failed to save session', error);
    }
  }, [level]);

  const finishSession = () => {
    stopEngine();
    
    soundManager.playFinish(); // Победный звук + остановка музыки
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    if (state.current.startTime) {
      const now = Date.now();
      const duration = Math.floor((now - state.current.startTime) / 1000);
      saveToHistory(dayjs(now).toISOString(), duration);
    }

    setPhase('finished');
    state.current.status = 'finished';
  };

  const stopEngine = () => {
    if (state.current.timerId) {
      clearInterval(state.current.timerId);
      state.current.timerId = null;
    }
    // Здесь мы НЕ останавливаем музыку полностью, 
    // это делает soundManager.stopSession() внутри stopSession()
  };

  const stopSession = () => {
    if (state.current.startTime && state.current.status !== 'idle' && state.current.status !== 'finished') {
      const now = Date.now();
      const duration = Math.floor((now - state.current.startTime) / 1000);
      saveToHistory(dayjs(now).toISOString(), duration);
    }

    stopEngine();
    soundManager.stopSession(); // Останавливаем музыку и фон
    
    state.current.status = 'idle';
    setPhase('idle');
  };

  const startSession = () => {
    stopEngine();
    
    // Инициализация звука (Новый API)
    soundManager.unlock();
    soundManager.startSession(); // Запуск фона
    soundManager.playInhale();   // Первый колокольчик

    const now = Date.now();
    state.current.startTime = now;
    state.current.status = 'inhale';
    state.current.phaseEndTime = now + (level.inhale * 1000);
    state.current.isInfinite = sessionDurationMinutes === 0;
    
    if (sessionDurationMinutes > 0) {
      state.current.sessionEndTime = now + (sessionDurationMinutes * 60 * 1000);
      setTotalTimeLeft(sessionDurationMinutes * 60);
    } else {
      state.current.sessionEndTime = 0;
      setTotalTimeLeft(0);
    }

    setPhase('inhale');
    setPhaseTimeLeft(level.inhale);
    setCycles(0);

    state.current.timerId = window.setInterval(tick, 100);
  };

  useEffect(() => {
    return () => {
      // Сохранение при уходе со страницы
      if (state.current.status !== 'idle' && state.current.status !== 'finished') {
        const now = Date.now();
        const start = state.current.startTime || now;
        const duration = Math.floor((now - start) / 1000);
        
        if (duration > 15) {
             try {
                const rec = {
                    id: Date.now().toString(),
                    type: 'breathing',
                    scheme: `Уровень ${level.id}`, // Упрощенное название для быстрого сохранения
                    startTime: dayjs(start).toISOString(),
                    endTime: dayjs(now).toISOString(),
                    durationSeconds: duration
                };
                const h = JSON.parse(localStorage.getItem('history_fasting') || '[]');
                localStorage.setItem('history_fasting', JSON.stringify([rec, ...h]));
             } catch(e) {}
        }
      }
      stopEngine();
      soundManager.stopAll(); // Полная тишина при размонтировании
    };
  }, []);

  return { 
    phase, 
    phaseTimeLeft, 
    totalTimeLeft, 
    startSession, 
    stopSession, 
    cycles 
  };
};
