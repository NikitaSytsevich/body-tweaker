import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Sun,
  Smartphone,
  Database,
  ShieldCheck,
  Info,
  X,
  Activity,
  Paintbrush,
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { ProfileAvatar } from '../components/ui/ProfileAvatar';
import { SettingsSection, SettingsGroup, SettingsRow } from '../components/ui/SettingsList';
import { useSettingsOverview } from './settings/useSettingsOverview';

interface SettingsMenuItem {
  icon: LucideIcon;
  label: string;
  description: string;
  to: string;
  value?: string;
  iconBgClassName?: string;
  iconClassName?: string;
  tone?: 'default' | 'danger';
}

interface SettingsMenuSection {
  title: string;
  items: SettingsMenuItem[];
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = WebApp.initDataUnsafe?.user;
  const firstName = user?.first_name || 'Гость';
  const username = user?.username ? `@${user.username}` : 'Локальный профиль';

  const overview = useSettingsOverview();

  const sections = useMemo<SettingsMenuSection[]>(() => {
    const dataValue = overview.historyCount > 0 ? `${overview.historyCount} записей` : 'Пусто';

    return [
      {
        title: 'Основное',
        items: [
          {
            icon: Sun,
            label: 'Оформление',
            description: `Активный режим: ${overview.themeLabel}`,
            to: '/profile/settings/appearance',
            value: overview.themeLabel,
            iconBgClassName: 'bg-amber-100 dark:bg-amber-500/20',
            iconClassName: 'text-amber-600 dark:text-amber-400',
          },
          {
            icon: Smartphone,
            label: 'Приложение',
            description: `Установка: ${overview.installLabel.toLowerCase()}`,
            to: '/profile/settings/app',
            value: overview.installLabel,
            iconBgClassName: 'bg-violet-100 dark:bg-violet-500/20',
            iconClassName: 'text-violet-600 dark:text-violet-400',
          },
        ],
      },
      {
        title: 'Данные',
        items: [
          {
            icon: Database,
            label: 'Резервные копии',
            description: `Последняя активность: ${overview.lastActivityLabel}`,
            to: '/profile/settings/data',
            value: dataValue,
            iconBgClassName: 'bg-blue-100 dark:bg-blue-500/20',
            iconClassName: 'text-blue-600 dark:text-blue-400',
          },
        ],
      },
      {
        title: 'Документы',
        items: [
          {
            icon: ShieldCheck,
            label: 'Политики и соглашения',
            description: overview.legalAccepted
              ? 'Согласие с условиями сохранено'
              : 'Рекомендуем проверить актуальные документы',
            to: '/profile/settings/legal',
            value: overview.legalAccepted ? 'ОК' : 'Проверить',
            tone: overview.legalAccepted ? 'default' : 'danger',
            iconBgClassName: overview.legalAccepted
              ? 'bg-emerald-100 dark:bg-emerald-500/20'
              : 'bg-rose-100 dark:bg-rose-500/20',
            iconClassName: overview.legalAccepted
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400',
          },
        ],
      },
      {
        title: 'О проекте',
        items: [
          {
            icon: Info,
            label: 'О приложении',
            description: 'Команда, философия и каналы связи',
            to: '/profile/settings/about',
            value: 'Инфо',
            iconBgClassName: 'bg-slate-100 dark:bg-slate-500/20',
            iconClassName: 'text-slate-700 dark:text-slate-300',
          },
        ],
      },
    ];
  }, [overview.historyCount, overview.installLabel, overview.lastActivityLabel, overview.legalAccepted, overview.themeLabel]);

  return (
    <div className="app-page h-full overflow-y-auto scrollbar-hide px-4 pt-4 pb-24">
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

      <div className="app-panel p-5 rounded-[2rem] mb-6 relative overflow-hidden">
        <div className="absolute -top-14 -right-16 w-44 h-44 rounded-full bg-gradient-to-br from-cyan-400/25 to-emerald-400/15 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="relative">
            <ProfileAvatar size="lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[color:var(--tg-surface)] rounded-full" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black app-header truncate leading-tight">{firstName}</h3>
            <p className="text-sm app-muted truncate">{username}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)]">
                <Paintbrush className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-semibold app-muted">Тема: {overview.themeLabel}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)]">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-semibold app-muted">{overview.lastActivityLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {sections.map((section) => (
          <SettingsSection key={section.title} title={section.title}>
            <SettingsGroup>
              {section.items.map((item) => (
                <SettingsRow
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  description={item.description}
                  to={item.to}
                  value={item.value}
                  iconBgClassName={item.iconBgClassName}
                  iconClassName={item.iconClassName}
                  tone={item.tone}
                />
              ))}
            </SettingsGroup>
          </SettingsSection>
        ))}
      </div>
    </div>
  );
};
