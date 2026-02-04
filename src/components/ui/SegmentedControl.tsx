import { memo } from 'react';
import { cn } from '../../utils/cn';
import type { SegmentedControlOption } from '../../utils/types';

interface Props<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

// OPTIMIZATION: React.memo to prevent unnecessary re-renders
function SegmentedControlInner<T extends string = string>({ options, value, onChange }: Props<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const widthPercent = 100 / options.length;

  return (
    <div
        className="bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-2xl flex relative select-none"
    >
        <div
          className="absolute top-1 bottom-1 left-1 bg-white dark:bg-[#3A3A3C] rounded-xl shadow-sm border border-black/5 dark:border-white/10 z-10 pointer-events-none transition-transform"
          style={{
            width: `calc(${widthPercent}% - 8px)`,
            transform: `translateX(${activeIndex * 100}%)`
          }}
        />

        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold relative z-20 transition-colors",
                isActive ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <option.icon className="w-3.5 h-3.5" />
              {option.label}
            </button>
          );
        })}
    </div>
  );
}

// Export memoized component with proper generic typing
const MemoizedSegmentedControl = memo(SegmentedControlInner) as typeof SegmentedControlInner;
export { MemoizedSegmentedControl as SegmentedControl };
