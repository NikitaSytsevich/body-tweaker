import { createPortal } from 'react-dom'; // 👈 Импорт Портала
import { X, Activity, AlertTriangle, Lightbulb, Thermometer } from 'lucide-react';
import type { FastingStage } from '../data/stages';
import { cn } from '../../../utils/cn';

interface Props {
  phase: FastingStage | null;
  onClose: () => void;
}

export const PhaseSheet = ({ phase, onClose }: Props) => {
  if (!phase) return null;

  // Контент модалки
  const content = (
        <>
          {/* Затемнение */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] animate-fade-in"
          />

          {/* Шторка */}
          <div className="fixed bottom-0 left-0 right-0 z-[101] app-surface rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto border-t border-[color:var(--tg-border)] backdrop-blur-2xl animate-sheet-in">
            <div className="w-full flex justify-center pt-3 pb-2 shrink-0" onClick={onClose}>
              <div className="w-12 h-1.5 bg-[color:var(--tg-border)] rounded-full" />
            </div>

            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-[color:var(--tg-glass)] hover:bg-[color:var(--tg-glass-strong)] rounded-full transition-colors z-50 border border-[color:var(--tg-border)]"
            >
                <X className="w-5 h-5 text-[color:var(--tg-muted)]" />
            </button>

            <div className="flex-1 overflow-y-auto pb-safe px-4 pt-2">

              <div className="text-center mb-6 px-4">
                <div className={cn(
                    "w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg",
                    phase.color.replace('text-', 'bg-').replace('600', '100')
                )}>
                    <phase.icon className={cn("w-8 h-8", phase.color)} />
                </div>
                <h2 className="text-2xl font-black app-header leading-tight">
                    {phase.title}
                </h2>
                <p className="text-sm font-medium app-muted mt-1 font-mono uppercase tracking-wide">
                    {phase.hoursStart} — {phase.hoursEnd ?? '∞'} ч
                </p>
              </div>

              <div className="space-y-4 pb-10">

                <div className="app-card p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 border-b border-[color:var(--tg-border)] pb-2">
                        <Activity className="w-5 h-5 text-[color:var(--tg-accent)]" />
                        <h3 className="font-bold app-header">Физиология</h3>
                    </div>
                    <p className="text-sm app-muted leading-relaxed">
                        {phase.details.physiology}
                    </p>
                </div>

                <div className="app-card overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <h3 className="font-bold text-sm app-muted uppercase tracking-wide">Что вы чувствуете</h3>
                    </div>
                    <div className="p-5">
                        <ul className="space-y-3">
                            {phase.details.sensations.map((item, i) => (
                                <li key={i} className="flex gap-3 text-sm app-muted">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {phase.recommendations && (
                    <div className="app-card overflow-hidden shadow-sm border-l-4 border-green-500">
                        <div className="px-5 py-3 border-b border-[color:var(--tg-border)] flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-green-600" />
                            <h3 className="font-bold text-sm text-green-700 dark:text-green-400 uppercase tracking-wide">Советы</h3>
                        </div>
                        <div className="p-5">
                            <ul className="space-y-3">
                                {phase.recommendations.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm app-muted">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {phase.precautions && phase.precautions.length > 0 && (
                    <div className="rounded-2xl p-5 border border-rose-200/60 bg-rose-50/70 dark:bg-rose-900/20">
                        <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-bold">Меры предосторожности</h3>
                        </div>
                        <ul className="space-y-2">
                            {phase.precautions.map((item, i) => (
                                <li key={i} className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed opacity-80">
                                    • {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

              </div>
            </div>
          </div>
        </>
  );

  // Рендерим в body
  return createPortal(content, document.body);
};
