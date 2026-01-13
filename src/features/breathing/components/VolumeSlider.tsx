import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Props {
  value: number; 
  onChange: (val: number) => void;
  colorClass: string; 
}

export const VolumeSlider = ({ value, onChange, colorClass }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const widthMV = useMotionValue(value);
  const springWidth = useSpring(widthMV, { 
      stiffness: isDragging ? 500 : 200, 
      damping: isDragging ? 30 : 25 
  });

  useEffect(() => {
    if (!isDragging) widthMV.set(value);
  }, [value, isDragging]);

  const updateValue = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let newValue = x / rect.width;
    newValue = Math.max(0, Math.min(1, newValue));
    widthMV.set(newValue);
    onChange(newValue);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX);

    const onMove = (e: PointerEvent) => {
        e.preventDefault();
        updateValue(e.clientX);
    };
    
    const onUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const Icon = value === 0 ? VolumeX : value < 0.5 ? Volume1 : Volume2;
  const widthPercent = useTransform(springWidth, v => `${v * 100}%`);

  return (
    <motion.div 
        ref={ref}
        onPointerDown={handlePointerDown}
        whileTap={{ scale: 0.96 }}
        className="relative h-14 w-full rounded-2xl bg-slate-100 overflow-hidden cursor-pointer touch-none select-none"
    >
        <motion.div 
            className={cn("absolute inset-y-0 left-0", colorClass)}
            style={{ width: widthPercent }}
        />

        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-10 mix-blend-overlay"> 
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-slate-900 fill-slate-900" />
            </div>
            <span className="text-xs font-black text-slate-900 font-mono tracking-widest opacity-60">
                {Math.round(value * 100)}%
            </span>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20 mix-blend-normal">
             <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5 transition-colors duration-200", value > 0.1 ? "text-white" : "text-slate-400")} />
            </div>
            <span className={cn("text-xs font-black font-mono tracking-widest transition-colors duration-200", value > 0.9 ? "text-white/80" : "text-slate-400")}>
                {Math.round(value * 100)}%
            </span>
        </div>
    </motion.div>
  );
};
