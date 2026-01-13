import { motion } from 'framer-motion';
import { ArrowRight, Database, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AnabolicState = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/timer');
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] relative flex flex-col px-4 pt-14 pb-32 overflow-hidden">
      
      {/* КАРТОЧКА */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 relative flex-1 flex flex-col z-10 border border-white/50 overflow-hidden">
        
        {/* Фоновая сетка */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03] pointer-events-none" />

        {/* ХЕДЕР */}
        <div className="px-8 pt-10 flex justify-between items-start relative z-20 pointer-events-none">
            <div className="pointer-events-auto">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Статус
                    </span>
                </div>
                <h1 className="text-3xl font-[900] text-slate-800 leading-tight">
                    Питание &<br/>Рост
                </h1>
            </div>
            
            <div 
                onClick={() => navigate('/history')}
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer pointer-events-auto active:scale-95"
            >
                <Database className="w-5 h-5 text-slate-400" />
            </div>
        </div>

        {/* ЦЕНТР */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 pointer-events-none">
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                
                {/* Анимация орбит */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute w-56 h-56 rounded-full border border-dashed border-slate-200"
                />
                
                {/* Частицы энергии */}
                {[0, 120, 240].map((deg, i) => (
                    <motion.div
                        key={i}
                        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 4, delay: i * 1.3, repeat: Infinity }}
                        className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                        style={{ transform: `rotate(${deg}deg) translate(90px)` }}
                    />
                ))}

                {/* ЯДРО */}
                <div className="w-36 h-36 rounded-full bg-gradient-to-b from-white to-slate-50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center border border-slate-100 relative z-10">
                    <Leaf className="w-8 h-8 text-emerald-500 mb-1" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Восстановление</span>
                </div>
            </div>

            <div className="px-8 text-center space-y-4">
                <div className="flex justify-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Гликоген ↑
                    </div>
                    <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Анаболизм
                    </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Организм находится в фазе роста. Идет восполнение энергетических резервов для будущей активности.
                </p>
            </div>
        </div>

        {/* КНОПКА (z-50) */}
        <div className="p-6 mt-auto bg-slate-50/50 border-t border-slate-100 relative z-50">
            <button 
                onClick={handleStart}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-slate-900/10 active:scale-98 transition-transform cursor-pointer pointer-events-auto"
            >
                <span className="font-bold text-sm tracking-wide">Запустить таймер</span>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </button>
        </div>

      </div>
    </div>
  );
};
