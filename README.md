<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Refactor and improvise the attached README.md file as latest implementation of Google oAuth.

Here is an updated README.md tailored to the latest Google OAuth session-based implementation, Redis-backed sessions, and your current codebase.

# AI Finance Dashboard

Modern personal finance management platform with AI-powered insights, advanced analytics, and real-time dashboards. Now secured with Google OAuth 2.0 and Redis-backed session authentication.

## Overview

AI Finance Dashboard is a full‑stack web application to manage personal finances, track transactions, analyze spending, and receive actionable recommendations powered by Google Gemini AI. It features Google OAuth sign-in, session-based auth with Redis, intuitive dashboards, interactive charts, and optimized performance.

---

## Features

- Google OAuth 2.0 sign-in with session-based auth (no passwords to manage)
- AI financial insights using Gemini (spending patterns, budgets, risks)
- Dashboard analytics: balances, income, expenses, investments
- Interactive charts (spending breakdowns, top categories)
- Transaction management with rich categorization
- Account management (checking, savings, credit card, etc.)
- Budget tracking and alerting
- Real-time updates via Redis Pub/Sub
- Secure and responsive UI (Helmet, CORS, Tailwind)
- End-to-end TypeScript types

---

## Tech Stack

### Backend

- Express.js (TypeScript)
- Prisma ORM + PostgreSQL
- Google Gemini AI API
- Redis
  - node-redis for session store
  - ioredis for application caching and Pub/Sub
- Passport + passport-google-oauth20
- express-session
- Zod validation
- Helmet, CORS, Compression, Morgan

### Frontend

- Next.js 15+ (App Router)
- React 19+
- Tailwind CSS v4 / Headless UI / Heroicons
- Chart.js / react-chartjs-2
- Axios (withCredentials enabled)
- React Context and hooks
- TypeScript

---

## Project Structure

```plaintext
/
├── backend/            # Express API (src/, prisma/, services/, routes/)
├── frontend/           # Next.js app (src/app, components, contexts, lib)
├── package.json        # per app (or unified), scripts and config
├── pnpm-lock.yaml
├── next.config.ts      # Frontend config
├── tsconfig.json       # TypeScript config
├── README.md           # << You are here!
```

Key folders:

- /src/routes Express API routes (auth, dashboard, accounts, transactions, ai)
- /src/config OAuth and configuration (Google strategy)
- /src/services Redis service, AI service
- /src/middleware Auth middleware (session-based)
- /prisma Schema and seed scripts
- /frontend/src App router, components, contexts, lib

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.x
- pnpm or npm
- PostgreSQL instance
- Redis instance (local or managed)
- Google Cloud OAuth 2.0 Client
- Google Gemini API key

### 1) Environment Variables

Copy .env.example to .env and set:

