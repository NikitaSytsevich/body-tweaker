import { useMemo, memo } from 'react';
import { cn } from '../../../utils/cn';
import { motion } from 'framer-motion';

interface Props {
  progress: number;
  time: string;
  isFasting: boolean;
  color: string;
  label?: string;
}

// OPTIMIZATION: React.memo to prevent unnecessary re-renders
export const TimerRing = memo(({ progress, time, isFasting, label }: Props) => {
  const size = 280;
  const center = size / 2;
  const strokeWidth = 16;
  const radius = 120;

  // OPTIMIZATION: Memoize expensive calculations
  const circumference = useMemo(() => 2 * Math.PI * radius, []);
  const strokeDashoffset = useMemo(() => circumference - (progress / 100) * circumference, [circumference, progress]);

  // OPTIMIZATION: Memoize time parts to avoid repeated split operations
  const timeParts = useMemo(() => {
    const parts = time.split(':');
    return {
      hours: parts[0],
      minutes: parts[1],
      seconds: parts[2]
    };
  }, [time]);

  return (
    <div className="relative flex items-center justify-center">
      
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* Фоновое свечение */}
        {isFasting && (
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full animate-pulse" />
        )}

        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">

          {/* 1. ФОН ШКАЛЫ (Серый круг) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9" // slate-100
            className="dark:stroke-[#38383A]"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* 2. ЛИНИЯ ПРОГРЕССА (Цветная) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-out",
              isFasting ? "text-blue-600 dark:text-blue-500" : "text-transparent"
            )}
          />
        </svg>

        {/* ЦЕНТРАЛЬНЫЙ ТЕКСТ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">

            {/* Лейбл (например, "24ч База") */}
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 bg-white dark:bg-[#2C2C2E] px-2 py-1 rounded-md border border-slate-100 dark:border-white/10 shadow-sm">
                {label || (isFasting ? "Голодание" : "Ожидание")}
            </span>

            {/* ВРЕМЯ */}
            <div className="flex items-baseline text-slate-800 dark:text-white">
                <span className="text-6xl font-[800] font-mono tracking-tighter tabular-nums leading-none">
                    {timeParts.hours}:{timeParts.minutes}
                </span>
                <span className="text-xl font-medium text-slate-300 dark:text-slate-500 ml-1">
                    {timeParts.seconds}
                </span>
            </div>

            {/* ПРОЦЕНТ */}
            {isFasting && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-3 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-full border border-blue-100 dark:border-blue-500/30 flex items-center gap-1.5"
                >
                    <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-500 tabular-nums">
                        {progress.toFixed(1)}%
                    </span>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  );
});

TimerRing.displayName = 'TimerRing';
