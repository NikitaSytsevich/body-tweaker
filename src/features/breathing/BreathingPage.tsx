import { useState, useEffect, useRef } from 'react';
import { BREATH_LEVELS } from './data/patterns';
import { useBreathingSession } from './hooks/useBreathingSession';
import { BreathingCircle } from './components/BreathingCircle';
import { Info, ChevronRight, ChevronLeft, Volume2, Loader2, Timer, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { InfoSheet } from './components/InfoSheet';
import { SoundSheet } from './components/SoundSheet';
import { BreathingStartModal } from './components/BreathingStartModal';
import { soundManager } from '../../utils/sounds';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 0];

export const BreathingPage = () => {
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
      const timer = setTimeout(() => setIsAudioReady(true), 500);
      return () => clearTimeout(timer);
  }, []);

  // 👇 ЛОГИКА АВТО-СТАРТА
  useEffect(() => {
      if (showPrepModal) {
          prepTimerRef.current = window.setTimeout(() => {
              setShowPrepModal(false);
              startSession(); // Старт после таймера
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
        // Стоп
        stopSession();
        setShowPrepModal(false);
        if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
    } else {
        // Старт (через подготовку)
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
    <div className="min-h-full flex flex-col pb-6 relative z-0">
        
        {/* Модалка подготовки (БЕЗ onComplete) */}
        <BreathingStartModal 
            isOpen={showPrepModal} 
            onClose={() => {
                setShowPrepModal(false);
                if (prepTimerRef.current) clearTimeout(prepTimerRef.current);
            }} 
        />

        <div className="bg-white rounded-[3rem] shadow-sm shadow-slate-200/50 relative overflow-hidden flex-1 flex flex-col z-10 border border-white/60">
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03] pointer-events-none" />

            {/* HEADER */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-start relative z-20 shrink-0">
                <div className="flex-1 min-w-0 pr-2">
                    <h1 className="text-3xl font-[900] text-slate-800 leading-tight">
                        Пранаяма
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Гиповентиляция
                        </span>
                        {isRunning && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 animate-in fade-in">
                                <Timer className="w-3 h-3" />
                                {formatTotalTime(totalTimeLeft)}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="flex gap-2 relative">
                    <button onClick={() => setShowSound(true)} className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                        <Volume2 className="w-6 h-6" />
                    </button>
                    <button onClick={() => setShowInfo(true)} className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                        <Info className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* CIRCLE & STATUS */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-6">
                
                <div 
                    onClick={handleToggle} 
                    className={cn(
                        "cursor-pointer relative transform-gpu transition-all duration-500",
                        !isAudioReady && "opacity-50 pointer-events-none",
                        isRunning ? "scale-110" : "hover:scale-105 active:scale-95"
                    )}
                >
                    {!isAudioReady ? (
                        <div className="w-64 h-64 flex flex-col items-center justify-center bg-slate-50 rounded-full border border-slate-100">
                            <Loader2 className="w-8 h-8 text-slate-300 animate-spin mb-2" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Загрузка...</span>
                        </div>
                    ) : phase === 'finished' ? (
                        <div className="w-64 h-64 flex flex-col items-center justify-center bg-white rounded-full border-4 border-green-50 shadow-sm animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                            <span className="text-xl font-bold text-slate-700">Отлично!</span>
                            <button onClick={(e) => { e.stopPropagation(); stopSession(); }} className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100">
                                Закрыть
                            </button>
                        </div>
                    ) : (
                        <div className="relative flex items-center justify-center scale-110">
                            <BreathingCircle 
                                phase={phase} 
                                timeLeft={phaseTimeLeft} 
                                totalDuration={getTotalDuration()} 
                            />
                            
                            {!isRunning && !showPrepModal && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <span className="text-sm font-black text-slate-300 uppercase tracking-[0.2em] ml-1 animate-pulse">
                                        СТАРТ
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* PATTERN INFO */}
                <div className="w-full px-10 mt-12 flex justify-between items-center text-center max-w-sm">
                    <div className={cn("transition-all duration-500", phase === 'inhale' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Вдох</span>
                        <span className={cn("text-2xl font-black tabular-nums", phase === 'inhale' ? "text-cyan-600" : "text-slate-300")}>{level.inhale}</span>
                    </div>
                    <div className={cn("transition-all duration-500", phase === 'hold' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Задержка</span>
                        <span className={cn("text-3xl font-black leading-none tabular-nums", phase === 'hold' ? "text-violet-600" : "text-slate-300")}>{level.hold}</span>
                    </div>
                    <div className={cn("transition-all duration-500", phase === 'exhale' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Выдох</span>
                        <span className={cn("text-3xl font-black leading-none tabular-nums", phase === 'exhale' ? "text-blue-600" : "text-slate-300")}>{level.exhale}</span>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <AnimatePresence>
                {!isRunning && (
                    <motion.div 
                        initial={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-8 pt-4 space-y-6 bg-white/50 backdrop-blur-sm rounded-b-[3rem] overflow-hidden"
                    >
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Длительность</p>
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6">
                                {DURATION_OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setDuration(opt)}
                                        className={cn(
                                            "shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border touch-manipulation",
                                            duration === opt 
                                                ? "bg-slate-800 text-white border-slate-800 shadow-md" 
                                                : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                                        )}
                                    >
                                        {opt === 0 ? "∞" : `${opt}м`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
                            <button 
                                disabled={levelIndex === 0}
                                onClick={() => setLevelIndex(i => i - 1)}
                                className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-30 transition-colors touch-manipulation"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-400" />
                            </button>
                            <div className="text-center w-32">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                                    Сложность
                                </span>
                                <span className="text-xl font-black text-slate-800 leading-none">
                                    {level.id}
                                </span>
                            </div>
                            <button 
                                disabled={levelIndex === BREATH_LEVELS.length - 1}
                                onClick={() => setLevelIndex(i => i + 1)}
                                className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-30 transition-colors touch-manipulation"
                            >
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>

        {/* MODALS */}
        {showInfo && <InfoSheet onClose={() => setShowInfo(false)} />}
        {showSound && (
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
        )}

    </div>
  );
};
