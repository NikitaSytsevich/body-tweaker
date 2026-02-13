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
  const safeDate = dayjs(dateValue).isValid() ? dayjs(dateValue) : dayjs();
  const inputValue = safeDate.format('YYYY-MM-DDTHH:mm');

  return (
    <div className={cn("text-center relative group", disabled && "opacity-50 grayscale cursor-not-allowed")}>
      <div className="flex items-center gap-1 app-muted justify-center mb-1 opacity-80">
        <Icon className="w-3 h-3" />
        <span className="text-[10px] font-bold uppercase">{label}</span>
        {!disabled && <Edit3 className="w-2 h-2 ml-0.5 opacity-0 group-hover:opacity-50 transition-opacity" />}
      </div>

      <p className={cn(
        "text-sm font-bold app-header px-2 py-1 rounded-lg border border-transparent transition-all",
        !disabled && "group-hover:bg-[color:var(--tg-glass)] group-active:border-[color:var(--tg-accent)]/30 group-active:bg-[color:var(--tg-glass-strong)]"
      )}>
        {safeDate.format('HH:mm')}
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
