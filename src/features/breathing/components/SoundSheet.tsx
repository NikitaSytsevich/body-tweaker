import { createPortal } from 'react-dom'; // 👈
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Flame, Wind, CloudRain, Star, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { AMBIENT_TRACKS } from '../../../utils/sounds';
import { VolumeSlider } from './VolumeSlider';

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
    onClose, musicEnabled, sfxEnabled, currentTrackId, musicVolume, sfxVolume,
    onToggleMusic, onToggleSfx, onSelectTrack, onChangeMusicVolume, onChangeSfxVolume 
}: Props) => {
  
  const content = (
    <AnimatePresence>
      <>
        {/* Затемнение */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
        />

        {/* Шторка */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] shadow-2xl flex flex col overflow-hidden max-w-md mx-auto h-[85vh]"
        >
          <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full" />
          </div>

          <div className="flex justify-between items-center px-8 pt-2 pb-6">
              <h3 className="text-2xl font-[900] text-slate-800 dark:text-white">Аудиосфера</h3>
              <button onClick={onClose} className="p-2 bg-gray-200/50 dark:bg-white/10 text-gray-500 dark:text-slate-400 rounded-full hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                  <X className="w-5 h-5" />
              </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4">

              {/* Музыка */}
              <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-1 shadow-sm border border-white dark:border-white/10">
                  <div
                      onClick={onToggleMusic}
                      className="flex items-center justify-between p-4 cursor-pointer active:opacity-70 transition-opacity"
                  >
                      <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", musicEnabled ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" : "bg-slate-100 dark:bg-[#3A3A3C] text-slate-400 dark:text-slate-500")}>
                              <Music className="w-6 h-6" />
                          </div>
                          <div>
                              <h4 className="font-bold text-lg text-slate-800 dark:text-white leading-none">Атмосфера</h4>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide mt-1">Фоновый звук</p>
                          </div>
                      </div>
                      <div className={cn("w-12 h-7 rounded-full relative transition-colors duration-300", musicEnabled ? "bg-violet-500 dark:bg-violet-400" : "bg-slate-200 dark:bg-[#3A3A3C]")}>
                          <div className={cn("w-5 h-5 bg-white dark:bg-slate-900 rounded-full absolute top-1 transition-all shadow-md", musicEnabled ? "left-6" : "left-1")} />
                      </div>
                  </div>

                  <AnimatePresence>
                      {musicEnabled && (
                          <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                          >
                              <div className="p-4 pt-0">
                                  <div className="grid grid-cols-2 gap-2 mb-6">
                                      {AMBIENT_TRACKS.map((track) => {
                                          const Icon = icons[track.icon];
                                          const isSelected = currentTrackId === track.id;
                                          return (
                                              <button
                                                  key={track.id}
                                                  onClick={() => onSelectTrack(track.id)}
                                                  className={cn(
                                                      "flex items-center gap-3 p-3 rounded-2xl transition-all border text-left",
                                                      isSelected
                                                          ? "bg-slate-800 dark:bg-slate-100 border-slate-800 dark:border-slate-100 text-white shadow-lg"
                                                          : "bg-slate-50 dark:bg-[#3A3A3C] border-slate-50 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#4A4A4C]"
                                                  )}
                                              >
                                                  <div className={cn("p-1.5 rounded-lg", isSelected ? "bg-white/20" : "bg-white dark:bg-[#2C2C2E]")}>
                                                      <Icon className="w-4 h-4" />
                                                  </div>
                                                  <span className="text-xs font-bold">{track.name}</span>
                                              </button>
                                          );
                                      })}
                                  </div>

                                  <VolumeSlider
                                      value={musicVolume}
                                      onChange={onChangeMusicVolume}
                                      colorClass="bg-violet-500 dark:bg-violet-400"
                                  />
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>

              {/* Сигналы */}
              <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-1 shadow-sm border border-white dark:border-white/10">
                  <div
                      onClick={onToggleSfx}
                      className="flex items-center justify-between p-4 cursor-pointer active:opacity-70 transition-opacity"
                  >
                      <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", sfxEnabled ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-[#3A3A3C] text-slate-400 dark:text-slate-500")}>
                              {sfxEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                          </div>
                          <div>
                              <h4 className="font-bold text-lg text-slate-800 dark:text-white leading-none">Сигналы</h4>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide mt-1">Вдох / Выдох</p>
                          </div>
                      </div>
                      <div className={cn("w-12 h-7 rounded-full relative transition-colors duration-300", sfxEnabled ? "bg-blue-500 dark:bg-blue-400" : "bg-slate-200 dark:bg-[#3A3A3C]")}>
                          <div className={cn("w-5 h-5 bg-white dark:bg-slate-900 rounded-full absolute top-1 transition-all shadow-md", sfxEnabled ? "left-6" : "left-1")} />
                      </div>
                  </div>

                  <AnimatePresence>
                      {sfxEnabled && (
                          <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                          >
                              <div className="p-4 pt-0">
                                  <VolumeSlider
                                      value={sfxVolume}
                                      onChange={onChangeSfxVolume}
                                      colorClass="bg-blue-500 dark:bg-blue-400"
                                  />
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>

          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
