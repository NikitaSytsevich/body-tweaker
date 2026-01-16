import { useState, useEffect, useMemo } from 'react';
import { History, Calendar, Clock, Wind, Flame, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { RecordDetails } from './components/RecordDetails';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { safeLocalStorageGetJSON, safeLocalStorageSetJSON } from '../../utils/localStorage';
import type { HistoryRecord } from '../../utils/types';

dayjs.locale('ru');

export const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState<'fasting' | 'breathing'>('fasting');
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    const saved = safeLocalStorageGetJSON<HistoryRecord[]>('history_fasting', []);
    const validRecords = saved.filter((r): r is HistoryRecord => 
      r && 
      typeof r.id === 'string' &&
      (r.type === 'fasting' || r.type === 'breathing')
    );
    setRecords(validRecords);
  }, []);

  const handleDelete = (id: string) => {
    const newRecords = records.filter(r => r.id !== id);
    setRecords(newRecords);
    safeLocalStorageSetJSON('history_fasting', newRecords);
    setSelectedRecord(null);
  };

  const handleUpdate = (updatedRecord: HistoryRecord) => {
    const newRecords = records.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    setRecords(newRecords);
    safeLocalStorageSetJSON('history_fasting', newRecords);
    setSelectedRecord(updatedRecord);
  };

  const filteredRecords = useMemo(() => 
    records.filter(r => r.type === activeTab),
    [records, activeTab]
  );

  const totalHours = useMemo(() => 
    Math.round(filteredRecords.reduce((acc, r) => acc + r.durationSeconds, 0) / 3600),
    [filteredRecords]
  );

  // ГРУППИРОВКА ПО МЕСЯЦАМ
  const groupedRecords = useMemo(() => {
      const groups: Record<string, HistoryRecord[]> = {};
      filteredRecords.forEach(r => {
          const key = dayjs(r.endTime).format('MMMM YYYY'); // "Май 2024"
          if (!groups[key]) groups[key] = [];
          groups[key].push(r);
      });
      return groups;
  }, [filteredRecords]);

  const tabs = [
    { value: 'fasting', label: 'Голод', icon: Flame },
    { value: 'breathing', label: 'Дыхание', icon: Wind }
  ];

  return (
    <div className="min-h-full flex flex-col pb-6 relative z-0">
      <div className="bg-white rounded-[3rem] shadow-sm shadow-slate-200/50 relative overflow-hidden flex-1 flex flex-col z-10 border border-white/60">
        
        {/* ХЕДЕР */}
        <div className="px-8 pt-8 pb-4 shrink-0 relative z-20 bg-white border-b border-gray-50 rounded-t-[3rem]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Журнал
                </span>
              </div>
              <h1 className="text-3xl font-[900] text-slate-800 leading-tight">
                {activeTab === 'fasting' ? "Голодание" : "Дыхание"}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Всего
              </span>
              <div className="text-2xl font-black text-slate-800 leading-none mt-1">
                {activeTab === 'fasting' ? totalHours : filteredRecords.length}
                <span className="text-sm font-bold text-slate-400 ml-1">
                  {activeTab === 'fasting' ? 'ч' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <SegmentedControl 
              options={tabs}
              value={activeTab}
              onChange={(val) => setActiveTab(val as 'fasting' | 'breathing')}
            />
          </div>
        </div>

        {/* СПИСОК */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 scrollbar-hide relative z-10">
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-20 opacity-50">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg">Пока пусто</h3>
              <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                Завершите свою первую сессию, чтобы увидеть её здесь.
              </p>
            </div>
          ) : (
            // Рендер групп
            Object.entries(groupedRecords).map(([month, recordsInGroup]) => (
                <div key={month} className="mb-8 last:mb-0">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10">
                        {month}
                    </h3>
                    
                    <div className="space-y-3">
                        {recordsInGroup.map((record) => (
                            <motion.div
                                layoutId={record.id}
                                key={record.id}
                                onClick={() => setSelectedRecord(record)}
                                className="bg-slate-50/50 hover:bg-slate-100 p-4 rounded-[1.5rem] flex items-center gap-4 group cursor-pointer transition-colors relative overflow-hidden"
                            >
                                {/* Дата (Слева, Крупно) */}
                                <div className="flex flex-col items-center justify-center w-12 shrink-0 border-r border-slate-200 pr-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        {dayjs(record.endTime).format('ddd')}
                                    </span>
                                    <span className="text-xl font-black text-slate-800 leading-none mt-0.5">
                                        {dayjs(record.endTime).format('D')}
                                    </span>
                                </div>

                                {/* Инфо */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-slate-700 truncate text-sm">
                                            {record.scheme}
                                        </h4>
                                        {record.type === 'fasting' && (
                                            <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded text-slate-400 shadow-sm">
                                                {Math.floor(record.durationSeconds / 3600)}ч
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                        <Clock className="w-3 h-3" />
                                        {dayjs(record.startTime).format('HH:mm')} — {dayjs(record.endTime).format('HH:mm')}
                                    </div>
                                </div>

                                {/* Стрелка */}
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-2">
                                    <ChevronRight className="w-4 h-4" />
                                </div>

                            </motion.div>
                        ))}
                    </div>
                </div>
            ))
          )}
        </div>
      </div>

      {/* ШТОРКА ДЕТАЛЕЙ */}
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
