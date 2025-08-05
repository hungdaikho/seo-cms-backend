# Traffic Analytics Module Setup Guide

## ✅ Module đã được tạo thành công!

Tôi đã tạo hoàn chỉnh module Traffic Analytics với tất cả các endpoint cần thiết để phân tích traffic website sử dụng dữ liệu thật từ Google Analytics.

## 📁 Cấu trúc module

```
src/traffic-analytics/
├── dto/
│   └── traffic-analytics.dto.ts    # Request/Response DTOs
├── google-analytics.service.ts     # Google Analytics API integration
├── traffic-analytics.service.ts    # Business logic service
├── traffic-analytics.controller.ts # REST API endpoints
└── traffic-analytics.module.ts     # Module configuration
```

## 🔧 Cài đặt

### 1. Environment Variables

Thêm vào file `.env`:

```bash
# Google Analytics Configuration
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=/path/to/service-account-key.json
# HOẶC
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
```

### 2. Google Cloud Setup

1. **Tạo Service Account**:
   - Vào Google Cloud Console
   - Tạo service account mới
   - Download JSON key file

2. **Enable APIs**:
   - Google Analytics Reporting API
   - Google Analytics Data API

3. **Grant Access**:
   - Thêm service account email vào Google Analytics property
   - Role: Viewer

### 3. Integration Setup

Kết nối Google Analytics:

```bash
POST /api/v1/integrations/google/analytics
{
  "projectId": "your-project-id",
  "propertyId": "123456789",
  "credentials": { ... }
}
```

## 🚀 API Endpoints

### Traffic Overview

```
GET /api/v1/projects/{projectId}/traffic-analytics/overview
- Tổng quan traffic và trends
- So sánh period-over-period
- Metrics: sessions, users, pageviews, bounce rate
```

### Page Performance

```
GET /api/v1/projects/{projectId}/traffic-analytics/pages
- Phân tích performance từng trang
- Time on page, bounce rate, entrances
- Sort và filter theo metrics
```

### Traffic Sources

```
GET /api/v1/projects/{projectId}/traffic-analytics/sources
- Phân tích nguồn traffic
- Organic, direct, referral, social, paid
- Conversion tracking
```

### User Behavior

```
GET /api/v1/projects/{projectId}/traffic-analytics/user-behavior
- Device breakdown (mobile, desktop, tablet)
- Geographic distribution
- Browser analytics
```

### Real-time Analytics

```
GET /api/v1/projects/{projectId}/traffic-analytics/real-time
- Active users hiện tại
- Top pages đang xem
- Live traffic data
```

### Data Sync

```
POST /api/v1/projects/{projectId}/traffic-analytics/sync
- Đồng bộ dữ liệu từ GA
- Lưu vào database local
- Faster queries
```

## 🎯 Tính năng chính

✅ **Dữ liệu thật từ Google Analytics 4**
✅ **Real-time analytics**
✅ **Period comparisons**
✅ **Device & geographic analytics**
✅ **Traffic source analysis**
✅ **Page performance tracking**
✅ **Data synchronization**
✅ **Error handling & validation**
✅ **TypeScript support**
✅ **Swagger documentation**

## 📊 Response Examples

### Traffic Overview

```json
{
  "totalSessions": 12450,
  "totalUsers": 8932,
  "totalPageviews": 23891,
  "avgBounceRate": 45.2,
  "avgSessionDuration": 185.5,
  "newUsersPercentage": 68.3,
  "returningUsersPercentage": 31.7,
  "trends": [...],
  "periodComparison": {
    "sessionsChange": 15.3,
    "usersChange": 12.8,
    "pageviewsChange": 18.7,
    "bounceRateChange": -2.1
  }
}
```

### Page Performance

```json
{
  "pages": [
    {
      "pagePath": "/",
      "pageTitle": "Home Page",
      "sessions": 5420,
      "pageviews": 8932,
      "avgTimeOnPage": 124.5,
      "bounceRate": 38.2,
      "entrances": 4821
    }
  ],
  "totalPages": 156,
  "avgTimeOnPage": 142.3,
  "avgBounceRate": 45.2
}
```

## 🧪 Testing

Chạy test script:

```bash
chmod +x scripts/test-traffic-analytics.sh
./scripts/test-traffic-analytics.sh
```

## 📚 Documentation

Chi tiết API documentation: `/docs/TRAFFIC_ANALYTICS_API.md`

## 🔮 Roadmap

- [ ] Conversion funnel analysis
- [ ] Cohort analysis
- [ ] Audience insights
- [ ] Custom events tracking
- [ ] Automated alerts
- [ ] Predictive analytics

## ⚠️ Lưu ý

1. **Google Analytics Quotas**: Có giới hạn 100,000 requests/day
2. **Real-time API**: Giới hạn 10 requests/minute
3. **Property ID**: Phải là GA4 property (không hỗ trợ Universal Analytics)
4. **Permissions**: Service account cần quyền Viewer trên GA property

## 🎉 Hoàn thành!

Module Traffic Analytics đã sẵn sàng sử dụng! Tất cả endpoints đã được implement với dữ liệu thật từ Google Analytics và các tính năng phân tích chuyên sâu.
