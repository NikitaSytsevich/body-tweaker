// src/app/WelcomeScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, ChevronRight, Smartphone } from 'lucide-react';
import { storageSet } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const { theme } = useTheme();

  const handleNext = () => setStep(1);

  // Асинхронное сохранение согласия
  const handleAgree = async () => {
    await storageSet('has_accepted_terms', 'true');
    onComplete();
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col justify-between p-6 overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#FFE5E0]'
    }`}>

      <AnimatePresence mode="wait">

        {/* STEP 1: INTRO (Telegram-style) */}
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            {/* Логотип приложения */}
            <div className="relative mb-8">
              {/* Логотип с градиентной подложкой */}
              <div className={`w-40 h-40 rounded-[2.5rem] flex items-center justify-center relative shadow-2xl transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#2C2C2E] to-slate-800 border-4 border-white/10'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white'
              }`}>
                <img
                  src="/logo.svg?v=2"
                  alt="Body Tweaker Logo"
                  className="w-24 h-24 rounded-2xl shadow-xl"
                />
              </div>

              {/* Иконка телефона под логотипом */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#2C2C2E] border-2 border-white/10'
                    : 'bg-white border-2 border-slate-100'
                }`}>
                  <Smartphone className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`} />
                </div>
              </div>
            </div>

            {/* Заголовок и описание */}
            <div className="mt-24 mb-8">
              <h1 className={`text-4xl font-black tracking-tight leading-tight mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]'
              }`}>
                Body Tweaker
              </h1>
              <p className={`text-base font-medium leading-relaxed max-w-xs transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-[#4a4a4a]'
              }`}>
                Научный подход к голоданию, дыханию и оздоровлению организма
              </p>
            </div>

            {/* Кнопка */}
            <button
              onClick={handleNext}
              className={`w-full max-w-xs text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  : 'bg-[#64B5F6] hover:bg-[#54A5E6]'
              }`}
            >
              Начать <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: LEGAL */}
        {step === 1 && (
          <motion.div
            key="legal"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col h-full pt-10"
          >
            <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl shadow-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-white'
                }`}>
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className={`text-2xl font-[900] transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  Важно знать
                </h2>
              </div>

              <div className={`rounded-[2rem] p-6 shadow-sm border space-y-6 text-sm leading-relaxed transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-[#2C2C2E] border-white/10 text-slate-300'
                  : 'bg-white border-slate-100 text-slate-600'
              }`}>
                <p>
                  Приложение <strong>Body Tweaker</strong> предоставляет информацию и инструменты для отслеживания интервального голодания и дыхательных практик.
                </p>

                <div className={`p-4 rounded-xl border-l-4 border-orange-400 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#3A3A3C]' : 'bg-slate-50'
                }`}>
                  <h3 className={`font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>
                    <Activity className="w-4 h-4 text-orange-500" />
                    Отказ от ответственности
                  </h3>
                  <p className={`text-xs transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Мы не являемся медицинским учреждением. Информация в приложении не заменяет консультацию врача.
                  </p>
                </div>

                <ul className={`space-y-3 list-disc pl-4 transition-colors duration-300 ${
                  theme === 'dark' ? 'marker:text-slate-600' : 'marker:text-slate-300'
                }`}>
                  <li>
                    Используя таймер голодания, вы подтверждаете, что у вас нет противопоказаний.
                  </li>
                  <li>
                    Дыхательные практики могут вызывать головокружение. Выполняйте их в безопасной обстановке.
                  </li>
                </ul>

                <p className={`text-xs mt-4 pt-4 border-t transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'text-slate-500 border-white/10'
                    : 'text-slate-400 border-slate-100'
                }`}>
                  Нажимая «Принять», вы соглашаетесь с Условиями использования.
                </p>
              </div>
            </div>

            <div className="pt-4 shrink-0">
              <button
                onClick={handleAgree}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 active:scale-95 transition-all hover:bg-blue-700"
              >
                Принять и продолжить
              </button>
              <button
                onClick={() => setStep(0)}
                className={`w-full py-3 font-bold text-xs uppercase tracking-wide mt-2 transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Назад
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
