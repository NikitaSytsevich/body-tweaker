import { useState } from 'react';
import { ChevronLeft, Play, Clock, Activity, ChevronDown, Zap, PartyPopper } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { FASTING_PHASES } from '../data/stages';
import { cn } from '../../../utils/cn';

interface Props {
  schemeId: string;
  onBack: () => void;
  onStart: () => void;
}

const SCHEME_THEMES: Record<string, {
  gradient: string;
  glow: string;
  chip: string;
  border: string;
  line: string;
}> = {
  '24h': {
    gradient: 'from-sky-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
    glow: 'bg-sky-200/60 dark:bg-transparent',
    chip: 'border-sky-200 text-sky-600 dark:border-sky-500/50 dark:text-sky-300',
    border: 'border-sky-100/60 dark:border-sky-700/40',
    line: 'from-sky-300/70 via-sky-200/60 to-transparent dark:from-sky-400/30 dark:via-sky-400/10',
  },
  '36h': {
    gradient: 'from-emerald-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
    glow: 'bg-emerald-200/60 dark:bg-transparent',
    chip: 'border-emerald-200 text-emerald-600 dark:border-emerald-500/50 dark:text-emerald-300',
    border: 'border-emerald-100/60 dark:border-emerald-700/40',
    line: 'from-emerald-300/70 via-emerald-200/60 to-transparent dark:from-emerald-400/30 dark:via-emerald-400/10',
  },
  '48h': {
    gradient: 'from-violet-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
    glow: 'bg-violet-200/60 dark:bg-transparent',
    chip: 'border-violet-200 text-violet-600 dark:border-violet-500/50 dark:text-violet-300',
    border: 'border-violet-100/60 dark:border-violet-700/40',
    line: 'from-violet-300/70 via-violet-200/60 to-transparent dark:from-violet-400/30 dark:via-violet-400/10',
  },
  '72h': {
    gradient: 'from-rose-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
    glow: 'bg-rose-200/60 dark:bg-transparent',
    chip: 'border-rose-200 text-rose-600 dark:border-rose-500/50 dark:text-rose-300',
    border: 'border-rose-100/60 dark:border-rose-700/40',
    line: 'from-rose-300/70 via-rose-200/60 to-transparent dark:from-rose-400/30 dark:via-rose-400/10',
  },
  '96h': {
    gradient: 'from-indigo-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
    glow: 'bg-indigo-200/60 dark:bg-transparent',
    chip: 'border-indigo-200 text-indigo-600 dark:border-indigo-500/50 dark:text-indigo-300',
    border: 'border-indigo-100/60 dark:border-indigo-700/40',
    line: 'from-indigo-300/70 via-indigo-200/60 to-transparent dark:from-indigo-400/30 dark:via-indigo-400/10',
  },
  '120h': {
    gradient: 'from-fuchsia-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
    glow: 'bg-fuchsia-200/60 dark:bg-transparent',
    chip: 'border-fuchsia-200 text-fuchsia-600 dark:border-fuchsia-500/50 dark:text-fuchsia-300',
    border: 'border-fuchsia-100/60 dark:border-fuchsia-700/40',
    line: 'from-fuchsia-300/70 via-fuchsia-200/60 to-transparent dark:from-fuchsia-400/30 dark:via-fuchsia-400/10',
  },
  '168h': {
    gradient: 'from-amber-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
    glow: 'bg-amber-200/60 dark:bg-transparent',
    chip: 'border-amber-200 text-amber-700 dark:border-amber-500/50 dark:text-amber-300',
    border: 'border-amber-100/60 dark:border-amber-700/40',
    line: 'from-amber-300/70 via-amber-200/60 to-transparent dark:from-amber-400/30 dark:via-amber-400/10',
  },
};

const FALLBACK_THEME = {
  gradient: 'from-slate-100 via-white to-white dark:from-[#111826] dark:via-[#0E141C] dark:to-[#0B0F14]',
  glow: 'bg-slate-200/60 dark:bg-transparent',
  chip: 'border-slate-200 text-slate-600 dark:border-slate-500/50 dark:text-slate-300',
  border: 'border-slate-100/60 dark:border-slate-700/50',
  line: 'from-slate-300/70 via-slate-200/60 to-transparent dark:from-slate-500/30 dark:via-slate-500/10',
};

