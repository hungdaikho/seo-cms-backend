# RankTracker Pro API Documentation

## Overview

RankTracker Pro is a comprehensive SEO management platform that helps businesses track keyword rankings, manage SEO projects, conduct website audits, and monitor competitors.

**Base URL:** `http://localhost:3001/api/v1` (Development)  
**Production URL:** `https://api.ranktackerpro.com/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting Started

1. **Register** a new account to get a 14-day free trial
2. **Login** to receive your JWT access token
3. Use the token for all subsequent API calls

## Rate Limiting

API requests are limited based on your subscription plan:

| Plan         | Daily Limit | Monthly Limit |
| ------------ | ----------- | ------------- |
| Free         | 10          | 300           |
| Starter      | 50          | 1,500         |
| Professional | 200         | 6,000         |
| Agency       | 1,000       | 30,000        |

## Subscription Plans

### Free Trial (14 days)

- **Price:** $0
- **Projects:** 5
- **Keywords:** 50
- **Audits/month:** 5
- **Competitors:** 3

### Free Plan

- **Price:** $0
- **Projects:** 1
- **Keywords:** 25
- **Audits/month:** 1
- **Competitors:** 1

### Starter Plan

- **Price:** $29/month ($23.20/month annual)
- **Projects:** 5
- **Keywords:** 250
- **Audits/month:** 3
- **Competitors:** 3

### Professional Plan

- **Price:** $79/month ($63.20/month annual)
- **Projects:** 15
- **Keywords:** 1,000
- **Audits/month:** 10
- **Competitors:** 10

### Agency Plan

- **Price:** $159/month ($127.20/month annual)
- **Projects:** 50
- **Keywords:** 5,000
- **Audits/month:** 50
- **Competitors:** 50

---

## API Endpoints

### 🔐 Authentication

#### Register User

```http
POST /auth/register
```

**Description:** Register a new user with automatic 14-day trial activation.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "website": "example.com"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "uuid-string",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- `409 Conflict` - User already exists
- `400 Bad Request` - Validation error

#### Login User

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid-string",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "user",
    "subscription": {
      "id": "sub-uuid",
      "status": "trial",
      "plan": {
        "name": "Professional",
        "limits": {
          "projects": 15,
          "keywords_tracking": 1000
        }
      },
      "expiresAt": "2025-08-03T00:00:00.000Z"
    }
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- `401 Unauthorized` - Invalid credentials

#### Password Management

**See [Password & Security API Documentation](./PASSWORD_SECURITY_API.md) for complete details:**

- `POST /auth/change-password` - Change password (authenticated)
- `POST /auth/forgot-password` - Request password reset email
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/verify-email` - Verify email address
- `POST /auth/resend-verification` - Resend verification email

#### Session Management

- `GET /auth/sessions` - Get all user sessions
- `DELETE /auth/sessions/:id` - Revoke specific session
- `DELETE /auth/sessions` - Revoke all other sessions

---

### 👤 Users

#### Get User Profile

```http
GET /users/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "id": "uuid-string",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "timezone": "America/New_York",
  "avatarUrl": "https://example.com/avatar.jpg",
  "emailVerified": true,
  "lastLoginAt": "2025-07-20T10:30:00.000Z",
  "createdAt": "2025-07-06T08:00:00.000Z",
  "subscription": {
    "id": "sub-uuid",
    "status": "active",
    "plan": {
      "name": "Professional",
      "price": 79.0
    }
  }
}
```

#### Update User Profile

```http
PATCH /users/profile
```

**Request Body:**

```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "timezone": "Europe/London"
}
```

#### Get Usage Statistics

```http
GET /users/usage
```

**Response (200):**

```json
[
  {
    "type": "projects",
    "current": 8,
    "limit": 15,
    "percentage": 53,
    "resetDate": null
  },
  {
    "type": "keywords_tracking",
    "current": 450,
    "limit": 1000,
    "percentage": 45,
    "resetDate": null
  },
  {
    "type": "audits_monthly",
    "current": 3,
    "limit": 10,
    "percentage": 30,
    "resetDate": "2025-08-01"
  }
]
```

#### Get Notifications

```http
GET /users/notifications?limit=10
```

**Response (200):**

