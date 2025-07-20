# RankTracker Pro - Backend API

A comprehensive SEO management platform built with NestJS, PostgreSQL, and Prisma.

## 🚀 Features

### Core Business Modules

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Profile management, notifications, usage tracking
- **Subscription Management**: Multi-tier pricing, billing cycles, usage limits
- **Project Management**: SEO project organization and tracking
- **Keyword Tracking**: Bulk keyword management, ranking history
- **SEO Audits**: Comprehensive website analysis and reporting

### Key Capabilities

- **14-day Free Trial**: Full Pro features for new users
- **Multi-tier Subscriptions**: Free, Starter ($29), Professional ($79), Agency ($159)
- **Usage Tracking**: Real-time monitoring of plan limits
- **Background Jobs**: Automated ranking updates and audit processing
- **API Documentation**: Complete Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Queue System**: Bull Queue with Redis
- **Payment Processing**: Stripe integration ready

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+ (for background jobs)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd seo-cms-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Setup database**

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed subscription plans
npm run db:seed
```

## 🚦 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at:

- **API**: http://localhost:3001/api/v1
- **Documentation**: http://localhost:3001/api/docs

## 📊 Database Management

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply new migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Reset database (development only)
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Seed database with subscription plans
npm run db:seed
```

## 🏗️ Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Auth DTOs
│   ├── guards/             # JWT guards
│   ├── strategies/         # Passport strategies
│   └── auth.service.ts     # Auth business logic
├── users/                   # User management
├── subscriptions/           # Subscription & billing
├── projects/               # SEO project management
├── keywords/               # Keyword tracking
├── audits/                 # SEO audit system
├── database/               # Database service & seeds
├── common/                 # Shared DTOs & utilities
└── main.ts                 # Application entry point
```

## 🔐 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration with trial
- `POST /api/v1/auth/login` - User login

### User Management

- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update profile
- `GET /api/v1/users/usage` - Get subscription usage
- `GET /api/v1/users/notifications` - Get notifications

### Subscriptions

- `GET /api/v1/subscriptions/plans` - Available plans
- `GET /api/v1/subscriptions/current` - Current subscription
- `POST /api/v1/subscriptions` - Create subscription
- `PATCH /api/v1/subscriptions` - Update subscription
- `DELETE /api/v1/subscriptions` - Cancel subscription

### Projects

- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects` - List user projects
- `GET /api/v1/projects/:id` - Get project details
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Keywords

- `POST /api/v1/projects/:projectId/keywords` - Add keyword
- `POST /api/v1/projects/:projectId/keywords/bulk` - Bulk add keywords
- `GET /api/v1/projects/:projectId/keywords` - List keywords
- `PATCH /api/v1/keywords/:id` - Update keyword
- `DELETE /api/v1/keywords/:id` - Delete keyword
- `GET /api/v1/keywords/:id/rankings` - Ranking history

### Audits

- `POST /api/v1/projects/:projectId/audits` - Start audit
- `GET /api/v1/projects/:projectId/audits` - List audits
- `GET /api/v1/audits/:id` - Get audit details
- `GET /api/v1/audits/:id/results` - Get audit results

## 💾 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts and profiles
- **SubscriptionPlans**: Available pricing tiers
- **UserSubscriptions**: User subscription records
- **SubscriptionUsage**: Usage tracking per user
- **PaymentHistory**: Billing and payment records
- **Projects**: SEO projects
- **Keywords**: Tracked keywords
- **Rankings**: Keyword ranking history
- **Audits**: SEO audit records
- **Competitors**: Competitor tracking
- **Backlinks**: Backlink monitoring
- **Notifications**: User notifications

## 🎯 Business Logic

### Subscription Plans

1. **Free Trial (14 days)**
   - 5 projects, 50 keywords
   - Full Pro features
   - Automatic downgrade to Free plan

2. **Free Plan**
   - 1 project, 25 keywords
   - Basic features only

3. **Paid Plans**
   - Starter: $29/month (5 projects, 250 keywords)
   - Professional: $79/month (15 projects, 1,000 keywords)
   - Agency: $159/month (50 projects, 5,000 keywords)

### Usage Limits

The system enforces limits based on subscription plans:

- Project creation limits
- Keyword tracking limits
- Monthly audit limits
- API request limits
- Competitor tracking limits

## 🧪 Testing

```bash
# Unit tests
npm test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📈 Monitoring & Logging

- Application logs with NestJS built-in logger
- Error tracking ready for Sentry integration
- Performance monitoring hooks
- Database query optimization with Prisma

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set:

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_...
REDIS_URL=redis://...
```

### Production Build

```bash
npm run build
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
