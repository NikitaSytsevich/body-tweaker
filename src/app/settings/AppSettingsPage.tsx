import { useEffect, useMemo, useState } from 'react';
import { Smartphone, ShieldCheck, Wifi, ScanLine, Loader2, CloudUpload, RefreshCw } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { SettingsShell } from './SettingsShell';
import { SettingsSection, SettingsGroup, SettingsRow } from '../../components/ui/SettingsList';
import { useAddToHomeScreen } from '../../hooks/useAddToHomeScreen';
import { InstallGuideModal } from '../modals/InstallGuideModal';
import { ToastNotification } from '../../components/ui/ToastNotification';
import { flushCloudQueue } from '../../utils/storage';

const platformLabels: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  macos: 'macOS',
  tdesktop: 'Telegram Desktop',
  weba: 'Telegram WebA',
  webk: 'Telegram WebK',
  web: 'Web',
};

export const AppSettingsPage = () => {
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRequestingFullscreen, setIsRequestingFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));

  const { deferredPrompt, isIOS, isStandalone, promptInstall } = useAddToHomeScreen();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isTelegramNativeInstallSupported = useMemo(() => {
    try {
      return WebApp.isVersionAtLeast('8.0');
    } catch {
      return false;
    }
  }, []);

  const canInstall = !isStandalone && (isTelegramNativeInstallSupported || isIOS || !!deferredPrompt);

  const installValue = isStandalone
    ? 'Установлено'
    : canInstall
      ? 'Доступно'
      : 'Недоступно';

  const appPlatform = useMemo(() => {
    const raw = WebApp.platform ?? 'web';
    return platformLabels[raw] ?? raw;
  }, []);

  const canRequestFullscreen = useMemo(() => {
    try {
      return Boolean(WebApp.requestFullscreen) && WebApp.isVersionAtLeast('8.0');
    } catch {
      return false;
    }
  }, []);

  const showFeedback = (title: string, message: string) => {
    setToastMessage({ title, message });
    setShowToast(true);
  };

  const handleInstallClick = () => {
    if (isTelegramNativeInstallSupported) {
      try {
        WebApp.addToHomeScreen();
        showFeedback('Установка запрошена', 'Подтвердите действие в интерфейсе Telegram.');
      } catch {
        showFeedback('Не удалось открыть установку', 'Попробуйте позже или используйте браузерный способ.');
      }
      return;
    }

    if (isIOS) {
      setShowInstallGuide(true);
      return;
    }

    if (deferredPrompt) {
      void promptInstall().then(() => {
        showFeedback('Запрос отправлен', 'Подтвердите установку приложения.');
      });
      return;
    }

    showFeedback('Функция недоступна', 'Установка доступна в мобильных браузерах и Telegram 8.0+.');
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      const ok = await flushCloudQueue();
      if (ok) {
        showFeedback('Синхронизация завершена', 'Локальные изменения отправлены в облако.');
      } else {
        showFeedback('Синхронизация недоступна', 'Проверьте интернет и повторите попытку.');
      }
    } catch (error) {
      console.error('Cloud sync failed', error);
      showFeedback('Ошибка синхронизации', 'Не удалось синхронизировать данные.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRequestFullscreen = () => {
    if (!canRequestFullscreen) {
      showFeedback('Недоступно', 'Полноэкранный режим поддерживается в Telegram 8.0+.');
      return;
    }

    setIsRequestingFullscreen(true);
    try {
      WebApp.requestFullscreen?.();
      showFeedback('Полноэкранный режим', 'Запрос отправлен в Telegram.');
    } catch {
      showFeedback('Не удалось включить', 'Попробуйте снова через несколько секунд.');
    } finally {
      setTimeout(() => setIsRequestingFullscreen(false), 300);
    }
  };

  return (
    <>
      <SettingsShell title="Приложение" subtitle="Устройство, установка и синхронизация">
        <div className="space-y-5">
          <SettingsSection title="Состояние">
            <div className="grid grid-cols-2 gap-2">
              <div className="app-panel rounded-[1.4rem] p-4">
                <div className="text-[10px] app-muted font-bold uppercase tracking-widest mb-1">Платформа</div>
                <p className="text-base font-black app-header">{appPlatform}</p>
              </div>

              <div className="app-panel rounded-[1.4rem] p-4">
                <div className="text-[10px] app-muted font-bold uppercase tracking-widest mb-1">Сеть</div>
                <p className="text-base font-black app-header">{isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Действия">
            <SettingsGroup>
              <SettingsRow
                icon={Smartphone}
                label="Установить на главный экран"
                description="Быстрый доступ без браузера"
                onClick={canInstall ? handleInstallClick : undefined}
                value={installValue}
                disabled={!canInstall}
                iconBgClassName="bg-purple-100 dark:bg-purple-500/20"
                iconClassName="text-purple-600 dark:text-purple-400"
              />

              <SettingsRow
                icon={ScanLine}
                label="Полноэкранный режим"
                description="Скрывает системные панели Telegram"
                onClick={handleRequestFullscreen}
                value={canRequestFullscreen ? 'Доступно' : 'Недоступно'}
                right={isRequestingFullscreen ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                disabled={isRequestingFullscreen}
                iconBgClassName="bg-cyan-100 dark:bg-cyan-500/20"
                iconClassName="text-cyan-600 dark:text-cyan-400"
              />

              <SettingsRow
                icon={CloudUpload}
                label="Синхронизировать облако"
                description="Отправить локальные изменения"
                onClick={handleCloudSync}
                value={isOnline ? 'Можно' : 'Нет сети'}
                right={isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                disabled={isSyncing || !isOnline}
                iconBgClassName="bg-blue-100 dark:bg-blue-500/20"
                iconClassName="text-blue-600 dark:text-blue-400"
              />
            </SettingsGroup>
          </SettingsSection>

          <SettingsSection title="Подсказка">
            <div className="rounded-[1.8rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 backdrop-blur-xl p-4 text-xs app-muted space-y-2">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                После установки приложение открывается быстрее и работает стабильнее.
              </p>
              <p className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-500" />
                Если вы офлайн, изменения сохраняются локально и синхронизируются позже.
              </p>
            </div>
          </SettingsSection>
        </div>
      </SettingsShell>

      <InstallGuideModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
      />

      <ToastNotification
        isVisible={showToast}
        title={toastMessage.title}
        message={toastMessage.message}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};
