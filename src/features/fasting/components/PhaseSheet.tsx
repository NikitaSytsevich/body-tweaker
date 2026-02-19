import { createPortal } from 'react-dom';
import { Activity, AlertTriangle, Lightbulb, Thermometer } from 'lucide-react';
import { getPhaseBgClasses, getPhaseTextClasses } from '../data/stages';
import type { FastingStage } from '../data/stages';
import { cn } from '../../../utils/cn';

interface Props {
  phase: FastingStage | null;
}

export const PhaseSheet = ({ phase }: Props) => {
  if (!phase) return null;
  const iconBgClass = getPhaseBgClasses(phase);
  const iconTextClass = getPhaseTextClasses(phase);

  const content = (
    <div className="fixed inset-0 z-[120] app-page animate-fade-in">
      <div className="sticky top-0 z-20 px-4 pt-[calc(var(--app-top-offset)+10px)] pb-3 bg-[linear-gradient(180deg,var(--tg-bg)_0%,color-mix(in_srgb,var(--tg-bg)_88%,transparent)_100%)] backdrop-blur-xl">
        <div className="flex items-center justify-center">
          <div className="tg-chip">Фаза голодания</div>
        </div>
      </div>

      <div className="px-4 pb-24 overflow-y-auto h-[calc(100dvh-var(--app-top-offset)-56px)]">
        <div className="relative rounded-[34px] overflow-hidden border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[var(--app-shadow-card)]">
          <div className="relative h-[28vh] min-h-[210px] bg-[color:var(--tg-glass)]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/6 to-black/50 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn("w-24 h-24 rounded-[30px] flex items-center justify-center shadow-xl", iconBgClass)}>
                <phase.icon className={cn("w-12 h-12", iconTextClass)} />
              </div>
            </div>
          </div>

          <div className="relative -mt-12 px-4 pb-4">
            <div className="rounded-[28px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/95 backdrop-blur-xl p-6 shadow-[var(--app-shadow-soft)]">
              <p className="text-[11px] uppercase tracking-[0.2em] app-muted">Стадия</p>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.12] tracking-tight app-header">
                {phase.subtitle}
              </h2>
              <p className="mt-3 text-[16px] app-muted leading-relaxed">
                {phase.title} · {phase.hoursStart} — {phase.hoursEnd ?? '∞'} ч
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="app-panel rounded-[28px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-[color:var(--tg-accent)]" />
              <h3 className="font-semibold app-header">Физиология</h3>
            </div>
            <p className="text-[16px] leading-[1.72] app-muted font-[Iowan_Old_Style,Georgia,serif]">
              {phase.details.physiology}
            </p>
          </div>

          <div className="app-panel rounded-[28px] overflow-hidden">
            <div className="px-5 py-3 border-b border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold app-header">Что обычно ощущается</h3>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {phase.details.sensations.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[16px] leading-[1.72] app-muted font-[Iowan_Old_Style,Georgia,serif]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {phase.recommendations && (
            <div className="app-panel rounded-[28px] overflow-hidden border-l-4 border-emerald-500">
              <div className="px-5 py-3 border-b border-[color:var(--tg-border)] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">Что помогает пройти фазу комфортно</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  {phase.recommendations.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[16px] leading-[1.72] app-muted font-[Iowan_Old_Style,Georgia,serif]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {phase.precautions && phase.precautions.length > 0 && (
            <div className="rounded-[28px] p-5 border border-rose-200/60 bg-rose-50/70 dark:bg-rose-900/20">
              <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-300">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Меры предосторожности</h3>
              </div>
              <ul className="space-y-2">
                {phase.precautions.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.65] text-rose-800 dark:text-rose-200/90 font-[Iowan_Old_Style,Georgia,serif]">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  return createPortal(content, document.body);
};
