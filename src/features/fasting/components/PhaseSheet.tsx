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
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto animate-sheet-in">
            <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0" onClick={onClose}>
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full" />
            </div>

            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-gray-200/50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors z-50"
            >
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>

            <div className="flex-1 overflow-y-auto pb-safe px-4 pt-2">

              <div className="text-center mb-6 px-4">
                <div className={cn(
                    "w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg",
                    phase.color.replace('text-', 'bg-').replace('600', '100')
                )}>
                    <phase.icon className={cn("w-8 h-8", phase.color)} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {phase.title}
                </h2>
                <p className="text-sm font-medium text-gray-400 dark:text-slate-500 mt-1 font-mono uppercase tracking-wide">
                    {phase.hoursStart} — {phase.hoursEnd ?? '∞'} ч
                </p>
              </div>

              <div className="space-y-4 pb-10">

                <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 border-b border-gray-100 dark:border-white/10 pb-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Физиология</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                        {phase.details.physiology}
                    </p>
                </div>

                <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#3A3A3C] flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <h3 className="font-bold text-sm text-gray-500 dark:text-slate-400 uppercase tracking-wide">Что вы чувствуете</h3>
                    </div>
                    <div className="p-5">
                        <ul className="space-y-3">
                            {phase.details.sensations.map((item, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {phase.recommendations && (
                    <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl overflow-hidden shadow-sm border-l-4 border-green-500">
                        <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-green-600" />
                            <h3 className="font-bold text-sm text-green-700 dark:text-green-400 uppercase tracking-wide">Советы</h3>
                        </div>
                        <div className="p-5">
                            <ul className="space-y-3">
                                {phase.recommendations.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {phase.precautions && phase.precautions.length > 0 && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30">
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
