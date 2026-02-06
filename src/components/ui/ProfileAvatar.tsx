// src/components/ui/ProfileAvatar.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
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

type UserData = { photoUrl: string | null; firstName: string };
let globalUserData: UserData = { photoUrl: null, firstName: '' };
const listeners = new Set<(data: UserData) => void>();
let pollIntervalId: number | null = null;
let initialChecksScheduled = false;

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

const notifyListeners = () => {
  listeners.forEach((listener) => listener(globalUserData));
};

const updateGlobalUserData = () => {
  const next = fetchUserData();
  const changed =
    next.photoUrl !== globalUserData.photoUrl || next.firstName !== globalUserData.firstName;
  if (changed) {
    globalUserData = next;
    notifyListeners();
  }
  return globalUserData;
};

const scheduleInitialChecks = () => {
  if (initialChecksScheduled || typeof window === 'undefined') return;
  initialChecksScheduled = true;

  const run = () => updateGlobalUserData();
  const t1 = window.setTimeout(run, 50);
  const t2 = window.setTimeout(run, 200);
  const t3 = window.setTimeout(run, 500);
  const t4 = window.setTimeout(run, 1000);
  const t5 = window.setTimeout(() => {
    initialChecksScheduled = false;
  }, 1500);

  window.setTimeout(() => {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    clearTimeout(t4);
    clearTimeout(t5);
  }, 1600);
};

const startPolling = () => {
  if (pollIntervalId != null || typeof window === 'undefined') return;
  pollIntervalId = window.setInterval(() => {
    if (listeners.size === 0) return;
    updateGlobalUserData();
  }, 3000);
};

const stopPolling = () => {
  if (pollIntervalId == null || typeof window === 'undefined') return;
  clearInterval(pollIntervalId);
  pollIntervalId = null;
};

const subscribe = (listener: (data: UserData) => void) => {
  listeners.add(listener);
  startPolling();
  scheduleInitialChecks();
  listener(globalUserData);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stopPolling();
  };
};

export const ProfileAvatar = ({ onClick, size = 'md', className, onUpdate }: ProfileAvatarProps) => {
  const [userData, setUserData] = useState<UserData>(() => {
    globalUserData = updateGlobalUserData();
    return globalUserData;
  });
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasMounted = useRef(false);
  const retryCount = useRef(0);
  const [retryKey, setRetryKey] = useState(0);
  const retryTimeouts = useRef<number[]>([]);

  const initials = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '?';
  const ariaLabel = onClick ? 'Открыть профиль' : 'Профиль';

  // Основной useEffect для инициализации
  useEffect(() => {
    hasMounted.current = true;
    const fallback = window.setTimeout(() => setIsLoading(false), 1500);
    const unsubscribe = subscribe((data) => {
      setUserData(data);
      if (data.photoUrl) setImageError(false);
      if (onUpdate) onUpdate(data);
      if (hasMounted.current) setIsLoading(false);
    });

    return () => {
      hasMounted.current = false;
      clearTimeout(fallback);
      unsubscribe();
    };
  }, [onUpdate]);

  useEffect(() => {
    return () => {
      retryTimeouts.current.forEach((id) => clearTimeout(id));
      retryTimeouts.current = [];
    };
  }, []);

  // Сбрасываем ошибку когда photoUrl меняется
  useEffect(() => {
    if (userData.photoUrl && userData.photoUrl !== globalAvatarCache?.photoUrl) {
      setImageError(false);
    }
  }, [userData.photoUrl]);

  useEffect(() => {
    if (userData.photoUrl) {
      retryCount.current = 0;
      setRetryKey(0);
    }
  }, [userData.photoUrl]);

  const avatarSrc = useMemo(() => {
    if (!userData.photoUrl) return null;
    if (retryKey === 0) return userData.photoUrl;
    const separator = userData.photoUrl.includes('?') ? '&' : '?';
    return `${userData.photoUrl}${separator}v=${retryKey}`;
  }, [userData.photoUrl, retryKey]);

  // Показываем loading state
  if (isLoading) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
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
  if (avatarSrc && !imageError) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          "rounded-full overflow-hidden transition-colors shrink-0 relative",
          sizeClasses[size],
          onClick && "hover:ring-2 hover:ring-purple-500/50 cursor-pointer",
          className
        )}
      >
        <img
          key={avatarSrc}
          src={avatarSrc}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => {
            console.warn('[ProfileAvatar] Image load error:', userData.photoUrl);
            setImageError(true);
            if (retryCount.current < 2) {
              retryCount.current += 1;
              const delay = 600 * retryCount.current;
              const id = window.setTimeout(() => {
                if (!hasMounted.current) return;
                setImageError(false);
                setRetryKey((prev) => prev + 1);
              }, delay);
              retryTimeouts.current.push(id);
            }
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
          loading="eager"
          decoding="async"
        />
      </button>
    );
  }

  // Fallback: initials or UserCircle2 icon
  return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
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
