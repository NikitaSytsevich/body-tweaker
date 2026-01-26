import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, Smartphone } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal = ({ isOpen, onClose }: Props) => {
  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] p-6 pb-10 shadow-2xl max-w-md mx-auto"
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-6" />

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                    <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-[900] text-slate-800 dark:text-white leading-tight">
                    Установить приложение
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-4">
                    Добавьте Body Tweaker на главный экран для быстрого доступа и работы без интернета.
                </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-[#2C2C2E] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-50 dark:bg-[#3A3A3C] rounded-lg flex items-center justify-center shrink-0">
                        <span className="font-bold text-slate-400 dark:text-slate-500">1</span>
                    </div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        Нажмите кнопку <Share className="w-4 h-4 text-blue-500" /> <b>Поделиться</b>
                    </div>
                </div>
                <div className="w-full h-px bg-slate-50 dark:bg-white/10" />
                <div className="flex items-center gap-4">
                     <div className="w-8 h-8 bg-slate-50 dark:bg-[#3A3A3C] rounded-lg flex items-center justify-center shrink-0">
                        <span className="font-bold text-slate-400 dark:text-slate-500">2</span>
                    </div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        Выберите <PlusSquare className="w-4 h-4 text-slate-400 dark:text-slate-600" /> <b>На экран «Домой»</b>
                    </div>
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full mt-6 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold active:scale-95 transition-transform"
            >
                Понятно
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
