import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Edit3, Check, Sunrise, Moon, Clock, Trophy } from 'lucide-react';
import { FASTING_PHASES } from '../../fasting/data/stages';
import { NativeDatePicker } from '../../../components/ui/DatePicker';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';
import type { HistoryRecord } from '../../../utils/types';

interface Props {
  record: HistoryRecord | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedRecord: HistoryRecord) => void;
}

export const RecordDetails = ({ record, onClose, onDelete, onUpdate }: Props) => {
  // Хуки должны быть вызваны всегда
  const [isEditing, setIsEditing] = useState(false);
  const [editedStart, setEditedStart] = useState(record?.startTime || '');
  const [editedEnd, setEditedEnd] = useState(record?.endTime || '');

  if (!record) return null;

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

  const isFasting = record.type === 'fasting';

  const content = (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[90vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
        >
          {/* Handle */}
          <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full" />
          </div>

          {/* HEADER */}
          <div className="px-6 pt-2 pb-4 flex justify-between items-center bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0">
              <button
                onClick={() => { onDelete(record.id); onClose(); }}
                className="w-10 h-10 bg-white dark:bg-[#2C2C2E] rounded-full flex items-center justify-center text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
              >
                  <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex gap-3">
                  {isEditing ? (
                      <button onClick={handleSave} className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                          <Check className="w-5 h-5" />
                      </button>
                  ) : (
                      <button onClick={() => setIsEditing(true)} className="w-10 h-10 bg-white dark:bg-[#2C2C2E] text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-500/30 active:scale-95 transition-all">
                          <Edit3 className="w-5 h-5" />
                      </button>
                  )}

                  <button onClick={onClose} className="w-10 h-10 bg-gray-200/50 dark:bg-white/10 text-gray-500 dark:text-slate-400 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                      <X className="w-5 h-5" />
                  </button>
              </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto pb-safe px-4 space-y-4">

              {/* HERO CARD */}
              <div className="bg-white dark:bg-[#2C2C2E] rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 dark:from-blue-900/20 to-white dark:to-[#2C2C2E] pointer-events-none" />

                  {/* Иконка типа записи */}
                  <div className={cn(
                      "w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-lg rotate-3 relative z-10",
                      isFasting ? "bg-blue-600 dark:bg-blue-500 text-white" : "bg-purple-600 dark:bg-purple-500 text-white"
                  )}>
                      {isFasting ? <Trophy className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                  </div>

                  <h2 className="text-xl font-[900] text-slate-800 dark:text-white leading-tight relative z-10 max-w-[200px]">
                      {record.scheme}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mt-2 relative z-10 bg-white/50 dark:bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Calendar className="w-3 h-3" />
                      {dayjs(editedEnd).format('D MMMM YYYY')}
                  </div>

                  {/* Огромная цифра длительности */}
                  <div className="mt-8 mb-2 relative z-10">
                      <div className="flex items-baseline justify-center text-slate-800 dark:text-white">
                          <span className="text-7xl font-[900] tracking-tighter tabular-nums leading-none">
                              {hours}
                          </span>
                          <span className="text-lg font-bold text-slate-400 dark:text-slate-500 ml-1">ч</span>
                          {minutes > 0 && (
                              <>
                                  <span className="text-4xl font-[900] tracking-tighter tabular-nums leading-none ml-3 text-slate-300 dark:text-slate-600">
                                      {minutes}
                                  </span>
                                  <span className="text-lg font-bold text-slate-300 dark:text-slate-600 ml-1">м</span>
                              </>
                          )}
                      </div>
                  </div>
              </div>

              {/* TIMELINE / EDITING */}
              <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 pl-1">
                      Временной интервал
                  </h3>

                  <div className="relative pl-4 space-y-8">
                      {/* Линия */}
                      <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-white/10 rounded-full" />

                      {/* Начало */}
                      <div className="relative z-10 flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full bg-white dark:bg-[#2C2C2E] border-4 border-emerald-400 shadow-sm shrink-0" />
                          <div className="flex-1">
                              {isEditing ? (
                                  <NativeDatePicker
                                      label="Начало" icon={Sunrise}
                                      dateValue={editedStart} onChange={setEditedStart}
                                      disabled={false}
                                  />
                              ) : (
                                  <div className="flex justify-between items-center">
                                      <div>
                                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Начало</p>
                                          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{dayjs(editedStart).format('HH:mm')}</p>
                                      </div>
                                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-[#3A3A3C] px-2 py-1 rounded-lg">
                                          {dayjs(editedStart).format('D MMM')}
                                      </span>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Конец */}
                      <div className="relative z-10 flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-100 shadow-sm shrink-0" />
                          <div className="flex-1">
                              {isEditing ? (
                                  <NativeDatePicker
                                      label="Конец" icon={Moon}
                                      dateValue={editedEnd} onChange={setEditedEnd}
                                      disabled={false}
                                  />
                              ) : (
                                  <div className="flex justify-between items-center">
                                      <div>
                                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Завершение</p>
                                          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{dayjs(editedEnd).format('HH:mm')}</p>
                                      </div>
                                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-[#3A3A3C] px-2 py-1 rounded-lg">
                                          {dayjs(editedEnd).format('D MMM')}
                                      </span>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>

              {/* ACHIEVEMENTS (PHASES) */}
              {isFasting && passedPhases.length > 0 && (
                  <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-sm mb-8">
                      <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 pl-1">
                          Достигнутые этапы
                      </h3>
                      <div className="space-y-3">
                          {passedPhases.map((phase) => {
                              // Extract the text color from phase.color (e.g., "text-blue-600" from "bg-blue-100 text-blue-600")
                              const textColor = phase.color.split(' ').find(c => c.startsWith('text-')) || 'text-slate-600';
                              // Extract the bg color for the icon container (e.g., "bg-blue-50" from "bg-blue-100 text-blue-600")
                              const bgColor = phase.color.split(' ').find(c => c.startsWith('bg-'))?.replace('100', '50').replace('600', '50') || 'bg-slate-50';

                              const IconComponent = phase.icon;

                              return (
                                  <div key={phase.id} className="flex items-center gap-4 group">
                                      <div className={cn(
                                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                          bgColor
                                      )}>
                                          <IconComponent className={cn("w-5 h-5", textColor)} />
                                      </div>
                                      <div className="flex-1 border-b border-slate-50 dark:border-white/10 pb-3 group-last:border-0 group-last:pb-0">
                                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{phase.title}</h4>
                                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide mt-0.5">
                                              {phase.hoursStart} часов
                                          </p>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              )}

          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
