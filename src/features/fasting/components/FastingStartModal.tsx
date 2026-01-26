import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map, Rocket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FastingStartModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();

  const handleGoToMap = () => {
    onClose();
    navigate('/'); 
  };

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
          />

          {/* Modal Card */}
          {/* 
             ИСПРАВЛЕНИЕ:
             1. inset-0 + flex + items-center + justify-center: самый надежный способ центрирования
             2. pointer-events-none на контейнере, pointer-events-auto на карточке
          */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-sm bg-white dark:bg-[#2C2C2E] rounded-[2.5rem] shadow-2xl overflow-hidden relative pointer-events-auto"
              >
                  {/* Декоративный фон */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 dark:from-blue-900/20 to-white dark:to-[#2C2C2E] -z-10" />

                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 rounded-full transition-colors z-20"
                  >
                    <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </button>

                  <div className="p-6 flex flex-col items-center text-center pt-8">
                    {/* Иконка */}
                    <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 rotate-3">
                        <Rocket className="w-10 h-10 text-white fill-current" />
                    </div>

                    <h2 className="text-2xl font-[900] text-slate-800 dark:text-white leading-tight mb-3">
                        Голодание запущено!
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 px-2">
                        Таймер начал отсчет. Теперь вы можете следить за процессами в организме на <b>Карте</b>.
                    </p>

                    {/* Кнопки */}
                    <div className="w-full space-y-3">
                        <button
                            onClick={handleGoToMap}
                            className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl shadow-slate-900/20 dark:shadow-black/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            <Map className="w-5 h-5" />
                            <span>Открыть Карту</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wide hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                        >
                            Остаться здесь
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
