import { Activity, Heart, Brain } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Props {
  stats: {
    physical: number;
    emotional: number;
    intellectual: number;
  };
}

// 👇 Убедитесь, что здесь написано "export const"
export const StatsGrid = ({ stats }: Props) => {
  const cards = [
    {
      id: 'phys',
      label: 'Физика',
      value: stats.physical,
      icon: Activity,
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/30',
      bar: 'bg-red-500 dark:bg-red-400',
      desc: 'Сила, выносливость'
    },
    {
      id: 'emo',
      label: 'Эмоции',
      value: stats.emotional,
      icon: Heart,
      color: 'text-green-500 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/30',
      bar: 'bg-green-500 dark:bg-green-400',
      desc: 'Настроение, творчество'
    },
    {
      id: 'intel',
      label: 'Интеллект',
      value: stats.intellectual,
      icon: Brain,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      bar: 'bg-blue-500 dark:bg-blue-400',
      desc: 'Логика, реакция'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 mt-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-white dark:bg-[#2C2C2E] p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex items-center gap-4">

          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", card.bg)}>
            <card.icon className={cn("w-6 h-6", card.color)} />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-700 dark:text-slate-200">{card.label}</h3>
              <span className={cn("font-black text-lg", card.color)}>{card.value}%</span>
            </div>

            {/* Прогресс бар */}
            <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden relative">
               <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white dark:bg-[#2C2C2E] z-10" />
               <div
                  className={cn("h-full transition-all duration-1000", card.bar)}
                  style={{ width: `${Math.abs(card.value)}%` }}
               />
            </div>

            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
