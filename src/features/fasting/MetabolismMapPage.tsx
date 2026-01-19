import { useState, useEffect, useMemo } from 'react';
import { useFastingTimerContext } from './context/TimerContext';
import { FASTING_PHASES } from './data/stages';
import type { FastingStage } from './data/stages';
import { cn } from '../../utils/cn';
import { Check, Lock, Navigation, Sparkles, BookOpen, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhaseSheet } from './components/PhaseSheet';
import { ArticlesPage } from '../articles/pages/ArticlesPage';
import { SegmentedControl } from '../../components/ui/SegmentedControl';

const getZoneColor = (hours: number) => {
  if (hours < 12) return "text-orange-500";
  if (hours < 24) return "text-blue-500";
  if (hours < 72) return "text-violet-500";
  return "text-emerald-500";
};

export const MetabolismMapPage = () => {
  const { isFasting, elapsed, phaseToOpen, setPhaseToOpen } = useFastingTimerContext();
  const elapsedHours = elapsed / 3600;

  const [viewMode, setViewMode] = useState<'map' | 'articles'>('map');

  // Авто-переключение при старте/остановке таймера
  useEffect(() => {
    setViewMode(isFasting ? 'map' : 'articles');
  }, [isFasting]);

  // Обработка Deep Link (открытие фазы из уведомления)
  const [selectedPhase, setSelectedPhase] = useState<FastingStage | null>(null);
  useEffect(() => {
      if (phaseToOpen !== null) {
          const targetPhase = FASTING_PHASES.find(p => p.id === phaseToOpen);
          if (targetPhase) {
              setSelectedPhase(targetPhase);
              setViewMode('map');
          }
          setPhaseToOpen(null);
      }
  }, [phaseToOpen, setPhaseToOpen]);

  const { activeIndex, phaseProgress } = useMemo(() => {
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
    return { activeIndex, phaseProgress };
  }, [elapsedHours]);

  const accentColor = getZoneColor(elapsedHours);

  const tabs = [
    { value: 'map', label: 'Процессы', icon: Activity },
    { value: 'articles', label: 'Знания', icon: BookOpen }
  ];

  return (
    <>
      <div className="flex flex-col pb-32 relative z-0">
        
        {/* БЕЛЫЙ КОНТЕЙНЕР */}
        <div className="bg-white rounded-[3rem] shadow-sm shadow-slate-200/50 relative flex flex-col z-10 border border-white/60 min-h-[80vh]">
          
          {/* Переключатель */}
          <div className="px-6 pt-6 pb-2 bg-white rounded-t-[3rem]">
             <SegmentedControl 
                options={tabs}
                value={viewMode}
                onChange={(val) => setViewMode(val as 'map' | 'articles')}
            />
          </div>

          {/* Контент (без свайпов) */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
                
                {/* === РЕЖИМ 1: СТАТЬИ === */}
                {viewMode === 'articles' ? (
                    <motion.div
                        key="articles"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="w-full min-h-[50vh]"
                    >
                        <div className="pt-2"> 
                            <ArticlesPage />
                        </div>
                    </motion.div>
                ) : (
                    
                /* === РЕЖИМ 2: КАРТА === */
                <motion.div
                    key="map"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex flex-col"
                >
                    {/* Хедер Карты */}
                    <div className="px-8 pt-4 pb-6 flex justify-between items-start border-b border-gray-50/50 bg-white">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Navigation className={cn("w-3 h-3", accentColor)} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Маршрут
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h1 className="text-3xl font-[900] text-slate-800 leading-none">
                                    {isFasting ? Math.floor(elapsedHours) : 0}
                                </h1>
                                <span className="text-sm font-bold text-slate-400">часов</span>
                            </div>
                        </div>
                        
                        {isFasting ? (
                            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full bg-current", accentColor)} />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                    {elapsedHours < 12 ? "Питание" : elapsedHours < 24 ? "Кетоз" : "Аутофагия"}
                                </span>
                            </div>
                        ) : (
                            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Ожидание</span>
                            </div>
                        )}
                    </div>

                    {/* Список Фаз */}
                    <div className="px-4 py-6 relative z-10 pb-10">
                        <div className="absolute left-[35px] top-6 bottom-10 w-0.5 bg-slate-100 rounded-full" />

                        {FASTING_PHASES.map((phase, index) => {
                            const isActive = isFasting && index === activeIndex;
                            const isPassed = isFasting && index < activeIndex;
                            const iconColor = phase.color.replace(/bg-[\w-]+\s*/, '');

                            return (
                                <div 
                                    key={index} 
                                    className={cn("relative z-10 flex gap-4 transition-all duration-500", isActive ? "mb-8 mt-2" : "mb-4")}
                                >
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
                                                isActive ? "border-blue-500 scale-110 shadow-lg shadow-blue-500/20" : isPassed ? "border-slate-200 text-slate-300 scale-90" : "border-slate-100 text-slate-200 scale-75"
                                            )}
                                        >
                                            {isPassed ? <Check className="w-4 h-4" /> : isActive ? <phase.icon className={cn("w-5 h-5", iconColor)} /> : <span className="text-[10px] font-bold font-mono">{index + 1}</span>}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {isActive ? (
                                            <motion.div 
                                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                                                onClick={() => setSelectedPhase(phase)}
                                                className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-200 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start mb-2 relative z-10">
                                                    <span className="text-[9px] font-bold text-blue-500 bg-white border border-blue-100 px-2 py-1 rounded-lg uppercase tracking-wide">Сейчас</span>
                                                    <span className="text-xs font-mono font-bold text-slate-400">{Math.round(phaseProgress)}%</span>
                                                </div>
                                                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 relative z-10">{phase.title}</h3>
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed relative z-10">{phase.subtitle}</p>
                                                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-4 overflow-hidden relative z-10">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${phaseProgress}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-blue-500 rounded-full" />
                                                </div>
                                            </motion.div>
                                        ) : isPassed ? (
                                            <div onClick={() => setSelectedPhase(phase)} className="py-3 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between group hover:bg-slate-50">
                                                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors line-through decoration-slate-300">{phase.title}</span>
                                            </div>
                                        ) : (
                                            <div onClick={() => setSelectedPhase(phase)} className="py-3 px-4 rounded-2xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group mt-1">
                                                <div>
                                                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{phase.title}</span>
                                                    {isFasting && <div className="text-[10px] text-slate-300 font-mono mt-0.5">+{Math.max(0, Math.floor(phase.hoursStart - elapsedHours))}ч</div>}
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
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Финиш</span>
                        </div>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
          </div>

        </div>

        {selectedPhase && (
            <PhaseSheet 
                phase={selectedPhase} 
                onClose={() => setSelectedPhase(null)} 
            />
        )}

      </div>
    </>
  );
};
