// src/app/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Info as InfoIcon,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Bell,
  Trash2,
  Download,
  Upload,
  Loader2,
  Smartphone,
  Sun,
  Moon,
  Monitor,
  X
} from 'lucide-react';
import { cn } from '../utils/cn';
import WebApp from '@twa-dev/sdk';

// Хуки
import { useAddToHomeScreen } from '../hooks/useAddToHomeScreen';
import { storageGet, storageRemove, storageGetJSON, storageSetJSON, storageSet } from '../utils/storage';
import type { NotificationSettings } from '../utils/types';
import { useTheme } from '../contexts/ThemeContext';

// Компоненты
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ToastNotification } from '../components/ui/ToastNotification';
import { InstallGuideModal } from './modals/InstallGuideModal';

// Команда
const TEAM = [
  {
    role: "Разработчик, Реабилитолог",
    name: "Никита Сыцевич",
    handle: "@nikita_sytsevich",
    url: "https://t.me/nikita_sytsevich",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    role: "Реабилитолог",
    name: "Александр Якимчик",
    handle: "@Alex_Yakimchyk",
    url: "https://t.me/Alex_Yakimchyk",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    role: "Реабилитолог",
    name: "Кирилл Бубнов",
    handle: "@bubnovzavaliebalo",
    url: "https://t.me/bubnovzavaliebalo",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20"
  },
  {
    role: "Инструктор-методист ЛФК",
    name: "Мария Сыцевич",
    handle: "@maria_sytsevich",
    url: "https://t.me/maria_sytsevich",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20"
  }
];

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = WebApp.initDataUnsafe?.user;
  const firstName = user?.first_name || 'Гость';
  const username = user?.username ? `@${user.username}` : '';
  const photoUrl = user?.photo_url;
  const [imageError, setImageError] = useState(false);

  const initials = firstName ? firstName.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-full bg-[#F2F2F7] dark:bg-[#1C1C1E] px-4 pt-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-[900] text-slate-800 dark:text-white">Профиль</h1>
      </div>

      {/* USER CARD */}
      <div className="bg-white dark:bg-[#2C2C2E] p-5 rounded-[2rem] shadow-sm flex items-center gap-4 mb-6">
        <div className="relative">
          {photoUrl && !imageError ? (
            <img
              src={photoUrl}
              alt="User"
              className="w-16 h-16 rounded-full border-4 border-slate-50 dark:border-white/5"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500">
              <span className="text-xl font-bold">{initials}</span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#2C2C2E] rounded-full" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{firstName}</h3>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{username || 'Локальный профиль'}</p>
        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="space-y-3">
        {/* Настройки */}
        <motion.button
          onClick={() => navigate('/profile/settings')}
          className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-[2rem] shadow-sm border border-blue-100 dark:border-blue-900/30 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <SettingsIcon className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Настройки</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Тема, уведомления, данные</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-blue-400 dark:text-blue-500" />
        </motion.button>

        {/* О проекте */}
        <motion.button
          onClick={() => navigate('/profile/about')}
          className="w-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-[2rem] shadow-sm border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <InfoIcon className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">О проекте</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Команда, философия, контакты</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-emerald-400 dark:text-emerald-500" />
        </motion.button>
      </div>

      {/* FOOTER */}
      <div className="mt-8 pt-8 flex justify-center opacity-40">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full">
          <ShieldCheck className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] font-bold text-slate-500">Secure Storage</span>
        </div>
      </div>
    </div>
  );
};

