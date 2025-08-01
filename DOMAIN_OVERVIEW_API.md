# Domain Overview API Documentation

## Base URL

```
/api/v1/seo/domain-overview
```

## Authentication

Tất cả endpoints yêu cầu JWT Bearer Token:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Get Domain Overview

**Endpoint:** `GET /:domain`

**Mô tả:** Lấy thông tin tổng quan chi tiết về một domain bao gồm authority score, traffic, backlinks và trends.

### Request Parameters

| Parameter | Type   | Required | Description          | Example       |
| --------- | ------ | -------- | -------------------- | ------------- |
| domain    | string | Yes      | Domain cần phân tích | `example.com` |

### Query Parameters

| Parameter         | Type    | Required | Default | Description                        |
| ----------------- | ------- | -------- | ------- | ---------------------------------- |
| includeSubdomains | boolean | No       | false   | Bao gồm subdomains trong phân tích |

### Response

```json
{
  "domain": "example.com",
  "authorityScore": 85,
  "organicKeywords": 15420,
  "organicTraffic": 234500,
  "organicCost": 45600,
  "backlinks": 856420,
  "referringDomains": 3450,
  "topCountries": [
    {
      "country": "US",
      "traffic": 82075,
      "percentage": 35.02
    },
    {
      "country": "UK",
      "traffic": 58625,
      "percentage": 25.01
    }
  ],
  "trafficTrend": [
    {
      "date": "2024-09-01",
      "traffic": 21500
    },
    {
      "date": "2024-10-01",
      "traffic": 23400
    }
  ]
}
```

### Response Fields

| Field            | Type   | Description                        |
| ---------------- | ------ | ---------------------------------- |
| domain           | string | Domain được phân tích              |
| authorityScore   | number | Điểm uy tín domain (1-100)         |
| organicKeywords  | number | Số lượng từ khóa organic ranking   |
| organicTraffic   | number | Lượng traffic organic ước tính     |
| organicCost      | number | Giá trị traffic organic (USD)      |
| backlinks        | number | Tổng số backlinks                  |
| referringDomains | number | Số domains tham chiếu              |
| topCountries     | array  | Top 5 quốc gia có traffic cao nhất |
| trafficTrend     | array  | Xu hướng traffic 12 tháng qua      |

### Example Request

```bash
curl -X GET "https://api.example.com/api/v1/seo/domain-overview/example.com?includeSubdomains=false" \
  -H "Authorization: Bearer <your_token>"
```

---

## 2. Get Top Keywords

**Endpoint:** `GET /top-keywords/:domain`

**Mô tả:** Lấy danh sách từ khóa có ranking cao nhất của domain.

### Request Parameters

| Parameter | Type   | Required | Description          | Example       |
| --------- | ------ | -------- | -------------------- | ------------- |
| domain    | string | Yes      | Domain cần phân tích | `example.com` |

### Query Parameters

| Parameter | Type   | Required | Default | Description                 |
| --------- | ------ | -------- | ------- | --------------------------- |
| limit     | number | No       | 100     | Số lượng keywords (1-500)   |
| country   | string | No       | 'US'    | Mã quốc gia (US, UK, CA...) |

### Response

```json
{
  "data": [
    {
      "keyword": "seo tools",
      "position": 3,
      "searchVolume": 12500,
      "traffic": 1250,
      "cpc": 15.67,
      "difficulty": 78,
      "trend": "up",
      "url": "https://example.com/seo-tools"
    },
    {
      "keyword": "keyword research",
      "position": 1,
      "searchVolume": 8900,
      "traffic": 2670,
      "cpc": 12.34,
      "difficulty": 65,
      "trend": "stable",
      "url": "https://example.com/keyword-research"
    }
  ],
  "total": 15420,
  "domain": "example.com",
  "country": "US"
}
```

### Response Fields

| Field        | Type   | Description                      |
| ------------ | ------ | -------------------------------- |
| keyword      | string | Từ khóa                          |
| position     | number | Vị trí ranking hiện tại          |
| searchVolume | number | Lượng tìm kiếm hàng tháng        |
| traffic      | number | Traffic ước tính từ keyword      |
| cpc          | number | Chi phí click trung bình (USD)   |
| difficulty   | number | Độ khó SEO (1-100)               |
| trend        | string | Xu hướng: 'up', 'down', 'stable' |
| url          | string | URL ranking cho keyword          |

### Example Request

```bash
curl -X GET "https://api.example.com/api/v1/seo/domain-overview/top-keywords/example.com?limit=50&country=US" \
  -H "Authorization: Bearer <your_token>"
```

---

## 3. Get Domain Competitors

**Endpoint:** `GET /competitors/:domain`

**Mô tả:** Tìm và phân tích các đối thủ cạnh tranh của domain.

### Request Parameters

| Parameter | Type   | Required | Description          | Example       |
| --------- | ------ | -------- | -------------------- | ------------- |
| domain    | string | Yes      | Domain cần phân tích | `example.com` |

### Query Parameters

| Parameter | Type   | Required | Default | Description                  |
| --------- | ------ | -------- | ------- | ---------------------------- |
| limit     | number | No       | 50      | Số lượng competitors (1-100) |
| country   | string | No       | 'US'    | Mã quốc gia                  |

### Response

```json
{
  "data": [
    {
      "domain": "competitor1.com",
      "competitionLevel": 92,
      "commonKeywords": 2850,
      "authorityScore": 78,
      "trafficGap": 45600,
      "organicKeywords": 18500,
      "estimatedTraffic": 156780
    },
    {
      "domain": "competitor2.com",
      "competitionLevel": 88,
      "commonKeywords": 2340,
      "authorityScore": 72,
      "trafficGap": 23400,
      "organicKeywords": 14200,
      "estimatedTraffic": 98650
    }
  ],
  "total": 47,
  "domain": "example.com",
  "country": "US"
}
```

