// src/features/fasting/context/TimerContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';

import { FASTING_SCHEMES } from '../data/schemes';
import type { FastingScheme } from '../data/schemes';

import { 
    storageGet, 
    storageSet, 
    storageRemove, 
    storageUpdateHistory
} from '../../../utils/storage'; // 👈 NEW

import type { HistoryRecord } from '../../../utils/types';

interface TimerContextType {
    isFasting: boolean;
    scheme: FastingScheme;
    setSchemeId: (id: string) => void;
    progress: number;
    elapsedFormatted: string;
    elapsed: number;
    toggleFasting: () => void;
    startTime: string | null;
    setStartTime: (date: string | null) => void;
    isLoading: boolean; // 👈 NEW
}

const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    // Начальные состояния пустые или дефолтные
    const [schemeId, setSchemeIdState] = useState<string>(FASTING_SCHEMES[0].id);
    const [startTime, setStartTimeState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 👈 Индикатор загрузки
    
    const [elapsed, setElapsed] = useState(0);
    

    const scheme = FASTING_SCHEMES.find((s) => s.id === schemeId) || FASTING_SCHEMES[0];
    const goalSeconds = scheme.hours * 3600;

    // 1. Асинхронная Инициализация
    useEffect(() => {
        const init = async () => {
            try {
                // Загружаем схему
                const savedSchemeId = await storageGet('fasting_scheme');
                if (savedSchemeId && FASTING_SCHEMES.find(s => s.id === savedSchemeId)) {
                    setSchemeIdState(savedSchemeId);
                }

                // Загружаем время старта
                const savedStart = await storageGet('fasting_startTime');
                if (savedStart) {
                    setStartTimeState(savedStart);
                    
                    // Сразу пересчитываем фазу, чтобы не ждать useEffect таймера
                    const now = dayjs();
                    const diff = now.diff(dayjs(savedStart), 'second');
                    setElapsed(diff >= 0 ? diff : 0);
                    
                }
            } catch (e) {
                console.error("Timer init error:", e);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    // 2. Сеттер схемы
    const setSchemeId = useCallback((id: string) => {
        setSchemeIdState(id);
        storageSet('fasting_scheme', id); // fire & forget
    }, []);

    // 3. Сеттер времени
    const setStartTime = useCallback((date: string | null) => {
        setStartTimeState(date);
        if (date) {
            storageSet('fasting_startTime', date);
            const now = dayjs();
            const diff = now.diff(dayjs(date), 'second');
            setElapsed(diff >= 0 ? diff : 0);
        } else {
            storageRemove('fasting_startTime');
            setElapsed(0);
        }
    }, []);

    // 4. Таймер
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

        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    // 5. Переключатель (Старт/Стоп)
    const toggleFasting = useCallback(() => {
        if (startTime) {
            // STOP
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
            // START
            setStartTime(dayjs().toISOString());
        }
    }, [startTime, scheme.title, setStartTime]);

    const progress = Math.min((elapsed / goalSeconds) * 100, 100);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <TimerContext.Provider value={{
            isFasting: !!startTime,
            scheme,
            setSchemeId,
            progress,
            elapsedFormatted: formatTime(elapsed),
            elapsed,
            toggleFasting,
            startTime,
            setStartTime,
            isLoading // Экспортируем флаг загрузки
        }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useFastingTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useFastingTimerContext must be used within a TimerProvider');
    }
    return context;
};
