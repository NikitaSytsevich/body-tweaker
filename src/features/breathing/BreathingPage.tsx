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
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#1C1C1E] relative z-0">

      <BreathingStartModal
        isOpen={showPrepModal}
        onClose={() => {
          setShowPrepModal(false);
          if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
        }}
      />

      {/* HEADER */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between shrink-0">
        <h1 className="text-3xl font-[900] text-slate-800 dark:text-white">Дыхание</h1>
        <div className="flex gap-2 items-center">
          {isRunning && (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#2C2C2E] px-2 py-1 rounded-lg font-mono flex items-center gap-1 border border-slate-200 dark:border-white/10">
              <Timer className="w-3 h-3" />
              {formatTotalTime(totalTimeLeft)}
            </span>
          )}
          <ProfileAvatar onClick={() => navigate('/profile')} />
          <button onClick={() => setShowSound(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button onClick={() => setShowInfo(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex-1 flex flex-col overflow-hidden relative">

          {/* CIRCLE AREA */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
            {!isAudioReady ? (
              <div className="w-52 h-52 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#3A3A3C] rounded-full border border-slate-100 dark:border-white/10">
                <Loader2 className="w-8 h-8 text-slate-300 dark:text-slate-600 animate-spin mb-2" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Загрузка...</span>
              </div>
            ) : phase === 'finished' ? (
              <div className="w-52 h-52 flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-full border-4 border-green-100 dark:border-green-800/30">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                <span className="text-xl font-bold text-slate-700 dark:text-slate-200">Отлично!</span>
                <button onClick={(e) => { e.stopPropagation(); stopSession(); }} className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-[#3A3A3C] px-4 py-2 rounded-xl">
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <div onClick={handleToggle} className={cn("cursor-pointer relative transition-transform", isRunning ? "scale-110" : "hover:scale-105 active:scale-95")}>
                  <div className="relative flex items-center justify-center">
                    <BreathingCircle
                      phase={phase}
                      timeLeft={phaseTimeLeft}
                      totalDuration={getTotalDuration()}
                    />
                    {!isRunning && !showPrepModal && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-sm font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">СТАРТ</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PATTERN */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className={cn("text-center transition-all", phase === 'inhale' ? "opacity-100 scale-105" : "opacity-30")}>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Вдох</span>
                    <span className={cn("text-xl font-black tabular-nums", phase === 'inhale' ? "text-cyan-600 dark:text-cyan-400" : "text-slate-300 dark:text-slate-600")}>{level.inhale}</span>
                  </div>
                  <div className={cn("text-center transition-all", phase === 'hold' ? "opacity-100 scale-105" : "opacity-30")}>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Задержка</span>
                    <span className={cn("text-2xl font-black tabular-nums leading-none", phase === 'hold' ? "text-violet-600 dark:text-violet-400" : "text-slate-300 dark:text-slate-600")}>{level.hold}</span>
                  </div>
                  <div className={cn("text-center transition-all", phase === 'exhale' ? "opacity-100 scale-105" : "opacity-30")}>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Выдох</span>
                    <span className={cn("text-2xl font-black tabular-nums leading-none", phase === 'exhale' ? "text-blue-600 dark:text-blue-400" : "text-slate-300 dark:text-slate-600")}>{level.exhale}</span>
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
                className="px-4 pb-4 pt-2"
              >
                <div className="grid grid-cols-2 gap-3">
                  {/* Duration */}
                  <div className="bg-slate-50 dark:bg-[#3A3A3C] p-3 rounded-2xl border border-slate-100 dark:border-white/10">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Время</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {DURATION_OPTIONS.slice(0, 3).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setDuration(opt)}
                          className={cn(
                            "py-1.5 rounded-lg text-[10px] font-bold transition-all",
                            duration === opt
                              ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900"
                              : "bg-white dark:bg-[#2C2C2E] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                          )}
                        >
                          {opt === 0 ? "∞" : `${opt}м`}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                      {DURATION_OPTIONS.slice(3).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setDuration(opt)}
                          className={cn(
                            "py-1.5 rounded-lg text-[10px] font-bold transition-all",
                            duration === opt
                              ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900"
                              : "bg-white dark:bg-[#2C2C2E] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                          )}
                        >
                          {opt === 0 ? "∞" : `${opt}м`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="bg-slate-50 dark:bg-[#3A3A3C] p-3 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Сложность</p>
                    <div className="flex-1 flex items-center justify-between">
                      <button
                        disabled={levelIndex === 0}
                        onClick={() => setLevelIndex(i => i - 1)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </button>
                      <span className="text-2xl font-black text-slate-800 dark:text-white">{level.id}</span>
                      <button
                        disabled={levelIndex === BREATH_LEVELS.length - 1}
                        onClick={() => setLevelIndex(i => i + 1)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400" />
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
