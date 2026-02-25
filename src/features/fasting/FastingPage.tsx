import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Play, Square, ListFilter, Sunrise, Moon, ArrowUpRight, Check, Sparkles, Target, Flag, TrendingUp, Clock3 } from 'lucide-react';

import { useFastingTimerContext } from './context/TimerContext';
import { FASTING_PHASES } from './data/stages';
import { getPhaseCue, getPhaseSticker } from './data/phasePresentation';
import { ProtocolSelector } from './components/ProtocolSelector';
import { FastingStartModal } from './components/FastingStartModal';
import { PhaseSheet } from './components/PhaseSheet';

import { NativeDatePicker } from '../../components/ui/DatePicker';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { AnimatedSticker } from '../../components/ui/AnimatedSticker';

import { cn } from '../../utils/cn';
import { storageGetHistory, HISTORY_UPDATED_EVENT_NAME } from '../../utils/storage';
import type { HistoryRecord } from '../../utils/types';

type TimeMode = 'elapsed' | 'remaining';
type TimerSessionState =
  | 'idle_unconfigured'
  | 'idle_ready'
  | 'running_active'
  | 'running_goal_reached'
  | 'stop_confirm';

interface TimerBoardProps {
  isFasting: boolean;
  sessionState: TimerSessionState;
  timeMode: TimeMode;
  onModeChange: (mode: TimeMode) => void;
  elapsedFormatted: string;
  remainingFormatted: string;
  totalHours: number;
  progress: number;
  phaseProgress: number;
  currentStart: string;
  currentEnd: string;
  overflowLabel: string | null;
}

interface SchemeHistoryStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  avgDurationSeconds: number;
  bestDurationSeconds: number;
}

interface SessionMilestone {
  id: string;
  second: number;
  label: string;
}

interface SessionMilestoneWindow {
  previousMilestone: SessionMilestone | null;
  nextMilestone: SessionMilestone | null;
  laneProgress: number;
}

type SessionCoachTone = 'neutral' | 'info' | 'success' | 'warning';

interface SessionCoachModel {
  tone: SessionCoachTone;
  badge: string;
  title: string;
  description: string;
  hint: string;
}

const EMPTY_SCHEME_STATS: SchemeHistoryStats = {
  totalSessions: 0,
  completedSessions: 0,
  completionRate: 0,
  avgDurationSeconds: 0,
  bestDurationSeconds: 0
};

const GOAL_EXIT_WINDOW_MIN_SECONDS = 45 * 60;
const GOAL_EXIT_WINDOW_MAX_SECONDS = 4 * 60 * 60;

const PHASE_SURFACE_BY_ID: Record<number, string> = {
  1: 'from-blue-50 via-white to-white dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-900',
  2: 'from-emerald-50 via-white to-white dark:from-emerald-900/20 dark:via-slate-900 dark:to-slate-900',
  3: 'from-amber-50 via-white to-white dark:from-amber-900/20 dark:via-slate-900 dark:to-slate-900',
  4: 'from-orange-50 via-white to-white dark:from-orange-900/20 dark:via-slate-900 dark:to-slate-900',
  5: 'from-violet-50 via-white to-white dark:from-violet-900/20 dark:via-slate-900 dark:to-slate-900',
  6: 'from-cyan-50 via-white to-white dark:from-cyan-900/20 dark:via-slate-900 dark:to-slate-900',
  7: 'from-teal-50 via-white to-white dark:from-teal-900/20 dark:via-slate-900 dark:to-slate-900',
  8: 'from-slate-100 via-white to-white dark:from-slate-800/55 dark:via-slate-900 dark:to-slate-900',
  9: 'from-stone-100 via-white to-white dark:from-stone-800/55 dark:via-slate-900 dark:to-slate-900'
};

const formatDuration = (totalSeconds: number) => {
  const secondsSafe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(secondsSafe / 3600);
  const m = Math.floor((secondsSafe % 3600) / 60);
  const s = secondsSafe % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatOverGoal = (totalSeconds: number) => {
  const secondsSafe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(secondsSafe / 3600);
  const m = Math.floor((secondsSafe % 3600) / 60);
  const s = secondsSafe % 60;

  if (h > 0) return `+${h}ч ${m}м`;
  if (m > 0) return `+${m}м ${s}с`;
  return `+${s}с`;
};

const formatFinishWithOffset = (startIso: string, endIso: string) => {
  const start = dayjs(startIso);
  const end = dayjs(endIso);
  const dayOffset = end.startOf('day').diff(start.startOf('day'), 'day');
  const timeLabel = end.format('HH:mm');

  if (dayOffset <= 0) return timeLabel;
  return `${timeLabel} (+${dayOffset}д)`;
};

const getPhaseProgress = (hours: number, hoursStart: number, hoursEnd: number | null, isFasting: boolean) => {
  if (!isFasting) return 0;
  if (hours < hoursStart) return 0;
  if (!hoursEnd || hoursEnd <= hoursStart) return 100;
  const duration = hoursEnd - hoursStart;
  const progress = ((hours - hoursStart) / duration) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

const formatCompactDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) return `${hours}ч ${minutes}м`;
  if (minutes > 0) return `${minutes}м`;
  return `${safeSeconds % 60}с`;
};

