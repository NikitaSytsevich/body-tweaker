import { cn } from '../../../utils/cn';
import type { ActivePhase, Phase } from '../hooks/useBreathingSession';

interface Props {
  phase: Phase;
  activePhase: ActivePhase;
  timeLeft: number;
  progress: number;
  compact?: boolean;
}

interface PhaseTheme {
  ring: string;
  glow: string;
  chip: string;
  scale: number;
  label: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const THEMES: Record<ActivePhase, PhaseTheme> = {
  inhale: {
    ring: '#10BCE2',
    glow: 'rgba(34,211,238,0.34)',
    chip: 'bg-cyan-100/85 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200',
    scale: 1.3,
    label: 'Вдох'
  },
  hold: {
    ring: '#8B5CF6',
    glow: 'rgba(139,92,246,0.32)',
    chip: 'bg-violet-100/85 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200',
    scale: 1.36,
    label: 'Задержка'
  },
  exhale: {
    ring: '#3B82F6',
    glow: 'rgba(59,130,246,0.32)',
    chip: 'bg-blue-100/85 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
    scale: 1,
    label: 'Выдох'
  }
};

export const BreathingCircle = ({ phase, activePhase, timeLeft, progress, compact = false }: Props) => {
  const size = compact ? 204 : 276;
  const stroke = compact ? 8 : 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const theme = THEMES[activePhase];

  const isIdle = phase === 'idle';
  const isCountdown = phase === 'countdown';
  const isPaused = phase === 'paused';
  const isFinished = phase === 'finished';

  const ringProgress = isFinished ? 100 : isIdle ? 0 : clamp(progress, 0, 100);
  const dashOffset = circumference - (ringProgress / 100) * circumference;

  const label = isCountdown
    ? 'Старт'
    : isPaused
      ? 'Пауза'
      : isFinished
        ? 'Готово'
        : isIdle
          ? 'Старт'
          : theme.label;

  const value = isFinished ? 'OK' : isIdle ? '' : `${Math.max(0, timeLeft)}`;

  const centerScale = isFinished
    ? 1
    : isPaused
      ? 1.16
      : isCountdown
        ? 1.18
        : theme.scale;

  const chipClasses = isFinished
    ? 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
    : isPaused
      ? 'bg-amber-100/90 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
      : isCountdown
        ? 'bg-sky-100/90 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200'
        : theme.chip;

  const ringColor = isFinished ? '#10B981' : isPaused ? '#F59E0B' : isCountdown ? '#0EA5E9' : theme.ring;
  const glowColor = isFinished ? 'rgba(16,185,129,0.26)' : isPaused ? 'rgba(245,158,11,0.26)' : theme.glow;

  return (
    <div className={cn('relative flex items-center justify-center', compact ? 'w-[204px] h-[204px]' : 'w-[276px] h-[276px]')}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 72%)`,
          transform: `scale(${centerScale * 0.9})`,
          transition: 'transform 360ms ease'
        }}
      />

      <svg className="absolute inset-0 -rotate-90" width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.23)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 140ms linear, stroke 220ms ease' }}
        />
      </svg>

      <div
        className={cn(
          'rounded-full backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.8)] flex flex-col items-center justify-center transition-colors duration-300',
          compact ? 'w-[96px] h-[96px]' : 'w-[136px] h-[136px]',
          chipClasses
        )}
        style={{
          transform: `scale(${centerScale})`,
          transition: 'transform 420ms linear'
        }}
      >
        <span className={cn('font-black uppercase tracking-[0.14em]', compact ? 'text-[11px]' : 'text-[12px]')}>{label}</span>
        {value && <span className={cn('font-mono font-black tabular-nums mt-1', compact ? 'text-[28px]' : 'text-[32px]')}>{value}</span>}
      </div>
    </div>
  );
};
