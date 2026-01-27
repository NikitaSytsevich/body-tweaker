import { createPortal } from 'react-dom'; // 👈
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Mountain, Wind, Brain } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const InfoSheet = ({ onClose }: Props) => {
  const content = (
    <AnimatePresence>
      <>
        {/* Затемнение */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
        />

        {/* Шторка */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex col overflow-hidden max-w-md mx-auto"
        >
          {/* Хендл */}
          <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0" onClick={onClose}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full" />
          </div>

          <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-full transition-colors z-50"
          >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>

          <div className="flex-1 overflow-y-auto pb-safe px-4 pt-2">

            <div className="text-center mb-8 px-4">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Wind className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  О Практике
              </h2>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide">
                  Гиповентиляция
              </p>
            </div>

            <div className="space-y-4 pb-10">
              <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-100 dark:border-white/10 pb-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      <h3 className="font-bold text-slate-800 dark:text-white">Подготовка</h3>
                  </div>
                  <ul className="space-y-2">
                      <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          Ноздри должны быть чистыми.
                      </li>
                      <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          Желудок должен быть пустым.
                      </li>
                      <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          Расслабьте все мышцы тела.
                      </li>
                  </ul>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30">
                  <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-5 h-5" />
                      <h3 className="font-bold">Важно</h3>
                  </div>
                  <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed opacity-90">
                      Не занимайтесь, если вы простужены. Практика должна приносить радость.
                  </p>
              </div>

              <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-100 dark:border-white/10 pb-2">
                      <Brain className="w-5 h-5 text-violet-500" />
                      <h3 className="font-bold text-slate-800 dark:text-white">Перезагрузка мозга</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Техника быстро приводит ум к умиротворению.
                  </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-white dark:to-[#2C2C2E] rounded-2xl p-5 border border-blue-100 dark:border-blue-900/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                      <Mountain className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-900 dark:text-blue-400">Эффект Гор</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                      Создается легкая гипоксия, включающая резервы организма.
                  </p>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
