import { useState, useEffect } from 'react';
import { BREATH_LEVELS } from './data/patterns';
import { useBreathingSession } from './hooks/useBreathingSession';
import { BreathingCircle } from './components/BreathingCircle';
import { Info, ChevronRight, ChevronLeft, Timer, CheckCircle2, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { InfoSheet } from './components/InfoSheet';
import { SoundSheet } from './components/SoundSheet'; // 👈 ИМПОРТ ЗДЕСЬ
import { soundManager } from '../../utils/sounds';

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 0];

export const BreathingPage = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const [duration, setDuration] = useState(10);
  const [isAudioReady, setIsAudioReady] = useState(false);
  
  const [musicEnabled, setMusicEnabled] = useState(soundManager.isMusicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(soundManager.isSfxEnabled);
  const [currentTrack, setCurrentTrack] = useState(soundManager.getCurrentTrackId());
  const [musicVol, setMusicVol] = useState(soundManager.musicVolume);
  const [sfxVol, setSfxVol] = useState(soundManager.sfxVolume);

  const level = BREATH_LEVELS[levelIndex];
  const { phase, phaseTimeLeft, totalTimeLeft, startSession, stopSession } = useBreathingSession(level, duration);

  useEffect(() => {
      const timer = setTimeout(() => setIsAudioReady(true), 500);
      return () => clearTimeout(timer);
  }, []);

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
    
    if (phase === 'idle' || phase === 'finished') {
        soundManager.unlock();
        startSession();
    } else {
        stopSession();
    }
  };

  const formatTotalTime = (s: number) => {
      if (duration === 0) return "∞";
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] relative flex flex-col px-4 pt-14 pb-32">
        
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 relative overflow-hidden flex-1 flex flex-col z-10 border border-white">
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03] pointer-events-none" />

            <div className="px-8 pt-10 pb-4 flex justify-between items-start relative z-20">
                <div className="flex-1 min-w-0 pr-2">
                    <h1 className="text-3xl font-[900] text-slate-800 leading-tight">
                        Пранаяма
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Гиповентиляция
                        </span>
                        {phase !== 'idle' && phase !== 'finished' && (
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

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-6">
                <div 
                    onClick={handleToggle} 
                    className={cn(
                        "cursor-pointer relative group mb-12 transform-gpu transition-transform active:scale-95",
                        !isAudioReady && "opacity-50 pointer-events-none"
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
                            {phase === 'idle' && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <span className="text-sm font-black text-slate-300 uppercase tracking-[0.2em] ml-1 animate-pulse">
                                        СТАРТ
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full px-8 flex justify-between items-center text-center">
                    <div className={cn("transition-all duration-300 transform-gpu", phase === 'inhale' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Вдох</span>
                        <span className={cn("text-3xl font-black leading-none tabular-nums", phase === 'inhale' ? "text-cyan-600" : "text-slate-300")}>{level.inhale}</span>
                    </div>
                    <div className={cn("transition-all duration-300 transform-gpu", phase === 'hold' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Задержка</span>
                        <span className={cn("text-3xl font-black leading-none tabular-nums", phase === 'hold' ? "text-violet-600" : "text-slate-300")}>{level.hold}</span>
                    </div>
                    <div className={cn("transition-all duration-300 transform-gpu", phase === 'exhale' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Выдох</span>
                        <span className={cn("text-3xl font-black leading-none tabular-nums", phase === 'exhale' ? "text-blue-600" : "text-slate-300")}>{level.exhale}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {phase === 'idle' && (
                    <motion.div 
                        initial={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-6 bg-white border-t border-slate-50 overflow-hidden"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider shrink-0">Время</span>
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

                            <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30">
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>

        <AnimatePresence>
            {showInfo && <InfoSheet onClose={() => setShowInfo(false)} />}
            {showSound && (
                <SoundSheet 
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
        </AnimatePresence>

    </div>
  );
};
