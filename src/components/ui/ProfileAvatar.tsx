// src/components/ui/ProfileAvatar.tsx
import { memo } from 'react';
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
  const photoUrl = WebApp.initDataUnsafe?.user?.photo_url;
  const hasPhoto = !!photoUrl;

  if (hasPhoto) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full object-cover border-2 border-slate-200 dark:border-white/10 overflow-hidden transition-colors",
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

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 transition-colors",
        sizeClasses[size],
        onClick && "hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer",
        className
      )}
    >
      <UserCircle2 className={iconSizes[size]} />
    </button>
  );
});

ProfileAvatar.displayName = 'ProfileAvatar';
