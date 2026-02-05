import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Trash2, Edit3, Check, Sunrise, Moon, Clock, Trophy } from 'lucide-react';
import { FASTING_PHASES, getPhaseSoftBgClasses, getPhaseTextClasses } from '../../fasting/data/stages';
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

  const rawDurationSeconds = dayjs(editedEnd).diff(dayjs(editedStart), 'second');
  const durationSeconds = Math.max(rawDurationSeconds, 0);
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  
  const passedPhases = FASTING_PHASES.filter(p => (durationSeconds / 3600) >= p.hoursStart);

  const handleSave = () => {
    if (rawDurationSeconds <= 0) {
      alert('Время окончания должно быть позже времени начала');
      return;
    }
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
      <>
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] animate-fade-in"
        />

        {/* Modal Sheet */}
        <div className="fixed bottom-0 left-0 right-0 z-[101] app-surface rounded-t-[2.5rem] h-[90vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto border-t border-[color:var(--tg-border)] backdrop-blur-2xl animate-sheet-in">
          {/* Handle */}
          <div className="w-full flex justify-center pt-3 pb-2 shrink-0" onClick={onClose}>
            <div className="w-12 h-1.5 bg-[color:var(--tg-border)] rounded-full" />
          </div>

          {/* HEADER */}
          <div className="px-6 pt-2 pb-4 flex justify-between items-center shrink-0 border-b border-[color:var(--tg-border)]">
              <button
                onClick={() => { onDelete(record.id); onClose(); }}
                className="w-10 h-10 bg-[color:var(--tg-glass)] rounded-full flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm border border-[color:var(--tg-border)]"
              >
                  <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex gap-3">
                  {isEditing ? (
                      <button onClick={handleSave} className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                          <Check className="w-5 h-5" />
                      </button>
                  ) : (
                      <button onClick={() => setIsEditing(true)} className="w-10 h-10 bg-[color:var(--tg-glass)] text-blue-600 rounded-full flex items-center justify-center shadow-sm border border-[color:var(--tg-border)] hover:border-blue-300 active:scale-95 transition-all">
                          <Edit3 className="w-5 h-5" />
                      </button>
                  )}

                  <button onClick={onClose} className="w-10 h-10 bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] rounded-full flex items-center justify-center hover:bg-[color:var(--tg-glass-strong)] transition-colors border border-[color:var(--tg-border)]">
                      <X className="w-5 h-5" />
                  </button>
              </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto pb-safe px-4 space-y-4">

              {/* HERO CARD */}
              <div className="app-card rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">

                  {/* Иконка типа записи */}
                  <div className={cn(
                      "w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-lg rotate-3 relative z-10",
                      isFasting ? "bg-blue-600 dark:bg-blue-500 text-white" : "bg-purple-600 dark:bg-purple-500 text-white"
                  )}>
                      {isFasting ? <Trophy className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                  </div>

                  <h2 className="text-xl font-[900] app-header leading-tight relative z-10 max-w-[200px]">
                      {record.scheme}
                  </h2>
                  <div className="flex items-center gap-2 app-muted text-xs font-bold uppercase tracking-wider mt-2 relative z-10 bg-[color:var(--tg-glass)] px-3 py-1 rounded-full backdrop-blur-sm">
                      <Calendar className="w-3 h-3" />
                      {dayjs(editedEnd).format('D MMMM YYYY')}
                  </div>

                  {/* Огромная цифра длительности */}
                  <div className="mt-8 mb-2 relative z-10">
                      <div className="flex items-baseline justify-center app-header">
                          <span className="text-7xl font-[900] tracking-tighter tabular-nums leading-none">
                              {hours}
                          </span>
                          <span className="text-lg font-bold app-muted ml-1">ч</span>
                          {minutes > 0 && (
                              <>
                                  <span className="text-4xl font-[900] tracking-tighter tabular-nums leading-none ml-3 text-[color:var(--tg-muted)]">
                                      {minutes}
                                  </span>
                                  <span className="text-lg font-bold text-[color:var(--tg-muted)] ml-1">м</span>
                              </>
                          )}
                      </div>
                  </div>
              </div>

              {/* TIMELINE / EDITING */}
              <div className="app-card rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-[10px] font-bold app-muted uppercase tracking-widest mb-6 pl-1">
                      Временной интервал
                  </h3>

                  <div className="relative pl-4 space-y-8">
                      {/* Линия */}
                      <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-[color:var(--tg-border)] rounded-full" />

                      {/* Начало */}
                      <div className="relative z-10 flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full bg-[color:var(--tg-surface)] border-4 border-emerald-400 shadow-sm shrink-0" />
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
                                          <p className="text-[10px] font-bold app-muted uppercase">Начало</p>
                                          <p className="text-lg font-bold app-header">{dayjs(editedStart).format('HH:mm')}</p>
                                      </div>
                                      <span className="text-xs app-muted font-medium bg-[color:var(--tg-glass)] px-2 py-1 rounded-lg">
                                          {dayjs(editedStart).format('D MMM')}
                                      </span>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Конец */}
                      <div className="relative z-10 flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full bg-[color:var(--tg-text)] shadow-sm shrink-0" />
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
                                          <p className="text-[10px] font-bold app-muted uppercase">Завершение</p>
                                          <p className="text-lg font-bold app-header">{dayjs(editedEnd).format('HH:mm')}</p>
                                      </div>
                                      <span className="text-xs app-muted font-medium bg-[color:var(--tg-glass)] px-2 py-1 rounded-lg">
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
                  <div className="app-card rounded-[2rem] p-6 shadow-sm mb-8">
                      <h3 className="text-[10px] font-bold app-muted uppercase tracking-widest mb-4 pl-1">
                          Достигнутые этапы
                      </h3>
                      <div className="space-y-3">
                          {passedPhases.map((phase) => {
                              const textColor = getPhaseTextClasses(phase);
                              const bgColor = getPhaseSoftBgClasses(phase);

                              const IconComponent = phase.icon;

                              return (
                                  <div key={phase.id} className="flex items-center gap-4 group">
                                      <div className={cn(
                                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                          bgColor
                                      )}>
                                          <IconComponent className={cn("w-5 h-5", textColor)} />
                                      </div>
                                      <div className="flex-1 border-b border-[color:var(--tg-border)] pb-3 group-last:border-0 group-last:pb-0">
                                          <h4 className="text-sm font-bold app-header">{phase.title}</h4>
                                          <p className="text-[10px] app-muted font-bold uppercase tracking-wide mt-0.5">
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
        </div>
      </>
  );

  return createPortal(content, document.body);
};
