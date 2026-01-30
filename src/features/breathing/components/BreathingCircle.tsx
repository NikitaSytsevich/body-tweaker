import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';
import type { Phase } from '../hooks/useBreathingSession';

interface Props {
  phase: Phase;
  timeLeft: number;
  totalDuration: number;
}

type ConfigType = {
  [key in Phase]: { text: string; color: string; scale: number };
};

// OPTIMIZATION: Move config outside component to prevent recreation on every render
const config: ConfigType = {
  idle: { text: "", color: "bg-slate-50 dark:bg-[#3A3A3C] border-4 border-white dark:border-white/10 shadow-inner", scale: 1 },
  inhale: { text: "Вдох", color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400", scale: 1.5 },
  hold: { text: "Задержка", color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400", scale: 1.5 },
  exhale: { text: "Выдох", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", scale: 1 },
  finished: { text: "Готово", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", scale: 1 },
};

// OPTIMIZATION: React.memo to prevent unnecessary re-renders during animation
export const BreathingCircle = memo(({ phase, timeLeft, totalDuration }: Props) => {
  // OPTIMIZATION: Memoize current config selection
  const current = useMemo(() => config[phase], [phase]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">

      {phase !== 'finished' && phase !== 'idle' && (
        <motion.div
            animate={{
                scale: current.scale,
                backgroundColor: phase === 'hold' ? '#ede9fe' : phase === 'inhale' ? '#cffafe' : '#dbeafe'
            }}
            transition={{
                duration: totalDuration > 0 ? totalDuration : 0.5,
                ease: "linear"
            }}
            className="absolute inset-0 rounded-full opacity-50 blur-2xl dark:opacity-30"
        />
      )}

      <motion.div
        animate={{ scale: current.scale }}
        transition={{ duration: totalDuration > 0 ? totalDuration : 0.5, ease: "linear" }}
        className={cn(
            "w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-lg relative z-10 transition-colors duration-500",
            current.color
        )}
      >
        {phase !== 'idle' && (
            <>
                <span className="text-sm font-bold uppercase tracking-widest">{current.text}</span>
                {phase !== 'finished' && (
                    <motion.span
                        key={timeLeft}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-mono font-black mt-1"
                    >
                        {timeLeft}
                    </motion.span>
                )}
            </>
        )}
      </motion.div>

    </div>
  );
});

BreathingCircle.displayName = 'BreathingCircle';
