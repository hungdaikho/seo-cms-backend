# Backlink Research & Analysis API Documentation

Tài liệu API cho module Backlink Research & Analysis trong RankTracker Pro, bao gồm Domain Backlink Analysis, Project Backlink Management, và Competitive Backlink Gap Analysis.

## 🚀 Base URL

```
https://api.ranktrackers.pro/api/v1
```

## 🔒 Authentication

Tất cả API endpoints yêu cầu JWT token trong header:

```http
Authorization: Bearer {your_jwt_token}
```

---

## 📊 1. DOMAIN BACKLINK OVERVIEW APIs

### 1.1 Get Domain Overview with Backlink Metrics

```http
GET /seo/domain-overview/{domain}
```

**Parameters:**

- `domain` (path) - Domain cần phân tích (ví dụ: example.com)
- `includeSubdomains` (query) - Bao gồm subdomains (default: false)

**Response:**

```json
{
  "domain": "designer.com",
  "metrics": {
    "pageAuthority": "64.3K",
    "domainAuthority": "64.3K",
    "outboundDomain": "64.3K",
    "monthlyVisits": "64.3K",
    "spamScore": "64.3K"
  },
  "authorityScore": 80,
  "backlinks": {
    "total": 200000,
    "totalDomains": 31,
    "newBacklinks": 2700,
    "lostBacklinks": 150
  },
  "backlinkTypes": {
    "text": 27000,
    "image": 4
  },
  "topCountries": [
    {
      "country": "Nigeria",
      "percentage": 63,
      "count": 9302
    },
    {
      "country": "Ghana",
      "percentage": 31,
      "count": 500
    }
  ],
  "tldDistribution": {
    "com": 45,
    "org": 20,
    "net": 15,
    "others": 20
  },
  "lastUpdated": "2025-08-18T10:30:00Z"
}
```

### 1.2 Get Domain Authority Metrics

```http
GET /seo/domain-overview/authority/{domain}
```

**Response:**

```json
{
  "domain": "designer.com",
  "authorityMetrics": {
    "domainRating": 80,
    "ahrefsRating": 85,
    "mozScore": 75,
    "semrushScore": 82
  },
  "backlinksMetrics": {
    "totalBacklinks": 200000,
    "referringDomains": 15000,
    "followLinks": 180000,
    "nofollowLinks": 20000
  },
  "qualityScore": "High",
  "lastUpdated": "2025-08-18T10:30:00Z"
}
```

---

## 🔗 2. PROJECT BACKLINK MANAGEMENT APIs

