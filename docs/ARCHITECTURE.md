# AI Playground Architecture (Phase 1)

This document defines the project split only.
No gameplay feature logic is implemented in this phase.

## Current State (Before Split)

- The app is frontend-only (`Vite + React`).
- AI calls (`Gemini`) happen directly inside React helper files.
- Firebase Storage + Firestore writes are called directly from the browser.
- Scoring and persistence logic are mixed with UI components.

## Target State (After Split)

## Frontend (`/`)

Keep:
- Vite + React
- Tailwind CSS
- React Router
- Firebase Auth (client sign-in)

Add soon (not implemented in this phase):
- `zustand` for game/session state
- `react-konva` + `konva` (or `fabric`) for drawing

Responsibilities:
- Authentication UX and route guards
- Drawing UI and gameplay screens
- Calling backend APIs
- Displaying scoreboards/stories/challenges

## Backend (`/server`)

Stack:
- Node.js + Express
- MongoDB (Mongoose)
- Firebase Admin SDK (token verification + storage integration)
- Gemini/Vertex adapters

Responsibilities:
- Validate Firebase ID token
- Receive drawing metadata and prompts
- Orchestrate AI calls
- Persist game data and leaderboard in MongoDB
- Generate scheduled daily challenges
- Provide stable API contracts to frontend

## Phase-1 API Surface (Scaffolded)

Base URL: `/api/v1`

- `POST /ai/evaluate-drawing`
- `POST /ai/generate-story`
- `POST /ai/coach`
- `POST /ai/mutate`
- `POST /games/sessions`
- `GET /games/sessions/:id`
- `POST /drawings`
- `GET /drawings/:id`
- `POST /stories`
- `GET /stories/:id`
- `GET /leaderboard`
- `GET /challenges/daily`
- `POST /challenges/daily/generate`
- `GET /users/:id/profile`
- `GET /users/:id/achievements`

All routes currently return `501 Not implemented yet`.

## Suggested Domain Models

- `User` (xp, level, streak, badges, avatarUrl)
- `GameSession` (mode, status, scoreBreakdown, createdBy)
- `Drawing` (userId, gameSessionId, prompt, imageUrl, aiScore, creativityScore)
- `Story` (userId, title, chapters, drawingIds)
- `Challenge` (prompt, date, difficulty, leaderboardSnapshot)
- `LeaderboardEntry` (userId, totalScore, season, rank)
- `Achievement` (key, label, unlockedAt)

## Data Flow (High Level)

1. Frontend authenticates with Firebase Auth.
2. Frontend sends Firebase ID token to backend in `Authorization` header.
3. Backend verifies token using Firebase Admin.
4. Backend processes request, calls AI provider if needed.
5. Backend stores canonical data in MongoDB.
6. Backend returns normalized response DTO to frontend.
7. Frontend updates local state (future: Zustand store).

## Security Boundary

- No direct Gemini calls from frontend.
- No direct Firestore score writes from frontend.
- Score formula and leaderboard ranking are backend-owned.
- Frontend becomes presentation + interaction only.

## Deployment Split

- Frontend: Firebase Hosting (or Vercel/Netlify)
- Backend: Cloud Run or Render
- MongoDB: Atlas
- Firebase Storage remains for image assets

## Next Phase (When You Provide Logic)

After you provide feature flow, implement in this order:
1. Auth middleware + request validation (`zod`)
2. MongoDB models and repositories
3. AI service adapters (Gemini vision/story)
4. One mode end-to-end (`Creative Quest`)
5. Shared scoring policy + leaderboard aggregation
6. Daily challenge scheduler (`node-cron`)
