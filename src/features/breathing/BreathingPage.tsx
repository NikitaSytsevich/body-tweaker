import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BREATH_LEVELS } from './data/patterns';
import { useBreathingSession } from './hooks/useBreathingSession';
import { BreathingCircle } from './components/BreathingCircle';
import { Info, ChevronRight, ChevronLeft, Volume2, Timer, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { InfoSheet } from './components/InfoSheet';
import { SoundSheet } from './components/SoundSheet';
import { soundManager } from '../../utils/sounds';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
export const BreathingPage = () => {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const duration: number = 10;
  
  const [musicEnabled, setMusicEnabled] = useState(soundManager.isMusicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(soundManager.isSfxEnabled);
  const [currentTrack, setCurrentTrack] = useState(soundManager.getCurrentTrackId());
  const [musicVol, setMusicVol] = useState(soundManager.musicVolume);
  const [sfxVol, setSfxVol] = useState(soundManager.sfxVolume);

  const level = BREATH_LEVELS[levelIndex];
  const { phase, phaseTimeLeft, totalTimeLeft, startSession, stopSession } = useBreathingSession(level, duration);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      startSession();
      setCountdown(null);
      return;
    }

    const timerId = window.setTimeout(() => {
      setCountdown(prev => (prev === null ? null : prev - 1));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [countdown, startSession]);

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
    if (phase !== 'idle' && phase !== 'finished') {
        // Стоп
        stopSession();
        setCountdown(null);
    } else if (countdown !== null) {
        setCountdown(null);
    } else {
        if (phase === 'finished') {
          stopSession();
        }
        soundManager.unlock(); 
        setCountdown(3);
    }
  };

  const formatTotalTime = (s: number) => {
      if (duration === 0) return "∞";
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const isSessionRunning = phase !== 'idle' && phase !== 'finished';
  const isPreparing = countdown !== null;
  const isRunning = isSessionRunning || isPreparing;

  return (
    <div className="h-full flex flex-col relative z-0">
        
        <div className="relative flex-1 min-h-0 flex flex-col z-10 rounded-[28px] overflow-hidden app-card">

            {/* HEADER */}
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3 relative z-20 shrink-0">
                <div className="flex-1 min-w-0">
                    <h1 className="text-[26px] font-[900] app-header leading-tight tracking-tight">
                        Пранаяма
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold app-muted uppercase tracking-widest">
                            Гиповентиляция
                        </span>
                        {isSessionRunning && (
                            <span className="text-[11px] font-bold app-header bg-[color:var(--tg-glass)] px-2 py-0.5 rounded-md font-mono flex items-center gap-1 backdrop-blur-sm">
                                <Timer className="w-3 h-3" />
                                {formatTotalTime(totalTimeLeft)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSound(true)}
                        className="p-2 rounded-full bg-[color:var(--tg-glass)] border border-[color:var(--tg-border)] text-[color:var(--tg-muted)] hover:text-[color:var(--tg-accent)] transition-colors backdrop-blur-md"
                    >
                        <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowInfo(true)}
                        className="p-2 rounded-full bg-[color:var(--tg-glass)] border border-[color:var(--tg-border)] text-[color:var(--tg-muted)] hover:text-[color:var(--tg-accent)] transition-colors backdrop-blur-md"
                    >
                        <Info className="w-5 h-5" />
                    </button>
                    <ProfileAvatar onClick={() => navigate('/profile')} />
                </div>
            </div>

            {/* CIRCLE & STATUS */}
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative z-10 px-4 pt-1 pb-1">
                
                <div 
                    onClick={handleToggle} 
                    className={cn(
                        "cursor-pointer relative transform-gpu transition-all duration-500",
                        isRunning ? "scale-110" : "hover:scale-105 active:scale-95"
                    )}
                >
                    {phase === 'finished' ? (
                        <div className="w-[clamp(190px,48vw,250px)] h-[clamp(190px,48vw,250px)] flex flex-col items-center justify-center bg-[color:var(--tg-glass)] rounded-full border border-[color:var(--tg-border)] shadow-[0_16px_40px_-30px_rgba(15,23,42,0.6)] animate-in zoom-in duration-300 backdrop-blur-xl">
                            <div className="mb-2 w-16 h-16 rounded-2xl bg-[color:var(--tg-surface)] border border-[color:var(--tg-border)] flex items-center justify-center">
                              <Sparkles className="w-9 h-9 text-amber-400" />
                            </div>
                            <span className="text-[clamp(16px,4.2vw,20px)] font-bold app-header">Отлично!</span>
                            <button onClick={(e) => { e.stopPropagation(); stopSession(); }} className="mt-3 text-[11px] font-bold uppercase tracking-widest bg-[color:var(--tg-glass)] px-4 py-2 rounded-xl border border-[color:var(--tg-border)] hover:bg-[color:var(--tg-glass-strong)] backdrop-blur-md">
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
                            
                            {isPreparing && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <span className="text-[clamp(34px,9vw,54px)] font-black text-[color:var(--tg-header)] leading-none tabular-nums animate-pulse">
                                        {countdown}
                                    </span>
                                </div>
                            )}

                            {!isRunning && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <span className="text-[11px] font-black text-[color:var(--tg-muted)] uppercase tracking-[0.2em] ml-1 animate-pulse">
                                        СТАРТ
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* PATTERN INFO */}
                <div className="w-full px-6 mt-4 flex justify-between items-center text-center max-w-sm">
                    <div className={cn("transition-all duration-500", phase === 'inhale' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[10px] font-bold app-muted uppercase block mb-1">Вдох</span>
                        <span className={cn("text-2xl font-black tabular-nums", phase === 'inhale' ? "text-cyan-600 dark:text-cyan-300" : "text-slate-300 dark:text-white/30")}>{level.inhale}</span>
                    </div>
                    <div className={cn("transition-all duration-500", phase === 'hold' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[10px] font-bold app-muted uppercase block mb-1">Задержка</span>
                        <span className={cn("text-3xl font-black leading-none tabular-nums", phase === 'hold' ? "text-violet-600 dark:text-violet-300" : "text-slate-300 dark:text-white/30")}>{level.hold}</span>
                    </div>
                    <div className={cn("transition-all duration-500", phase === 'exhale' ? "scale-110 opacity-100" : "opacity-30 blur-[0.5px]")}>
                        <span className="text-[10px] font-bold app-muted uppercase block mb-1">Выдох</span>
                        <span className={cn("text-3xl font-black leading-none tabular-nums", phase === 'exhale' ? "text-blue-600 dark:text-blue-300" : "text-slate-300 dark:text-white/30")}>{level.exhale}</span>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            {!isRunning && (
                <div className="px-5 pb-5 pt-3 space-y-3 bg-[color:var(--tg-glass)] backdrop-blur-xl border-t border-[color:var(--tg-border)] overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between bg-[color:var(--tg-glass)] p-2 rounded-[1.5rem] border border-[color:var(--tg-border)]">
                        <button 
                            disabled={levelIndex === 0}
                            onClick={() => setLevelIndex(i => i - 1)}
                            className="p-3 hover:bg-[color:var(--tg-glass-strong)] rounded-xl disabled:opacity-30 transition-colors touch-manipulation"
                        >
                            <ChevronLeft className="w-5 h-5 text-[color:var(--tg-muted)]" />
                        </button>
                        <div className="text-center w-32">
                            <span className="text-[11px] font-bold app-muted uppercase tracking-widest block mb-0.5">
                                Сложность
                            </span>
                            <span className="text-[19px] font-black app-header leading-none">
                                {level.id}
                            </span>
                        </div>
                        <button 
                            disabled={levelIndex === BREATH_LEVELS.length - 1}
                            onClick={() => setLevelIndex(i => i + 1)}
                            className="p-3 hover:bg-[color:var(--tg-glass-strong)] rounded-xl disabled:opacity-30 transition-colors touch-manipulation"
                        >
                            <ChevronRight className="w-5 h-5 text-[color:var(--tg-muted)]" />
                        </button>
                    </div>
                </div>
            )}

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
