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
npm run dev          # Start dev server (http://localhost:5173)

# Build & Type Check
npm run build        # Run TypeScript check + Vite build
tsc -b              # TypeScript check only (without build)

# Code Quality
npm run lint         # Run ESLint

# Preview & Analysis
npm run preview      # Preview production build locally
# After build, open dist/stats.html for bundle analysis

# Assets
npm run generate-icons  # Generate PWA icons from source SVG

# Audit (for sharing with AI tools)
npm run audit           # Generate code audit files in audit-output/
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
│   │   ├── data/stages.ts              # Metabolic phases
│   │   └── data/preparationSteps.ts    # Pre-fast preparation guide
│   ├── breathing/           # Breathing exercises
│   │   ├── data/patterns.ts            # Exercise patterns
│   │   └── hooks/useBreathingSession.ts
│   ├── biorhythm/          # Biorhythm charts
│   │   └── hooks/useBiorhythms.ts      # Biorhythm calculations
│   ├── history/            # Activity history
│   └── articles/           # Educational articles
├── contexts/
│   └── ThemeContext.tsx    # Dark mode theme management
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
- Timer state and persistence (async initialization with `isLoading` flag)
- Phase change detection and notifications
- History recording on completion

**4. Custom Navigation (Draggable Dock)**

The app uses a custom draggable bottom navigation implemented in `Layout.tsx`. Key implementation details:
- Not using standard React Router navigation for main pages - instead manages page visibility with the `PageView` component
- Navigation state is controlled by dragging a floating dock with spring animations (Framer Motion)
- All four main pages (Map, Timer, Breathing, History) are mounted simultaneously, with visibility toggled via CSS
- Article detail pages (`/articles/*`) are handled differently and hide the main navigation
- Navigation position is determined by current URL path (via React Router), not by stored state

**5. First-Run Flow**

`App.tsx` checks for `has_accepted_terms` storage key. If not present, shows `WelcomeScreen.tsx` before the main app.

### Important Details

- **Environment Variable**: `VITE_STORAGE_KEY` is used for encryption. Must be set in production builds.
- **History Chunking**: History records are split into chunks of 8 items (HISTORY_CHUNK_SIZE) to bypass Telegram's 4096 byte storage limit. Supports up to 1000 records (HISTORY_MAX_CHUNKS = 125).
- **Telegram SDK**: Initialized in `main.tsx` with header/background color configuration. Always call `WebApp.ready()` and `WebApp.expand()` to ensure proper Telegram integration.
- **Route Handling**: Special handling for article detail pages (`/articles/*`) which hide the main navigation and header.
- **Notifications**: Phase change notifications are handled through `TimerContext` and displayed via `ToastNotification` component.
- **No Test Suite**: This project does not currently have automated tests.

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

### Theme System

The app uses a custom `ThemeProvider` (ThemeContext.tsx) that:
- Auto-detects Telegram's theme (light/dark)
- Syncs with Telegram's theme changes via `WebApp.onEvent('themeChanged')`
- Updates Telegram header/background colors to match
- Applies `dark` class to document root

### Build Configuration

The Vite config (`vite.config.ts`) includes:
- **Bundle Splitting**: Separates React, Framer Motion, icons, charts, Telegram SDK, and utilities into separate chunks for optimal caching
- **PWA Support**: Service worker with caching for fonts, images, and Telegram assets
- **Terser Optimization**: Removes console.log, debugger, dead code, and comments in production
- **Bundle Analysis**: Generates `dist/stats.html` after build - open this file to inspect bundle size and composition

### Storage Implementation Details

**Encryption:**
- All data is encrypted using AES-256 before storage via crypto-js
- Keys are namespaced with `bt_app_` prefix
- Automatic fallback from Telegram Cloud to localStorage

**History Chunking:**
- Each chunk holds 8 records (~400 bytes each, under 4096 byte limit)
- Supports up to 1000 history records (125 chunks, configurable via HISTORY_MAX_CHUNKS)
- Automatic migration from legacy non-chunked format
- Empty chunks are automatically deleted to save space

**Working with Storage:**
```typescript
// Always use the storage utilities, never direct localStorage/WebAPI calls
import { storageGet, storageSet, storageGetJSON, storageSetJSON } from '@/utils/storage';

// For history records (chunked storage)
import { storageSaveHistory, storageGetHistory, storageUpdateHistory } from '@/utils/storage';

// All storage operations are async - always await or handle promises
await storageSet('key', 'value');
const data = await storageGetJSON('key', defaultValue);
```

## Common Patterns & Gotchas

**Telegram SDK Integration:**
- The app runs both inside Telegram (via Mini App) and standalone as PWA
- Always check `WebApp.initDataUnsafe?.user` before accessing user data
- Theme colors must be synced with Telegram using `WebApp.setHeaderColor()` and `WebApp.setBackgroundColor()`

**Navigation Gotchas:**
- Do not use `<Link>` or `useNavigate()` for main page navigation - it won't work with the custom dock
- Use `useNavigate()` only for article detail pages and modal routes
- Main pages are switched via visibility toggling in `Layout.tsx`

**Styling:**
- Use the `cn()` utility (from `src/utils/cn.ts`) for conditional className merging
- Tailwind classes are available - prefer utility classes over custom CSS
- Dark mode is handled automatically via ThemeContext - use `dark:` prefix for dark mode styles

**Component Organization:**
- Feature components should be co-located with their feature in `src/features/*/`
- Reusable UI components go in `src/components/ui/`
- Keep components small and focused - extract complex logic into custom hooks
