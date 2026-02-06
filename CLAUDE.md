# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Summary

**Body Tweaker** is a Telegram Mini App (also works in a standalone browser) for fasting tracking, breathing practice, biorhythm charts, a metabolism map with phase details, a knowledge base of articles, and progress history. It stores data in Telegram Cloud Storage when available and falls back to localStorage, with AES client-side encryption.

## Commands

```bash
npm run dev            # Start dev server (http://localhost:5173)
npm run build          # TypeScript check + Vite build
npm run lint           # ESLint
npm run preview        # Preview production build
npm run generate-icons # Generate PWA icons
npm run audit          # Generate audit files (scripts/generate-audit.js)
npm run test           # Run unit tests (vitest)
npm run test:e2e       # Run Playwright E2E tests (requires `npx playwright install`)
```

## Routes and Navigation

- `/` — Metabolism map + knowledge base tab
- `/timer` — Fasting timer
- `/breathing` — Breathing practice
- `/biorhythm` — Biorhythm charts
- `/history` — History (fasting + breathing)
- `/profile` — Settings hub
- `/profile/settings/appearance`
- `/profile/settings/app`
- `/profile/settings/data`
- `/profile/settings/legal`
- `/profile/settings/about`
- `/articles/:slug` — Article detail (rendered inside `Layout`)
- `*` — Redirect to `/`

Navigation for main pages is a draggable dock in `src/app/Layout.tsx`. Main pages stay mounted and are shown/hidden via CSS; do not use React Router links for main tabs.

## Key Modules

- `src/app/Layout.tsx` — Main shell, dock navigation, lazy loading of feature pages.
- `src/app/WelcomeScreen.tsx` — First-run legal acceptance flow.
- `src/app/ProfilePage.tsx` and `src/app/settings/*` — Settings UI (theme, app install, data backup, legal docs, about).
- `src/features/fasting/*` — Fasting timer, protocols, and metabolism phases.
- `src/features/breathing/*` — Breathing practice, audio, and session logic.
- `src/features/biorhythm/*` — Biorhythm calculations and charts.
- `src/features/history/*` — History UI, stats, calendar, record editing.
- `src/features/articles/*` — Knowledge base list + detail pages.
- `src/contexts/ThemeContext.tsx` — Theme mode and Telegram theme sync.
- `src/utils/storage.ts` — Encrypted storage + CloudStorage fallback + history chunking.
- `src/utils/migrations.ts` — Data migrations (schema_version, legacy fixes).
- `src/utils/monitoring.ts` — Optional Sentry initialization + error capture.
- `src/utils/pwa.ts` — App-level PWA update/offline events.
- `src/utils/sounds.ts` — Ambient audio and SFX engine.
- `src/hooks/useStorage.ts` — Async storage hook for settings/data.
- `src/main.tsx` — Telegram WebApp init, safe-area insets, fullscreen request, Vercel analytics.
- `src/components/ui/ErrorBoundary.tsx` — Runtime crash UI + monitoring hook.

## Fasting Flow

- Protocols are defined in `src/features/fasting/data/schemes.ts` (7 protocols).
- Metabolism phases are defined in `src/features/fasting/data/stages.ts` (15 phases).
- `TimerContext` loads `fasting_scheme` and `fasting_startTime` on boot and persists changes.
- Starting/stopping the timer is handled by `toggleFasting()`.
- History record is saved on stop if duration > 60 seconds.
- `MetabolismMapPage` shows phase cards and a detail sheet with physiology, sensations, recommendations, and precautions.

## Breathing Flow

- Levels are in `src/features/breathing/data/patterns.ts` (0–12).
- `useBreathingSession()` drives inhale/hold/exhale phases, timers, and haptics.
- Session duration is fixed to 10 minutes in `BreathingPage`.
- History record is saved when session duration exceeds 15 seconds.
- Audio is controlled via `soundManager` (ambient tracks + SFX cues).

## History

- All records (fasting + breathing) are stored under `history_fasting`.
- `HistoryPage` loads, filters by type, and renders stats + calendar.
- `RecordDetails` allows editing start/end times and deleting records.
- History updates trigger a window event `bt:history-updated` to refresh UI.

## Articles

- Article metadata list: `src/features/articles/content/metadata.ts`.
- Each article lives in `src/features/articles/content/*.tsx` and is routed by slug.

## Storage and Security

- Encryption is AES with `VITE_STORAGE_KEY` from env.
- Production build throws if `VITE_STORAGE_KEY` is missing.
- Telegram Cloud Storage is used when available (SDK >= 6.9), otherwise localStorage.
- History is chunked: 8 records per chunk, up to 1000 records.
- Cloud writes can enter read-only mode; changes are queued locally and flushed when online.
- History retention can be limited via `VITE_HISTORY_RETENTION_DAYS`.
- Storage helpers are async; avoid direct localStorage access.

## Theme and Telegram Integration

- Theme modes: `light`, `dark`, `auto`. Stored in `theme_mode`.
- `ThemeProvider` syncs Telegram header/background colors and listens for `themeChanged` events.
- `main.tsx` applies safe-area insets and requests fullscreen when possible.

## Build, PWA, and Analytics

- PWA is configured in `vite.config.ts` using `vite-plugin-pwa` with runtime caching for fonts, images, and Telegram assets.
- PWA update/offline-ready events are surfaced via `bt:pwa-update` and `bt:pwa-offline-ready` and shown in `Layout`.
- Bundle analyzer creates `dist/stats.html` after build.
- `@vercel/analytics/react` is mounted in `src/main.tsx`.
- Optional Sentry monitoring is enabled when `VITE_SENTRY_DSN` is provided.

## Tests

- Unit tests: `npm run test` (vitest, jsdom).
- E2E: `npm run test:e2e` (Playwright, requires `npx playwright install` once).
