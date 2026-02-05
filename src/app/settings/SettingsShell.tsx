import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SettingsShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

export const SettingsShell = ({ title, subtitle, children, rightSlot, className }: SettingsShellProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBack = () => navigate(-1);
    try {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(handleBack);
    } catch {
      // ignore
    }

    return () => {
      try {
        WebApp.BackButton.offClick(handleBack);
        WebApp.BackButton.hide();
      } catch {
        // ignore
      }
    };
  }, [navigate]);

  return (
    <div className={cn('h-full bg-[#F2F2F7] dark:bg-[#1C1C1E] flex flex-col', className)}>
      <div className="px-5 pt-5 pb-3 shrink-0 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 border border-white/70 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/20 transition-colors"
          aria-label="Назад"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-[22px] font-[900] text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : <div className="w-9" />}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {children}
      </div>
    </div>
  );
};
