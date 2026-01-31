// src/features/breathing/BreathingPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BREATH_LEVELS } from './data/patterns';
import { useBreathingSession } from './hooks/useBreathingSession';
import { BreathingCircle } from './components/BreathingCircle';
import { Info, Volume2, Wind, Clock, Target, Flame, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { InfoSheet } from './components/InfoSheet';
import { SoundSheet } from './components/SoundSheet';
import { BreathingStartModal } from './components/BreathingStartModal';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { soundManager } from '../../utils/sounds';

export const BreathingPage = () => {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [musicEnabled, setMusicEnabled] = useState(soundManager.isMusicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(soundManager.isSfxEnabled);
  const [currentTrack, setCurrentTrack] = useState(soundManager.getCurrentTrackId());
  const [musicVol, setMusicVol] = useState(soundManager.musicVolume);
  const [sfxVol, setSfxVol] = useState(soundManager.sfxVolume);

  const prepTimerRef = useRef<number | null>(null);

  const level = BREATH_LEVELS[levelIndex];
  const { phase, phaseTimeLeft, cycles, startSession, stopSession } = useBreathingSession(level, 0);

  useEffect(() => {
    if (showPrepModal) {
      prepTimerRef.current = window.setTimeout(() => {
        setShowPrepModal(false);
        setIsRunning(true);
        startSession();
      }, 3000);
    }
    return () => {
      if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    };
  }, [showPrepModal, startSession]);

  useEffect(() => {
    if (phase === 'finished' || phase === 'idle') {
      setIsRunning(false);
    }
  }, [phase]);

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

  const handleStart = () => {
    soundManager.unlock();
    setShowPrepModal(true);
  };

  const handleStop = () => {
    stopSession();
    setIsRunning(false);
    if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    setShowPrepModal(false);
  };

  return (
    <>
      <div className="flex flex-col pb-32 relative z-0 font-sans h-[calc(100dvh-80px)] overflow-hidden">

        {/* BACKGROUND GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-violet-50/50 dark:from-cyan-950/20 dark:via-blue-950/10 dark:to-violet-950/20 -z-10" />

        {/* MAIN CONTAINER */}
        <div className="flex flex-col h-full relative">

          {/* HEADER SECTION - Glass morphism */}
          <div className="px-5 pt-6 pb-5 relative">
            {/* Glass effect background */}
            <div className="absolute inset-x-0 top-0 bottom-0 bg-white/70 dark:bg-white/5 backdrop-blur-xl -z-10 rounded-b-[2.5rem] shadow-lg shadow-cyan-500/5 dark:shadow-black/20 border border-white/50 dark:border-white/10" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 dark:from-cyan-400 dark:via-blue-400 dark:to-violet-400 bg-clip-text text-transparent tracking-tight">
                  Дыхание
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Пранаяма</p>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setShowSound(true)} className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-lg shadow-slate-200/50 dark:shadow-black/20 transition-all hover:scale-105 active:scale-95 border border-slate-200/50 dark:border-white/10">
                  <Volume2 className="w-4.5 h-4.5" />
                </button>
                <button onClick={() => setShowInfo(true)} className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-lg shadow-slate-200/50 dark:shadow-black/20 transition-all hover:scale-105 active:scale-95 border border-slate-200/50 dark:border-white/10">
                  <Info className="w-4.5 h-4.5" />
                </button>
                <ProfileAvatar onClick={() => navigate('/profile')} size="sm" />
              </div>
            </div>

            {/* STATS GRID - Beautiful cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Card 1: Cycles */}
              <div className="relative overflow-hidden rounded-3xl p-2.5 shadow-xl shadow-cyan-500/10 dark:shadow-cyan-500/5 group transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col items-center justify-between min-h-[88px]">
                  <div className="inline-flex p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Flame className="w-3.5 h-3.5 text-white" fill="currentColor" />
                  </div>
                  <div className="text-2xl font-[900] text-white tabular-nums leading-none">
                    {cycles}
                  </div>
                  <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Циклов</p>
                </div>
                {/* Sparkle effect */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/30 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500" />
              </div>

              {/* Card 2: Phase/Level */}
              <div className="relative overflow-hidden rounded-3xl p-2.5 shadow-xl shadow-violet-500/10 dark:shadow-violet-500/5 group transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-violet-500 to-purple-500 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col items-center justify-between min-h-[88px]">
                  <div className="inline-flex p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    {isRunning && phase === 'inhale' && <Wind className="w-3.5 h-3.5 text-white" fill="currentColor" />}
                    {isRunning && phase === 'hold' && <Clock className="w-3.5 h-3.5 text-white" fill="currentColor" />}
                    {isRunning && phase === 'exhale' && <Wind className="w-3.5 h-3.5 text-white" fill="currentColor" />}
                    {!isRunning && <Target className="w-3.5 h-3.5 text-white" fill="currentColor" />}
                  </div>
                  <div className="text-lg font-[900] text-white leading-none">
                    {isRunning && phase === 'inhale' && 'Вдох'}
                    {isRunning && phase === 'hold' && 'Задержка'}
                    {isRunning && phase === 'exhale' && 'Выдох'}
                    {!isRunning && level.id}
                  </div>
                  <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
                    {isRunning ? 'Фаза' : 'Уровень'}
                  </p>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/30 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500" />
              </div>

              {/* Card 3: Timer */}
              <div className="relative overflow-hidden rounded-3xl p-2.5 shadow-xl shadow-pink-500/10 dark:shadow-pink-500/5 group transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-orange-500 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col items-center justify-between min-h-[88px]">
                  <div className="inline-flex p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Clock className="w-3.5 h-3.5 text-white" fill="currentColor" />
                  </div>
                  <div className="text-2xl font-[900] text-white tabular-nums leading-none">
                    {isRunning ? phaseTimeLeft : level.inhale + level.hold + level.exhale}
                  </div>
                  <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
                    {isRunning ? 'Сек' : 'Сек/цикл'}
                  </p>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/30 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500" />
              </div>
            </div>

            {/* LEVEL SELECTOR - Elegant */}
            <div className="mt-5 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 rounded-2xl" />
              <div className="relative flex items-center justify-between px-4 py-2.5">
                <button
                  onClick={() => !isRunning && setLevelIndex(i => Math.max(0, i - 1))}
                  disabled={isRunning || levelIndex === 0}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 shadow-md shadow-slate-200/50 dark:shadow-black/20 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 border border-slate-200/50 dark:border-white/10 text-lg font-bold"
                >
                  −
                </button>
                <div className="text-center">
                  <span className="text-sm font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent">
                    {level.name}
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {level.inhale}-{level.hold}-{level.exhale}
                    </span>
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  </div>
                </div>
                <button
                  onClick={() => !isRunning && setLevelIndex(i => Math.min(BREATH_LEVELS.length - 1, i + 1))}
                  disabled={isRunning || levelIndex === BREATH_LEVELS.length - 1}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 shadow-md shadow-slate-200/50 dark:shadow-black/20 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 border border-slate-200/50 dark:border-white/10 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT AREA - Breathing Circle */}
          <div className="flex-1 px-4 flex flex-col items-center justify-center min-h-0 relative">

            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10 blur-3xl animate-pulse" />
            </div>

            {/* Breathing Circle */}
            <div
              onClick={isRunning ? handleStop : handleStart}
              className={cn(
                "cursor-pointer relative transition-all duration-300 flex-shrink-0 z-10",
                !isRunning && "hover:scale-105 active:scale-95"
              )}
              style={{ width: '190px', height: '190px' }}
            >
              {/* Outer glow */}
              {!isRunning && (
                <div className="absolute inset-0 rounded-full blur-2xl opacity-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 animate-pulse"
                     style={{ transform: 'scale(1.2)' }} />
              )}

              <BreathingCircle
                phase={isRunning ? phase : 'idle'}
                timeLeft={phaseTimeLeft}
                totalDuration={getTotalDuration()}
              />
            </div>

            {/* Phase Indicators - Beautiful */}
            <div className="flex items-center justify-center gap-5 mt-6 z-10">
              <div className={cn("flex flex-col items-center gap-1.5 transition-all duration-500", phase === 'inhale' && isRunning ? "opacity-100 scale-110" : "opacity-50")}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold transition-all duration-500 shadow-lg",
                  phase === 'inhale' && isRunning
                    ? "bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-cyan-500/50 ring-2 ring-cyan-400/50"
                    : "bg-white/80 dark:bg-white/10 text-slate-600 dark:text-slate-400 backdrop-blur-sm border border-slate-200/50 dark:border-white/10"
                )}>
                  {level.inhale}
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Вдох</span>
              </div>

              <div className={cn("flex flex-col items-center gap-1.5 transition-all duration-500", phase === 'hold' && isRunning ? "opacity-100 scale-110" : "opacity-50")}>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg",
                  phase === 'hold' && isRunning
                    ? "bg-gradient-to-br from-violet-400 to-violet-500 text-white shadow-violet-500/50 ring-2 ring-violet-400/50"
                    : "bg-white/80 dark:bg-white/10 text-slate-600 dark:text-slate-400 backdrop-blur-sm border border-slate-200/50 dark:border-white/10"
                )}>
                  {level.hold}
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Задержка</span>
              </div>

              <div className={cn("flex flex-col items-center gap-1.5 transition-all duration-500", phase === 'exhale' && isRunning ? "opacity-100 scale-110" : "opacity-50")}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold transition-all duration-500 shadow-lg",
                  phase === 'exhale' && isRunning
                    ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-blue-500/50 ring-2 ring-blue-400/50"
                    : "bg-white/80 dark:bg-white/10 text-slate-600 dark:text-slate-400 backdrop-blur-sm border border-slate-200/50 dark:border-white/10"
                )}>
                  {level.exhale}
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Выдох</span>
              </div>
            </div>

            {/* Instructions - Elegant */}
            {!isRunning && (
              <div className="mt-6 text-center px-6 z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-full shadow-lg border border-slate-200/50 dark:border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Нажмите на <span className="font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">круг</span> для старта
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BreathingStartModal
        isOpen={showPrepModal}
        onClose={() => {
          setShowPrepModal(false);
          if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
        }}
      />
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
    </>
  );
};
