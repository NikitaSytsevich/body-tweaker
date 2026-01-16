import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2, ShieldCheck, Download, Upload, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { safeLocalStorageGet, safeLocalStorageClear, safeLocalStorageGetJSON, safeLocalStorageSetJSON, safeLocalStorageSet } from '../../utils/localStorage';
import type { NotificationSettings } from '../../utils/types';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ToastNotification } from '../../components/ui/ToastNotification';
import WebApp from '@twa-dev/sdk';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: Props) => {
  const user = WebApp.initDataUnsafe?.user;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });

  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>(
    'user_settings',
    { fasting: true }
  );

  const toggleNotification = (e: React.MouseEvent) => {
      e.stopPropagation();
      setNotifications((prev) => ({ ...prev, fasting: !prev.fasting }));
  };

  const handleReset = () => {
      setShowResetConfirm(true);
  };

  const confirmReset = () => {
      safeLocalStorageClear();
      window.location.reload();
  };

  // --- NEW: ЛОГИКА ЭКСПОРТА ---
  const handleExport = () => {
      try {
          // Собираем данные. 
          // Важно: мы берем данные через getJSON, то есть они уже расшифрованы
          const backupData = {
              version: 1, // Версия структуры бэкапа (на будущее)
              date: new Date().toISOString(),
              data: {
                  history_fasting: safeLocalStorageGetJSON('history_fasting', []),
                  user_settings: safeLocalStorageGetJSON('user_settings', { fasting: true }),
                  // Если таймер запущен, сохраняем его старт
                  fasting_startTime: safeLocalStorageGet('fasting_startTime'),
                  fasting_scheme: safeLocalStorageGet('fasting_scheme'),
                  user_name: safeLocalStorageGet('user_name'),
                  has_accepted_terms: safeLocalStorageGet('has_accepted_terms')
              }
          };
          
          const jsonString = JSON.stringify(backupData, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          
          // Создаем временную ссылку для скачивания
          const link = document.createElement('a');
          link.href = url;
          // Имя файла: bodytweaker_backup_2024-05-20.json
          link.download = `bodytweaker_backup_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setToastMessage({ title: 'Бэкап создан', message: 'Файл успешно сохранен на устройство' });
          setShowExportToast(true);
      } catch (e) {
          console.error("Export failed", e);
          setToastMessage({ title: 'Ошибка', message: 'Не удалось создать бэкап' });
          setShowExportToast(true);
      }
  };

  // --- NEW: ЛОГИКА ИМПОРТА ---
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const parsed = JSON.parse(content);

              // Простая валидация: проверяем наличие поля data
              if (!parsed.data) {
                  throw new Error('Invalid backup format');
              }

              const { data } = parsed;

              // Восстанавливаем данные
              if (data.history_fasting) safeLocalStorageSetJSON('history_fasting', data.history_fasting);
              if (data.user_settings) safeLocalStorageSetJSON('user_settings', data.user_settings);
              if (data.fasting_startTime) safeLocalStorageSet('fasting_startTime', data.fasting_startTime);
              if (data.fasting_scheme) safeLocalStorageSet('fasting_scheme', data.fasting_scheme);
              if (data.user_name) safeLocalStorageSet('user_name', data.user_name);
              if (data.has_accepted_terms) safeLocalStorageSet('has_accepted_terms', data.has_accepted_terms);

              alert('Данные успешно восстановлены! Приложение будет перезагружено.');
              window.location.reload();
          } catch (error) {
              console.error(error);
              alert('Ошибка: Неверный формат файла бэкапа');
          }
      };
      reader.readAsText(file);
      // Сбрасываем value инпута, чтобы можно было загрузить тот же файл повторно при ошибке
      event.target.value = ''; 
  };


  const firstName = user?.first_name || safeLocalStorageGet('user_name') || 'Гость';
  const lastName = user?.last_name || '';
  const username = user?.username ? `@${user.username}` : 'Локальный профиль';
  const photoUrl = user?.photo_url;
  const initials = (firstName[0] + (lastName[0] || '')).toUpperCase();

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        style={{ touchAction: 'none' }}
      />

      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] shrink-0" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-200/50 hover:bg-gray-200 rounded-full transition-colors z-50">
            <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex-1 overflow-y-auto pb-safe px-6 pt-2 overscroll-contain">
            
            <div className="mb-8 mt-2">
                <h2 className="text-3xl font-[900] text-slate-800 leading-tight">Настройки</h2>
                <p className="text-sm font-medium text-slate-400 mt-1">Персонализация</p>
            </div>

            <div className="space-y-6 pb-10">
                
                {/* ПРОФИЛЬ */}
                <section>
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative shrink-0">
                                {photoUrl ? (
                                    <img src={photoUrl} alt={firstName} className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-sm" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-slate-50 shadow-sm text-blue-600 font-black text-xl tracking-wider">
                                        {initials}
                                    </div>
                                )}
                                {user && <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-[900] text-lg text-slate-800 leading-tight truncate">{firstName} {lastName}</h3>
                                <p className="text-sm font-medium text-slate-400 truncate">{username}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* НАСТРОЙКИ */}
                <section>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Приложение</h4>
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Уведомления таймера</span>
                            </div>
                            
                            <button 
                                type="button"
                                onClick={toggleNotification}
                                className={cn("w-12 h-7 rounded-full relative transition-colors duration-300 focus:outline-none tap-highlight-transparent", notifications.fasting ? "bg-slate-800" : "bg-slate-200")}
                            >
                                <div className={cn("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm", notifications.fasting ? "left-6" : "left-1")} />
                            </button>
                        </div>

                    </div>
                </section>

                {/* ДАННЫЕ (UPDATED) */}
                <section>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Данные</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleExport} className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                            <Download className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-600">Бэкап</span>
                        </button>
                        
                        <label className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer active:scale-95">
                            <input 
                                type="file" 
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                            <Upload className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-600">Импорт</span>
                        </label>
                    </div>
                </section>

                <button onClick={handleReset} className="w-full mt-2 flex items-center justify-center gap-2 p-4 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-2xl border border-red-100/50 transition-colors text-sm font-bold active:scale-98">
                    <Trash2 className="w-4 h-4" />
                    Сбросить все данные
                </button>
                
                <div className="text-center pt-2 pb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                        <ShieldCheck className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-medium text-slate-400">Версия 1.0.4 (Secured)</span>
                    </div>
                </div>

            </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="Сброс данных"
        message="Вы уверены? Это удалит всю историю и настройки."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />

      <ToastNotification
        isVisible={showExportToast}
        title={toastMessage.title}
        message={toastMessage.message}
        onClose={() => setShowExportToast(false)}
      />
    </>
  );
};