const shortenText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
};

const formatMilestoneLabel = (label: string, maxLength: number = 26) => {
  const primary = label.split(' • ')[0]?.trim() || label;
  return shortenText(primary, maxLength);
};

const roundToStep = (value: number, step: number) => Math.round(value / step) * step;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getGoalExitWindowSeconds = (goalSeconds: number) => {
  const dynamicWindow = Math.floor(goalSeconds * 0.12);
  return clamp(dynamicWindow, GOAL_EXIT_WINDOW_MIN_SECONDS, GOAL_EXIT_WINDOW_MAX_SECONDS);
};

const buildSessionMilestones = (goalSeconds: number): SessionMilestone[] => {
  const marks = new Map<number, string[]>();

  const pushMilestone = (second: number, label: string) => {
    const safeSecond = Math.floor(second);
    if (safeSecond <= 0 || safeSecond > goalSeconds) return;
    const existing = marks.get(safeSecond) ?? [];
    if (!existing.includes(label)) existing.push(label);
    marks.set(safeSecond, existing);
  };

  [0.25, 0.5, 0.75].forEach((fraction) => {
    const second = roundToStep(goalSeconds * fraction, 60);
    pushMilestone(second, `${Math.round(fraction * 100)}% протокола`);
  });

  FASTING_PHASES.forEach((phase) => {
    pushMilestone(phase.hoursStart * 3600, phase.subtitle);
  });

  pushMilestone(goalSeconds, 'Цель протокола');

  return Array.from(marks.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([second, labels], index) => ({
      id: `milestone-${second}-${index}`,
      second,
      label: labels.join(' • ')
    }));
};

const resolveMilestoneWindow = (elapsedSeconds: number, milestones: SessionMilestone[]): SessionMilestoneWindow => {
  if (!milestones.length) {
    return {
      previousMilestone: null,
      nextMilestone: null,
      laneProgress: 0
    };
  }

  const previousMilestone = [...milestones].reverse().find((item) => item.second <= elapsedSeconds) ?? null;
  const nextMilestone = milestones.find((item) => item.second > elapsedSeconds) ?? null;

  if (!nextMilestone) {
    return {
      previousMilestone,
      nextMilestone: null,
      laneProgress: 100
    };
  }

  const startSecond = previousMilestone?.second ?? 0;
  const laneSize = Math.max(1, nextMilestone.second - startSecond);
  const laneProgress = clamp(((elapsedSeconds - startSecond) / laneSize) * 100, 0, 100);

  return {
    previousMilestone,
    nextMilestone,
    laneProgress
  };
};

const calculateSchemeHistoryStats = (
  records: HistoryRecord[],
  schemeTitle: string,
  goalSeconds: number
): SchemeHistoryStats => {
  const schemeRecords = records.filter(
    (record) =>
      record.type === 'fasting' &&
      record.scheme === schemeTitle &&
      Number.isFinite(record.durationSeconds) &&
      record.durationSeconds > 0
  );

  if (!schemeRecords.length) return EMPTY_SCHEME_STATS;

  const durations = schemeRecords.map((record) => record.durationSeconds);
  const totalSessions = schemeRecords.length;
  const completedSessions = durations.filter((seconds) => seconds >= goalSeconds).length;
  const completionRate = Math.round((completedSessions / totalSessions) * 100);
  const avgDurationSeconds = Math.round(durations.reduce((acc, seconds) => acc + seconds, 0) / totalSessions);
  const bestDurationSeconds = Math.max(...durations);

  return {
    totalSessions,
    completedSessions,
    completionRate,
    avgDurationSeconds,
    bestDurationSeconds
  };
};

const getPredictedDurationSeconds = (goalSeconds: number, stats: SchemeHistoryStats) => {
  if (stats.totalSessions < 2 || stats.avgDurationSeconds <= 0) return goalSeconds;
  const blended = goalSeconds * 0.45 + stats.avgDurationSeconds * 0.55;
  const clamped = clamp(blended, goalSeconds * 0.65, goalSeconds * 1.6);
  return roundToStep(clamped, 15 * 60);
};

