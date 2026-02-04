// src/app/Layout.tsx
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Timer, Wind, History } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../utils/cn';
import { storageGet, storageSet } from '../utils/storage';
import WebApp from '@twa-dev/sdk';

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
              "pb-32 px-4 pt-2",
              isActive ? "z-10 opacity-100 pointer-events-auto" : "-z-10 opacity-0 pointer-events-none"
          )}
          style={{ visibility: isActive ? 'visible' : 'hidden' }}
        >
            <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                {children}
            </Suspense>
        </div>
    );
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const xPx = useMotionValue(0);
  const dragBaseRef = useRef<number | null>(null);

  const navItems = useMemo(() => ([
    { id: 'knowledge', path: '/', icon: BookOpen, label: 'Знания' },
    { id: 'timer', path: '/timer', icon: Timer, label: 'Таймер' },
    { id: 'breath', path: '/breathing', icon: Wind, label: 'Дыхание' },
    { id: 'history', path: '/history', icon: History, label: 'История' },
  ]), []);

  // ИЗМЕНЕНИЕ: Проверка, открыта ли статья
  const isArticleDetail = location.pathname.startsWith('/articles/');

  const activeIndex = navItems.findIndex((item) => {
    if (item.path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname.startsWith(item.path);
  });
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

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

  return (
    <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] flex justify-center font-sans text-slate-900 dark:text-white h-[100dvh] w-screen overflow-hidden fixed inset-0 pt-[var(--app-safe-top)]">

      <div className="w-full max-w-md bg-[#F2F2F7] dark:bg-[#1C1C1E] h-full relative flex flex-col shadow-2xl overflow-hidden">

        <main className="flex-1 relative w-full overflow-hidden">
            {/* ИЗМЕНЕНИЕ: Скрываем основные экраны, если открыта статья */}
            <PageView isActive={!isArticleDetail && (location.pathname === '/' || location.pathname === '')}>
                <MetabolismMapPage />
            </PageView>
            <PageView isActive={!isArticleDetail && location.pathname === '/timer'}>
                <FastingPage />
            </PageView>
            <PageView isActive={!isArticleDetail && location.pathname === '/breathing'}>
                <BreathingPage />
            </PageView>
            <PageView isActive={!isArticleDetail && location.pathname === '/history'}>
                <HistoryPage />
            </PageView>

            {/* ИЗМЕНЕНИЕ: Отображение детальной страницы статьи */}
            <AnimatePresence>
                {isArticleDetail && (
                    <div className="w-full h-full absolute inset-0 z-40 bg-[#F2F2F7] dark:bg-[#1C1C1E]">
                        <ArticleDetailPage />
                    </div>
                )}
            </AnimatePresence>
        </main>

        {/* ИЗМЕНЕНИЕ: Скрываем навигацию на странице статьи */}
        {!isArticleDetail && (
          <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <motion.nav
              ref={navRef}
              style={{ touchAction: 'none', padding: `${pillGap}px` }}
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
                "mx-4 w-full max-w-[340px] h-[72px] flex items-center relative",
                "rounded-full border",
                "bg-[linear-gradient(180deg,#F8F8F8_0%,#F1F1F1_100%)] border-white/70 shadow-[0_16px_36px_-18px_rgba(0,0,0,0.22)]",
                "dark:bg-[linear-gradient(180deg,#2C2C2E_0%,#1F1F22_100%)] dark:border-[#3A3A3C]/80 dark:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.7)]"
              )}
            >
              <motion.div
                className={cn(
                  "absolute rounded-full z-0 pointer-events-none",
                  "bg-[#E9E9E9] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
                  "dark:bg-[#3A3A3C] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
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
                          ? "text-[#0A84FF] dark:text-[#0A84FF]"
                          : "text-[#3A3A3C] dark:text-white/90"
                      )}
                      strokeWidth={2}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-semibold tracking-tight transition-colors duration-200",
                        isActive
                          ? "text-[#0A84FF] dark:text-[#0A84FF]"
                          : "text-[#4A4A4A] dark:text-white/90"
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
    </div>
  );
};
