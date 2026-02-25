import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CloudRain,
  Flame,
  Gauge,
  Pause,
  Sparkles,
  Square,
  Waves,
  Wind
} from 'lucide-react';
import { BREATH_LEVELS } from './data/patterns';
import { useBreathingSession } from './hooks/useBreathingSession';
import { BreathingCircle } from './components/BreathingCircle';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { AMBIENT_TRACKS, soundManager } from '../../utils/sounds';
import { storageGetHistory, HISTORY_UPDATED_EVENT_NAME } from '../../utils/storage';
import type { HistoryRecord } from '../../utils/types';
import { cn } from '../../utils/cn';

type SessionModeId = 'focus' | 'balance' | 'deep' | 'endurance' | 'custom';
type RecommendedModeId = Exclude<SessionModeId, 'custom'>;

interface SessionMode {
  id: RecommendedModeId;
  label: string;
  minutes: number;
  countdown: number;
  accent: string;
  hint: string;
}

interface BreathingInsights {
  totalSessions: number;
  avgMinutes: number;
  successRate: number;
  lastLevel: number;
  recommendedLevel: number;
  recommendedModeId: RecommendedModeId;
  title: string;
  hint: string;
}

const SESSION_MODES: SessionMode[] = [
  {
    id: 'focus',
    label: 'Фокус',
    minutes: 6,
    countdown: 3,
    accent: 'from-cyan-500 to-blue-500',
    hint: 'Короткий быстрый вход в рабочее состояние.'
  },
  {
    id: 'balance',
    label: 'Баланс',
    minutes: 10,
    countdown: 3,
    accent: 'from-blue-500 to-indigo-500',
    hint: 'Оптимальный ежедневный протокол без перегруза.'
  },
  {
    id: 'deep',
    label: 'Глубина',
    minutes: 14,
    countdown: 4,
    accent: 'from-indigo-500 to-violet-500',
    hint: 'Продлённая работа на стабильной технике.'
  },
  {
    id: 'endurance',
    label: 'Выносливость',
    minutes: 20,
    countdown: 5,
    accent: 'from-violet-500 to-fuchsia-500',
    hint: 'Длинная практика для опытных сессий.'
  }
];

const EMPTY_INSIGHTS: BreathingInsights = {
  totalSessions: 0,
  avgMinutes: 0,
  successRate: 0,
  lastLevel: 0,
  recommendedLevel: 0,
  recommendedModeId: 'focus',
  title: 'Новый цикл дыхания',
  hint: 'Для старта держитесь уровней 0-2 и наращивайте глубину только через стабильные повторы.'
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const formatClock = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
};

const parseLevelFromScheme = (scheme: string) => {
  const match = scheme.match(/уровень\s*(\d+)/i);
  if (!match) return 0;
  return Number.parseInt(match[1], 10) || 0;
};

const parseMinutesFromScheme = (scheme: string) => {
  const strict = scheme.match(/•\s*(\d+)м/i);
  const fallback = scheme.match(/(\d+)м/i);
  const value = strict?.[1] ?? fallback?.[1];
  if (!value) return null;
  return Number.parseInt(value, 10) || null;
};

