// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './app/Layout';
import { WelcomeScreen } from './app/WelcomeScreen';
import { TimerProvider } from './features/fasting/context/TimerContext';
import { ProfilePage } from './app/ProfilePage';
import {
  AppearanceSettingsPage,
  AppSettingsPage,
  DataSettingsPage,
  LegalSettingsPage,
  AboutSettingsPage,
} from './app/settings';
import { storageGet } from './utils/storage';

// Контейнер для профильных страниц с правильной высотой
const ProfileLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-[100dvh] w-screen overflow-hidden bg-[#F2F2F7] dark:bg-[#1C1C1E] pt-[var(--app-top-offset)] relative">
    <div className="pointer-events-none absolute top-0 left-0 right-0 h-[var(--app-top-offset)] bg-gradient-to-b from-white/90 via-white/70 to-transparent dark:from-[#0B0F14]/90 dark:via-[#0B0F14]/70" />
    {children}
  </div>
);

function App() {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  useEffect(() => {
      const checkFirstRun = async () => {
          const accepted = await storageGet('legal_acceptance_v1');
          setShowWelcome(!accepted);
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
          <Route path="/biorhythm" element={<Layout />} />
          <Route path="/history" element={<Layout />} />
          <Route path="/profile" element={<ProfileLayout><ProfilePage /></ProfileLayout>} />
          <Route path="/profile/settings" element={<Navigate to="/profile" replace />} />
          <Route path="/profile/settings/appearance" element={<ProfileLayout><AppearanceSettingsPage /></ProfileLayout>} />
          <Route path="/profile/settings/app" element={<ProfileLayout><AppSettingsPage /></ProfileLayout>} />
          <Route path="/profile/settings/data" element={<ProfileLayout><DataSettingsPage /></ProfileLayout>} />
          <Route path="/profile/settings/legal" element={<ProfileLayout><LegalSettingsPage /></ProfileLayout>} />
          <Route path="/profile/settings/about" element={<ProfileLayout><AboutSettingsPage /></ProfileLayout>} />
          <Route path="/profile/about" element={<Navigate to="/profile/settings/about" replace />} />
          <Route path="/articles/:slug" element={<Layout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TimerProvider>
  );
}

export default App;
