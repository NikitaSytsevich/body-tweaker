// src/features/fasting/MetabolismMapPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFastingTimerContext } from './context/TimerContext';
import { FASTING_PHASES } from './data/stages';
import type { FastingStage } from './data/stages';
import { cn } from '../../utils/cn';
import { Check, BookOpen, Activity, Flame, Zap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhaseSheet } from './components/PhaseSheet';
import { ArticlesPage } from '../articles/pages/ArticlesPage';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';

// Расширенный список названий для бейджей
const STAGE_LABELS = [
    'ПОДГОТОВКА', 
    'ЖИРОСЖИГАНИЕ', 
    'АУТОФАГИЯ', 
    'ВЫХОД', 
    'ВОССТАНОВЛЕНИЕ',
    'КЕТОЗ',
    'ГЛУБОКИЙ КЕТОЗ',
    'АДАПТАЦИЯ',
    'МАКСИМУМ',
    'ЭКСТРИМ',
    'ХРОНИЧЕСКИЙ',
    'ПРЕДЕЛЬНЫЙ'
];

// Цветовые темы
const PHASE_THEMES = [
  { // Blue
    light: 'bg-[#e0f2fe] text-slate-700',
    dark: 'dark:bg-[#2C2C2E] dark:border-blue-500/20 dark:text-slate-200',
    badge: 'bg-white/60 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
    accent: 'text-blue-500 dark:text-blue-400',
    progress: 'bg-blue-500 dark:bg-blue-500'
  },
  { // Green
    light: 'bg-[#dcfce7] text-slate-700',
    dark: 'dark:bg-[#2C2C2E] dark:border-green-500/20 dark:text-slate-200',
    badge: 'bg-white/60 text-green-600 dark:bg-green-500/10 dark:text-green-300',
    accent: 'text-green-600 dark:text-green-400',
    progress: 'bg-green-600 dark:bg-green-500'
  },
  { // Purple
    light: 'bg-[#f3e8ff] text-slate-700',
    dark: 'dark:bg-[#2C2C2E] dark:border-purple-500/20 dark:text-slate-200',
    badge: 'bg-white/60 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300',
    accent: 'text-purple-600 dark:text-purple-400',
    progress: 'bg-purple-600 dark:bg-purple-500'
  },
  { // Orange
    light: 'bg-[#ffedd5] text-slate-700',
    dark: 'dark:bg-[#2C2C2E] dark:border-orange-500/20 dark:text-slate-200',
    badge: 'bg-white/60 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300',
    accent: 'text-orange-600 dark:text-orange-400',
    progress: 'bg-orange-600 dark:bg-orange-500'
  }
];

