// src/app/WelcomeScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import { storageSet } from '../utils/storage';

interface Props {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(1);

  // Асинхронное сохранение согласия
  const handleAgree = async () => {
    await storageSet('has_accepted_terms', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FFE5E0] flex flex-col justify-between p-6 overflow-hidden">

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
            {/* Иконка приложения в круге */}
            <div className="relative mb-8">
              {/* Голубой круг с иконкой */}
              <div className="w-40 h-40 bg-[#64B5F6] rounded-full flex items-center justify-center relative">
                {/* Белый символ ДНК/Здоровья */}
                <div className="text-white">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Схематичное изображение ДНК */}
                    <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <path d="M12 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 18V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Рука, держащая телефон */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  {/* Левая рука */}
                  <ellipse cx="50" cy="60" rx="25" ry="15" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 1 */}
                  <ellipse cx="80" cy="45" rx="8" ry="12" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 2 */}
                  <ellipse cx="90" cy="55" rx="8" ry="14" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 3 */}
                  <ellipse cx="95" cy="68" rx="7" ry="13" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 4 */}
                  <ellipse cx="92" cy="80" rx="6" ry="10" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>

                  {/* Телефон */}
                  <rect x="70" y="20" width="60" height="100" rx="10" fill="#FFB6A3" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Экран телефона */}
                  <rect x="75" y="28" width="50" height="75" rx="5" fill="#FFE5E0"/>

                  {/* Правая рука */}
                  <ellipse cx="150" cy="60" rx="25" ry="15" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 1 */}
                  <ellipse cx="120" cy="45" rx="8" ry="12" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 2 */}
                  <ellipse cx="110" cy="55" rx="8" ry="14" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 3 */}
                  <ellipse cx="105" cy="68" rx="7" ry="13" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                  {/* Палец 4 */}
                  <ellipse cx="108" cy="80" rx="6" ry="10" fill="#FFD1C1" stroke="#1a1a1a" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Заголовок и описание */}
            <div className="mt-24 mb-8">
              <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight leading-tight mb-4">
                Body Tweaker
              </h1>
              <p className="text-base text-[#4a4a4a] font-medium leading-relaxed max-w-xs">
                Научный подход к голоданию, дыханию и оздоровлению организма
              </p>
            </div>

            {/* Кнопка */}
            <button
              onClick={handleNext}
              className="w-full max-w-xs bg-[#64B5F6] text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
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
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-[900] text-slate-800">
                  Важно знать
                </h2>
              </div>

              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6 text-sm text-slate-600 leading-relaxed">
                <p>
                  Приложение <strong>Body Tweaker</strong> предоставляет информацию и инструменты для отслеживания интервального голодания и дыхательных практик.
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-orange-400">
                  <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    Отказ от ответственности
                  </h3>
                  <p className="text-xs text-slate-500">
                    Мы не являемся медицинским учреждением. Информация в приложении не заменяет консультацию врача.
                  </p>
                </div>

                <ul className="space-y-3 list-disc pl-4 marker:text-slate-300">
                  <li>
                    Используя таймер голодания, вы подтверждаете, что у вас нет противопоказаний.
                  </li>
                  <li>
                    Дыхательные практики могут вызывать головокружение. Выполняйте их в безопасной обстановке.
                  </li>
                </ul>

                <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
                  Нажимая «Принять», вы соглашаетесь с Условиями использования.
                </p>
              </div>
            </div>

            <div className="pt-4 shrink-0">
              <button
                onClick={handleAgree}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 active:scale-95 transition-transform"
              >
                Принять и продолжить
              </button>
              <button
                onClick={() => setStep(0)}
                className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-wide mt-2 hover:text-slate-600"
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