export const ProtocolDetails = ({ schemeId, onBack, onStart }: Props) => {
  const scheme = FASTING_SCHEMES.find(s => s.id === schemeId);
  const [expandedPhaseId, setExpandedPhaseId] = useState<number | null>(null);

  if (!scheme) return null;

  const relevantPhases = FASTING_PHASES.filter(p => p.hoursStart < scheme.hours);
  const theme = SCHEME_THEMES[scheme.id] ?? FALLBACK_THEME;
  const [titleMain, titleSub] = scheme.title.split(':');

  const togglePhase = (id: number) => {
    setExpandedPhaseId(current => current === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-gradient-to-b dark:from-[#0B0F14] dark:via-[#0E141C] dark:to-[#0B0F14] relative overflow-hidden animate-slide-in-right">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 pt-4 pb-3 bg-[#F2F2F7]/80 dark:bg-[#0B0F14]/75 backdrop-blur border-b border-white/60 dark:border-[#1B2736]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white dark:bg-[#131C28] rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-[#1F2B3C] text-slate-500 dark:text-slate-300 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 ml-[-2px]" />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-400">
              Обзор протокола
            </p>
            <h2 className="text-[18px] font-semibold text-slate-800 dark:text-slate-100">
              {titleMain}
            </h2>
          </div>
        </div>
        <span className={cn(
          'px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] rounded-full border bg-white/70 dark:bg-[#0E1620]/75',
          theme.chip
        )}>
          {scheme.hours}ч
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10 scrollbar-hide">
        <div className={cn(
          'relative mt-4 rounded-[32px] border overflow-hidden bg-white/90 dark:bg-[#101720] backdrop-blur shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)] dark:shadow-[0_10px_28px_-24px_rgba(0,0,0,0.7)]',
          theme.border
        )}>
          <div className={cn('absolute inset-[1px] rounded-[30px] bg-gradient-to-br opacity-100 dark:opacity-20', theme.gradient)} />
          <div className={cn('absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-70 dark:opacity-0', theme.glow)} />

          <div className="relative z-10 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-[#182231] border border-white/60 dark:border-[#213044] flex items-center justify-center shadow-sm">
                <scheme.icon className={cn('w-7 h-7', scheme.color)} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-400">
                  {titleSub?.trim() || scheme.title}
                </p>
                <h3 className="mt-2 text-[22px] font-[800] text-slate-800 dark:text-slate-100 leading-tight">
                  {scheme.description}
                </h3>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/60 dark:border-[#1C2838] bg-white/80 dark:bg-[#0F1620] p-3">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-[0.3em]">Длительность</span>
                </div>
                <p className="mt-2 text-[18px] font-semibold text-slate-800 dark:text-slate-200">
                  ~{Math.round(scheme.hours / 24 * 10) / 10} дня
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 dark:border-[#1C2838] bg-white/80 dark:bg-[#0F1620] p-3">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400">
                  <Activity className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-[0.3em]">Этапы</span>
                </div>
                <p className="mt-2 text-[18px] font-semibold text-slate-800 dark:text-slate-200">
                  {relevantPhases.length} фаз
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
              Маршрут фаз
            </p>
            <span className="text-[12px] text-slate-500 dark:text-slate-400">
              {relevantPhases.length} этапов
            </span>
          </div>

          <div className="relative mt-4 space-y-3">
          <div className={cn(
              'absolute left-[25px] top-6 bottom-10 w-[2px] rounded-full bg-gradient-to-b',
              theme.line
            )} />

            {relevantPhases.map((phase, index) => {
              const isExpanded = expandedPhaseId === phase.id;
              const iconColorClass = phase.color.replace('bg-', 'text-').replace('100', '500');

              return (
                <div key={phase.id} className="relative">
                  <div className={cn(
                    'absolute left-[14px] top-6 h-6 w-6 rounded-full border-2 bg-white dark:bg-[#0F141C] shadow-sm flex items-center justify-center text-[10px] font-semibold',
                    isExpanded ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100' : 'border-slate-200 dark:border-[#2A394D] text-slate-500 dark:text-slate-400'
                  )}>
                    {index + 1}
                  </div>

                  <div
                    onClick={() => togglePhase(phase.id)}
                    className={cn(
                      'ml-10 rounded-2xl border bg-white dark:bg-[#121A24] shadow-sm transition-all cursor-pointer overflow-hidden',
                      isExpanded ? 'border-slate-900 dark:border-slate-200 ring-1 ring-slate-900/10 dark:ring-slate-200/10' : 'border-slate-100 dark:border-[#1F2B3C] hover:border-slate-200 dark:hover:border-[#2B3B52]'
                    )}
                  >
                    <div className="p-4 flex items-start gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        isExpanded ? 'bg-slate-100 dark:bg-[#1B2432]' : 'bg-slate-50 dark:bg-[#1B2432]/70'
                      )}>
                        <phase.icon className={cn('w-5 h-5', iconColorClass)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                            {phase.hoursStart}ч+
                          </span>
                          <ChevronDown className={cn('w-4 h-4 text-slate-300 dark:text-slate-500 transition-transform', isExpanded && 'rotate-180')} />
                        </div>
                        <h4 className="mt-1 text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                          {phase.title}
                        </h4>
                        <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {phase.subtitle}
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="border-t border-slate-50 dark:border-[#1F2B3C] pt-3 space-y-3">
                          <div className="bg-slate-50/70 dark:bg-[#0F141D]/80 p-3 rounded-xl border border-slate-100 dark:border-[#1F2B3C]">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                              <Zap className="w-3.5 h-3.5" />
                              <span className="text-[10px] uppercase tracking-[0.3em]">Физиология</span>
                            </div>
                            <p className="mt-2 text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
                              {phase.details.physiology}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Ощущения</p>
                            <ul className="mt-2 space-y-1.5">
                              {phase.details.sensations.map((s, i) => (
                                <li key={i} className="text-[12px] text-slate-600 dark:text-slate-400 flex gap-2 items-baseline">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-[#3A4B63] shrink-0" />
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

            <div className="ml-10 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/70 dark:bg-emerald-900/15 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/80 dark:bg-[#0F141C]/80 border border-white/60 dark:border-emerald-900/40 flex items-center justify-center">
                <PartyPopper className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Цель достигнута</p>
                <p className="text-[12px] text-emerald-700 dark:text-emerald-300">Финиш протокола и мягкий выход.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-6">
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
          >
            <span>Начать голодание</span>
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
