import { ChevronRight, Sparkles } from 'lucide-react';
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
    <SettingsShell title="О проекте" subtitle="Команда и философия">
      <div className="space-y-6">
        {/* HERO */}
        <div className="relative h-48 overflow-hidden bg-emerald-50 dark:bg-[#0f291e] rounded-[2rem]">
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
        <div className="bg-white dark:bg-[#2C2C2E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
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
                  className="block bg-white dark:bg-[#2C2C2E] p-4 rounded-[1.8rem] shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg", member.bg, member.color)}>
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-white text-[15px] leading-tight mb-0.5">
                        {member.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{member.role}</p>
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
        <div className="pt-6 flex flex-col items-center gap-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex gap-3 w-full">
            <a
              href="https://github.com/NikitaSytsevich/body-tweaker"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-[#2C2C2E] rounded-2xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm text-xs font-bold active:scale-95"
              rel="noreferrer"
            >
              Github
            </a>

            <a
              href="https://t.me/nikita_sytsevich"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-lg shadow-slate-900/20 dark:shadow-white/10 transition-colors text-xs font-bold active:scale-95"
              rel="noreferrer"
            >
              Связаться
            </a>
          </div>

          <div className="text-center opacity-40">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">v2.1.0</p>
          </div>
        </div>
      </div>
    </SettingsShell>
  );
};
