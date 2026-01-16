import { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Props {
  value: number;
  onChange: (val: number) => void;
  colorClass: string;
}

export const VolumeSlider = ({ value, onChange, colorClass }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const progressMV = useMotionValue(value);

  const updateValue = (clientX: number) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let newValue = x / rect.width;
    newValue = Math.max(0, Math.min(1, newValue));

    progressMV.set(newValue);
    onChange(newValue);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    updateValue(e.clientX);

    const onMove = (e: PointerEvent) => updateValue(e.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const Icon =
    value === 0 ? VolumeX : value < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      className="relative h-14 w-full rounded-2xl bg-slate-100 overflow-hidden cursor-pointer touch-none select-none"
    >
      {/* Прогресс (GPU only) */}
      <motion.div
        className={cn(
          'absolute inset-0 origin-left',
          colorClass
        )}
        style={{
          scaleX: progressMV,
          willChange: 'transform',
        }}
      />

      {/* Контент */}
      <div className="absolute inset-0 z-10 flex items-center justify-between px-4 pointer-events-none">
        <Icon
          className={cn(
            'w-5 h-5 transition-colors',
            value > 0.1 ? 'text-white' : 'text-slate-400'
          )}
        />

        <span
          className={cn(
            'text-xs font-black font-mono tracking-widest transition-colors',
            value > 0.9 ? 'text-white/80' : 'text-slate-400'
          )}
        >
          {Math.round(value * 100)}%
        </span>
      </div>
    </div>
  );
};
