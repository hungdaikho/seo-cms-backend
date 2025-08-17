# Rank Tracking API Documentation

## 📊 Overview

Hệ thống Rank Tracking API cung cấp các chức năng theo dõi thứ hạng từ khóa toàn diện, tương thích với giao diện RankTracker Pro như trong hình. API hỗ trợ theo dõi vị trí từ khóa, phân tích xu hướng, và báo cáo chi tiết.

## 🎯 Core Features

- **Keyword Position Tracking**: Theo dõi vị trí từ khóa theo thời gian
- **Ranking Trends**: Phân tích xu hướng tăng/giảm thứ hạng
- **Project Overview**: Tổng quan thứ hạng cho từng project
- **Historical Data**: Lịch sử thay đổi thứ hạng
- **Bulk Operations**: Thao tác hàng loạt với từ khóa
- **Real-time Updates**: Cập nhật thời gian thực

---

## 🔍 1. PROJECT RANKING OVERVIEW APIs

### 1.1 Get Project Rankings Overview

```http
GET /projects/{projectId}/rankings/overview
```

**Mô tả**: Lấy tổng quan thứ hạng của project, hiển thị thông tin như trong giao diện RankTracker Pro

**Response:**

```json
{
  "project": {
    "id": "uuid",
    "name": "THIẾT KẾ WEB",
    "domain": "example.com",
    "location": "Nigeria NG",
    "lastUpdated": "2022-08-19T00:00:00Z"
  },
  "summary": {
    "totalKeywords": 4,
    "trackedKeywords": 4,
    "rankedKeywords": 4,
    "avgPosition": 32.9,
    "previousAvgPosition": 12.94
  },
  "performance": {
    "keywordsUp": 0,
    "keywordsDown": 0,
    "keywordsUnchanged": 0,
    "positionChange": -19.96,
    "trend": "down"
  },
  "rankingDistribution": {
    "notRanking": 4,
    "top100": 0,
    "top10": 0,
    "top3": 0
  },
  "keywords": [
    {
      "id": "uuid",
      "keyword": "Designer",
      "position": 12,
      "change": -12,
      "searchVolume": 3244,
      "difficulty": 31,
      "url": "https://www.facebook.com/login",
      "trend": "down"
    },
    {
      "id": "uuid",
      "keyword": "Designs",
      "position": 9,
      "change": -12,
      "searchVolume": 1200,
      "difficulty": 31,
      "url": "https://www.facebook.com/login",
      "trend": "down"
    }
  ],
  "chartData": [
    {
      "date": "8/1",
      "position": 15.0
    },
    {
      "date": "8/10",
      "position": 12.9
    },
    {
      "date": "8/20",
      "position": 12.9
    }
  ]
}
```

### 1.2 Get Project Statistics

```http
GET /projects/{projectId}/stats
```

**Response:**

```json
{
  "totalKeywords": 4,
  "averageRanking": 32.9,
  "rankingDistribution": {
    "top3": 0,
    "top10": 0,
    "top50": 0,
    "beyond50": 0,
    "notRanked": 4
  },
  "improvedKeywords": 0,
  "declinedKeywords": 4,
  "stableKeywords": 0,
  "topKeywords": [
    {
      "id": "uuid",
      "keyword": "Designs",
      "currentRanking": 9
    }
  ],
  "recentChanges": 4,
  "lastUpdate": "2022-08-19T00:00:00Z"
}
```

---

## 🎯 2. KEYWORD MANAGEMENT APIs

### 2.1 Add Keyword to Project

```http
POST /projects/{projectId}/keywords
```

**Request Body:**

```json
{
  "keyword": "Designer",
  "targetUrl": "https://example.com/design",
  "searchVolume": 3244,
  "difficulty": 31,
  "cpc": 2.5
}
```

**Response:**

