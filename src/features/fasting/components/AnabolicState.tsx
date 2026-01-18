import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Play, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { SovietProtocolSheet } from './SovietProtocolSheet';
import { PREP_STEPS } from '../data/preparationSteps'; // 👈 Импорт данных

// --- КОМПОНЕНТЫ АРТА (6 ВИДОВ) ---

const MindArt = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border border-dashed border-violet-300 rounded-full opacity-50" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-48 h-48 border border-violet-200 rounded-full opacity-60" />
    <div className="absolute w-32 h-32 bg-violet-500/10 blur-3xl rounded-full" />
  </div>
);

const NatureArt = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
       <motion.div key={i} animate={{ y: [-20, 20], x: [-10, 10], rotate: [0, 10] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }} className="absolute bg-emerald-400/20 rounded-full blur-xl" style={{ top: `${20 + i * 15}%`, left: `${10 + i * 20}%`, width: 60, height: 60 }} />
    ))}
  </div>
);

const GrainsArt = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
     <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50" />
     <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute w-40 h-40 bg-amber-400/20 rounded-full blur-2xl" />
  </div>
);

const ChemistryArt = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="grid grid-cols-4 gap-8 opacity-20 rotate-45">
        {[...Array(16)].map((_, i) => <div key={i} className="w-2 h-2 bg-blue-500 rounded-full" />)}
    </div>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, ease: "linear", repeat: Infinity }} className="absolute w-56 h-56 border-2 border-blue-100 rounded-full border-t-blue-400" />
  </div>
);

const WaterArt = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <motion.div key={i} initial={{ y: 400 }} animate={{ y: -100 }} transition={{ duration: 4 + i, repeat: Infinity, ease: "linear", delay: i }} className="absolute w-4 h-4 bg-cyan-400/30 rounded-full blur-sm" style={{ left: `${Math.random() * 100}%` }} />
    ))}
  </div>
);

const MovementArt = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
     {[...Array(3)].map((_, i) => (
         <motion.div key={i} animate={{ scaleX: [1, 1.5, 1], x: [0, 50, 0] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} className="absolute w-32 h-2 bg-rose-400/20 rounded-full" style={{ top: `${40 + i * 10}%`, left: '20%' }} />
     ))}
  </div>
);

const getArt = (theme: string) => {
    switch (theme) {
        case 'mind': return <MindArt />;
        case 'nature': return <NatureArt />;
        case 'grains': return <GrainsArt />;
        case 'chemistry': return <ChemistryArt />;
        case 'water': return <WaterArt />;
        case 'movement': return <MovementArt />;
        default: return <MindArt />;
    }
};

// --- КОМПОНЕНТ 3D CARD ---
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    return (
        <motion.div
            style={{ rotateX, rotateY, perspective: 1000 }}
            className={cn("relative w-full h-full preserve-3d touch-none", className)}
            onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - (rect.left + rect.width / 2));
                y.set(e.clientY - (rect.top + rect.height / 2));
            }}
            onPointerLeave={() => { x.set(0); y.set(0); }}
        >
            {children}
        </motion.div>
    );
};

