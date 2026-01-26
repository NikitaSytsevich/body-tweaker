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

const getSystemTheme = (): Theme => {
  return WebApp.colorScheme === 'dark' ? 'dark' : 'light'
}

const getThemeFromMode = (mode: ThemeMode): Theme => {
  if (mode === 'auto') {
    return getSystemTheme()
  }
  return mode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('auto')
  const [isInitialized, setIsInitialized] = useState(false)

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

    // Sync Telegram header and background colors
    const headerColor = theme === 'dark' ? '#1C1C1E' : '#F2F2F7'
    WebApp.setHeaderColor(headerColor)
    WebApp.setBackgroundColor(headerColor)
  }, [theme, isInitialized])

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

      const headerColor = newTheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
      WebApp.setHeaderColor(headerColor)
      WebApp.setBackgroundColor(headerColor)
    }

    WebApp.onEvent('themeChanged', handleThemeChange)

    return () => {
      WebApp.offEvent('themeChanged', handleThemeChange)
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
