import { Sun, Moon, Monitor } from 'lucide-react';
import { SettingsShell } from './SettingsShell';
import { SettingsSection } from '../../components/ui/SettingsList';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

export const AppearanceSettingsPage = () => {
  const { mode, setMode } = useTheme();

  return (
    <SettingsShell
      title="Оформление"
      subtitle="Синхронизируется с темой Telegram при режиме Авто"
    >
      <div className="space-y-5">
        <SettingsSection title="Тема">
          <div className="rounded-[1.8rem] overflow-hidden border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 backdrop-blur-xl shadow-[var(--app-shadow-soft)] p-2">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', icon: Sun, label: 'Светлая' },
                { id: 'dark', icon: Moon, label: 'Тёмная' },
                { id: 'auto', icon: Monitor, label: 'Авто' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id as typeof mode)}
                  className={cn(
                    "py-3 rounded-[1.4rem] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wide",
                    mode === item.id
                      ? "bg-[color:var(--tg-surface)] text-[color:var(--tg-text)] shadow-[inset_0_0_0_1px_var(--tg-border)]"
                      : "hover:bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Примечание"
          description="Автоматический режим использует тему Telegram и системные настройки устройства."
        >
          <div className="rounded-[1.8rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 backdrop-blur-xl p-4 text-xs app-muted">
            Вы можете переключаться между темами в любой момент. Изменения сохраняются локально.
          </div>
        </SettingsSection>
      </div>
    </SettingsShell>
  );
};
