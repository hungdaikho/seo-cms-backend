# Competitive Research API Documentation

Tài liệu API cho module Competitive Research trong RankTracker Pro, bao gồm Domain Overview, Keyword Gap Analysis, và Backlink Gap Analysis.

## 🚀 Base URL

```
https://api.ranktracker.com
```

## 🔒 Authentication

Tất cả API endpoints yêu cầu Bearer token trong header:

```
Authorization: Bearer {your_jwt_token}
```

---

## 📊 1. DOMAIN OVERVIEW APIs

### 1.1 Get Domain Overview

```http
GET /api/v1/seo/domain-overview/{domain}
```

**Parameters:**

- `domain` (path) - Domain cần phân tích (e.g., example.com)
- `includeSubdomains` (query) - Bao gồm subdomain (optional, default: false)

**Response:**

```json
{
  "domain": "example.com",
  "authorityScore": 61,
  "organicKeywords": 636805,
  "organicTraffic": 333000,
  "organicCost": 552500,
  "paidKeywords": 3605,
  "paidTraffic": 33000,
  "backlinks": 81346,
  "referringDomains": 20532,
  "topCountries": [
    {
      "country": "US",
      "traffic": 200000,
      "percentage": 60.2
    }
  ],
  "trafficTrend": [
    {
      "date": "2022-05-01",
      "visits": 333000,
      "uniqueVisitors": 33000,
      "newVisitors": 552500
    }
  ],
  "topPages": [
    {
      "page": "/studio/blog/a-hands-on-guide-to-",
      "trafficShare": 67.05,
      "uniquePageviews": 285000,
      "uniqueVisitors": 19000
    }
  ],
  "seoScore": 80,
  "avgVisitDuration": 641000,
  "authority": {
    "domainRating": 61,
    "ahrefsRating": 85,
    "mozScore": 45
  }
}
```

### 1.2 Get Domain Top Keywords

```http
GET /api/v1/seo/domain-overview/top-keywords/{domain}
```

**Parameters:**

- `domain` (path) - Domain to analyze
- `limit` (query) - Số lượng keywords (default: 100, max: 500)
- `country` (query) - Country code (default: 'US')

**Response:**

```json
{
  "data": [
    {
      "keyword": "Designer",
      "position": 12,
      "searchVolume": 2000,
      "traffic": 150,
      "cpc": 46,
      "difficulty": 54,
      "trend": "up",
      "url": "https://example.com/design",
      "intent": "N",
      "serp": 31
    }
  ],
  "total": 636805,
  "domain": "example.com",
  "country": "US"
}
```

### 1.3 Get Domain Competitors

```http
GET /api/v1/seo/domain-overview/competitors/{domain}
```

**Parameters:**

- `domain` (path) - Domain to analyze
- `limit` (query) - Số lượng competitors (default: 50, max: 100)
- `country` (query) - Country code (default: 'US')

**Response:**

```json
{
  "data": [
    {
      "domain": "competitor1.com",
      "competitionLevel": 85,
      "commonKeywords": 25000,
      "authorityScore": 75,
      "trafficGap": 150000,
      "organicKeywords": 450000,
      "estimatedTraffic": 280000
    }
  ],
  "total": 50,
  "domain": "example.com",
  "country": "US"
}
```

### 1.4 Get Domain Authority Metrics

```http
GET /api/v1/seo/domain-overview/authority/{domain}
```

**Response:**

```json
{
  "domain": "example.com",
  "authorityScore": 61,
  "ahrefsRating": 85,
  "mozScore": 45,
  "semrushScore": 70,
  "majesticScore": 55,
  "backlinks": 81346,
  "referringDomains": 20532,
  "lastUpdated": "2025-01-15T10:30:00Z"
}
```

---

## 🔍 2. KEYWORD GAP ANALYSIS APIs

### 2.1 Compare Keyword Gaps

```http
POST /api/v1/seo/keyword-gap/compare
```

**Request Body:**

```json
{
  "targetDomain": "example.com",
  "competitors": ["competitor1.com", "competitor2.com"],
  "country": "US",
  "database": "all",
  "device": "desktop",
  "filters": {
    "minSearchVolume": 100,
    "maxDifficulty": 80,
    "keywordType": "organic"
  }
}
```