```json
[
  {
    "id": "notif-uuid",
    "type": "ranking_change",
    "title": "Keyword Ranking Update",
    "message": "Your keyword 'seo tools' moved from position 8 to 5",
    "isRead": false,
    "createdAt": "2025-07-20T09:15:00.000Z"
  }
]
```

#### Account Security & Management

**See [Password & Security API Documentation](./PASSWORD_SECURITY_API.md) for complete details:**

- `POST /users/deactivate` - Deactivate account (soft delete)
- `DELETE /users/account` - Request permanent account deletion
- `POST /users/export-data` - Export all user data (GDPR compliance)

---

### 💳 Subscriptions

#### Get Available Plans

```http
GET /subscriptions/plans
```

**Response (200):**

```json
[
  {
    "id": "plan-uuid",
    "name": "Professional",
    "slug": "professional",
    "description": "Advanced SEO tools for growing businesses",
    "price": 79.0,
    "yearlyPrice": 63.2,
    "currency": "USD",
    "features": [
      "15 projects",
      "1,000 keywords tracking",
      "Daily reports",
      "Advanced competitor analysis"
    ],
    "limits": {
      "projects": 15,
      "keywords_tracking": 1000,
      "audits_monthly": 10,
      "competitors_tracking": 10
    }
  }
]
```

#### Get Current Subscription

```http
GET /subscriptions/current
```

#### Create Subscription

```http
POST /subscriptions
```

**Request Body:**

```json
{
  "planId": "plan-uuid",
  "billingCycle": "monthly",
  "paymentMethodId": "pm_1234567890"
}
```

#### Update Subscription

```http
PATCH /subscriptions
```

**Request Body:**

```json
{
  "planId": "new-plan-uuid",
  "billingCycle": "yearly"
}
```

#### Cancel Subscription

```http
DELETE /subscriptions
```

---

### 📊 Projects

#### Create Project

```http
POST /projects
```

**Request Body:**

```json
{
  "name": "My SEO Project",
  "domain": "example.com",
  "settings": {
    "location": "United States",
    "language": "en"
  }
}
```

**Response (201):**

```json
{
  "id": "project-uuid",
  "name": "My SEO Project",
  "domain": "example.com",
  "isActive": true,
  "createdAt": "2025-07-20T10:00:00.000Z",
  "updatedAt": "2025-07-20T10:00:00.000Z"
}
```

#### Get Projects

```http
GET /projects?page=1&limit=10&search=example
```

**Response (200):**

