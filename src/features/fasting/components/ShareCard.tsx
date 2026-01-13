import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Props {
  schemeTitle: string;
  elapsedTime: string;
  progress: number;
  schemeIcon: any;
  color: string;
}

export const ShareCard = forwardRef<HTMLDivElement, Props>(({ schemeTitle, elapsedTime, progress, schemeIcon: Icon, color }, ref) => {
  return (
    <div 
        ref={ref}
        className="fixed left-[-9999px] top-0 w-[1080px] h-[1920px] bg-[#F2F2F7] flex flex-col items-center justify-center p-20 font-sans text-slate-900"
    >
        {/* ФОН */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[200px]" />
        
        {/* КАРТОЧКА */}
        <div className="relative z-10 w-full bg-white rounded-[6rem] shadow-2xl p-16 flex flex-col items-center border border-white/50">
            
            {/* ИКОНКА */}
            <div className={cn("w-40 h-40 rounded-[3rem] flex items-center justify-center mb-10 shadow-lg", color.replace('text-', 'bg-').replace('500', '100'))}>
                <Icon className={cn("w-20 h-20", color)} />
            </div>

            <h1 className="text-6xl font-black text-slate-800 text-center mb-4 leading-tight">
                Мой прогресс<br/>голодания
            </h1>
            
            <p className="text-3xl font-bold text-slate-400 uppercase tracking-widest mb-16">
                {schemeTitle}
            </p>

            {/* ЦИФРЫ */}
            <div className="text-[12rem] font-[900] text-slate-800 font-mono tracking-tighter leading-none mb-4 tabular-nums">
                {elapsedTime}
            </div>
            
            <div className="flex items-center gap-4 bg-slate-100 rounded-full px-8 py-4 mb-20">
                <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse" />
                <span className="text-4xl font-bold text-slate-600">Активность</span>
            </div>

            {/* ПРОГРЕСС БАР */}
            <div className="w-full h-10 bg-slate-100 rounded-full overflow-hidden relative mb-10">
                <div 
                    className="absolute inset-y-0 left-0 bg-blue-600" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
            
            {/* ФУТЕР */}
            <div className="flex items-center gap-4 opacity-50">
                <Sparkles className="w-10 h-10" />
                <span className="text-3xl font-bold tracking-widest">BODY TWEAKER APP</span>
            </div>

        </div>
    </div>
  );
});
