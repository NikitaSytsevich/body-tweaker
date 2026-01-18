import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, BookOpen, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { SovietProtocolSheet } from './SovietProtocolSheet';
import { PREP_STEPS } from '../data/preparationSteps';

// --- ART COMPONENTS (Те же, что и были, для атмосферы) ---
// (Я сократил их код для читаемости, вставьте полные версии из предыдущего ответа)
const MindArt = () => <div className="absolute inset-0 flex items-center justify-center opacity-60"><motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-56 h-56 border-2 border-dashed border-violet-300 rounded-full" /></div>;
const NatureArt = () => <div className="absolute inset-0 flex items-center justify-center opacity-50"><motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} className="w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl" /></div>;
const GrainsArt = () => <div className="absolute inset-0 opacity-30"><div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" /></div>;
const ChemistryArt = () => <div className="absolute inset-0 flex items-center justify-center opacity-40"><div className="grid grid-cols-3 gap-6 rotate-12">{[...Array(9)].map((_, i) => <div key={i} className="w-2 h-2 bg-blue-500 rounded-full" />)}</div></div>;
const WaterArt = () => <div className="absolute inset-0 overflow-hidden opacity-50">{[...Array(5)].map((_, i) => <motion.div key={i} animate={{ y: -100 }} transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }} className="absolute w-3 h-3 bg-cyan-400/40 rounded-full blur-sm" style={{ top: '100%', left: `${i * 20}%` }} />)}</div>;
const MovementArt = () => <div className="absolute inset-0 flex items-center justify-center opacity-40"><motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-64 h-2 bg-orange-300/50 rounded-full" /></div>;
const MedicalArt = () => <div className="absolute inset-0 flex items-center justify-center opacity-30"><div className="text-6xl text-rose-300 font-black">+</div></div>;

const getArt = (theme: string) => {
    switch (theme) {
        case 'mind': return <MindArt />;
        case 'nature': case 'grains': return <NatureArt />; // Объединил для простоты
        case 'chemistry': return <ChemistryArt />;
        case 'water': return <WaterArt />;
        case 'movement': return <MovementArt />;
        case 'medical': return <MedicalArt />;
        default: return <GrainsArt />;
    }
};

// --- КОМПОНЕНТ ---

export const AnabolicState = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showSovietSheet, setShowSovietSheet] = useState(false);
  
  // Храним состояние чекбоксов: { "stepId-itemIndex": boolean }
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const step = PREP_STEPS[activeStep];
  const isLastStep = activeStep === PREP_STEPS.length - 1;

  // Проверка: все ли пункты на текущем шаге отмечены?
  const allChecked = step.checklist.every((_, idx) => checkedItems[`${activeStep}-${idx}`]);

  const toggleCheck = (idx: number) => {
      const key = `${activeStep}-${idx}`;
      const newVal = !checkedItems[key];
      setCheckedItems(prev => ({ ...prev, [key]: newVal }));
      
      // Вибрация при нажатии (если поддерживается)
      if (newVal && navigator.vibrate) navigator.vibrate(10);
  };

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

  return (
    <>
        <SovietProtocolSheet 
            isOpen={showSovietSheet} 
            onClose={() => setShowSovietSheet(false)} 
        />

        <div className="min-h-full flex flex-col pb-6 relative z-0">
        
        <div className="bg-white rounded-[3rem] shadow-sm shadow-slate-200/50 relative flex-1 flex flex-col z-10 border border-white/60 overflow-hidden">
            
            {/* ХЕДЕР (Прогресс) */}
            <div className="px-8 pt-8 pb-2 shrink-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1">
                        {PREP_STEPS.map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ 
                                    width: i === activeStep ? 20 : 6,
                                    height: 6,
                                    backgroundColor: i <= activeStep ? (step.color.includes('violet') ? '#7c3aed' : step.color.includes('emerald') ? '#059669' : '#334155') : '#e2e8f0'
                                }}
                                className="rounded-full"
                            />
                        ))}
                    </div>
                    <button 
                        onClick={() => setShowSovietSheet(true)}
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"
                    >
                        <BookOpen className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* ОСНОВНОЙ КОНТЕНТ */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {/* 1. ВИЗУАЛЬНАЯ КАРТОЧКА */}
                        <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden mb-8 shadow-sm border border-slate-100 bg-white">
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", step.gradient)} />
                            <div className="absolute inset-0">{getArt(step.theme)}</div>
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <div className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg mb-3">
                                    <step.icon className={cn("w-8 h-8", step.color)} />
                                </div>
                                <h2 className="text-2xl font-[900] text-slate-800 leading-none mb-1">
                                    {step.title}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {step.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* 2. ЦИТАТА */}
                        <div className="mb-8 relative pl-4 border-l-4 border-slate-200">
                            <p className="text-sm italic font-medium text-slate-500 leading-relaxed">
                                {step.quote}
                            </p>
                        </div>

                        {/* 3. ИНТЕРАКТИВНЫЙ ЧЕК-ЛИСТ */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">
                                Чек-лист подготовки
                            </h3>
                            {step.checklist.map((item, idx) => {
                                const isChecked = checkedItems[`${activeStep}-${idx}`];
                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => toggleCheck(idx)}
                                        className={cn(
                                            "p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 cursor-pointer active:scale-[0.98]",
                                            isChecked 
                                                ? "bg-slate-50 border-slate-200" 
                                                : "bg-white border-slate-100 shadow-sm hover:border-blue-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                            isChecked ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-300"
                                        )}>
                                            {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                        </div>
                                        <span className={cn(
                                            "text-sm font-medium transition-all",
                                            isChecked ? "text-slate-400 line-through" : "text-slate-700"
                                        )}>
                                            {item}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ФУТЕР (Кнопки навигации) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-8 bg-gradient-to-t from-white via-white/90 to-transparent z-30 flex gap-3">
                {activeStep > 0 && (
                    <button 
                        onClick={handlePrev}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 active:scale-95 transition-transform shrink-0 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                
                <button 
                    onClick={handleNext}
                    className={cn(
                        "flex-1 h-14 rounded-2xl flex items-center justify-between px-6 shadow-xl transition-all duration-300 group active:scale-95",
                        // Если все отмечено - кнопка яркая, если нет - обычная
                        allChecked 
                            ? "bg-slate-900 text-white shadow-slate-900/20" 
                            : "bg-white text-slate-400 border border-slate-200"
                    )}
                >
                    <span className={cn("font-bold text-sm tracking-wide pl-2", !allChecked && "font-medium")}>
                        {isLastStep ? "Начать голодание" : allChecked ? "Продолжить" : "Пропустить"}
                    </span>
                    
                    <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                        allChecked ? "bg-white/20" : "bg-slate-50"
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
