# Position Tracking API - Documentation

## 📊 Tổng quan

Position Tracking API cho phép theo dõi vị trí từ khóa trên các công cụ tìm kiếm theo thời gian. Hệ thống cung cấp các tính năng:

- ✅ Theo dõi vị trí từng keyword
- ✅ Lưu trữ lịch sử ranking
- ✅ Phân tích xu hướng thay đổi
- ✅ Tổng quan ranking theo project
- ✅ Thống kê chi tiết

## 🎯 API Endpoints

### 1. Thêm Ranking Record

**Endpoint:** `POST /keywords/:keywordId/rankings`

**Mô tả:** Thêm một bản ghi ranking mới cho keyword

**Headers:**

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "position": 5,
  "url": "https://example.com/page",
  "metadata": {
    "search_engine": "google",
    "location": "Vietnam",
    "device": "desktop",
    "serp_features": ["featured_snippet"]
  }
}
```

**Response (201):**

```json
{
  "id": "ranking-uuid",
  "keywordId": "keyword-uuid",
  "position": 5,
  "url": "https://example.com/page",
  "date": "2025-08-01T10:00:00.000Z",
  "metadata": {
    "search_engine": "google",
    "location": "Vietnam",
    "device": "desktop"
  },
  "createdAt": "2025-08-01T10:00:00.000Z"
}
```

**Validation Rules:**

- `position`: Số nguyên từ 0-200
- `url`: URL hợp lệ (optional)
- `metadata`: Object chứa thông tin bổ sung (optional)

---

### 2. Lấy Lịch Sử Ranking

**Endpoint:** `GET /keywords/:keywordId/rankings`

**Mô tả:** Lấy lịch sử thay đổi vị trí của keyword

**Headers:**

```http
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

```
?days=30&startDate=2025-07-01&endDate=2025-08-01
```

| Parameter | Type   | Required | Default | Description                |
| --------- | ------ | -------- | ------- | -------------------------- |
| days      | number | No       | 30      | Số ngày lấy dữ liệu        |
| startDate | string | No       | -       | Ngày bắt đầu (YYYY-MM-DD)  |
| endDate   | string | No       | -       | Ngày kết thúc (YYYY-MM-DD) |

**Response (200):**

```json
{
  "keyword": {
    "id": "keyword-uuid",
    "keyword": "seo tools",
    "currentRanking": 5,
    "project": "My SEO Project"
  },
  "rankings": [
    {
      "id": "ranking-uuid",
      "position": 5,
      "url": "https://example.com/seo-tools",
      "date": "2025-08-01T06:00:00.000Z",
      "metadata": {
        "search_engine": "google"
      }
    }
  ],
  "trend": "up",
  "summary": {
    "totalRecords": 30,
    "bestPosition": 3,
    "worstPosition": 15,
    "averagePosition": 8.5
  }
}
```

**Trend Values:**

- `up`: Xu hướng tăng (vị trí cải thiện)
- `down`: Xu hướng giảm (vị trí xấu đi)
- `stable`: Ổn định
- `no-data`: Không đủ dữ liệu

---

### 3. Tổng Quan Ranking Project

**Endpoint:** `GET /projects/:projectId/rankings/overview`

**Mô tả:** Lấy tổng quan ranking của tất cả keywords trong project

**Headers:**

```http
Authorization: Bearer <jwt-token>
```

**Response (200):**

```json
{
  "project": {
    "id": "project-uuid",
    "name": "My SEO Project",
    "domain": "example.com"
  },
  "summary": {
    "totalKeywords": 150,
    "trackedKeywords": 145,
    "rankedKeywords": 120,
    "avgPosition": 12.5
  },
  "keywords": [
    {
      "id": "keyword-uuid",
      "keyword": "seo tools",
      "currentRanking": 5,
      "targetUrl": "https://example.com/seo-tools",
      "isTracking": true,
      "searchVolume": 1000,
      "difficulty": 65.5,
      "trend": "up",
      "rankingHistory": [
        {
          "position": 5,
          "date": "2025-08-01T06:00:00.000Z"
        }
      ]
    }
  ]
}
```

## 🔧 Implementation Details

### Database Schema

**Rankings Table:**

