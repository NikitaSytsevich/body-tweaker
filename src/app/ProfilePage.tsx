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
    <div className="min-h-full bg-[#F2F2F7] dark:bg-[#1C1C1E] px-4 pt-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2C2E] border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-[900] text-slate-800 dark:text-white">Настройки</h1>
      </div>

      {/* USER CARD */}
      <div className="bg-white dark:bg-[#2C2C2E] p-5 rounded-[2rem] shadow-sm flex items-center gap-4 mb-6">
        <div className="relative">
          <ProfileAvatar size="lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#2C2C2E] rounded-full" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">{firstName}</h3>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 truncate">{username}</p>
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
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full">
          <ShieldCheck className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] font-bold text-slate-500">Secure Storage</span>
        </div>
      </div>
    </div>
  );
};
