<div align="center">

  ![Logo](/logo.svg)

  # 🧬 Body Tweaker

  **Научный подход к биохакингу в вашем кармане**

  [![Telegram](https://img.shields.io/badge/Telegram-Mini%20App-blue?logo=telegram)](https://core.telegram.org/bots/webapps)
  [![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2-purple?logo=vite)](https://vitejs.dev/)

  Интервальное голодание • Дыхательные практики • Биоритмы • База знаний

  [English](#english-readme) | [Демо](#демо-версия) | [Установка](#-установка) | [Документация](#-документация)

</div>

---

## ✨ Что это такое?

**Body Tweaker** — это Telegram Mini App для научного биохакинга организма. Приложение помогает:

- ⏳ **Отслеживать интервальное голодание** — таймер с картой метаболических изменений (11 фаз)
- 🌬️ **Практиковать дыхательные упражнения** — 4 программы с атмосферной музыкой
- 📊 **Анализировать биоритмы** — физические, эмоциональные и интеллектуальные циклы
- 📚 **Изучать основы здоровья** — база знаний с научными статьями
- 📜 **Сохранять историю** — все достижения с шифрованием и синхронизацией

---

## 🎸 Возможности

### ⏱️ Таймер голодания

| Особенность | Описание |
|-------------|------------|
| **🗺️ Карта метаболизма** | 11 фаз трансформации организма от анаболизма до аутофагии |
| **⚙️ Протоколы** | 7 научных программ: 14ч, 16ч, 24ч, 36ч, 48ч, 72ч, Советская РДТ |
| **🔔 Уведомления** | Вибрация и пуш при смене метаболической фазы |
| **📈 Прогресс** | Визуализация процента от цели с круговым таймером |
| **✅ Подготовка** | Интерактивный чек-лист для плавного входа в голодание |

### 🌬️ Дыхательные практики

- **Wim Hof** (3-3-3) • **Box Breathing** (4-4-4-4) • **4-7-8** • **Прогрессивное**
- 🎵 **4 атмосферных звука**: ветер, дождь, космос, костёр
- 🎚️ **Регулировка**: громкость музыки и звуков отдельно
- 📊 **История сессий** с детальной статистикой

### 📊 Биоритмы

- 🔄 **3 цикла**: физический, эмоциональный, интеллектуальный
- 📅 **Календарь** — прогноз по дате рождения
- 📈 **Графики** — визуализация ваших волн энергии

### 📚 База знаний

Научные статьи от экспертов:
- 📖 **Майкл Грегер** — "Как не умереть раньше времени"
- 🥗 **Китайское исследование** — питание и болезни
- 🏥 **Джоэл Фурман** — "Ешь, чтобы жить"
- 💪 **Пол Брэгг** — чудо голодания
- 🔬 **Герберт Шелтон** — искусство голодания

---

## 🛠️ Технологический стек

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                         │
├─────────────────────────────────────────────────────────────┤
│  React 19  │  TypeScript  │  Tailwind CSS  │  Framer Motion │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    State & Routing                           │
├─────────────────────────────────────────────────────────────┤
│  React Router v7  │  React Context  │  Custom Hooks        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Integration                               │
├─────────────────────────────────────────────────────────────┤
│  Telegram Web App SDK  │  Cloud Storage  │  Crypto-js (AES)  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Utilities                                │
├─────────────────────────────────────────────────────────────┤
│  Day.js (dates)  │  Recharts (charts)  │  Lucide (icons)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Установка

### Требования

- **Node.js** >= 18
- **npm** >= 9

### Быстрый старт

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/body-tweaker.git
cd body-tweaker

# 2. Установите зависимости
npm install

# 3. Создайте .env файл
echo "VITE_STORAGE_KEY=ваш-секретный-ключ-минимум-12-символов" > .env

# 4. Запустите dev сервер
npm run dev

# 🎉 Приложение доступно на http://localhost:5173
```

---

## 📱 Развертывание в Telegram

<details>
<summary><b>📝 Пошаговая инструкция (нажмите чтобы раскрыть)</b></summary>

### 1️⃣ Создайте бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot` и следуйте инструкциям
3. Выберите имя и юзернейм для бота
4. Сохраните **токен бота**

### 2️⃣ Создайте Mini App

1. В @BotFather отправьте `/newapp`
2. Выберите вашего бота
3. Введите URL приложения (см. следующий шаг)
4. Получите `tgWebAppData`

### 3️⃣ Разверните приложение

```bash
# Соберите продакшн версию
npm run build

# Загрузите папку 'dist' на хостинг:
# • Vercel (рекомендуется) — https://vercel.com
# • Netlify — https://netlify.com
# • GitHub Pages — https://pages.github.com
# • Любой другой статический хостинг
```

> ⚠️ **Важно**: Telegram Mini Apps требуют **HTTPS** для работы в продакшене. Большинство современных хостингов (Vercel, Netlify, GitHub Pages) предоставляют HTTPS автоматически. При использовании собственного сервера убедитесь, что настроен SSL-сертификат.

### 4️⃣ Готово! 🎉

Откройте вашего бота в Telegram и нажмите кнопку меню

</details>

---

## 🎮 Использование

### Основные экраны

| Экран | Описание | Сочетания |
|-------|----------|------------|
| **🗺️ Карта** | Метаболическая карта с текущей фазой | Тап для деталей |
| **⏱️ Таймер** | Таймер голодания с прогрессом | Старт/стоп |
| **🌬️ Дыхание** | Дыхательные практики | Выбор программы |
| **📊 История** | История всех сессий | Календарь + список |

### Навигация

👆 **Перетащите плавающую панель внизу экрана** для переключения между экранами

---

## 🔐 Безопасность и приватность

| Аспект | Реализация |
|--------|------------|
| 🔐 **Шифрование** | AES-256 для всех локальных данных |
| ☁️ **Cloud Storage** | Telegram Cloud Storage с автоматической синхронизацией |
| ❌ **Нет трекинга** | Никакой аналитики или сбора данных |
| 🚫 **Нет аккаунта** | Работает мгновенно без регистрации |
| 📱 **Данные** | Хранятся только локально и в Telegram Cloud |

---

## 📁 Структура проекта

```
src/
├── app/                      # Основное приложение
│   ├── Layout.tsx            # Главный layout с draggable dock
│   ├── WelcomeScreen.tsx     # Первый запуск (Terms)
│   └── modals/               # Модальные окна (Settings, Info, Guide)
├── features/                 # Функциональные модули
│   ├── fasting/              # Голодание
│   │   ├── context/TimerContext.tsx
│   │   ├── hooks/useFastingTimer.ts
│   │   ├── data/schemes.ts   # Протоколы (14ч, 16ч, 24ч...)
│   │   ├── data/stages.ts    # 11 метаболических фаз
│   │   └── components/      # UI компоненты
│   ├── breathing/            # Дыхание
│   ├── biorhythm/            # Биоритмы
│   ├── history/              # История
│   └── articles/             # Статьи
├── contexts/                 # React Context
├── hooks/                    # Custom hooks
├── utils/                    # Утилиты (storage, sounds, cn)
└── main.tsx                  # Точка входа (Telegram SDK init)
```

---

## 🧪 Команды разработки

| Команда | Описание |
|---------|-----------|
| `npm run dev` | Запустить dev сервер |
| `npm run build` | TypeScript проверка + Vite сборка |
| `tsc -b` | Только TypeScript проверка |
| `npm run lint` | ESLint проверка |
| `npm run preview` | Предпросмотр продакшн сборки |
| `npm run generate-icons` | Сгенерировать PWA иконки |

---

## 🎨 Кастомизация

### Изменить протоколы голодания

Отредактируйте `src/features/fasting/data/schemes.ts`:

```typescript
export const FASTING_SCHEMES: FastingScheme[] = [
  {
    id: 'custom-20h',
    title: '20ч: Кастомный',
    hours: 20,
    color: 'text-purple-600 dark:text-purple-400',
    icon: Clock,
  },
  // ... добавьте свои схемы
];
```

### Новые дыхательные паттерны

Отредактируйте `src/features/breathing/data/patterns.ts`

---

## 🚀 Production Build

```bash
# Сборка с оптимизациями
npm run build

# Результат:
# dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js (281 KB - lazy loaded)
# │   ├── MetabolismMapPage-[hash].js (14 KB)
# │   ├── FastingPage-[hash].js (19 KB)
# │   └── ... (code splitting)
# └── sw.js (Service Worker)
```

**Оптимизации:**
- ✨ Lazy loading страниц (-26% main bundle)
- ⚡ React.memo для компонентов
- 🎯 Оптимизированные анимации
- 💾 In-memory cache для storage

---

## 🤝 Участие в разработке

Мы приветствуем вклад! 🎉

1. Fork репозитория
2. Создайте feature branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m '✨ Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Pull Request

### Стандарты кода

- ✅ Используйте **TypeScript** для типизации
- ✅ Следуйте **ESLint** правилам
- ✅ Functional Components + Hooks
- ✅ Добавляйте `displayName` для memoized компонентов

---

## 📝 Лицензия

Этот проект лицензирован под **MIT License** — см. файл [LICENSE](LICENSE)

---

## 🙏 Благодарности

- **Telegram Team** — за отличный Mini App SDK
- **Framer Motion** — за красивые анимации
- **Научному сообществу** — за исследования по голоданию и здоровью
- Все вдохновители и тестировщики! 🙌

---

<div align="center">

**Сделано с ❤️ для улучшения здоровья**

[⬆ Вернуться к началу](#-body-tweaker) • [📧 Контакты](mailto:your-email@example.com)

</div>

---

## English README

### 🧬 Body Tweaker

Scientific biohacking Telegram Mini App for intermittent fasting, breathing exercises, and biorhythm tracking.

#### Features
- ⏳ **Fasting Timer** with metabolic map (11 phases)
- 🌬️ **Breathing Exercises** (4 programs + ambient sounds)
- 📊 **Biorhythm Calculator** (physical, emotional, intellectual)
- 📚 **Knowledge Base** with scientific articles
- 🔒 **Encrypted Cloud Storage** (AES-256 + Telegram Cloud)

#### Quick Start

```bash
git clone https://github.com/your-username/body-tweaker.git
cd body-tweaker
npm install
echo "VITE_STORAGE_KEY=your-secret-key" > .env
npm run dev
```

#### Build

```bash
npm run build
# Deploy the 'dist' folder to your hosting
```

#### Tech Stack

- React 19 + TypeScript + Vite
- Telegram Web App SDK
- Framer Motion (animations)
- Tailwind CSS (styling)

#### License

MIT License - see [LICENSE](LICENSE) for details

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
