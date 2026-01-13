import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface Props {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: Props) => {
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(0); // 0 = Logo, 1 = Disclaimer

  // Анимация входа
  const handleStart = () => {
    setStep(1);
  };

  const handleAgree = () => {
    localStorage.setItem('has_accepted_terms', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F2F2F7] flex flex-col items-center justify-center p-6">
      
      <AnimatePresence mode="wait">
        
        {/* ШАГ 1: ЛОГОТИП */}
        {step === 0 && (
          <motion.div 
            key="logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                <Zap className="w-16 h-16 text-white fill-current animate-pulse" />
            </div>
            
            <div>
                <h1 className="text-4xl font-[900] text-slate-800 tracking-tight leading-tight">
                    Body<br/>Tweaker
                </h1>
                <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-widest">
                    Scientific Biohacking
                </p>
            </div>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 mt-10"
            >
                Начать <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* ШАГ 2: ДИСКЛЕЙМЕР */}
        {step === 1 && (
          <motion.div 
            key="terms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/50"
          >
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500">
                <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-[900] text-slate-800 mb-4">
                Важная информация
            </h2>

            <div className="text-sm text-slate-500 leading-relaxed space-y-4 mb-8 h-64 overflow-y-auto pr-2 scrollbar-hide">
                <p>
                    Приложение <strong>Body Tweaker</strong> создано исключительно в информационных и образовательных целях.
                </p>
                <p>
                    Мы не являемся медицинским учреждением, и наши рекомендации не могут заменить профессиональную медицинскую консультацию, диагностику или лечение.
                </p>
                <p className="font-bold text-slate-700">
                    Перед началом любой практики голодания или дыхания, пожалуйста, проконсультируйтесь с врачом.
                </p>
                <p>
                    Используя это приложение, вы подтверждаете, что берете полную ответственность за свое здоровье на себя.
                </p>
            </div>

            <div 
                onClick={() => setIsChecked(!isChecked)}
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer active:scale-98 transition-transform mb-6"
            >
                <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isChecked ? "bg-slate-900 border-slate-900" : "border-slate-300"
                )}>
                    {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-xs font-bold text-slate-600 leading-tight">
                    Я прочитал(а) и принимаю условия использования
                </span>
            </div>

            <button 
                disabled={!isChecked}
                onClick={handleAgree}
                className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    isChecked 
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 active:scale-95" 
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                )}
            >
                Продолжить
            </button>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
