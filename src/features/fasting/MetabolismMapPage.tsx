import { useState, useEffect, useRef } from 'react';
import { useFastingTimer } from './hooks/useFastingTimer';
import { FASTING_PHASES } from './data/stages';
import type { FastingStage } from './data/stages';
import { cn } from '../../utils/cn';
import { Check, Lock, Navigation, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhaseSheet } from './components/PhaseSheet';
import { AnabolicState } from './components/AnabolicState';

const getZoneColor = (hours: number) => {
  if (hours < 12) return "text-orange-500";
  if (hours < 24) return "text-blue-500";
  if (hours < 72) return "text-violet-500";
  return "text-emerald-500";
};

export const MetabolismMapPage = () => {
  const { isFasting, elapsed } = useFastingTimer();
  const elapsedHours = elapsed / 3600;

  if (!isFasting) return <AnabolicState />;

  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeRef.current) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);

  let activeIndex = 0;
  let phaseProgress = 0;

  for (let i = 0; i < FASTING_PHASES.length; i++) {
    const phase = FASTING_PHASES[i];
    const nextPhase = FASTING_PHASES[i + 1];
    if (elapsedHours >= phase.hoursStart) {
      activeIndex = i;
      if (nextPhase) {
        const duration = nextPhase.hoursStart - phase.hoursStart;
        const passedInPhase = elapsedHours - phase.hoursStart;
        phaseProgress = Math.min((passedInPhase / duration) * 100, 100);
      } else {
        phaseProgress = 100;
      }
    }
  }

  const [selectedPhase, setSelectedPhase] = useState<FastingStage | null>(null);
  const accentColor = getZoneColor(elapsedHours);

  return (
    <div className="min-h-screen bg-[#F2F2F7] relative flex flex-col px-4 pt-14 pb-32">
      
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 relative flex-1 flex flex-col z-10 border border-white/50 overflow-hidden">
        
        {/* HEADER */}
        <div className="px-8 pt-10 pb-6 flex justify-between items-start shrink-0 relative z-20 bg-white border-b border-gray-50">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Navigation className={cn("w-3 h-3", accentColor)} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Маршрут
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <h1 className="text-3xl font-[900] text-slate-800 leading-none">
                    {Math.floor(elapsedHours)}
                    </h1>
                    <span className="text-sm font-bold text-slate-400">часов</span>
                </div>
            </div>
            
            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full bg-current", accentColor)} />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                    {elapsedHours < 12 ? "Питание" : elapsedHours < 24 ? "Кетоз" : "Аутофагия"}
                </span>
            </div>
        </div>

        {/* TIMELINE */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide relative z-10">
            <div className="absolute left-[35px] top-6 bottom-6 w-0.5 bg-slate-100 rounded-full" />

            {FASTING_PHASES.map((phase, index) => {
            const isActive = index === activeIndex;
            const isPassed = index < activeIndex;
            const isFuture = index > activeIndex;

            // 🛠 ИСПРАВЛЕНИЕ: Убираем класс 'bg-...' из строки цветов, оставляем только текст
            const iconColor = phase.color.replace(/bg-[\w-]+\s*/, '');

            return (
                <div 
                    key={index} 
                    ref={isActive ? activeRef : null}
                    className={cn("relative z-10 flex gap-4 transition-all duration-500", isActive ? "mb-8 mt-2" : "mb-4")}
                >
                
                {/* Левая колонка (Маркеры) */}
                <div className="flex flex-col items-center shrink-0 w-12 pt-2">
                    {isActive && (
                        <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-slate-100 -z-10">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${phaseProgress}%` }}
                                transition={{ duration: 1 }}
                                className="w-full bg-blue-500"
                            />
                        </div>
                    )}

                    <div 
                        onClick={() => setSelectedPhase(phase)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer border-[3px] z-20 bg-white",
                            isActive 
                                ? "border-blue-500 scale-110" 
                                : isPassed 
                                    ? "border-slate-200 text-slate-300 scale-90" 
                                    : "border-slate-100 text-slate-200 scale-75"
                        )}
                    >
                        {isPassed ? <Check className="w-4 h-4" /> :
                        // 👇 Иконка теперь чистая, без фона
                        isActive ? <phase.icon className={cn("w-5 h-5", iconColor)} /> :
                        <span className="text-[10px] font-bold font-mono">{index + 1}</span>
                        }
                    </div>
                </div>

                {/* Правая колонка (Карточка) */}
                <div className="flex-1 min-w-0">
                    {isActive && (
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setSelectedPhase(phase)}
                            className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-200 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className="text-[9px] font-bold text-blue-500 bg-white border border-blue-100 px-2 py-1 rounded-lg uppercase tracking-wide">
                                    Сейчас
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-400">{Math.round(phaseProgress)}%</span>
                            </div>
                            
                            <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 relative z-10">
                                {phase.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed relative z-10">
                                {phase.subtitle}
                            </p>

                            <div className="h-1.5 w-full bg-slate-200 rounded-full mt-4 overflow-hidden relative z-10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${phaseProgress}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full bg-blue-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}

                    {isPassed && (
                        <div 
                            onClick={() => setSelectedPhase(phase)}
                            className="py-3 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between group hover:bg-slate-50"
                        >
                            <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors line-through decoration-slate-300">
                                {phase.title}
                            </span>
                        </div>
                    )}

                    {isFuture && (
                        <div 
                            onClick={() => setSelectedPhase(phase)}
                            className="py-3 px-4 rounded-2xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group mt-1"
                        >
                            <div>
                                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                    {phase.title}
                                </span>
                                <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                                    +{Math.max(0, Math.floor(phase.hoursStart - elapsedHours))}ч
                                </div>
                            </div>
                            <Lock className="w-3 h-3 text-slate-200" />
                        </div>
                    )}

                </div>
                </div>
            );
            })}
            
            <div className="ml-[28px] mt-4 mb-10 pl-8 relative opacity-50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Финиш
                </span>
            </div>

        </div>

      </div>

      <AnimatePresence>
        {selectedPhase && (
            <PhaseSheet 
                phase={selectedPhase} 
                onClose={() => setSelectedPhase(null)} 
            />
        )}
      </AnimatePresence>

    </div>
  );
};
