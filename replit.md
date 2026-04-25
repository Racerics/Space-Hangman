# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Auth**: Firebase Authentication (Google sign-in)
- **Database**: Firestore (client-side direct access)
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **API codegen**: Orval (from OpenAPI spec) — used for words/daily endpoints only

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### Space Hangman (`artifacts/space-hangman`)
- React + Vite frontend, deployed at `/`
- Full-stack space-themed hangman game
- Features: Solo play, Daily Challenge, Leaderboard, Shareable score cards, Google login via Firebase Auth
- Black hole canvas animation (canvas2D) that grows with wrong guesses
- Game engine: `src/hooks/use-game.ts` (useReducer)
- Pages: Home, /game, /daily, /leaderboard, /sign-in

### API Server (`artifacts/api-server`)
- Express 5 backend
- Routes: /api/words (word list), /api/daily (daily word)
- No auth middleware — Firestore handles auth on client

## Firebase

- Project: `all-in-studio-007`
- Config in: `artifacts/space-hangman/src/lib/firebase.ts`
- Auth context: `artifacts/space-hangman/src/lib/auth-context.tsx`
- **IMPORTANT**: Firestore Security Rules must be set in Firebase Console:
  - Allow authenticated users to write scores
  - Allow anyone to read scores (for leaderboard)

### Firestore scores collection schema
- userId, userName, userAvatar, score, streak, word, mode (solo|daily), won, createdAt (serverTimestamp)

## Notes on Dependencies

- `@react-three/fiber` and Three.js incompatible with React 19 — using canvas2D for black hole animation instead
- Clerk has been fully removed in favor of Firebase Authentication

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
