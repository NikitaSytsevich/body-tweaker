import { Smartphone } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { SettingsShell } from './SettingsShell';
import { SettingsSection, SettingsGroup, SettingsRow } from '../../components/ui/SettingsList';
import { useAddToHomeScreen } from '../../hooks/useAddToHomeScreen';
import { InstallGuideModal } from '../modals/InstallGuideModal';
import { useState } from 'react';

export const AppSettingsPage = () => {
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { deferredPrompt, isIOS, isStandalone, promptInstall } = useAddToHomeScreen();
  const isTelegramNativeInstallSupported = WebApp.isVersionAtLeast('8.0');
  const canInstall = !isStandalone && (isTelegramNativeInstallSupported || isIOS || !!deferredPrompt);

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

  const installValue = isStandalone
    ? 'Установлено'
    : canInstall
      ? 'Доступно'
      : 'Недоступно';

  return (
    <>
      <SettingsShell title="Приложение" subtitle="Установка и параметры устройства">
        <div className="space-y-5">
          <SettingsSection title="Установка">
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
            </SettingsGroup>
          </SettingsSection>

          <SettingsSection
            title="Подсказка"
            description="После установки приложение запускается в полноэкранном режиме."
          >
          <div className="rounded-[1.8rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 backdrop-blur-xl p-4 text-xs app-muted">
            Для Android установка доступна напрямую, для iOS нужно открыть меню «Поделиться» и выбрать «На экран Домой».
          </div>
          </SettingsSection>
        </div>
      </SettingsShell>

      <InstallGuideModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
      />
    </>
  );
};
