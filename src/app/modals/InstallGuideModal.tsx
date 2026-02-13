import { createPortal } from 'react-dom';
import { Share, PlusSquare, Smartphone } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fade-in"
      />

      <div className="fixed bottom-0 left-0 right-0 z-[101] app-surface rounded-t-[2.5rem] p-6 pb-10 shadow-2xl max-w-md mx-auto animate-sheet-in border-t border-[color:var(--tg-border)]">
        <div className="w-12 h-1.5 bg-[color:var(--tg-border)] rounded-full mx-auto mb-6" />

        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-[900] app-header leading-tight">
                Установить приложение
            </h2>
            <p className="text-sm app-muted mt-2 px-4">
                Добавьте Body Tweaker на главный экран для быстрого доступа и работы без интернета.
            </p>
        </div>

        <div className="space-y-4 app-panel p-5 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[color:var(--tg-glass)] rounded-lg flex items-center justify-center shrink-0">
                    <span className="font-bold app-muted">1</span>
                </div>
                <div className="text-sm font-medium app-header flex items-center gap-2">
                    Нажмите кнопку <Share className="w-4 h-4 text-blue-500" /> <b>Поделиться</b>
                </div>
            </div>
            <div className="w-full h-px bg-[color:var(--tg-border)]" />
            <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-[color:var(--tg-glass)] rounded-lg flex items-center justify-center shrink-0">
                    <span className="font-bold app-muted">2</span>
                </div>
                <div className="text-sm font-medium app-header flex items-center gap-2">
                    Выберите <PlusSquare className="w-4 h-4 app-muted" /> <b>На экран «Домой»</b>
                </div>
            </div>
        </div>

        <button
            onClick={onClose}
            className="w-full mt-6 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold active:scale-95 transition-transform"
        >
            Понятно
        </button>
      </div>
    </>,
    document.body
  );
};
