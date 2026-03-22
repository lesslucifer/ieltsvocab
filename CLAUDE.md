# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm start         # Dev server at http://localhost:5174
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

No test runner is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in Firebase credentials from the Firebase Console (Project Settings > General > Your apps). The app runs in offline/localStorage-only mode if Firebase is not configured.

## Architecture

**React 18 + Vite PWA** — single-page app with no router; navigation is managed via a `currentView` state string in `App.jsx`.

### Data flow

There are two persistence layers, abstracted behind `src/data/hybridDataService.js`:

- **Authenticated users**: reads/writes go to **Firestore** (`src/firebase/firestoreService.js`), then mirrored to localStorage as an offline cache.
- **Unauthenticated / offline mode**: reads/writes go directly to **localStorage** (`src/utils/storage.js`).

`App.jsx` listens to Firebase Auth state via `onAuthChange`. On sign-in it calls `initializeUserData()` then `loadData()`; on sign-out or "skip login" it falls back to `initializeVocabulary()` from `src/data/vocabularyData.js`.

### Vocabulary data

- Static word definitions live in `src/data/ieltsVocabulary.js` (`ieltsVocabularyDatabase` array, 60 words).
- `src/data/vocabularyData.js` wraps that array with initialization logic (merging with localStorage state).
- Per-word mutable fields: `status` (mastered/learning/struggling), `lastReviewed`, `reviewCount`.

### Component layout

- **Desktop**: `Sidebar` (left nav) + `main` content area.
- **Mobile**: `MobileHeader` (top) + `main` content area + `TabBar` (bottom nav).
- Views rendered by `App.jsx#renderView()`: `Home`, `Browse`, `Study`, `Quiz`, `Progress`.
- Each component has a co-located `.css` file.

### Statistics / progress

`src/utils/statistics.js` — pure calculation functions (streak, accuracy, etc.).
`src/utils/storage.js` — all localStorage keys and read/write helpers; also `calculateStreak()`.

### PWA

Service worker at `public/sw.js`, manifest at `public/manifest.json`. Firestore IndexedDB persistence is enabled in `src/firebase/config.js` for offline Firestore support when authenticated.

### Styling

Global CSS custom properties (colors, spacing) are defined in `src/index.css`. No CSS framework — all styles are hand-written per component.
