import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 border border-slate-100 dark:border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400 rounded-full hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
