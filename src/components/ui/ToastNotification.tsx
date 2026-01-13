import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const ToastNotification = ({ isVisible, title, message, onClose }: ToastProps) => {
  
  // Авто-закрытие
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          
          // 👇 КЛЮЧЕВОЙ МОМЕНТ:
          // fixed: фиксируем относительно окна
          // pointer-events-none: разрешаем кликать сквозь пустые места
          // touch-none: запрещаем свайпать страницу, если палец на уведомлении (опционально)
          className="fixed top-4 left-4 right-4 z-[9999] flex justify-center pointer-events-none"
        >
          <div 
            onClick={onClose}
            // 👇 Разрешаем клик только по самой плашке
            className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl shadow-blue-900/20 rounded-[2rem] p-4 pr-6 flex items-center gap-4 max-w-sm w-full pointer-events-auto cursor-pointer active:scale-95 transition-transform"
          >
            {/* Иконка */}
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                <Sparkles className="w-6 h-6 text-white fill-current animate-pulse" />
            </div>

            {/* Текст */}
            <div className="flex-1 min-w-0 text-left"> {/* text-left важно */}
                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                    {title}
                </h4>
                <p className="text-xs text-slate-500 leading-tight mt-1 line-clamp-2 font-medium">
                    {message}
                </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
