import { AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'warning',
}: ConfirmModalProps) => {
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: { button: 'bg-red-500 hover:bg-red-600 text-white', icon: 'text-red-500' },
    warning: { button: 'bg-orange-500 hover:bg-orange-600 text-white', icon: 'text-orange-500' },
    info: { button: 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-600 text-white', icon: 'text-blue-500' },
  };

  const styles = variantStyles[variant];

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] animate-fade-in"
      />

      {/* Wrapper для центрирования */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-2xl max-w-sm w-full pointer-events-auto overflow-hidden animate-pop-in">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={cn('p-3 rounded-2xl bg-slate-50 dark:bg-[#3A3A3C] shrink-0', styles.icon)}>
                <AlertTriangle className={cn('w-6 h-6', styles.icon)} />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-[900] text-slate-800 dark:text-white leading-tight mb-1">{title}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-snug">{message}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3.5 bg-slate-100 dark:bg-[#3A3A3C] hover:bg-slate-200 dark:hover:bg-[#4A4A4C] text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-colors active:scale-95"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={cn('flex-1 px-4 py-3.5 rounded-xl font-bold text-sm transition-colors active:scale-95 shadow-lg', styles.button)}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
