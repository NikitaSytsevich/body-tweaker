// src/features/history/HistoryPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Wind,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Zap,
  Calendar as CalendarIcon,
  Hourglass
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';

// Components
import { RecordDetails } from './components/RecordDetails';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { HistorySkeleton } from './components/HistorySkeleton';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';

// Utils
import { storageGetHistory, storageSaveHistory } from '../../utils/storage';
import type { HistoryRecord } from '../../utils/types';
import { cn } from '../../utils/cn';

dayjs.extend(isoWeek);
dayjs.locale('ru');

// --- КОМПОНЕНТЫ ---

// Карточка статистики
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ label, value, unit, icon: Icon, colorClass, bgClass }: any) => (
  <div className={cn("flex flex-col items-center justify-center p-3 rounded-2xl flex-1 min-w-[85px] border border-transparent", bgClass)}>
    <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
       <Icon className={cn("w-3.5 h-3.5", colorClass)} />
       <span className={cn("text-[9px] font-bold uppercase tracking-wide", colorClass)}>{label}</span>
    </div>
    <div className="flex flex-col items-center">
        <span className={cn("text-xl font-black leading-none mb-0.5", colorClass)}>
            {value}
        </span>
        {unit && (
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                {unit}
            </span>
        )}
    </div>
  </div>
);

