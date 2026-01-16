import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './app/Layout';
import { WelcomeScreen } from './app/WelcomeScreen';
import { TimerProvider } from './features/fasting/context/TimerContext';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
      // Прямая проверка (надежно)
      const accepted = localStorage.getItem('bt_app_has_accepted_terms');
      if (accepted !== 'true') {
          setShowWelcome(true);
      }
  }, []);

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