```env
# Core
DATABASE_URL=postgres://user:password@host:port/dbname
REDIS_URL=redis://localhost:6379

# Sessions and OAuth
SESSION_SECRET=your_super_secret_session_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Frontend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Notes:

- Use SESSION_SECRET with high entropy.
- For local dev over HTTP, cookie.secure=false and sameSite=lax are used automatically by the server.

### 2) Google Cloud Console Setup

- Create/select a project at Google Cloud Console.
- APIs \& Services → Credentials → Create OAuth 2.0 Client (Web application).
- Authorized JavaScript origins:
  - http://localhost:3000
- Authorized redirect URIs (must match server mount path):
  - http://localhost:3001/api/auth/google/callback

Ensure the callback path exactly matches /api/auth/google/callback.

### 3) Install Dependencies

```bash
pnpm install
```

Make sure the backend has:

- passport, passport-google-oauth20
- express-session, connect-redis
- redis (node-redis v4) for session store
- ioredis for application caching

### 4) Database Setup

```bash
pnpm run migrate:dev     # Prisma migrations
pnpm run seed            # Optional: seed initial data
```

### 5) Run Backend

```bash
pnpm run dev    # tsx + nodemon dev server at http://localhost:3001
```

Health check:

- GET http://localhost:3001/health

### 6) Run Frontend

```bash
pnpm run dev    # Next.js at http://localhost:3000
```

---

## Authentication

The app uses Google OAuth with session-based authentication:

- Session store: Redis via connect-redis + node-redis (separate from ioredis)
- OAuth endpoints:
  - GET /api/auth/google — start Google OAuth
  - GET /api/auth/google/callback — OAuth redirect/callback
  - GET /api/auth/me — current authenticated user
  - GET /api/auth/status — session status
  - POST /api/auth/logout — clear session

Frontend

- Axios is configured with withCredentials: true to send cookies.
- CORS is configured on the server with credentials: true and exact origin.

Linking users

- If a user with the same email exists, the Google account is linked (adds googleId, avatar).
- Otherwise, a new user is created and default accounts are provisioned.

---

## API Endpoints

Key API endpoints (condensed):

Authentication (Google OAuth)

- GET /api/auth/google — initiate OAuth
- GET /api/auth/google/callback — OAuth callback
- GET /api/auth/me — current user
- GET /api/auth/status — auth status
- POST /api/auth/logout — logout

Dashboard

- GET /api/dashboard/stats — summary metrics
- GET /api/dashboard/transactions/recent — recent transactions
- GET /api/dashboard/analytics/categories — category breakdown

Transactions

- GET /api/transactions — paginated list with filters
- POST /api/transactions — create transaction

Accounts

- GET /api/accounts — list accounts
- POST /api/accounts — create account
- GET /api/accounts/:id — account by id

AI Insights

- GET /api/ai/insights — AI recommendations
- POST /api/ai/analyze — generate fresh insights
- GET /api/ai/summary — insights summary

---

## Sessions and Redis

- Session store uses node-redis v4 client with connect-redis.
- Application caching and Pub/Sub use ioredis (redisService).
- Do not pass an ioredis client into connect-redis v7; use a node-redis client for sessions to avoid Redis “ERR syntax error”.

---

## Frontend Integration

- Axios base URL: NEXT_PUBLIC_API_URL (default http://localhost:3001)
- Axios withCredentials: true (cookies)
- AuthContext manages session state via /api/auth/status and /api/auth/me
- Login flow triggers window.location = `${API_BASE_URL}/api/auth/google`

---

## Security

- Helmet for HTTP headers
- CORS with explicit origin and credentials
- Session cookies: httpOnly, sameSite=lax (dev) or none (prod + HTTPS)
- No password storage; Google’s OAuth handles identity
- Zod validation on inputs

---

## Scripts

Common scripts (may vary based on your package.json):

- pnpm run dev — start backend dev server
- pnpm run build — compile TypeScript
- pnpm run migrate:dev — apply Prisma migrations
- pnpm run seed — seed database
- pnpm run lint — lint code
- pnpm run type-check — TypeScript checks

---

## Troubleshooting

- redirect_uri_mismatch
  - Ensure callbackURL is exactly /api/auth/google/callback in code.
  - Ensure Google Console Authorized redirect URI is http://localhost:3001/api/auth/google/callback.
- req.isAuthenticated is not a function
  - Ensure middleware order: session → passport.initialize() → passport.session() → routes.
- Redis ReplyError: ERR syntax error on SET
  - Use node-redis as the session store client; don’t pass an ioredis client to connect-redis v7.
- 401 after login on frontend
  - Ensure CORS credentials:true on server and axios withCredentials:true on client.
  - Ensure cookie sameSite/secure is set correctly for the environment.

---

## License

MIT – Free for personal and commercial use. See LICENSE for details.

## Credits

Developed by the Finance Dashboard Team
Powered by Google Gemini AI, Google OAuth, Express.js, Next.js, and Tailwind CSS.

## Screenshots

Add dashboard, AI insights, and analytics screenshots here.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: README.md
