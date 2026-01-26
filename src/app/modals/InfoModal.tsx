import { motion } from 'framer-motion';
import { Send, User, X, Code, CheckCircle2, Stethoscope } from 'lucide-react';
import { cn } from '../../utils/cn';
import WebApp from '@twa-dev/sdk';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const currentUser = WebApp.initDataUnsafe?.user;

  const team = [
    {
      role: "Разработчик",
      name: "@nikita_sytsevich",
      link: "https://t.me/nikita_sytsevich",
      icon: Code,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100"
    },
    {
      role: "QA & Тестирование",
      name: "@inntheeairr",
      link: "https://t.me/inntheeairr",
      icon: CheckCircle2,
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100"
    },
    {
      role: "Ведущий реабилитолог",
      name: "@bubnovzavaliebalo",
      link: "https://t.me/bubnovzavaliebalo",
      icon: Stethoscope,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100"
    }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
      >
        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full" />
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-200/50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors z-50">
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
        </button>

        <div className="flex-1 overflow-y-auto pb-safe px-6 pt-2">

            {/* ХЕДЕР */}
            <div className="flex items-center justify-between mb-8 mt-4 bg-white dark:bg-[#2C2C2E] p-4 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* 👇 ЛОГОТИП */}
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        className="w-14 h-14 rounded-2xl shadow-md border border-slate-100 dark:border-white/10"
                    />
                    <div>
                        <h2 className="text-xl font-[900] text-slate-800 dark:text-white tracking-tight leading-none">
                            Body Tweaker
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                            Версия 2.0
                        </p>
                    </div>
                </div>

                <div className="relative">
                    {currentUser?.photo_url ? (
                        <img
                            src={currentUser.photo_url}
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-slate-50 dark:border-white/10 shadow-sm"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-slate-100 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center border-2 border-slate-50 dark:border-white/10">
                            <User className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                        </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
            </div>

            {/* СПИСОК КОМАНДЫ */}
            <div className="space-y-3 pb-10">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 mb-2">
                    Команда проекта
                </h3>

                {team.map((member) => (
                    <a
                        key={member.name}
                        href={member.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-98 bg-white dark:bg-[#2C2C2E] shadow-sm",
                            member.border
                        )}
                    >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", member.color)}>
                            <member.icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-0.5">
                                {member.role}
                            </p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                {member.name}
                            </p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#3A3A3C] flex items-center justify-center text-slate-300 dark:text-slate-600">
                            <Send className="w-4 h-4" />
                        </div>
                    </a>
                ))}
            </div>

            <div className="text-center pb-8 opacity-50">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    Built with ❤️ for Biohackers
                </p>
            </div>

        </div>
      </motion.div>
    </>
  );
};
