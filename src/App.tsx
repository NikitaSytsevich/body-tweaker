import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './app/Layout';
import { WelcomeScreen } from './app/WelcomeScreen';

// Импорты страниц
import { MetabolismMapPage } from './features/fasting/MetabolismMapPage';
import { FastingPage } from './features/fasting/FastingPage';
import { BreathingPage } from './features/breathing/BreathingPage';
import { HistoryPage } from './features/history/HistoryPage';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
      // Проверяем, согласился ли пользователь с условиями
      const accepted = localStorage.getItem('has_accepted_terms');
      if (!accepted) {
          setShowWelcome(true);
      }
  }, []);

  if (showWelcome) {
      return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* Главная: Карта метаболизма */}
          <Route index element={<MetabolismMapPage />} />
          
          {/* Таймер голодания */}
          <Route path="timer" element={<FastingPage />} />
          
          {/* Дыхательные практики */}
          <Route path="breathing" element={<BreathingPage />} />
          
          {/* История */}
          <Route path="history" element={<HistoryPage />} />
          
          {/* Любой другой путь -> на главную */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
