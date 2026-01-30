// src/features/breathing/BreathingPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BREATH_LEVELS } from './data/patterns';
import { useBreathingSession } from './hooks/useBreathingSession';
import { BreathingCircle } from './components/BreathingCircle';
import { Info, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { InfoSheet } from './components/InfoSheet';
import { SoundSheet } from './components/SoundSheet';
import { BreathingStartModal } from './components/BreathingStartModal';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { soundManager } from '../../utils/sounds';
import WebApp from '@twa-dev/sdk';

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 0];

export const BreathingPage = () => {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [duration, setDuration] = useState(10);

  const [musicEnabled, setMusicEnabled] = useState(soundManager.isMusicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(soundManager.isSfxEnabled);
  const [currentTrack, setCurrentTrack] = useState(soundManager.getCurrentTrackId());
  const [musicVol, setMusicVol] = useState(soundManager.musicVolume);
  const [sfxVol, setSfxVol] = useState(soundManager.sfxVolume);

  const prepTimerRef = useRef<number | null>(null);

  const level = BREATH_LEVELS[levelIndex];
  const { phase, phaseTimeLeft, totalTimeLeft, startSession, stopSession } = useBreathingSession(level, duration);

  useEffect(() => {
    if (showPrepModal) {
      prepTimerRef.current = window.setTimeout(() => {
        setShowPrepModal(false);
        startSession();
      }, 3000);
    }
    return () => {
      if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    };
  }, [showPrepModal, startSession]);

  const handleToggleMusic = () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    soundManager.setMusicEnabled(newState);
  };
  const handleToggleSfx = () => {
    const newState = !sfxEnabled;
    setSfxEnabled(newState);
    soundManager.setSfxEnabled(newState);
  };
  const handleSelectTrack = (id: string) => {
    soundManager.setTrack(id);
    setCurrentTrack(id);
  };
  const handleChangeMusicVol = (val: number) => {
    soundManager.setMusicVolume(val);
    setMusicVol(val);
  };
  const handleChangeSfxVol = (val: number) => {
    soundManager.setMusicVolume(val);
    setSfxVol(val);
  };

  const getTotalDuration = () => {
    if (phase === 'inhale') return level.inhale;
    if (phase === 'hold') return level.hold;
    if (phase === 'exhale') return level.exhale;
    return 0;
  };

  const handleToggle = () => {
    if (phase !== 'idle' && phase !== 'finished') {
      stopSession();
      setShowPrepModal(false);
      if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    } else {
      soundManager.unlock();
      setShowPrepModal(true);
    }
  };

  const formatTotalTime = (s: number) => {
    if (duration === 0) return "∞";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const isRunning = phase !== 'idle' && phase !== 'finished';
  const isDark = WebApp.colorScheme === 'dark';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C1C1E] relative">

      <BreathingStartModal
        isOpen={showPrepModal}
        onClose={() => {
          setShowPrepModal(false);
          if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
        }}
      />

      {/* HEADER - Compact */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Пранаяма</h1>
        <div className="flex gap-2 items-center">
          {isRunning && (
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-lg">
              {formatTotalTime(totalTimeLeft)}
            </span>
          )}
          <ProfileAvatar onClick={() => navigate('/profile')} size="sm" />
          <button onClick={() => setShowSound(true)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <Volume2 className="w-4 h-4" />
          </button>
          <button onClick={() => setShowInfo(true)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative">

        {/* Breathing Circle */}
        <div
          onClick={handleToggle}
          className={cn(
            "cursor-pointer relative transition-all duration-200",
            !isRunning && "hover:scale-105 active:scale-95"
          )}
        >
          <div className="relative flex items-center justify-center">
            {/* Glow when idle */}
            {!isRunning && (
              <div className={cn(
                "absolute inset-0 rounded-full blur-3xl opacity-20",
                isDark ? "bg-purple-500" : "bg-purple-400"
              )} style={{ transform: 'scale(1.5)' }} />
            )}

            <BreathingCircle
              phase={phase}
              timeLeft={phaseTimeLeft}
              totalDuration={getTotalDuration()}
            />
          </div>
        </div>

        {/* Pattern Indicators */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className={cn("flex flex-col items-center gap-1 transition-all", phase === 'inhale' ? "opacity-100" : "opacity-40")}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              phase === 'inhale'
                ? "bg-cyan-500 text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-500"
            )}>
              {level.inhale}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Вдох</span>
          </div>

          <div className={cn("flex flex-col items-center gap-1 transition-all", phase === 'hold' ? "opacity-100" : "opacity-40")}>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all",
              phase === 'hold'
                ? "bg-violet-500 text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-500"
            )}>
              {level.hold}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Задержка</span>
          </div>

          <div className={cn("flex flex-col items-center gap-1 transition-all", phase === 'exhale' ? "opacity-100" : "opacity-40")}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              phase === 'exhale'
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-500"
            )}>
              {level.exhale}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Выдох</span>
          </div>
        </div>

      </div>

      {/* BOTTOM CONTROLS - Fixed height */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#1C1C1E]">
        {!isRunning ? (
          <div className="flex gap-3">
            {/* Duration */}
            <div className="flex-1 flex items-center justify-between bg-slate-100 dark:bg-white/5 rounded-full px-3 py-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {duration === 0 ? "∞" : `${duration} мин`}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const idx = DURATION_OPTIONS.indexOf(duration);
                    if (idx < DURATION_OPTIONS.length - 1) setDuration(DURATION_OPTIONS[idx + 1]);
                  }}
                  disabled={duration === DURATION_OPTIONS[DURATION_OPTIONS.length - 1]}
                  className="w-7 h-7 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const idx = DURATION_OPTIONS.indexOf(duration);
                    if (idx > 0) setDuration(DURATION_OPTIONS[idx - 1]);
                  }}
                  disabled={duration === DURATION_OPTIONS[0]}
                  className="w-7 h-7 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Level */}
            <div className="flex-1 flex items-center justify-between bg-slate-100 dark:bg-white/5 rounded-full px-3 py-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Ур. {level.id}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setLevelIndex(i => Math.max(0, i - 1))}
                  disabled={levelIndex === 0}
                  className="w-7 h-7 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLevelIndex(i => Math.min(BREATH_LEVELS.length - 1, i + 1))}
                  disabled={levelIndex === BREATH_LEVELS.length - 1}
                  className="w-7 h-7 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 dark:text-slate-500">
            Нажмите на круг, чтобы остановить
          </div>
        )}
      </div>

      {/* MODALS */}
      {showInfo && <InfoSheet onClose={() => setShowInfo(false)} />}
      <SoundSheet
        isOpen={showSound}
        onClose={() => setShowSound(false)}
        musicEnabled={musicEnabled}
        sfxEnabled={sfxEnabled}
        currentTrackId={currentTrack}
        musicVolume={musicVol}
        sfxVolume={sfxVol}
        onToggleMusic={handleToggleMusic}
        onToggleSfx={handleToggleSfx}
        onSelectTrack={handleSelectTrack}
        onChangeMusicVolume={handleChangeMusicVol}
        onChangeSfxVolume={handleChangeSfxVol}
      />

    </div>
  );
};