### 2.1 Add Backlink to Project

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
  "authorityScore": 65,
  "status": "active"
}
```

**Response:**

```json
{
  "id": "uuid",
  "sourceUrl": "https://referring-site.com/article",
  "sourceDomain": "referring-site.com",
  "targetUrl": "https://example.com/target-page",
  "anchorText": "anchor text",
  "linkType": "dofollow",
  "authorityScore": 65,
  "status": "active",
  "discoveredAt": "2025-08-18T10:30:00Z",
  "lastChecked": "2025-08-18T10:30:00Z"
}
```

### 2.2 Get Project Backlinks

```http
GET /projects/{projectId}/backlinks
```

**Parameters:**

- `page` (query) - Số trang (default: 1)
- `limit` (query) - Số lượng per page (default: 20)
- `status` (query) - Filter theo status (active, lost, broken)
- `linkType` (query) - Filter theo link type (dofollow, nofollow)

**Response:**

```json
{
  "backlinks": [
    {
      "id": "uuid",
      "sourceUrl": "https://referring-site.com/article",
      "sourceDomain": "referring-site.com",
      "targetUrl": "https://example.com/target-page",
      "anchorText": "Designer.com",
      "linkType": "dofollow",
      "authorityScore": 65,
      "status": "active",
      "discoveredAt": "2025-08-18T10:30:00Z",
      "lastChecked": "2025-08-18T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 2.3 Get Backlink Analytics

```http
GET /projects/{projectId}/backlinks/analytics
```

**Parameters:**

- `days` (query) - Số ngày phân tích (default: 30)
- `startDate` (query) - Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (query) - Ngày kết thúc (YYYY-MM-DD)

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
    "newBacklinksCount": 12,
    "lostBacklinksCount": 3
  },
  "trends": {
    "referralDomains": [
      {
        "date": "2022-05-21",
        "count": 450
      },
      {
        "date": "2022-06-26",
        "count": 520
      },
      {
        "date": "2022-08-01",
        "count": 480
      }
    ],
    "backlinks": [
      {
        "date": "2022-05-21",
        "count": 600
      },
      {
        "date": "2022-06-26",
        "count": 750
      },
      {
        "date": "2022-08-01",
        "count": 700
      }
    ]
  },
  "newAndLost": {
    "newReferringDomains": [
      {
        "date": "2025-08-01",
        "new": 45,
        "lost": 12
      }
    ],
    "newBacklinks": [
      {
        "date": "2025-08-01",
        "new": 85,
        "lost": 25
      }
    ]
  },
  "anchors": [
    {
      "anchorText": "Designer.com",
      "backlinks": 1200,
      "domains": 31
    },
    {
      "anchorText": "Designs.com",
      "backlinks": 1109,
      "domains": 31
    },
    {
      "anchorText": "Design person",
      "backlinks": 950,
      "domains": 31
    }
  ],
  "topDomains": [
    {
      "domain": "high-authority-site.com",
      "backlinks": 15,
      "authorityScore": 85
    }
  ],
  "topPages": [
    {
      "url": "https://example.com/popular-page",
      "backlinks": 2100,
      "domains": 31
    },
    {
      "url": "https://example.com/login",
      "backlinks": 700,
      "domains": 31
    }
  ]
}
```

### 2.4 Get Backlink Details

```http
GET /projects/{projectId}/backlinks/{backlinkId}
```

**Response:**

```json
{
  "id": "uuid",
  "sourceUrl": "https://referring-site.com/article",
  "sourceDomain": "referring-site.com",
  "targetUrl": "https://example.com/target-page",
  "anchorText": "anchor text",
  "linkType": "dofollow",
  "authorityScore": 65,
  "status": "active",
  "discoveredAt": "2025-08-18T10:30:00Z",
  "lastChecked": "2025-08-18T10:30:00Z",
  "additionalInfo": {
    "pageTitle": "Best Design Resources",
    "contextText": "Check out this amazing design resource...",
    "position": "middle",
    "isSponsored": false
  }
}
```

### 2.5 Update Backlink

```http
PUT /projects/{projectId}/backlinks/{backlinkId}
```

**Request Body:**

```json
{
  "anchorText": "updated anchor text",
  "linkType": "nofollow",
  "status": "broken",
  "notes": "Link became broken on 2025-08-18"
}
```

### 2.6 Delete Backlink

```http
DELETE /projects/{projectId}/backlinks/{backlinkId}
```

**Response:**

```json
{
  "message": "Backlink deleted successfully",
  "deletedId": "uuid"
}
```

---

## 🎯 3. BACKLINK GAP ANALYSIS APIs

### 3.1 Compare Backlink Profiles

```http
POST /seo/backlink-gap/compare
```

**Request Body:**

```json
{
  "targetDomain": "example.com",
  "competitors": ["competitor1.com", "competitor2.com"],
  "filters": {
    "minAuthorityScore": 30,
    "linkType": "dofollow",
    "language": "en",
    "minReferringDomains": 5
  }
}
```

**Response:**

```json
{
  "overview": {
    "targetDomain": "example.com",
    "metrics": {
      "totalBacklinks": 81346,
      "referringDomains": 20532,
      "authorityScore": 61,
      "organicTraffic": 333000
    },
    "competitors": [
      {
        "domain": "competitor1.com",
        "backlinks": 95000,
        "referringDomains": 25000,
        "authorityScore": 75,
        "organicTraffic": 450000
      }
    ],
    "gaps": {
      "missingOpportunities": 1500,
      "uniqueOpportunities": 800,
      "sharedSources": 300
    }
  },
  "prospects": [
    {
      "domain": "high-authority-site.com",
      "authorityScore": 91,
      "monthlyVisits": 1300000,
      "competitorLinks": ["competitor1.com", "competitor2.com"],
      "targetPresent": false,
      "linkType": "Editorial",
      "category": "Business & Industrial",
      "opportunity": "Best"
    }
  ],
  "authorityTrend": [
    {
      "date": "2022-01-01",
      "targetDomain": 95.5,
      "competitor1": 76.8,
      "competitor2": 65.2
    }
  ],
  "referringDomainsTrend": [
    {
      "date": "2022-01-01",
      "targetDomain": 81,
      "competitor1": 70,
      "competitor2": 63
    }
  ]
}
```

### 3.2 Get Link Building Prospects

```http
GET /seo/backlink-gap/prospects/{domain}
```

**Parameters:**

- `competitors` (query) - Comma-separated competitor domains
- `minAuthorityScore` (query) - Minimum authority score filter
- `limit` (query) - Number of prospects (default: 100)
- `linkType` (query) - Link type filter (dofollow, nofollow, all)
- `language` (query) - Language filter

**Response:**

```json
{
  "prospects": [
    {
      "domain": "topdust.com",
      "authorityScore": 91,
      "monthlyVisits": 120000000,
      "competitorLinks": 3,
      "targetPresent": false,
      "linkTypes": ["Editorial", "Resource"],
      "category": "Business & Industrial",
      "contactInfo": {
        "email": "contact@topdust.com",
        "socialMedia": ["twitter", "linkedin"]
      },
      "lastActivity": "2025-01-10T00:00:00Z",
      "opportunity": "High"
    }
  ],
  "summary": {
    "totalProspects": 1500,
    "highPriority": 120,
    "mediumPriority": 380,
    "lowPriority": 1000
  },
  "filters": {
    "applied": {
      "minAuthorityScore": 30,
      "linkType": "dofollow",
      "language": "en"
    }
  }
}
```

---

## 📈 4. BACKLINK ANALYTICS CHARTS DATA

### 4.1 Get Backlink Timeline Data

```http
GET /projects/{projectId}/backlinks/timeline
```

**Parameters:**

- `period` (query) - Time period (1y, 6m, 3m, 1m)
- `metric` (query) - Metric type (backlinks, domains, authority)

**Response:**

```json
{
  "timeline": [
    {
      "date": "2022-05-21",
      "backlinks": 600,
      "referringDomains": 450,
      "newBacklinks": 25,
      "lostBacklinks": 8
    }
  ],
  "summary": {
    "totalPeriod": "1 year",
    "growth": {
      "backlinks": "+15.5%",
      "domains": "+12.3%"
    }
  }
}
```

---

## 📊 5. RESPONSE DATA MODELS

### DomainBacklinkMetrics

```typescript
interface DomainBacklinkMetrics {
  domain: string;
  pageAuthority: string;
  domainAuthority: string;
  outboundDomain: string;
  monthlyVisits: string;
  spamScore: string;
  authorityScore: number;
  backlinks: {
    total: number;
    totalDomains: number;
    newBacklinks: number;
    lostBacklinks: number;
  };
}
```

### BacklinkAnalytics

```typescript
interface BacklinkAnalytics {
  summary: BacklinkSummary;
  trends: BacklinkTrends;
  newAndLost: NewAndLostData;
  anchors: AnchorData[];
  topDomains: TopDomain[];
  topPages: TopPage[];
}
```

### BacklinkGapAnalysis

```typescript
interface BacklinkGapAnalysis {
  overview: {
    targetDomain: string;
    metrics: DomainMetrics;
    competitors: CompetitorMetrics[];
    gaps: GapMetrics;
  };
  prospects: LinkProspect[];
  authorityTrend: TrendData[];
  referringDomainsTrend: TrendData[];
}
```

---

## 🚦 Status Codes

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (Invalid parameters)
- `401` - Unauthorized (Invalid token)
- `403` - Forbidden (Subscription limit exceeded)
- `404` - Not Found (Project/Backlink not found)
- `409` - Conflict (Backlink already exists)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

---

## 📊 Usage Limits

### Rate Limits

- **Free Plan**: 10 requests/hour
- **Basic Plan**: 100 requests/hour
- **Pro Plan**: 1000 requests/hour
- **Enterprise**: Unlimited

### Data Limits

- **Backlinks per project**: Max 10,000
- **Domains per analysis**: Max 50
- **Historical data**: Up to 2 years
- **Export limits**: 100 exports/month

---

## 🔄 Pagination

Tất cả list endpoints hỗ trợ pagination:

**Parameters:**

- `page` - Page number (bắt đầu từ 1)
- `limit` - Items per page (max 100)

**Response format:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🛠️ Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "BACKLINK_NOT_FOUND",
    "message": "Backlink with ID uuid not found",
    "details": {
      "backlinkId": "uuid",
      "projectId": "project-uuid"
    }
  },
  "timestamp": "2025-08-18T10:30:00Z",
  "path": "/projects/uuid/backlinks/uuid"
}
```

### Common Error Codes

- `DOMAIN_INVALID` - Domain format không hợp lệ
- `PROJECT_NOT_FOUND` - Project không tồn tại
- `BACKLINK_NOT_FOUND` - Backlink không tồn tại
- `BACKLINK_DUPLICATE` - Backlink đã tồn tại
- `QUOTA_EXCEEDED` - Vượt quá giới hạn quota
- `RATE_LIMIT_EXCEEDED` - Vượt quá rate limit

---

## 📝 Notes

1. **Domain Format**: Chỉ cần domain name (example.com), không cần protocol
2. **Date Format**: Sử dụng ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
3. **Authority Scores**: Thang điểm từ 0-100
4. **Link Types**: dofollow, nofollow, sponsored, ugc
5. **Status Values**: active, broken, lost, redirected

---

## 🔗 Related Documentation

- [Project API Documentation](./PROJECT_API.md)
- [Competitive Analysis API](./Competitive_API.md)
- [Domain Overview API](./DOMAIN_OVERVIEW_API.md)
- [SEO Analytics API](./SEO_ANALYTICS_API.md)

---

## 🚀 Getting Started

1. Tạo project với domain của bạn
2. Sử dụng Domain Overview API để phân tích backlink metrics
3. Thêm backlinks vào project để tracking
4. Sử dụng Backlink Gap Analysis để tìm opportunities
5. Monitor backlink performance qua Analytics APIs

**Happy Link Building! 🔗**
