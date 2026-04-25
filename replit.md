# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Clerk (Replit-managed)
- **Frontend**: React 19 + Vite + Tailwind CSS v4

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### Space Hangman (`artifacts/space-hangman`)
- React + Vite frontend, deployed at `/`
- Full-stack space-themed hangman game
- Features: Solo play, Daily Challenge, Leaderboard, Shareable score cards, Google login via Clerk
- Black hole canvas animation (canvas2D) that grows with wrong guesses
- Game engine: `src/hooks/use-game.ts` (useReducer)
- Pages: Home, /game, /daily, /leaderboard, /sign-in, /sign-up

### API Server (`artifacts/api-server`)
- Express 5 backend
- Routes: /api/scores, /api/scores/me, /api/scores/stats, /api/words, /api/daily, /api/daily/leaderboard
- Clerk auth via `@clerk/express`
- DB: `lib/db/src/schema/scores.ts` → `scores` table

## Database Schema

### scores table
- id, userId, userName, userAvatar, score, streak, word, mode (solo|daily), won, createdAt

## Notes on Dependencies

- `@react-three/fiber` and Three.js incompatible with React 19 — using canvas2D for black hole animation instead
- `minimumReleaseAgeExclude` in pnpm-workspace.yaml includes `@clerk/*`, `three`, `@react-three/fiber`, `@react-three/drei`, `html2canvas`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
