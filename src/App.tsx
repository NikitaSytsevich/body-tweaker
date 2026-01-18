// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './app/Layout';
import { WelcomeScreen } from './app/WelcomeScreen';
import { TimerProvider } from './features/fasting/context/TimerContext';
import { storageGet } from './utils/storage'; // 👈 NEW

function App() {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  useEffect(() => {
      const checkFirstRun = async () => {
          const accepted = await storageGet('has_accepted_terms');
          setShowWelcome(accepted !== 'true');
      };
      checkFirstRun();
  }, []);

  if (showWelcome === null) {
      // Можно показать лоадер, но белый экран на < 100ms тоже ок
      return null; 
  }

  if (showWelcome) {
      return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <TimerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </TimerProvider>
  );
}

export default App;
