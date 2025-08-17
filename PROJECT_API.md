# Project API Documentation

Tài liệu API cho module quản lý dự án SEO trong RankTracker Pro, phù hợp với các tính năng client như trong hình minh họa.

## 🚀 Base URL
```
https://api.rankttrackerpro.com/api/v1
```

## 🔒 Authentication
Tất cả API endpoints đều yêu cầu JWT Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📋 1. PROJECT MANAGEMENT APIs

### 1.1 Create New Project
```http
POST /projects
```

**Request Body:**
```json
{
  "name": "My SEO Project",
  "domain": "example.com",
  "settings": {
    "country": "US",
    "language": "en",
    "trackingEnabled": true
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My SEO Project",
  "domain": "example.com",
  "ownerId": "user-uuid",
  "settings": {...},
  "createdAt": "2024-01-01T00:00:00Z",
  "isActive": true,
  "_count": {
    "keywords": 0,
    "competitors": 0,
    "audits": 0
  }
}
```

### 1.2 Get User Projects
```http
GET /projects?page=1&limit=10&search=example&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "My SEO Project", 
      "domain": "example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "_count": {
        "keywords": 25,
        "competitors": 5,
        "audits": 3
      }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### 1.3 Get Project Details
```http
GET /projects/{id}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My SEO Project",
  "domain": "example.com",
  "settings": {...},
  "keywords": [...], // Recent 5 keywords
  "competitors": [...], // All active competitors
  "audits": [...], // Recent 3 audits
  "_count": {
    "keywords": 25,
    "competitors": 5,
    "audits": 10,
    "backlinks": 150
  }
}
```

### 1.4 Update Project
```http
PATCH /projects/{id}
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "settings": {
    "trackingEnabled": false
  }
}
```

### 1.5 Delete Project
```http
DELETE /projects/{id}
```

### 1.6 Get Project Statistics
```http
GET /projects/{id}/stats
```

**Response:**
```json
{
  "totalKeywords": 25,
  "averageRanking": 15.5,
  "rankingDistribution": {
    "top3": 3,
    "top10": 8,
    "top50": 10,
    "beyond50": 4,
    "notRanked": 0
  },
  "improvedKeywords": 12,
  "declinedKeywords": 5,
  "stableKeywords": 8,
  "topKeywords": [
    {
      "id": "uuid",
      "keyword": "seo tools",
      "currentRanking": 1
    }
  ],
  "recentChanges": 15,
  "lastUpdate": "2024-01-15T10:30:00Z",
  "auditSummary": {
    "totalAudits": 5,
    "averageScore": 85.5,
    "criticalIssues": 3
  }
}
```

---

## 🔍 2. KEYWORD TRACKING APIs

### 2.1 Add Keywords to Project
```http
POST /projects/{projectId}/keywords
```

**Request Body:**
```json
{
  "keyword": "seo tools",
  "targetUrl": "https://example.com/seo-tools",
  "searchVolume": 1000,
  "difficulty": 65,
  "isTracking": true
}
```

### 2.2 Bulk Add Keywords
```http
POST /projects/{projectId}/keywords/bulk
```

**Request Body:**
```json
{
  "keywords": [
    {
      "keyword": "seo tools",
      "targetUrl": "https://example.com/seo-tools"
    },
    {
      "keyword": "keyword research",
      "targetUrl": "https://example.com/keyword-research"
    }
  ]
}
```

### 2.3 Get Project Keywords
```http
GET /projects/{projectId}/keywords?page=1&limit=20&sortBy=currentRanking&sortOrder=asc
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "keyword": "seo tools",
      "currentRanking": 5,
      "previousRanking": 8,
      "targetUrl": "https://example.com/seo-tools",
      "searchVolume": 1000,
      "difficulty": 65,
      "isTracking": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20,
  "totalPages": 2
}
```

### 2.4 Update Keyword
```http
PATCH /keywords/{id}
```

### 2.5 Delete Keyword
```http
DELETE /keywords/{id}
```

### 2.6 Get Keyword Ranking History
```http
GET /keywords/{id}/rankings?days=30
```

**Response:**
```json
{
  "keyword": "seo tools",
  "rankings": [
    {
      "date": "2024-01-15",
      "position": 5,
      "searchEngine": "google",
      "location": "US"
    }
  ],
  "summary": {
    "currentPosition": 5,
    "previousPosition": 8,
    "bestPosition": 3,
    "averagePosition": 6.2
  }
}
```

---

## 📊 3. RANKING OVERVIEW APIs

### 3.1 Get Project Rankings Overview
```http
GET /projects/{projectId}/rankings/overview
```

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "name": "My SEO Project",
    "domain": "example.com"
  },
  "summary": {
    "totalKeywords": 25,
    "trackedKeywords": 20,
    "rankedKeywords": 18,
    "avgPosition": 15.5
  },
  "keywords": [
    {
      "id": "uuid",
      "keyword": "seo tools",
      "currentRanking": 5,
      "targetUrl": "https://example.com/seo-tools",
      "searchVolume": 1000,
      "difficulty": 65,
      "trend": "up",
      "rankingHistory": [...]
    }
  ]
}
```

### 3.2 Add Ranking Record
```http
POST /keywords/{keywordId}/rankings
```

**Request Body:**
```json
{
  "position": 5,
  "searchEngine": "google",
  "location": "US",
  "date": "2024-01-15"
}
```

---

## 🔍 4. SEO AUDIT APIs

### 4.1 Start New Audit
```http
POST /projects/{projectId}/audits
```

**Request Body:**
```json
{
  "audit_type": "full",
  "pages": ["https://example.com"],
  "max_depth": 2,
  "check_images": true,
  "include_mobile": true,
  "analyze_performance": true,
  "check_accessibility": true
}
```

