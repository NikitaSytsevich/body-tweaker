import { createPortal } from 'react-dom';
import { X, Rocket } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FastingStartModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] animate-fade-in"
      />

      {/* Modal Card */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-sm bg-[color:var(--tg-surface)] rounded-[2.5rem] border border-[color:var(--tg-border)] shadow-2xl overflow-hidden relative pointer-events-auto animate-pop-in">
          {/* Декоративный фон */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[color:var(--tg-glass)] to-[color:var(--tg-surface)] -z-10" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[color:var(--tg-glass)] hover:bg-[color:var(--tg-glass-strong)] rounded-full border border-[color:var(--tg-border)] transition-colors z-20"
          >
            <X className="w-5 h-5 app-muted" />
          </button>

          <div className="p-6 flex flex-col items-center text-center pt-8">
            {/* Иконка */}
            <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 rotate-3">
              <Rocket className="w-10 h-10 text-white fill-current" />
            </div>

            <h2 className="text-2xl font-[900] app-header leading-tight mb-3">
              Голодание запущено!
            </h2>

            <p className="text-sm app-muted leading-relaxed mb-8 px-2">
              Таймер начал отсчет. Продолжайте сессию на текущем экране.
            </p>

            {/* Кнопки */}
            <div className="w-full">
              <button
                onClick={onClose}
                className="w-full py-3 app-muted font-bold text-xs uppercase tracking-wide hover:text-[color:var(--tg-text)] transition-colors"
              >
                Остаться здесь
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