const buildSessionCoach = (params: {
  isFasting: boolean;
  isStopConfirming: boolean;
  isGoalReached: boolean;
  elapsed: number;
  goalSeconds: number;
  overflowSeconds: number;
  nextMilestone: SessionMilestone | null;
  remainingToGoalSeconds: number;
  historyStats: SchemeHistoryStats;
}): SessionCoachModel => {
  const {
    isFasting,
    isStopConfirming,
    isGoalReached,
    elapsed,
    goalSeconds,
    overflowSeconds,
    nextMilestone,
    remainingToGoalSeconds,
    historyStats
  } = params;

  if (!isFasting) {
    if (historyStats.totalSessions === 0) {
      return {
        tone: 'info',
        badge: 'Подготовка',
        title: 'Выберите протокол и задайте ритм',
        description: 'Первый цикл формирует базовую точку. Дальше навигатор будет строить персональные подсказки.',
        hint: 'Перед стартом подготовьте воду и окно для мягкого выхода.'
      };
    }

    return {
      tone: 'neutral',
      badge: `Сессий: ${historyStats.totalSessions}`,
      title: `Готов к новому циклу (${historyStats.completionRate}% выполнения цели)`,
      description: `Ваш средний результат по этому протоколу: ${formatCompactDuration(historyStats.avgDurationSeconds)}.`,
      hint: 'При старте ориентируйтесь на спокойный темп и заранее запланируйте финальный приём пищи.'
    };
  }

  if (isStopConfirming) {
    return {
      tone: 'warning',
      badge: 'Подтверждение',
      title: 'Сессия на паузе подтверждения',
      description: 'Проверьте самочувствие и решите: продолжить цикл или завершить с фиксацией в истории.',
      hint: 'Если завершаете, сделайте это без спешки и начните мягкий выход.'
    };
  }

  if (!isGoalReached) {
    if (remainingToGoalSeconds <= 30 * 60) {
      return {
        tone: 'success',
        badge: 'Финишный коридор',
        title: `До цели ${formatCompactDuration(remainingToGoalSeconds)}`,
        description: 'Цель уже близко. Можно подготовить выход: воду, лёгкую еду и спокойный режим.',
        hint: 'Не усиливайте нагрузку в последние 30 минут цикла.'
      };
    }

    if (nextMilestone) {
      const timeToMilestone = Math.max(0, nextMilestone.second - elapsed);
      if (timeToMilestone <= 20 * 60) {
        return {
          tone: 'info',
          badge: 'Ориентир рядом',
          title: `${nextMilestone.label} через ${formatCompactDuration(timeToMilestone)}`,
          description: 'Вы приближаетесь к следующей контрольной точке. Сохраняйте текущий темп.',
          hint: 'Фиксируйте ощущения на контрольных точках, чтобы сравнивать динамику между циклами.'
        };
      }
    }

    return {
      tone: 'neutral',
      badge: 'Ровный ход',
      title: 'Сессия идёт стабильно',
      description: `До цели ${formatCompactDuration(remainingToGoalSeconds)}. Навигатор обновляет ориентиры в реальном времени.`,
      hint: 'Поддерживайте гидратацию и умеренную активность без резких нагрузок.'
    };
  }

  const exitWindow = getGoalExitWindowSeconds(goalSeconds);
  if (overflowSeconds <= exitWindow) {
    return {
      tone: 'success',
      badge: 'Оптимальное окно',
      title: 'Цель достигнута',
      description: `Сейчас мягкое окно завершения (${formatCompactDuration(exitWindow)} после цели).`,
      hint: 'Можно фиксировать сессию и переходить к выходу из голодания.'
    };
  }

  return {
    tone: 'warning',
    badge: 'Расширенный режим',
    title: `Сверх цели ${formatCompactDuration(overflowSeconds)}`,
    description: 'Вы вышли за рекомендованное окно завершения. Дальше лучше ориентироваться на аккуратный выход.',
    hint: 'Оцените самочувствие и, при необходимости, завершите цикл без дальнейшего продления.'
  };
};

