// src/components/ui/ProfileAvatar.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { UserCircle2 } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { cn } from '../../utils/cn';

interface ProfileAvatarProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  // Добавляем callback для принудительного обновления
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

// Кеш для хранения данных пользователя между экземплярами компонента
let globalAvatarCache: { photoUrl: string | null; firstName: string; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 секунд

// Функция для получения актуальных данных
const fetchUserData = () => {
  // Проверяем кеш сначала
  if (globalAvatarCache && Date.now() - globalAvatarCache.timestamp < CACHE_DURATION) {
    return {
      photoUrl: globalAvatarCache.photoUrl,
      firstName: globalAvatarCache.firstName
    };
  }

  const user = WebApp.initDataUnsafe?.user;
  const data = {
    photoUrl: user?.photo_url || null,
    firstName: user?.first_name || ''
  };

  // Обновляем кеш
  globalAvatarCache = { ...data, timestamp: Date.now() };

  return data;
};

export const ProfileAvatar = ({ onClick, size = 'md', className, onUpdate }: ProfileAvatarProps) => {
  const [userData, setUserData] = useState(() => fetchUserData());
  const [imageError, setImageError] = useState(false);
  const hasMounted = useRef(false);

  const initials = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '?';

  // Функция обновления данных
  const refreshData = useCallback(() => {
    const newData = fetchUserData();
    if (newData.photoUrl !== userData.photoUrl || newData.firstName !== userData.firstName) {
      setUserData(newData);
      setImageError(false);
    }
    // Уведомляем родительский компонент
    if (onUpdate) {
      onUpdate(newData);
    }
  }, [userData.photoUrl, userData.firstName, onUpdate]);

  // Основной useEffect для инициализации и подписки на события
  useEffect(() => {
    hasMounted.current = true;

    // Сразу обновляем несколько раз с задержками для надежности
    refreshData();
    const t1 = setTimeout(refreshData, 100);
    const t2 = setTimeout(refreshData, 500);
    const t3 = setTimeout(refreshData, 1500);

    // Периодическая проверка для надежности
    const interval = setInterval(refreshData, 3000);

    return () => {
      hasMounted.current = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, [refreshData]);

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
          onLoad={(e) => {
            // Убедимся что изображение загрузилось корректно
            const img = e.currentTarget;
            if (img.naturalWidth === 0) {
              setImageError(true);
            }
          }}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
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
  return data;
};
