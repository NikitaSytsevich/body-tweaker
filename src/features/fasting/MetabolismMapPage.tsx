// src/features/fasting/MetabolismMapPage.tsx

import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFastingTimerContext } from './context/TimerContext';
import { FASTING_PHASES } from './data/stages';
import type { FastingStage } from './data/stages';
import { cn } from '../../utils/cn';
import { BookOpen, Activity, Timer, Check, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhaseSheet } from './components/PhaseSheet';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import WebApp from '@twa-dev/sdk';

const ArticlesPage = lazy(() =>
  import('../articles/pages/ArticlesPage').then((m) => ({ default: m.ArticlesPage }))
);

export const MetabolismMapPage = () => {
  const { isFasting, elapsed } = useFastingTimerContext();
  const elapsedHours = elapsed / 3600;
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'map' | 'articles'>('map');
  const [selectedPhase, setSelectedPhase] = useState<FastingStage | null>(null);

  useEffect(() => {
    setViewMode(isFasting ? 'map' : 'articles');
  }, [isFasting]);

  useEffect(() => {
    if (!selectedPhase) return;

    const handleBack = () => setSelectedPhase(null);

    try {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(handleBack);
    } catch {
      return;
    }

    return () => {
      try {
        WebApp.BackButton.offClick(handleBack);
        WebApp.BackButton.hide();
      } catch {
        // ignore when running outside Telegram
      }
    };
  }, [selectedPhase]);

  useEffect(() => {
    if (!selectedPhase) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPhase(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPhase]);

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

  const activePhase = FASTING_PHASES[activeIndex] ?? FASTING_PHASES[0];
  const nextPhase = FASTING_PHASES[activeIndex + 1] ?? null;
  const elapsedLabel = useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(elapsed));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  }, [elapsed]);

  const tabs = [
    { value: 'map', label: 'Процессы', icon: Activity },
    { value: 'articles', label: 'База знаний', icon: BookOpen }
  ];

  return (
    <>
      <div className="relative z-0 flex flex-col pb-[calc(6.5rem+var(--app-safe-bottom))]">
        
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

             {/* Dynamic timeline window */}
             <button
                type="button"
                onClick={() => setSelectedPhase(activePhase)}
                className="app-card-soft rounded-[1.5rem] p-4 border border-[color:var(--tg-border)] mb-6 w-full text-left transition-transform active:scale-[0.99]"
             >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-bold app-muted uppercase tracking-widest">
                            Прогресс фазы
                        </p>
                        <h3 className="text-[17px] font-[800] app-header leading-tight mt-1">
                            {activePhase?.subtitle ?? 'Подготовка'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[color:var(--tg-glass)] border border-[color:var(--tg-border)]">
                        <Timer className="w-3.5 h-3.5 text-[color:var(--tg-accent)]" />
                        <span className="text-[11px] font-bold app-muted">
                            {isFasting ? `${Math.round(activeProgress)}%` : '0%'}
                        </span>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-[linear-gradient(90deg,var(--tg-accent),#60A5FA)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${isFasting ? activeProgress : 0}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] app-muted font-semibold">
                        <span>{activePhase?.hoursStart ?? 0}ч</span>
                        <span>{activePhase?.hoursEnd ?? '∞'}ч</span>
                    </div>
                </div>

                <p className="mt-3 text-[12px] app-muted leading-relaxed">
                    {isFasting
                      ? nextPhase
                        ? `Далее: ${nextPhase.subtitle} с ${nextPhase.hoursStart}ч.`
                        : 'Финальная стадия достигнута. Дальше важен мягкий выход.'
                      : 'Запустите голодание, чтобы таймлайн начал обновляться в реальном времени.'}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] app-muted font-semibold">
                    <span>Прошло: {isFasting ? elapsedLabel : '0ч 0м'}</span>
                    <span>Нажмите для деталей</span>
                </div>
             </button>

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
                        const isCurrent = isFasting ? index === activeIndex : index === 0;
                        const isPassed = isFasting && index < activeIndex;
                        const isNext = isFasting ? index === activeIndex + 1 : index === 1;
                        const isFuture = isFasting ? index > activeIndex + 1 : index > 1;

                        const statusText = isPassed
                          ? 'ПРОШЕЛ'
                          : isCurrent
                            ? 'СЕЙЧАС'
                            : isNext
                              ? 'ДАЛЕЕ'
                              : 'ПОТОМ';

                        return (
                            <motion.div
                                key={phase.id}
                                onClick={() => setSelectedPhase(phase)}
                                initial={false}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "relative p-5 rounded-[2.1rem] transition-all duration-300 cursor-pointer overflow-hidden min-h-[128px] flex flex-col justify-between app-card",
                                    isCurrent && "border-[color:var(--tg-accent)] shadow-[0_14px_34px_-24px_rgba(59,130,246,0.45)]",
                                    isNext && "border-blue-200/70 dark:border-blue-400/30 bg-blue-50/35 dark:bg-blue-500/10",
                                    isPassed && "bg-emerald-50/30 dark:bg-emerald-500/8 border-emerald-200/55 dark:border-emerald-400/20",
                                    isFuture && "opacity-55 grayscale-[0.12]"
                                )}
                            >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[color:var(--tg-glass)] to-transparent" />
                                {/* Header Row */}
                                {/* min-h-[2.5rem] предотвращает скачки высоты контента при переносе заголовка */}
                                <div className="flex justify-between items-start gap-3 min-h-[2.5rem] relative z-10">
                                    <span className="text-sm font-medium opacity-85 leading-snug max-w-[65%] app-header">
                                        {phase.title}
                                    </span>

                                    <div className={cn(
                                        "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                                        isCurrent
                                          ? "bg-[color:var(--tg-accent)] text-white border border-[color:var(--tg-accent)]"
                                          : isPassed
                                            ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-500/20"
                                            : "bg-[color:var(--tg-glass)] app-muted border border-[color:var(--tg-border)]"
                                    )}>
                                        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                        {statusText}
                                        <phase.icon className="w-3 h-3 ml-1 opacity-70" />
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="mt-2 relative z-10">
                                    <h3 className="text-xl font-bold leading-tight mb-1 app-header">
                                       {phase.subtitle}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs font-bold opacity-60 app-muted">
                                           {isPassed
                                              ? `${phase.hoursEnd} ч • Завершено`
                                              : isCurrent
                                                ? `${phase.hoursStart} - ${phase.hoursEnd || '∞'} ч • Идет сейчас`
                                              : isNext
                                                ? `${phase.hoursStart} - ${phase.hoursEnd || '∞'} ч • Следующий`
                                              : `${phase.hoursStart} - ${phase.hoursEnd || '∞'} ч`
                                           }
                                        </span>
                                        {isPassed && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                                    </div>
                                </div>

                                <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--tg-accent)] relative z-10">
                                    Открыть фазу
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </div>

                                {/* Active Progress Bar */}
                                {isCurrent && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/5 dark:bg-white/10">
                                        <motion.div
                                            layoutId="activeProgress"
                                            className="h-full bg-[linear-gradient(90deg,var(--tg-accent),#60A5FA)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${isFasting ? activeProgress : 0}%` }}
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
            />
        )}
      </div>
    </>
  );
};
