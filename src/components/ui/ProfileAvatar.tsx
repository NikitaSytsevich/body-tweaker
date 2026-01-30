// src/components/ui/ProfileAvatar.tsx
import { useState, useEffect } from 'react';
import { UserCircle2 } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { cn } from '../../utils/cn';

interface ProfileAvatarProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8'
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-xl'
};

export const ProfileAvatar = ({ onClick, size = 'md', className }: ProfileAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // Читаем напрямую из WebApp без useState, чтобы данные всегда были актуальными
  const photoUrl = WebApp.initDataUnsafe?.user?.photo_url;
  const firstName = WebApp.initDataUnsafe?.user?.first_name || '';
  const initials = firstName ? firstName.charAt(0).toUpperCase() : '?';

  // Сбрасываем ошибку когда photoUrl меняется
  useEffect(() => {
    if (photoUrl) {
      setImageError(false);
    }
  }, [photoUrl]);

  // Show photo if available and no error
  if (photoUrl && !imageError) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full object-cover border-2 border-slate-200 dark:border-white/10 overflow-hidden transition-colors shrink-0",
          sizeClasses[size],
          onClick && "hover:border-slate-300 dark:hover:border-white/20 cursor-pointer",
          className
        )}
      >
        <img
          src={photoUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </button>
    );
  }

  // Fallback: initials or UserCircle2 icon
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 transition-colors shrink-0",
        sizeClasses[size],
        onClick && "hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer",
        className
      )}
    >
      {firstName ? (
        <span className={cn("font-bold text-slate-600 dark:text-slate-300", textSizes[size])}>
          {initials}
        </span>
      ) : (
        <UserCircle2 className={iconSizes[size]} />
      )}
    </button>
  );
};