```sql
CREATE TABLE rankings (
  id UUID PRIMARY KEY,
  keyword_id UUID REFERENCES keywords(id),
  position INTEGER NOT NULL,
  url TEXT,
  date TIMESTAMP DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Service Methods

**RankingsService** cung cấp các methods:

1. `createRanking(userId, keywordId, createRankingDto)`
2. `getRankingHistory(userId, keywordId, query)`
3. `getProjectRankingsOverview(userId, projectId)`
4. `calculateTrend(rankings)` - Private method

### Trend Calculation Logic

```typescript
private calculateTrend(rankings: any[]): 'up' | 'down' | 'stable' | 'no-data' {
  if (rankings.length < 2) return 'no-data';

  const recent = rankings.slice(-7); // 7 ngày gần nhất
  const older = rankings.slice(-14, -7); // 7 ngày trước đó

  const recentAvg = recent.reduce((sum, r) => sum + r.position, 0) / recent.length;
  const olderAvg = older.reduce((sum, r) => sum + r.position, 0) / older.length;

  const difference = olderAvg - recentAvg; // Positive = cải thiện

  if (Math.abs(difference) < 1) return 'stable';
  return difference > 0 ? 'up' : 'down';
}
```

## 📝 Usage Examples

### Example 1: Thêm ranking mới

```javascript
const response = await fetch('/keywords/keyword-123/rankings', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer your-jwt-token',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    position: 8,
    url: 'https://mysite.com/target-page',
    metadata: {
      search_engine: 'google',
      location: 'Vietnam',
      device: 'mobile',
    },
  }),
});
```

### Example 2: Lấy lịch sử 30 ngày

```javascript
const response = await fetch('/keywords/keyword-123/rankings?days=30', {
  headers: {
    Authorization: 'Bearer your-jwt-token',
  },
});

const data = await response.json();
console.log('Trend:', data.trend);
console.log('Best position:', data.summary.bestPosition);
```

### Example 3: Tổng quan project

```javascript
const response = await fetch('/projects/project-123/rankings/overview', {
  headers: {
    Authorization: 'Bearer your-jwt-token',
  },
});

const data = await response.json();
console.log('Total keywords:', data.summary.totalKeywords);
console.log('Average position:', data.summary.avgPosition);
```

## 🚨 Error Handling

### Common Error Responses

**404 - Keyword Not Found:**

```json
{
  "success": false,
  "message": "Keyword not found",
  "statusCode": 404,
  "error": "Not Found"
}
```

**400 - Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "error": "Bad Request",
  "details": ["position must be a number between 0 and 200"]
}
```

**401 - Unauthorized:**

```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401,
  "error": "Unauthorized"
}
```

## ⚡ Performance & Limits

### Rate Limits

| Plan         | Daily Requests | Monthly Requests |
| ------------ | -------------- | ---------------- |
| Free         | 10             | 300              |
| Starter      | 50             | 1,500            |
| Professional | 200            | 6,000            |
| Agency       | 1,000          | 30,000           |

### Best Practices

1. **Batch Updates**: Sử dụng bulk operations khi có thể
2. **Caching**: Cache kết quả tổng quan project
3. **Pagination**: Sử dụng limit cho datasets lớn
4. **Date Filtering**: Lọc theo ngày để giảm tải

### Performance Tips

```javascript
// ✅ Good: Lấy chỉ 7 ngày gần nhất
GET /keywords/123/rankings?days=7

// ❌ Avoid: Lấy toàn bộ history
GET /keywords/123/rankings?days=365

// ✅ Good: Sử dụng date range cụ thể
GET /keywords/123/rankings?startDate=2025-07-25&endDate=2025-08-01
```

## 🔒 Security & Authentication

### Required Headers

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Permission Model

- Users chỉ có thể truy cập keywords thuộc về projects của họ
- Mỗi request đều verify ownership thông qua userId từ JWT token

### Data Validation

- Position: 0-200 (Google có tối đa 200 kết quả)
- URL: Valid URL format
- Date: ISO 8601 format
- Metadata: Valid JSON object

## 📈 Analytics & Reporting

### Available Metrics

1. **Position Changes**: Thay đổi vị trí theo thời gian
2. **Trend Analysis**: Xu hướng tăng/giảm/ổn định
3. **Best/Worst Positions**: Vị trí tốt nhất và tệ nhất
4. **Average Position**: Vị trí trung bình
5. **Visibility Score**: Điểm khả năng hiển thị

### Export Options

```javascript
// Lấy dữ liệu để export CSV
const rankings = await fetch('/keywords/123/rankings?days=90');
const csvData = rankings.map((r) => ({
  date: r.date,
  position: r.position,
  url: r.url,
}));
```

## 🛠️ Development & Testing

### Testing Endpoints

1. **Unit Tests**: Test service methods
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete workflows

### Development Setup

```bash
# Start development server
npm run start:dev

# Run tests
npm test

# API Documentation
http://localhost:3001/api/docs
```

## 📞 Support & Resources

- **API Documentation**: `/api/docs`
- **Postman Collection**: `docs/RankTracker_Pro_API.postman_collection.json`
- **Support Email**: support@ranktackerpro.com
- **Status Page**: https://status.ranktackerpro.com

---

**Last Updated:** August 1, 2025  
**API Version:** 1.0.0  
**Module Version:** RankingsModule v1.0
