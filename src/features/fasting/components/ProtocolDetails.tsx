import { useState } from 'react';
import { ChevronLeft, Play, Clock, Activity, ChevronDown, Zap, PartyPopper } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { FASTING_PHASES, getPhaseAccentTextClasses } from '../data/stages';
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
  const accentText = scheme.color;
  const accentBorder = scheme.color.replace('text-', 'border-');
  const accentBg = scheme.color.replace('text-', 'bg-');
  const [titleMain, titleSub] = scheme.title.split(':');

  const togglePhase = (id: number) => {
    setExpandedPhaseId(current => current === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full app-surface relative overflow-hidden animate-slide-in-right">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 pt-4 pb-3 bg-[color:var(--tg-bg)]/85 backdrop-blur border-b border-[color:var(--tg-border)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-[color:var(--tg-glass)] rounded-full flex items-center justify-center shadow-sm border border-[color:var(--tg-border)] text-[color:var(--tg-muted)] active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 ml-[-2px]" />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] app-muted">
              Обзор протокола
            </p>
            <h2 className="text-[18px] font-semibold app-header">
              {titleMain}
            </h2>
          </div>
        </div>
        <span className={cn('tg-chip border', accentText, accentBorder)}>
          {scheme.hours}ч
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10 scrollbar-hide">
        <div className="relative mt-4 rounded-[32px] app-card overflow-hidden">
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[color:var(--tg-glass)] border border-[color:var(--tg-border)] flex items-center justify-center shadow-sm">
                <scheme.icon className={cn('w-7 h-7', accentText)} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] app-muted">
                  {titleSub?.trim() || scheme.title}
                </p>
                <h3 className="mt-2 text-[22px] font-[800] app-header leading-tight">
                  {scheme.description}
                </h3>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-3">
                <div className="flex items-center gap-2 app-muted">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-[0.3em]">Длительность</span>
                </div>
                <p className="mt-2 text-[18px] font-semibold app-header">
                  ~{Math.round(scheme.hours / 24 * 10) / 10} дня
                </p>
              </div>
              <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-3">
                <div className="flex items-center gap-2 app-muted">
                  <Activity className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-[0.3em]">Этапы</span>
                </div>
                <p className="mt-2 text-[18px] font-semibold app-header">
                  {relevantPhases.length} фаз
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] app-muted">
              Маршрут фаз
            </p>
            <span className="text-[12px] app-muted">
              {relevantPhases.length} этапов
            </span>
          </div>

          <div className="relative mt-4 space-y-3">
          <div className={cn(
              'absolute left-[25px] top-6 bottom-10 w-[2px] rounded-full',
              accentBg,
              'opacity-30'
            )} />

            {relevantPhases.map((phase, index) => {
              const isExpanded = expandedPhaseId === phase.id;
              const iconColorClass = getPhaseAccentTextClasses(phase);

              return (
                <div key={phase.id} className="relative">
                  <div className={cn(
                    'absolute left-[14px] top-6 h-6 w-6 rounded-full border-2 bg-[color:var(--tg-surface)] shadow-sm flex items-center justify-center text-[10px] font-semibold',
                    isExpanded ? 'border-[color:var(--tg-text)] text-[color:var(--tg-text)]' : 'border-[color:var(--tg-border)] text-[color:var(--tg-muted)]'
                  )}>
                    {index + 1}
                  </div>

                  <div
                    onClick={() => togglePhase(phase.id)}
                    className={cn(
                      'ml-10 rounded-2xl border bg-[color:var(--tg-surface)] shadow-sm transition-all cursor-pointer overflow-hidden',
                      isExpanded ? 'border-[color:var(--tg-accent)] ring-1 ring-[color:var(--tg-accent)]/15' : 'border-[color:var(--tg-border)] hover:border-[color:var(--tg-accent)]/40'
                    )}
                  >
                    <div className="p-4 flex items-start gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        isExpanded ? 'bg-[color:var(--tg-glass)]' : 'bg-[color:var(--tg-glass)]'
                      )}>
                        <phase.icon className={cn('w-5 h-5', iconColorClass)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.3em] app-muted">
                            {phase.hoursStart}ч+
                          </span>
                          <ChevronDown className={cn('w-4 h-4 text-[color:var(--tg-muted)] transition-transform', isExpanded && 'rotate-180')} />
                        </div>
                        <h4 className="mt-1 text-[15px] font-semibold app-header">
                          {phase.title}
                        </h4>
                        <p className="mt-2 text-[12px] app-muted line-clamp-2">
                          {phase.subtitle}
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="border-t border-[color:var(--tg-border)] pt-3 space-y-3">
                          <div className="bg-[color:var(--tg-glass)] p-3 rounded-xl border border-[color:var(--tg-border)]">
                            <div className="flex items-center gap-2 app-muted">
                              <Zap className="w-3.5 h-3.5" />
                              <span className="text-[10px] uppercase tracking-[0.3em]">Физиология</span>
                            </div>
                            <p className="mt-2 text-[12px] app-muted leading-relaxed">
                              {phase.details.physiology}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] app-muted">Ощущения</p>
                            <ul className="mt-2 space-y-1.5">
                              {phase.details.sensations.map((s, i) => (
                                <li key={i} className="text-[12px] app-muted flex gap-2 items-baseline">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--tg-border)] shrink-0" />
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

            <div className="ml-10 rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[color:var(--tg-surface)] border border-[color:var(--tg-border)] flex items-center justify-center">
                <PartyPopper className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-600">Цель достигнута</p>
                <p className="text-[12px] text-emerald-700">Финиш протокола и мягкий выход.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-6">
          <button
            onClick={onStart}
            className="tg-button w-full py-4 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>Начать голодание</span>
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
