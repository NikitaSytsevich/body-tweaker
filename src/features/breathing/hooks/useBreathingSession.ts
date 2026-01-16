import { useState, useEffect, useRef, useCallback } from 'react';
import type { BreathLevel } from '../data/patterns';
import dayjs from 'dayjs';
import { soundManager } from '../../../utils/sounds';
import { safeLocalStorageGetJSON, safeLocalStorageSetJSON } from '../../../utils/localStorage';
import type { HistoryRecord } from '../../../utils/types';

// Константы
const MIN_SESSION_DURATION_SECONDS = 15;
const TIMER_INTERVAL_MS = 250;
const MAX_HISTORY_ITEMS = 1000; // Ограничение размера истории

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

  const stopEngine = useCallback(() => {
    if (state.current.timerId) {
      clearInterval(state.current.timerId);
      state.current.timerId = null;
    }
  }, []);

  // --- ACTIONS ---

  const saveToHistory = useCallback((endTimeStr: string, durationSec: number) => {
    if (durationSec < MIN_SESSION_DURATION_SECONDS) return; 

    try {
      const record: HistoryRecord = {
        id: Date.now().toString(),
        type: 'breathing',
        scheme: `Уровень ${level.id} (${level.inhale}-${level.hold}-${level.exhale})`,
        startTime: dayjs(state.current.startTime || Date.now()).toISOString(),
        endTime: endTimeStr,
        durationSeconds: durationSec
      };

      const history = safeLocalStorageGetJSON<HistoryRecord[]>('history_fasting', []);
      
      // ИСПРАВЛЕНИЕ: Добавляем .slice(0, MAX_HISTORY_ITEMS)
      const newHistory = [record, ...history].slice(0, MAX_HISTORY_ITEMS);
      
      safeLocalStorageSetJSON('history_fasting', newHistory);
    } catch (error) {
      console.error('Failed to save session', error);
    }
  }, [level]);

  const finishSession = useCallback(() => {
    stopEngine();
    
    soundManager.playFinish(); 
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    if (state.current.startTime) {
      const now = Date.now();
      const duration = Math.floor((now - state.current.startTime) / 1000);
      saveToHistory(dayjs(now).toISOString(), duration);
    }

    setPhase('finished');
    state.current.status = 'finished';
  }, [stopEngine, saveToHistory]);

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
  }, [nextPhase, finishSession]);

  const stopSession = useCallback(() => {
    if (state.current.startTime && state.current.status !== 'idle' && state.current.status !== 'finished') {
      const now = Date.now();
      const duration = Math.floor((now - state.current.startTime) / 1000);
      saveToHistory(dayjs(now).toISOString(), duration);
    }

    stopEngine();
    soundManager.stopSession(); 
    
    state.current.status = 'idle';
    setPhase('idle');
  }, [stopEngine, saveToHistory]);

  const startSession = useCallback(() => {
    stopEngine();
    soundManager.unlock();
    soundManager.startSession(); 
    soundManager.playInhale();   

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

    state.current.timerId = window.setInterval(tick, TIMER_INTERVAL_MS);
  }, [level, sessionDurationMinutes, tick, stopEngine]);

  useEffect(() => {
    return () => {
      // Сохранение при уходе со страницы
      if (state.current.status !== 'idle' && state.current.status !== 'finished') {
        const now = Date.now();
        const start = state.current.startTime || now;
        const duration = Math.floor((now - start) / 1000);
        
        if (duration > MIN_SESSION_DURATION_SECONDS) {
             try {
                const rec: HistoryRecord = {
                    id: Date.now().toString(),
                    type: 'breathing',
                    scheme: `Уровень ${level.id}`, 
                    startTime: dayjs(start).toISOString(),
                    endTime: dayjs(now).toISOString(),
                    durationSeconds: duration
                };
                const h = safeLocalStorageGetJSON<HistoryRecord[]>('history_fasting', []);
                
                // ИСПРАВЛЕНИЕ: Добавляем .slice(0, MAX_HISTORY_ITEMS) и здесь тоже
                const newHistory = [rec, ...h].slice(0, MAX_HISTORY_ITEMS);
                
                safeLocalStorageSetJSON('history_fasting', newHistory);
             } catch(e) {
                console.error('Failed to save session on unmount', e);
             }
        }
      }
      stopEngine();
      soundManager.stopAll(); 
    };
  }, [level, stopEngine]); 

  return { 
    phase, 
    phaseTimeLeft, 
    totalTimeLeft, 
    startSession, 
    stopSession, 
    cycles 
  };
};