const TimeCell = memo(({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-3 text-center">
    <div className="text-[10px] font-bold uppercase tracking-[0.16em] app-muted">{label}</div>
    <div className="mt-1 text-[30px] leading-none font-mono font-[850] tracking-tight app-header tabular-nums">{value}</div>
  </div>
));

const TimerBoard = memo(({
  isFasting,
  sessionState,
  timeMode,
  onModeChange,
  elapsedFormatted,
  remainingFormatted,
  totalHours,
  progress,
  phaseProgress,
  currentStart,
  currentEnd,
  overflowLabel,
}: TimerBoardProps) => {
  const isGoalReached = sessionState === 'running_goal_reached' || sessionState === 'stop_confirm';
  const display = isFasting
    ? timeMode === 'elapsed'
      ? elapsedFormatted
      : isGoalReached
        ? '00:00:00'
        : remainingFormatted
    : `${totalHours.toString().padStart(2, '0')}:00:00`;

  const [hours, minutes, seconds] = display.split(':');
  const finishLabel = formatFinishWithOffset(currentStart, currentEnd);

  return (
    <div className="rounded-[26px] border border-[color:var(--tg-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.94)_0%,rgba(246,248,252,0.88)_100%)] dark:bg-[linear-gradient(160deg,rgba(20,24,33,0.9)_0%,rgba(17,21,29,0.88)_100%)] px-4 py-4 shadow-[var(--app-shadow-soft)]">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-1">
          <button
            type="button"
            onClick={() => onModeChange('elapsed')}
            className={cn(
              'px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors',
              timeMode === 'elapsed' ? 'bg-[color:var(--tg-accent)] text-white' : 'app-muted'
            )}
          >
            Прошло
          </button>
          <button
            type="button"
            onClick={() => onModeChange('remaining')}
            className={cn(
              'px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors',
              timeMode === 'remaining' ? 'bg-[color:var(--tg-accent)] text-white' : 'app-muted'
            )}
            disabled={!isFasting}
          >
            Осталось
          </button>
        </div>

        <div className="text-[11px] font-bold app-muted">
          Цель: {totalHours}ч
        </div>
      </div>

      {isGoalReached && overflowLabel && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-300/65 dark:border-emerald-500/45 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
          <Check className="w-3.5 h-3.5" />
          Сверх цели {overflowLabel}
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        <TimeCell label="Часы" value={hours} />
        <TimeCell label="Минуты" value={minutes} />
        <TimeCell label="Секунды" value={seconds} />
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold app-muted mb-1">
            <span>Протокол</span>
            <span>{isFasting ? `${Math.round(progress)}%` : '0%'}</span>
          </div>
          <div className="h-2 rounded-full bg-black/8 dark:bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[linear-gradient(90deg,var(--tg-accent),#60A5FA)]"
              initial={{ width: 0 }}
              animate={{ width: `${isFasting ? progress : 0}%` }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold app-muted mb-1">
            <span>Текущая фаза</span>
            <span>{isFasting ? `${Math.round(phaseProgress)}%` : '0%'}</span>
          </div>
          <div className="h-2 rounded-full bg-black/8 dark:bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[linear-gradient(90deg,#22D3EE,#14B8A6)]"
              initial={{ width: 0 }}
              animate={{ width: `${isFasting ? phaseProgress : 0}%` }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] app-muted">Старт</div>
          <div className="mt-1 text-[13px] font-bold app-header">{dayjs(currentStart).format('HH:mm')}</div>
        </div>
        <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] app-muted">Финиш</div>
          <div className="mt-1 text-[13px] font-bold app-header">{finishLabel}</div>
        </div>
      </div>
    </div>
  );
});

interface SmartSessionBoardProps {
  coach: SessionCoachModel;
  isFasting: boolean;
  laneProgress: number;
  previousMilestoneLabel: string;
  nextMilestoneLabel: string;
  nextMilestoneEta: string | null;
  predictedFinishLabel: string;
  historyStats: SchemeHistoryStats;
}

const SMART_TONE_STYLES: Record<
  SessionCoachTone,
  { shell: string; badge: string; hint: string; line: string }
> = {
  neutral: {
    shell: 'border-[color:var(--tg-border)] bg-[color:var(--tg-glass)]',
    badge: 'border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] app-muted',
    hint: 'text-[color:var(--tg-muted)]',
    line: 'bg-[linear-gradient(90deg,var(--tg-accent),#60A5FA)]'
  },
  info: {
    shell: 'border-sky-200/70 dark:border-sky-500/35 bg-sky-500/8',
    badge: 'border-sky-300/60 dark:border-sky-500/35 bg-sky-500/12 text-sky-700 dark:text-sky-200',
    hint: 'text-sky-700 dark:text-sky-200',
    line: 'bg-[linear-gradient(90deg,#38BDF8,#0EA5E9)]'
  },
  success: {
    shell: 'border-emerald-200/70 dark:border-emerald-500/35 bg-emerald-500/8',
    badge: 'border-emerald-300/60 dark:border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-200',
    hint: 'text-emerald-700 dark:text-emerald-200',
    line: 'bg-[linear-gradient(90deg,#22C55E,#14B8A6)]'
  },
  warning: {
    shell: 'border-amber-200/80 dark:border-amber-500/40 bg-amber-500/10',
    badge: 'border-amber-300/70 dark:border-amber-500/40 bg-amber-500/14 text-amber-700 dark:text-amber-200',
    hint: 'text-amber-700 dark:text-amber-200',
    line: 'bg-[linear-gradient(90deg,#F59E0B,#F97316)]'
  }
};

const SmartSessionBoard = memo(({
  coach,
  isFasting,
  laneProgress,
  previousMilestoneLabel,
  nextMilestoneLabel,
  nextMilestoneEta,
  predictedFinishLabel,
  historyStats
}: SmartSessionBoardProps) => {
  const tone = SMART_TONE_STYLES[coach.tone];

  return (
    <div className={cn('rounded-[24px] border px-4 py-4 shadow-[var(--app-shadow-soft)]', tone.shell)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] font-bold app-muted">Умный навигатор</p>
          <h3 className="mt-1 text-[17px] font-[900] leading-tight app-header">{coach.title}</h3>
          <p className="mt-1 text-[12px] app-muted leading-snug">{coach.description}</p>
        </div>
        <div className={cn('px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap', tone.badge)}>
          {coach.badge}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="min-w-0 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2.5">
          <div className="flex items-center gap-1 app-muted text-[10px] font-bold uppercase tracking-[0.13em]">
            <Flag className="w-3 h-3" />
            Ориентир
          </div>
          <p className="mt-1 text-[12px] font-bold app-header leading-snug line-clamp-2 break-words">{nextMilestoneLabel}</p>
          <p className="mt-0.5 text-[10px] app-muted truncate">{nextMilestoneEta ?? 'Все ориентиры пройдены'}</p>
        </div>

        <div className="min-w-0 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2.5">
          <div className="flex items-center gap-1 app-muted text-[10px] font-bold uppercase tracking-[0.13em]">
            <Clock3 className="w-3 h-3" />
            Финиш
          </div>
          <p className="mt-1 text-[12px] font-bold app-header leading-snug truncate">{predictedFinishLabel}</p>
          <p className="mt-0.5 text-[10px] app-muted">{isFasting ? 'Прогноз по истории' : 'Типичный ориентир'}</p>
        </div>

        <div className="min-w-0 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2.5">
          <div className="flex items-center gap-1 app-muted text-[10px] font-bold uppercase tracking-[0.13em]">
            <TrendingUp className="w-3 h-3" />
            Точность
          </div>
          <p className="mt-1 text-[12px] font-bold app-header leading-snug">{historyStats.completionRate}%</p>
          <p className="mt-0.5 text-[10px] app-muted">
            {historyStats.completedSessions}/{historyStats.totalSessions || 0} целей
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold app-muted mb-1">
          <span className="min-w-0 max-w-[45%] truncate">{previousMilestoneLabel}</span>
          <span className="min-w-0 max-w-[45%] truncate text-right">{nextMilestoneLabel}</span>
        </div>
        <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <motion.div
            className={cn('h-full', tone.line)}
            initial={{ width: 0 }}
            animate={{ width: `${isFasting ? laneProgress : 0}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className={cn('mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold leading-snug', tone.hint)}>
        <Target className="w-3.5 h-3.5 shrink-0" />
        <span>{coach.hint}</span>
      </div>
    </div>
  );
});

export const FastingPage = () => {
  const {
    isFasting,
    scheme,
    setSchemeId,
    progress,
    elapsedFormatted,
    elapsed,
    toggleFasting,
    startTime,
    setStartTime
  } = useFastingTimerContext();

  const [isSelecting, setIsSelecting] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  const [showStartSuccess, setShowStartSuccess] = useState(false);
  const [timeMode, setTimeMode] = useState<TimeMode>('elapsed');
  const [showTimeEditors, setShowTimeEditors] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const [isStopConfirming, setIsStopConfirming] = useState(false);
  const [schemeHistoryStats, setSchemeHistoryStats] = useState<SchemeHistoryStats>(EMPTY_SCHEME_STATS);

  const navigate = useNavigate();
  const goalSeconds = scheme.hours * 3600;
  const isGoalReached = isFasting && elapsed >= goalSeconds;
  const overflowSeconds = isGoalReached ? elapsed - goalSeconds : 0;
  const overflowLabel = isGoalReached ? formatOverGoal(overflowSeconds) : null;

  const sessionState: TimerSessionState = useMemo(() => {
    if (isFasting && isStopConfirming) return 'stop_confirm';
    if (isFasting) return isGoalReached ? 'running_goal_reached' : 'running_active';
    return isReadyToStart ? 'idle_ready' : 'idle_unconfigured';
  }, [isFasting, isGoalReached, isReadyToStart, isStopConfirming]);

  const loadSchemeHistoryStats = useCallback(async () => {
    try {
      const history = await storageGetHistory<HistoryRecord>('history_fasting');
      setSchemeHistoryStats(calculateSchemeHistoryStats(history, scheme.title, goalSeconds));
    } catch (error) {
      console.error('Failed to load fasting history stats:', error);
      setSchemeHistoryStats(EMPTY_SCHEME_STATS);
    }
  }, [goalSeconds, scheme.title]);

  useEffect(() => {
    if (isFasting) {
      setIsReadyToStart(true);
      return;
    }
    setTimeMode('elapsed');
    setShowTimeEditors(false);
    setIsStopConfirming(false);
  }, [isFasting]);

  useEffect(() => {
    if (sessionState !== 'running_active') {
      setShowTimeEditors(false);
    }
  }, [sessionState]);

  useEffect(() => {
    if (sessionState === 'running_goal_reached' && timeMode === 'remaining') {
      setTimeMode('elapsed');
    }
  }, [sessionState, timeMode]);

  useEffect(() => {
    void loadSchemeHistoryStats();
  }, [loadSchemeHistoryStats]);

  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (!detail?.key || detail.key === 'history_fasting') {
        void loadSchemeHistoryStats();
      }
    };

    window.addEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
    return () => window.removeEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
  }, [loadSchemeHistoryStats]);

  const handleStartFlow = () => {
    if (isReadyToStart) {
      toggleFasting();
      setShowStartSuccess(true);
      return;
    }
    setIsSelecting(true);
  };

  const handleSelectScheme = (id: string) => {
    setSchemeId(id);

    if (!isFasting) {
      toggleFasting();
      setTimeout(() => setShowStartSuccess(true), 300);
    }

    setIsReadyToStart(true);
  };

  const handleStopConfirmed = () => {
    toggleFasting();
    setIsReadyToStart(false);
    setIsStopConfirming(false);
  };

  const currentStart = startTime || dayjs().toISOString();
  const currentEnd = dayjs(currentStart).add(scheme.hours, 'hour').toISOString();

  const handleChangeStart = (v: string) => {
    const candidate = dayjs(v);
    const now = dayjs();
    const safeStart = candidate.isAfter(now) ? now : candidate;
    setStartTime(safeStart.toISOString());
  };
  const handleChangeEnd = (v: string) => {
    const candidateStart = dayjs(v).subtract(scheme.hours, 'hour');
    const now = dayjs();
    const safeStart = candidateStart.isAfter(now) ? now : candidateStart;
    setStartTime(safeStart.toISOString());
  };

  const elapsedHours = elapsed / 3600;
  const activeIndex = useMemo(() => {
    for (let i = FASTING_PHASES.length - 1; i >= 0; i--) {
      if (elapsedHours >= FASTING_PHASES[i].hoursStart) return i;
    }
    return 0;
  }, [elapsedHours]);

  const activePhase = FASTING_PHASES[activeIndex] ?? FASTING_PHASES[0];
  const nextPhase = FASTING_PHASES[activeIndex + 1] ?? null;
  const phaseSticker = getPhaseSticker(activePhase.id);
  const phaseCue = getPhaseCue(activePhase.id);
  const phaseSurface = PHASE_SURFACE_BY_ID[activePhase.id] ?? PHASE_SURFACE_BY_ID[1];

  const phaseProgress = useMemo(
    () => getPhaseProgress(elapsedHours, activePhase.hoursStart, activePhase.hoursEnd, isFasting),
    [activePhase.hoursEnd, activePhase.hoursStart, elapsedHours, isFasting]
  );

  const remainingFormatted = useMemo(() => {
    const elapsedClamped = Math.min(Math.max(0, elapsed), goalSeconds);
    return formatDuration(goalSeconds - elapsedClamped);
  }, [elapsed, goalSeconds]);

  const sessionMilestones = useMemo(() => buildSessionMilestones(goalSeconds), [goalSeconds]);

  const milestoneWindow = useMemo(
    () => resolveMilestoneWindow(elapsed, sessionMilestones),
    [elapsed, sessionMilestones]
  );

  const remainingToGoalSeconds = Math.max(0, goalSeconds - elapsed);
  const nextMilestoneEta = milestoneWindow.nextMilestone
    ? `Через ${formatCompactDuration(Math.max(0, milestoneWindow.nextMilestone.second - elapsed))}`
    : null;
  const nextMilestoneLabel = formatMilestoneLabel(milestoneWindow.nextMilestone?.label ?? 'Цель закрыта');
  const previousMilestoneLabel = formatMilestoneLabel(milestoneWindow.previousMilestone?.label ?? 'Старт', 18);

  const predictedDurationSeconds = useMemo(
    () => getPredictedDurationSeconds(goalSeconds, schemeHistoryStats),
    [goalSeconds, schemeHistoryStats]
  );
  const predictedFinishIso = useMemo(
    () => dayjs(currentStart).add(predictedDurationSeconds, 'second').toISOString(),
    [currentStart, predictedDurationSeconds]
  );
  const predictedFinishLabel = isFasting
    ? formatFinishWithOffset(currentStart, predictedFinishIso)
    : `~${formatCompactDuration(predictedDurationSeconds)}`;

  const sessionCoach = useMemo(
    () =>
      buildSessionCoach({
        isFasting,
        isStopConfirming,
        isGoalReached,
        elapsed,
        goalSeconds,
        overflowSeconds,
        nextMilestone: milestoneWindow.nextMilestone,
        remainingToGoalSeconds,
        historyStats: schemeHistoryStats
      }),
    [
      elapsed,
      goalSeconds,
      isFasting,
      isGoalReached,
      isStopConfirming,
      milestoneWindow.nextMilestone,
      overflowSeconds,
      remainingToGoalSeconds,
      schemeHistoryStats
    ]
  );

  const selectedPhase = selectedPhaseId
    ? FASTING_PHASES.find((phase) => phase.id === selectedPhaseId) ?? null
    : null;

  return (
    <>
      {isSelecting && (
        <ProtocolSelector
          onSelect={handleSelectScheme}
          onClose={() => setIsSelecting(false)}
          currentSchemeId={scheme.id}
        />
      )}

      <FastingStartModal
        isOpen={showStartSuccess}
        onClose={() => setShowStartSuccess(false)}
      />

      {selectedPhase && (
        <PhaseSheet
          phase={selectedPhase}
          onClose={() => setSelectedPhaseId(null)}
        />
      )}

      <div className="flex flex-col relative z-0">
        <div className="relative flex flex-col z-10 rounded-[28px] overflow-hidden app-card">
          <div className="px-5 pt-5 pb-3 flex justify-between items-start relative z-20 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-2 h-2 rounded-full', isFasting ? 'bg-[color:var(--tg-accent)] animate-pulse' : 'bg-[color:var(--tg-border)]')} />
                <span className="text-[11px] font-bold app-muted uppercase tracking-widest">
                  {isFasting ? 'Активность' : 'Статус'}
                </span>
              </div>
              <h1 className="text-[26px] font-[900] app-header leading-tight tracking-tight">
                {isFasting ? 'Голодание' : 'Ожидание'}
              </h1>
            </div>
            <ProfileAvatar onClick={() => navigate('/profile')} />
          </div>

          <div className="px-5 pb-4 space-y-3.5">
            <div className={cn('rounded-[25px] border border-[color:var(--tg-border)] bg-gradient-to-br px-4 py-4 relative overflow-hidden', phaseSurface)}>
              <div className="absolute -right-8 -top-10 w-24 h-24 rounded-full bg-[color:var(--tg-accent)]/12 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] font-bold app-muted">Фазовая лента</p>
                  <h2 className="mt-1 text-[21px] font-[900] app-header leading-[1.08] pr-2">{activePhase.subtitle}</h2>
                  <p className="mt-1 text-[11px] font-semibold text-[color:var(--tg-accent)]/90">{phaseCue}</p>
                </div>

                <motion.div
                  animate={{ y: [0, -3, 0], rotate: [0, 4, 0] }}
                  transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="shrink-0"
                >
                  <AnimatedSticker name={phaseSticker} size={42} />
                </motion.div>
              </div>

              <div className="relative z-10 mt-3 grid grid-cols-9 gap-1.5">
                {FASTING_PHASES.map((phase, index) => {
                  const isCurrent = isFasting ? index === activeIndex : index === 0;
                  const isPassed = isFasting && index < activeIndex;

                  return (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => setSelectedPhaseId(phase.id)}
                      className={cn(
                        'h-8 rounded-xl border text-[11px] font-bold transition-colors',
                        isCurrent
                          ? 'bg-[color:var(--tg-accent)] text-white border-[color:var(--tg-accent)]'
                          : isPassed
                            ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-300/50 dark:border-emerald-500/30'
                            : 'bg-[color:var(--tg-glass)] app-muted border-[color:var(--tg-border)]'
                      )}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 mx-auto" /> : phase.id}
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 mt-3 space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold app-muted mb-1">
                    <span>Окно текущей фазы</span>
                    <span>{activePhase.hoursStart}-{activePhase.hoursEnd ?? '∞'}ч • {Math.round(phaseProgress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/8 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-[linear-gradient(90deg,#22D3EE,#14B8A6)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${isFasting ? phaseProgress : 0}%` }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold app-muted leading-snug">
                    {isFasting
                      ? nextPhase
                        ? `Далее: ${nextPhase.subtitle} с ${nextPhase.hoursStart}ч.`
                        : 'Финальная стадия: акцент на мягком выходе.'
                      : 'Таймлайн активируется после старта протокола.'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedPhaseId(activePhase.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[color:var(--tg-accent)] shrink-0"
                  >
                    Детали
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <TimerBoard
              isFasting={isFasting}
              sessionState={sessionState}
              timeMode={timeMode}
              onModeChange={setTimeMode}
              elapsedFormatted={elapsedFormatted}
              remainingFormatted={remainingFormatted}
              totalHours={scheme.hours}
              progress={progress}
              phaseProgress={phaseProgress}
              currentStart={currentStart}
              currentEnd={currentEnd}
              overflowLabel={overflowLabel}
            />

            <SmartSessionBoard
              coach={sessionCoach}
              isFasting={isFasting}
              laneProgress={milestoneWindow.laneProgress}
              previousMilestoneLabel={previousMilestoneLabel}
              nextMilestoneLabel={nextMilestoneLabel}
              nextMilestoneEta={nextMilestoneEta}
              predictedFinishLabel={predictedFinishLabel}
              historyStats={schemeHistoryStats}
            />

            {isFasting && (
              <div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowTimeEditors((prev) => !prev)}
                    className="inline-flex items-center gap-1 rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-1 text-[11px] font-bold text-[color:var(--tg-accent)]"
                  >
                    {showTimeEditors ? 'Скрыть редактирование' : `Изменить время ${dayjs(currentStart).format('HH:mm')}`}
                  </button>
                </div>

                {showTimeEditors && (
                  <div className="flex justify-center gap-4 mt-2">
                    <NativeDatePicker label="Начало" icon={Sunrise} dateValue={currentStart} onChange={handleChangeStart} disabled={!isFasting} />
                    <div className="w-px bg-[color:var(--tg-border)] h-10 self-center" />
                    <NativeDatePicker label="Финиш" icon={Moon} dateValue={currentEnd} onChange={handleChangeEnd} disabled={!isFasting} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-5 pb-8 pt-3 bg-[color:var(--tg-glass)] backdrop-blur-xl border-t border-[color:var(--tg-border)]">
            {isFasting ? (
              <div className="space-y-2.5">
                {!isStopConfirming ? (
                  <button
                    type="button"
                    onClick={() => setIsStopConfirming(true)}
                    className="w-full rounded-2xl px-4 py-3.5 text-left bg-[linear-gradient(120deg,#FF6B57_0%,#FF453A_100%)] text-white shadow-[0_14px_28px_-18px_rgba(239,68,68,0.8)] active:scale-[0.99] transition-transform"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-white/80">Завершение</p>
                        <p className="mt-1 text-[20px] font-[900] leading-none">Открыть выход из цикла</p>
                        <p className="mt-1.5 text-[12px] font-semibold text-white/85">Бережно остановить таймер и зафиксировать сессию</p>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-white/22 flex items-center justify-center shrink-0">
                        <Square className="w-5 h-5 fill-current" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-rose-300/60 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-500/10 p-3">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-[12px] font-semibold">
                      <Sparkles className="w-4 h-4" />
                      Подтвердите завершение сессии
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsStopConfirming(false)}
                        className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-3 py-2.5 text-[13px] font-bold app-header"
                      >
                        Продолжить
                      </button>
                      <button
                        type="button"
                        onClick={handleStopConfirmed}
                        className="rounded-xl bg-rose-600 text-white px-3 py-2.5 text-[13px] font-bold"
                      >
                        Завершить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartFlow}
                className={cn(
                  'w-full rounded-2xl px-4 py-3.5 text-left transition-transform active:scale-[0.99]',
                  isReadyToStart
                    ? 'bg-[linear-gradient(120deg,var(--tg-accent)_0%,#2563EB_100%)] text-white shadow-[0_14px_30px_-20px_rgba(37,99,235,0.85)]'
                    : 'border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-[0.16em] font-bold', isReadyToStart ? 'text-white/80' : 'app-muted')}>
                      {isReadyToStart ? 'Протокол готов' : 'Шаг 1'}
                    </p>
                    <p className={cn('mt-1 text-[20px] font-[900] leading-none', isReadyToStart ? 'text-white' : 'app-header')}>
                      {isReadyToStart ? 'Запустить цикл' : 'Выбрать протокол'}
                    </p>
                    <p className={cn('mt-1.5 text-[12px] font-semibold', isReadyToStart ? 'text-white/85' : 'app-muted')}>
                      {isReadyToStart ? 'Таймер начнёт отсчёт и активирует карту фаз' : 'Выберите длительность и физиологический сценарий'}
                    </p>
                  </div>

                  <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
                    isReadyToStart ? 'bg-white/22 text-white' : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border border-[color:var(--tg-border)]'
                  )}>
                    {isReadyToStart ? <Play className="w-5 h-5 fill-current ml-0.5" /> : <ListFilter className="w-5 h-5" />}
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
