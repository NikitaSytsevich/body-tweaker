// src/app/modals/InfoModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Github, 
  Heart, 
  MessageCircle,
  Activity,
  User,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { createPortal } from 'react-dom';
import WebApp from '@twa-dev/sdk';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Команда (Реальные имена + Роли)
const TEAM = [
  {
    role: "Разработчик, Реабилитолог",
    name: "Никита Сыцевич",
    handle: "@nikita_sytsevich",
    url: "https://t.me/nikita_sytsevich",
    icon: Activity,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    role: "Реабилитолог",
    name: "Александр Якимчик",
    handle: "@Alex_Yakimchyk", // Примерный ник, если нет - можно убрать ссылку
    url: "https://t.me/", 
    icon: User,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    role: "Реабилитолог",
    name: "Кирилл Бубнов",
    handle: "@bubnovzavaliebalo",
    url: "https://t.me/bubnovzavaliebalo",
    icon: User,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20"
  },
  {
    role: "Инструктор-методист ЛФК",
    name: "Мария Сыцевич",
    handle: "@maria_sytsevich",
    url: "https://t.me/maria_sytsevich",
    icon: User,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export const InfoModal = ({ isOpen, onClose }: Props) => {
  const version = '2.1.0';
  const platform = WebApp.platform || 'iOS';

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Sheet */}
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[95vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
          >
            
            {/* --- HERO HEADER (Мятно-Зеленый) --- */}
            <div className="relative h-64 shrink-0 overflow-hidden bg-emerald-50 dark:bg-[#0f291e]">
                
                {/* 1. Мягкие градиенты (Мята + Светло-голубой) */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-30%] left-[-10%] w-[400px] h-[400px] bg-emerald-300/30 dark:bg-emerald-500/20 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-teal-200/40 dark:bg-teal-600/20 rounded-full blur-[60px]" />
                </div>

                {/* 2. Легкий шум */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                {/* Кнопка закрытия */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md rounded-full transition-colors z-30"
                >
                    <X className="w-5 h-5 text-slate-600 dark:text-white" />
                </button>

                {/* ЦЕНТРАЛЬНАЯ КОМПОЗИЦИЯ */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-2">
                    
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-xl flex items-center justify-center relative rotate-3 border-4 border-white/50 dark:border-white/5">
                             <img src="/logo.svg?v=2" alt="Logo" className="w-16 h-16 rounded-xl" />
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center mt-6 px-6"
                    >
                        <h1 className="text-3xl font-[900] text-slate-800 dark:text-white tracking-tight leading-none mb-2">
                            Body Tweaker
                        </h1>
                        <p className="text-emerald-700/80 dark:text-emerald-300/80 text-xs font-bold uppercase tracking-widest">
                            Проверено на личном опыте
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 overflow-y-auto pb-safe -mt-8 relative z-30">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="px-6 pb-8 space-y-6"
                >
                    
                    {/* ИСТОРИЯ */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-white dark:bg-[#2C2C2E] p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
                             <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                                <Sparkles className="w-5 h-5 fill-current" />
                                <h3 className="text-sm font-bold uppercase tracking-wide">
                                    Наша философия
                                </h3>
                             </div>
                             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                Мы не теоретики. Вся методика построена на нашем многолетнем опыте работы с телом и восстановлением.
                                Мы создали этот инструмент, чтобы делиться тем, что реально работает.
                             </p>
                        </div>
                    </motion.div>

                    {/* КОМАНДА */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 pl-2">
                            Команда проекта
                        </h3>
                        <div className="space-y-3">
                            {TEAM.map((member) => (
                                <a 
                                    key={member.name}
                                    href={member.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.99] transition-transform"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", member.bg, member.color)}>
                                            <member.icon className="w-6 h-6" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-[15px] leading-tight mb-0.5">
                                                {member.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {member.role}
                                            </p>
                                        </div>

                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* ФУТЕР */}
                    <motion.div variants={itemVariants} className="pt-4 flex flex-col items-center gap-6 border-t border-slate-100 dark:border-white/5">
                        <div className="flex gap-3 w-full">
                             <a 
                                href="https://github.com/NikitaSytsevich/body-tweaker" 
                                target="_blank" 
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-[#2C2C2E] rounded-2xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm text-xs font-bold active:scale-95"
                             >
                                <Github className="w-4 h-4" />
                                GitHub
                             </a>
                             
                             <a 
                                href="https://t.me/nikita_sytsevich" 
                                target="_blank" 
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-lg shadow-slate-900/20 dark:shadow-white/10 transition-colors text-xs font-bold active:scale-95"
                             >
                                <MessageCircle className="w-4 h-4" />
                                Связаться
                             </a>
                        </div>

                        <div className="text-center opacity-40">
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                                v{version} • {platform}
                            </p>
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500">
                                Made with <Heart className="w-3 h-3 text-red-500 fill-current" />
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
