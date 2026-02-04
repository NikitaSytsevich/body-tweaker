import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import WebApp from '@twa-dev/sdk'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './contexts/ThemeContext'

// ============================================
// TELEGRAM MINI APP INITIALIZATION
// ============================================

// SECURITY: Wrap WebApp calls in try-catch to prevent crashes
// when running outside Telegram or if API fails
try {
  // Инициализация Telegram Mini App
  WebApp.ready();

  // Настройка внешнего вида (расширяем на весь экран)
  WebApp.expand();

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <Analytics />
  </React.StrictMode>,
)
