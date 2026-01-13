import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Trash2, Edit3, Check, Sunrise, Moon } from 'lucide-react';
import { TimerRing } from '../../fasting/components/TimerRing'; 
import { FASTING_PHASES } from '../../fasting/data/stages';
import { NativeDatePicker } from '../../../components/ui/DatePicker';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';

interface FastingRecord {
  id: string;
  scheme: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
}

interface Props {
  record: FastingRecord | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedRecord: FastingRecord) => void;
}

export const RecordDetails = ({ record, onClose, onDelete, onUpdate }: Props) => {
  if (!record) return null;

  // Локальное состояние для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [editedStart, setEditedStart] = useState(record.startTime);
  const [editedEnd, setEditedEnd] = useState(record.endTime);

  // Пересчет статистики на лету
  const durationSeconds = dayjs(editedEnd).diff(dayjs(editedStart), 'second');
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  
  const passedPhases = FASTING_PHASES.filter(p => (durationSeconds / 3600) >= p.hoursStart);

  const handleSave = () => {
    onUpdate({
        ...record,
        startTime: editedStart,
        endTime: editedEnd,
        durationSeconds
    });
    setIsEditing(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7] rounded-t-[2.5rem] h-[90vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
      >
        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] shrink-0" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* ХЕДЕР С КНОПКАМИ */}
        <div className="px-6 flex justify-between items-center mb-4">
            
            {/* Кнопка Удалить */}
            <button onClick={() => { onDelete(record.id); onClose(); }} className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5" />
            </button>
            
            <div className="flex gap-3">
                {/* 👇 КНОПКА РЕДАКТИРОВАНИЯ */}
                {isEditing ? (
                    <button onClick={handleSave} className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all">
                        <Check className="w-5 h-5" />
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2.5 bg-white text-blue-500 rounded-full border border-blue-100 hover:bg-blue-50 transition-colors">
                        <Edit3 className="w-5 h-5" />
                    </button>
                )}

                {/* Закрыть */}
                <button onClick={onClose} className="p-2.5 bg-gray-200/50 text-gray-500 rounded-full hover:bg-gray-300 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-safe px-4">
            
            {/* КОЛЬЦО */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm mb-4 flex flex-col items-center border border-white">
                <div className="scale-75 -my-4 pointer-events-none">
                    <TimerRing 
                        progress={100} 
                        time={`${hours}:${minutes.toString().padStart(2, '0')}:00`}
                        isFasting={true}
                        color="text-emerald-500"
                        label={isEditing ? "Изменение..." : "Завершено"}
                    />
                </div>
                <h2 className="text-xl font-black text-slate-800 mt-2">{record.scheme}</h2>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mt-1">
                    <Calendar className="w-3 h-3" />
                    {dayjs(editedEnd).format('D MMMM YYYY')}
                </div>
            </div>

            {/* ВРЕМЯ (С поддержкой редактирования) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={cn("bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-all", isEditing && "ring-2 ring-blue-500/20 bg-blue-50/10")}>
                    {isEditing ? (
                        <NativeDatePicker 
                            label="Начало" icon={Sunrise} 
                            dateValue={editedStart} onChange={setEditedStart}
                            disabled={false}
                        />
                    ) : (
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Начало</p>
                            <p className="text-lg font-bold text-slate-700">{dayjs(editedStart).format('HH:mm')}</p>
                        </div>
                    )}
                </div>
                
                <div className={cn("bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-all", isEditing && "ring-2 ring-blue-500/20 bg-blue-50/10")}>
                    {isEditing ? (
                        <NativeDatePicker 
                            label="Конец" icon={Moon} 
                            dateValue={editedEnd} onChange={setEditedEnd}
                            disabled={false}
                        />
                    ) : (
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Конец</p>
                            <p className="text-lg font-bold text-slate-700">{dayjs(editedEnd).format('HH:mm')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* СПИСОК ФАЗ */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Достигнутые этапы</h3>
                <div className="space-y-2">
                    {passedPhases.map((phase) => (
                        <div key={phase.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-slate-100">
                            <div className={cn("p-2 rounded-xl bg-slate-50", phase.color.replace('text-', 'text-'))}>
                                <phase.icon className={cn("w-5 h-5", phase.color)} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-700">{phase.title}</h4>
                                <p className="text-xs text-slate-400">{phase.hoursStart}ч+</p>
                            </div>
                        </div>
                    ))}
                    {passedPhases.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-4 bg-white rounded-2xl border border-dashed border-gray-200">
                            Слишком короткое голодание для этапов
                        </p>
                    )}
                </div>
            </div>

        </div>
      </motion.div>
    </>
  );
};
