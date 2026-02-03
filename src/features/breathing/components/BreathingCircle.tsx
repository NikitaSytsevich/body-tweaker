import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn'; // 3 точки
import type { Phase } from '../hooks/useBreathingSession'; // 1 точка

interface Props {
  phase: Phase;
  timeLeft: number;
  totalDuration: number; 
}

type ConfigType = {
  [key in Phase]: { text: string; color: string; scale: number };
};

export const BreathingCircle = ({ phase, timeLeft, totalDuration }: Props) => {
  
  const config: ConfigType = {
    idle: { text: "", color: "bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]", scale: 1 },
    inhale: { text: "Вдох", color: "bg-cyan-100/80 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300", scale: 1.45 },
    hold: { text: "Задержка", color: "bg-violet-100/80 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", scale: 1.45 },
    exhale: { text: "Выдох", color: "bg-blue-100/80 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", scale: 1 },
    finished: { text: "Готово", color: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", scale: 1 },
  };

  const current = config[phase];
  const glowColor = phase === 'hold'
    ? 'rgba(167,139,250,0.45)'
    : phase === 'inhale'
      ? 'rgba(103,232,249,0.45)'
      : phase === 'exhale'
        ? 'rgba(96,165,250,0.45)'
        : 'rgba(148,163,184,0.25)';

  return (
    <div className="relative w-[clamp(190px,48vw,250px)] h-[clamp(190px,48vw,250px)] flex items-center justify-center">
      
      {phase !== 'finished' && phase !== 'idle' && (
        <motion.div
            animate={{ 
                scale: current.scale,
                opacity: phase === 'hold' ? 0.6 : 0.45
            }}
            transition={{ 
                duration: totalDuration > 0 ? totalDuration : 0.5, 
                ease: "linear" 
            }}
            style={{
              background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`
            }}
            className="absolute -inset-[6%] rounded-full"
        />
      )}

      <motion.div
        animate={{ scale: current.scale }}
        transition={{ duration: totalDuration > 0 ? totalDuration : 0.5, ease: "linear" }}
        className={cn(
            "w-[clamp(92px,24vw,120px)] h-[clamp(92px,24vw,120px)] rounded-full flex flex-col items-center justify-center shadow-lg relative z-10 transition-colors duration-500 backdrop-blur-xl",
            current.color
        )}
      >
        {phase !== 'idle' && (
            <>
                <span className="text-[clamp(11px,2.6vw,14px)] font-bold uppercase tracking-widest">{current.text}</span>
                {phase !== 'finished' && (
                    <motion.span 
                        key={timeLeft}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[clamp(18px,4.6vw,26px)] font-mono font-black mt-1"
                    >
                        {timeLeft}
                    </motion.span>
                )}
            </>
        )}
      </motion.div>

    </div>
  );
};
