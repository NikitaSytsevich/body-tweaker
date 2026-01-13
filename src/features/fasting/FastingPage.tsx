import { useState, useEffect, useRef } from 'react';
import { useFastingTimer } from './hooks/useFastingTimer';
import { ProtocolSelector } from './components/ProtocolSelector';
import { NativeDatePicker } from '../../components/ui/DatePicker';
import { Play, Square, ListFilter, Sunrise, Moon, ChevronDown, Map } from 'lucide-react';
import { cn } from '../../utils/cn';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { ToastNotification } from '../../components/ui/ToastNotification';
import { useNavigate } from 'react-router-dom';

export const FastingPage = () => {
  const timerData = useFastingTimer();
  const [isSelecting, setIsSelecting] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timerData || !timerData.scheme) {
      localStorage.clear();
      window.location.reload(); 
    }
    if (timerData?.isFasting) {
        setIsReadyToStart(true);
    }
  }, [timerData]);

  if (!timerData || !timerData.scheme) return null;

  const { isFasting, scheme, setSchemeId, progress, elapsedFormatted, toggleFasting, startTime, setStartTime, notification, closeNotification } = timerData;

  const handleMainButtonClick = () => {
    if (isFasting) {
      toggleFasting();
      setIsReadyToStart(false);
    } else if (isReadyToStart) {
      toggleFasting();
    } else {
      setIsSelecting(true);
    }
  };

  const handleSelectScheme = (id: string) => {
    setSchemeId(id);       
    setIsSelecting(false); 
    setIsReadyToStart(true);
    setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 150);
  };

  const currentStart = startTime || dayjs().toISOString();
  const currentEnd = dayjs(currentStart).add(scheme.hours, 'hour').toISOString();
  const handleChangeStart = (v: string) => setStartTime(v);
  const handleChangeEnd = (v: string) => {
    const newStart = dayjs(v).subtract(scheme.hours, 'hour').toISOString();
    setStartTime(newStart);
  };

  const size = 260;
  const stroke = 8;
  const center = size / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (isSelecting) {
    return <ProtocolSelector onSelect={handleSelectScheme} onClose={() => setIsSelecting(false)} />;
  }

  return (
    <>
        <ToastNotification 
            isVisible={!!notification} 
            title={notification?.title || ""} 
            message={notification?.message || ""} 
            onClose={closeNotification} 
        />

        <div className="min-h-screen bg-[#F2F2F7] flex flex-col px-4 pt-14 pb-32 relative z-0">
        
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 flex-1 border border-white/50 overflow-hidden grid grid-rows-[auto_1fr_auto]">
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03] pointer-events-none" />

            <div className="px-8 pt-10 flex justify-between items-start relative z-20 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-2 h-2 rounded-full", isFasting ? "bg-blue-500 animate-pulse" : "bg-slate-300")} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {isFasting ? "Активность" : "Статус"}
                        </span>
                    </div>
                    <h1 className="text-3xl font-[900] text-slate-800 leading-tight">
                        {isFasting ? "Голодание" : "Ожидание"}
                    </h1>
                </div>
                
                <button 
                    onClick={() => navigate('/')}
                    className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-slate-100 transition-all active:scale-95 text-slate-400 hover:text-blue-500"
                >
                    <Map className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col items-center justify-center relative z-20 py-4 space-y-6">
                
                <div className="relative shrink-0" style={{ width: size, height: size }}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] drop-shadow-xl">
                        <circle cx={center} cy={center} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={stroke} strokeLinecap="round" />
                        <circle 
                            cx={center} cy={center} r={radius} fill="none" 
                            stroke="currentColor" strokeWidth={stroke} 
                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                            className={cn("transition-all duration-1000 ease-out", isFasting ? "text-blue-500" : "text-transparent")}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex items-baseline text-slate-800">
                            <span className="text-6xl font-[800] font-mono tracking-tighter tabular-nums leading-none">
                                {isFasting ? elapsedFormatted.split(':')[0] : `${scheme.hours}`}
                                <span className="mx-1 opacity-20">:</span>
                                {isFasting ? elapsedFormatted.split(':')[1] : `00`}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-slate-400 mt-1 font-mono">
                            {isFasting ? elapsedFormatted.split(':')[2] : 'Часов'}
                        </span>
                        {isFasting && (
                            <div className="mt-3 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-bold text-blue-600 border border-blue-100 tabular-nums">
                                {progress.toFixed(1)}%
                            </div>
                        )}
                    </div>
                </div>

                <div 
                    onClick={() => setIsSelecting(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 cursor-pointer active:scale-95 transition-transform hover:bg-slate-100 shrink-0"
                >
                    <scheme.icon className={cn("w-4 h-4", scheme.color.split(' ')[0])} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide truncate max-w-[150px]">
                        {scheme.title}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                </div>

                <div className="flex gap-8 shrink-0 mt-6">
                    <NativeDatePicker label="Начало" icon={Sunrise} dateValue={currentStart} onChange={handleChangeStart} disabled={!isFasting} />
                    <div className="w-px bg-slate-100 h-10" />
                    <NativeDatePicker label="Финиш" icon={Moon} dateValue={currentEnd} onChange={handleChangeEnd} disabled={!isFasting} />
                </div>
            </div>

            <div ref={buttonRef} className="p-6 mt-auto shrink-0 bg-white">
                <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMainButtonClick}
                    animate={isReadyToStart && !isFasting ? { y: [0, -2, 0], boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" } : {}}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className={cn(
                        "w-full py-4 rounded-2xl flex items-center justify-between px-6 shadow-lg transition-all group relative overflow-hidden",
                        isFasting 
                            ? "bg-white border-2 border-red-100 text-red-500 hover:bg-red-50" 
                            : isReadyToStart 
                                ? "bg-slate-900 text-white shadow-slate-900/30" 
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
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
                        isFasting ? "bg-red-50" : isReadyToStart ? "bg-white/20" : "bg-slate-100 text-slate-400"
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