### Response Fields

| Field            | Type   | Description               |
| ---------------- | ------ | ------------------------- |
| domain           | string | Domain đối thủ            |
| competitionLevel | number | Mức độ cạnh tranh (1-100) |
| commonKeywords   | number | Số keywords chung         |
| authorityScore   | number | Điểm uy tín domain        |
| trafficGap       | number | Chênh lệch traffic        |
| organicKeywords  | number | Tổng keywords organic     |
| estimatedTraffic | number | Traffic ước tính          |

### Example Request

```bash
curl -X GET "https://api.example.com/api/v1/seo/domain-overview/competitors/example.com?limit=20&country=US" \
  -H "Authorization: Bearer <your_token>"
```

---

## 4. Get Content Topics

**Endpoint:** `GET /topics/:domain`

**Mô tả:** Phân tích các chủ đề nội dung chính mà domain đang targeting.

### Request Parameters

| Parameter | Type   | Required | Description          | Example       |
| --------- | ------ | -------- | -------------------- | ------------- |
| domain    | string | Yes      | Domain cần phân tích | `example.com` |

### Query Parameters

| Parameter | Type   | Required | Default | Description             |
| --------- | ------ | -------- | ------- | ----------------------- |
| limit     | number | No       | 50      | Số lượng topics (1-200) |

### Response

```json
{
  "data": [
    {
      "topic": "SEO Strategy",
      "keywords": 342,
      "traffic": 8760,
      "difficulty": 72,
      "opportunities": 28,
      "topKeywords": [
        "seo strategy guide",
        "seo strategy tips",
        "seo strategy tools"
      ]
    },
    {
      "topic": "Content Marketing",
      "keywords": 287,
      "traffic": 6540,
      "difficulty": 68,
      "opportunities": 35,
      "topKeywords": [
        "content marketing guide",
        "content marketing tips",
        "content marketing strategy"
      ]
    }
  ],
  "total": 24,
  "domain": "example.com"
}
```

### Response Fields

| Field         | Type   | Description               |
| ------------- | ------ | ------------------------- |
| topic         | string | Tên chủ đề                |
| keywords      | number | Số keywords thuộc topic   |
| traffic       | number | Traffic từ topic          |
| difficulty    | number | Độ khó trung bình (1-100) |
| opportunities | number | Cơ hội keywords mới       |
| topKeywords   | array  | Top 3 keywords của topic  |

### Example Request

```bash
curl -X GET "https://api.example.com/api/v1/seo/domain-overview/topics/example.com?limit=30" \
  -H "Authorization: Bearer <your_token>"
```

---

## 5. Get Domain Authority

**Endpoint:** `GET /authority/:domain`

**Mô tả:** Lấy điểm domain authority từ nhiều nguồn khác nhau.

### Request Parameters

| Parameter | Type   | Required | Description         | Example       |
| --------- | ------ | -------- | ------------------- | ------------- |
| domain    | string | Yes      | Domain cần kiểm tra | `example.com` |

### Response

```json
{
  "moz": 85,
  "ahrefs": 78,
  "semrush": 82
}
```

### Response Fields

| Field   | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| moz     | number | Domain Authority từ Moz (1-100)    |
| ahrefs  | number | Domain Rating từ Ahrefs (1-100)    |
| semrush | number | Authority Score từ SEMrush (1-100) |

### Example Request

```bash
curl -X GET "https://api.example.com/api/v1/seo/domain-overview/authority/example.com" \
  -H "Authorization: Bearer <your_token>"
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DOMAIN",
    "message": "Domain parameter is required or invalid",
    "details": {
      "domain": "Invalid domain format"
    }
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication token is required"
  }
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded. Please try again later."
  }
}
```

---

## Rate Limits

- **Free Plan**: 100 requests/day
- **Starter Plan**: 1,000 requests/day
- **Professional Plan**: 10,000 requests/day
- **Agency Plan**: 50,000 requests/day

## Notes

1. **Domain Format**: Chỉ chấp nhận domain không có protocol (ví dụ: `example.com`, không phải `https://example.com`)

2. **Data Freshness**: Dữ liệu được cập nhật hàng tuần cho domain phổ biến, hàng tháng cho domain ít phổ biến

3. **Country Codes**: Hỗ trợ tất cả country codes theo chuẩn ISO 3166-1 alpha-2

4. **Caching**: Kết quả được cache trong 24 giờ để tối ưu performance

5. **Third-party APIs**: Tích hợp với SEMrush, Ahrefs, Moz APIs để đảm bảo độ chính xác

## SDK Examples

### JavaScript/Node.js

```javascript
const DomainAPI = require('@your-org/seo-api-client');

const client = new DomainAPI({ token: 'your_jwt_token' });

// Get domain overview
const overview = await client.domainOverview.get('example.com');

// Get top keywords
const keywords = await client.domainOverview.getTopKeywords('example.com', {
  limit: 100,
  country: 'US',
});

// Get competitors
const competitors = await client.domainOverview.getCompetitors('example.com');
```

### Python

```python
from seo_api_client import DomainAPI

client = DomainAPI(token='your_jwt_token')

# Get domain overview
overview = client.domain_overview.get('example.com')

# Get top keywords
keywords = client.domain_overview.get_top_keywords(
    'example.com',
    limit=100,
    country='US'
)

# Get competitors
competitors = client.domain_overview.get_competitors('example.com')
```
