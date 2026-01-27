import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Clock, Activity, ChevronDown, Zap, PartyPopper } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { FASTING_PHASES } from '../data/stages';
import { cn } from '../../../utils/cn';

interface Props {
  schemeId: string;
  onBack: () => void;
  onStart: () => void;
}

export const ProtocolDetails = ({ schemeId, onBack, onStart }: Props) => {
  const scheme = FASTING_SCHEMES.find(s => s.id === schemeId);
  const [expandedPhaseId, setExpandedPhaseId] = useState<number | null>(null);

  if (!scheme) return null;

  const relevantPhases = FASTING_PHASES.filter(p => p.hoursStart < scheme.hours);

  const togglePhase = (id: number) => {
      setExpandedPhaseId(current => current === id ? null : id);
  };

  const colorName = scheme.color.split('-')[1];

  return (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col h-full bg-[#F2F2F7] dark:bg-slate-900 relative"
    >
        {/* Хедер */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-4 shrink-0 bg-[#F2F2F7] dark:bg-slate-900 z-20">
            <button
                onClick={onBack}
                className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
            >
                <ChevronLeft className="w-6 h-6 ml-[-2px]" />
            </button>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Обзор
            </span>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto px-6 pb-10 scrollbar-hide"> {/* Увеличен padding-bottom */}
            
            {/* HERO */}
            <div className="flex flex-col items-center text-center mt-6 mb-10">
                <div className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl bg-white dark:bg-slate-800",
                    `shadow-${colorName}-200`
                )}>
                    <scheme.icon className={cn("w-10 h-10", scheme.color)} />
                </div>

                <h2 className="text-3xl font-[900] text-slate-800 dark:text-slate-100 leading-tight mb-2">
                    {scheme.title.split(':')[0]}
                </h2>
                <p className="text-base font-medium text-slate-500 dark:text-slate-400 max-w-[250px]">
                    {scheme.title.split(':')[1]?.trim() || scheme.title}
                </p>

                {/* Info Badges */}
                <div className="flex gap-2 mt-6">
                    <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">~{Math.round(scheme.hours / 24 * 10) / 10} дн.</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 shadow-sm">
                        <Activity className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{relevantPhases.length} этапов</span>
                    </div>
                </div>
            </div>

            {/* TIMELINE */}
            <div className="relative">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 pl-2">
                    Маршрут
                </h4>

                <div className="relative pl-4 space-y-4">
                    {/* Линия (теперь заканчивается чуть раньше финиша) */}
                    <div className="absolute left-[23px] top-2 bottom-8 w-[2px] bg-slate-200 dark:bg-slate-700 rounded-full" />

                    {relevantPhases.map((phase) => {
                        const isExpanded = expandedPhaseId === phase.id;
                        const iconColorClass = phase.color.replace('bg-', 'text-').replace('100', '500');

                        return (
                            <div key={phase.id} className="relative z-10 flex gap-5">
                                {/* Маркер */}
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-[3px] shadow-sm flex items-center justify-center shrink-0 z-20 mt-4 transition-colors bg-white dark:bg-slate-800",
                                    isExpanded ? "border-slate-800 dark:border-slate-200" : "border-slate-200 dark:border-slate-700"
                                )}>
                                    {isExpanded && <div className="w-1.5 h-1.5 bg-slate-800 dark:bg-slate-200 rounded-full" />}
                                </div>

                                {/* Карточка */}
                                <div
                                    onClick={() => togglePhase(phase.id)}
                                    className={cn(
                                        "flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all active:scale-[0.99] cursor-pointer group",
                                        isExpanded ? "ring-1 ring-slate-800 dark:ring-slate-200 border-slate-800 dark:border-slate-200" : "hover:border-slate-300 dark:hover:border-slate-600"
                                    )}
                                >
                                    <div className="p-4 flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                            isExpanded ? "bg-slate-100 dark:bg-slate-700" : "bg-slate-50 dark:bg-slate-700/50 group-hover:bg-slate-100 dark:group-hover:bg-slate-700"
                                        )}>
                                            <phase.icon className={cn("w-5 h-5", iconColorClass)} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                                    {phase.hoursStart}ч+
                                                </span>
                                                <ChevronDown className={cn("w-4 h-4 text-slate-300 dark:text-slate-600 transition-transform", isExpanded && "rotate-180")} />
                                            </div>
                                            <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                                                {phase.title}
                                            </h5>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="border-t border-slate-50 dark:border-slate-700 pt-3 space-y-3">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                    {phase.subtitle}
                                                </p>

                                                <div className="bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-50/50 dark:border-blue-900/30 flex gap-3">
                                                    <div className="mt-0.5 p-1 bg-blue-100 dark:bg-blue-900/50 rounded text-blue-600 dark:text-blue-400 shrink-0 h-fit">
                                                        <Zap className="w-3 h-3" />
                                                    </div>
                                                    <div>
                                                        <h6 className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase mb-0.5">Физиология</h6>
                                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                                            {phase.details.physiology}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h6 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5">Ощущения</h6>
                                                    <ul className="space-y-1">
                                                        {phase.details.sensations.map((s, i) => (
                                                            <li key={i} className="text-[11px] text-slate-500 dark:text-slate-400 flex gap-2 items-baseline">
                                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                                                {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Финиш с конфетти (Исправлено) */}
                    <div className="relative z-10 flex gap-5 pt-4 pb-6">
                        {/* Белая подложка z-20 чтобы перекрыть линию */}
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 border-[3px] border-white dark:border-slate-900 shadow-sm z-20 animate-pulse">
                            <PartyPopper className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="pt-0.5 opacity-60">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                                Цель достигнута
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопка старта (С отступом) */}
            <div className="mt-8 mb-8"> {/* Увеличенный марджин */}
                <button
                    onClick={onStart}
                    className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg shadow-slate-900/10 dark:shadow-slate-100/10 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    <span>Начать голодание</span>
                    <Play className="w-4 h-4 fill-current" />
                </button>
            </div>

        </div>
    </motion.div>
  );
};
