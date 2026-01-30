// src/features/breathing/BreathingPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BREATH_LEVELS } from './data/patterns';
import { useBreathingSession } from './hooks/useBreathingSession';
import { BreathingCircle } from './components/BreathingCircle';
import { Info, Volume2, Loader2, Timer, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { InfoSheet } from './components/InfoSheet';
import { SoundSheet } from './components/SoundSheet';
import { BreathingStartModal } from './components/BreathingStartModal';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { soundManager } from '../../utils/sounds';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 0];

export const BreathingPage = () => {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [duration, setDuration] = useState(10);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const [musicEnabled, setMusicEnabled] = useState(soundManager.isMusicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(soundManager.isSfxEnabled);
  const [currentTrack, setCurrentTrack] = useState(soundManager.getCurrentTrackId());
  const [musicVol, setMusicVol] = useState(soundManager.musicVolume);
  const [sfxVol, setSfxVol] = useState(soundManager.sfxVolume);

  const prepTimerRef = useRef<number | null>(null);

  const level = BREATH_LEVELS[levelIndex];
  const { phase, phaseTimeLeft, totalTimeLeft, startSession, stopSession } = useBreathingSession(level, duration);

  useEffect(() => {
    const timer = setTimeout(() => setIsAudioReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showPrepModal) {
      prepTimerRef.current = window.setTimeout(() => {
        setShowPrepModal(false);
        startSession();
      }, 5500);
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
    soundManager.setSfxVolume(val);
    setSfxVol(val);
  };

  const getTotalDuration = () => {
    if (phase === 'inhale') return level.inhale;
    if (phase === 'hold') return level.hold;
    if (phase === 'exhale') return level.exhale;
    return 0;
  };

  const handleToggle = () => {
    if (!isAudioReady) return;

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

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative z-0">

      <BreathingStartModal
        isOpen={showPrepModal}
        onClose={() => {
          setShowPrepModal(false);
          if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
        }}
      />

      {/* HEADER */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-[900] text-slate-800 dark:text-white">Пранаяма</h1>
          <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Дыхательные практики</p>
        </div>
        <div className="flex gap-2 items-center">
          {isRunning && (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-white/10 backdrop-blur px-2 py-1 rounded-lg font-mono flex items-center gap-1 border border-slate-200 dark:border-white/20">
              <Timer className="w-3 h-3" />
              {formatTotalTime(totalTimeLeft)}
            </span>
          )}
          <ProfileAvatar onClick={() => navigate('/profile')} />
          <button onClick={() => setShowSound(true)} className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all hover:scale-105">
            <Volume2 className="w-4 h-4" />
          </button>
          <button onClick={() => setShowInfo(true)} className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all hover:scale-105">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DECORATIVE BLOBS */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-40 h-40 bg-blue-300/30 dark:bg-blue-500/20 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-32 left-20 w-24 h-24 bg-pink-300/30 dark:bg-pink-500/20 rounded-full blur-[40px] pointer-events-none" />

      {/* MAIN CARD */}
      <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden relative z-10">
        <div className="bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-xl rounded-[3rem] shadow-xl shadow-purple-200/20 dark:shadow-black/40 border border-white/40 dark:border-white/10 flex-1 flex flex-col overflow-hidden relative">

          {/* DECORATIVE GLOW */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-400/20 dark:from-purple-500/10 dark:to-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* CIRCLE AREA */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
            {!isAudioReady ? (
              <div className="w-52 h-52 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#3A3A3C] rounded-full border-2 border-slate-200 dark:border-white/10 shadow-lg">
                <Loader2 className="w-8 h-8 text-purple-500 dark:text-purple-400 animate-spin mb-2" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Загрузка...</span>
              </div>
            ) : phase === 'finished' ? (
              <div className="w-52 h-52 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full border-4 border-green-200 dark:border-green-800/40 shadow-lg">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                <span className="text-xl font-bold text-slate-700 dark:text-slate-200">Отлично!</span>
                <button onClick={(e) => { e.stopPropagation(); stopSession(); }} className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-[#3A3A3C] px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#4A4A4C] transition-colors">
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                {/* Breathing Circle - clickable with START text inside */}
                <div
                  onClick={handleToggle}
                  className={cn(
                    "cursor-pointer relative transition-all duration-300",
                    !isRunning && "hover:scale-105 active:scale-95"
                  )}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Glow effect behind circle when idle */}
                    {!isRunning && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 dark:from-purple-500 dark:to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                    )}

                    <BreathingCircle
                      phase={phase}
                      timeLeft={phaseTimeLeft}
                      totalDuration={getTotalDuration()}
                    />
                  </div>
                </div>

                {/* PATTERN INDICATORS */}
                <div className="flex items-center justify-center gap-8 mt-6">
                  <div className={cn("flex flex-col items-center gap-1 transition-all duration-300", phase === 'inhale' ? "opacity-100 scale-110" : "opacity-40")}>
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                      phase === 'inhale'
                        ? "bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-slate-100 dark:bg-[#3A3A3C] text-slate-400"
                    )}>
                      <span className="text-xs font-black">{level.inhale}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Вдох</span>
                  </div>

                  <div className={cn("flex flex-col items-center gap-1 transition-all duration-300", phase === 'hold' ? "opacity-100 scale-110" : "opacity-40")}>
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                      phase === 'hold'
                        ? "bg-gradient-to-br from-violet-400 to-violet-500 text-white shadow-lg shadow-violet-500/30"
                        : "bg-slate-100 dark:bg-[#3A3A3C] text-slate-400"
                    )}>
                      <span className="text-sm font-black">{level.hold}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Задержка</span>
                  </div>

                  <div className={cn("flex flex-col items-center gap-1 transition-all duration-300", phase === 'exhale' ? "opacity-100 scale-110" : "opacity-40")}>
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                      phase === 'exhale'
                        ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-slate-100 dark:bg-[#3A3A3C] text-slate-400"
                    )}>
                      <span className="text-xs font-black">{level.exhale}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Выдох</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CONTROLS */}
          <AnimatePresence>
            {!isRunning && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-8 pb-8 pt-4 space-y-4"
              >
                {/* Duration Control */}
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Время практики</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Выберите длительность</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={duration === DURATION_OPTIONS[DURATION_OPTIONS.length - 1]}
                        onClick={() => {
                          const currentIndex = DURATION_OPTIONS.indexOf(duration);
                          if (currentIndex < DURATION_OPTIONS.length - 1) {
                            setDuration(DURATION_OPTIONS[currentIndex + 1]);
                          }
                        }}
                        className="w-11 h-11 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="w-20 text-center">
                        <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                          {duration === 0 ? "∞" : duration}
                        </span>
                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-1">мин</span>
                      </div>
                      <button
                        disabled={duration === DURATION_OPTIONS[0]}
                        onClick={() => {
                          const currentIndex = DURATION_OPTIONS.indexOf(duration);
                          if (currentIndex > 0) {
                            setDuration(DURATION_OPTIONS[currentIndex - 1]);
                          }
                        }}
                        className="w-11 h-11 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Level Control */}
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Уровень сложности</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Уровень {level.id} из {BREATH_LEVELS.length}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={levelIndex === 0}
                        onClick={() => setLevelIndex(i => i - 1)}
                        className="w-11 h-11 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="w-20 text-center">
                        <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                          {level.id}
                        </span>
                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-1">ур</span>
                      </div>
                      <button
                        disabled={levelIndex === BREATH_LEVELS.length - 1}
                        onClick={() => setLevelIndex(i => i + 1)}
                        className="w-11 h-11 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
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
