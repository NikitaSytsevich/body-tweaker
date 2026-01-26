import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, X, Code, CheckCircle2, Stethoscope } from 'lucide-react';
import { cn } from '../../utils/cn';
import WebApp from '@twa-dev/sdk';
import { createPortal } from 'react-dom';

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
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/30"
    },
    {
      role: "QA & Тестирование",
      name: "@inntheeairr",
      link: "https://t.me/inntheeairr",
      icon: CheckCircle2,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-900/30"
    },
    {
      role: "Ведущий реабилитолог",
      name: "@bubnovzavaliebalo",
      link: "https://t.me/bubnovzavaliebalo",
      icon: Stethoscope,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/30"
    }
  ];

  const content = (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      />

      {/* Modal Sheet */}
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
      >
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full" />
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-200/50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors z-50">
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
        </button>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pb-safe px-6 pt-2">

            {/* БОЛЬШОЕ ЛОГО НА ВСЮ ШИРИНУ */}
            <div className="mb-6 mt-4">
                <div className="relative w-full h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2C2C2E] dark:to-slate-800 rounded-[2rem] shadow-lg overflow-hidden border-4 border-white dark:border-white/10 flex items-center justify-center gap-4">
                    {/* Паттерн на фоне */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    </div>

                    <div className="relative z-10">
                        <img
                            src="/logo.svg?v=2"
                            alt="Body Tweaker Logo"
                            className="w-20 h-20 rounded-2xl shadow-xl"
                        />
                    </div>

                    <div className="relative z-10 text-center">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                            Body Tweaker
                        </h1>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            Scientific Biohacking Tools
                        </p>
                    </div>
                </div>
            </div>

            {/* ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ */}
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-[#2C2C2E] p-3 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3">
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

                    <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            Профиль
                        </p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                            {currentUser?.first_name || 'Гость'} {currentUser?.last_name || ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* КОМАНДА - КРАСИВАЯ СЕТКА 3x1 */}
            <div className="mb-4">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 mb-3">
                    Команда проекта
                </h3>

                <div className="grid grid-cols-3 gap-2">
                    {team.map((member) => (
                        <a
                            key={member.name}
                            href={member.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-white dark:bg-[#2C2C2E] p-3 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 flex flex-col items-center text-center"
                        >
                            {/* Иконка роли */}
                            <div className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2 relative",
                                member.color
                            )}>
                                <member.icon className="w-6 h-6" />
                                {/* Блестящий эффект при наведении */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            {/* Имя без @ */}
                            <p className="text-xs font-bold text-slate-800 dark:text-white truncate mb-1 leading-tight">
                                {member.name.replace('@', '')}
                            </p>

                            {/* Роль */}
                            <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 leading-tight line-clamp-2">
                                {member.role}
                            </p>

                            {/* Индикатор ссылки - появляется при наведении */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                    <Send className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-center pb-6 opacity-40">
                <p className="text-[9px] text-slate-400 dark:text-slate-500">
                    Built with ❤️ for Biohackers
                </p>
            </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
