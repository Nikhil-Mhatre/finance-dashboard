# AI-Powered Personal Finance Dashboard

> 🤖 Smart financial management with AI insights and real-time analytics

## ✨ Features

- **Intelligent Transaction Management** - AI-categorized expense tracking
- **Real-time Dashboard** - Live financial statistics and insights
- **Gemini AI Integration** - Personalized financial recommendations
- **Interactive Charts** - Beautiful data visualizations with Chart.js
- **Secure Authentication** - JWT-based user management
- **Responsive Design** - Works seamlessly on all devices

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Deployment**: Render.com with CI/CD

## 🔧 Version

Current Version: **v2.1.0**

## 📊 Live Demo

- **Frontend**: [Your Render Frontend URL]
- **API Health**: [Your Render Backend URL]/health

## 🛠️ Development

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive data visualization

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Primary database

## Quick Start

### Prerequisites

````bash
# Required software versions
Node.js 18+
PostgreSQL 15+
pnpm (recommended) or npm


### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-finance-dashboard.git
cd ai-finance-dashboard
````

2. **Install pnpm globally (if not installed)**

```bash
npm install -g pnpm
```

3. **Install dependencies**

```bash
# Install root dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### Environment Setup

4. **Backend environment variables**

Create `backend/.env`:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/finance_dashboard"

# API Keys
GEMINI_API_KEY="your_gemini_api_key_here"
ALPHA_VANTAGE_API_KEY="your_alpha_vantage_key_here"

# Security
JWT_SECRET="your_super_secure_jwt_secret_key"

# Server Configuration
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

5. **Frontend environment variables**

Create `frontend/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
NEXT_PUBLIC_APP_NAME="AI Finance Dashboard"
```

### Database Setup

6. **Set up PostgreSQL database**

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Create database and user
CREATE DATABASE finance_dashboard;
CREATE USER finance_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE finance_dashboard TO finance_user;

# Exit PostgreSQL
\q
```

7. **Run database migrations**

```bash
cd backend
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### Start Development Servers

8. **Start backend server**

```bash
cd backend
pnpm run dev
```

9. **Start frontend server** (in new terminal)

```bash
cd frontend
pnpm run dev
```

10. **Open application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Usage Guide

### 1. Account Creation

```bash
# Visit the registration page
http://localhost:3000/auth/register

# Fill in your details:
Email: your.email@example.com
Password: securepassword123
First Name: John
Last Name: Doe
```

### 2. Adding Transactions

**Via UI (Recommended):**

1. Click "Add Transaction" button
2. Fill out the form:
   - Type: Income/Expense
   - Amount: 50.00
   - Description: Coffee and breakfast
   - Category: Food & Dining
   - Account: Primary Checking
   - Date: Select date

**Via API (for developers):**

```bash
# Get your auth token first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Use the token to create transaction
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": -25.50,
    "description": "Coffee Shop",
    "category": "FOOD_DINING",
    "type": "EXPENSE",
    "date": "2024-12-15",
    "accountId": "your_account_id"
  }'
```

## API Documentation

### Authentication Endpoints

```bash
# Register new user
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}

# Login user
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

# Get user profile
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### Transaction Endpoints

```bash
# Get all transactions
GET /api/transactions
Authorization: Bearer YOUR_JWT_TOKEN

# Create transaction
POST /api/transactions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 100.00,
  "description": "Salary bonus",
  "category": "SALARY",
  "type": "INCOME",
  "date": "2024-12-15",
  "accountId": "account_id_here"
}

# Update transaction
PUT /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

# Delete transaction
DELETE /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Dashboard Endpoints

```bash
# Get dashboard statistics
GET /api/dashboard/stats
Authorization: Bearer YOUR_JWT_TOKEN

# Get recent transactions
GET /api/dashboard/transactions/recent?limit=10
Authorization: Bearer YOUR_JWT_TOKEN

# Get spending by category
GET /api/dashboard/analytics/categories
Authorization: Bearer YOUR_JWT_TOKEN
```

### AI Insights Endpoints

```bash
# Get AI insights
GET /api/ai/insights
Authorization: Bearer YOUR_JWT_TOKEN

# Generate new AI analysis
POST /api/ai/analyze
Authorization: Bearer YOUR_JWT_TOKEN
```

## Development Commands

### Backend Commands

```bash
cd backend

# Development
pnpm run dev                 # Start dev server
pnpm run build              # Build for production
pnpm run start              # Start production server

# Database
pnpm prisma studio          # Open database GUI
pnpm prisma migrate dev     # Run migrations
pnpm prisma generate        # Generate client
pnpm prisma migrate reset   # Reset database

# Testing
pnpm test                   # Run tests
pnpm run test:watch         # Watch mode
```

### Frontend Commands

```bash
cd frontend

# Development
pnpm run dev                # Start dev server
pnpm run build             # Build for production
pnpm run start             # Start production server
pnpm run lint              # Run linting
```

### Root Commands

```bash
# Run both servers
pnpm run dev

# Build everything
pnpm run build

# Version management
pnpm run version:patch     # 1.0.0 → 1.0.1
pnpm run version:minor     # 1.0.0 → 1.1.0
pnpm run version:major     # 1.0.0 → 2.0.0
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build backend image
docker build -t finance-dashboard-backend ./backend

# Build frontend image
docker build -t finance-dashboard-frontend ./frontend

# Run backend container
docker run -d -p 3001:3001 \
  -e DATABASE_URL="your_database_url" \
  -e GEMINI_API_KEY="your_key" \
  finance-dashboard-backend

# Run frontend container
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
  finance-dashboard-frontend
```

## Troubleshooting

### Common Issues

**Database Connection Error:**

```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Check connection
psql -U postgres -h localhost -p 5432
```

**Port Already in Use:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill process (replace PID)
kill -9 PID

# Or use different port
PORT=3001 pnpm run dev
```

**Environment Variables Not Loading:**

```bash
# Check .env file exists
ls -la backend/.env
ls -la frontend/.env.local

# Restart servers after .env changes
# Environment variables are loaded on server startup
```

## Contributing

### Development Workflow

```bash
# 1. Create feature branch
git checkout develop
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat(scope): add new feature description"

# 3. Push and create PR
git push -u origin feature/your-feature-name

# 4. After review, merge to develop
```

### Commit Message Format

```bash
# Types: feat, fix, docs, style, refactor, test, chore
# Examples:
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(dashboard): resolve chart rendering issue"
git commit -m "docs(api): update endpoint documentation"
git commit -m "refactor(components): optimize transaction form"
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, TypeScript, and AI**

## Support

- 🐛 [Report Issues](https://github.com/yourusername/ai-finance-dashboard/issues)
- 💬 [Discussions](https://github.com/yourusername/ai-finance-dashboard/discussions)
- 📧 Contact: your.email@example.com

```

## **Key Markdown Code Block Features:**

### **1. Language-Specific Syntax Highlighting**
```

```javascript
console.log("Hello World");
```

```python
def hello_world():
    print("Hello World")
```

```sql
SELECT * FROM transactions WHERE user_id = 1;
```

```json
{
  "name": "ai-finance-dashboard",
  "version": "1.0.0"
}
```
