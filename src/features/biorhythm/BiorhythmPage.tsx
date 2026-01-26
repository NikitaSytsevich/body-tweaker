import { useBiorhythms } from './hooks/useBiorhythms';
import { BiorhythmChart } from './components/BiorhythmChart';
import { StatsGrid } from './components/StatsGrid';
import { Calendar } from 'lucide-react';

export const BiorhythmPage = () => {
  const { birthDate, setBirthDate, todayStats, chartData } = useBiorhythms();

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#2C2C2E] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-between mb-4 mx-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Calendar className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase">Дата рождения</p>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="font-bold text-gray-700 dark:text-slate-200 bg-transparent outline-none text-sm w-32 [&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
      </div>
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white ml-1">Энергетические волны</h2>
        <BiorhythmChart data={chartData} />
      </div>
      <div className="px-4">
        <StatsGrid stats={todayStats} />
      </div>
    </div>
  );
};
