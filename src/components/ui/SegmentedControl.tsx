import { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { SegmentedControlOption } from '../../utils/types';

interface Props<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string = string>({ options, value, onChange }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const activeIndex = options.findIndex(o => o.value === value);
  
  const xPercent = useMotionValue(0);
  const springPercent = useSpring(xPercent, { 
      stiffness: isDragging ? 2000 : 500, 
      damping: isDragging ? 50 : 35 
  });

  useEffect(() => {
    if (!isDragging) {
        const step = 100 / options.length;
        xPercent.set(activeIndex * step);
    }
  }, [value, isDragging, options.length]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);

    const onMove = (e: PointerEvent) => updatePosition(e.clientX);
    const onUp = (e: PointerEvent) => handlePointerUp(e.clientX);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    
    function handlePointerUp(clientX: number) {
        setIsDragging(false);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const padding = 4;
        const width = rect.width - (padding * 2);
        const itemWidth = width / options.length;
        
        const relativeX = clientX - rect.left - padding;
        let index = Math.floor(relativeX / itemWidth);
        index = Math.max(0, Math.min(index, options.length - 1));
        
        onChange(options[index].value);
    }
  };

  const updatePosition = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 4;
      const width = rect.width - (padding * 2);
      const itemWidth = width / options.length;
      
      let relativeX = clientX - rect.left - padding - (itemWidth / 2);
      let percent = (relativeX / width) * 100;
      
      if (percent < 0) percent = percent / 4;
      if (percent > (100 - (100 / options.length))) {
          // Упрощенное сопротивление справа
      }
      
      xPercent.set(percent);
  };

  const widthPercent = 100 / options.length;
  
  // 👇 ИСПРАВЛЕНИЕ: useTransform вынесен наверх
  const leftStyle = useTransform(springPercent, v => `calc(${v}% + 4px)`);

  return (
    <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="bg-slate-100 p-1 rounded-2xl flex relative cursor-pointer touch-none select-none"
    >
        {/* ПЛАШКА (DRAG) */}
        {/* Оставляем условный рендеринг самого div, но хук leftStyle уже вычислен выше */}
        {isDragging && (
            <motion.div 
                className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm border border-black/5 z-10 pointer-events-none"
                style={{
                    left: leftStyle, // Используем вычисленное значение
                    width: `calc(${widthPercent}% - 8px)`
                }}
            />
        )}

        {options.map((option) => {
            const isActive = option.value === value;
            return (
                <div 
                    key={option.value}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold relative z-20 transition-colors pointer-events-none",
                        isActive ? "text-slate-800" : "text-slate-400"
                    )}
                >
                    {!isDragging && isActive && (
                        <motion.div 
                            layoutId="segment-pill"
                            className="absolute inset-0 bg-white rounded-xl shadow-sm border border-black/5 -z-10"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    
                    <option.icon className="w-3.5 h-3.5" /> 
                    {option.label}
                </div>
            );
        })}
    </div>
  );
};
