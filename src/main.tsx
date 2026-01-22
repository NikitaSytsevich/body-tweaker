import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import WebApp from '@twa-dev/sdk' // 👈 Импорт
import { Analytics } from '@vercel/analytics/react'

// Инициализация
WebApp.ready();

// Настройка внешнего вида (расширяем на весь экран)
WebApp.expand();

// Настраиваем цвет хедера под цвет приложения (серый фон)
WebApp.setHeaderColor('#F2F2F7');
WebApp.setBackgroundColor('#F2F2F7');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
