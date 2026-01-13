import { motion } from 'framer-motion';
import { Music, Bell, Flame, Wind, CloudRain, Star } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { AMBIENT_TRACKS } from '../../../utils/sounds';

interface Props {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  currentTrackId: string;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onSelectTrack: (id: string) => void;
  onClose: () => void;
}

// Маппинг иконок
const icons = {
    fire: Flame,
    wind: Wind,
    rain: CloudRain,
    space: Star
};

export const SoundMixer = ({ 
    musicEnabled, sfxEnabled, currentTrackId, 
    onToggleMusic, onToggleSfx, onSelectTrack, onClose 
}: Props) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="absolute top-16 right-0 z-50 bg-white/95 backdrop-blur-xl border border-white/50 p-4 rounded-[1.5rem] shadow-xl w-64 origin-top-right"
      >
        
        {/* 1. ГЛАВНЫЕ ПЕРЕКЛЮЧАТЕЛИ */}
        <div className="flex gap-2 mb-4">
            <button 
                onClick={onToggleMusic}
                className={cn(
                    "flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                    musicEnabled ? "bg-violet-50 border-violet-100" : "bg-slate-50 border-transparent opacity-60"
                )}
            >
                <Music className={cn("w-5 h-5 mb-1", musicEnabled ? "text-violet-600" : "text-slate-400")} />
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Музыка</span>
            </button>

            <button 
                onClick={onToggleSfx}
                className={cn(
                    "flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                    sfxEnabled ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-transparent opacity-60"
                )}
            >
                <Bell className={cn("w-5 h-5 mb-1", sfxEnabled ? "text-blue-600" : "text-slate-400")} />
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Звуки</span>
            </button>
        </div>

        {/* 2. ВЫБОР АТМОСФЕРЫ (Только если музыка включена) */}
        {musicEnabled && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Атмосфера
                </h4>
                
                <div className="grid grid-cols-4 gap-2">
                    {AMBIENT_TRACKS.map((track) => {
                        const Icon = icons[track.icon];
                        const isSelected = currentTrackId === track.id;
                        
                        return (
                            <button
                                key={track.id}
                                onClick={() => onSelectTrack(track.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all border",
                                    isSelected 
                                        ? "bg-slate-800 text-white border-slate-800 shadow-md scale-105" 
                                        : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                                )}
                            >
                                <Icon className="w-4 h-4 mb-1" />
                                <span className="text-[8px] font-bold truncate w-full text-center">
                                    {track.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}

      </motion.div>
    </>
  );
};