// Хелпер для расчета статистики
const calculateStats = (records: HistoryRecord[], type: 'fasting' | 'breathing') => {
    if (!records.length) return { totalTime: 0, count: 0, maxDuration: 0, avgDuration: 0 };

    const count = records.length;
    
    // Суммарное время в секундах
    const totalSeconds = records.reduce((acc, r) => acc + r.durationSeconds, 0);
    
    // Максимальная длительность
    const maxSeconds = Math.max(...records.map(r => r.durationSeconds));
    
    // Средняя длительность
    const avgSeconds = totalSeconds / count;

    // Форматирование
    if (type === 'fasting') {
        return {
            totalTime: Math.round(totalSeconds / 3600), // Часы
            count,
            maxDuration: Math.round(maxSeconds / 3600), // Часы
            avgDuration: Math.round(avgSeconds / 3600)  // Часы
        };
    } else {
        return {
            totalTime: Math.round(totalSeconds / 60), // Минуты
            count,
            maxDuration: Math.round(maxSeconds / 60), // Минуты
            avgDuration: Math.round(avgSeconds / 60)  // Минуты
        };
    }
};

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'fasting' | 'breathing'>('fasting');
  const [allRecords, setAllRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(dayjs()); 
  const [selectedDate, setSelectedDate] = useState(dayjs()); 

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  // LOAD DATA
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const saved = await storageGetHistory<HistoryRecord>('history_fasting');
        const validRecords = saved
            .filter(r => r && typeof r.id === 'string' && (r.type === 'fasting' || r.type === 'breathing'))
            .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
        setAllRecords(validRecords);
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    loadHistory();
  }, []);

  // FILTERS
  const filteredRecords = useMemo(() => 
    allRecords.filter(r => r.type === activeTab),
    [allRecords, activeTab]
  );

  // STATS
  const stats = useMemo(() => 
      calculateStats(filteredRecords, activeTab), 
  [filteredRecords, activeTab]);

  // CALENDAR DAYS
  const daysInMonth = useMemo(() => {
      const start = currentDate.startOf('month');
      const end = currentDate.endOf('month');
      const days: (number | null)[] = []; 
      
      let startDay: number = start.day(); 
      if (startDay === 0) startDay = 7; 
      
      for (let i = 1; i < startDay; i++) days.push(null);
      for (let i = 1; i <= end.date(); i++) days.push(i);
      
      return days;
  }, [currentDate]);

  // SELECTED DAY RECORDS
  const recordsForSelectedDate = useMemo(() => {
      return filteredRecords.filter(r => 
          dayjs(r.endTime).isSame(selectedDate, 'day')
      );
  }, [filteredRecords, selectedDate]);


  // ACTIONS
  const handleDelete = async (id: string) => {
    const newRecords = allRecords.filter(r => r.id !== id);
    setAllRecords(newRecords);
    setSelectedRecord(null);
    await storageSaveHistory('history_fasting', newRecords);
  };

  const handleUpdate = async (updatedRecord: HistoryRecord) => {
    const newRecords = allRecords.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    setAllRecords(newRecords);
    setSelectedRecord(updatedRecord);
    await storageSaveHistory('history_fasting', newRecords);
  };

  const tabs = [
    { value: 'fasting', label: 'Голод', icon: Flame },
    { value: 'breathing', label: 'Дыхание', icon: Wind }
  ];

  return (
    <div className="min-h-full flex flex-col pb-6 relative z-0">
      
      {/* HEADER */}
      <div className="px-6 pt-6 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-[900] text-slate-800 dark:text-white leading-tight">
            Прогресс
          </h1>
          <ProfileAvatar onClick={() => navigate('/profile')} />
      </div>

      <div className="px-4 mb-6">
        <SegmentedControl options={tabs} value={activeTab} onChange={(val) => setActiveTab(val as any)} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 px-4">
        
        {/* 1. STATS ROW */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
            <StatCard
                label={activeTab === 'fasting' ? "Всего" : "Практика"}
                value={stats.totalTime}
                unit={activeTab === 'fasting' ? "Часов" : "Минут"}
                icon={Hourglass}
                bgClass="bg-blue-50 dark:bg-blue-900/20"
                colorClass="text-blue-500 dark:text-blue-400"
            />

            <StatCard
                label="Рекорд"
                value={stats.maxDuration}
                unit={activeTab === 'fasting' ? "Часов" : "Минут"}
                icon={Trophy}
                bgClass="bg-amber-50 dark:bg-amber-900/20"
                colorClass="text-amber-500 dark:text-amber-400"
            />

            <StatCard
                label="Сессий"
                value={stats.count}
                unit="Всего"
                icon={Zap}
                bgClass="bg-purple-50 dark:bg-purple-900/20"
                colorClass="text-purple-500 dark:text-purple-400"
            />
        </div>

        {/* 2. CALENDAR CARD */}
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5 mb-6">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-[900] text-slate-800 dark:text-white capitalize">
                    {currentDate.format('MMMM YYYY')}
                </h2>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentDate(d => d.subtract(1, 'month'))} className="p-2 hover:bg-slate-50 dark:hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </button>
                    <button onClick={() => setCurrentDate(d => d.add(1, 'month'))} className="p-2 hover:bg-slate-50 dark:hover:bg-white/10 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-4 mb-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                        {d}
                    </div>
                ))}
                
                {daysInMonth.map((dayNum, idx) => {
                    if (dayNum === null) return <div key={`empty-${idx}`} />;
                    
                    const date = currentDate.date(dayNum);
                    // Используем уникальный строковый ключ для каждого дня
                    const uniqueKey = `day-${currentDate.month()}-${dayNum}`;

                    const isToday = date.isSame(dayjs(), 'day');
                    const isSelected = date.isSame(selectedDate, 'day');
                    
                    const hasRecord = filteredRecords.some(r => dayjs(r.endTime).isSame(date, 'day'));
                    
                    return (
                        <div key={uniqueKey} className="flex justify-center">
                            <button
                                onClick={() => setSelectedDate(date)}
                                className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all relative",
                                    // Стиль выбранной даты
                                    isSelected 
                                        ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-110 z-10" 
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5",
                                    // Стиль "Сегодня"
                                    !isSelected && isToday && "text-blue-500 dark:text-blue-400"
                                )}
                            >
                                {dayNum}
                                
                                {/* Индикатор записи */}
                                {hasRecord && !isSelected && (
                                    <div className={cn(
                                        "absolute inset-0 rounded-full border-2 opacity-100",
                                        activeTab === 'fasting' 
                                            ? "border-blue-500 dark:border-blue-400" 
                                            : "border-purple-500 dark:border-purple-400"
                                    )} />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* 3. SELECTED DAY LIST */}
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 pl-2">
                {selectedDate.isSame(dayjs(), 'day') ? 'Сегодня' : selectedDate.format('D MMMM')}
            </h3>

            {isLoading ? (
                <HistorySkeleton />
            ) : recordsForSelectedDate.length === 0 ? (
                <div className="text-center py-8 opacity-50 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl bg-white/50 dark:bg-[#2C2C2E]/50">
                    <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Нет активности</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {recordsForSelectedDate.map(record => {
                        const isFasting = record.type === 'fasting';
                        const hours = Math.floor(record.durationSeconds / 3600);
                        const minutes = Math.floor((record.durationSeconds % 3600) / 60);
                        const progress = isFasting ? Math.min((hours / 24) * 100, 100) : Math.min((record.durationSeconds / 60 / 30) * 100, 100);

                        return (
                            <div
                                key={record.id}
                                onClick={() => setSelectedRecord(record)}
                                className={cn(
                                    "relative p-4 rounded-[1.5rem] flex items-center gap-4 active:scale-[0.98] transition-transform overflow-hidden",
                                    "bg-white dark:bg-[#2C2C2E] shadow-md border",
                                    isFasting
                                        ? "border-blue-100 dark:border-blue-900/30 shadow-blue-500/5"
                                        : "border-purple-100 dark:border-purple-900/30 shadow-purple-500/5"
                                )}
                            >
                                {/* Gradient overlay */}
                                <div className={cn(
                                    "absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none",
                                    isFasting
                                        ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                                        : "bg-gradient-to-br from-purple-500 to-pink-500"
                                )} />

                                {/* Progress bar indicator */}
                                <div className={cn(
                                    "absolute left-0 top-4 bottom-4 w-1 rounded-full",
                                    isFasting ? "bg-blue-500" : "bg-purple-500"
                                )}>
                                    <div
                                        className={cn(
                                            "absolute bottom-0 left-0 right-0 rounded-full transition-all",
                                            isFasting ? "bg-blue-200 dark:bg-blue-400" : "bg-purple-200 dark:bg-purple-400"
                                        )}
                                        style={{ height: `${progress}%` }}
                                    />
                                </div>

                                {/* Icon with gradient background */}
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-lg",
                                    isFasting
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white"
                                        : "bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 text-white"
                                )}>
                                    {isFasting ? <Flame className="w-7 h-7" /> : <Wind className="w-7 h-7" />}
                                </div>

                                <div className="flex-1 min-w-0 relative z-10">
                                    <h4 className="font-bold text-slate-800 dark:text-white truncate text-sm mb-1">
                                        {record.scheme}
                                    </h4>

                                    {/* Big duration display */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black text-slate-800 dark:text-white tabular-nums">
                                            {isFasting ? hours : Math.floor(record.durationSeconds / 60)}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                                            {isFasting ? 'ч' : 'мин'}
                                        </span>
                                        {isFasting && minutes > 0 && (
                                            <>
                                                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-1 tabular-nums">
                                                    {minutes}м
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Time badge */}
                                <div className={cn(
                                    "flex flex-col items-end gap-1 relative z-10 shrink-0",
                                )}>
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm whitespace-nowrap",
                                        isFasting
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                            : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                    )}>
                                        {dayjs(record.endTime).format('HH:mm')}
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                        {dayjs(record.endTime).format('D MMM')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

      </div>

      {/* MODALS */}
      {selectedRecord && (
        <RecordDetails
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onDelete={handleDelete}
          onUpdate={(updated) => handleUpdate(updated as HistoryRecord)}
        />
      )}
    </div>
  );
};
