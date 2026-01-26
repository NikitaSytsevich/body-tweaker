import React, { createContext, useContext, useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
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
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from Telegram WebApp SDK
    const tgTheme = WebApp.colorScheme
    return (tgTheme === 'dark' ? 'dark' : 'light')
  })

  useEffect(() => {
    // Apply theme class to document
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
  }, [theme])

  useEffect(() => {
    // Listen for theme changes from Telegram
    const handleThemeChange = () => {
      const newTheme = WebApp.colorScheme === 'dark' ? 'dark' : 'light'
      setTheme(newTheme)
    }

    WebApp.onEvent('themeChanged', handleThemeChange)

    return () => {
      WebApp.offEvent('themeChanged', handleThemeChange)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
