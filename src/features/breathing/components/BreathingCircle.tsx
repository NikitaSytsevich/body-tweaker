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

const config: ConfigType = {
  idle: { text: "СТАРТ", color: "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300", scale: 1 },
  inhale: { text: "Вдох", color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300", scale: 1.4 },
  hold: { text: "Задержка", color: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300", scale: 1.4 },
  exhale: { text: "Выдох", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", scale: 1 },
  finished: { text: "Готово", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300", scale: 1 },
};

export const BreathingCircle = memo(({ phase, timeLeft, totalDuration }: Props) => {
  const current = useMemo(() => config[phase], [phase]);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Glow when active */}
      {phase !== 'finished' && phase !== 'idle' && (
        <motion.div
          animate={{
            scale: current.scale * 1.2,
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: totalDuration > 0 ? totalDuration : 0.5,
            ease: "linear"
          }}
          className={cn(
            "absolute inset-0 rounded-full blur-2xl",
            phase === 'hold' ? "bg-violet-400 dark:bg-violet-600" :
            phase === 'inhale' ? "bg-cyan-400 dark:bg-cyan-600" :
            "bg-blue-400 dark:bg-blue-600"
          )}
        />
      )}

      {/* Main circle */}
      <motion.div
        animate={{ scale: current.scale }}
        transition={{ duration: totalDuration > 0 ? totalDuration : 0.5, ease: "linear" }}
        className={cn(
          "w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 shadow-sm relative z-10 transition-colors duration-300",
          current.color,
          phase === 'idle' && "border-slate-200 dark:border-white/20",
          phase === 'inhale' && "border-cyan-300 dark:border-cyan-700",
          phase === 'hold' && "border-violet-300 dark:border-violet-700",
          phase === 'exhale' && "border-blue-300 dark:border-blue-700"
        )}
      >
        {phase === 'idle' ? (
          <span className="text-sm font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {current.text}
          </span>
        ) : (
          <>
            <span className="text-xs font-bold uppercase tracking-wider">{current.text}</span>
            {phase !== 'finished' && (
              <motion.span
                key={timeLeft}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-mono font-black mt-0.5"
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
