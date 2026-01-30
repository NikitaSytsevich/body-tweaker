import { useState, useEffect, useRef, memo } from 'react';
import { useFastingTimerContext } from './context/TimerContext';
import { ProtocolSelector } from './components/ProtocolSelector';
import { FastingStartModal } from './components/FastingStartModal';
import { NativeDatePicker } from '../../components/ui/DatePicker';
import { Play, Square, ListFilter, Sunrise, Moon } from 'lucide-react';
import { cn } from '../../utils/cn';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';

interface TimerVisualProps {
    progress: number;
    elapsedFormatted: string;
    totalHours: number;
    isFasting: boolean;
}

// 1. Визуализация таймера (Минималистичная: Кольцо + Время)
const TimerVisual = memo(({
    progress, elapsedFormatted, totalHours, isFasting
}: TimerVisualProps) => {
    const size = 280;
    const stroke = 8;
    const center = size / 2;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative z-20 py-10 space-y-8 flex-1">
            <div className="relative shrink-0" style={{ width: size, height: size }}>
                {/* SVG Кольцо */}
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] drop-shadow-2xl">
                    <circle cx={center} cy={center} r={radius} fill="none" stroke="#F1F5F9" className="dark:stroke-[#38383A]" strokeWidth={stroke} strokeLinecap="round" />
                    <circle
                        cx={center} cy={center} r={radius} fill="none"
                        stroke="currentColor" strokeWidth={stroke}
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                        className={cn(
                            "transition-all duration-1000 ease-out",
                            isFasting ? "text-blue-600 dark:text-blue-500" : "text-transparent"
                        )}
                    />
                </svg>

                {/* Контент внутри кольца */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">

                    {/* Время */}
                    <div className="flex items-baseline text-slate-800 dark:text-white translate-y-[-5px]">
                        <span className="text-[4.5rem] font-[850] font-mono tracking-tighter tabular-nums leading-none">
                            {isFasting ? elapsedFormatted.split(':')[0] : `${totalHours}`}
                            <span className="mx-1 opacity-20 relative -top-1">:</span>
                            {isFasting ? elapsedFormatted.split(':')[1] : `00`}
                        </span>
                    </div>

                    {/* Подпись */}
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                        {isFasting ? elapsedFormatted.split(':')[2] : 'Часов'}
                    </span>
                </div>
            </div>
        </div>
    );
});

