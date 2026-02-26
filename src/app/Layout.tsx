// src/app/Layout.tsx
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Timer, Wind, History } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../utils/cn';
import { storageGet, storageSet, STORAGE_READONLY_EVENT_NAME, flushCloudQueue } from '../utils/storage';
import WebApp from '@twa-dev/sdk';
import { ToastNotification } from '../components/ui/ToastNotification';
import { PWA_UPDATE_EVENT_NAME, PWA_OFFLINE_READY_EVENT_NAME } from '../utils/pwa';
import { HISTORY_MENU_VISIBILITY_EVENT_NAME } from '../features/history/historyEvents';

// OPTIMIZATION: Lazy load feature pages for smaller initial bundle
const MetabolismMapPage = lazy(() => import('../features/fasting/MetabolismMapPage').then(m => ({ default: m.MetabolismMapPage })));
const FastingPage = lazy(() => import('../features/fasting/FastingPage').then(m => ({ default: m.FastingPage })));
const BreathingPage = lazy(() => import('../features/breathing/BreathingPage').then(m => ({ default: m.BreathingPage })));
const HistoryPage = lazy(() => import('../features/history/HistoryPage').then(m => ({ default: m.HistoryPage })));
// ArticleDetailPage stays eager as it's rarely used but needs instant load
import { ArticleDetailPage } from '../features/articles/pages/ArticleDetailPage';


