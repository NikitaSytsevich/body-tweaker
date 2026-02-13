import { ChevronRight, Github, Send, Shield, Users2 } from 'lucide-react';
import { SettingsShell } from './SettingsShell';
import { cn } from '../../utils/cn';

const TEAM = [
  {
    role: 'Разработчик, Реабилитолог',
    name: 'Никита Сыцевич',
    handle: '@nikita_sytsevich',
    url: 'https://t.me/nikita_sytsevich',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    role: 'Реабилитолог',
    name: 'Александр Якимчик',
    handle: '@Alex_Yakimchyk',
    url: 'https://t.me/Alex_Yakimchyk',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    role: 'Реабилитолог',
    name: 'Кирилл Бубнов',
    handle: '@bubnovzavaliebalo',
    url: 'https://t.me/bubnovzavaliebalo',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    role: 'Инструктор-методист ЛФК',
    name: 'Мария Сыцевич',
    handle: '@maria_sytsevich',
    url: 'https://t.me/maria_sytsevich',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
];

export const AboutSettingsPage = () => {
  return (
    <SettingsShell title="О проекте" subtitle="Команда и контакты">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[var(--app-shadow-card)] p-6">
          <div className="absolute inset-0">
            <div className="absolute top-[-40%] left-[-18%] w-[360px] h-[360px] bg-cyan-300/18 dark:bg-cyan-500/12 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-35%] right-[-18%] w-[320px] h-[320px] bg-blue-300/16 dark:bg-blue-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-1.5">
              <Shield className="w-3.5 h-3.5 text-[color:var(--tg-accent)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] app-muted">Body Tweaker</span>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="w-20 h-20 rounded-[1.6rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[var(--app-shadow-soft)] flex items-center justify-center shrink-0">
                <img src="/apple-touch-icon.png" alt="Body Tweaker" className="w-14 h-14 rounded-[14px] object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[28px] font-[900] app-header leading-[1.05] tracking-tight">Body Tweaker</h3>
                <p className="mt-2 text-[14px] leading-relaxed app-muted max-w-[260px]">
                  Приложение для практики голодания, дыхания и осознанного восстановления организма.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold app-muted uppercase tracking-[0.14em] mb-3 pl-2 flex items-center gap-2">
            <Users2 className="w-3.5 h-3.5" />
            Команда проекта
          </h3>
          <div className="space-y-3">
            {TEAM.map((member) => {
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              return (
                <a
                  key={member.name}
                  href={member.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[1.8rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] p-4 shadow-[var(--app-shadow-soft)] active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg", member.bg, member.color)}>
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold app-header text-[15px] leading-tight mb-0.5">
                        {member.name}
                      </h4>
                      <p className="text-xs app-muted font-medium">{member.role}</p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[color:var(--tg-glass)] flex items-center justify-center app-muted">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="pt-5 border-t border-[color:var(--tg-border)] space-y-3">
          <div className="grid grid-cols-2 gap-3 w-full">
            <a
              href="https://github.com/NikitaSytsevich/body-tweaker"
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl app-panel app-muted hover:bg-[color:var(--tg-glass)] transition-colors text-xs font-bold active:scale-95"
              rel="noreferrer"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>

            <a
              href="https://t.me/nikita_sytsevich"
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 tg-button rounded-2xl transition-colors text-xs font-bold active:scale-95"
              rel="noreferrer"
            >
              <Send className="w-4 h-4" />
              Связаться
            </a>
          </div>

        </div>
      </div>
    </SettingsShell>
  );
};