const buildInsights = (records: HistoryRecord[]): BreathingInsights => {
  const breathing = records
    .filter((record) => record.type === 'breathing' && Number.isFinite(record.durationSeconds) && record.durationSeconds > 0)
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());

  if (!breathing.length) {
    return EMPTY_INSIGHTS;
  }

  const recent = breathing.slice(0, 14);
  const totalSessions = recent.length;
  const avgMinutes = Number((recent.reduce((sum, record) => sum + record.durationSeconds, 0) / totalSessions / 60).toFixed(1));

  const successCount = recent.filter((record) => {
    const plannedMinutes = parseMinutesFromScheme(record.scheme);
    const requiredSeconds = (plannedMinutes ?? 6) * 60 * 0.85;
    return record.durationSeconds >= requiredSeconds;
  }).length;

  const successRate = Math.round((successCount / totalSessions) * 100);
  const lastLevel = clamp(parseLevelFromScheme(recent[0].scheme), 0, BREATH_LEVELS.length - 1);

  const lifetimeSessions = breathing.length;
  const stableLongSessions = breathing.filter((record) => {
    const plannedMinutes = parseMinutesFromScheme(record.scheme) ?? 6;
    const plannedSeconds = plannedMinutes * 60;
    return record.durationSeconds >= Math.max(10 * 60, plannedSeconds * 0.9);
  }).length;

  // Для нетренированных пользователей удерживаем рекомендации в базовом диапазоне 0-2.
  let recommendationCap = 2;
  if (lifetimeSessions >= 24 && successRate >= 86 && avgMinutes >= 10) {
    recommendationCap = 4;
  }
  if (lifetimeSessions >= 48 && successRate >= 90 && avgMinutes >= 12 && stableLongSessions >= 18) {
    recommendationCap = 6;
  }
  if (lifetimeSessions >= 84 && successRate >= 93 && avgMinutes >= 14 && stableLongSessions >= 36) {
    recommendationCap = 8;
  }
  if (lifetimeSessions >= 130 && successRate >= 95 && avgMinutes >= 16 && stableLongSessions >= 64) {
    recommendationCap = 10;
  }
  if (lifetimeSessions >= 190 && successRate >= 97 && avgMinutes >= 18 && stableLongSessions >= 100) {
    recommendationCap = BREATH_LEVELS.length - 1;
  }

  let recommendedLevel = clamp(lastLevel, 0, recommendationCap);
  if (successRate >= 88 && avgMinutes >= 10) {
    recommendedLevel = clamp(lastLevel + 1, 0, recommendationCap);
  } else if (successRate <= 42 || avgMinutes < 5.5) {
    recommendedLevel = clamp(lastLevel - 1, 0, recommendationCap);
  }

  let recommendedModeId: RecommendedModeId = 'focus';
  if (avgMinutes >= 16 && recommendationCap >= 8) {
    recommendedModeId = 'endurance';
  } else if (avgMinutes >= 11 && recommendationCap >= 4) {
    recommendedModeId = 'deep';
  } else if (avgMinutes >= 7) {
    recommendedModeId = 'balance';
  }

  if (successRate < 45) {
    recommendedModeId = 'focus';
  }

  let title = 'Стабильная траектория';
  let hint = 'Держите текущий ритм и добавляйте длительность только при ровной технике.';

  if (recommendationCap <= 2) {
    if (successRate < 45) {
      title = 'Нужна стабилизация';
      hint = 'Оптимальный диапазон сейчас: уровни 0-2. Сначала соберите короткую стабильную серию.';
    } else if (successRate >= 84 && avgMinutes >= 10) {
      title = 'База закреплена';
      hint = 'Пока держитесь уровней 0-2. Переход выше только после длительной стабильной практики.';
    } else {
      title = 'Базовый коридор';
      hint = 'Для неподготовленного дыхания рекомендуем уровни 0-2: это безопаснее и даёт устойчивый прогресс.';
    }
  } else if (successRate >= 84 && avgMinutes >= 10) {
    title = 'Готов к прогрессии';
    hint = 'Можно поднять уровень и сохранить выбранный режим без спешки.';
  } else if (successRate < 45) {
    title = 'Нужна стабилизация';
    hint = 'Снизьте нагрузку и соберите серию коротких успешных сессий.';
  } else if (avgMinutes >= 14) {
    title = 'Глубокая выносливость';
    hint = 'Вы стабильно держите длинную сессию, можно расти по уровню.';
  }

  return {
    totalSessions,
    avgMinutes,
    successRate,
    lastLevel,
    recommendedLevel,
    recommendedModeId,
    title,
    hint
  };
};

const trackIcons: Record<string, ComponentType<{ className?: string }>> = {
  fire: Flame,
  rain: CloudRain,
  wind: Wind,
  space: Sparkles
};

