import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SettingsSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const SettingsSection = ({ title, description, children }: SettingsSectionProps) => (
  <section className="space-y-2">
    {title && (
      <p className="text-[11px] font-bold text-slate-400 dark:text-white/50 uppercase tracking-widest pl-2">
        {title}
      </p>
    )}
    {children}
    {description && (
      <p className="text-[11px] leading-relaxed text-slate-400 dark:text-white/50 px-2">
        {description}
      </p>
    )}
  </section>
);

interface SettingsGroupProps {
  children: ReactNode;
  className?: string;
}

export const SettingsGroup = ({ children, className }: SettingsGroupProps) => (
  <div
    className={cn(
      "rounded-[1.8rem] overflow-hidden border border-white/60 dark:border-white/10",
      "bg-white/70 dark:bg-[#1C1C1E]/80 backdrop-blur-xl",
      "shadow-[0_12px_30px_-26px_rgba(15,23,42,0.45)]",
      className
    )}
  >
    <div className="divide-y divide-[color:var(--tg-border)]">{children}</div>
  </div>
);

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  value?: string;
  to?: string;
  onClick?: () => void;
  right?: React.ReactNode;
  iconBgClassName?: string;
  iconClassName?: string;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

export const SettingsRow = ({
  icon: Icon,
  label,
  description,
  value,
  to,
  onClick,
  right,
  iconBgClassName,
  iconClassName,
  tone = 'default',
  disabled,
}: SettingsRowProps) => {
  const isInteractive = Boolean(to || onClick);

  const content = (
    <>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            tone === 'danger'
              ? 'bg-rose-100/80 dark:bg-rose-500/20'
              : 'bg-[color:var(--tg-glass)]',
            iconBgClassName
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              tone === 'danger'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-[color:var(--tg-accent)]',
              iconClassName
            )}
          />
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-semibold",
              tone === 'danger' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-white'
            )}
          >
            {label}
          </p>
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[240px]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 shrink-0">
        {value && <span className="font-medium">{value}</span>}
        {right}
        {!right && isInteractive && <ChevronRight className="w-4 h-4" />}
      </div>
    </>
  );

  const baseClassName = cn(
    "flex items-center justify-between gap-4 px-4 py-3.5 text-left w-full",
    isInteractive && "hover:bg-white/60 dark:hover:bg-white/5 transition-colors",
    disabled && "opacity-50 pointer-events-none"
  );

  if (to) {
    return (
      <Link to={to} className={baseClassName}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClassName}>
        {content}
      </button>
    );
  }

  return <div className={baseClassName}>{content}</div>;
};