### 4.2 Start Comprehensive Audit (Client Format)
```http
POST /projects/{projectId}/audits/comprehensive
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "auditType": "full",
    "settings": {
      "crawlDepth": 2,
      "includeImages": true,
      "checkMobileFriendly": true,
      "analyzePageSpeed": true
    }
  }
}
```

### 4.3 Get Project Audits
```http
GET /projects/{projectId}/audits?page=1&limit=10
```

### 4.4 Get Audit Summary
```http
GET /projects/{projectId}/audits/summary
```

### 4.5 Get Audit History
```http
GET /projects/{projectId}/audits/history
```

### 4.6 Get Audit Details
```http
GET /audits/{id}
```

### 4.7 Get Audit Status
```http
GET /audits/{id}/status
```

**Response:**
```json
{
  "id": "uuid",
  "status": "completed",
  "created_at": "2024-01-15T10:00:00Z",
  "completed_at": "2024-01-15T10:05:00Z",
  "progress": 100,
  "config": {...}
}
```

### 4.8 Get Audit Results
```http
GET /audits/{id}/results
```

### 4.9 Delete Audit
```http
DELETE /audits/{id}
```

---

## 🏆 5. COMPETITOR ANALYSIS APIs

### 5.1 Add Competitor to Project
```http
POST /projects/{projectId}/competitors
```

**Request Body:**
```json
{
  "domain": "competitor.com",
  "name": "Main Competitor"
}
```

### 5.2 Get Project Competitors
```http
GET /projects/{projectId}/competitors
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "domain": "competitor.com",
      "name": "Main Competitor",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

### 5.3 Get Competitor Details
```http
GET /projects/{projectId}/competitors/{competitorId}
```

### 5.4 Update Competitor
```http
PUT /projects/{projectId}/competitors/{competitorId}
```

### 5.5 Delete Competitor
```http
DELETE /projects/{projectId}/competitors/{competitorId}
```

---

## 🔗 6. BACKLINK MANAGEMENT APIs

### 6.1 Add Backlink to Project
```http
POST /projects/{projectId}/backlinks
```

**Request Body:**
```json
{
  "sourceUrl": "https://referring-site.com/article",
  "sourceDomain": "referring-site.com",
  "targetUrl": "https://example.com/target-page",
  "anchorText": "anchor text",
  "linkType": "dofollow",
  "authorityScore": 65
}
```

### 6.2 Get Project Backlinks
```http
GET /projects/{projectId}/backlinks?page=1&limit=20
```

### 6.3 Get Backlink Analytics
```http
GET /projects/{projectId}/backlinks/analytics?days=30
```

**Response:**
```json
{
  "summary": {
    "totalBacklinks": 150,
    "totalDomains": 85,
    "activeLinks": 140,
    "followLinks": 120,
    "nofollowLinks": 30,
    "averageAuthorityScore": 45.5,
    "newBacklinksCount": 12
  },
  "newBacklinks": [...],
  "topDomains": [
    {
      "domain": "high-authority-site.com",
      "count": 15
    }
  ],
  "topTargetUrls": [
    {
      "url": "https://example.com/popular-page",
      "count": 25
    }
  ]
}
```

### 6.4 Get Backlink Details
```http
GET /projects/{projectId}/backlinks/{backlinkId}
```

### 6.5 Update Backlink
```http
PUT /projects/{projectId}/backlinks/{backlinkId}
```

### 6.6 Delete Backlink
```http
DELETE /projects/{projectId}/backlinks/{backlinkId}
```

---

## 📈 7. ANALYTICS & REPORTING

### 7.1 Project Performance Dashboard
Kết hợp từ các API trên để tạo dashboard:
- `GET /projects/{id}/stats` - Tổng quan dự án
- `GET /projects/{id}/rankings/overview` - Thống kê ranking
- `GET /projects/{id}/backlinks/analytics` - Phân tích backlink
- `GET /projects/{id}/audits/summary` - Tóm tắt audit

### 7.2 Weekly/Monthly Reports
Sử dụng query parameters `startDate` và `endDate` cho các API:
- Rankings history
- Backlink analytics  
- Audit trends

---

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Limits reached)
- `404` - Not Found
- `409` - Conflict (Already exists)
- `500` - Internal Server Error

---

## 📊 Usage Limits

### Free Plan
- 1 project
- 25 keywords
- 5 audits/month

### Starter Plan ($29/month)
- 5 projects
- 250 keywords  
- 25 audits/month

### Professional Plan ($79/month)
- 15 projects
- 1,000 keywords
- 100 audits/month

### Agency Plan ($159/month)
- 50 projects
- 5,000 keywords
- 500 audits/month

---

## 🔄 Pagination

Tất cả list APIs đều hỗ trợ pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term
- `sortBy` - Sort field
- `sortOrder` - Sort direction (asc/desc)

**Response Format:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1, 
  "limit": 10,
  "totalPages": 10
}
```

---

## 🛠️ Error Handling

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "domain",
      "message": "Invalid domain format"
    }
  ]
}
```

---

## 📝 Notes

1. **Real-time Updates**: Webhook support cho ranking changes và audit completion
2. **Rate Limiting**: API calls theo subscription plan
3. **Data Export**: CSV/Excel export cho reports
4. **Bulk Operations**: Bulk import/export keywords và competitors
5. **Mobile Support**: Tất cả APIs đều tương thích mobile

---

## 🔗 Related Documentation

- [Authentication API](./AUTH_API.md)
- [Organic Research API](./src/organic-research/ORGANIC_RESEACH_API.md) 
- [OpenAPI Specification](./docs/openapi.yaml)
- [Postman Collection](./docs/RankTracker_Pro_API.postman_collection.json)
