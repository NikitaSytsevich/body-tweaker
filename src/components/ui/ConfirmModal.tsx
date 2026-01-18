import { motion, AnimatePresence } from 'framer-motion';
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
    info: { button: 'bg-blue-500 hover:bg-blue-600 text-white', icon: 'text-blue-500' },
  };

  const styles = variantStyles[variant];

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />

          {/* Wrapper для центрирования */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full pointer-events-auto overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('p-3 rounded-2xl bg-slate-50 shrink-0', styles.icon)}>
                    <AlertTriangle className={cn('w-6 h-6', styles.icon)} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-[900] text-slate-800 leading-tight mb-1">{title}</h3>
                    <p className="text-sm font-medium text-slate-500 leading-snug">{message}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors active:scale-95"
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
