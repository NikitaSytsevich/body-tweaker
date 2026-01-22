# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Body Tweaker is a Telegram Mini Web App for scientific biohacking. It helps users track intermittent fasting, breathing exercises, biorhythms, and provides educational articles.

**Technology Stack:**
- React 19 + TypeScript + Vite
- Telegram Web App SDK (@twa-dev/sdk)
- Framer Motion (animations)
- React Router v7
- Tailwind CSS
- Recharts (charts)
- Day.js (date/time)
- Crypto-js (encryption)

## Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # TypeScript check + Vite build

# Lint
npm run lint         # Run ESLint

# Preview
npm run preview      # Preview production build
```

## Architecture

### App Structure

```
src/
├── app/
│   ├── Layout.tsx           # Main layout with draggable navigation
│   ├── WelcomeScreen.tsx    # First-run terms screen
│   └── modals/              # Settings, Info, InstallGuide modals
├── features/
│   ├── fasting/             # Fasting timer & metabolism map
│   │   ├── context/TimerContext.tsx    # Global timer state
│   │   ├── hooks/useFastingTimer.ts    # Timer hook
│   │   ├── data/schemes.ts             # Protocol definitions
│   │   └── data/stages.ts              # Metabolic phases
│   ├── breathing/           # Breathing exercises
│   │   ├── data/patterns.ts            # Exercise patterns
│   │   └── hooks/useBreathingSession.ts
│   ├── biorhythm/          # Biorhythm charts
│   ├── history/            # Activity history
│   └── articles/           # Educational articles
├── hooks/
│   ├── useStorage.ts       # React hook for persistent storage
│   └── useAddToHomeScreen.ts
├── utils/
│   ├── storage.ts          # Cloud + local storage with encryption
│   ├── sounds.ts           # Audio utilities
│   └── cn.ts               # clsx + tailwind-merge
└── main.tsx                # Entry point (Telegram SDK init)
```

### Key Architectural Patterns

**1. Telegram Cloud Storage with Fallback**

The app uses Telegram CloudStorage with automatic fallback to localStorage. All data is encrypted using AES with a key from `VITE_STORAGE_KEY`. Storage utilities are in `src/utils/storage.ts`:
- `storageGet/ storageSet` - Basic string storage
- `storageGetJSON/ storageSetJSON` - JSON storage
- `storageGetHistory/ storageSaveHistory/ storageUpdateHistory` - Chunked history storage (bypasses 4096 byte limit)

**2. Feature-Based Organization**

Each feature (fasting, breathing, biorhythm, articles) is self-contained with:
- `components/` - Feature-specific UI components
- `hooks/` - Feature-specific hooks
- `data/` - Static data (schemes, patterns, content)
- `*.tsx` page files

**3. Global State with Context**

`TimerContext.tsx` provides global fasting timer state across the app. It handles:
- Timer state and persistence
- Phase change detection and notifications
- History recording on completion

**4. Custom Navigation**

The app uses a custom draggable bottom navigation implemented in `Layout.tsx`. It's not using standard React Router navigation but instead manages page visibility with the `PageView` component.

**5. First-Run Flow**

`App.tsx` checks for `has_accepted_terms` storage key. If not present, shows `WelcomeScreen.tsx` before the main app.

### Important Details

- **Environment Variable**: `VITE_STORAGE_KEY` is used for encryption. Must be set in production builds.
- **History Chunking**: History records are split into chunks of 8 items to bypass Telegram's 4096 byte storage limit.
- **Telegram SDK**: Initialized in `main.tsx` with header/background color configuration.
- **Route Handling**: Special handling for article detail pages (`/articles/*`) which hide the main navigation and header.
- **Notifications**: Phase change notifications are handled through `TimerContext` and displayed via `ToastNotification` component.

### Data Flow

1. **Fasting Timer**: TimerContext → storage (encrypted) → persisted across sessions
2. **History Records**: On timer stop → record created → chunked storage → displayed in HistoryPage
3. **Settings**: Stored in `user_settings` key, retrieved for notification preferences

### UI Components

Common UI components in `src/components/ui/`:
- `Modal.tsx` - Base modal with Framer Motion animations
- `ConfirmModal.tsx` - Confirmation dialogs
- `DatePicker.tsx` - Date selection
- `SegmentedControl.tsx` - Segmented control
- `ToastNotification.tsx` - Toast notifications
