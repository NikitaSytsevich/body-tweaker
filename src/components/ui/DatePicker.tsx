import dayjs from 'dayjs';
import { Edit3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // Исправлен импорт типа
import { cn } from '../../utils/cn';

interface Props {
  label: string;
  dateValue: string;
  icon: LucideIcon;
  onChange: (val: string) => void;
  disabled: boolean;
}

export const NativeDatePicker = ({ 
  label, 
  dateValue, 
  icon: Icon, 
  onChange,
  disabled 
}: Props) => {
  const inputValue = dayjs(dateValue).format('YYYY-MM-DDTHH:mm');

  return (
    <div className={cn("text-center relative group", disabled && "opacity-50 grayscale cursor-not-allowed")}>
      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 justify-center mb-1 opacity-70">
        <Icon className="w-3 h-3" />
        <span className="text-[9px] font-bold uppercase">{label}</span>
        {!disabled && <Edit3 className="w-2 h-2 ml-0.5 opacity-0 group-hover:opacity-50 transition-opacity" />}
      </div>

      <p className={cn(
        "text-sm font-bold text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg border border-transparent transition-all",
        !disabled && "group-hover:bg-slate-50 dark:group-hover:bg-[#3A3A3C] group-active:border-blue-200 dark:group-active:border-blue-500/30 group-active:bg-blue-50 dark:group-active:bg-blue-500/10"
      )}>
        {dayjs(dateValue).format('HH:mm')}
      </p>

      {!disabled && (
        <input
          type="datetime-local"
          value={inputValue}
          onChange={(e) => {
             if (!e.target.value) return;
             const newDate = dayjs(e.target.value).toISOString();
             onChange(newDate);
          }}
          className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
        />
      )}
    </div>
  );
};