// OPTIMIZATION: Added Suspense fallback for lazy-loaded pages
const PageView = memo(({ isActive, children }: { isActive: boolean, children: React.ReactNode }) => {
    return (
        <div
          className={cn(
              "w-full h-full absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide",
              "pb-28 px-5 pt-4",
              isActive ? "z-10 opacity-100 pointer-events-auto" : "-z-10 opacity-0 pointer-events-none"
          )}
          style={{ visibility: isActive ? 'visible' : 'hidden' }}
        >
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </div>
    );
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const MAIN_ROUTES = ['/', '/timer', '/breathing', '/history'];
const normalizePath = (path: string) => (path === '' ? '/' : path);

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = normalizePath(location.pathname);

  const navRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isMainRoute = MAIN_ROUTES.includes(currentPath);
  const [mountedRoutes, setMountedRoutes] = useState<string[]>(() =>
    isMainRoute ? [currentPath] : ['/']
  );
  const [isOffline, setIsOffline] = useState(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false));
  const [storageToast, setStorageToast] = useState({ title: '', message: '' });
  const [showStorageToast, setShowStorageToast] = useState(false);
  const [showPwaToast, setShowPwaToast] = useState(false);
  const [showOfflineReadyToast, setShowOfflineReadyToast] = useState(false);
  const [isHistoryMenuOpen, setIsHistoryMenuOpen] = useState(false);
  
  const xPx = useMotionValue(0);
  const dragBaseRef = useRef<number | null>(null);

  const navItems = useMemo(() => ([
    { id: 'knowledge', path: '/', icon: BookOpen, label: 'Знания' },
    { id: 'timer', path: '/timer', icon: Timer, label: 'Таймер' },
    { id: 'breath', path: '/breathing', icon: Wind, label: 'Дыхание' },
    { id: 'history', path: '/history', icon: History, label: 'История' },
  ]), []);

  // ИЗМЕНЕНИЕ: Проверка, открыта ли статья
  const isArticleDetail = currentPath.startsWith('/articles/');

  const activeIndex = navItems.findIndex((item) => {
    if (item.path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath.startsWith(item.path);
  });
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const isHistoryRoute = currentPath.startsWith('/history');
  const shouldHideBottomDock = isHistoryRoute && isHistoryMenuOpen;

  const pillGap = 4;
  const [metrics, setMetrics] = useState({
    innerWidth: 0,
    itemWidth: 0,
    pillWidth: 0,
    minX: 0,
    maxX: 0,
    offsetX: 0
  });
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const styles = getComputedStyle(nav);
    const padLeft = parseFloat(styles.paddingLeft) || 0;
    const padRight = parseFloat(styles.paddingRight) || 0;
    const innerWidth = Math.max(nav.clientWidth - padLeft - padRight, 0);
    const itemWidth = navItems.length ? innerWidth / navItems.length : 0;
    const pillWidth = itemWidth;
    const minX = 0;
    const maxX = Math.max(innerWidth - pillWidth, 0);
    const offsetX = padLeft;

    setMetrics((prev) => {
      if (
        Math.abs(prev.innerWidth - innerWidth) < 0.5 &&
        Math.abs(prev.itemWidth - itemWidth) < 0.5 &&
        Math.abs(prev.pillWidth - pillWidth) < 0.5 &&
        Math.abs(prev.minX - minX) < 0.5 &&
        Math.abs(prev.maxX - maxX) < 0.5 &&
        Math.abs(prev.offsetX - offsetX) < 0.5
      ) {
        return prev;
      }
      return { innerWidth, itemWidth, pillWidth, minX, maxX, offsetX };
    });

    if (!ready && innerWidth > 0) {
      setReady(true);
    }
  }, [pillGap, navItems.length, ready]);

  useEffect(() => {
    if (!isMainRoute) return;
    setMountedRoutes((prev) =>
      prev.includes(currentPath) ? prev : [...prev, currentPath]
    );
  }, [currentPath, isMainRoute]);

  useEffect(() => {
    const node = navRef.current;
    if (!node) return;
    const update = () => measure();
    update();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(update);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [measure]);

  useLayoutEffect(() => {
    measure();
  }, [measure, navItems.length]);

  useEffect(() => {
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [measure]);

  useEffect(() => {
    if (isDragging || metrics.itemWidth <= 0) return;
    const target = clamp(
      safeActiveIndex * metrics.itemWidth,
      metrics.minX,
      metrics.maxX
    );
    xPx.set(target);
  }, [safeActiveIndex, isDragging, metrics, xPx]);

  useEffect(() => {
    try {
        WebApp.ready();
        WebApp.expand();

        const checkUser = async () => {
            if (WebApp.initDataUnsafe?.user) {
                const existingName = await storageGet('user_name');
                if (!existingName) {
                    await storageSet('user_name', WebApp.initDataUnsafe.user.first_name);
                }
            }
        };
        checkUser();

    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateOnlineStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      if (!offline) {
        void flushCloudQueue();
      }
    };
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageReadonly = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: string }>).detail;
      setStorageToast({
        title: 'Облачное хранилище недоступно',
        message: detail?.reason
          ? `Данные сохраняются локально. ${detail.reason}`
          : 'Данные сохраняются локально. Нажмите, чтобы синхронизировать.'
      });
      setShowStorageToast(true);
    };
    window.addEventListener(STORAGE_READONLY_EVENT_NAME, handleStorageReadonly);
    return () => {
      window.removeEventListener(STORAGE_READONLY_EVENT_NAME, handleStorageReadonly);
    };
  }, []);

  const handleStorageSync = () => {
    void flushCloudQueue().then((ok) => {
      setStorageToast({
        title: ok ? 'Синхронизация завершена' : 'Синхронизация недоступна',
        message: ok
          ? 'Все изменения отправлены в облако.'
          : 'Не удалось синхронизировать сейчас. Попробуйте позже.',
      });
      setTimeout(() => setShowStorageToast(true), 0);
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePwaUpdate = () => setShowPwaToast(true);
    const handleOfflineReady = () => setShowOfflineReadyToast(true);
    window.addEventListener(PWA_UPDATE_EVENT_NAME, handlePwaUpdate);
    window.addEventListener(PWA_OFFLINE_READY_EVENT_NAME, handleOfflineReady);
    return () => {
      window.removeEventListener(PWA_UPDATE_EVENT_NAME, handlePwaUpdate);
      window.removeEventListener(PWA_OFFLINE_READY_EVENT_NAME, handleOfflineReady);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHistoryMenuVisibility = (event: Event) => {
      const detail = (event as CustomEvent<{ isOpen?: boolean }>).detail;
      setIsHistoryMenuOpen(Boolean(detail?.isOpen));
    };

    window.addEventListener(HISTORY_MENU_VISIBILITY_EVENT_NAME, handleHistoryMenuVisibility);
    return () => window.removeEventListener(HISTORY_MENU_VISIBILITY_EVENT_NAME, handleHistoryMenuVisibility);
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging || !navRef.current) return;
      if (!metrics.pillWidth) return;
      const baseLeft = dragBaseRef.current;
      if (baseLeft == null) return;
      const relativeX = e.clientX - baseLeft;
      const nextX = relativeX - (metrics.pillWidth / 2);
      xPx.set(clamp(nextX, metrics.minX, metrics.maxX));
    };

    const handleUp = (e: PointerEvent) => {
      if (!isDragging || !navRef.current) return;
      setIsDragging(false);
      if (metrics.itemWidth <= 0) {
        dragBaseRef.current = null;
        return;
      }
      const baseLeft = dragBaseRef.current ?? (navRef.current.getBoundingClientRect().left + navRef.current.clientLeft + metrics.offsetX);
      dragBaseRef.current = null;
      const relativeX = e.clientX - baseLeft;
      let index = Math.round((relativeX - (metrics.itemWidth / 2)) / metrics.itemWidth);
      index = Math.max(0, Math.min(index, navItems.length - 1));
      const targetPath = navItems[index].path;
      
      if (targetPath !== location.pathname) {
        if (navigator.vibrate) navigator.vibrate(15);
        navigate(targetPath);
      } else {
        const target = clamp(index * metrics.itemWidth, metrics.minX, metrics.maxX);
        xPx.set(target);
      }
    };

    if (isDragging) {
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
        window.addEventListener('pointercancel', handleUp);
    }
    return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
    };
  }, [isDragging, location.pathname, navigate, metrics, navItems, xPx]);

  const leftStyle = useTransform(
    xPx,
    (v) => `${metrics.offsetX + clamp(v, metrics.minX, metrics.maxX)}px`
  );

  const shouldRender = useCallback((path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '')) return true;
    if (currentPath === path) return true;
    return mountedRoutes.includes(path);
  }, [currentPath, mountedRoutes]);

  return (
    <div className="app-surface flex justify-center font-sans h-[100dvh] w-screen overflow-hidden fixed inset-0 pt-[var(--app-top-offset)] relative">

      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[var(--app-top-offset)] bg-gradient-to-b from-[color:var(--tg-surface)]/80 via-[color:var(--tg-surface)]/45 to-transparent" />

      <div
        className={cn(
          'w-full h-full relative flex flex-col overflow-hidden app-surface',
          isArticleDetail ? 'max-w-none' : 'max-w-md shadow-2xl'
        )}
      >

        <main className="flex-1 relative w-full overflow-hidden">
            {/* ИЗМЕНЕНИЕ: Скрываем основные экраны, если открыта статья */}
            {shouldRender('/') && (
              <PageView isActive={!isArticleDetail && (currentPath === '/' || currentPath === '')}>
                  <MetabolismMapPage />
              </PageView>
            )}
            {shouldRender('/timer') && (
              <PageView isActive={!isArticleDetail && currentPath === '/timer'}>
                  <FastingPage />
              </PageView>
            )}
            {shouldRender('/breathing') && (
              <PageView isActive={!isArticleDetail && currentPath === '/breathing'}>
                  <BreathingPage />
              </PageView>
            )}
            {shouldRender('/history') && (
              <PageView isActive={!isArticleDetail && currentPath === '/history'}>
                  <HistoryPage />
              </PageView>
            )}

            {/* ИЗМЕНЕНИЕ: Отображение детальной страницы статьи */}
            <AnimatePresence>
                {isArticleDetail && (
                    <div className="w-full h-full absolute inset-0 z-40 app-surface">
                        <ArticleDetailPage />
                    </div>
                )}
            </AnimatePresence>
        </main>

        {/* ИЗМЕНЕНИЕ: Скрываем навигацию на странице статьи */}
        {!isArticleDetail && !shouldHideBottomDock && (
          <div
            className="fixed left-0 right-0 z-40 flex justify-center pointer-events-none"
            style={{ bottom: 'calc(12px + var(--app-safe-bottom))' }}
          >
            <motion.nav
              ref={navRef}
              style={{ touchAction: 'none', padding: `${pillGap}px` }}
              aria-label="Основная навигация"
              onPointerDown={(e) => {
                e.preventDefault();
                if (!metrics.pillWidth || !metrics.itemWidth) return;
                const nav = e.currentTarget;
                const rect = nav.getBoundingClientRect();
                const baseLeft = rect.left + nav.clientLeft + metrics.offsetX;
                dragBaseRef.current = baseLeft;
                setIsDragging(true);
                const relativeX = e.clientX - baseLeft;
                const nextX = relativeX - (metrics.pillWidth / 2);
                xPx.set(clamp(nextX, metrics.minX, metrics.maxX));
              }}
              className={cn(
                "pointer-events-auto select-none cursor-grab active:cursor-grabbing",
                "mx-4 w-full max-w-[340px] h-[70px] flex items-center relative",
                "rounded-full border backdrop-blur-2xl",
                "bg-[color:var(--tg-glass-strong)] border-[color:var(--tg-border)] shadow-[0_18px_40px_-26px_rgba(15,23,42,0.35)]"
              )}
            >
              <motion.div
                className={cn(
                  "absolute rounded-full z-0 pointer-events-none",
                  "bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
                  "dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                )}
                style={{
                  left: leftStyle,
                  width: metrics.pillWidth > 0
                    ? `${metrics.pillWidth}px`
                    : `calc((100% - ${pillGap * 2}px) / ${navItems.length})`,
                  top: `${pillGap}px`,
                  bottom: `${pillGap}px`,
                  transition: isDragging || !ready ? 'none' : 'left 120ms ease-out, width 120ms ease-out'
                }}
              />
              {navItems.map((item, index) => {
                const isActive = index === safeActiveIndex;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "relative flex-1 flex flex-col items-center justify-center gap-1 h-full z-10 pointer-events-none"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-6 h-6 transition-colors duration-200",
                        isActive
                          ? "text-[color:var(--tg-accent)]"
                          : "text-[color:var(--tg-text)] opacity-70"
                      )}
                      strokeWidth={2}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-semibold tracking-tight transition-colors duration-200",
                        isActive
                          ? "text-[color:var(--tg-accent)]"
                          : "text-[color:var(--tg-text)] opacity-70"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </motion.nav>
          </div>
        )}

      </div>

      {isOffline && (
        <div className="fixed top-[calc(var(--app-top-offset)+8px)] left-4 right-4 z-[10000] flex justify-center pointer-events-none">
          <div className="pointer-events-auto rounded-full px-4 py-2 bg-amber-500 text-white text-xs font-semibold shadow-lg">
            Нет сети. Работаем оффлайн.
          </div>
        </div>
      )}

      <ToastNotification
        isVisible={showStorageToast}
        title={storageToast.title}
        message={storageToast.message}
        onClose={() => setShowStorageToast(false)}
        onPress={handleStorageSync}
      />

      <ToastNotification
        isVisible={showPwaToast}
        title="Доступна новая версия"
        message="Нажмите, чтобы обновить приложение."
        onClose={() => setShowPwaToast(false)}
        onPress={() => window.__btUpdateSW?.(true)}
      />

      <ToastNotification
        isVisible={showOfflineReadyToast}
        title="Готово к работе оффлайн"
        message="Приложение закэшировано и доступно без сети."
        onClose={() => setShowOfflineReadyToast(false)}
      />
    </div>
  );
};
