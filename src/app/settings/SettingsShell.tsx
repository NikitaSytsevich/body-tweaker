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
    <div className={cn('h-full app-page flex flex-col', className)}>
      <div className="px-5 pt-5 pb-3 shrink-0 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full app-panel flex items-center justify-center app-muted hover:brightness-[0.98] transition-colors"
          aria-label="Назад"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-[22px] font-[900] app-header tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs app-muted font-medium">
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
