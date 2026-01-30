// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './app/Layout';
import { WelcomeScreen } from './app/WelcomeScreen';
import { TimerProvider } from './features/fasting/context/TimerContext';
import { ProfilePage, SettingsSubPage, AboutSubPage } from './app/ProfilePage';
import { ArticleDetailPage } from './features/articles/pages/ArticleDetailPage';
import { storageGet } from './utils/storage';

// Контейнер для профильных страниц с правильной высотой
const ProfileLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-[100dvh] w-screen overflow-hidden bg-[#F2F2F7] dark:bg-[#1C1C1E]">
    {children}
  </div>
);

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
      return null;
  }

  if (showWelcome) {
      return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <TimerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/timer" element={<Layout />} />
          <Route path="/breathing" element={<Layout />} />
          <Route path="/history" element={<Layout />} />
          <Route path="/profile" element={<ProfileLayout><ProfilePage /></ProfileLayout>} />
          <Route path="/profile/settings" element={<ProfileLayout><SettingsSubPage /></ProfileLayout>} />
          <Route path="/profile/about" element={<ProfileLayout><AboutSubPage /></ProfileLayout>} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TimerProvider>
  );
}

export default App;
