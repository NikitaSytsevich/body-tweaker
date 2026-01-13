import { ChevronLeft, ArrowRight } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { cn } from '../../../utils/cn';

interface Props {
  onSelect: (id: string) => void;
  onClose: () => void;
}

export const ProtocolSelector = ({ onSelect, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#F2F2F7] flex flex-col px-4 pt-14 pb-8">
      
      {/* КАРТОЧКА */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 relative flex-1 flex flex-col z-10 border border-white/50 overflow-hidden">
        
        {/* Хедер */}
        <div className="px-8 pt-10 pb-6 flex justify-between items-start shrink-0 relative z-20 bg-white/95 border-b border-gray-50">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Конфигурация
                    </span>
                </div>
                <h1 className="text-3xl font-[900] text-slate-800 leading-tight">
                    Выбор<br/>Цели
                </h1>
            </div>
            
            <button 
                onClick={onClose}
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-slate-100 transition-colors active:scale-95"
            >
                <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
        </div>

        {/* СПИСОК (Без JS-анимаций, только CSS) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide relative z-10">
            {FASTING_SCHEMES.map((s) => (
                <button
                    key={s.id}
                    onClick={() => onSelect(s.id)}
                    className="w-full relative group overflow-hidden bg-slate-50 border border-slate-100 p-5 rounded-[2rem] text-left transition-all duration-200 active:scale-[0.98] hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-white"
                >
                    {/* Цветная подложка (только на Hover) */}
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                        s.color.replace('text-', 'bg-')
                    )} />

                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            {/* Иконка */}
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200",
                                "bg-white border border-slate-100 shadow-sm group-hover:border-transparent",
                                s.color
                            )}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            
                            {/* Текст */}
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-black transition-colors">
                                    {s.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                                        {s.hours} часов
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Стрелка */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <p className="mt-4 text-xs text-slate-500 leading-relaxed pl-1">
                        {s.description}
                    </p>
                </button>
            ))}
            
            <div className="h-4" />
        </div>

      </div>
    </div>
  );
};
