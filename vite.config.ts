import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Анализ бандла - создает dist/stats.html после сборки
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // PWA (Progressive Web App)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['*.png', '*.svg', '*.jpg'],
      manifest: {
        name: 'Body Tweaker',
        short_name: 'Body Tweaker',
        description: 'Scientific Biohacking - Track fasting, breathing, and health',
        theme_color: '#F2F2F7',
        background_color: '#F2F2F7',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['health', 'fitness', 'lifestyle'],
        shortcuts: [
          {
            name: 'Start Fasting',
            short_name: 'Fasting',
            description: 'Start a new fasting session',
            url: '/timer',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Metabolism Map',
            short_name: 'Map',
            description: 'View your metabolism map',
            url: '/',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        // Кэшировать основные ресурсы
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.telegram\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'telegram-assets',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ],
        // Не кэшировать API запросы
        navigateFallback: null,
      },
      devOptions: {
        enabled: true // Включить PWA в разработке для тестирования
      }
    })
  ],
  build: {
    // Улучшенная минификация
    minify: 'terser',
    terserOptions: {
      compress: {
        // Удалить console.log в продакшене
        drop_console: true,
        drop_debugger: true,
        // Удалить недостижимый код
        dead_code: true,
        // Удалить неиспользуемые переменные
        unused: true,
      },
      format: {
        // Убрать комментарии
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        // Улучшенное разделение чанков
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor'
          }

          // Framer Motion (разделяем отдельно, так как это самый тяжёлый)
          if (id.includes('framer-motion')) {
            return 'motion-vendor'
          }

          // UI библиотеки
          if (id.includes('lucide-react')) {
            return 'icons-vendor'
          }

          // Charts
          if (id.includes('recharts')) {
            return 'charts-vendor'
          }

          // Telegram SDK
          if (id.includes('@twa-dev/sdk')) {
            return 'telegram-vendor'
          }

          // Utils
          if (id.includes('dayjs') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('crypto-js')) {
            return 'utils-vendor'
          }

          // Node modules (остальное)
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Имена чанков
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    // Лимиты для chunks
    chunkSizeWarningLimit: 500,
    // Source maps (только для продакшена)
    sourcemap: false,
  }
})
