import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';

import { FASTING_SCHEMES } from '../data/schemes';
import type { FastingScheme } from '../data/schemes';

import { FASTING_PHASES } from '../data/stages';
import type { FastingStage } from '../data/stages';

import { 
    safeLocalStorageGet, 
    safeLocalStorageSet, 
    safeLocalStorageRemove, 
    safeLocalStorageGetJSON,
    safeLocalStorageUpdateHistory
} from '../../../utils/localStorage';
import type { NotificationSettings, HistoryRecord } from '../../../utils/types';

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
    // 👇 Обновили тип уведомления: добавили phaseId
    notification: {title: string, message: string, phaseId?: number} | null;
    closeNotification: () => void;
    // 👇 Новое состояние для навигации к фазе
    phaseToOpen: number | null;
    setPhaseToOpen: (id: number | null) => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const [schemeId, setSchemeIdState] = useState<string>(() => {
        const saved = safeLocalStorageGet('fasting_scheme');
        const exists = FASTING_SCHEMES.find((s: FastingScheme) => s.id === saved);
        return exists ? saved! : FASTING_SCHEMES[0].id;
    });

    const [startTime, setStartTimeState] = useState<string | null>(() => safeLocalStorageGet('fasting_startTime'));
    const [elapsed, setElapsed] = useState(0);
    // 👇 Добавил phaseId в тип стейта
    const [notification, setNotification] = useState<{title: string, message: string, phaseId?: number} | null>(null);
    // 👇 Стейт для диплинка
    const [phaseToOpen, setPhaseToOpen] = useState<number | null>(null);
    
    const lastPhaseIndexRef = useRef<number>(-1);

    const scheme = FASTING_SCHEMES.find((s: FastingScheme) => s.id === schemeId) || FASTING_SCHEMES[0];
    const goalSeconds = scheme.hours * 3600;

    const setSchemeId = useCallback((id: string) => {
        setSchemeIdState(id);
        safeLocalStorageSet('fasting_scheme', id);
    }, []);

    const setStartTime = useCallback((date: string | null) => {
        setStartTimeState(date);
        if (date) {
            safeLocalStorageSet('fasting_startTime', date);
            const now = dayjs();
            const diff = now.diff(dayjs(date), 'second');
            setElapsed(diff >= 0 ? diff : 0);
            
            const currentHours = now.diff(dayjs(date), 'hour');
            lastPhaseIndexRef.current = FASTING_PHASES.findIndex((p: FastingStage) => currentHours >= p.hoursStart);
        } else {
            safeLocalStorageRemove('fasting_startTime');
            setElapsed(0);
            lastPhaseIndexRef.current = -1;
        }
    }, []);

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
                const newPhaseIndex = FASTING_PHASES.findIndex((p: FastingStage) => currentHours >= p.hoursStart && (!p.hoursEnd || currentHours < p.hoursEnd));
                
                if (newPhaseIndex !== -1 && newPhaseIndex !== lastPhaseIndexRef.current) {
                    if (lastPhaseIndexRef.current !== -1) {
                        const settings = safeLocalStorageGetJSON<NotificationSettings>('user_settings', { fasting: true });
                        if (settings.fasting !== false) {
                            const phase = FASTING_PHASES[newPhaseIndex];
                            setNotification({
                                title: `Новый этап: ${phase.title}`,
                                message: phase.subtitle,
                                phaseId: phase.id // 👈 Передаем ID фазы
                            });
                            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                        }
                    }
                    lastPhaseIndexRef.current = newPhaseIndex;
                }
            }
        };

        if (lastPhaseIndexRef.current === -1) {
            const start = dayjs(startTime);
            const currentHours = dayjs().diff(start, 'hour', true);
            lastPhaseIndexRef.current = FASTING_PHASES.findIndex((p: FastingStage) => currentHours >= p.hoursStart);
        }

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
                safeLocalStorageUpdateHistory('history_fasting', record);
            }
            setStartTime(null);
        } else {
            setStartTime(dayjs().toISOString());
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
            notification,
            closeNotification: () => setNotification(null),
            phaseToOpen, // 👈
            setPhaseToOpen // 👈
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
