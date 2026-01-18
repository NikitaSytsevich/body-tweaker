// src/app/modals/SettingsModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2, ShieldCheck, Download, Upload, X, Loader2, Smartphone } from 'lucide-react';
import { cn } from '../../utils/cn';

// Хуки и утилиты
import { useStorage } from '../../hooks/useStorage';
import { useAddToHomeScreen } from '../../hooks/useAddToHomeScreen';
import { 
  storageGet, 
  storageRemove, 
  storageGetJSON, 
  storageSetJSON, 
  storageSet 
} from '../../utils/storage';
import type { NotificationSettings } from '../../utils/types';
import WebApp from '@twa-dev/sdk';

// Компоненты
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ToastNotification } from '../../components/ui/ToastNotification';
import { InstallGuideModal } from './InstallGuideModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: Props) => {
  const user = WebApp.initDataUnsafe?.user;
  
  // Локальные состояния UI
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false); // Для лоадера на кнопках данных

  // 1. Асинхронные настройки (Cloud)
  const { 
    value: notifications, 
    setValue: setNotifications, 
    isLoading: isSettingsLoading 
  } = useStorage<NotificationSettings>('user_settings', { fasting: true });

  // 2. Логика PWA (Установка на экран)
  const { deferredPrompt, isIOS, isStandalone, promptInstall } = useAddToHomeScreen();
  
  // Показываем кнопку, если: (iOS ИЛИ есть промпт Android) И (не установлено как PWA)
  const canInstall = !isStandalone && (isIOS || !!deferredPrompt);

  // --- HANDLERS ---

  const toggleNotification = (e: React.MouseEvent) => {
      e.stopPropagation();
      setNotifications((prev) => ({ ...prev, fasting: !prev.fasting }));
  };

  const handleInstallClick = () => {
      if (isIOS) {
          setShowInstallGuide(true);
      } else if (deferredPrompt) {
          promptInstall();
      } else {
          // Фолбэк для десктопа или веб-версии Telegram
          alert('Функция установки доступна в мобильных браузерах (Safari, Chrome).');
      }
  };

  const handleReset = () => setShowResetConfirm(true);

  const confirmReset = async () => {
      setIsProcessing(true);
      try {
          await Promise.all([
              storageRemove('history_fasting'),
              storageRemove('user_settings'),
              storageRemove('fasting_startTime'),
              storageRemove('fasting_scheme'),
              storageRemove('user_name'),
              storageRemove('has_accepted_terms')
          ]);
          window.location.reload();
      } catch (e) {
          console.error("Reset failed", e);
          setIsProcessing(false);
      }
  };

  const handleExport = async () => {
      setIsProcessing(true);
      try {
          // Собираем данные параллельно для скорости
          const [history, settings, startTime, scheme, userName, terms] = await Promise.all([
              storageGetJSON('history_fasting', []),
              storageGetJSON('user_settings', { fasting: true }),
              storageGet('fasting_startTime'),
              storageGet('fasting_scheme'),
              storageGet('user_name'),
              storageGet('has_accepted_terms')
          ]);

          const backupData = {
              version: 1,
              date: new Date().toISOString(),
              data: {
                  history_fasting: history,
                  user_settings: settings,
                  fasting_startTime: startTime,
                  fasting_scheme: scheme,
                  user_name: userName,
                  has_accepted_terms: terms
              }
          };
          
          const jsonString = JSON.stringify(backupData, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `bodytweaker_backup_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setToastMessage({ title: 'Бэкап создан', message: 'Файл готов к сохранению' });
          setShowExportToast(true);
      } catch (e) {
          console.error("Export failed", e);
          setToastMessage({ title: 'Ошибка', message: 'Не удалось создать бэкап' });
          setShowExportToast(true);
      } finally {
          setIsProcessing(false);
      }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
          setIsProcessing(true);
          try {
              const content = e.target?.result as string;
              const parsed = JSON.parse(content);

              if (!parsed.data) throw new Error('Invalid backup format');
              const { data } = parsed;

              // Восстанавливаем данные
              const promises = [];
              if (data.history_fasting) promises.push(storageSetJSON('history_fasting', data.history_fasting));
              if (data.user_settings) promises.push(storageSetJSON('user_settings', data.user_settings));
              if (data.fasting_startTime) promises.push(storageSet('fasting_startTime', data.fasting_startTime));
              if (data.fasting_scheme) promises.push(storageSet('fasting_scheme', data.fasting_scheme));
              if (data.user_name) promises.push(storageSet('user_name', data.user_name));
              if (data.has_accepted_terms) promises.push(storageSet('has_accepted_terms', data.has_accepted_terms));
              
              await Promise.all(promises);

              alert('Данные восстановлены! Приложение будет перезагружено.');
              window.location.reload();
          } catch (error) {
              console.error(error);
              alert('Ошибка: Неверный формат файла бэкапа');
          } finally {
              setIsProcessing(false);
          }
      };
      reader.readAsText(file);
      event.target.value = ''; 
  };

  // Данные пользователя
  const firstName = user?.first_name || 'Гость';
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
      />

      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
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

            <div className="space-y-6 pb-6">
                
                {/* ПРОФИЛЬ */}
                <section>
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                             <div className="relative shrink-0">
                                {photoUrl ? (
                                    <img src={photoUrl} alt={firstName} className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-sm" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-slate-50 shadow-sm text-blue-600 font-black text-xl tracking-wider">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-[900] text-lg text-slate-800 leading-tight truncate">{firstName} {lastName}</h3>
                                <p className="text-sm font-medium text-slate-400 truncate">{username}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ПРИЛОЖЕНИЕ (Установка + Уведомления) */}
                <section>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Приложение</h4>
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        
                        {/* КНОПКА УСТАНОВКИ */}
                        {canInstall && (
                             <button 
                                onClick={handleInstallClick}
                                className="w-full flex items-center justify-between p-4 cursor-pointer active:bg-slate-50 transition-colors border-b border-slate-50"
                             >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg text-white">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-slate-800 block leading-tight">
                                            Установить приложение
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            Добавить на главный экран
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-slate-100 px-3 py-1.5 rounded-lg">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                                        {isIOS ? 'Инструкция' : 'Скачать'}
                                    </span>
                                </div>
                             </button>
                        )}

                        {/* УВЕДОМЛЕНИЯ */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Уведомления таймера</span>
                            </div>
                            
                            {isSettingsLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                            ) : (
                                <button 
                                    type="button"
                                    onClick={toggleNotification}
                                    className={cn("w-12 h-7 rounded-full relative transition-colors duration-300", notifications.fasting ? "bg-slate-800" : "bg-slate-200")}
                                >
                                    <div className={cn("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm", notifications.fasting ? "left-6" : "left-1")} />
                                </button>
                            )}
                        </div>

                    </div>
                </section>

                {/* ДАННЫЕ */}
                <section>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Данные</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleExport} disabled={isProcessing} className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50">
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-slate-400" />}
                            <span className="text-xs font-bold text-slate-600">Бэкап</span>
                        </button>
                        
                        <label className={cn("flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer active:scale-95", isProcessing && "opacity-50 pointer-events-none")}>
                            <input 
                                type="file" 
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                                disabled={isProcessing}
                            />
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-slate-400" />}
                            <span className="text-xs font-bold text-slate-600">Импорт</span>
                        </label>
                    </div>
                </section>

                {/* ФУТЕР (Центрированный) */}
                <div className="flex flex-col items-center gap-4 mt-8 pb-8">
                    <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 p-4 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-2xl border border-red-100/50 transition-colors text-sm font-bold active:scale-98">
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Сбросить все данные
                    </button>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                        <ShieldCheck className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-medium text-slate-400">Ver 2.0.0 (Cloud)</span>
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
        message="Удалить всю историю и настройки из облака?"
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

      {/* Модалка PWA (iOS) */}
      <InstallGuideModal 
        isOpen={showInstallGuide} 
        onClose={() => setShowInstallGuide(false)} 
      />
    </>
  );
};