export const BreathingPage = () => {
  const navigate = useNavigate();

  const [levelIndex, setLevelIndex] = useState(0);
  const [modeId, setModeId] = useState<SessionModeId>('balance');
  const [customMinutes, setCustomMinutes] = useState(12);
  const [insights, setInsights] = useState<BreathingInsights>(EMPTY_INSIGHTS);

  const [musicEnabled, setMusicEnabled] = useState(soundManager.isMusicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(soundManager.isSfxEnabled);
  const [musicVolume, setMusicVolume] = useState(soundManager.musicVolume);
  const [sfxVolume, setSfxVolume] = useState(soundManager.sfxVolume);
  const [currentTrackId, setCurrentTrackId] = useState(soundManager.getCurrentTrackId());
  const [soundPanelOpen, setSoundPanelOpen] = useState(true);
  const [focusChromeVisible, setFocusChromeVisible] = useState(true);
  const [finishArmed, setFinishArmed] = useState(false);

  const isConfigTouchedRef = useRef(false);
  const focusChromeTimerRef = useRef<number | null>(null);
  const circlePressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const activeLevel = BREATH_LEVELS[levelIndex];
  const selectedMode = SESSION_MODES.find((mode) => mode.id === modeId);
  const selectedModeLabel = modeId === 'custom' ? 'Кастом' : (selectedMode?.label ?? 'Баланс');
  const durationMinutes = modeId === 'custom' ? customMinutes : (selectedMode?.minutes ?? 10);
  const countdownSeconds = modeId === 'custom' ? 3 : (selectedMode?.countdown ?? 3);

  const {
    phase,
    activePhase,
    countdownLeft,
    phaseTimeLeft,
    phaseProgress,
    elapsedSeconds,
    sessionTimeLeft,
    targetCycles,
    isCountingDown,
    isRunning,
    isPaused,
    startSession,
    cancelCountdown,
    stopSession,
    togglePause,
    resetSession
  } = useBreathingSession(activeLevel, durationMinutes, countdownSeconds);

  const isFocusMode = phase !== 'idle';
  const cycleSeconds = activeLevel.inhale + activeLevel.hold + activeLevel.exhale;
  const loadIndex = Math.round((activeLevel.hold / Math.max(1, activeLevel.inhale + activeLevel.exhale)) * 100);
  const oxygenLoad = Math.round((activeLevel.hold * durationMinutes) / 6);
  const levelDescriptor = activeLevel.name.replace(/^Уровень\s*\d+\s*/i, '').replace(/[()]/g, '').trim();
  const levelProgressPercent = ((levelIndex + 1) / BREATH_LEVELS.length) * 100;

  const modeHint = useMemo(() => {
    if (modeId === 'custom') return `Кастом ${customMinutes} минут`;
    return selectedMode?.hint ?? '';
  }, [customMinutes, modeId, selectedMode]);

  const isRecommendationApplied =
    insights.recommendedLevel === levelIndex &&
    (modeId === insights.recommendedModeId || (modeId === 'custom' && insights.recommendedModeId === 'balance'));

  const loadHistoryInsights = useCallback(async () => {
    try {
      const history = await storageGetHistory<HistoryRecord>('history_fasting');
      const nextInsights = buildInsights(history);
      setInsights(nextInsights);

      if (!isConfigTouchedRef.current && phase === 'idle') {
        setLevelIndex(nextInsights.recommendedLevel);
        setModeId(nextInsights.recommendedModeId);
      }
    } catch (error) {
      console.error('Failed to load breathing insights:', error);
      setInsights(EMPTY_INSIGHTS);
    }
  }, [phase]);

  useEffect(() => {
    void loadHistoryInsights();
  }, [loadHistoryInsights]);

  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (!detail?.key || detail.key === 'history_fasting') {
        void loadHistoryInsights();
      }
    };

    window.addEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
    return () => window.removeEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
  }, [loadHistoryInsights]);

  const clearFocusChromeTimer = useCallback(() => {
    if (focusChromeTimerRef.current != null) {
      window.clearTimeout(focusChromeTimerRef.current);
      focusChromeTimerRef.current = null;
    }
  }, []);

  const clearCirclePressTimer = useCallback(() => {
    if (circlePressTimerRef.current != null) {
      window.clearTimeout(circlePressTimerRef.current);
      circlePressTimerRef.current = null;
    }
  }, []);

  const scheduleFocusChromeHide = useCallback(() => {
    if (!isFocusMode || isPaused || isCountingDown || phase === 'finished' || finishArmed) return;
    clearFocusChromeTimer();
    focusChromeTimerRef.current = window.setTimeout(() => {
      setFocusChromeVisible(false);
    }, 2200);
  }, [clearFocusChromeTimer, finishArmed, isCountingDown, isFocusMode, isPaused, phase]);

  const revealFocusChrome = useCallback(() => {
    setFocusChromeVisible(true);
    scheduleFocusChromeHide();
  }, [scheduleFocusChromeHide]);

  useEffect(() => {
    if (!isFocusMode) {
      setFocusChromeVisible(true);
      setFinishArmed(false);
      clearFocusChromeTimer();
      clearCirclePressTimer();
      longPressTriggeredRef.current = false;
      return;
    }

    setFocusChromeVisible(true);
    if (isPaused || isCountingDown || phase === 'finished' || finishArmed) {
      clearFocusChromeTimer();
      return;
    }
    scheduleFocusChromeHide();
  }, [clearCirclePressTimer, clearFocusChromeTimer, finishArmed, isCountingDown, isFocusMode, isPaused, phase, scheduleFocusChromeHide]);

  useEffect(() => {
    if (!finishArmed) return;
    const timeoutId = window.setTimeout(() => setFinishArmed(false), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [finishArmed]);

  useEffect(
    () => () => {
      clearFocusChromeTimer();
      clearCirclePressTimer();
    },
    [clearCirclePressTimer, clearFocusChromeTimer]
  );

  const markConfigTouched = () => {
    isConfigTouchedRef.current = true;
  };

  const selectLevel = (nextIndex: number) => {
    markConfigTouched();
    setLevelIndex(clamp(nextIndex, 0, BREATH_LEVELS.length - 1));
  };

  const selectMode = (nextMode: SessionModeId) => {
    markConfigTouched();
    setModeId(nextMode);
  };

  const applyRecommendation = () => {
    if (phase !== 'idle') return;
    markConfigTouched();
    setLevelIndex(insights.recommendedLevel);
    setModeId(insights.recommendedModeId);
  };

  const handleToggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    soundManager.setMusicEnabled(next);
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundManager.setSfxEnabled(next);
  };

  const handleSelectTrack = (trackId: string) => {
    soundManager.unlock();
    void soundManager.setTrack(trackId);
    setCurrentTrackId(trackId);
  };

  const handleMusicVolume = (value: number) => {
    setMusicVolume(value);
    soundManager.setMusicVolume(value);
  };

  const handleSfxVolume = (value: number) => {
    setSfxVolume(value);
    soundManager.setSfxVolume(value);
  };

  const handleSetupAction = () => {
    if (phase === 'idle') {
      startSession();
      return;
    }
    if (phase === 'finished') {
      resetSession();
    }
  };

  const handleCircleTap = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    revealFocusChrome();
    setFinishArmed(false);

    if (phase === 'finished') {
      resetSession();
      return;
    }

    if (isCountingDown) {
      cancelCountdown();
      return;
    }

    if (isRunning || isPaused) {
      togglePause();
      return;
    }
  };

  const handleCircleDoubleTap = () => {
    if (!isFocusMode || phase === 'finished') return;
    setFinishArmed(false);
    stopSession();
  };

  const handleCirclePressStart = () => {
    if (!isFocusMode || phase === 'finished' || isCountingDown) return;

    clearCirclePressTimer();
    longPressTriggeredRef.current = false;
    circlePressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      setFinishArmed(false);
      revealFocusChrome();
      stopSession();
    }, 700);
  };

  const handleCirclePressEnd = () => {
    clearCirclePressTimer();
  };

  const handleFocusFinish = () => {
    revealFocusChrome();

    if (phase === 'finished') {
      resetSession();
      return;
    }

    if (!finishArmed) {
      setFinishArmed(true);
      return;
    }

    setFinishArmed(false);
    stopSession();
  };

  const focusHint = phase === 'finished'
    ? 'Тап по кругу: новая сессия'
    : isCountingDown
      ? 'Тап по кругу: отменить запуск'
      : 'Тап по кругу: пауза/продолжить · удержание: завершить';

  const phaseChipStyle = phase === 'paused'
    ? 'border-amber-300/45 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(251,191,36,0.06))]'
    : phase === 'finished'
      ? 'border-emerald-300/45 bg-[linear-gradient(135deg,rgba(16,185,129,0.17),rgba(16,185,129,0.06))]'
      : phase === 'countdown'
        ? 'border-sky-300/45 bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(14,165,233,0.06))]'
        : 'border-cyan-300/45 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),rgba(59,130,246,0.06))]';

  const phaseIconStyle = phase === 'paused'
    ? 'border-amber-300/45 bg-amber-200/35 text-amber-700 dark:text-amber-200'
    : phase === 'finished'
      ? 'border-emerald-300/45 bg-emerald-200/35 text-emerald-700 dark:text-emerald-200'
      : phase === 'countdown'
        ? 'border-sky-300/45 bg-sky-200/35 text-sky-700 dark:text-sky-200'
        : 'border-cyan-300/45 bg-cyan-200/35 text-cyan-700 dark:text-cyan-200';

  const focusChipText = phase === 'countdown'
    ? `Старт ${countdownLeft}с`
    : phase === 'paused'
      ? `Пауза ${phaseTimeLeft}с`
      : phase === 'finished'
        ? 'Завершено'
        : phase === 'inhale'
          ? `Вдох ${phaseTimeLeft}с`
          : phase === 'hold'
            ? `Задержка ${phaseTimeLeft}с`
            : phase === 'exhale'
              ? `Выдох ${phaseTimeLeft}с`
              : 'Фокус';

  const renderSoundPanel = (compact: boolean) => (
    <div className={cn('rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)]', compact ? 'p-3' : 'p-4')}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] app-muted">Звуковая сцена</p>
          <p className={cn('font-bold app-header mt-1', compact ? 'text-[14px]' : 'text-[15px]')}>Фон + голосовые сигналы</p>
        </div>
        <button
          type="button"
          onClick={() => setSoundPanelOpen((prev) => !prev)}
          className="h-9 px-3 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] text-[12px] font-bold app-muted"
        >
          {soundPanelOpen ? 'Скрыть' : 'Показать'}
        </button>
      </div>

      {soundPanelOpen && (
        <div className={cn('space-y-3 mt-3', compact && 'mt-2.5')}>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleToggleMusic}
              className={cn(
                'rounded-xl border px-3 py-2 text-left transition-colors',
                musicEnabled
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200'
                  : 'border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] app-muted'
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.1em]">Фон</p>
              <p className="text-[13px] font-bold mt-1">{musicEnabled ? 'Включён' : 'Выключен'}</p>
            </button>

            <button
              type="button"
              onClick={handleToggleSfx}
              className={cn(
                'rounded-xl border px-3 py-2 text-left transition-colors',
                sfxEnabled
                  ? 'border-blue-400/40 bg-blue-400/10 text-blue-700 dark:text-blue-200'
                  : 'border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] app-muted'
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.1em]">Сигналы</p>
              <p className="text-[13px] font-bold mt-1">{sfxEnabled ? 'Включены' : 'Выключены'}</p>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold app-muted">
              <span className="inline-flex items-center gap-1"><Waves className="w-3 h-3" /> Громкость фона</span>
              <span>{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              disabled={!musicEnabled}
              onChange={(event) => handleMusicVolume(Number.parseFloat(event.target.value))}
              className="w-full h-2.5 accent-cyan-500 disabled:opacity-40"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold app-muted">
              <span className="inline-flex items-center gap-1"><Wind className="w-3 h-3" /> Громкость сигналов</span>
              <span>{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              disabled={!sfxEnabled}
              onChange={(event) => handleSfxVolume(Number.parseFloat(event.target.value))}
              className="w-full h-2.5 accent-blue-500 disabled:opacity-40"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AMBIENT_TRACKS.map((track) => {
              const Icon = trackIcons[track.icon] ?? Sparkles;
              const selected = currentTrackId === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  disabled={!musicEnabled}
                  className={cn(
                    'rounded-xl border px-2.5 py-2 text-left transition-all disabled:opacity-50',
                    selected
                      ? 'border-[color:var(--tg-accent)] bg-[color:var(--tg-accent)]/10'
                      : 'border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center', selected ? 'bg-[color:var(--tg-accent)] text-white' : 'bg-[color:var(--tg-glass)] app-muted')}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className={cn('text-[12px] font-bold', selected ? 'text-[color:var(--tg-accent)]' : 'app-header')}>{track.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col relative z-0">
      <div className="relative flex-1 min-h-0 rounded-[28px] overflow-hidden app-card">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_90%_10%,rgba(59,130,246,0.08)_0%,rgba(59,130,246,0)_70%),radial-gradient(70%_50%_at_8%_92%,rgba(6,182,212,0.08)_0%,rgba(6,182,212,0)_68%)]" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="px-5 pt-5 pb-3 shrink-0">
            <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[linear-gradient(150deg,rgba(59,130,246,0.09)_0%,rgba(34,211,238,0.06)_45%,rgba(255,255,255,0)_100%)] px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold app-muted uppercase tracking-[0.16em]">Практика дыхания</p>
                  <h1 className="mt-1 text-[30px] leading-none font-[900] app-header tracking-tight">Дыхание</h1>
                  <p className="mt-2 text-[11px] font-bold app-muted uppercase tracking-[0.14em]">Новая адаптивная практика</p>
                </div>

                <div className="shrink-0 pt-0.5">
                  <ProfileAvatar onClick={() => navigate('/profile')} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/90 px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Профиль</p>
                  <p className="mt-1 text-[12px] font-black app-header tabular-nums">
                    Уровень {activeLevel.id} · {activeLevel.inhale}-{activeLevel.hold}-{activeLevel.exhale}
                  </p>
                </div>
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/90 px-2.5 py-2 text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Сессия</p>
                  <p className="mt-1 text-[12px] font-black app-header tabular-nums">
                    {durationMinutes}м · {selectedModeLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-3">
            <section className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] app-muted">Аналитика практики</p>
                  <h2 className="mt-1 text-[22px] font-[900] app-header leading-tight">{insights.title}</h2>
                  <p className="mt-1 text-[12px] app-muted leading-relaxed">{insights.hint}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[color:var(--tg-accent)]/15 border border-[color:var(--tg-accent)]/30 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[color:var(--tg-accent)]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Сессии</p>
                  <p className="mt-1 text-[13px] font-black app-header tabular-nums">{insights.totalSessions}</p>
                </div>
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Успех</p>
                  <p className="mt-1 text-[13px] font-black app-header tabular-nums">{insights.successRate}%</p>
                </div>
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Средняя</p>
                  <p className="mt-1 text-[13px] font-black app-header tabular-nums">{insights.avgMinutes || 0}м</p>
                </div>
              </div>

              {!isRecommendationApplied && (
                <button
                  type="button"
                  onClick={applyRecommendation}
                  className="mt-3 w-full rounded-xl border border-[color:var(--tg-accent)]/40 bg-[color:var(--tg-accent)]/10 text-[12px] font-bold text-[color:var(--tg-accent)] px-3 py-2"
                >
                  Применить рекомендацию
                </button>
              )}
            </section>

            <section className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-4 space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] app-muted">Сложность</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-[20px] font-black app-header leading-none">Уровень {activeLevel.id}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] app-muted">{levelIndex + 1}/{BREATH_LEVELS.length}</span>
                  </div>
                  {levelDescriptor && (
                    <p className="mt-1 text-[11px] font-semibold app-muted leading-tight break-words">{levelDescriptor}</p>
                  )}
                </div>

                <div className="shrink-0 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-1.5 text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] app-muted">Ритм</p>
                  <p className="mt-0.5 text-[12px] font-black app-header tabular-nums">{activeLevel.inhale}-{activeLevel.hold}-{activeLevel.exhale}</p>
                </div>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                <div
                  className="h-full bg-[linear-gradient(90deg,#22D3EE,#3B82F6,#8B5CF6)] transition-all duration-300"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-[42px_minmax(0,1fr)_42px] gap-2 items-stretch">
                <button
                  type="button"
                  onClick={() => selectLevel(levelIndex - 1)}
                  disabled={levelIndex === 0}
                  className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] flex items-center justify-center disabled:opacity-35"
                >
                  <ChevronLeft className="w-5 h-5 app-muted" />
                </button>

                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2 py-2">
                  <div className="grid grid-cols-[1fr_1.15fr_1fr] gap-1.5">
                    <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/25 px-1 py-2 text-center min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.06em] font-bold text-cyan-700 dark:text-cyan-200 leading-none">Вдох</p>
                      <p className="mt-1 text-[clamp(16px,4.2vw,19px)] leading-none font-black text-cyan-700 dark:text-cyan-100 tabular-nums">{activeLevel.inhale}</p>
                    </div>
                    <div className="rounded-lg bg-violet-500/10 border border-violet-500/25 px-1 py-2 text-center min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.06em] font-bold text-violet-700 dark:text-violet-200 leading-none">Зад.</p>
                      <p className="mt-1 text-[clamp(16px,4.2vw,19px)] leading-none font-black text-violet-700 dark:text-violet-100 tabular-nums">{activeLevel.hold}</p>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/25 px-1 py-2 text-center min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.06em] font-bold text-blue-700 dark:text-blue-200 leading-none">Выдох</p>
                      <p className="mt-1 text-[clamp(16px,4.2vw,19px)] leading-none font-black text-blue-700 dark:text-blue-100 tabular-nums">{activeLevel.exhale}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => selectLevel(levelIndex + 1)}
                  disabled={levelIndex === BREATH_LEVELS.length - 1}
                  className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] flex items-center justify-center disabled:opacity-35"
                >
                  <ChevronRight className="w-5 h-5 app-muted" />
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] app-muted">Режим сессии</p>

              <div className="grid grid-cols-2 gap-2">
                {SESSION_MODES.map((mode) => {
                  const active = modeId === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => selectMode(mode.id)}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-left transition-colors',
                        active
                          ? 'border-[color:var(--tg-accent)] bg-[color:var(--tg-accent)]/12'
                          : 'border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]'
                      )}
                    >
                      <p className="text-[12px] font-black app-header">{mode.label}</p>
                      <p className="mt-0.5 text-[10px] font-semibold app-muted">{mode.minutes}м · старт {mode.countdown}с</p>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => selectMode('custom')}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-left transition-colors',
                    modeId === 'custom'
                      ? 'border-[color:var(--tg-accent)] bg-[color:var(--tg-accent)]/12'
                      : 'border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]'
                  )}
                >
                  <p className="text-[12px] font-black app-header">Кастом</p>
                  <p className="mt-0.5 text-[10px] font-semibold app-muted">{customMinutes}м · гибкая длина</p>
                </button>
              </div>

              {modeId === 'custom' && (
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold app-muted mb-1.5">
                    <span>Длительность</span>
                    <span>{customMinutes} мин</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="30"
                    step="1"
                    value={customMinutes}
                    onChange={(event) => {
                      markConfigTouched();
                      setCustomMinutes(Number.parseInt(event.target.value, 10));
                    }}
                    className="w-full h-2.5 accent-[color:var(--tg-accent)]"
                  />
                </div>
              )}

              <p className="text-[11px] app-muted leading-relaxed">{modeHint}</p>
            </section>

            <section className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-4">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] app-muted">
                <span className="inline-flex items-center gap-1"><Gauge className="w-3 h-3" /> Профиль нагрузки</span>
                <span>{loadIndex}%</span>
              </div>

              <div className="mt-3 h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 flex">
                <div className="h-full bg-cyan-400" style={{ width: `${(activeLevel.inhale / cycleSeconds) * 100}%` }} />
                <div className="h-full bg-violet-400" style={{ width: `${(activeLevel.hold / cycleSeconds) * 100}%` }} />
                <div className="h-full bg-blue-500" style={{ width: `${(activeLevel.exhale / cycleSeconds) * 100}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Цикл</p>
                  <p className="mt-1 text-[13px] font-black app-header tabular-nums">{cycleSeconds}с</p>
                </div>
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Кисл. долг</p>
                  <p className="mt-1 text-[13px] font-black app-header tabular-nums">{oxygenLoad}</p>
                </div>
                <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Цель циклов</p>
                  <p className="mt-1 text-[13px] font-black app-header tabular-nums">{targetCycles}</p>
                </div>
              </div>
            </section>

            {renderSoundPanel(false)}

            <section className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] app-muted">Старт практики</p>
              <p className="mt-1 text-[11px] font-semibold app-muted">
                Проверьте настройки и запустите сессию внизу.
              </p>
              <button
                type="button"
                onClick={handleSetupAction}
                className={cn(
                  'mt-2.5 w-full rounded-2xl text-left px-4 py-3.5 text-white shadow-[0_16px_30px_-20px_rgba(37,99,235,0.85)]',
                  `bg-gradient-to-r ${selectedMode?.accent ?? 'from-blue-500 to-indigo-500'}`
                )}
              >
                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-white/80">Подготовка</p>
                <p className="mt-1 text-[23px] font-[900] leading-none">Запустить практику</p>
                <p className="mt-1.5 text-[12px] font-semibold text-white/85">
                  Уровень {activeLevel.id} · {durationMinutes} минут · ритм {activeLevel.inhale}-{activeLevel.hold}-{activeLevel.exhale}
                </p>
              </button>
            </section>
          </div>
        </div>

        {isFocusMode && (
          <div
            className="absolute inset-0 z-30 rounded-[28px] border border-[color:var(--tg-border)] app-surface flex flex-col"
            onClick={() => {
              if (!focusChromeVisible) revealFocusChrome();
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_65%_at_50%_30%,rgba(59,130,246,0.14)_0%,rgba(59,130,246,0)_72%)]" />

            <div
              className={cn(
                'relative z-10 px-4 pt-7 pb-2 transition-all duration-250',
                focusChromeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
              )}
            >
              <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] gap-2.5">
                <div className={cn('rounded-2xl border px-2.5 py-2 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.55)] backdrop-blur-sm', phaseChipStyle)}>
                  <div className="flex items-center gap-2.5">
                    <span className={cn('w-8 h-8 rounded-xl border flex items-center justify-center', phaseIconStyle)}>
                      {phase === 'paused' ? <Pause className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Фокус</p>
                      <p className="mt-0.5 text-[13px] font-black app-header leading-none">{focusChipText}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-2 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.55)] backdrop-blur-sm">
                  <div className="flex items-center justify-end gap-2.5">
                    <div className="text-right min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Таймер</p>
                      <p className="mt-0.5 text-[16px] font-black app-header font-mono tabular-nums leading-none">
                        {phase === 'finished' ? formatClock(elapsedSeconds) : formatClock(sessionTimeLeft)}
                      </p>
                    </div>
                    <span className="w-8 h-8 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/80 flex items-center justify-center text-[color:var(--tg-accent)]">
                      <Clock3 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4">
              <button
                type="button"
                onPointerDown={(event) => {
                  event.stopPropagation();
                  handleCirclePressStart();
                }}
                onPointerUp={(event) => {
                  event.stopPropagation();
                  handleCirclePressEnd();
                }}
                onPointerLeave={() => {
                  handleCirclePressEnd();
                }}
                onPointerCancel={() => {
                  handleCirclePressEnd();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleCircleTap();
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  handleCircleDoubleTap();
                }}
                className="focus:outline-none"
              >
                <BreathingCircle
                  phase={phase}
                  activePhase={activePhase}
                  timeLeft={isCountingDown ? countdownLeft : phaseTimeLeft}
                  progress={phaseProgress}
                  compact={false}
                />
              </button>
            </div>

            <div
              className={cn(
                'relative z-10 px-4 pb-4 pt-2 transition-all duration-250',
                focusChromeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
              )}
            >
              <div className="mx-auto w-full max-w-[276px] rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-2.5 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFocusFinish();
                  }}
                  className={cn(
                    'w-full rounded-xl px-3 py-2.5 text-left text-white shadow-[0_10px_20px_-16px_rgba(239,68,68,0.75)] transition-all',
                    finishArmed ? 'bg-[linear-gradient(120deg,#DC2626_0%,#B91C1C_100%)] scale-[0.99]' : 'bg-[linear-gradient(120deg,#FF6B57_0%,#FF453A_100%)]'
                  )}
                >
                  <p className="text-[10px] uppercase tracking-[0.11em] font-bold text-white/80">Выход</p>
                  <p className="mt-0.5 text-[16px] font-[900] leading-none inline-flex items-center gap-1.5">
                    <Square className="w-3.5 h-3.5" /> {finishArmed ? 'Подтвердить завершение' : 'Завершить'}
                  </p>
                </button>
                <p className="mt-2 text-[10px] font-semibold app-muted text-center">
                  {focusHint}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
