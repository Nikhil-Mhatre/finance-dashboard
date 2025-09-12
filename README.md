# AI Finance Dashboard

> Modern personal finance management platform with AI-powered insights, advanced analytics, and real-time dashboards.

## Overview

**AI Finance Dashboard** is a fullstack web application that helps users manage personal finances, track transactions, analyze spending, and receive actionable recommendations powered by Google Gemini AI. It features intuitive dashboards, interactive charts, robust authentication, and optimized performance using state-of-the-art technologies.

---

## Features

- **User Authentication:** Secure registration and login with JWT and bcrypt hashing.
- **AI Financial Insights:** Automated spending analysis, budget recommendations, and risk assessments using Gemini AI.
- **Dashboard Analytics:** Real-time overview of balances, income, expenses, and investments.
- **Interactive Charts:** Visualize financial trends and spending breakdowns using Chart.js.
- **Transaction Management:** Easily record income and expenses with rich categorization.
- **Account Management:** Create and view multiple financial accounts.
- **Budget Tracking:** Set goals and monitor utilization.
- **Alerts \& Notifications:** Get notified about budget limits, unusual spending, and opportunities.
- **Real-Time Updates:** Instant data sync using Redis Pub/Sub and WebSockets.
- **Secure \& Responsive:** Modern UI with dark mode, Tailwind CSS, Helmet/CORS security.
- **TypeScript Everywhere:** End-to-end type safety for data models and API responses.

---

## Tech Stack

### Backend

- **Express.js** (TypeScript)
- **Prisma ORM** + **PostgreSQL**
- **Google Gemini AI API**
- **Redis** (Caching \& Pub/Sub)
- **JWT Authentication \& bcrypt**
- **Zod** (Validation)
- **Morgan, Helmet, Compression, CORS**

### Frontend

- **Next.js 15+** (App Router)
- **React 19+**
- **Tailwind CSS v4 / Headless UI**
- **Chart.js / react-chartjs-2**
- **Socket.io Client (Real-Time updates)**
- **Axios** (API client)
- **React Context \& Hooks**
- **TypeScript**

---

## Project Structure

```plaintext
/
├── backend/            # Express API (src/, prisma/, services/, routes/)
├── frontend/           # Next.js app (src/pages, components, contexts, lib)
├── package.json        # (frontend and backend each, or unified - see your repo)
├── pnpm-lock.yaml
├── next.config.ts      # Frontend config
├── tsconfig.json       # TypeScript config
├── README.md           # << You are here!
```

Main folders may include:

- `/src` (shared for API/routes/components/services as per each app)
- `/prisma` (schema \& seed scripts)
- `/services` (AI, Redis, business logic)
- `/routes` (Express API endpoints)
- `/contexts` (React Context API for authentication)
- `/components` (React UI components)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** or **npm** (per your configuration)
- **PostgreSQL** instance
- (Optional) **Redis** instance (local or managed)
- Google Gemini AI API key

### 1. Setup Environment

Copy `.env.example` to `.env` and fill in values for:

```env
DATABASE_URL=postgres://user:password@host:port/dbname
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=your_super_secret_key
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

#### Migrate \& Seed

```bash
pnpm run migrate:dev     # Runs Prisma migrations (backend)
pnpm run seed            # Seeds initial data
```

Or use available scripts per your `package.json`.

### 4. Start Backend

```bash
pnpm run dev       # Runs backend in dev mode with tsx & nodemon
```

### 5. Start Frontend

```bash
pnpm run dev       # Runs Next.js frontend
```

Visit `http://localhost:3000` in your browser.

---

## API Documentation

Key API endpoints:

| Path                                      | Description                 |
| :---------------------------------------- | :-------------------------- |
| `POST /api/auth/register`                 | Register new user           |
| `POST /api/auth/login`                    | Login \& obtain JWT         |
| `GET /api/auth/profile`                   | Get profile info            |
| `GET /api/dashboard/stats`                | Overview statistics         |
| `GET /api/dashboard/analytics/categories` | Category insights           |
| `POST /api/transactions`                  | Record transaction          |
| `GET /api/transactions`                   | List paginated transactions |
| `GET /api/accounts`                       | Get all accounts            |
| `POST /api/accounts`                      | Create new account          |
| `GET /api/ai/insights`                    | AI-powered recommendations  |

---

## Customization

- **Theming:** Tailwind CSS + CSS variables for dark mode, easy extension in `globals.css`.
- **Component Reusability:** Modular React components and context providers.
- **Performance:** SWC minification, standalone Next.js builds, Redis caching.
- **Security:** Helmet, CORS policies, strict header configuration.

---

## Contributing

Pull requests and issues welcome!

- Ensure code follows existing patterns and conventions (TypeScript, Tailwind CSS, Prisma).
- Run lint and type-check scripts before submitting:

```bash
pnpm run lint
pnpm run type-check
```

---

## License

MIT – Free for personal and commercial use. See `LICENSE` for details.

---

## Credits

Developed by the **Finance Dashboard Team**
Powered by **Google Gemini AI**, **Express.js**, **Next.js**, and **Tailwind CSS**.

---

## Screenshots

_Add your dashboard, AI insights, and analytics page screenshots here for visual reference._

---

## Contact

For support or business inquiries, reach out via GitHub Issues or email listed in the repo.

---

<div style="text-align: center">⁂</div>

[^1]: next.config.ts
[^2]: package.json
[^3]: tsconfig.json
[^4]: globals.css
[^5]: layout.tsx
[^6]: page.tsx
[^7]: layout.tsx
[^8]: page.tsx
[^9]: page.tsx
[^10]: page.tsx
[^11]: page.tsx
[^12]: index.ts
[^13]: api.ts
[^14]: utils.ts
[^15]: AuthContext.tsx
[^16]: AIInsights.tsx
[^17]: AuthGuard.tsx
[^18]: FinancialCharts.tsx
[^19]: LoadingScreen.tsx
[^20]: TransactionForm.tsx
