// src/app/WelcomeScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { storageSet } from '../utils/storage'; // 👈 NEW

interface Props {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(1);
  
  const handleAgree = async () => {
    await storageSet('has_accepted_terms', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F2F2F7] flex flex-col justify-between p-6 overflow-hidden">
      
      <AnimatePresence mode="wait">
        
        {/* STEP 1: INTRO */}
        {step === 0 && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
          >
            {/* ... (Без изменений в верстке) ... */}
            <div className="relative">
                <div className="absolute inset-4 bg-slate-900 blur-2xl opacity-20 rounded-full" />
                <img src="/logo.svg" alt="Body Tweaker Logo" className="w-32 h-32 rounded-[2.5rem] shadow-2xl relative z-10"/>
            </div>
            
            <div>
                <h1 className="text-4xl font-[900] text-slate-800 tracking-tight leading-tight">Body<br/>Tweaker</h1>
                <p className="text-sm font-bold text-slate-400 mt-3 uppercase tracking-widest">Scientific Biohacking</p>
            </div>

            <div className="max-w-xs text-sm text-slate-500 font-medium leading-relaxed">
                Инструменты для управления метаболизмом, дыханием и состоянием сознания.
            </div>

            <button onClick={handleNext} className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
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
            {/* ... (Верстка Legal без изменений) ... */}
            <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><ShieldCheck className="w-6 h-6 text-blue-600" /></div>
                    <h2 className="text-2xl font-[900] text-slate-800">Важно знать</h2>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6 text-sm text-slate-600 leading-relaxed">
                   <p>Приложение <strong>Body Tweaker</strong> предоставляет информацию и инструменты...</p>
                   {/* ... текст ... */}
                </div>
            </div>

            <div className="pt-4 shrink-0">
                <button onClick={handleAgree} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 active:scale-95 transition-transform">
                    Принять и продолжить
                </button>
                <button onClick={() => setStep(0)} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-wide mt-2 hover:text-slate-600">
                    Назад
                </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