```json
{
  "data": [
    {
      "id": "project-uuid",
      "name": "My SEO Project",
      "domain": "example.com",
      "isActive": true,
      "createdAt": "2025-07-20T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### Get Project by ID

```http
GET /projects/{projectId}
```

#### Update Project

```http
PATCH /projects/{projectId}
```

#### Delete Project

```http
DELETE /projects/{projectId}
```

#### Get Project Statistics

```http
GET /projects/{projectId}/stats
```

**Response (200):**

```json
{
  "totalKeywords": 150,
  "trackingKeywords": 145,
  "averageRanking": 12.5,
  "improvingKeywords": 45,
  "decliningKeywords": 23,
  "topKeywords": [
    {
      "keyword": "seo tools",
      "position": 3,
      "change": 2
    }
  ]
}
```

---

### 🔍 Keywords

#### Add Keyword to Project

```http
POST /projects/{projectId}/keywords
```

**Request Body:**

```json
{
  "keyword": "seo tools",
  "targetUrl": "https://example.com/seo-tools",
  "searchVolume": 1000,
  "difficulty": 65.5,
  "cpc": 2.5
}
```

#### Bulk Add Keywords

```http
POST /projects/{projectId}/keywords/bulk
```

**Request Body:**

```json
{
  "keywords": [
    {
      "keyword": "seo tools",
      "targetUrl": "https://example.com/seo-tools",
      "searchVolume": 1000
    },
    {
      "keyword": "keyword research",
      "targetUrl": "https://example.com/keyword-research",
      "searchVolume": 800
    }
  ]
}
```

#### Get Project Keywords

```http
GET /projects/{projectId}/keywords?page=1&limit=20&search=seo&sortBy=currentRanking&sortOrder=asc
```

**Response (200):**

```json
{
  "data": [
    {
      "id": "keyword-uuid",
      "keyword": "seo tools",
      "targetUrl": "https://example.com/seo-tools",
      "searchVolume": 1000,
      "difficulty": 65.5,
      "cpc": 2.5,
      "currentRanking": 5,
      "isTracking": true,
      "createdAt": "2025-07-20T10:00:00.000Z",
      "latestRanking": {
        "position": 5,
        "url": "https://example.com/seo-tools",
        "date": "2025-07-20T06:00:00.000Z"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

#### Update Keyword

```http
PATCH /keywords/{keywordId}
```

#### Delete Keyword

```http
DELETE /keywords/{keywordId}
```

#### Get Keyword Ranking History

```http
GET /keywords/{keywordId}/rankings?days=30
```

**Response (200):**

```json
[
  {
    "id": "ranking-uuid",
    "position": 5,
    "url": "https://example.com/seo-tools",
    "date": "2025-07-20T06:00:00.000Z",
    "metadata": {
      "serp_features": ["featured_snippet"],
      "search_engine": "google"
    }
  }
]
```

---

### 🔍 SEO Audits

#### Start New Audit

```http
POST /projects/{projectId}/audits
```

**Request Body:**

```json
{
  "settings": {
    "include_mobile": true,
    "check_accessibility": true,
    "analyze_performance": true
  }
}
```

**Response (201):**

```json
{
  "id": "audit-uuid",
  "projectId": "project-uuid",
  "status": "pending",
  "createdAt": "2025-07-20T10:30:00.000Z"
}
```

#### Get Project Audits

```http
GET /projects/{projectId}/audits?page=1&limit=10
```

#### Get Audit by ID

```http
GET /audits/{auditId}
```

#### Get Audit Results

```http
GET /audits/{auditId}/results
```

**Response (200):**

```json
{
  "id": "audit-uuid",
  "status": "completed",
  "results": {
    "overall_score": 85,
    "technical_seo": {
      "score": 90,
      "issues": [
        {
          "type": "missing_meta_description",
          "severity": "medium",
          "count": 5,
          "description": "5 pages are missing meta descriptions"
        }
      ]
    },
    "performance": {
      "score": 78,
      "metrics": {
        "page_load_time": 2.3,
        "core_web_vitals": {
          "lcp": 2.1,
          "fid": 45,
          "cls": 0.1
        }
      }
    },
    "content": {
      "score": 88,
      "word_count": 1250,
      "readability_score": 75
    }
  },
  "createdAt": "2025-07-20T10:30:00.000Z",
  "completedAt": "2025-07-20T10:45:00.000Z"
}
```

#### Get Audit Summary

```http
GET /projects/{projectId}/audits/summary
```

#### Delete Audit

```http
DELETE /audits/{auditId}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "error": "Bad Request",
  "details": ["Specific validation errors"]
}
```

### Common Error Codes

| Code | Description                                             |
| ---- | ------------------------------------------------------- |
| 400  | Bad Request - Invalid input data                        |
| 401  | Unauthorized - Invalid or missing token                 |
| 403  | Forbidden - Insufficient permissions or limits exceeded |
| 404  | Not Found - Resource not found                          |
| 409  | Conflict - Resource already exists                      |
| 429  | Too Many Requests - Rate limit exceeded                 |
| 500  | Internal Server Error                                   |

---

## Webhooks (Coming Soon)

RankTracker Pro will support webhooks for real-time notifications:

- Ranking changes
- Audit completions
- Subscription events
- Usage limit warnings

---

## SDK Support

Official SDKs are available for:

- **JavaScript/Node.js** - `npm install @ranktackerpro/sdk`
- **Python** - `pip install ranktackerpro`
- **PHP** - `composer require ranktackerpro/sdk`

---

## Support

- **Documentation:** https://docs.ranktackerpro.com
- **Support Email:** support@ranktackerpro.com
- **Status Page:** https://status.ranktackerpro.com
- **Community:** https://community.ranktackerpro.com

---

## Changelog

### v1.0.0 (2025-07-20)

- Initial API release
- Authentication system
- Project and keyword management
- SEO audit system
- Subscription management
- Usage tracking and limits