// Settings sub-page
export const SettingsSubPage = () => {
  const navigate = useNavigate();
  const user = WebApp.initDataUnsafe?.user;
  const { mode, setMode } = useTheme();

  // State
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  // Settings - синхронное состояние с async sync
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);

  // Загрузка настроек при монтировании
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const saved = await storageGetJSON<NotificationSettings>('user_settings', { fasting: true });
        setNotificationsEnabled(saved.fasting ?? true);
      } catch {
        setNotificationsEnabled(true);
      } finally {
        setIsNotificationsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  // Сохранение при изменении
  useEffect(() => {
    if (!isNotificationsLoading) {
      const saveNotifications = async () => {
        try {
          await storageSetJSON('user_settings', { fasting: notificationsEnabled });
        } catch (e) {
          console.error('Failed to save notification settings:', e);
        }
      };
      saveNotifications();
    }
  }, [notificationsEnabled, isNotificationsLoading]);

  // PWA
  const { deferredPrompt, isIOS, isStandalone, promptInstall } = useAddToHomeScreen();
  const isTelegramNativeInstallSupported = WebApp.isVersionAtLeast('8.0');
  const canInstall = !isStandalone && (isTelegramNativeInstallSupported || isIOS || !!deferredPrompt);

  // --- HANDLERS ---
  const toggleNotification = () => {
      if (!isNotificationsLoading) {
          setNotificationsEnabled(prev => !prev);
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
  const initials = firstName ? firstName.charAt(0).toUpperCase() : '?';

  return (
    <>
      <div className="h-full bg-[#F2F2F7] dark:bg-[#1C1C1E] flex flex-col">
        {/* HEADER */}
        <div className="px-6 pt-6 pb-2 shrink-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] z-20 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-[900] text-slate-800 dark:text-white">Настройки</h2>
            <div className="w-10" />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-6 pb-safe">

            {/* 1. ПРОФИЛЬ */}
            <div className="bg-white dark:bg-[#2C2C2E] p-4 rounded-[2rem] shadow-sm flex items-center gap-4">
                <div className="relative">
                    {photoUrl && !profileImageError ? (
                        <img
                            src={photoUrl}
                            alt="User"
                            className="w-16 h-16 rounded-full border-4 border-slate-50 dark:border-white/5"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={() => setProfileImageError(true)}
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500">
                            <span className="text-xl font-bold">{initials}</span>
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
                        "bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] shadow-sm flex items-center justify-between transition-transform cursor-pointer active:scale-[0.99]",
                        isNotificationsLoading && "opacity-70 cursor-wait"
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
                    {isNotificationsLoading ? (
                        <div className="w-12 h-7 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <div className={cn("w-12 h-7 rounded-full relative transition-colors duration-300", notificationsEnabled ? "bg-blue-500" : "bg-slate-200 dark:bg-white/10")}>
                            <div className={cn("w-6 h-6 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300", notificationsEnabled ? "translate-x-5.5" : "translate-x-0.5")} />
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
      </div>

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
  );
};

// About sub-page
export const AboutSubPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-[#F2F2F7] dark:bg-[#1C1C1E] flex flex-col">
      {/* HEADER */}
      <div className="px-6 pt-6 pb-2 shrink-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] z-20 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-[900] text-slate-800 dark:text-white">О проекте</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-8">

      {/* HERO */}
      <div className="relative h-48 overflow-hidden bg-emerald-50 dark:bg-[#0f291e] rounded-[2rem] mb-6">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] left-[-10%] w-[400px] h-[400px] bg-emerald-300/30 dark:bg-emerald-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-teal-200/40 dark:bg-teal-600/20 rounded-full blur-[60px]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3">
              <img src="/logo.svg?v=2" alt="Logo" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-[900] text-slate-800 dark:text-white">Body Tweaker</h3>
            <p className="text-emerald-700/80 dark:text-emerald-300/80 text-[10px] font-bold uppercase tracking-widest">
              Проверено на личном опыте
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-white dark:bg-[#2C2C2E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-4 h-4 fill-current" />
          <h3 className="text-xs font-bold uppercase tracking-wide">Наша философия</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Мы не теоретики. Вся методика построена на нашем многолетнем опыте работы с телом и восстановлением.
          Мы создали этот инструмент, чтобы делиться тем, что реально работает.
        </p>
      </div>

      {/* Team */}
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 pl-2">
          Команда проекта
        </h3>
        <div className="space-y-3">
          {TEAM.map((member) => {
            const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            return (
              <a
                key={member.name}
                href={member.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar with initials */}
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg", member.bg, member.color)}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-white text-[15px] leading-tight mb-0.5">
                      {member.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {member.role}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 pt-6 px-6 pb-8 flex flex-col items-center gap-6 border-t border-slate-100 dark:border-white/5">
        <div className="flex gap-3 w-full">
          <a
            href="https://github.com/NikitaSytsevich/body-tweaker"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-[#2C2C2E] rounded-2xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm text-xs font-bold active:scale-95"
          >
            Github
          </a>

          <a
            href="https://t.me/nikita_sytsevich"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-lg shadow-slate-900/20 dark:shadow-white/10 transition-colors text-xs font-bold active:scale-95"
          >
            Связаться
          </a>
        </div>

        <div className="text-center opacity-40">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
            v2.1.0
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};
