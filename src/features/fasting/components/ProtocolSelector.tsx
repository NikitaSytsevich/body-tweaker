import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { cn } from '../../../utils/cn';
import { ProtocolDetails } from './ProtocolDetails';

interface Props {
  onSelect: (id: string) => void;
  onClose: () => void;
  currentSchemeId?: string;
}

export const ProtocolSelector = ({ onSelect, onClose, currentSchemeId }: Props) => {
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);

  const CHIP_STYLES: Record<string, string> = {
    '24h': 'border-sky-200 text-sky-600 dark:border-sky-700 dark:text-sky-300',
    '36h': 'border-emerald-200 text-emerald-600 dark:border-emerald-700 dark:text-emerald-300',
    '48h': 'border-violet-200 text-violet-600 dark:border-violet-700 dark:text-violet-300',
    '72h': 'border-rose-200 text-rose-600 dark:border-rose-700 dark:text-rose-300',
    '96h': 'border-indigo-200 text-indigo-600 dark:border-indigo-700 dark:text-indigo-300',
    '120h': 'border-fuchsia-200 text-fuchsia-600 dark:border-fuchsia-700 dark:text-fuchsia-300',
    '168h': 'border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  };

  const handlePreview = (id: string) => {
    setSelectedPreviewId(id);
  };

  const handleStart = () => {
    if (selectedPreviewId) {
        onSelect(selectedPreviewId);
        onClose();
    }
  };

  const ModalContent = (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/5 dark:bg-black/40 backdrop-blur-[2px] animate-fade-in"
      />

      <div className="fixed bottom-0 left-0 right-0 z-[101] app-surface rounded-t-[2.5rem] h-[85vh] shadow-[0_-16px_40px_-26px_rgba(15,23,42,0.35)] flex flex-col overflow-hidden max-w-md mx-auto border-t border-[color:var(--tg-border)] backdrop-blur-2xl animate-sheet-in">

        <div className="w-full flex justify-center pt-3 pb-2 shrink-0 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-[color:var(--tg-border)] rounded-full" />
        </div>

        {/* ЭКРАН ДЕТАЛЕЙ */}
        {selectedPreviewId ? (
            <ProtocolDetails 
                schemeId={selectedPreviewId} 
                onBack={() => setSelectedPreviewId(null)}
                onStart={handleStart}
            />
        ) : (
            /* ЭКРАН СПИСКА (ОБЛЕГЧЕННЫЙ) */
            <div className="flex flex-col h-full animate-fade-in">
                <div className="px-6 pt-2 pb-6 flex justify-between items-end shrink-0">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] app-muted">
                            Выбор протокола
                        </p>
                        <h2 className="mt-2 text-2xl font-[900] app-header leading-none">
                            Длительность и цель
                        </h2>
                        <p className="text-[13px] app-muted mt-2 max-w-[240px] leading-relaxed">
                            Откройте протокол, чтобы посмотреть детали и подготовку.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 bg-[color:var(--tg-glass)] rounded-full flex items-center justify-center shadow-sm border border-[color:var(--tg-border)] text-[color:var(--tg-muted)] hover:text-[color:var(--tg-text)] active:scale-95 transition-transform"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-3 pt-0 scrollbar-hide">
                    {FASTING_SCHEMES.map((s) => {
                        const isSelected = currentSchemeId === s.id;
                        // "24ч: База" -> "База"
                        const titleClean = s.title.split(':')[1]?.trim() || s.title;
                        const chipStyle = CHIP_STYLES[s.id] ?? 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300';
                        
                        return (
                            <button
                                key={s.id}
                                onClick={() => handlePreview(s.id)}
                                className={cn(
                                    "w-full text-left relative overflow-hidden rounded-[22px] border",
                                    "bg-[color:var(--tg-surface)] backdrop-blur",
                                    "shadow-[0_12px_30px_-24px_rgba(15,23,42,0.25)]",
                                    isSelected
                                        ? "border-[color:var(--tg-accent)] ring-1 ring-[color:var(--tg-accent)]/20"
                                        : "border-[color:var(--tg-border)]"
                                )}
                            >
                                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[color:var(--tg-border)]" />

                                <div className="relative z-10 flex items-start gap-4 p-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                        "bg-[color:var(--tg-glass)]"
                                    )}>
                                        <s.icon className={cn("w-6 h-6 opacity-80", s.color)} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-semibold text-[16px] app-header leading-tight">
                                                {titleClean}
                                            </h3>
                                            <span className={cn(
                                                "tg-chip text-[10px] tracking-[0.12em] border",
                                                chipStyle
                                            )}>
                                                {s.hours}ч
                                            </span>
                                        </div>
                                        <p className="mt-2 text-[13px] leading-relaxed app-muted line-clamp-2">
                                            {s.description}
                                        </p>
                                    </div>

                                    <div className="pt-1">
                                        {isSelected ? (
                                            <div className="w-6 h-6 bg-[color:var(--tg-accent)] rounded-full flex items-center justify-center text-white shadow-sm">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-[color:var(--tg-muted)]" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                    <div className="h-8" />
                </div>
            </div>
        )}

      </div>
    </>
  );

  return createPortal(
    ModalContent, 
    document.body
  );
};
