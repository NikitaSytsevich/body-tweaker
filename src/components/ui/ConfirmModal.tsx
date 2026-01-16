import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
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
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      button: 'bg-red-500 hover:bg-red-600 text-white',
      icon: 'text-red-500',
    },
    warning: {
      button: 'bg-orange-500 hover:bg-orange-600 text-white',
      icon: 'text-orange-500',
    },
    info: {
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
      icon: 'text-blue-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={cn('p-2 rounded-full bg-opacity-10', styles.icon)}>
              <AlertTriangle className={cn('w-6 h-6', styles.icon)} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-600">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={cn('flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors', styles.button)}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
