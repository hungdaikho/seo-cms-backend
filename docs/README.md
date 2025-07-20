# API Documentation Overview

This directory contains comprehensive documentation for the RankTracker Pro API.

## 📚 Documentation Files

### 1. **API_DOCUMENTATION.md**

Complete API reference with:

- Endpoint descriptions
- Request/response examples
- Authentication details
- Error handling
- Rate limiting information
- Subscription plans overview

### 2. **openapi.yaml**

OpenAPI 3.0 specification file that can be used with:

- Swagger UI
- Postman (import)
- Code generation tools
- API testing tools

### 3. **RankTracker_Pro_API.postman_collection.json**

Postman collection with:

- Pre-configured requests for all endpoints
- Environment variables
- Test scripts
- Authentication flow
- Response validation

## 🚀 Quick Start

### 1. View Interactive Documentation

Start the API server and visit:

```
http://localhost:3001/api/docs
```

### 2. Import Postman Collection

1. Open Postman
2. Click "Import"
3. Select `RankTracker_Pro_API.postman_collection.json`
4. Set environment variables:
   - `base_url`: http://localhost:3001/api/v1
   - `access_token`: (will be set automatically after login)

### 3. Test API Endpoints

Run the test script (Linux/Mac):

```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

## 🔑 Authentication Flow

1. **Register** a new user (gets 14-day trial)
2. **Login** to receive JWT token
3. Include token in all requests: `Authorization: Bearer <token>`

## 📊 API Structure

```
/api/v1/
├── auth/                    # Authentication
│   ├── register            # POST - Register user
│   └── login               # POST - Login user
├── users/                   # User management
│   ├── profile             # GET/PATCH - User profile
│   ├── usage               # GET - Usage statistics
│   └── notifications       # GET - User notifications
├── subscriptions/           # Subscription management
│   ├── plans               # GET - Available plans
│   ├── current             # GET - Current subscription
│   └── /                   # POST/PATCH/DELETE - Manage subscription
├── projects/                # Project management
│   ├── /                   # GET/POST - List/Create projects
│   ├── /{id}               # GET/PATCH/DELETE - Manage project
│   ├── /{id}/stats         # GET - Project statistics
│   ├── /{id}/keywords      # GET/POST - Project keywords
│   └── /{id}/audits        # GET/POST - Project audits
├── keywords/                # Keyword management
│   ├── /{id}               # PATCH/DELETE - Update/Delete keyword
│   └── /{id}/rankings      # GET - Ranking history
└── audits/                  # Audit management
    ├── /{id}               # GET/DELETE - Audit details
    └── /{id}/results       # GET - Audit results
```

## 🎯 Core Features

### Multi-tier Subscriptions

- **Free Trial**: 14 days, full Pro features
- **Free**: 1 project, 25 keywords
- **Starter**: $29/month, 5 projects, 250 keywords
- **Professional**: $79/month, 15 projects, 1,000 keywords
- **Agency**: $159/month, 50 projects, 5,000 keywords

### Usage Limits Enforcement

- Project creation limits
- Keyword tracking limits
- Monthly audit limits
- API request rate limits

### Real-time Features

- Keyword ranking updates
- SEO audit notifications
- Usage limit warnings
- Subscription status changes

## 🛠️ Development Tools

### Code Generation

Use the OpenAPI spec to generate client SDKs:

```bash
# JavaScript/TypeScript
npx @openapitools/openapi-generator-cli generate \
  -i docs/openapi.yaml \
  -g typescript-axios \
  -o ./generated/typescript-client

# Python
openapi-generator generate \
  -i docs/openapi.yaml \
  -g python \
  -o ./generated/python-client

# PHP
openapi-generator generate \
  -i docs/openapi.yaml \
  -g php \
  -o ./generated/php-client
```

### Testing

- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- API tests: `./scripts/test-api.sh`

## 📈 Monitoring & Analytics

The API includes comprehensive logging and monitoring:

- Request/response logging
- Error tracking
- Performance metrics
- Usage analytics
- Rate limit monitoring

## 🔒 Security

- JWT authentication with 30-day expiry
- Password hashing with bcrypt
- Rate limiting per subscription tier
- Input validation and sanitization
- CORS configuration
- SQL injection prevention with Prisma

## 🌐 Deployment

### Environment Variables

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_...
REDIS_URL=redis://...
```

### Production Considerations

- Use HTTPS in production
- Set up proper CORS origins
- Configure rate limiting
- Set up monitoring and alerting
- Use environment-specific databases

## 📞 Support

- **Documentation**: Full API reference available
- **Postman Collection**: Ready-to-use API client
- **OpenAPI Spec**: Standards-compliant specification
- **Test Scripts**: Automated API testing
- **Code Examples**: Multiple programming languages

For additional support:

- **Email**: support@ranktackerpro.com
- **Documentation**: https://docs.ranktackerpro.com
- **Status**: https://status.ranktackerpro.com
