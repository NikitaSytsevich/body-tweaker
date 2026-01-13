import { useState, useEffect } from 'react';
import { History, Calendar, Clock, Wind, Flame, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { RecordDetails } from './components/RecordDetails';
import { SegmentedControl } from '../../components/ui/SegmentedControl'; // 👈 Новый компонент

dayjs.locale('ru');

interface FastingRecord {
  id: string;
  type: 'fasting' | 'breathing';
  scheme: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
}

export const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState<'fasting' | 'breathing'>('fasting');
  const [records, setRecords] = useState<FastingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<FastingRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('history_fasting');
    if (saved) {
        try {
            setRecords(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }
  }, []);

  const handleDelete = (id: string) => {
    const newRecords = records.filter(r => r.id !== id);
    setRecords(newRecords);
    localStorage.setItem('history_fasting', JSON.stringify(newRecords));
    setSelectedRecord(null);
  };

  const handleUpdate = (updatedRecord: any) => {
    const newRecords = records.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    setRecords(newRecords);
    localStorage.setItem('history_fasting', JSON.stringify(newRecords));
    setSelectedRecord(updatedRecord);
  };

  const filteredRecords = records.filter(r => r.type === activeTab);

  const totalHours = Math.round(filteredRecords.reduce((acc, r) => acc + r.durationSeconds, 0) / 3600);
  const totalSessions = filteredRecords.length;

  // Опции для переключателя
  const tabs = [
      { value: 'fasting', label: 'Голод', icon: Flame },
      { value: 'breathing', label: 'Дыхание', icon: Wind }
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7] relative flex flex-col px-4 pt-14 pb-32">
      
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 relative overflow-hidden flex-1 flex flex-col z-10 border border-white/50">
        
        {/* ХЕДЕР */}
        <div className="px-8 pt-10 pb-6 shrink-0 relative z-20 bg-white border-b border-gray-50">
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
                        {activeTab === 'fasting' ? 'Всего часов' : 'Сессий'}
                    </span>
                    <div className="text-xl font-mono font-bold text-blue-600">
                        {activeTab === 'fasting' ? totalHours : totalSessions}
                        <span className="text-sm font-sans text-slate-400 ml-1">
                            {activeTab === 'fasting' ? 'ч' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* 👇 НОВЫЙ МАГНИТНЫЙ ПЕРЕКЛЮЧАТЕЛЬ */}
            <div className="mt-2">
                <SegmentedControl 
                    options={tabs}
                    value={activeTab}
                    onChange={(val) => setActiveTab(val as any)}
                />
            </div>
        </div>

        {/* СПИСОК */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide relative z-10">
            
            {filteredRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-20 opacity-50">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-lg">Нет записей</h3>
                    <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                        История {activeTab === 'fasting' ? 'голодания' : 'практик'} появится здесь.
                    </p>
                </div>
            ) : (
                filteredRecords.map((record) => (
                    <motion.div
                        layoutId={record.id} // Анимация пересортировки при удалении
                        key={record.id}
                        onClick={() => setSelectedRecord(record)}
                        className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex items-center gap-4 group cursor-pointer active:scale-98 transition-transform"
                    >
                        <div className={cn(
                            "flex flex-col items-center justify-center w-12 h-12 rounded-2xl shrink-0",
                            record.type === 'fasting' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        )}>
                            {record.type === 'fasting' ? (
                                <>
                                    <span className="text-[9px] font-bold uppercase">{dayjs(record.endTime).format('MMM')}</span>
                                    <span className="text-lg font-black leading-none">{dayjs(record.endTime).format('D')}</span>
                                </>
                            ) : (
                                <Wind className="w-6 h-6" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 truncate text-sm">{record.scheme}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                    <Clock className="w-3 h-3" />
                                    {record.type === 'fasting' 
                                        ? `${Math.floor(record.durationSeconds / 3600)}ч`
                                        : `${Math.floor(record.durationSeconds / 60)}м ${record.durationSeconds % 60}с`
                                    }
                                </span>
                                
                                <span className="text-[10px] text-slate-300">
                                    {record.type === 'fasting' 
                                        ? `${dayjs(record.startTime).format('HH:mm')} - ${dayjs(record.endTime).format('HH:mm')}`
                                        : dayjs(record.startTime).format('D MMM HH:mm')
                                    }
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))
            )}
            
            <div className="h-4" />
        </div>

      </div>

      {/* ШТОРКА ДЕТАЛЕЙ */}
      <AnimatePresence>
        {selectedRecord && (
            <RecordDetails 
                record={selectedRecord} 
                onClose={() => setSelectedRecord(null)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        )}
      </AnimatePresence>

    </div>
  );
};
