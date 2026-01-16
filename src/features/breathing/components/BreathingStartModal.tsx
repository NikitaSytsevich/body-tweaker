import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BreathingStartModal = ({ isOpen, onClose }: Props) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (isOpen) {
        setCount(5);
        const timer = setInterval(() => {
            setCount((c) => (c > 1 ? c - 1 : 1));
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [isOpen]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000]"
          />

          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-xs bg-white rounded-[3rem] shadow-2xl p-8 relative pointer-events-auto"
              >
                  <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors z-20"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col items-center text-center pt-6">
                    
                    {/* Анимированный круг с таймером */}
                    <div className="relative w-40 h-40 flex items-center justify-center mb-10">
                        <motion.div 
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                            className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl"
                        />
                        
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                            className="w-28 h-28 bg-white rounded-full shadow-lg flex items-center justify-center relative z-10 border-4 border-indigo-50"
                        >
                            <motion.span 
                                key={count} 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-5xl font-[900] text-indigo-500 tabular-nums"
                            >
                                {count}
                            </motion.span>
                            
                            <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none overflow-visible">
                                <motion.circle 
                                    cx="50%" cy="50%" r="48%" fill="none" 
                                    stroke="#6366f1" strokeWidth="4" strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 5.5, ease: "linear" }}
                                />
                            </svg>
                        </motion.div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500 mb-2">
                            <Wind className="w-6 h-6 animate-pulse" />
                        </div>
                        <p className="text-base font-bold text-slate-600 leading-relaxed max-w-[220px]">
                            Займите удобное положение. <br/>
                            Расслабьте тело.
                        </p>
                    </div>

                  </div>
              </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