// --- ГЛАВНЫЙ ЭКРАН ---
export const AnabolicState = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showSovietSheet, setShowSovietSheet] = useState(false);
  
  // Реф для скролла текста наверх при переключении
  const textRef = useRef<HTMLDivElement>(null);

  const step = PREP_STEPS[activeStep];
  const isLastStep = activeStep === PREP_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      navigate('/timer');
    } else {
      setActiveStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(s => s - 1);
  };

  // Скролл текста вверх при смене слайда
  useEffect(() => {
      if (textRef.current) {
          textRef.current.scrollTop = 0;
      }
  }, [activeStep]);

  return (
    <>
        <SovietProtocolSheet 
            isOpen={showSovietSheet} 
            onClose={() => setShowSovietSheet(false)} 
        />

        <div className="min-h-full flex flex-col pb-6 relative z-0">
        
        <div className="bg-white rounded-[3rem] shadow-sm shadow-slate-200/50 relative flex-1 flex flex-col z-10 border border-white/60 overflow-hidden">
            
            {/* ХЕДЕР */}
            <div className="px-8 pt-8 shrink-0 z-20 bg-white/80 backdrop-blur-sm pb-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                                Шаг {activeStep + 1}/{PREP_STEPS.length}
                            </span>
                        </div>
                        <h1 className="text-2xl font-[900] text-slate-800 leading-tight">
                            Подготовка
                        </h1>
                    </div>
                    
                    <button 
                        onClick={() => setShowSovietSheet(true)}
                        className="w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-colors active:scale-95 flex items-center justify-center"
                    >
                        <BookOpen className="w-5 h-5" />
                    </button>
                </div>

                {/* Прогресс-бар (сегментированный) */}
                <div className="flex gap-1 h-1.5 w-full">
                    {PREP_STEPS.map((_, i) => (
                        <div key={i} className="flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: i <= activeStep ? "100%" : "0%" }}
                                transition={{ duration: 0.3 }}
                                className={cn("h-full", i === activeStep ? "bg-slate-800" : "bg-slate-300")}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* КОНТЕНТ (Скроллируемый контейнер) */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* 1. Верхняя часть: 3D Карточка (Фиксированная высота) */}
                <div className="h-[280px] w-full px-6 pt-4 shrink-0 perspective-1000 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full h-full"
                        >
                            <TiltCard className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 bg-white border border-slate-100">
                                {/* Фон */}
                                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", step.gradient)} />
                                {/* Арт */}
                                <div className="absolute inset-0 z-0">{getArt(step.theme)}</div>
                                
                                {/* Контент карточки */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center">
                                    <div className="absolute top-6">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-sm">
                                            {step.badge}
                                        </span>
                                    </div>
                                    <div className="w-20 h-20 bg-white/50 backdrop-blur-xl rounded-[1.8rem] flex items-center justify-center shadow-lg border border-white/60 mb-4">
                                        <step.icon className={cn("w-10 h-10 drop-shadow-sm", step.color)} />
                                    </div>
                                    <h3 className={cn("text-2xl font-[900] mb-1 tracking-tight", step.color)}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide opacity-80">
                                        {step.subtitle}
                                    </p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 2. Нижняя часть: Текст (Скроллируемый) */}
                <div ref={textRef} className="flex-1 overflow-y-auto px-8 pt-6 pb-4 scrollbar-hide">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step.id + '-text'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="prose prose-sm prose-slate max-w-none">
                                <div className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {/* Рендерим текст с поддержкой жирного шрифта через простой парсер */}
                                    {step.description.split('\n').map((line, i) => {
                                        if (line.trim() === '') return <br key={i} />;
                                        // Простая эмуляция Markdown жирного
                                        const parts = line.split(/(\*\*.*?\*\*)/g);
                                        return (
                                            <p key={i} className="mb-3 last:mb-0">
                                                {parts.map((part, j) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <b key={j} className="text-slate-800">{part.slice(2, -2)}</b>;
                                                    }
                                                    return part;
                                                })}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>

            {/* ФУТЕР */}
            <div className="p-6 pt-2 shrink-0 relative z-20 flex gap-3 bg-gradient-to-t from-white via-white to-transparent">
                {activeStep > 0 && (
                    <button 
                        onClick={handlePrev}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-400 active:scale-95 transition-transform shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                
                <button 
                    onClick={handleNext}
                    className={cn(
                        "flex-1 h-14 rounded-2xl flex items-center justify-between px-6 shadow-xl active:scale-98 transition-all duration-300 group",
                        isLastStep 
                            ? "bg-slate-900 text-white shadow-slate-900/20" 
                            : "bg-white text-slate-800 border border-slate-100 shadow-slate-200/50"
                    )}
                >
                    <span className="font-bold text-sm tracking-wide pl-2">
                        {isLastStep ? "Все готово, начать!" : "Следующий этап"}
                    </span>
                    
                    <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                        isLastStep ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200"
                    )}>
                        {isLastStep ? (
                            <Play className="w-4 h-4 fill-current" />
                        ) : (
                            <ChevronRight className="w-5 h-5" />
                        )}
                    </div>
                </button>
            </div>

        </div>
        </div>
    </>
  );
};
