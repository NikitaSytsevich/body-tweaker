import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { cn } from '../../../utils/cn';
import { ProtocolDetails } from './ProtocolDetails';

interface Props {
  onSelect: (id: string) => void;
  onClose: () => void;
  currentSchemeId?: string;
}

export const ProtocolSelector = ({ onSelect, onClose, currentSchemeId }: Props) => {
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);

  const CARD_GRADIENTS: Record<string, string> = {
    '24h': 'from-sky-200/60 via-sky-100/30 to-transparent dark:from-sky-500/20 dark:via-sky-500/10',
    '36h': 'from-emerald-200/60 via-emerald-100/30 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10',
    '48h': 'from-violet-200/60 via-violet-100/30 to-transparent dark:from-violet-500/20 dark:via-violet-500/10',
    '72h': 'from-rose-200/60 via-rose-100/30 to-transparent dark:from-rose-500/20 dark:via-rose-500/10',
    '96h': 'from-indigo-200/60 via-indigo-100/30 to-transparent dark:from-indigo-500/20 dark:via-indigo-500/10',
    '120h': 'from-fuchsia-200/60 via-fuchsia-100/30 to-transparent dark:from-fuchsia-500/20 dark:via-fuchsia-500/10',
    '168h': 'from-amber-200/60 via-amber-100/30 to-transparent dark:from-amber-500/20 dark:via-amber-500/10',
  };

  const CHIP_STYLES: Record<string, string> = {
    '24h': 'border-sky-200 text-sky-600 dark:border-sky-700 dark:text-sky-300',
    '36h': 'border-emerald-200 text-emerald-600 dark:border-emerald-700 dark:text-emerald-300',
    '48h': 'border-violet-200 text-violet-600 dark:border-violet-700 dark:text-violet-300',
    '72h': 'border-rose-200 text-rose-600 dark:border-rose-700 dark:text-rose-300',
    '96h': 'border-indigo-200 text-indigo-600 dark:border-indigo-700 dark:text-indigo-300',
    '120h': 'border-fuchsia-200 text-fuchsia-600 dark:border-fuchsia-700 dark:text-fuchsia-300',
    '168h': 'border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  };

  const handlePreview = (id: string) => {
    setSelectedPreviewId(id);
  };

  const handleStart = () => {
    if (selectedPreviewId) {
        onSelect(selectedPreviewId);
        onClose();
    }
  };

  const ModalContent = (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/5 dark:bg-black/40 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-gradient-to-b dark:from-[#0B0F14] dark:via-[#0E141C] dark:to-[#0B0F14] rounded-t-[2.5rem] h-[85vh] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-16px_50px_-20px_rgba(0,0,0,0.75)] flex flex-col overflow-hidden max-w-md mx-auto border-t border-white/50 dark:border-[#1A2533]"
      >

        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#0B0F14] shrink-0 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-[#2A394D] rounded-full" />
        </div>

        <AnimatePresence mode="wait">
            
            {/* ЭКРАН ДЕТАЛЕЙ */}
            {selectedPreviewId ? (
                <ProtocolDetails 
                    key="details"
                    schemeId={selectedPreviewId} 
                    onBack={() => setSelectedPreviewId(null)}
                    onStart={handleStart}
                />
            ) : (
                /* ЭКРАН СПИСКА (ОБЛЕГЧЕННЫЙ) */
                <motion.div 
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col h-full"
                >
                    <div className="px-6 pt-2 pb-6 flex justify-between items-end bg-[#F2F2F7] dark:bg-[#0B0F14] shrink-0">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-400">
                                Выбор протокола
                            </p>
                            <h2 className="mt-2 text-2xl font-[900] text-slate-800 dark:text-slate-100 leading-none">
                                Длительность и цель
                            </h2>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2 max-w-[240px] leading-relaxed">
                                Откройте протокол, чтобы посмотреть детали и подготовку.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-9 h-9 bg-white dark:bg-[#141C27] rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-[#1E2A3A] text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-95 transition-transform"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-3 pt-0 scrollbar-hide">
                        {FASTING_SCHEMES.map((s) => {
                            const isSelected = currentSchemeId === s.id;
                            // "24ч: База" -> "База"
                            const titleClean = s.title.split(':')[1]?.trim() || s.title;
                            const gradient = CARD_GRADIENTS[s.id] ?? 'from-slate-200/50 via-slate-100/20 to-transparent';
                            const chipStyle = CHIP_STYLES[s.id] ?? 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300';
                            
                            return (
                                <motion.button
                                    key={s.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handlePreview(s.id)}
                                    className={cn(
                                        "w-full text-left transition-all relative overflow-hidden group rounded-[22px] border",
                                        "bg-white/90 dark:bg-[#121A24]/85 backdrop-blur",
                                        "shadow-[0_12px_30px_-22px_rgba(15,23,42,0.5)]",
                                        isSelected
                                            ? "border-blue-200 dark:border-blue-700/60 ring-1 ring-blue-100/70 dark:ring-blue-700/40"
                                            : "border-slate-100/80 dark:border-[#1F2B3C] hover:border-slate-200 dark:hover:border-[#2B3B52]"
                                    )}
                                >
                                    <div className={cn("absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", gradient)} />
                                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-200/80 dark:bg-[#1E2A3A]/80" />

                                    <div className="relative z-10 flex items-start gap-4 p-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                            "bg-slate-50 dark:bg-[#1B2432]/70 group-hover:bg-slate-100 dark:group-hover:bg-[#223045]"
                                        )}>
                                            <s.icon className={cn("w-6 h-6 opacity-80", s.color)} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-semibold text-[16px] text-slate-800 dark:text-slate-100 leading-tight">
                                                    {titleClean}
                                                </h3>
                                                <span className={cn(
                                                    "px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full border bg-white/70 dark:bg-[#0E131A]/70",
                                                    chipStyle
                                                )}>
                                                    {s.hours}ч
                                                </span>
                                            </div>
                                            <p className="mt-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {s.description}
                                            </p>
                                        </div>

                                        <div className="pt-1">
                                            {isSelected ? (
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-500" />
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                        <div className="h-8" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </motion.div>
    </>
  );

  return createPortal(
    <AnimatePresence>
        {ModalContent}
    </AnimatePresence>, 
    document.body
  );
};
