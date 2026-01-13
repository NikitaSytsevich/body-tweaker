import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Map, Timer, Wind, History, Settings } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../utils/cn';
import { SettingsModal } from './modals/SettingsModal';
import { InfoModal } from './modals/InfoModal';
import WebApp from '@twa-dev/sdk';

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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

  useEffect(() => {
    const syncPosition = () => {
        if (!isDragging) {
            const index = navItems.findIndex(i => i.path === location.pathname);
            const safeIndex = index === -1 ? 0 : index;
            xPercent.set(safeIndex * 25);
        }
    };
    syncPosition();
    window.addEventListener('resize', syncPosition);
    return () => window.removeEventListener('resize', syncPosition);
  }, [location.pathname, isDragging]);

  useEffect(() => {
    try {
        WebApp.ready(); WebApp.expand();
        WebApp.setHeaderColor('#F2F2F7'); WebApp.setBackgroundColor('#F2F2F7');
        if (WebApp.initDataUnsafe?.user && !localStorage.getItem('user_name')) {
            localStorage.setItem('user_name', WebApp.initDataUnsafe.user.first_name);
        }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging || !navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      const padding = 8;
      const contentWidth = rect.width - (padding * 2);
      if (contentWidth <= 0) return;
      const itemWidth = contentWidth / 4;
      let relativeX = e.clientX - rect.left - padding - (itemWidth / 2);
      let percent = (relativeX / contentWidth) * 100;
      if (percent < 0) percent = percent / 4;
      if (percent > 75) percent = 75 + (percent - 75) / 4;
      xPercent.set(percent);
    };

    const handleUp = (e: PointerEvent) => {
      if (!isDragging || !navRef.current) return;
      setIsDragging(false);
      const rect = navRef.current.getBoundingClientRect();
      const padding = 8;
      const contentWidth = rect.width - (padding * 2);
      const itemWidth = contentWidth / 4;
      const relativeX = e.clientX - rect.left - padding;
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
    // ИСПРАВЛЕНИЕ 1: Удален класс 'touch-none', чтобы разрешить скролл и жесты
    <div className="min-h-screen bg-[#F2F2F7] flex justify-center font-sans text-slate-900 selection:bg-blue-100">
      
      {/* ИСПРАВЛЕНИЕ 2: Заменено min-h-screen на h-[100dvh], чтобы main скроллился внутри контейнера */}
      <div className="w-full max-w-md bg-[#F2F2F7] h-[100dvh] relative flex flex-col overflow-hidden shadow-2xl">
        
        {/* HEADER (Z-30) */}
        <header className="px-6 pt-14 pb-4 bg-[#F2F2F7]/80 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center transition-all">
          <div onClick={() => setIsInfoOpen(true)} className="cursor-pointer active:opacity-60 transition-opacity">
            <h1 className="text-2xl font-[850] tracking-tight text-slate-900">Body Tweaker</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Scientific Biohacking</p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsSettingsOpen(true)} className="p-2.5 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm border border-slate-100">
            <Settings className="w-5 h-5" />
          </motion.button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide px-4 pt-2">
          <Outlet />
        </main>

        {/* DOCK (Z-40) */}
        <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center">
          <motion.nav 
            ref={navRef}
            animate={{ scale: isDragging ? 0.98 : 1, y: isDragging ? 2 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                const rect = e.currentTarget.getBoundingClientRect();
                const padding = 8;
                const contentWidth = rect.width - (padding * 2);
                if (contentWidth <= 0) return;
                let relativeX = e.clientX - rect.left - padding - (contentWidth / 8); 
                let percent = (relativeX / contentWidth) * 100;
                xPercent.set(percent);
            }}
            className="bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-[2.5rem] px-2 py-2 flex items-center mx-4 max-w-sm w-full relative h-20 cursor-grab active:cursor-grabbing select-none"
          >
            <motion.div
                className="absolute top-2 bottom-2 bg-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] rounded-[2rem] border border-slate-100 z-0 pointer-events-none"
                style={{
                    left: leftStyle, 
                    width: 'calc(25% - 16px)', 
                    scale: isDragging ? 1.05 : 1
                }}
            />
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const getIconAnimation = (): any => {
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
                  <motion.div animate={isActive ? { ...getIconAnimation(), y: -4, scale: 1.1 } : { y: 0, scale: 1, rotate: 0, x: 0, scaleX: 1 } as any}>
                    <item.icon className={cn("w-6 h-6 transition-colors duration-200", isActive ? "text-blue-600 fill-blue-600/10" : "text-slate-400")} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-1 h-1 bg-blue-600 rounded-full absolute bottom-3" />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.nav>
        </div>

        {/* MODALS */}
        {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
        {isInfoOpen && <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />}

      </div>
    </div>
  );
};
