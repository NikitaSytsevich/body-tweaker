// src/features/history/components/HistorySkeleton.tsx
export const HistorySkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.5rem] flex items-center gap-4 border border-transparent">
          {/* Иконка */}
          <div className="w-12 h-12 bg-slate-200 dark:bg-white/10 rounded-2xl shrink-0" />
          
          {/* Текст */}
          <div className="flex-1 space-y-2">
            <div className="w-24 h-4 bg-slate-200 dark:bg-white/10 rounded" />
            <div className="w-16 h-3 bg-slate-200 dark:bg-white/10 rounded" />
          </div>
          
          {/* Время */}
          <div className="w-10 h-4 bg-slate-200 dark:bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
};
