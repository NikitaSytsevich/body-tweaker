import { Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { SettingsShell } from './SettingsShell';
import { SettingsSection } from '../../components/ui/SettingsList';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

const modeMeta = {
  light: {
    label: 'Светлая',
    description: 'Стабильная светлая палитра независимо от Telegram',
    icon: Sun,
  },
  dark: {
    label: 'Тёмная',
    description: 'Контрастная тёмная палитра для вечернего использования',
    icon: Moon,
  },
  auto: {
    label: 'Авто',
    description: 'Подстраивается под тему Telegram и систему устройства',
    icon: Monitor,
  },
} as const;

export const AppearanceSettingsPage = () => {
  const { mode, theme, setMode } = useTheme();

  const activeMeta = modeMeta[mode];

  return (
    <SettingsShell
      title="Оформление"
      subtitle="Тема и визуальная адаптация"
    >
      <div className="space-y-5">
        <div className="app-panel rounded-[1.8rem] p-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400/20 to-blue-500/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] app-muted font-bold uppercase tracking-widest">Текущий режим</p>
              <p className="mt-1 text-lg font-black app-header">{activeMeta.label}</p>
              <p className="mt-1 text-xs app-muted">Фактическая тема интерфейса: {theme === 'dark' ? 'Тёмная' : 'Светлая'}</p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <SettingsSection title="Выбор темы">
          <div className="rounded-[1.8rem] overflow-hidden border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 backdrop-blur-xl shadow-[var(--app-shadow-soft)] p-2">
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(modeMeta) as Array<[keyof typeof modeMeta, (typeof modeMeta)[keyof typeof modeMeta]]>).map(([id, item]) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={cn(
                    'py-3 rounded-[1.4rem] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wide',
                    mode === id
                      ? 'bg-[color:var(--tg-surface)] text-[color:var(--tg-text)] shadow-[inset_0_0_0_1px_var(--tg-border)]'
                      : 'hover:bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)]'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Логика режима">
          <div className="rounded-[1.8rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 backdrop-blur-xl p-4 text-xs app-muted space-y-2">
            <p className="font-semibold app-header">{activeMeta.label}</p>
            <p>{activeMeta.description}</p>
            <p>Режим сохраняется локально и применяется при каждом запуске.</p>
          </div>
        </SettingsSection>
      </div>
    </SettingsShell>
  );
};