export const FastingPage = () => {
  const { 
    isFasting, scheme, setSchemeId, progress, elapsedFormatted, 
    toggleFasting, startTime, setStartTime 
  } = useFastingTimerContext();

  const [isSelecting, setIsSelecting] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  const [showStartSuccess, setShowStartSuccess] = useState(false);
  
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

  // Синхронизация состояния готовности
  useEffect(() => {
    if (isFasting) {
        setIsReadyToStart(true);
    }
  }, [isFasting]);

  // Главная кнопка (внизу экрана)
  const handleMainButtonClick = () => {
    if (isFasting) {
      // Остановить
      toggleFasting();
      setIsReadyToStart(false);
    } else if (isReadyToStart) {
      // Запустить (если схема уже выбрана)
      toggleFasting();
      setShowStartSuccess(true);
    } else {
      // Открыть выбор схемы
      setIsSelecting(true);
    }
  };

  // Хендлер выбора из модалки
  const handleSelectScheme = (id: string) => {
    setSchemeId(id);       
    setIsSelecting(false); 
    
    // Если таймер НЕ запущен — запускаем
    if (!isFasting) {
        toggleFasting();
        // Показываем окно успеха с небольшой задержкой для плавности
        setTimeout(() => setShowStartSuccess(true), 300);
    }
    
    setIsReadyToStart(true);
  };

  const currentStart = startTime || dayjs().toISOString();
  const currentEnd = dayjs(currentStart).add(scheme.hours, 'hour').toISOString();
  
  const handleChangeStart = (v: string) => setStartTime(v);
  const handleChangeEnd = (v: string) => {
    const newStart = dayjs(v).subtract(scheme.hours, 'hour').toISOString();
    setStartTime(newStart);
  };

  return (
    <>
        {/* Модальное окно выбора протокола */}
        {isSelecting && (
            <ProtocolSelector 
                onSelect={handleSelectScheme} 
                onClose={() => setIsSelecting(false)} 
                currentSchemeId={scheme.id}
            />
        )}

        {/* Модальное окно успеха старта */}
        <FastingStartModal 
            isOpen={showStartSuccess} 
            onClose={() => setShowStartSuccess(false)} 
        />

        <div className="min-h-full flex flex-col pb-6 relative z-0">

        <div className="bg-white dark:bg-[#2C2C2E] rounded-[3rem] shadow-sm shadow-slate-200/50 dark:shadow-black/20 flex-1 border border-white/60 dark:border-white/10 relative flex flex-col">

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none rounded-[3rem]" />

            {/* HEADER */}
            <div className="px-8 pt-8 flex justify-between items-start relative z-20 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-2 h-2 rounded-full", isFasting ? "bg-blue-600 dark:bg-blue-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600")} />
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {isFasting ? "Активность" : "Статус"}
                        </span>
                    </div>
                    <h1 className="text-3xl font-[900] text-slate-800 dark:text-white leading-tight">
                        {isFasting ? "Голодание" : "Ожидание"}
                    </h1>
                </div>
                <ProfileAvatar onClick={() => navigate('/profile')} />
            </div>

            {/* CONTENT */}
            <TimerVisual
                progress={progress}
                elapsedFormatted={elapsedFormatted}
                totalHours={scheme.hours}
                isFasting={isFasting}
            />

            <div className="flex justify-center gap-6 shrink-0 mt-2 mb-4 relative z-20">
                <NativeDatePicker label="Начало" icon={Sunrise} dateValue={currentStart} onChange={handleChangeStart} disabled={!isFasting} />
                <div className="w-px bg-slate-100 dark:bg-white/10 h-10 self-center" />
                <NativeDatePicker label="Финиш" icon={Moon} dateValue={currentEnd} onChange={handleChangeEnd} disabled={!isFasting} />
            </div>

            {/* BUTTON */}
            <div ref={buttonRef} className="p-6 mt-auto shrink-0 bg-white/50 dark:bg-[#2C2C2E]/50 backdrop-blur-sm z-20 rounded-b-[3rem]">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMainButtonClick}
                    className={cn(
                        "w-full py-4 rounded-2xl flex items-center justify-between px-6 shadow-lg transition-all group relative overflow-hidden",
                        isFasting
                            ? "bg-white dark:bg-[#2C2C2E] border-2 border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                            : isReadyToStart
                                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-slate-900/30 dark:shadow-black/10"
                                : "bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#3A3A3C]"
                    )}
                >
                    <div className="flex flex-col items-start z-10">
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                            {isFasting ? "Удержание..." : isReadyToStart ? "Подтверждено" : "Шаг 1"}
                        </span>
                        <span className="font-bold text-sm tracking-wide">
                            {isFasting ? "Завершить цикл" : isReadyToStart ? `Начать` : "Выбрать протокол"}
                        </span>
                    </div>

                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10",
                        isFasting ? "bg-red-50 dark:bg-red-900/20" : isReadyToStart ? "bg-white/20 dark:bg-slate-900/10" : "bg-slate-100 dark:bg-[#3A3A3C] text-slate-400 dark:text-slate-500"
                    )}>
                        {isFasting ? <Square className="w-4 h-4 fill-current" /> : isReadyToStart ? <Play className="w-4 h-4 fill-current ml-0.5" /> : <ListFilter className="w-4 h-4" />}
                    </div>
                </motion.button>
            </div>

        </div>
        </div>
    </>
  );
};
