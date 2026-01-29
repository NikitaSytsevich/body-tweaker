// src/app/modals/SettingsModal.tsx
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Trash2, 
  Download, 
  Upload, 
  X, 
  Loader2, 
  Smartphone, 
  Sun, 
  Moon, 
  Monitor,
  UserCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';

// Хуки
import { useStorage } from '../../hooks/useStorage';
import { useAddToHomeScreen } from '../../hooks/useAddToHomeScreen';
import { storageGet, storageRemove, storageGetJSON, storageSetJSON, storageSet } from '../../utils/storage';
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

  // State
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Settings
  const { value: notifications, setValue: setNotifications, isLoading: isSettingsLoading } = 
    useStorage<NotificationSettings>('user_settings', { fasting: true });

  // PWA
  const { deferredPrompt, isIOS, isStandalone, promptInstall } = useAddToHomeScreen();
  const isTelegramNativeInstallSupported = WebApp.isVersionAtLeast('8.0');
  const canInstall = !isStandalone && (isTelegramNativeInstallSupported || isIOS || !!deferredPrompt);

  // --- HANDLERS ---
  const toggleNotification = () => {
      if (!isSettingsLoading) {
          setNotifications((prev) => ({ ...prev, fasting: !prev.fasting }));
      }
  };

  const handleInstallClick = () => {
      if (isTelegramNativeInstallSupported) {
          WebApp.addToHomeScreen();
      } else if (isIOS) {
          setShowInstallGuide(true);
      } else if (deferredPrompt) {
          promptInstall();
      } else {
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

          setToastMessage({ title: 'Бэкап создан', message: 'Файл сохранен' });
          setShowExportToast(true);
      } catch (e) {
          console.error("Export failed", e);
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
              if (!parsed.data) throw new Error('Invalid backup');
              const { data } = parsed;

              const promises = [];
              if (data.history_fasting) promises.push(storageSetJSON('history_fasting', data.history_fasting));
              if (data.user_settings) promises.push(storageSetJSON('user_settings', data.user_settings));
              if (data.fasting_startTime) promises.push(storageSet('fasting_startTime', data.fasting_startTime));
              if (data.fasting_scheme) promises.push(storageSet('fasting_scheme', data.fasting_scheme));
              
              await Promise.all(promises);
              window.location.reload();
          } catch (error) {
              alert('Ошибка формата файла');
          } finally {
              setIsProcessing(false);
          }
      };
      reader.readAsText(file);
      event.target.value = ''; 
  };

  // User Data
  const firstName = user?.first_name || 'Гость';
  const username = user?.username ? `@${user.username}` : '';
  const photoUrl = user?.photo_url;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[2.5rem] h-[92vh] shadow-2xl flex flex-col overflow-hidden max-w-md mx-auto"
          >
            {/* HEADER */}
            <div className="px-6 pt-6 pb-2 shrink-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] z-20 flex justify-between items-center">
                <h2 className="text-3xl font-[900] text-slate-800 dark:text-white">Настройки</h2>
                <button 
                    onClick={onClose} 
                    className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto pb-safe px-4 pt-2 space-y-6">
                
                {/* 1. ПРОФИЛЬ */}
                <div className="bg-white dark:bg-[#2C2C2E] p-4 rounded-[2rem] shadow-sm flex items-center gap-4">
                    <div className="relative">
                        {photoUrl ? (
                            <img src={photoUrl} alt="User" className="w-16 h-16 rounded-full border-4 border-slate-50 dark:border-white/5" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400">
                                <UserCircle2 className="w-8 h-8" />
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#2C2C2E] rounded-full" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{firstName}</h3>
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{username || 'Локальный профиль'}</p>
                    </div>
                </div>

                {/* 2. ВНЕШНИЙ ВИД (Theme) */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Оформление</h4>
                    <div className="bg-white dark:bg-[#2C2C2E] p-2 rounded-[2rem] shadow-sm flex gap-2">
                        {[
                            { id: 'light', icon: Sun, label: 'Светлая' },
                            { id: 'dark', icon: Moon, label: 'Тёмная' },
                            { id: 'auto', icon: Monitor, label: 'Авто' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setMode(item.id as any)}
                                className={cn(
                                    "flex-1 py-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 transition-all active:scale-95",
                                    mode === item.id 
                                        ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-inner" 
                                        : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400"
                                )}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. УВЕДОМЛЕНИЯ & PWA */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Приложение</h4>
                    
                    {/* Уведомления */}
                    <div 
                        onClick={toggleNotification}
                        className={cn(
                            "bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] shadow-sm flex items-center justify-between transition-transform cursor-pointer",
                            isSettingsLoading ? "opacity-70 cursor-wait" : "active:scale-[0.99]"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">Уведомления</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">О смене фаз голодания</p>
                            </div>
                        </div>
                        
                        {/* Лоадер или Тумблер */}
                        {isSettingsLoading ? (
                            <div className="w-12 h-7 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <div className={cn("w-12 h-7 rounded-full relative transition-colors duration-300", notifications.fasting ? "bg-blue-500" : "bg-slate-200 dark:bg-white/10")}>
                                <div className={cn("w-6 h-6 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300", notifications.fasting ? "translate-x-5.5" : "translate-x-0.5")} />
                            </div>
                        )}
                    </div>

                    {/* Установка PWA */}
                    {canInstall && (
                        <div 
                            onClick={handleInstallClick}
                            className="bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] shadow-sm flex items-center justify-between active:scale-[0.99] transition-transform cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">Установить App</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">На главный экран</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>
                    )}
                </div>

                {/* 4. БЭКАП И СБРОС */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Данные</h4>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button onClick={handleExport} disabled={isProcessing} className="bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] flex flex-col items-center gap-2 shadow-sm border border-slate-100 dark:border-white/5 active:scale-95 transition-all disabled:opacity-50">
                            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : <Download className="w-6 h-6 text-slate-600 dark:text-slate-300" />}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Бэкап</span>
                        </button>
                        <label className={cn("bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] flex flex-col items-center gap-2 shadow-sm border border-slate-100 dark:border-white/5 active:scale-95 transition-all cursor-pointer", isProcessing && "opacity-50 pointer-events-none")}>
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" disabled={isProcessing} />
                            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : <Upload className="w-6 h-6 text-slate-600 dark:text-slate-300" />}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Импорт</span>
                        </label>
                    </div>

                    <button 
                        onClick={handleReset}
                        className="w-full p-4 rounded-[1.8rem] bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors active:scale-95"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-bold text-sm">Сбросить все данные</span>
                    </button>
                </div>

                {/* FOOTER INFO */}
                <div className="pt-4 pb-8 flex justify-center opacity-40">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500">Secure Storage</span>
                    </div>
                </div>

            </div>
          </motion.div>

          <ConfirmModal
            isOpen={showResetConfirm}
            onClose={() => setShowResetConfirm(false)}
            onConfirm={confirmReset}
            title="Удаление данных"
            message="Это действие необратимо удалит всю историю и настройки."
            confirmText="Да, удалить"
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
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
