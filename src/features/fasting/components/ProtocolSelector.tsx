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
        className="fixed inset-0 z-[100] bg-black/5 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] rounded-t-[2.5rem] h-[85vh] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden max-w-md mx-auto border-t border-white/50"
      >
        
        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] shrink-0 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
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
                    <div className="px-6 pt-2 pb-6 flex justify-between items-end bg-[#F2F2F7] shrink-0">
                        <div>
                            <h2 className="text-2xl font-[900] text-slate-800 leading-none">
                                Протокол
                            </h2>
                            <p className="text-xs font-bold text-slate-400 mt-1.5 uppercase tracking-wide">
                                Выберите цель
                            </p>
                        </div>
                        
                        <button 
                            onClick={onClose}
                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 pt-0 scrollbar-hide">
                        {FASTING_SCHEMES.map((s) => {
                            const isSelected = currentSchemeId === s.id;
                            // "24ч: База" -> "База"
                            const titleClean = s.title.split(':')[1]?.trim() || s.title;
                            
                            return (
                                <motion.button
                                    key={s.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handlePreview(s.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-3 rounded-[1.5rem] border text-left transition-all relative overflow-hidden group",
                                        isSelected 
                                            ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-100" 
                                            : "bg-white border-slate-100/50 shadow-sm hover:border-slate-200"
                                    )}
                                >
                                    {/* Иконка: Меньше и аккуратнее */}
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                        "bg-slate-50 group-hover:bg-slate-100"
                                    )}>
                                        <s.icon className={cn("w-5 h-5 opacity-80", s.color)} />
                                    </div>

                                    {/* Инфо: Только название и время */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="font-bold text-[15px] text-slate-800 leading-tight">
                                            {titleClean}
                                        </h3>
                                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                                            {s.hours} часов
                                        </p>
                                    </div>

                                    {/* Индикатор: Минималистичная стрелка или галочка */}
                                    <div className="pr-1">
                                        {isSelected ? (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        )}
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
