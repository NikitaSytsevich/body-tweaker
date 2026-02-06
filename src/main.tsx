import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import WebApp from '@twa-dev/sdk'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { registerSW } from 'virtual:pwa-register'
import { PWA_UPDATE_EVENT_NAME, PWA_OFFLINE_READY_EVENT_NAME } from './utils/pwa'
import { runMigrations } from './utils/migrations'
import { initMonitoring } from './utils/monitoring'
import { isStorageKeyValid } from './utils/storage'

const renderFatal = (title: string, message: string) => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <div className="app-surface min-h-screen w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-white/10 text-center">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{message}</p>
        </div>
      </div>
    </React.StrictMode>,
  );
};

// ============================================
// TELEGRAM MINI APP INITIALIZATION
// ============================================

if (!isStorageKeyValid) {
  renderFatal(
    'Ошибка конфигурации',
    'Не задан VITE_STORAGE_KEY. Добавьте переменную окружения и выполните повторный деплой.'
  );
} else {
  // SECURITY: Wrap WebApp calls in try-catch to prevent crashes
  // when running outside Telegram or if API fails
  try {
    // Инициализация Telegram Mini App
    WebApp.ready();

  // Настройка внешнего вида (расширяем на весь экран)
  WebApp.expand();
  if (typeof document !== 'undefined') {
    document.title = 'Body Tweaker';
  }

  const applyTelegramInsets = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const hasTelegramWebApp = typeof window !== 'undefined' && Boolean((window as any).Telegram?.WebApp);
    const isTelegram = hasTelegramWebApp || Boolean(WebApp.initDataUnsafe?.user || WebApp.initData);
    const platform = WebApp.platform as string | undefined;
    const overlayByPlatform: Record<string, number> = {
      ios: 56,
      android: 48,
      macos: 40,
      tdesktop: 0,
      weba: 0,
      webk: 0,
      web: 0,
    };
    if (!isTelegram) {
      root.style.setProperty('--app-telegram-top', '0px');
      return;
    }

    const overlayTop = overlayByPlatform[platform ?? ''] ?? 48;
    const safeTop = WebApp.contentSafeAreaInset?.top ?? WebApp.safeAreaInset?.top ?? 0;
    const safeBottom = WebApp.contentSafeAreaInset?.bottom ?? WebApp.safeAreaInset?.bottom ?? 0;

    root.style.setProperty('--app-safe-top', `${safeTop}px`);
    root.style.setProperty('--app-safe-bottom', `${safeBottom}px`);
    root.style.setProperty('--app-telegram-top', `${overlayTop}px`);
  };

  applyTelegramInsets();
  try {
    WebApp.onEvent?.('safeAreaChanged', applyTelegramInsets);
    WebApp.onEvent?.('contentSafeAreaChanged', applyTelegramInsets);
  } catch {
    // ignore
  }

  // Запрос полного экрана (доступно с Telegram 8.0+).
  // Иногда требуется user-gesture, поэтому пробуем сразу и при первом тапе.
  const requestFullscreen = () => {
    if (!WebApp.isVersionAtLeast?.('8.0') || !WebApp.requestFullscreen) return false;
    try {
      WebApp.requestFullscreen();
      return true;
    } catch (error) {
      console.warn('[Telegram] Fullscreen request failed:', error);
      return false;
    }
  };

  const didRequest = requestFullscreen();
  if (!didRequest && typeof window !== 'undefined') {
    const handleFirstTap = () => {
      requestFullscreen();
    };
    window.addEventListener('pointerdown', handleFirstTap, { once: true, passive: true });
  }

    console.log('[Telegram] WebApp initialized successfully');
  } catch (error) {
    console.warn('[Telegram] WebApp initialization failed (running in standalone mode):', error);
  }

  initMonitoring();
  void runMigrations();

  if (typeof window !== 'undefined') {
    const updateSW = registerSW({
      onNeedRefresh() {
        window.__btUpdateSW = updateSW;
        window.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT_NAME));
      },
      onOfflineReady() {
        window.dispatchEvent(new CustomEvent(PWA_OFFLINE_READY_EVENT_NAME));
      },
    });
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
      <Analytics />
    </React.StrictMode>,
  );
}
