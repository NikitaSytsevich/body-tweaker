// src/components/ui/ProfileAvatar.tsx
import { useState, useEffect, memo } from 'react';
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

export const ProfileAvatar = memo(({ onClick, size = 'md', className }: ProfileAvatarProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    // Инициализируем данные пользователя с небольшой задержкой для гарантии
    const timer = setTimeout(() => {
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setPhotoUrl(user.photo_url || null);
        setFirstName(user.first_name || '');
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const hasPhoto = !!photoUrl;
  const initials = firstName ? firstName.charAt(0).toUpperCase() : '?';

  if (hasPhoto) {
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
        <span className={cn(
          "font-bold text-slate-600 dark:text-slate-300",
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-xl'
        )}>
          {initials}
        </span>
      ) : (
        <UserCircle2 className={iconSizes[size]} />
      )}
    </button>
  );
});

ProfileAvatar.displayName = 'ProfileAvatar';
