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
  return (
    <div
        className="app-card-soft p-1 rounded-2xl flex relative select-none backdrop-blur-md"
    >
        <div
          className="absolute top-1 bottom-1 left-1 bg-[color:var(--tg-surface)] rounded-xl shadow-sm border border-[color:var(--tg-border)] z-10 pointer-events-none transition-transform"
          style={{
            width: `calc((100% - 8px) / ${options.length})`,
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
                isActive ? "text-[color:var(--tg-text)]" : "text-[color:var(--tg-muted)]"
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
