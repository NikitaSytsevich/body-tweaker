// src/features/breathing/components/SoundSheet.tsx
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Volume2, 
  Music, 
  Wind, 
  CloudRain, 
  Flame, 
  Star,
  Check
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { AMBIENT_TRACKS } from '../../../utils/sounds';

interface Props {
  onClose: () => void;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  currentTrackId: string;
  musicVolume: number;
  sfxVolume: number;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onSelectTrack: (id: string) => void;
  onChangeMusicVolume: (val: number) => void;
  onChangeSfxVolume: (val: number) => void;
}

const icons = {
    fire: Flame,
    wind: Wind,
    rain: CloudRain,
    space: Star
};

export const SoundSheet = ({
    onClose,
    musicEnabled, sfxEnabled, currentTrackId,
    musicVolume, sfxVolume,
    onToggleMusic, onToggleSfx, onSelectTrack,
    onChangeMusicVolume, onChangeSfxVolume
}: Props) => {

  const content = (
    <AnimatePresence>
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] p-6 pb-10 shadow-2xl max-w-md mx-auto"
          >
            {/* Handle */}
            <div className="w-full flex justify-center mb-6" onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full" />
            </div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-[900] text-slate-800 dark:text-white flex items-center gap-3">
                    <span className="p-2 bg-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                        <Volume2 className="w-6 h-6" />
                    </span>
                    Атмосфера
                </h2>
                <button onClick={onClose} className="p-2 bg-slate-200/50 dark:bg-white/10 rounded-full hover:bg-slate-200 transition-colors">
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
            </div>

            {/* 1. VOLUME CONTROLS */}
            <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-white/5 mb-6 space-y-6">
                
                {/* Music Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
                            <Music className="w-4 h-4 text-violet-500" />
                            Фоновая музыка
                        </div>
                        <button 
                            onClick={onToggleMusic}
                            className={cn(
                                "w-10 h-6 rounded-full relative transition-colors duration-300",
                                musicEnabled ? "bg-violet-500" : "bg-slate-200 dark:bg-white/10"
                            )}
                        >
                            <div className={cn("w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300", musicEnabled ? "translate-x-4.5" : "translate-x-0.5")} />
                        </button>
                    </div>
                    <input 
                        type="range" min="0" max="1" step="0.01"
                        value={musicVolume}
                        onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
                        disabled={!musicEnabled}
                        className="w-full h-2 bg-slate-100 dark:bg-black/20 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-50"
                    />
                </div>

                <div className="h-px bg-slate-100 dark:bg-white/5" />

                {/* SFX Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
                            <Wind className="w-4 h-4 text-blue-500" />
                            Звуки дыхания
                        </div>
                        <button 
                            onClick={onToggleSfx}
                            className={cn(
                                "w-10 h-6 rounded-full relative transition-colors duration-300",
                                sfxEnabled ? "bg-blue-500" : "bg-slate-200 dark:bg-white/10"
                            )}
                        >
                            <div className={cn("w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300", sfxEnabled ? "translate-x-4.5" : "translate-x-0.5")} />
                        </button>
                    </div>
                    <input 
                        type="range" min="0" max="1" step="0.01"
                        value={sfxVolume}
                        onChange={(e) => onChangeSfxVolume(parseFloat(e.target.value))}
                        disabled={!sfxEnabled}
                        className="w-full h-2 bg-slate-100 dark:bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                    />
                </div>
            </div>

            {/* 2. TRACKS GRID */}
            <div className={cn("transition-opacity duration-300", !musicEnabled && "opacity-50 pointer-events-none")}>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 pl-2">
                    Выбор фона
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {AMBIENT_TRACKS.map((track) => {
                        const Icon = icons[track.icon];
                        const isSelected = currentTrackId === track.id;
                        
                        return (
                            <button
                                key={track.id}
                                onClick={() => onSelectTrack(track.id)}
                                className={cn(
                                    "relative p-4 rounded-[1.5rem] flex items-center gap-3 transition-all border overflow-hidden group",
                                    isSelected 
                                        ? "bg-slate-800 dark:bg-white border-slate-800 dark:border-white shadow-lg scale-[1.02]" 
                                        : "bg-white dark:bg-[#2C2C2E] border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 active:scale-95"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                    isSelected ? "bg-white/20 text-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                
                                <span className={cn(
                                    "font-bold text-sm",
                                    isSelected ? "text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-300"
                                )}>
                                    {track.name}
                                </span>

                                {isSelected && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

          </motion.div>
        </>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
