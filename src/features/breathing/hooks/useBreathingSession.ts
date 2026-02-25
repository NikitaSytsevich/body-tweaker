import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import type { BreathLevel } from '../data/patterns';
import { soundManager } from '../../../utils/sounds';
import { storageUpdateHistory } from '../../../utils/storage';
import type { HistoryRecord } from '../../../utils/types';

const TICK_MS = 120;
const MIN_HISTORY_SECONDS = 15;

export type ActivePhase = 'inhale' | 'hold' | 'exhale';
export type Phase = 'idle' | 'countdown' | ActivePhase | 'paused' | 'finished';

interface EngineState {
  phase: Phase;
  activePhase: ActivePhase;
  timerId: number | null;
  countdownEndsAt: number;
  sessionStartedAt: number;
  sessionEndsAt: number;
  phaseEndsAt: number;
  pausedSessionRemainingMs: number;
  pausedPhaseRemainingMs: number;
  historySaved: boolean;
}

interface StartConfig {
  level: BreathLevel;
  durationSeconds: number;
  countdownSeconds: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createEngineState = (): EngineState => ({
  phase: 'idle',
  activePhase: 'inhale',
  timerId: null,
  countdownEndsAt: 0,
  sessionStartedAt: 0,
  sessionEndsAt: 0,
  phaseEndsAt: 0,
  pausedSessionRemainingMs: 0,
  pausedPhaseRemainingMs: 0,
  historySaved: false
});

const getPhaseDuration = (phase: ActivePhase, level: BreathLevel) => {
  if (phase === 'inhale') return level.inhale;
  if (phase === 'hold') return level.hold;
  return level.exhale;
};

const getTargetCycles = (durationSeconds: number, level: BreathLevel) => {
  const cycle = Math.max(1, level.inhale + level.hold + level.exhale);
  return Math.max(1, Math.floor(durationSeconds / cycle));
};

const isActivePhase = (phase: Phase): phase is ActivePhase => {
  return phase === 'inhale' || phase === 'hold' || phase === 'exhale';
};

export const useBreathingSession = (level: BreathLevel, durationMinutes: number, countdownSeconds: number) => {
  const configuredDurationSeconds = useMemo(() => Math.max(60, Math.round(durationMinutes * 60)), [durationMinutes]);
  const safeCountdown = useMemo(() => Math.max(1, Math.round(countdownSeconds)), [countdownSeconds]);

  const [phase, setPhase] = useState<Phase>('idle');
  const [activePhase, setActivePhase] = useState<ActivePhase>('inhale');
  const [countdownLeft, setCountdownLeft] = useState(safeCountdown);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(level.inhale);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(configuredDurationSeconds);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(getTargetCycles(configuredDurationSeconds, level));

  const engineRef = useRef<EngineState>(createEngineState());
  const levelRef = useRef(level);
  const configRef = useRef<StartConfig>({
    level,
    durationSeconds: configuredDurationSeconds,
    countdownSeconds: safeCountdown
  });

  useEffect(() => {
    levelRef.current = level;
    configRef.current.level = level;
  }, [level]);

  useEffect(() => {
    configRef.current.durationSeconds = configuredDurationSeconds;
    if (engineRef.current.phase === 'idle') {
      setSessionTimeLeft(configuredDurationSeconds);
      setTargetCycles(getTargetCycles(configuredDurationSeconds, levelRef.current));
    }
  }, [configuredDurationSeconds]);

  useEffect(() => {
    configRef.current.countdownSeconds = safeCountdown;
    if (engineRef.current.phase === 'idle') {
      setCountdownLeft(safeCountdown);
    }
  }, [safeCountdown]);

  const stopTicker = useCallback(() => {
    if (engineRef.current.timerId != null) {
      window.clearInterval(engineRef.current.timerId);
      engineRef.current.timerId = null;
    }
  }, []);

  const saveHistory = useCallback((finishedAt: number) => {
    const state = engineRef.current;
    if (!state.sessionStartedAt || state.historySaved) return;

    const durationSeconds = Math.max(0, Math.floor((finishedAt - state.sessionStartedAt) / 1000));
    if (durationSeconds < MIN_HISTORY_SECONDS) return;

    const activeLevel = levelRef.current;
    const plannedMinutes = Math.round(configRef.current.durationSeconds / 60);

    const record: HistoryRecord = {
      id: `${finishedAt}`,
      type: 'breathing',
      scheme: `Уровень ${activeLevel.id} • ${activeLevel.inhale}-${activeLevel.hold}-${activeLevel.exhale} • ${plannedMinutes}м`,
      startTime: dayjs(state.sessionStartedAt).toISOString(),
      endTime: dayjs(finishedAt).toISOString(),
      durationSeconds
    };

    state.historySaved = true;
    storageUpdateHistory('history_fasting', record);
  }, []);

  const resetToIdle = useCallback(() => {
    const duration = configRef.current.durationSeconds;
    const currentLevel = levelRef.current;

    engineRef.current = createEngineState();

    setPhase('idle');
    setActivePhase('inhale');
    setCountdownLeft(configRef.current.countdownSeconds);
    setPhaseTimeLeft(currentLevel.inhale);
    setPhaseProgress(0);
    setElapsedSeconds(0);
    setSessionTimeLeft(duration);
    setSessionProgress(0);
    setCycles(0);
    setTargetCycles(getTargetCycles(duration, currentLevel));
  }, []);

  const playPhaseCue = (next: ActivePhase) => {
    if (next === 'inhale') soundManager.playInhale();
    if (next === 'hold') soundManager.playHold();
    if (next === 'exhale') soundManager.playExhale();

    if (navigator.vibrate) navigator.vibrate(35);
  };

  const moveToPhase = useCallback((next: ActivePhase, now: number, increaseCycle: boolean) => {
    const duration = getPhaseDuration(next, levelRef.current);

    engineRef.current.phase = next;
    engineRef.current.activePhase = next;
    engineRef.current.phaseEndsAt = now + duration * 1000;

    setPhase(next);
    setActivePhase(next);
    setPhaseTimeLeft(duration);
    setPhaseProgress(0);

    if (increaseCycle) {
      setCycles((prev) => prev + 1);
    }

    playPhaseCue(next);
  }, []);

  const finishSession = useCallback((now: number) => {
    stopTicker();
    saveHistory(now);

    soundManager.playFinish();
    if (navigator.vibrate) navigator.vibrate([140, 90, 140]);

    engineRef.current.phase = 'finished';

    setPhase('finished');
    setPhaseTimeLeft(0);
    setPhaseProgress(100);
    setSessionTimeLeft(0);
    setSessionProgress(100);
  }, [saveHistory, stopTicker]);

  const beginActiveSession = useCallback((now: number) => {
    const currentLevel = levelRef.current;
    const duration = configRef.current.durationSeconds;

    engineRef.current.phase = 'inhale';
    engineRef.current.activePhase = 'inhale';
    engineRef.current.sessionStartedAt = now;
    engineRef.current.sessionEndsAt = now + duration * 1000;
    engineRef.current.phaseEndsAt = now + currentLevel.inhale * 1000;
    engineRef.current.historySaved = false;

    setPhase('inhale');
    setActivePhase('inhale');
    setCountdownLeft(0);
    setPhaseTimeLeft(currentLevel.inhale);
    setPhaseProgress(0);
    setElapsedSeconds(0);
    setSessionTimeLeft(duration);
    setSessionProgress(0);
    setCycles(1);
    setTargetCycles(getTargetCycles(duration, currentLevel));

    soundManager.startSession();
    playPhaseCue('inhale');
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const state = engineRef.current;

    if (state.phase === 'countdown') {
      const remainingMs = state.countdownEndsAt - now;
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setCountdownLeft(remainingSeconds);

      if (remainingMs <= 0) {
        beginActiveSession(now);
      }
      return;
    }

    if (!isActivePhase(state.phase)) {
      return;
    }

    const elapsed = Math.max(0, Math.floor((now - state.sessionStartedAt) / 1000));
    const remainingSession = Math.max(0, Math.ceil((state.sessionEndsAt - now) / 1000));

    setElapsedSeconds(elapsed);
    setSessionTimeLeft(remainingSession);

    const sessionDuration = Math.max(1, configRef.current.durationSeconds);
    setSessionProgress(clamp((elapsed / sessionDuration) * 100, 0, 100));

    if (remainingSession <= 0) {
      finishSession(now);
      return;
    }

    const currentPhaseDuration = getPhaseDuration(state.activePhase, levelRef.current);
    const remainingPhaseMs = state.phaseEndsAt - now;
    const remainingPhaseSeconds = Math.max(0, Math.ceil(remainingPhaseMs / 1000));

    setPhaseTimeLeft(remainingPhaseSeconds);
    setPhaseProgress(clamp((1 - remainingPhaseMs / Math.max(1, currentPhaseDuration * 1000)) * 100, 0, 100));

    if (remainingPhaseMs <= 0) {
      if (state.activePhase === 'inhale') {
        moveToPhase('hold', now, false);
      } else if (state.activePhase === 'hold') {
        moveToPhase('exhale', now, false);
      } else {
        moveToPhase('inhale', now, true);
      }
    }
  }, [beginActiveSession, finishSession, moveToPhase]);

  const startTicker = useCallback(() => {
    stopTicker();
    engineRef.current.timerId = window.setInterval(tick, TICK_MS);
  }, [stopTicker, tick]);

  const startSession = useCallback(() => {
    const currentPhase = engineRef.current.phase;
    if (currentPhase === 'countdown' || isActivePhase(currentPhase) || currentPhase === 'paused') return;

    soundManager.unlock();

    const now = Date.now();
    engineRef.current.phase = 'countdown';
    engineRef.current.activePhase = 'inhale';
    engineRef.current.countdownEndsAt = now + configRef.current.countdownSeconds * 1000;
    engineRef.current.historySaved = false;

    setPhase('countdown');
    setActivePhase('inhale');
    setCountdownLeft(configRef.current.countdownSeconds);
    setElapsedSeconds(0);
    setPhaseProgress(0);
    setSessionProgress(0);
    setSessionTimeLeft(configRef.current.durationSeconds);
    setCycles(0);

    startTicker();
  }, [startTicker]);

  const cancelCountdown = useCallback(() => {
    if (engineRef.current.phase !== 'countdown') return;

    stopTicker();
    soundManager.stopSession();
    resetToIdle();
  }, [resetToIdle, stopTicker]);

  const stopSession = useCallback(() => {
    const now = Date.now();
    const currentPhase = engineRef.current.phase;

    if (isActivePhase(currentPhase) || currentPhase === 'paused') {
      saveHistory(now);
    }

    stopTicker();
    soundManager.stopSession();
    resetToIdle();
  }, [resetToIdle, saveHistory, stopTicker]);

  const togglePause = useCallback(() => {
    const now = Date.now();
    const state = engineRef.current;

    if (isActivePhase(state.phase)) {
      state.pausedPhaseRemainingMs = Math.max(1, state.phaseEndsAt - now);
      state.pausedSessionRemainingMs = Math.max(1, state.sessionEndsAt - now);
      state.phase = 'paused';

      stopTicker();
      soundManager.stopSession();

      setPhase('paused');
      setPhaseTimeLeft(Math.ceil(state.pausedPhaseRemainingMs / 1000));
      setSessionTimeLeft(Math.ceil(state.pausedSessionRemainingMs / 1000));
      return;
    }

    if (state.phase === 'paused') {
      state.phase = state.activePhase;
      state.phaseEndsAt = now + state.pausedPhaseRemainingMs;
      state.sessionEndsAt = now + state.pausedSessionRemainingMs;

      setPhase(state.activePhase);
      soundManager.startSession();
      startTicker();
    }
  }, [startTicker, stopTicker]);

  const resetSession = useCallback(() => {
    if (engineRef.current.phase !== 'finished') {
      stopSession();
      return;
    }

    soundManager.stopSession();
    resetToIdle();
  }, [resetToIdle, stopSession]);

  useEffect(() => {
    return () => {
      const state = engineRef.current;
      const now = Date.now();

      if (isActivePhase(state.phase) || state.phase === 'paused') {
        saveHistory(now);
      }

      stopTicker();
      soundManager.stopAll();
    };
  }, [saveHistory, stopTicker]);

  const phaseDuration = getPhaseDuration(activePhase, levelRef.current);

  return {
    phase,
    activePhase,
    countdownLeft,
    phaseTimeLeft,
    phaseDuration,
    phaseProgress,
    elapsedSeconds,
    sessionTimeLeft,
    sessionProgress,
    cycles,
    targetCycles,
    isCountingDown: phase === 'countdown',
    isRunning: isActivePhase(phase),
    isPaused: phase === 'paused',
    startSession,
    cancelCountdown,
    stopSession,
    togglePause,
    resetSession
  };
};