**Response:**

```json
{
  "overview": {
    "targetDomain": "example.com",
    "competitors": ["competitor1.com", "competitor2.com"],
    "comparison": {
      "shared": 36805,
      "missing": 6606,
      "weak": 16805,
      "strong": 12805,
      "untapped": 3605,
      "unique": 134805
    }
  },
  "keywordDetails": [
    {
      "keyword": "Designer",
      "intent": "N",
      "targetDomain": {
        "position": 12,
        "traffic": 150,
        "volume": 2000,
        "cpc": 0,
        "result": "12M"
      },
      "competitor1": {
        "position": 22,
        "traffic": 80,
        "volume": 1220,
        "cpc": 0,
        "result": "12M"
      },
      "competitor2": {
        "position": 55,
        "traffic": 200,
        "volume": 12550,
        "cpc": 0,
        "result": "20M"
      },
      "kd": 70,
      "status": "missing"
    }
  ],
  "opportunities": [
    {
      "category": "high_volume_low_competition",
      "keywords": 150,
      "estimatedTraffic": 25000
    }
  ],
  "totalKeywords": 636805,
  "exportUrl": "/api/v1/exports/keyword-gap/{sessionId}"
}
```

### 2.2 Get Keyword Overlap Analysis

```http
GET /api/v1/seo/keyword-gap/overlap
```

**Parameters:**

- `domains` (query) - Comma-separated domains (max 3)
- `country` (query) - Country code

**Response:**

```json
{
  "overview": {
    "domains": ["webflow.com", "wix.com"],
    "totalUnique": 500000,
    "overlap": {
      "webflow_only": 300000,
      "wix_only": 150000,
      "shared": 50000
    }
  },
  "vennDiagram": {
    "webflow": {
      "total": 350000,
      "unique": 300000,
      "shared": 50000
    },
    "wix": {
      "total": 200000,
      "unique": 150000,
      "shared": 50000
    }
  },
  "topOpportunities": [
    {
      "keyword": "etsy",
      "volume": 16600000,
      "missing": "Weak",
      "competitors": {
        "webflow": null,
        "wix": 2600000
      }
    }
  ]
}
```

---

## 🔗 3. BACKLINK GAP ANALYSIS APIs

### 3.1 Compare Backlink Profiles

```http
POST /api/v1/seo/backlink-gap/compare
```

**Request Body:**

```json
{
  "targetDomain": "example.com",
  "competitors": ["competitor1.com", "competitor2.com"],
  "filters": {
    "minAuthorityScore": 30,
    "linkType": "dofollow",
    "language": "en"
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
      "category": "Business & Industrial Business Operations",
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
GET /api/v1/seo/backlink-gap/prospects/{domain}
```

**Parameters:**

