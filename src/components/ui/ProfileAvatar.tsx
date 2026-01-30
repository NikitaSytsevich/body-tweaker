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
  // Храним данные пользователя в state для реактивности
  const [userData, setUserData] = useState(() => ({
    photoUrl: WebApp.initDataUnsafe?.user?.photo_url || null,
    firstName: WebApp.initDataUnsafe?.user?.first_name || ''
  }));
  const [imageError, setImageError] = useState(false);

  const initials = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '?';

  // Подписываемся на изменения в WebApp
  useEffect(() => {
    const updateUserData = () => {
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setUserData({
          photoUrl: user.photo_url || null,
          firstName: user.first_name || ''
        });
        setImageError(false);
      }
    };

    // Сразу проверяем
    updateUserData();

    // Подписываемся на событие готовности WebApp
    if (WebApp.ready) {
      WebApp.ready();
      updateUserData();
    }

    // Таймер для отложенного обновления (на случай медленной загрузки)
    const timer = setTimeout(updateUserData, 100);
    const timer2 = setTimeout(updateUserData, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  // Сбрасываем ошибку когда photoUrl меняется
  useEffect(() => {
    if (userData.photoUrl) {
      setImageError(false);
    }
  }, [userData.photoUrl]);

  // Show photo if available and no error
  if (userData.photoUrl && !imageError) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full overflow-hidden transition-colors shrink-0",
          sizeClasses[size],
          onClick && "hover:ring-2 hover:ring-purple-500/50 cursor-pointer",
          className
        )}
      >
        <img
          src={userData.photoUrl}
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
        "rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shrink-0",
        sizeClasses[size],
        onClick && "hover:ring-2 hover:ring-purple-500/50 cursor-pointer",
        className
      )}
    >
      {userData.firstName ? (
        <span className={cn("font-bold", textSizes[size])}>
          {initials}
        </span>
      ) : (
        <UserCircle2 className={iconSizes[size]} />
      )}
    </button>
  );
};
