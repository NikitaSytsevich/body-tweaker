import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type HeadingProps = BaseProps & {
  as?: 'h2' | 'h3' | 'h4';
};

type CalloutProps = BaseProps & {
  title?: string;
  tone?: 'info' | 'warning' | 'success' | 'neutral';
};

type ListProps = {
  items: ReactNode[];
  className?: string;
};

type ChartPoint = {
  label: string;
  value: number;
  note?: string;
};

type ProgressChartProps = {
  items: ChartPoint[];
  className?: string;
};

const CALLOUT_STYLES: Record<NonNullable<CalloutProps['tone']>, { bar: string; title: string } > = {
  info: { bar: 'bg-[color:var(--article-accent)]', title: 'Важно' },
  warning: { bar: 'bg-amber-400', title: 'Внимание' },
  success: { bar: 'bg-emerald-400', title: 'Рекомендация' },
  neutral: { bar: 'bg-white/10', title: '' },
};

export const ArticleSection = ({ children, className }: BaseProps) => (
  <section className={cn('space-y-4', className)}>{children}</section>
);

export const ArticleLead = ({ children, className }: BaseProps) => (
  <p className={cn('text-[18px] leading-[1.65] text-[color:var(--article-muted)] font-[Iowan_Old_Style,Georgia,serif]', className)}>
    {children}
  </p>
);

export const ArticleHeading = ({ children, className, as = 'h2' }: HeadingProps) => {
  const Component = as;
  return (
    <Component
      className={cn(
        'text-[26px] md:text-[30px] font-semibold tracking-tight text-[color:var(--article-text)]',
        'font-[Iowan_Old_Style,Georgia,serif]',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const ArticleParagraph = ({ children, className }: BaseProps) => (
  <p className={cn('text-[17px] leading-[1.78] text-[color:var(--article-muted)] font-[Iowan_Old_Style,Georgia,serif]', className)}>
    {children}
  </p>
);

export const ArticleSurface = ({ children, className }: BaseProps) => (
  <div
    className={cn(
      'rounded-[26px] border border-[color:var(--article-border)] bg-[color:var(--article-surface-2)] p-5',
      'shadow-[var(--app-shadow-soft)]',
      className
    )}
  >
    {children}
  </div>
);

export const ArticleCallout = ({ children, className, tone = 'info', title }: CalloutProps) => {
  const style = CALLOUT_STYLES[tone];
  const heading = title ?? style.title;
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[26px] border border-[color:var(--article-border)] bg-[color:var(--article-surface-2)] p-5',
        className
      )}
    >
      <span className={cn('absolute left-0 top-0 bottom-0 w-[3px]', style.bar)} aria-hidden="true" />
      {heading ? (
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">
          {heading}
        </p>
      ) : null}
      <div className="text-[16px] leading-[1.75] text-[color:var(--article-text)] font-[Iowan_Old_Style,Georgia,serif]">{children}</div>
    </div>
  );
};

export const ArticleList = ({ items, className }: ListProps) => (
  <ul className={cn('space-y-3', className)}>
    {items.map((item, index) => (
      <li key={index} className="flex gap-3 text-[16px] leading-[1.75] text-[color:var(--article-muted)] font-[Iowan_Old_Style,Georgia,serif]">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--article-accent)]" />
        <span className="flex-1">{item}</span>
      </li>
    ))}
  </ul>
);

export const ArticleSteps = ({ items, className }: ListProps) => (
  <div className={cn('space-y-3', className)}>
    {items.map((item, index) => (
      <div
        key={index}
        className="flex gap-3 rounded-[24px] border border-[color:var(--article-border)] bg-[color:var(--article-surface-2)] p-4"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--article-accent)] text-xs font-semibold text-white">
          {index + 1}
        </div>
        <div className="text-[16px] leading-[1.75] text-[color:var(--article-muted)] font-[Iowan_Old_Style,Georgia,serif]">{item}</div>
      </div>
    ))}
  </div>
);

export const ArticleProgressChart = ({ items, className }: ProgressChartProps) => (
  <div
    className={cn(
      'space-y-3 rounded-[26px] border border-[color:var(--article-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(248,250,255,0.72))] p-4 shadow-[var(--app-shadow-soft)]',
      className
    )}
  >
    {items.map(item => {
      const safeValue = Math.min(100, Math.max(0, item.value));
      return (
        <div key={`${item.label}-${item.note ?? ''}`} className="space-y-2 rounded-[18px] bg-white/60 p-3 backdrop-blur-[2px]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--article-text)]">{item.label}</p>
            {item.note ? <p className="text-[12px] text-[color:var(--article-muted)]">{item.note}</p> : null}
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[rgba(15,23,42,0.08)]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[linear-gradient(90deg,var(--article-accent),#7aa9ff)] shadow-[0_0_16px_rgba(59,130,246,0.45)]"
              style={{ width: `${safeValue}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
);
