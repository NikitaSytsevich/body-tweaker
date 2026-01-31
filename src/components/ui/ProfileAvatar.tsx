// src/components/ui/ProfileAvatar.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { UserCircle2 } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { cn } from '../../utils/cn';

interface ProfileAvatarProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onUpdate?: (data: { photoUrl: string | null; firstName: string }) => void;
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

// Кеш для хранения данных пользователя
let globalAvatarCache: { photoUrl: string | null; firstName: string; timestamp: number } | null = null;
const CACHE_DURATION = 5000;

// Функция для получения данных пользователя с проверкой
const fetchUserData = () => {
  const user = WebApp.initDataUnsafe?.user;

  // Если пользователь есть и есть фото, обновляем кеш
  if (user?.photo_url) {
    const data = {
      photoUrl: user.photo_url,
      firstName: user.first_name || ''
    };
    globalAvatarCache = { ...data, timestamp: Date.now() };
    return data;
  }

  // Если кеш валиден и есть фото, возвращаем из кеша
  if (globalAvatarCache && Date.now() - globalAvatarCache.timestamp < CACHE_DURATION && globalAvatarCache.photoUrl) {
    return {
      photoUrl: globalAvatarCache.photoUrl,
      firstName: globalAvatarCache.firstName
    };
  }

  // Иначе возвращаем текущие данные (даже если photoUrl = null)
  const data = {
    photoUrl: user?.photo_url || null,
    firstName: user?.first_name || ''
  };

  // Не обновляем кеш если нет фото - может появиться позже
  if (data.photoUrl) {
    globalAvatarCache = { ...data, timestamp: Date.now() };
  }

  return data;
};

export const ProfileAvatar = ({ onClick, size = 'md', className, onUpdate }: ProfileAvatarProps) => {
  const [userData, setUserData] = useState(() => fetchUserData());
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasMounted = useRef(false);

  const initials = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '?';

  // Функция обновления данных
  const refreshData = useCallback(() => {
    const newData = fetchUserData();
    const hasChanged = newData.photoUrl !== userData.photoUrl || newData.firstName !== userData.firstName;

    if (hasChanged) {
      setUserData(newData);
      // Сбрасываем ошибку если появился новый photoUrl
      if (newData.photoUrl && newData.photoUrl !== userData.photoUrl) {
        setImageError(false);
      }
    }

    // Уведомляем родительский компонент
    if (onUpdate) {
      onUpdate(newData);
    }

    // Отключаем состояние загрузки после первой попытки
    if (hasMounted.current) {
      setIsLoading(false);
    }
  }, [userData.photoUrl, userData.firstName, onUpdate]);

  // Основной useEffect для инициализации
  useEffect(() => {
    hasMounted.current = true;

    // Проверяем готовность Telegram WebApp
    const checkReady = () => {
      if (WebApp.initDataUnsafe?.user) {
        setIsLoading(false);
        refreshData();
      }
    };

    // Сразу проверяем
    checkReady();

    // Повторяем с задержками на случай если SDK еще не готов
    const t1 = setTimeout(checkReady, 50);
    const t2 = setTimeout(checkReady, 200);
    const t3 = setTimeout(checkReady, 500);
    const t4 = setTimeout(checkReady, 1000);
    const t5 = setTimeout(() => setIsLoading(false), 1500); // В любом случае отключаем loading

    // Периодическая проверка
    const interval = setInterval(refreshData, 3000);

    return () => {
      hasMounted.current = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearInterval(interval);
    };
  }, [refreshData]);

  // Сбрасываем ошибку когда photoUrl меняется
  useEffect(() => {
    if (userData.photoUrl && userData.photoUrl !== globalAvatarCache?.photoUrl) {
      setImageError(false);
    }
  }, [userData.photoUrl]);

  // Показываем loading state
  if (isLoading) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 animate-pulse",
          sizeClasses[size],
          onClick && "hover:ring-2 hover:ring-purple-500/50 cursor-pointer",
          className
        )}
      >
        <UserCircle2 className={cn(iconSizes[size], "text-slate-300 dark:text-slate-600")} />
      </button>
    );
  }

  // Show photo if available and no error
  if (userData.photoUrl && !imageError) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full overflow-hidden transition-colors shrink-0 relative",
          sizeClasses[size],
          onClick && "hover:ring-2 hover:ring-purple-500/50 cursor-pointer",
          className
        )}
      >
        <img
          src={userData.photoUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => {
            console.warn('[ProfileAvatar] Image load error:', userData.photoUrl);
            setImageError(true);
          }}
          onLoad={(e) => {
            const img = e.currentTarget;
            // Проверяем что изображение загрузилось корректно
            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
              console.warn('[ProfileAvatar] Image loaded but has zero dimensions');
              setImageError(true);
            } else {
              console.log('[ProfileAvatar] Image loaded successfully:', img.naturalWidth, 'x', img.naturalHeight);
            }
          }}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          loading="eager"
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

// Экспорт функции для принудительного обновления всех аватаров
export const refreshAllAvatars = () => {
  globalAvatarCache = null; // Сбрасываем кеш
  const data = fetchUserData();
  console.log('[ProfileAvatar] Force refresh:', data);
  return data;
};
