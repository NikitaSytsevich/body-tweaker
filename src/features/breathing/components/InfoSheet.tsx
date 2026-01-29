// src/features/breathing/components/InfoSheet.tsx
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind, Brain, Zap, HeartPulse, Sparkles } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Props {
  onClose: () => void;
}

export const InfoSheet = ({ onClose }: Props) => {
  
  const benefits = [
    {
      title: "Антистресс",
      text: "Мгновенное снижение кортизола и успокоение ума.",
      icon: Brain,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20"
    },
    {
      title: "Энергия",
      text: "Гипоксия включает резервные силы организма.",
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Здоровье",
      text: "Укрепление сердечно-сосудистой системы.",
      icon: HeartPulse,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20"
    }
  ];

  const content = (
    <AnimatePresence>
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
          >
            {/* HERO HEADER */}
            <div className="relative h-48 shrink-0 overflow-hidden bg-sky-50 dark:bg-[#0c2e3e]">
                {/* Анимация воздуха */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-sky-200/40 dark:bg-sky-500/20 rounded-full blur-[60px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-cyan-200/40 dark:bg-cyan-600/20 rounded-full blur-[50px]" />
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md rounded-full transition-colors z-30"
                >
                    <X className="w-5 h-5 text-slate-600 dark:text-white" />
                </button>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-4">
                    <div className="w-16 h-16 bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center mb-4 rotate-6 border border-white/50 dark:border-white/10">
                        <Wind className="w-8 h-8 text-sky-500 dark:text-sky-400" />
                    </div>
                    <h2 className="text-2xl font-[900] text-slate-800 dark:text-white leading-none">
                        Гиповентиляция
                    </h2>
                    <p className="text-sky-700/60 dark:text-sky-300/60 text-xs font-bold uppercase tracking-widest mt-2">
                        Методика оздоровления
                    </p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto pb-safe -mt-6 relative z-30">
                <div className="px-6 pb-8 space-y-6">
                    
                    {/* КАРТОЧКИ */}
                    <div className="grid grid-cols-1 gap-3">
                        {benefits.map((item) => (
                            <div key={item.title} className="bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ОПИСАНИЕ */}
                    <div className="bg-white dark:bg-[#2C2C2E] p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-3 text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" />
                            О практике
                        </div>
                        <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                            <p>
                                Техника относится к гиповентиляционным — объём воздуха, проходящий через лёгкие, уменьшается. Это создает <span className="text-slate-900 dark:text-white font-bold">контролируемую гипоксию</span>.
                            </p>
                            <p>
                                Медицине известно, что кратковременная гипоксия существенно повышает сопротивляемость организма и запускает процесс обновления митохондрий.
                            </p>
                            <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border-l-4 border-sky-500 text-xs text-slate-500 dark:text-slate-400">
                                <b>Совет:</b> Ноздри должны быть чистыми. Не занимайтесь через силу — практика должна приносить удовольствие.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
          </motion.div>
        </>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
