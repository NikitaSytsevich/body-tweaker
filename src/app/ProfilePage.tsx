// src/app/ProfilePage.tsx
import { useNavigate } from 'react-router-dom';
import { Sun, Smartphone, Database, ShieldCheck, Info, X } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { ProfileAvatar } from '../components/ui/ProfileAvatar';
import { SettingsSection, SettingsGroup, SettingsRow } from '../components/ui/SettingsList';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = WebApp.initDataUnsafe?.user;
  const firstName = user?.first_name || 'Гость';
  const username = user?.username ? `@${user.username}` : 'Локальный профиль';

  return (
    <div className="app-page px-4 pt-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full app-panel flex items-center justify-center app-muted hover:brightness-[0.98] transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-[900] app-header">Настройки</h1>
      </div>

      {/* USER CARD */}
      <div className="app-panel p-5 rounded-[2rem] flex items-center gap-4 mb-6">
        <div className="relative">
          <ProfileAvatar size="lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[color:var(--tg-surface)] rounded-full" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold app-header truncate">{firstName}</h3>
          <p className="text-sm font-medium app-muted truncate">{username}</p>
        </div>
      </div>

      <div className="space-y-5">
        <SettingsSection title="Основное">
          <SettingsGroup>
            <SettingsRow
              icon={Sun}
              label="Оформление"
              description="Тема и внешний вид"
              to="/profile/settings/appearance"
              iconBgClassName="bg-amber-100 dark:bg-amber-500/20"
              iconClassName="text-amber-600 dark:text-amber-400"
            />
            <SettingsRow
              icon={Smartphone}
              label="Приложение"
              description="Установка и устройство"
              to="/profile/settings/app"
              iconBgClassName="bg-violet-100 dark:bg-violet-500/20"
              iconClassName="text-violet-600 dark:text-violet-400"
            />
          </SettingsGroup>
        </SettingsSection>

        <SettingsSection title="Данные">
          <SettingsGroup>
            <SettingsRow
              icon={Database}
              label="Резервные копии"
              description="Экспорт, импорт, сброс"
              to="/profile/settings/data"
              iconBgClassName="bg-blue-100 dark:bg-blue-500/20"
              iconClassName="text-blue-600 dark:text-blue-400"
            />
          </SettingsGroup>
        </SettingsSection>

        <SettingsSection title="Правовые документы">
          <SettingsGroup>
            <SettingsRow
              icon={ShieldCheck}
              label="Политики и соглашения"
              description="Пользовательское соглашение, политика"
              to="/profile/settings/legal"
              iconBgClassName="bg-emerald-100 dark:bg-emerald-500/20"
              iconClassName="text-emerald-600 dark:text-emerald-400"
            />
          </SettingsGroup>
        </SettingsSection>

        <SettingsSection title="О проекте">
          <SettingsGroup>
            <SettingsRow
              icon={Info}
              label="О приложении"
              description="Команда, философия, контакты"
              to="/profile/settings/about"
              iconBgClassName="bg-slate-100 dark:bg-slate-500/20"
              iconClassName="text-slate-700 dark:text-slate-300"
            />
          </SettingsGroup>
        </SettingsSection>
      </div>

      <div className="mt-8 pt-6 flex justify-center opacity-40">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[color:var(--tg-glass)] rounded-full border border-[color:var(--tg-border)]">
          <ShieldCheck className="w-3 h-3 app-muted" />
          <span className="text-[10px] font-bold app-muted">Secure Storage</span>
        </div>
      </div>
    </div>
  );
};