export const MetabolismMapPage = () => {
  const { isFasting, elapsed } = useFastingTimerContext();
  const elapsedHours = elapsed / 3600;
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'map' | 'articles'>('map');
  const [selectedPhase, setSelectedPhase] = useState<FastingStage | null>(null);

  useEffect(() => {
    setViewMode(isFasting ? 'map' : 'articles');
  }, [isFasting]);

  const activeIndex = useMemo(() => {
    for (let i = FASTING_PHASES.length - 1; i >= 0; i--) {
      if (elapsedHours >= FASTING_PHASES[i].hoursStart) return i;
    }
    return 0;
  }, [elapsedHours]);

  const tabs = [
    { value: 'map', label: 'Процессы', icon: Activity },
    { value: 'articles', label: 'База знаний', icon: BookOpen }
  ];

  return (
    <>
      <div className="flex flex-col pb-32 relative z-0 font-sans">
        
        {/* MAIN CONTAINER */}
        <div className="bg-[#F9F9F9] dark:bg-[#1C1C1E] rounded-[2.5rem] shadow-sm shadow-slate-200/50 dark:shadow-none relative flex flex-col z-10 min-h-[85vh] overflow-hidden border border-white/60 dark:border-white/5">

          {/* HEADER SECTION */}
          {/* rounded-b-[2.5rem] создает закругление "лепестком" над серым фоном контента */}
          <div className="px-6 pt-8 pb-6 bg-white dark:bg-[#1C1C1E] z-20 relative rounded-b-[2.5rem] shadow-sm dark:shadow-white/5">
             <div className="flex items-center justify-between mb-6">
                 <h1 className="text-[28px] font-bold text-slate-800 dark:text-white tracking-tight">
                     Метаболизм
                 </h1>
                 <ProfileAvatar onClick={() => navigate('/profile')} />
             </div>

             {/* STATS GRID */}
             <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Card 1: Time */}
                <div className="bg-[#dcfce7] dark:bg-[#2C2C2E] dark:border dark:border-green-500/15 p-4 rounded-[1.5rem] flex flex-col items-center justify-center h-28 text-center">
                    <div className="p-1.5 bg-white/40 dark:bg-green-500/15 rounded-full mb-2">
                        <Flame className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-[800] text-slate-800 dark:text-white">
                        {isFasting ? Math.floor(elapsedHours) : 0}<span className="text-sm font-bold ml-0.5">ч</span>
                    </span>
                    <p className="text-[10px] font-bold text-green-700/70 dark:text-green-400/70 uppercase mt-1">Время</p>
                </div>

                {/* Card 2: Phase Count */}
                <div className="bg-[#f3e8ff] dark:bg-[#2C2C2E] dark:border dark:border-purple-500/15 p-4 rounded-[1.5rem] flex flex-col items-center justify-center h-28 text-center">
                     <div className="p-1.5 bg-white/40 dark:bg-purple-500/15 rounded-full mb-2">
                            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" />
                        </div>
                    <span className="text-2xl font-[800] text-slate-800 dark:text-white">
                       {activeIndex + 1}
                    </span>
                    <p className="text-[10px] font-bold text-purple-700/70 dark:text-purple-400/70 uppercase mt-1">Этап</p>
                </div>

                {/* Card 3: Total */}
                <div className="bg-[#ffedd5] dark:bg-[#2C2C2E] dark:border dark:border-orange-500/15 p-4 rounded-[1.5rem] flex flex-col items-center justify-center h-28 text-center">
                     <div className="p-1.5 bg-white/40 dark:bg-orange-500/15 rounded-full mb-2">
                        <Trophy className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-[800] text-slate-800 dark:text-white">
                        {FASTING_PHASES.length}
                    </span>
                     <p className="text-[10px] font-bold text-orange-700/70 dark:text-orange-400/70 uppercase mt-1">Всего</p>
                </div>
             </div>

             {/* Segmented Control */}
             <div className="bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-2xl">
                 <SegmentedControl
                    options={tabs}
                    value={viewMode}
                    onChange={(val) => setViewMode(val as 'map' | 'articles')}
                />
             </div>
          </div>

          {/* CONTENT AREA */}
          {/* bg-transparent позволяет видеть серый фон родителя (#F9F9F9), 
              чтобы закругление шапки было заметно */}
          <div className="flex-1 px-4 pb-8 bg-transparent pt-6">
            <AnimatePresence mode="wait">
                
                {viewMode === 'articles' ? (
                    <motion.div
                        key="articles"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                    > 
                        <ArticlesPage />
                    </motion.div>
                ) : (
                    
                /* === MAP MODE === */
                <motion.div
                    key="map"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-3"
                >
                    {FASTING_PHASES.map((phase, index) => {
                        const isActive = isFasting && index === activeIndex;
                        const isPassed = isFasting && index < activeIndex;
                        const isLocked = !isFasting && index > 0;
                        
                        const theme = PHASE_THEMES[index % PHASE_THEMES.length];
                        
                        let statusText = "Ожидание";
                        if (isActive) statusText = "Активен";
                        if (isPassed) statusText = "Завершено";
                        if (isLocked) statusText = "Закрыто";

                        const badgeLabel = statusText === 'Завершено' ? 'ЗАВЕРШЕНО' : (statusText === 'Активен' ? (STAGE_LABELS[index] || `ЭТАП ${index + 1}`) : `ЭТАП ${index + 1}`);

                        return (
                            <motion.div
                                key={phase.id}
                                onClick={() => setSelectedPhase(phase)}
                                initial={false}
                                whileTap={{ scale: 0.98 }}
                                whileHover={{ scale: 1.01 }}
                                className={cn(
                                    "relative p-5 rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden min-h-[120px] flex flex-col justify-between border",
                                    theme.light,
                                    theme.dark,
                                    "shadow-sm hover:shadow-md",
                                    isLocked && "opacity-50 grayscale-[0.5] dark:opacity-30"
                                )}
                            >
                                {/* Header Row */}
                                {/* min-h-[2.5rem] предотвращает скачки высоты контента при переносе заголовка */}
                                <div className="flex justify-between items-start gap-3 min-h-[2.5rem]">
                                    <span className={cn(
                                        "text-sm font-medium opacity-80 leading-snug max-w-[65%]",
                                        "dark:text-slate-300"
                                    )}>
                                        {phase.title}
                                    </span>

                                    <div className={cn(
                                        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                                        theme.badge
                                    )}>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                        {statusText === 'Завершено' ? 'ЗАВЕРШЕНО' : badgeLabel}
                                        <phase.icon className="w-3 h-3 ml-1 opacity-70" />
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="mt-2">
                                    <h3 className={cn(
                                        "text-xl font-bold leading-tight mb-1",
                                        "text-slate-800 dark:text-white"
                                    )}>
                                       {phase.subtitle}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={cn(
                                            "text-xs font-bold opacity-60",
                                            "dark:text-slate-400"
                                        )}>
                                           {isPassed
                                              ? `${phase.hoursEnd} ч • Завершено`
                                              : `${phase.hoursStart} - ${phase.hoursEnd || '∞'} ч`
                                           }
                                        </span>
                                        {isPassed && <Check className={cn("w-4 h-4", theme.accent)} />}
                                    </div>
                                </div>

                                {/* Active Progress Bar */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/5 dark:bg-white/10">
                                        <motion.div
                                            layoutId="activeProgress"
                                            className={cn("h-full", theme.progress)}
                                            initial={{ width: 0 }}
                                            animate={{ width: "45%" }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
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
