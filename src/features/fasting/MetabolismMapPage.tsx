// src/features/fasting/MetabolismMapPage.tsx

import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFastingTimerContext } from './context/TimerContext';
import { FASTING_PHASES } from './data/stages';
import type { FastingStage } from './data/stages';
import { cn } from '../../utils/cn';
import { Check, BookOpen, Activity, Flame, Zap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhaseSheet } from './components/PhaseSheet';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';

const ArticlesPage = lazy(() =>
  import('../articles/pages/ArticlesPage').then((m) => ({ default: m.ArticlesPage }))
);

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

// Цветовые темы (акценты)
const PHASE_THEMES = [
  { // Blue
    badge: 'bg-[color:var(--tg-glass)] text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/20',
    accent: 'text-blue-500 dark:text-blue-400',
    progress: 'bg-blue-500 dark:bg-blue-500'
  },
  { // Green
    badge: 'bg-[color:var(--tg-glass)] text-emerald-600 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20',
    accent: 'text-emerald-600 dark:text-emerald-400',
    progress: 'bg-emerald-600 dark:bg-emerald-500'
  },
  { // Purple
    badge: 'bg-[color:var(--tg-glass)] text-violet-600 dark:text-violet-300 border border-violet-200/60 dark:border-violet-500/20',
    accent: 'text-violet-600 dark:text-violet-400',
    progress: 'bg-violet-600 dark:bg-violet-500'
  },
  { // Orange
    badge: 'bg-[color:var(--tg-glass)] text-orange-600 dark:text-orange-300 border border-orange-200/60 dark:border-orange-500/20',
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

  const activeProgress = useMemo(() => {
    if (!isFasting) return 0;
    const phase = FASTING_PHASES[activeIndex];
    if (!phase) return 0;
    if (elapsedHours < phase.hoursStart) return 0;
    if (!phase.hoursEnd || phase.hoursEnd <= phase.hoursStart) return 100;
    const duration = phase.hoursEnd - phase.hoursStart;
    const progress = ((elapsedHours - phase.hoursStart) / duration) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [activeIndex, elapsedHours, isFasting]);

  const tabs = [
    { value: 'map', label: 'Процессы', icon: Activity },
    { value: 'articles', label: 'База знаний', icon: BookOpen }
  ];

  return (
    <>
      <div className="flex flex-col pb-28 relative z-0">
        
        {/* MAIN CONTAINER */}
        <div className="app-card relative flex flex-col z-10 min-h-[85vh] overflow-hidden">

          {/* HEADER SECTION */}
          {/* rounded-b-[2.5rem] создает закругление "лепестком" над серым фоном контента */}
          <div className="px-5 pt-6 pb-4 z-20 relative border-b border-[color:var(--tg-border)]">
             <div className="flex items-center justify-between mb-6">
                 <h1 className="text-[28px] font-bold tracking-tight app-header">
                     Метаболизм
                 </h1>
                 <ProfileAvatar onClick={() => navigate('/profile')} />
             </div>

             {/* STATS GRID */}
             <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Card 1: Time */}
                <div className="app-card-soft p-4 rounded-[1.5rem] flex flex-col items-center justify-center h-28 text-center border border-[color:var(--tg-border)]">
                    <div className="p-1.5 bg-white/70 dark:bg-white/10 rounded-full mb-2">
                        <Flame className="w-4 h-4 text-emerald-500" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-[800] app-header">
                        {isFasting ? Math.floor(elapsedHours) : 0}<span className="text-sm font-bold ml-0.5">ч</span>
                    </span>
                    <p className="text-[10px] font-bold text-emerald-500/80 uppercase mt-1">Время</p>
                </div>

                {/* Card 2: Phase Count */}
                <div className="app-card-soft p-4 rounded-[1.5rem] flex flex-col items-center justify-center h-28 text-center border border-[color:var(--tg-border)]">
                     <div className="p-1.5 bg-white/70 dark:bg-white/10 rounded-full mb-2">
                            <Zap className="w-4 h-4 text-violet-500" fill="currentColor" />
                        </div>
                    <span className="text-2xl font-[800] app-header">
                       {activeIndex + 1}
                    </span>
                    <p className="text-[10px] font-bold text-violet-500/80 uppercase mt-1">Этап</p>
                </div>

                {/* Card 3: Total */}
                <div className="app-card-soft p-4 rounded-[1.5rem] flex flex-col items-center justify-center h-28 text-center border border-[color:var(--tg-border)]">
                     <div className="p-1.5 bg-white/70 dark:bg-white/10 rounded-full mb-2">
                        <Trophy className="w-4 h-4 text-amber-500" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-[800] app-header">
                        {FASTING_PHASES.length}
                    </span>
                     <p className="text-[10px] font-bold text-amber-500/80 uppercase mt-1">Всего</p>
                </div>
             </div>

             {/* Segmented Control */}
             <div className="mt-1">
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
          <div className="flex-1 px-5 pb-8 pt-6">
            <AnimatePresence mode="wait">
                
                {viewMode === 'articles' ? (
                    <motion.div
                        key="articles"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                    > 
                        <Suspense
                          fallback={
                            <div className="flex items-center justify-center py-16 text-sm app-muted">
                              Загрузка...
                            </div>
                          }
                        >
                          <ArticlesPage />
                        </Suspense>
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
                                    "relative p-5 rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden min-h-[120px] flex flex-col justify-between app-card",
                                    "shadow-sm hover:shadow-md",
                                    isLocked && "opacity-50 grayscale-[0.5] dark:opacity-30"
                                )}
                            >
                                {/* Header Row */}
                                {/* min-h-[2.5rem] предотвращает скачки высоты контента при переносе заголовка */}
                                <div className="flex justify-between items-start gap-3 min-h-[2.5rem]">
                                    <span className="text-sm font-medium opacity-80 leading-snug max-w-[65%] app-header">
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
                                    <h3 className="text-xl font-bold leading-tight mb-1 app-header">
                                       {phase.subtitle}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs font-bold opacity-60 app-muted">
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
                                            animate={{ width: `${activeProgress}%` }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
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
