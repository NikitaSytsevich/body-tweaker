// src/app/Layout.tsx
import { useState, useRef, useEffect, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map, Timer, Wind, History } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '../utils/cn';
import { storageGet, storageSet } from '../utils/storage';
import WebApp from '@twa-dev/sdk';

import { MetabolismMapPage } from '../features/fasting/MetabolismMapPage';
import { FastingPage } from '../features/fasting/FastingPage';
import { BreathingPage } from '../features/breathing/BreathingPage';
import { HistoryPage } from '../features/history/HistoryPage';
// ИЗМЕНЕНИЕ: Импорт детальной страницы
import { ArticleDetailPage } from '../features/articles/pages/ArticleDetailPage';

import { useFastingTimerContext } from '../features/fasting/context/TimerContext';
import { ToastNotification } from '../components/ui/ToastNotification';

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
            {children}
        </div>
    );
});

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { notification, closeNotification, setPhaseToOpen } = useFastingTimerContext();

  const navRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const xPercent = useMotionValue(0);
  const springPercent = useSpring(xPercent, { 
      stiffness: isDragging ? 2000 : 500, 
      damping: isDragging ? 50 : 40 
  });

  const navItems = [
    { id: 'map', path: '/', icon: Map },
    { id: 'timer', path: '/timer', icon: Timer },
    { id: 'breath', path: '/breathing', icon: Wind },
    { id: 'history', path: '/history', icon: History },
  ];

  // ИЗМЕНЕНИЕ: Проверка, открыта ли статья
  const isArticleDetail = location.pathname.startsWith('/articles/');

  const activeIndex = navItems.findIndex(i => i.path === location.pathname);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  useEffect(() => {
    if (!isDragging) {
        xPercent.set(safeActiveIndex * 25);
    }
  }, [safeActiveIndex, isDragging]);

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

    } catch (e) { /* ignore */ }
  }, []);

  const handleNotificationClick = () => {
      if (notification?.phaseId) {
          setPhaseToOpen(notification.phaseId);
          navigate('/');
      }
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging || !navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      const contentWidth = rect.width - 16;
      if (contentWidth <= 0) return;
      let relativeX = e.clientX - rect.left - 8 - (contentWidth / 8); 
      let percent = (relativeX / contentWidth) * 100;
      xPercent.set(percent);
    };

    const handleUp = (e: PointerEvent) => {
      if (!isDragging || !navRef.current) return;
      setIsDragging(false);
      const rect = navRef.current.getBoundingClientRect();
      const contentWidth = rect.width - 16;
      const itemWidth = contentWidth / 4;
      const relativeX = e.clientX - rect.left - 8;
      let index = Math.floor(relativeX / itemWidth);
      index = Math.max(0, Math.min(index, 3));
      const targetPath = navItems[index].path;
      
      if (targetPath !== location.pathname) {
        if (navigator.vibrate) navigator.vibrate(15);
        navigate(targetPath);
      } else {
        xPercent.set(index * 25);
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
  }, [isDragging, location.pathname, navigate]);

  const leftStyle = useTransform(springPercent, (v) => `calc(${v}% + 8px)`);

  return (
    <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] flex justify-center font-sans text-slate-900 dark:text-white h-[100dvh] w-screen overflow-hidden fixed inset-0">

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
          <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <motion.nav
              ref={navRef}
              animate={{ scale: isDragging ? 0.98 : 1, y: isDragging ? 2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const contentWidth = rect.width - 16;
                  let relativeX = e.clientX - rect.left - 8 - (contentWidth / 8);
                  let percent = (relativeX / contentWidth) * 100;
                  xPercent.set(percent);
              }}
              className="pointer-events-auto bg-white/90 dark:bg-[#2C2C2E]/85 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] rounded-[2.5rem] px-2 py-2 flex items-center mx-4 max-w-sm w-full relative h-20 cursor-grab active:cursor-grabbing select-none"
            >
              <motion.div
                  className="absolute top-2 bottom-2 bg-white dark:bg-[#2C2C2E] shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)] rounded-[2rem] border border-slate-100 dark:border-white/10 z-0 pointer-events-none"
                  style={{
                      left: leftStyle,
                      width: 'calc(25% - 16px)',
                      scale: isDragging ? 1.05 : 1
                  }}
              />
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const getIconAnimation = (): Variants | Record<string, unknown> => {
                    if (!isActive) return {};
                    switch (item.id) {
                        case 'map': return { scaleX: [1, 1.2, 0.9, 1], transition: { duration: 0.6 } };
                        case 'timer': return { rotate: [0, 360], transition: { duration: 0.8, ease: "backOut" } };
                        case 'breath': return { x: [0, 5, -5, 0], rotate: [0, 10, -10, 0], transition: { duration: 0.6 } };
                        case 'history': return { rotate: [0, -20, 360, 360], transition: { duration: 1, times: [0, 0.2, 0.8, 1] } };
                        default: return { scale: 1.2, y: -4 };
                    }
                };

                return (
                  <div key={item.id} className="relative flex-1 flex flex-col items-center justify-center h-full z-10 pointer-events-none">
                    <motion.div animate={isActive ? { ...getIconAnimation(), y: -4, scale: 1.1 } : { y: 0, scale: 1, rotate: 0 }}>
                      <item.icon className={cn("w-6 h-6 transition-colors duration-200", isActive ? "text-blue-600 dark:text-blue-500 fill-blue-600/10 dark:fill-blue-500/10" : "text-slate-400 dark:text-slate-500")} strokeWidth={isActive ? 2.5 : 2} />
                    </motion.div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-1 h-1 bg-blue-600 dark:bg-blue-500 rounded-full absolute bottom-3" />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.nav>
          </div>
        )}

        <ToastNotification
            isVisible={!!notification}
            title={notification?.title || ""}
            message={notification?.message || ""}
            onClose={closeNotification}
            onPress={handleNotificationClick}
        />

      </div>
    </div>
  );
};