```json
{
  "id": "uuid",
  "keyword": "Designer",
  "targetUrl": "https://example.com/design",
  "searchVolume": 3244,
  "difficulty": 31,
  "cpc": 2.5,
  "currentRanking": 0,
  "isTracking": true,
  "createdAt": "2024-01-15T10:30:00Z"
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
      "keyword": "Designer",
      "targetUrl": "https://example.com/design"
    },
    {
      "keyword": "Designs",
      "targetUrl": "https://example.com/designs"
    },
    {
      "keyword": "Design",
      "targetUrl": "https://example.com/portfolio"
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
      "keyword": "Designer",
      "position": 12,
      "change": -12,
      "searchVolume": 3244,
      "difficulty": 31,
      "url": "https://www.facebook.com/login",
      "currentRanking": 12,
      "previousRanking": 24,
      "targetUrl": "https://example.com/design",
      "isTracking": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### 2.4 Update Keyword

```http
PATCH /keywords/{keywordId}
```

**Request Body:**

```json
{
  "targetUrl": "https://example.com/new-design-page",
  "isTracking": true
}
```

### 2.5 Delete Keyword

```http
DELETE /keywords/{keywordId}
```

---

## 📈 3. RANKING HISTORY APIs

### 3.1 Add Ranking Record

```http
POST /keywords/{keywordId}/rankings
```

**Request Body:**

```json
{
  "position": 12,
  "url": "https://www.facebook.com/login",
  "metadata": {
    "searchEngine": "google",
    "location": "Nigeria",
    "device": "desktop"
  }
}
```

**Response:**

```json
{
  "id": "uuid",
  "keywordId": "uuid",
  "position": 12,
  "url": "https://www.facebook.com/login",
  "metadata": {
    "searchEngine": "google",
    "location": "Nigeria",
    "device": "desktop"
  },
  "date": "2024-01-15T10:30:00Z"
}
```

### 3.2 Get Keyword Ranking History

```http
GET /keywords/{keywordId}/rankings?days=30
```

**Query Parameters:**

- `days`: Số ngày lấy dữ liệu (mặc định: 30)
- `startDate`: Ngày bắt đầu (format: YYYY-MM-DD)
- `endDate`: Ngày kết thúc (format: YYYY-MM-DD)

**Response:**

```json
{
  "keyword": {
    "id": "uuid",
    "keyword": "Designer",
    "currentRanking": 12,
    "project": "THIẾT KẾ WEB"
  },
  "rankings": [
    {
      "id": "uuid",
      "position": 24,
      "url": "https://www.facebook.com/login",
      "date": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "position": 12,
      "url": "https://www.facebook.com/login",
      "date": "2024-01-15T00:00:00Z"
    }
  ],
  "trend": "down",
  "summary": {
    "totalRecords": 2,
    "bestPosition": 12,
    "worstPosition": 24,
    "averagePosition": 18.0
  }
}
```

### 3.3 Get Keyword Rankings (Alternative Endpoint)

```http
GET /keywords/{keywordId}/rankings?days=30
```

**Response:**

```json
[
  {
    "id": "uuid",
    "keywordId": "uuid",
    "position": 12,
    "url": "https://www.facebook.com/login",
    "metadata": {},
    "date": "2024-01-15T10:30:00Z"
  }
]
```

---

## 📊 4. SERP ANALYSIS APIs

### 4.1 Get SERP Analysis Data

```http
GET /projects/{projectId}/serp-analysis
```

**Response:**

```json
{
  "serpData": [
    {
      "rank": 1,
      "url": "http://wordpress.com/",
      "page": 44,
      "backlinks": "20K",
      "searchTraffic": "135.93K",
      "keywords": 900
    },
    {
      "rank": 2,
      "url": "http://wordpress.org/",
      "page": 44,
      "backlinks": "20K",
      "searchTraffic": "135.93K",
      "keywords": 900
    }
  ],
  "total": 6,
  "domain": "example.com"
}
```

---

## 🔄 5. BULK OPERATIONS APIs

### 5.1 Bulk Update Rankings

```http
POST /rankings/bulk-update
```

**Request Body:**

```json
{
  "rankings": [
    {
      "keywordId": "uuid1",
      "position": 12,
      "url": "https://example.com/page1"
    },
    {
      "keywordId": "uuid2",
      "position": 9,
      "url": "https://example.com/page2"
    }
  ]
}
```

### 5.2 Bulk Delete Keywords

```http
DELETE /keywords/bulk
```

**Request Body:**

```json
{
  "keywordIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## 📋 6. RESPONSE MODELS

### RankingTrendData

```typescript
{
  date: string; // Format: "M/d" hoặc "YYYY-MM-DD"
  averagePosition: number;
  totalKeywords: number;
  top10Keywords: number;
  top3Keywords: number;
}
```

### KeywordRankingData

```typescript
{
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  change: number; // Positive = cải thiện, Negative = giảm
  searchVolume: number;
  difficulty: number;
  url: string;
  trend: 'up' | 'down' | 'stable' | 'no-data';
}
```

### ProjectRankingSummary

```typescript
{
  totalKeywords: number;
  trackedKeywords: number;
  rankedKeywords: number;
  avgPosition: number;
  previousAvgPosition: number;
  keywordsUp: number;
  keywordsDown: number;
  keywordsUnchanged: number;
}
```

---

## 🎨 7. CHART DATA FORMAT

### Position Chart Data

```json
{
  "chartData": [
    {
      "date": "8/1", // Format ngắn cho chart
      "position": 15.0
    },
    {
      "date": "8/10",
      "position": 12.9
    }
  ]
}
```

### Ranking Distribution Chart

```json
{
  "rankingDistribution": {
    "notRanking": 4, // Màu xanh dương trong pie chart
    "top100": 0, // Màu cam
    "top10": 0, // Màu xanh lá
    "top3": 0 // Màu đỏ
  }
}
```

---

## 🔔 8. WEBHOOKS & REAL-TIME UPDATES

### 8.1 Ranking Change Webhook

```json
{
  "event": "ranking_change",
  "data": {
    "keywordId": "uuid",
    "keyword": "Designer",
    "projectId": "uuid",
    "oldPosition": 24,
    "newPosition": 12,
    "change": -12,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 8.2 Project Update Webhook

```json
{
  "event": "project_rankings_updated",
  "data": {
    "projectId": "uuid",
    "projectName": "THIẾT KẾ WEB",
    "totalChanges": 4,
    "avgPositionChange": -19.96,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## ⚙️ 9. CONFIGURATION & SETTINGS

### 9.1 Update Project Settings

```http
PATCH /projects/{projectId}/settings
```

**Request Body:**

```json
{
  "settings": {
    "trackingFrequency": "daily",
    "searchEngine": "google",
    "location": "Nigeria",
    "device": "desktop",
    "language": "en"
  }
}
```

### 9.2 Get Tracking Settings

```http
GET /projects/{projectId}/tracking-settings
```

**Response:**

```json
{
  "trackingFrequency": "daily",
  "searchEngine": "google",
  "location": "Nigeria NG",
  "device": "desktop",
  "language": "en",
  "timezone": "UTC",
  "lastUpdated": "2022-08-19T00:00:00Z"
}
```

---

## 🚀 10. ADVANCED FEATURES

### 10.1 Competitor Ranking Comparison

```http
GET /projects/{projectId}/competitor-rankings
```

**Response:**

```json
{
  "competitors": [
    {
      "domain": "competitor1.com",
      "averagePosition": 8.5,
      "totalKeywords": 15,
      "visibility": 25.3
    }
  ],
  "myProject": {
    "averagePosition": 32.9,
    "totalKeywords": 4,
    "visibility": 5.2
  }
}
```

### 10.2 Ranking Forecast

```http
GET /keywords/{keywordId}/forecast?days=30
```

**Response:**

```json
{
  "forecast": [
    {
      "date": "2024-02-01",
      "predictedPosition": 10,
      "confidence": 0.75
    }
  ],
  "trend": "improving",
  "estimatedTimeToTop10": "45 days"
}
```

---

## 📝 11. ERROR HANDLING

### Common Error Responses

```json
{
  "error": {
    "code": "KEYWORD_LIMIT_EXCEEDED",
    "message": "Keyword tracking limit reached for current plan",
    "details": {
      "currentLimit": 25,
      "currentUsage": 25,
      "planType": "free"
    }
  }
}
```

### Error Codes

- `KEYWORD_LIMIT_EXCEEDED`: Vượt quá giới hạn từ khóa
- `PROJECT_NOT_FOUND`: Project không tồn tại
- `KEYWORD_NOT_FOUND`: Từ khóa không tồn tại
- `INVALID_POSITION`: Vị trí không hợp lệ (0-200)
- `TRACKING_DISABLED`: Tracking bị tắt cho từ khóa

---

## 🔐 12. AUTHENTICATION & PERMISSIONS

Tất cả APIs yêu cầu Bearer token:

```http
Authorization: Bearer <jwt-token>
```

### Permission Levels

- **Owner**: Full access tới project
- **Collaborator**: Read-only access
- **Viewer**: Limited read access

---

## 📊 13. RATE LIMITING

### Limits by Plan

- **Free**: 10 requests/day
- **Starter**: 50 requests/day
- **Professional**: 200 requests/day
- **Agency**: 1000 requests/day

### Headers

```http
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 195
X-RateLimit-Reset: 1640995200
```

---

## 🎯 14. INTEGRATION EXAMPLES

### Tracking Multiple Keywords

```javascript
// Add multiple keywords to project
const keywords = [
  { keyword: 'Designer', targetUrl: 'https://example.com/design' },
  { keyword: 'Designs', targetUrl: 'https://example.com/portfolio' },
];

const response = await fetch(`/projects/${projectId}/keywords/bulk`, {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ keywords }),
});
```

### Real-time Position Updates

```javascript
// Update positions for multiple keywords
const rankings = [
  { keywordId: 'uuid1', position: 12, url: 'https://example.com/page1' },
  { keywordId: 'uuid2', position: 9, url: 'https://example.com/page2' },
];

await fetch('/rankings/bulk-update', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ rankings }),
});
```

---

## 📋 15. NOTES

1. **Data Freshness**: Rankings được cập nhật hàng ngày
2. **Historical Data**: Lưu trữ tối đa 12 tháng dữ liệu
3. **Chart Compatibility**: Tương thích với Chart.js và D3.js
4. **Export Support**: Hỗ trợ export CSV/Excel
5. **Mobile API**: Tất cả endpoints tương thích mobile

---

## 🔗 Related Documentation

- [Project API](./PROJECT_API.md)
- [Keyword Research API](./src/organic-research/ORGANIC_RESEACH_API.md)
- [Authentication API](./AUTH_API.md)
- [OpenAPI Specification](./docs/openapi.yaml)
- [Postman Collection](./docs/RankTracker_Pro_API.postman_collection.json)

---

_Last Updated: August 17, 2025_
