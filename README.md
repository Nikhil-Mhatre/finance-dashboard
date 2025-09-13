# 🤖 AI Finance Dashboard

> **Modern personal finance management platform powered by Google Gemini AI with intelligent insights, real-time analytics, and secure Google OAuth authentication.**

[![Deploy Status](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render)](https://render.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)

---

## 📸 Screenshots

### 🔐 Google OAuth Login

_Secure, one-click authentication with Google OAuth 2.0_

![Login Page](https://ai-finance-dashboard-screenshots.s3.ap-south-1.amazonaws.com/login-page.PNG)

### 📊 Dashboard Overview

_Real-time financial overview with AI-powered insights and interactive charts_

![Dashboard](https://ai-finance-dashboard-screenshots.s3.ap-south-1.amazonaws.com/dashboard-overview-1.PNG)

### 💳 Transaction Management

_Advanced filtering, sorting, and mobile-responsive transaction lists_

![Transactions](https://ai-finance-dashboard-screenshots.s3.ap-south-1.amazonaws.com/transactions-list.PNG)

### 📈 Analytics & Insights

_Deep analytics with spending breakdowns and AI recommendations_

![Analytics](https://ai-finance-dashboard-screenshots.s3.ap-south-1.amazonaws.com/analytics-charts.PNG)

### 📱 Mobile Experience

_Fully responsive design optimized for mobile devices_

![Mobile](https://ai-finance-dashboard-screenshots.s3.ap-south-1.amazonaws.com/mobile-responsive.PNG)

---

## ✨ Features

### 🤖 **AI-Powered Intelligence**

- **Smart Insights**: Automated spending analysis using Google Gemini AI
- **Budget Recommendations**: Personalized financial advice and alerts
- **Pattern Recognition**: Unusual spending detection and goal tracking
- **Predictive Analytics**: Future spending forecasts and trends

### 🔐 **Secure Authentication**

- **Google OAuth 2.0**: No passwords to manage, secure sign-in
- **Session Management**: Redis-backed sessions with automatic expiry
- **Account Linking**: Seamlessly connect existing accounts via email
- **Privacy First**: No sensitive data stored, Google handles identity

### 📊 **Advanced Analytics**

- **Real-Time Dashboards**: Live financial overview with key metrics
- **Interactive Charts**: Beautiful visualizations using Chart.js
- **Category Breakdown**: Detailed spending analysis by category
- **Performance Tracking**: Monitor financial goals and achievements

### 💳 **Transaction Management**

- **Smart Categorization**: Automatic transaction categorization
- **Multi-Account Support**: Checking, savings, credit cards, investments
- **Advanced Filtering**: Search, sort, and filter by multiple criteria
- **Bulk Operations**: Import/export and batch transaction management

### 🏦 **Account Management**

- **Multiple Account Types**: Support for all financial account types
- **Real-Time Balances**: Live balance updates with transaction impact
- **Account Linking**: Connect external accounts (future feature)
- **Investment Tracking**: Portfolio management and performance monitoring

### 🚀 **Modern Technology Stack**

- **TypeScript**: End-to-end type safety and developer experience
- **Real-Time Updates**: Redis Pub/Sub for instant data synchronization
- **Mobile Responsive**: Progressive web app with offline capabilities
- **Performance Optimized**: SWC compilation, Redis caching, and code splitting

---

## 🚀 Tech Stack

### **Backend**

- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe JavaScript development
- **Prisma ORM** - Modern database toolkit with PostgreSQL
- **Passport.js** - Google OAuth 2.0 authentication
- **Redis** - Session store (node-redis) + Application caching (ioredis)
- **Google Gemini AI** - Advanced financial insights and recommendations

### **Frontend**

- **Next.js 15+** - React framework with App Router
- **React 19+** - Latest React with concurrent features
- **Tailwind CSS v4** - Utility-first CSS framework
- **Headless UI** - Unstyled, accessible UI components
- **Chart.js** - Beautiful, responsive charts and graphs
- **Framer Motion** - Smooth animations and transitions

### **Infrastructure**

- **PostgreSQL** - Reliable, ACID-compliant database
- **Redis** - In-memory data structure store
- **Render** - Cloud platform for deployment
- **GitHub Actions** - CI/CD pipeline with automated testing

---

## 🛠️ Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** (recommended) or npm
- **PostgreSQL** database
- **Redis** instance
- **Google Cloud Console** project with OAuth setup

### 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/ai-finance-dashboard.git
cd ai-finance-dashboard
```

### 2️⃣ Install Dependencies

```

# Install all dependencies

pnpm install

# Or install separately

pnpm install --filter backend
pnpm install --filter frontend

```

### 3️⃣ Environment Setup

Create `.env` file in the project root:

```

# Database

DATABASE_URL="postgresql://username:password@localhost:5432/ai_finance_dashboard"

# Redis

REDIS_URL="redis://localhost:6379"

# Google OAuth 2.0

GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Sessions

SESSION_SECRET="your-ultra-secure-session-secret-key"

# URLs

FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"

# AI Services

GEMINI_API_KEY="your-gemini-api-key"

# Environment

NODE_ENV="development"

```

### 4️⃣ Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3001/api/auth/google/callback`
4. Copy Client ID and Secret to `.env`

### 5️⃣ Database Setup

```

# Generate Prisma client

pnpm prisma generate

# Run migrations

pnpm prisma migrate dev

# Seed database (optional)

pnpm prisma db seed

```

### 6️⃣ Start Development

```

# Start backend (Express API)

pnpm dev

# In another terminal, start frontend (Next.js)

cd frontend \&\& pnpm dev

# Or use concurrent mode

pnpm dev:all

```

Visit **http://localhost:3000** to see the application! 🎉

---

## 📁 Project Structure

```

ai-finance-dashboard/
├── 📁 backend/ \# Express.js API
│ ├── 📁 src/
│ │ ├── 📁 config/ \# OAuth \& app configuration
│ │ ├── 📁 middleware/ \# Auth \& validation middleware
│ │ ├── 📁 routes/ \# API route handlers
│ │ ├── 📁 services/ \# Business logic \& external services
│ │ └── 📄 index.ts \# Server entry point
│ ├── 📁 prisma/ \# Database schema \& migrations
│ └── 📄 package.json
├── 📁 frontend/ \# Next.js React app
│ ├── 📁 src/
│ │ ├── 📁 app/ \# App Router pages
│ │ ├── 📁 components/ \# Reusable UI components
│ │ ├── 📁 contexts/ \# React Context providers
│ │ ├── 📁 lib/ \# Utilities \& API client
│ │ └── 📁 types/ \# TypeScript definitions
│ └── 📄 package.json
├── 📁 .github/workflows/ \# CI/CD pipelines
├── 📄 README.md \# This file
├── 📄 docker-compose.yml \# Local development services
└── 📄 package.json \# Workspace configuration

```

---

## 🔌 API Endpoints

### **Authentication** (`/api/auth`)

```

GET /api/auth/google \# Initiate Google OAuth
GET /api/auth/google/callback \# OAuth callback handler
GET /api/auth/me \# Get current user
GET /api/auth/status \# Check auth status
POST /api/auth/logout \# Logout user

```

### **Dashboard** (`/api/dashboard`)

```

GET /api/dashboard/stats \# Overview statistics
GET /api/dashboard/analytics \# Category breakdowns
GET /api/dashboard/transactions \# Recent transactions

```

### **Transactions** (`/api/transactions`)

```

GET /api/transactions \# List with filtering \& pagination
POST /api/transactions \# Create new transaction
PUT /api/transactions/:id \# Update transaction
DELETE /api/transactions/:id \# Delete transaction

```

### **Accounts** (`/api/accounts`)

```

GET /api/accounts \# List user accounts
POST /api/accounts \# Create new account
GET /api/accounts/:id \# Get account details
PUT /api/accounts/:id \# Update account

```

### **AI Insights** (`/api/ai`)

```

GET /api/ai/insights \# Get AI recommendations
POST /api/ai/analyze \# Generate new analysis
GET /api/ai/summary \# Financial summary

```

---

## 🐳 Docker Development

```

# docker-compose.yml

version: '3.8'
services:
postgres:
image: postgres:15
environment:
POSTGRES_DB: ai_finance_dashboard
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
ports:

- "5432:5432"
  volumes:
- postgres_data:/var/lib/postgresql/data

redis:
image: redis:7-alpine
ports:

- "6379:6379"
  command: redis-server --appendonly yes
  volumes:
- redis_data:/data

volumes:
postgres_data:
redis_data:

```

**Start services:**

```

docker-compose up -d

```

---

## 🚀 Deployment

### **Deploy to Render**

1. **Create Services:**

   - **Backend**: Node.js service
   - **Frontend**: Static site (optional, if separate)
   - **Database**: PostgreSQL
   - **Redis**: Redis instance

2. **Environment Variables:**

```

# Production environment variables

DATABASE_URL=<render-postgres-url>
REDIS_URL=<render-redis-url>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
SESSION_SECRET=<secure-random-string>
FRONTEND_URL=<your-frontend-domain>
GEMINI_API_KEY=<your-gemini-key>
NODE_ENV=production

```

3. **Deploy via GitHub:**
   - Connect repository to Render
   - Configure auto-deploy from `main` branch
   - CI/CD pipeline handles testing & deployment

### **GitHub Actions CI/CD**

The project includes automated deployment pipeline:

- ✅ **Testing**: PostgreSQL + Redis integration tests
- 🔍 **Security**: Dependency audit & secret scanning
- 🚀 **Deploy**: Automated Render deployment
- 📊 **Health**: Post-deployment verification
- 📱 **Notify**: Discord/Slack deployment notifications

---

## 🧪 Testing

```

# Run all tests

pnpm test

# Type checking

pnpm type-check

# Lint code

pnpm lint

# Security audit

pnpm audit

# Test with services (requires Docker)

docker-compose up -d
pnpm test:integration

```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### **Development Guidelines**

- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Write tests for new features
- Update documentation
- Follow conventional commit messages

---

## 📋 Roadmap

### **Phase 1** ✅ _Completed_

- [x] Google OAuth authentication
- [x] Basic dashboard and transactions
- [x] Redis session management
- [x] Mobile-responsive design

### **Phase 2** 🚧 _In Progress_

- [ ] Advanced AI insights with Gemini
- [ ] Investment portfolio tracking
- [ ] Budget alerts and notifications
- [ ] Data export/import functionality

### **Phase 3** 📅 _Planned_

- [ ] Bank account integration (Plaid)
- [ ] Collaborative budgets and sharing
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)

### **Phase 4** 🔮 _Future_

- [ ] Cryptocurrency tracking
- [ ] Tax preparation assistance
- [ ] Financial advisor matching
- [ ] Open Banking API integration

---

## 🐛 Troubleshooting

### **Common Issues**

**🔐 OAuth Error: `redirect_uri_mismatch`**

```

# Ensure Google Console redirect URI exactly matches:

http://localhost:3001/api/auth/google/callback \# (local)
https://your-domain.onrender.com/api/auth/google/callback \# (production)

```

**💾 Redis Connection Error**

```

# Check Redis URL format:

REDIS_URL="redis://localhost:6379" \# Local
REDIS_URL="rediss://user:pass@host:port" \# Render/Production

```

**🗄️ Database Migration Issues**

```

# Reset database (development only)

pnpm prisma migrate reset

# Generate fresh client

pnpm prisma generate

# Deploy migrations

pnpm prisma migrate deploy

```

**🔧 Build Errors**

```

# Clear caches

pnpm store prune
rm -rf node_modules
pnpm install

# Type check

pnpm type-check

```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For intelligent financial insights
- **Render** - For reliable cloud hosting
- **Tailwind CSS** - For beautiful, responsive design
- **Prisma** - For excellent database developer experience
- **Next.js Team** - For the amazing React framework

---

## 📞 Support

- 📧 **Email**: nikhilmhatre703@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/ai-finance-dashboard/issues)

---

<div align="center">

**Built with ❤️ by Nikhil Mhatre**

_Empowering financial wellness through intelligent technology_

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/ai-finance-dashboard?style=social)](https://github.com/yourusername/ai-finance-dashboard)
[![Follow on Twitter](https://img.shields.io/twitter/follow/yourhandle?style=social)](https://twitter.com/yourhandle)

</div>