- `domain` (path) - Target domain
- `competitors` (query) - Comma-separated competitor domains
- `authorityScore` (query) - Minimum authority score filter
- `limit` (query) - Number of prospects (default: 100)

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
      "lastActivity": "2025-01-10T00:00:00Z"
    }
  ],
  "summary": {
    "totalProspects": 1500,
    "highPriority": 120,
    "mediumPriority": 380,
    "lowPriority": 1000
  }
}
```

---

## 🏆 4. COMPETITIVE ANALYSIS APIs

### 4.1 Get Competitive Overview

```http
GET /api/v1/seo/competitive-analysis/{projectId}
```

**Parameters:**

- `projectId` (path) - Project UUID
- `timeframe` (query) - Time period (30d, 90d, 1y)

**Response:**

```json
{
  "project": {
    "domain": "example.com",
    "competitors": [
      {
        "domain": "competitor1.com",
        "name": "Main Competitor",
        "isActive": true
      }
    ]
  },
  "rankings": {
    "myProject": {
      "averagePosition": 32.9,
      "totalKeywords": 4,
      "visibility": 5.2,
      "trend": "down"
    },
    "competitors": [
      {
        "domain": "competitor1.com",
        "averagePosition": 8.5,
        "totalKeywords": 15,
        "visibility": 25.3,
        "trend": "up"
      }
    ]
  },
  "keywordGaps": {
    "missing": 150,
    "weak": 80,
    "opportunities": 45
  },
  "backlinkGaps": {
    "missingDomains": 1200,
    "prospects": 300,
    "highPriority": 50
  }
}
```

### 4.2 Get Market Share Analysis

```http
GET /api/v1/seo/competitive-analysis/market-share
```

**Parameters:**

- `domains` (query) - Comma-separated domains
- `keywords` (query) - Comma-separated keywords or keyword group
- `country` (query) - Country code

**Response:**

```json
{
  "marketShare": [
    {
      "domain": "example.com",
      "visibility": 15.2,
      "marketShare": 8.5,
      "organicTraffic": 333000,
      "topKeywords": 5
    }
  ],
  "topKeywords": [
    {
      "keyword": "Designer",
      "totalVolume": 50000,
      "marketLeader": "competitor1.com",
      "positions": {
        "example.com": 12,
        "competitor1.com": 3,
        "competitor2.com": 8
      }
    }
  ],
  "insights": [
    {
      "type": "opportunity",
      "message": "You have potential to gain 25% more traffic by improving position for 'Designer' keyword",
      "impact": "high"
    }
  ]
}
```

---

## 📊 5. RESPONSE DATA MODELS

### DomainOverview

```typescript
interface DomainOverview {
  domain: string;
  authorityScore: number;
  organicKeywords: number;
  organicTraffic: number;
  organicCost: number;
  backlinks: number;
  referringDomains: number;
  topCountries: CountryTraffic[];
  trafficTrend: TrafficTrend[];
}
```

### KeywordGapAnalysis

```typescript
interface KeywordGapAnalysis {
  overview: {
    targetDomain: string;
    competitors: string[];
    comparison: GapComparison;
  };
  keywordDetails: KeywordComparisonDetail[];
  opportunities: OpportunityCategory[];
}
```

### BacklinkGapAnalysis

```typescript
interface BacklinkGapAnalysis {
  overview: BacklinkOverview;
  prospects: LinkProspect[];
  authorityTrend: TrendData[];
  referringDomainsTrend: TrendData[];
}
```

---

## 🚦 Status Codes

- `200` - Success
- `400` - Bad Request (Invalid parameters)
- `401` - Unauthorized (Invalid token)
- `403` - Forbidden (Subscription limit exceeded)
- `404` - Not Found (Domain/Project not found)
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

- **Keywords per analysis**: Max 100,000
- **Competitors per comparison**: Max 10
- **Historical data**: Up to 2 years
- **Export limits**: 50 exports/month

---

## 🔄 Pagination

Tất cả list endpoints hỗ trợ pagination:

```
GET /api/endpoint?page=1&limit=20&sortBy=field&sortOrder=asc
```

**Response Format:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50,
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
    "code": "INVALID_DOMAIN",
    "message": "Domain parameter is required and must be valid",
    "details": {
      "field": "domain",
      "value": "invalid-domain"
    },
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

### Common Error Codes

- `INVALID_DOMAIN` - Domain format không hợp lệ
- `DOMAIN_NOT_FOUND` - Domain không tồn tại
- `QUOTA_EXCEEDED` - Vượt quá quota API
- `INVALID_COUNTRY` - Country code không hợp lệ
- `COMPETITOR_LIMIT` - Vượt quá số competitor cho phép

---

## 📝 Notes

1. **Real-time Data**: Một số metrics được cache 24h để tối ưu performance
2. **Export Functionality**: Hỗ trợ export CSV/Excel cho tất cả comparison data
3. **Webhooks**: Hỗ trợ webhook notifications cho analysis completion
4. **Historical Tracking**: Lưu trữ historical data cho trend analysis
5. **Mobile Support**: Tất cả APIs tương thích với mobile applications

---

## 🔗 Related Documentation

- [Authentication API](./AUTH_API.md)
- [Project Management API](./PROJECT_API.md)
- [Rank Tracking API](./RANK_TRACKING_API.md)
- [OpenAPI Specification](./docs/openapi.yaml)
- [Postman Collection](./docs/RankTracker_Pro_API.postman_collection.json)
