// src/features/breathing/components/SoundSheet.tsx
import { createPortal } from 'react-dom';
import { 
  X,  
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
  isOpen: boolean;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: Record<string, any> = {
    fire: Flame,
    wind: Wind,
    rain: CloudRain,
    space: Star
};

export const SoundSheet = ({
    isOpen,
    onClose,
    musicEnabled, sfxEnabled, currentTrackId,
    musicVolume, sfxVolume,
    onToggleMusic, onToggleSfx, onSelectTrack,
    onChangeMusicVolume, onChangeSfxVolume
}: Props) => {
  if (!isOpen) return null;

  const content = (
        <>
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fade-in"
          />

          {/* Modal */}
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] shadow-2xl overflow-hidden max-w-md mx-auto max-h-[85vh] flex flex-col animate-sheet-in">
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 shrink-0 bg-[#F2F2F7] dark:bg-[#1C1C1E]" onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-2 pb-6 shrink-0 bg-[#F2F2F7] dark:bg-[#1C1C1E]">
                <h2 className="text-2xl font-[900] text-slate-800 dark:text-white flex items-center gap-3">
                    Звуковой фон
                </h2>
                <button onClick={onClose} className="p-2 bg-slate-200/50 dark:bg-white/10 rounded-full hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-safe px-6 pt-2 space-y-8 bg-[#F2F2F7] dark:bg-[#1C1C1E]">
                
                {/* 1. VOLUME MIXER */}
                <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-white/5 space-y-6">
                    
                    {/* Music Channel */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", musicEnabled ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600" : "bg-slate-100 dark:bg-white/5 text-slate-400")}>
                                    <Music className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 dark:text-white text-sm">Музыка</span>
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                        {musicEnabled ? `${Math.round(musicVolume * 100)}%` : 'Выкл'}
                                    </span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={onToggleMusic}
                                className={cn("w-12 h-7 rounded-full relative transition-colors duration-200", musicEnabled ? "bg-violet-500" : "bg-slate-200 dark:bg-white/10")}
                            >
                                <div className={cn("w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-transform duration-200", musicEnabled ? "translate-x-6" : "translate-x-1")} />
                            </button>
                        </div>
                        <input 
                            type="range" min="0" max="1" step="0.01"
                            value={musicVolume}
                            onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
                            disabled={!musicEnabled}
                            className="w-full h-3 bg-slate-100 dark:bg-black/30 rounded-full appearance-none cursor-pointer accent-violet-500 disabled:opacity-50"
                        />
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-white/5 w-full" />

                    {/* SFX Channel */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", sfxEnabled ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "bg-slate-100 dark:bg-white/5 text-slate-400")}>
                                    <Wind className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 dark:text-white text-sm">Дыхание</span>
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                        {sfxEnabled ? `${Math.round(sfxVolume * 100)}%` : 'Выкл'}
                                    </span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={onToggleSfx}
                                className={cn("w-12 h-7 rounded-full relative transition-colors duration-200", sfxEnabled ? "bg-blue-500" : "bg-slate-200 dark:bg-white/10")}
                            >
                                <div className={cn("w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-transform duration-200", sfxEnabled ? "translate-x-6" : "translate-x-1")} />
                            </button>
                        </div>
                        <input 
                            type="range" min="0" max="1" step="0.01"
                            value={sfxVolume}
                            onChange={(e) => onChangeSfxVolume(parseFloat(e.target.value))}
                            disabled={!sfxEnabled}
                            className="w-full h-3 bg-slate-100 dark:bg-black/30 rounded-full appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* 2. TRACK SELECTOR */}
                <div className={cn("space-y-4 pb-8 transition-opacity duration-300", !musicEnabled && "opacity-50 pointer-events-none")}>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                        Атмосфера
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
                                        "relative p-4 rounded-[1.5rem] flex items-center gap-3 transition-all border group",
                                        isSelected 
                                            ? "bg-white dark:bg-[#2C2C2E] border-violet-500 ring-1 ring-violet-500/20 shadow-md scale-[1.02]" 
                                            : "bg-white dark:bg-[#2C2C2E] border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 active:scale-95"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                        isSelected ? "bg-violet-500 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    
                                    <span className={cn(
                                        "font-bold text-sm",
                                        isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                                    )}>
                                        {track.name}
                                    </span>

                                    {isSelected && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
          </div>
        </>
  );

  return createPortal(content, document.body);
};
