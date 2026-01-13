import { motion } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Zap, Mountain, Wind, Brain } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const InfoSheet = ({ onClose }: Props) => {
  return (
    <>
      {/* Затемнение */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      />

      {/* Шторка */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
      >
        {/* Хендл */}
        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] shrink-0" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Кнопка закрытия */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-200/50 hover:bg-gray-200 rounded-full transition-colors z-50"
        >
            <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto pb-safe px-4 pt-2">
          
          {/* Заголовок */}
          <div className="text-center mb-8 px-4">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg bg-blue-50 text-blue-600">
                <Wind className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
                О Практике
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wide">
                Гиповентиляция
            </p>
          </div>

          {/* БЛОКИ ИНФОРМАЦИИ */}
          <div className="space-y-4 pb-10">
            
            {/* 1. Подготовка */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-800">Подготовка</h3>
                </div>
                <ul className="space-y-2">
                    <li className="flex gap-3 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Ноздри должны быть чистыми.
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Желудок должен быть пустым (через 2-3 часа после еды).
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Расслабьте все мышцы тела.
                    </li>
                </ul>
            </div>

            {/* 2. Важно (Предостережение) */}
            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                <div className="flex items-center gap-2 mb-2 text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-bold">Важно</h3>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed opacity-90">
                    Не занимайтесь, если вы простужены и не можете свободно дышать носом. Не делайте практику через силу — она должна приносить радость.
                </p>
            </div>

            {/* 3. Эффект для ума */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                    <Brain className="w-5 h-5 text-violet-500" />
                    <h3 className="font-bold text-slate-800">Перезагрузка мозга</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Эта техника быстрее всех приводит ум от беспокойства к умиротворению. Всего пару минут, и вы — другой человек. Без лекарств и химии.
                </p>
            </div>

            {/* 4. Механизм (Гипоксия) */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Mountain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-900">Эффект Гор (Гипоксия)</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    Вы дышите меньше обычного. Это создает легкий недостаток кислорода (гипоксию).
                </p>
                <div className="bg-white/60 rounded-xl p-3 text-xs font-medium text-slate-500 border border-blue-50">
                    <Zap className="w-3 h-3 inline mr-1 text-orange-500" />
                    Это включает резервные силы организма, повышает иммунитет и запускает самооздоровление. Как будто вы побывали высоко в горах.
                </div>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
};
