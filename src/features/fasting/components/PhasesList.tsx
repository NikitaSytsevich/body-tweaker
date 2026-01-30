import { useState, useEffect } from 'react';
import { FASTING_PHASES } from '../data/stages';
import { cn } from '../../../utils/cn';
import { Check, Lock, ChevronDown, Activity, Info, AlertTriangle } from 'lucide-react';

interface Props {
  elapsedSeconds: number;
}

export const PhasesList = ({ elapsedSeconds }: Props) => {
  const elapsedHours = elapsedSeconds / 3600;

  // 1. Вычисляем индекс реальной текущей фазы
  let activePhaseIndex = -1;
  for (let i = 0; i < FASTING_PHASES.length; i++) {
    if (elapsedHours >= FASTING_PHASES[i].hoursStart) {
      activePhaseIndex = i;
    } else {
      break; 
    }
  }

  // 2. Состояние: какую фазу просматриваем сейчас (по клику)
  // По умолчанию — текущая активная
  const [viewingIndex, setViewingIndex] = useState<number>(activePhaseIndex !== -1 ? activePhaseIndex : 0);

  // Если таймер идет и фаза сменилась — автоматически переключаем просмотр на неё
  useEffect(() => {
    if (activePhaseIndex !== -1) {
      setViewingIndex(activePhaseIndex);
    }
  }, [activePhaseIndex]);

  return (
    <div className="w-full px-4 mt-8 mb-24 animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
          Карта метаболизма
        </h3>
        <span className="text-[10px] font-medium text-white bg-slate-800 dark:bg-slate-700 px-2 py-1 rounded-full">
          Этап {activePhaseIndex + 1} / {FASTING_PHASES.length}
        </span>
      </div>

      <div className="relative pl-2">
        {/* Вертикальная линия (Дорога) */}
        <div className="absolute left-[27px] top-4 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 via-gray-200 dark:via-white/20 to-gray-100 dark:to-white/10 z-0" />

        {FASTING_PHASES.map((phase, index) => {
          // Логика состояний
          const isRealActive = index === activePhaseIndex; // Это фаза, которая идет прямо сейчас
          const isSelected = index === viewingIndex;       // Эту фазу мы развернули кликом
          const isPassed = index < activePhaseIndex;       // Это прошлое
          const isFuture = index > activePhaseIndex;       // Это будущее

          return (
            <div key={phase.id} className="relative z-10 mb-6 group">
              <button
                onClick={() => setViewingIndex(index)}
                className={cn(
                  "flex items-start text-left gap-4 w-full transition-all duration-300",
                  // Если фаза не выбрана и не активна — она полупрозрачная
                  (!isSelected && !isRealActive) && "opacity-50 hover:opacity-80 scale-95"
                )}
              >
                {/* 1. Иконка-Маркер (Точка на карте) */}
                <div className="relative shrink-0 pt-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border-2 z-20 relative",
                    // Стили маркера
                    isRealActive ? "bg-blue-500 border-blue-500 text-white shadow-blue-300 shadow-lg scale-110" :
                    isPassed ? "bg-slate-100 dark:bg-[#3A3A3C] border-slate-200 dark:border-white/20 text-slate-400 dark:text-slate-500" :
                    isSelected ? "bg-white dark:bg-[#2C2C2E] border-blue-400 dark:border-blue-500/50 text-blue-500" :
                    "bg-white dark:bg-[#2C2C2E] border-gray-200 dark:border-white/10 text-gray-300 dark:text-slate-600"
                  )}>
                    {isRealActive ? <Activity className="w-5 h-5 animate-pulse" /> :
                     isPassed ? <Check className="w-5 h-5" /> :
                     isFuture ? <Lock className="w-4 h-4" /> :
                     <phase.icon className="w-5 h-5" />}
                  </div>
                </div>

                {/* 2. Карточка контента */}
                <div className={cn(
                  "flex-1 rounded-2xl border transition-all duration-300 overflow-hidden",
                  isSelected
                    ? "bg-white dark:bg-[#2C2C2E] border-blue-100 dark:border-blue-500/30 shadow-xl ring-1 ring-blue-500/20 translate-x-0"
                    : "bg-white/50 dark:bg-[#2C2C2E]/50 border-transparent hover:bg-white dark:hover:bg-[#2C2C2E] hover:shadow-sm -translate-x-2"
                )}>

                  {/* Заголовок (всегда виден) */}
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <h4 className={cn("font-bold text-sm", isSelected ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
                        {phase.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-[#3A3A3C] px-1.5 py-0.5 rounded">
                          {phase.hoursStart}ч+
                        </span>
                        {isRealActive && (
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                            ● Сейчас
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected ? (
                      <ChevronDown className="w-4 h-4 text-gray-300 dark:text-slate-600 rotate-180 transition-transform" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                    )}
                  </div>

                  {/* 3. Детали (Видны только при клике) */}
                  <div className={cn(
                    "grid transition-all duration-500 ease-in-out px-4",
                    isSelected ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0"
                  )}>
                    <div className="overflow-hidden space-y-4 border-t border-gray-100 dark:border-white/10 pt-3">

                      {/* Описание */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {phase.subtitle}
                      </p>

                      {/* Физиология */}
                      <div className="bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-50 dark:border-blue-500/20">
                        <h5 className="text-[10px] font-bold text-blue-400 dark:text-blue-300 uppercase mb-1 flex items-center gap-1">
                          <Activity className="w-3 h-3"/> Что происходит
                        </h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {phase.details.physiology}
                        </p>
                      </div>

                      {/* Ощущения */}
                      <div>
                        <h5 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3"/> Ощущения
                        </h5>
                        <ul className="space-y-1">
                          {phase.details.sensations.map((s, i) => (
                            <li key={i} className="text-xs text-gray-500 dark:text-slate-400 flex gap-2 items-start">
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600 mt-1.5 shrink-0"/>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Внимание */}
                      {phase.precautions.length > 0 && (
                        <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
                           <h5 className="text-[10px] font-bold text-rose-400 dark:text-rose-300 uppercase mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3"/> Важно
                           </h5>
                           <ul className="space-y-1">
                              {phase.precautions.map((w, i) => (
                                <li key={i} className="text-xs text-rose-600/80 dark:text-rose-300/80">• {w}</li>
                              ))}
                           </ul>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
