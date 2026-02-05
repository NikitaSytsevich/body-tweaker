/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import { storageGet, storageSet } from '../utils/storage'

type ThemeMode = 'light' | 'dark' | 'auto'
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getSystemTheme = (): Theme => {
    try {
      return WebApp.colorScheme === 'dark' ? 'dark' : 'light'
    } catch {
      console.warn('WebApp not ready, falling back to light theme')
      return 'light' // Fallback если WebApp не готов
    }
  }

  const getThemeFromMode = (mode: ThemeMode): Theme => {
    if (mode === 'auto') {
      return getSystemTheme()
    }
    return mode
  }
  const [mode, setModeState] = useState<ThemeMode>('auto')
  const [isInitialized, setIsInitialized] = useState(false)

  const MANUAL_THEME_VARS: Record<Theme, Record<string, string>> = {
    light: {
      '--tg-bg': '#F2F2F7',
      '--tg-surface': '#FFFFFF',
      '--tg-text': '#0F172A',
      '--tg-muted': '#64748B',
      '--tg-accent': '#0A84FF',
      '--tg-accent-contrast': '#FFFFFF',
      '--tg-border': 'rgba(15, 23, 42, 0.08)',
      '--tg-glass': 'rgba(255, 255, 255, 0.72)',
      '--tg-glass-strong': 'rgba(255, 255, 255, 0.88)',
    },
    dark: {
      '--tg-bg': '#0F1115',
      '--tg-surface': '#1C1F26',
      '--tg-text': '#F8FAFC',
      '--tg-muted': '#98A2B3',
      '--tg-accent': '#4C8DFF',
      '--tg-accent-contrast': '#FFFFFF',
      '--tg-border': 'rgba(255, 255, 255, 0.08)',
      '--tg-glass': 'rgba(18, 20, 24, 0.7)',
      '--tg-glass-strong': 'rgba(20, 22, 27, 0.85)',
    },
  }

  // 1. Загрузка сохранённой темы при старте
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await storageGet('theme_mode')
        if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
          setModeState(savedMode as ThemeMode)
        }
      } catch (e) {
        console.error('Failed to load theme mode:', e)
      } finally {
        setIsInitialized(true)
      }
    }
    loadTheme()
  }, [])

  // 2. Вычисляем текущую тему на основе режима
  const theme = getThemeFromMode(mode)

  // 3. Применяем тему к DOM и Telegram
  useEffect(() => {
    if (!isInitialized) return

    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Если режим НЕ auto — фиксируем палитру вручную и игнорируем Telegram theme vars
    if (mode !== 'auto') {
      const vars = MANUAL_THEME_VARS[theme]
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    } else {
      // Возвращаем управление Telegram'у
      Object.keys(MANUAL_THEME_VARS.light).forEach((key) => {
        root.style.removeProperty(key)
      })
    }

    // Sync Telegram header and background colors (только если WebApp готов)
    try {
      const headerColor = theme === 'dark' ? '#1C1C1E' : '#F2F2F7'
      if (WebApp.setHeaderColor && WebApp.setBackgroundColor) {
        WebApp.setHeaderColor(headerColor)
        WebApp.setBackgroundColor(headerColor)
      }
    } catch {
      // Игнорируем ошибки WebApp
    }
  }, [theme, mode, isInitialized])

  // 4. Слушаем изменения темы из Telegram (только для режима auto)
  useEffect(() => {
    if (mode !== 'auto') return

    const handleThemeChange = () => {
      const newTheme = getSystemTheme()
      const root = document.documentElement
      if (newTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      try {
        const headerColor = newTheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
        if (WebApp.setHeaderColor && WebApp.setBackgroundColor) {
          WebApp.setHeaderColor(headerColor)
          WebApp.setBackgroundColor(headerColor)
        }
      } catch {
        // Игнорируем ошибки WebApp
      }
    }

    try {
      WebApp.onEvent('themeChanged', handleThemeChange)
    } catch {
      // Игнорируем ошибки WebApp
    }

    return () => {
      try {
        WebApp.offEvent('themeChanged', handleThemeChange)
      } catch {
        // Игнорируем ошибки WebApp
      }
    }
  }, [mode])

  // 5. Функция изменения режима с сохранением
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    storageSet('theme_mode', newMode) // fire & forget
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
