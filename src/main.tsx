import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import WebApp from '@twa-dev/sdk'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './contexts/ThemeContext'

// Инициализация
WebApp.ready();

// Настройка внешнего вида (расширяем на весь экран)
WebApp.expand();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <Analytics />
  </React.StrictMode>,
)
