# 🚀 RankTracker Pro - Production Setup Guide

## 📋 **Prerequisites**

### Required Services

- **PostgreSQL 14+**: Main database
- **OpenAI Account**: For AI features
- **Google Cloud Project**: For Search Console & Analytics APIs
- **Node.js 18+**: Runtime environment

## 🔧 **Environment Configuration**

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb seo_cms_production

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://username:password@host:5432/seo_cms_production"
```

### 2. OpenAI API Key

```bash
# Get from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-your-api-key-here"
```

### 3. Google Cloud Console Setup

#### Step 1: Create Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "RankTracker Pro"
3. Enable APIs:
   - Google Search Console API
   - Google Analytics Reporting API
   - Google Analytics Data API

#### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   ```
   http://localhost:3001/integrations/google/callback
   https://yourdomain.com/integrations/google/callback
   ```

#### Step 3: Add to .env

```bash
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://yourdomain.com/integrations/google/callback"
```

### 4. Security Configuration

```bash
# Generate strong JWT secret (32+ characters)
JWT_SECRET="your-super-secure-jwt-secret-32-characters-minimum"
JWT_EXPIRES_IN="7d"

# Generate encryption key for storing API credentials (32 characters)
ENCRYPTION_KEY="your-32-character-encryption-key-here"
```

### 5. Complete .env File

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/seo_cms_production"

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-32-characters-minimum"
JWT_EXPIRES_IN="7d"

# OpenAI API
OPENAI_API_KEY="sk-proj-your-openai-api-key"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://yourdomain.com/integrations/google/callback"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key-here"

# Server Configuration
PORT=3001
NODE_ENV=production
```

## 🗄️ **Database Migration**

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migration

```bash
npx prisma db push
```

### 4. Seed Initial Data

```bash
npm run seed
```

## 🚀 **Deployment Options**

### Option 1: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start dist/main.js --name "ranktracker-pro"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

```bash
# Build and run
docker build -t ranktracker-pro .
docker run -d -p 3001:3001 --env-file .env ranktracker-pro
```

### Option 3: Vercel/Railway/Heroku

```json
// package.json scripts
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main.js",
    "postinstall": "prisma generate"
  }
}
```

## 🔒 **Security Checklist**

### Environment Security

- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL connections

### API Security

- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection headers
- [ ] Authentication required for protected routes

### Google Integration Security

- [ ] OAuth 2.0 credentials secured
- [ ] Proper redirect URI configuration
- [ ] Encrypted storage of API tokens
- [ ] Regular token refresh handling

## 📊 **Monitoring & Logging**

### Application Monitoring

```bash
# Install monitoring tools
npm install @nestjs/platform-express helmet compression

# Add to main.ts
import helmet from 'helmet';
import compression from 'compression';

app.use(helmet());
app.use(compression());
```

### Error Tracking (Optional)

- **Sentry**: Application error tracking
- **LogRocket**: User session replay
- **DataDog**: Infrastructure monitoring

### Health Checks

```typescript
// Add to AppController
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

## 🔄 **Backup & Recovery**

### Database Backup

```bash
# Daily backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250125.sql
```

### File Backup

- Backup uploaded files if any
- Backup environment configuration
- Backup SSL certificates

## 📈 **Performance Optimization**

### Database Optimization

- [ ] Add database indexes for frequently queried fields
- [ ] Enable connection pooling
- [ ] Monitor slow queries
- [ ] Regular database maintenance

### Application Optimization

- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Implement caching strategy
- [ ] Optimize API response times

### Caching Strategy

```typescript
// Add Redis for caching
npm install @nestjs/cache-manager cache-manager-redis-store

// Configure in AppModule
CacheModule.register({
  store: redisStore,
  host: 'localhost',
  port: 6379,
  ttl: 3600, // 1 hour
})
```

## 🧪 **Testing in Production**

### API Testing

```bash
# Test core endpoints
curl https://yourdomain.com/api/v1/health
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Google Integration Testing

1. Test OAuth flow: `GET /api/v1/integrations/auth/google`
2. Test GSC sync: `POST /api/v1/integrations/google/search-console`
3. Test GA sync: `POST /api/v1/integrations/google/analytics`

### AI Features Testing

1. Test keyword research: `POST /api/v1/ai/keyword-research`
2. Test content optimization: `POST /api/v1/ai/content-optimization`
3. Test meta generation: `POST /api/v1/ai/meta-generation`

## 📚 **Additional Resources**

### Documentation

- **API Documentation**: `https://yourdomain.com/api/docs`
- **Postman Collection**: Import from `/docs/` folder
- **Database Schema**: Check `/prisma/schema.prisma`

### Support

- **GitHub Issues**: For bug reports
- **Email Support**: For customer inquiries
- **Documentation Wiki**: For user guides

---

## 🎯 **Quick Start Checklist**

1. [ ] Setup PostgreSQL database
2. [ ] Get OpenAI API key
3. [ ] Configure Google Cloud Console
4. [ ] Update .env file with all credentials
5. [ ] Run database migration: `npx prisma db push`
6. [ ] Seed initial data: `npm run seed`
7. [ ] Build application: `npm run build`
8. [ ] Start production server: `npm run start:prod`
9. [ ] Test API endpoints
10. [ ] Configure monitoring & backups

**🚀 Your RankTracker Pro is now ready for production!**
