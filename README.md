# 🧬 Body Tweaker

<div align="center">

**Scientific Biohacking in Your Pocket**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Telegram](https://img.shields.io/badge/Mini_App-29B6F6?logo=telegram&logoColor=white)](https://core.telegram.org/bots/webapps)

[English](#english) | [Русский](#русский)

</div>

---

## English

### 🎯 Overview

**Body Tweaker** is a sophisticated Telegram Mini App designed for intermittent fasting tracking, metabolic monitoring, breathing exercises, and biohacking education. Built with cutting-edge web technologies, it brings professional-grade health tracking to your Telegram chat.

### ✨ Features

#### ⏱️ **Smart Fasting Timer**
- **Multiple scientifically-backed protocols**:
  - 16:8 (Beginner)
  - 18:6 (Intermediate)
  - 20:4 (Advanced)
  - 36-hour extended fasts
- **Real-time metabolism map** showing your body's energy phases:
  - Glucose burning → Ketosis → Autophagy → Growth hormone spike
- **Phase-aware notifications** when entering metabolic states
- **Automatic progress saving** with Telegram Cloud Storage

#### 🫁 **Breathing Exercises**
- Guided breathing patterns for stress relief and focus
- 4-7-8, Box Breathing, and Wim Hof techniques
- Visual guidance with smooth animations
- Session history tracking

#### 📊 **Health Analytics**
- **Biorhythm charts** based on your birth date
- **Fasting history** with detailed completion records
- **Progress insights** and statistics
- Export capabilities

#### 📚 **Educational Articles**
- Scientific papers on fasting and nutrition
- Research-based guides from renowned experts
- In-app article reader with smooth navigation
- Curated content on:
  - Intermittent fasting protocols
  - Nutritional science (The China Study, How Not to Die)
  - Therapeutic fasting (Shelton, Bragg)
  - Plant-based nutrition

#### 🔒 **Privacy & Security**
- **AES-256 encryption** for local data storage
- **Telegram Cloud Storage** with automatic fallback
- **No tracking or analytics** - your data stays yours
- **No account required** - works instantly

### 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **SDK** | Telegram Web App SDK |
| **State** | React Context + Hooks |
| **Storage** | Telegram Cloud + localStorage (AES encrypted) |
| **Date/Time** | Day.js |
| **Icons** | Lucide React |

### 🏗️ Architecture

```
src/
├── app/
│   ├── Layout.tsx              # Main layout with draggable dock navigation
│   ├── WelcomeScreen.tsx       # First-run terms screen
│   └── modals/                 # Settings, Info, InstallGuide
├── features/
│   ├── fasting/                # Fasting timer & metabolism map
│   │   ├── context/TimerContext.tsx
│   │   ├── hooks/useFastingTimer.ts
│   │   ├── data/schemes.ts     # Protocol definitions
│   │   └── data/stages.ts      # Metabolic phases
│   ├── breathing/              # Breathing exercises
│   │   ├── data/patterns.ts
│   │   └── hooks/useBreathingSession.ts
│   ├── biorhythm/              # Biorhythm charts
│   ├── history/                # Activity history
│   └── articles/               # Educational articles
├── hooks/
│   ├── useStorage.ts           # Persistent storage hook
│   └── useAddToHomeScreen.ts
├── utils/
│   ├── storage.ts              # Cloud + local storage with encryption
│   ├── sounds.ts               # Audio utilities
│   └── cn.ts                   # className utility
└── main.tsx                    # Entry point
```

### 🚀 Getting Started

#### Prerequisites
- Node.js 18+
- npm or yarn

#### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/body-tweaker.git
cd body-tweaker

# Install dependencies
npm install

# Set environment variable
echo "VITE_STORAGE_KEY=your-secret-key-here" > .env

# Start development server
npm run dev
```

#### Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

### 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_STORAGE_KEY` | AES encryption key for local storage | Yes (for encryption) |

### 📱 Telegram Bot Setup

1. **Create a Bot**: Talk to [@BotFather](https://t.me/botfather) on Telegram
2. **Get Token**: Save your bot token
3. **Configure Web App**: Set your Mini App URL in BotFather
4. **Deploy**: Host your built app (Vercel, Netlify, or your server)
5. **Test**: Open your bot and tap the menu button

### 🎨 Design Philosophy

- **Apple-inspired UI**: Clean, minimalist interface following iOS Human Interface Guidelines
- **Smooth animations**: 60fps transitions with Framer Motion
- **Intuitive navigation**: Draggable dock with gesture-based interactions
- **Accessibility-first**: High contrast, readable fonts, clear visual hierarchy
- **Performance-optimized**: Lazy loading, code splitting, hardware-accelerated animations

### 📊 Key Features Deep Dive

#### Metabolism Map
The interactive visualization shows your body's metabolic state during fasting:
- **Anabolic Phase** (0-4h): Digestion and nutrient absorption
- **Catabolic Phase** (4-12h): Glucose depletion, fat burning begins
- **Ketosis** (12-18h): Fat metabolism, mental clarity
- **Autophagy** (18-24h): Cellular cleanup, anti-aging
- **Growth Hormone Spike** (24h+): Tissue repair, muscle preservation

#### Cloud Storage with Fallback
```typescript
// Automatic Telegram Cloud Storage with encryption
await storageSet('fasting_state', encryptedData);

// Falls back to encrypted localStorage if Cloud unavailable
// Data stays synced across devices with Telegram account
```

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is private and proprietary. All rights reserved.

### 🙏 Acknowledgments

- **Fasting protocols** inspired by Dr. Jason Fung, Dr. Valter Longo
- **Breathing techniques** based on Wim Hof, Buteyko method
- **Nutrition science** from The China Study, Dr. Michael Greger
- **UI/UX** inspired by Apple Health, Oura Ring

---

## Русский

### 🎯 Обзор

**Body Tweaker** — это продвинутое Telegram Mini App для отслеживания периодического голодания, мониторинга метаболизма, дыхательных упражнений и обучения биохакингу. Создано с использованием новейших веб-технологий, приносит профессиональный трекинг здоровья прямо в ваш Telegram.

### ✨ Возможности

#### ⏱️ **Умный таймер голодания**
- **Научно обоснованные протоколы**:
  - 16:8 (Начинающий)
  - 18:6 (Средний)
  - 20:4 (Продвинутый)
  - 36-часовые extended голодания
- **Карта метаболизма в реальном времени**:
  - Сжигание глюкозы → Кетоз → Аутофагия → Всплеск гормона роста
- **Уведомления о фазах** при входе в метаболические состояния
- **Автосохранение прогресса** с Telegram Cloud Storage

#### 🫁 **Дыхательные упражнения**
- Руководства дыхательными техниками для снятия стресса
- 4-7-8, Квадратное дыхание, Вим Хоф
- Визуальные инструкции с плавными анимациями
- История сессий

#### 📊 **Аналитика здоровья**
- **Биоритмы** по дате рождения
- **История голоданий** с детальными записями
- **Статистика прогресса**
- Возможность экспорта

#### 📚 **Образовательные статьи**
- Научные статьи о голодании и питании
- Руководства от экспертов
- Встроенный читал статей
- Контент по:
  - Протоколам периодического голодания
  - Науке о питании (Китайское исследование, Как не умереть)
  - Лечебному голоданию (Шелтон, Брэгг)
  - Растительному питанию

#### 🔒 **Приватность и безопасность**
- **AES-256 шифрование** локального хранилища
- **Telegram Cloud Storage** с автоматическим fallback
- **Без трекинга и аналитики** — ваши данные остаются вашими
- **Без аккаунта** — работает мгновенно

### 🛠️ Технологии

| Категория | Технология |
|-----------|-----------|
| **Фреймворк** | React 19 + TypeScript |
| **Сборщик** | Vite 7 |
| **Роутинг** | React Router v7 |
| **Стили** | Tailwind CSS |
| **Анимации** | Framer Motion |
| **Графики** | Recharts |
| **SDK** | Telegram Web App SDK |
| **Состояние** | React Context + Hooks |
| **Хранилище** | Telegram Cloud + localStorage (AES зашифровано) |
| **Дата/Время** | Day.js |
| **Иконки** | Lucide React |

### 🚀 Установка

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/body-tweaker.git
cd body-tweaker

# Установить зависимости
npm install

# Установить переменную окружения
echo "VITE_STORAGE_KEY=ваш-секретный-ключ" > .env

# Запустить dev сервер
npm run dev
```

### 📊 Ключевые особенности

#### Карта метаболизма
Интерактивная визуализация метаболического состояния:
- **Анаболическая фаза** (0-4ч): Пищеварение и усвоение
- **Катаболическая фаза** (4-12ч): Истощение глюкозы, начало жиросжигания
- **Кетоз** (12-18ч): Жировой метаболизм, ясность ума
- **Аутофагия** (18-24ч): Клеточная очистка, анти-эйдж
- **Всплеск гормона роста** (24ч+): Регенерация тканей

---

<div align="center">

**Made with ❤️ for better health**

[⬆ Back to Top](#-body-tweaker)

</div>
