import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Clock3, Sparkles } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { cn } from '../../../utils/cn';

interface Props {
  onSelect: (id: string) => void;
  onClose: () => void;
  currentSchemeId?: string;
}

export const ProtocolSelector = ({ onSelect, onClose, currentSchemeId }: Props) => {
  const [selectedId, setSelectedId] = useState(currentSchemeId ?? FASTING_SCHEMES[0]?.id ?? '24h');

  const selectedScheme = useMemo(
    () => FASTING_SCHEMES.find((scheme) => scheme.id === selectedId) ?? FASTING_SCHEMES[0],
    [selectedId]
  );

  const handleConfirm = () => {
    if (!selectedId) return;
    onSelect(selectedId);
    onClose();
  };

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-[3px] animate-fade-in"
      />

      <div className="fixed bottom-0 left-0 right-0 z-[101] mx-auto flex h-[84vh] w-full max-w-md flex-col overflow-hidden rounded-t-[2.5rem] border-t border-[color:var(--tg-border)] app-surface shadow-[0_-20px_44px_-24px_rgba(15,23,42,0.45)] animate-sheet-in">
        <div className="w-full shrink-0 px-6 pt-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[color:var(--tg-border)]" />

          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] app-muted">Выбор протокола</p>
              <h2 className="mt-2 text-[26px] font-[900] leading-none app-header">Подберите формат</h2>
              <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed app-muted">
                Один экран без лишних переходов. Выберите длительность и начните цикл.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] transition-transform active:scale-95"
              aria-label="Закрыть"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto px-4 pb-[calc(7.5rem+var(--app-safe-bottom))] scrollbar-hide">
          {FASTING_SCHEMES.map((scheme) => {
            const isSelected = scheme.id === selectedId;
            return (
              <button
                key={scheme.id}
                onClick={() => setSelectedId(scheme.id)}
                className={cn(
                  'relative w-full overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-200',
                  'bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(245,248,255,0.86))] dark:bg-[linear-gradient(160deg,rgba(39,44,53,0.95),rgba(29,33,40,0.9))]',
                  isSelected
                    ? 'border-[color:var(--tg-accent)] shadow-[0_16px_34px_-24px_rgba(59,130,246,0.5)] ring-1 ring-[color:var(--tg-accent)]/25'
                    : 'border-[color:var(--tg-border)] shadow-[0_10px_28px_-24px_rgba(15,23,42,0.3)]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)]">
                    <scheme.icon className={cn('h-6 w-6', scheme.color)} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[16px] font-semibold leading-tight app-header">{scheme.title}</h3>
                      <div
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
                          isSelected
                            ? 'border-[color:var(--tg-accent)] bg-[color:var(--tg-accent)] text-white'
                            : 'border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] text-transparent'
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    <p className="mt-2 text-[13px] leading-relaxed app-muted">{scheme.description}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] app-muted uppercase">
                        <Clock3 className="h-3.5 w-3.5" />
                        {scheme.hours}ч
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="pointer-events-auto absolute inset-x-0 bottom-0 border-t border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 px-4 pb-[calc(0.95rem+var(--app-safe-bottom))] pt-3 backdrop-blur-xl"
          style={{ paddingBottom: 'calc(0.95rem + var(--app-safe-bottom))' }}
        >
          <div className="mb-2 flex items-center gap-2 rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-2">
            <Sparkles className="h-4 w-4 text-[color:var(--tg-accent)]" />
            <p className="truncate text-[12px] app-muted">
              Выбрано: <span className="font-semibold text-[color:var(--tg-text)]">{selectedScheme?.title}</span>
            </p>
          </div>

          <button onClick={handleConfirm} className="tg-button w-full py-3.5 text-sm font-semibold">
            Выбрать протокол
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};
