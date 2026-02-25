// src/features/breathing/components/InfoSheet.tsx
import { createPortal } from 'react-dom';
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
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fade-in"
          />

          <div className="fixed bottom-0 left-0 right-0 z-[101] app-surface rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto border-t border-[color:var(--tg-border)] backdrop-blur-2xl animate-sheet-in">
            {/* HERO HEADER */}
            <div className="relative h-48 shrink-0 overflow-hidden bg-[color:var(--tg-glass)]">
                {/* Анимация воздуха */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-sky-400/20 rounded-full blur-[60px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-cyan-400/20 rounded-full blur-[50px]" />
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-[color:var(--tg-glass)] hover:bg-[color:var(--tg-glass-strong)] backdrop-blur-md rounded-full transition-colors z-30 border border-[color:var(--tg-border)]"
                >
                    <X className="w-5 h-5 text-[color:var(--tg-muted)]" />
                </button>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-4">
                    <div className="w-16 h-16 bg-[color:var(--tg-glass)] backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center mb-4 rotate-6 border border-[color:var(--tg-border)]">
                        <Wind className="w-8 h-8 text-sky-500" />
                    </div>
                    <h2 className="text-2xl font-[900] app-header leading-none">
                        Гиповентиляция
                    </h2>
                    <p className="text-sky-600/70 text-xs font-bold uppercase tracking-widest mt-2">
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
                            <div key={item.title} className="app-card p-4 rounded-[1.8rem] flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold app-header text-sm">{item.title}</h3>
                                    <p className="text-xs app-muted font-medium leading-tight mt-0.5">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ОПИСАНИЕ */}
                    <div className="app-card p-6 rounded-[2rem] shadow-sm">
                        <div className="flex items-center gap-2 mb-3 app-muted uppercase tracking-widest text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" />
                            О практике
                        </div>
                        <div className="space-y-4 text-sm font-medium app-muted leading-relaxed">
                            <p>
                                Техника относится к гиповентиляционным — объём воздуха, проходящий через лёгкие, уменьшается. Это создает <span className="app-header font-bold">контролируемую гипоксию</span>.
                            </p>
                            <p>
                                Медицине известно, что кратковременная гипоксия существенно повышает сопротивляемость организма и запускает процесс обновления митохондрий.
                            </p>
                            <div className="p-4 bg-[color:var(--tg-glass)] rounded-xl border-l-4 border-sky-500 text-xs app-muted">
                                <b>Совет:</b> Ноздри должны быть чистыми. Не занимайтесь через силу — практика должна приносить удовольствие.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
          </div>
        </>
  );

  return createPortal(content, document.body);
};
