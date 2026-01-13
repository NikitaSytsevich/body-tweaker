import { cn } from '../../../utils/cn';
import { motion } from 'framer-motion';

interface Props {
  progress: number;
  time: string;
  isFasting: boolean;
  color: string;
  label?: string;
}

export const TimerRing = ({ progress, time, isFasting, label }: Props) => {
  const size = 280;
  const center = size / 2;
  const strokeWidth = 16; // Сделаем линию чуть толще для солидности
  const radius = 120;
  
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* Фоновое свечение */}
        {isFasting && (
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full animate-pulse" />
        )}

        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          
          {/* 1. ФОН ШКАЛЫ (Серый круг) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9" // slate-100
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* 2. ЛИНИЯ ПРОГРЕССА (Цветная) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-out",
              isFasting ? "text-blue-500" : "text-transparent"
            )}
          />
        </svg>

        {/* ЦЕНТРАЛЬНЫЙ ТЕКСТ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            
            {/* Лейбл (например, "24ч База") */}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                {label || (isFasting ? "Голодание" : "Ожидание")}
            </span>

            {/* ВРЕМЯ */}
            <div className="flex items-baseline text-slate-800">
                <span className="text-6xl font-[800] font-mono tracking-tighter tabular-nums leading-none">
                    {time.split(':')[0]}:{time.split(':')[1]}
                </span>
                <span className="text-xl font-medium text-slate-300 ml-1">
                    {time.split(':')[2]}
                </span>
            </div>

            {/* ПРОЦЕНТ */}
            {isFasting && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-3 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 flex items-center gap-1.5"
                >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-blue-600 tabular-nums">
                        {progress.toFixed(1)}%
                    </span>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  );
};
