import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Droplets, Feather, ShieldCheck, Scroll } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SovietProtocolSheet = ({ isOpen, onClose }: Props) => {
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] rounded-t-[2.5rem] h-[90vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] shrink-0" onClick={onClose}>
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-gray-200/50 hover:bg-gray-200 rounded-full transition-colors z-50"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-safe px-4 pt-2">
              
              {/* HEADER */}
              <div className="text-center mb-8 px-4 pt-4">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-red-100 rotate-3">
                    <BookOpen className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-[900] text-slate-800 leading-tight">
                    Метод РДТ
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    По Ю.С. Николаеву
                </p>
              </div>

              <div className="space-y-4 pb-10">
                
                {/* Цитата */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                    <Scroll className="w-12 h-12 text-slate-100 absolute -right-2 -bottom-2 rotate-[-15deg]" />
                    <p className="text-sm font-serif italic text-slate-600 leading-relaxed relative z-10">
                        «Голодание — это не просто отсутствие пищи. Это естественная биологическая операция без ножа, которую проводит сама природа.»
                    </p>
                </div>

                {/* 1. Питание до */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
                        <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
                            <Feather className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800">Вход в голод</h3>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-slate-600">
                            <span className="text-green-500 font-bold">•</span>
                            <span>
                                <strong>За 3 дня:</strong> Исключить животные белки (мясо, яйца, молочное). Перейти на растительно-молочную диету.
                            </span>
                        </li>
                        <li className="flex gap-3 text-sm text-slate-600">
                            <span className="text-green-500 font-bold">•</span>
                            <span>
                                <strong>Накануне:</strong> Легкий ужин. Каши на воде, тушеные овощи или кефир.
                            </span>
                        </li>
                    </ul>
                </div>

                {/* 2. Очищение (Спорный момент, но по книге) */}
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3 border-b border-blue-100 pb-2">
                        <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm">
                            <Droplets className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-blue-900">Очищение (Магнезия)</h3>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed mb-2">
                        Советская школа настаивает на приеме солевого слабительного (сульфат магния) перед стартом.
                    </p>
                    <div className="bg-white/60 p-3 rounded-xl text-xs text-blue-700 font-medium">
                        Это полностью «выключает» пищеварительный тракт и блокирует чувство голода на следующие дни.
                    </div>
                </div>

                {/* 3. Психология */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
                        <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800">Психологический настрой</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Николаев подчеркивал: вы не «голодаете» (страдаете), вы проводите <strong>лечебную процедуру</strong>. Воспринимайте это как отдых для органов, которые трудились без выходных всю вашу жизнь.
                    </p>
                </div>

                {/* Footer Note */}
                <div className="text-center px-6">
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        Основано на книге «Голодание ради здоровья» (1988).<br/>
                        Методика разгрузочно-диетической терапии (РДТ).
                    </p>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
