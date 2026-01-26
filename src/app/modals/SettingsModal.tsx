// src/app/modals/SettingsModal.tsx
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, ShieldCheck, Download, Upload, X, Loader2, Smartphone, Sun, Moon } from 'lucide-react';
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
import { useTheme } from '../../contexts/ThemeContext';

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
  const { mode, setMode } = useTheme();

  // Состояния UI
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Асинхронные настройки (Cloud)
  const { 
    value: notifications, 
    setValue: setNotifications, 
    isLoading: isSettingsLoading 
  } = useStorage<NotificationSettings>('user_settings', { fasting: true });

  // 2. Логика PWA (Browser & Telegram)
  const { deferredPrompt, isIOS, isStandalone, promptInstall } = useAddToHomeScreen();
  
  // Проверяем поддержку нативного метода в Telegram (v8.0+)
  const isTelegramNativeInstallSupported = WebApp.isVersionAtLeast('8.0');

  // Условие показа кнопки установки:
  // (Telegram Native ИЛИ iOS ИЛИ Android Prompt) И (Не установлено)
  const canInstall = !isStandalone && (isTelegramNativeInstallSupported || isIOS || !!deferredPrompt);

  // --- HANDLERS ---

  const toggleNotification = (e: React.MouseEvent) => {
      e.stopPropagation();
      setNotifications((prev) => ({ ...prev, fasting: !prev.fasting }));
  };

  const handleInstallClick = () => {
      // 1. Приоритет: Нативный метод Telegram
      if (isTelegramNativeInstallSupported) {
          WebApp.addToHomeScreen();
          return;
      }

      // 2. Фолбэки для браузеров
      if (isIOS) {
          setShowInstallGuide(true);
      } else if (deferredPrompt) {
          promptInstall();
      } else {
          // Если открыто в старом Telegram или Desktop
          alert('Функция установки доступна в мобильных браузерах или обновите Telegram.');
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

  const content = (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      />

      {/* Modal Sheet */}
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[85vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
      >
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] shrink-0 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full" />
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-200/50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors z-50">
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
        </button>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pb-safe px-6 pt-2 overscroll-contain">

            <div className="mb-8 mt-2">
                <h2 className="text-3xl font-[900] text-slate-800 dark:text-white leading-tight">Настройки</h2>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">Персонализация</p>
            </div>

            <div className="space-y-6 pb-6">
                
                {/* ПРОФИЛЬ */}
                <section>
                    <div className="bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 rounded-[2rem] p-5 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                             <div className="relative shrink-0">
                                {photoUrl ? (
                                    <img src={photoUrl} alt={firstName} className="w-16 h-16 rounded-full border-4 border-slate-50 dark:border-white/10 shadow-sm" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-indigo-100 dark:to-indigo-900/30 flex items-center justify-center border-4 border-slate-50 dark:border-white/10 shadow-sm text-blue-600 dark:text-blue-400 font-black text-xl tracking-wider">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-[900] text-lg text-slate-800 dark:text-white leading-tight truncate">{firstName} {lastName}</h3>
                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 truncate">{username}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ПРИЛОЖЕНИЕ */}
                <section>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Приложение</h4>
                    <div className="bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">

                        {/* КНОПКА УСТАНОВКИ */}
                        {canInstall && (
                             <button
                                onClick={handleInstallClick}
                                className="w-full flex items-center justify-between p-4 cursor-pointer active:bg-slate-50 dark:active:bg-[#3A3A3C] transition-colors border-b border-slate-50 dark:border-white/5"
                             >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 dark:bg-slate-100 rounded-lg text-white dark:text-slate-900">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-slate-800 dark:text-white block leading-tight">
                                            Установить приложение
                                        </span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                            Добавить на главный экран
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-slate-100 dark:bg-[#3A3A3C] px-3 py-1.5 rounded-lg">
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                        {isTelegramNativeInstallSupported ? 'Добавить' : (isIOS ? 'Инструкция' : 'Скачать')}
                                    </span>
                                </div>
                             </button>
                        )}

                        {/* УВЕДОМЛЕНИЯ */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500 dark:text-blue-400">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Уведомления таймера</span>
                            </div>

                            {isSettingsLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-slate-300 dark:text-slate-600" />
                            ) : (
                                <button
                                    type="button"
                                    onClick={toggleNotification}
                                    className={cn("w-12 h-7 rounded-full relative transition-colors duration-300", notifications.fasting ? "bg-slate-800 dark:bg-slate-100" : "bg-slate-200 dark:bg-[#3A3A3C]")}
                                >
                                    <div className={cn("w-5 h-5 bg-white dark:bg-slate-900 rounded-full absolute top-1 transition-transform duration-300 shadow-sm", notifications.fasting ? "left-6" : "left-1")} />
                                </button>
                            )}
                        </div>

                    </div>
                </section>

                {/* ТЕМА */}
                <section>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Оформление</h4>
                    <div className="bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-500 dark:text-amber-400">
                                    {mode === 'light' ? <Sun className="w-4 h-4" /> : mode === 'dark' ? <Moon className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                                </div>
                                <div className="text-left">
                                    <span className="text-sm font-bold text-slate-800 dark:text-white block leading-tight">
                                        Тема приложения
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                        {mode === 'light' ? 'Светлая' : mode === 'dark' ? 'Тёмная' : 'Авто'}
                                    </span>
                                </div>
                            </div>

                            {/* Segmented Control */}
                            <div className="flex bg-slate-100 dark:bg-[#3A3A3C] rounded-lg p-1 gap-1">
                                <button
                                    onClick={() => setMode('light')}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                                        mode === 'light'
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <Sun className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setMode('dark')}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                                        mode === 'dark'
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <Moon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setMode('auto')}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                                        mode === 'auto'
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    AUTO
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ДАННЫЕ */}
                <section>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Данные</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleExport} disabled={isProcessing} className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#3A3A3C] transition-colors shadow-sm active:scale-95 disabled:opacity-50">
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Бэкап</span>
                        </button>

                        <label className={cn("flex items-center justify-center gap-2 p-4 bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#3A3A3C] transition-colors shadow-sm cursor-pointer active:scale-95", isProcessing && "opacity-50 pointer-events-none")}>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                                disabled={isProcessing}
                            />
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Импорт</span>
                        </label>
                    </div>
                </section>

                {/* ФУТЕР (Центрированный) */}
                <div className="flex flex-col items-center gap-4 mt-8 pb-8">
                    <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 p-4 text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl border border-red-100/50 dark:border-red-900/30 transition-colors text-sm font-bold active:scale-98">
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Сбросить все данные
                    </button>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-[#3A3A3C] rounded-full border border-slate-100 dark:border-white/10">
                        <ShieldCheck className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Ver 2.0.1 (Cloud)</span>
                    </div>
                </div>

            </div>
        </div>
      </motion.div>

      {/* Модальные окна (вне структуры шторки для правильного z-index) */}
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

      <InstallGuideModal 
        isOpen={showInstallGuide} 
        onClose={() => setShowInstallGuide(false)} 
      />
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
