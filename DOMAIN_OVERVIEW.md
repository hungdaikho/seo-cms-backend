# Domain Overview API Documentation

## Tổng quan

Domain Overview API cung cấp các endpoint để phân tích tổng quan về domain, bao gồm authority metrics, top keywords, competitors analysis, content topics và domain authority từ nhiều nguồn.

## Base URL

```
/api/v1/seo/domain-overview
```

## Authentication

Tất cả endpoints yêu cầu JWT Bearer Token trong header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Lấy Tổng Quan Domain

### `GET /:domain`

Lấy thông tin tổng quan chi tiết về domain và các metrics authority.

#### Parameters

- **domain** (string, required) - Domain cần phân tích (VD: `example.com`)
- **includeSubdomains** (boolean, optional) - Có bao gồm subdomain không (default: `false`)

#### Request Example

```bash
GET /api/v1/seo/domain-overview/example.com?includeSubdomains=false
```

#### Response Example

```json
{
  "domain": "example.com",
  "authorityScore": 85,
  "organicKeywords": 15420,
  "organicTraffic": 234567,
  "organicCost": 45678.5,
  "backlinks": 125400,
  "referringDomains": 8650,
  "topCountries": [
    {
      "country": "US",
      "traffic": 82000,
      "percentage": 35.12
    },
    {
      "country": "UK",
      "traffic": 58500,
      "percentage": 25.05
    }
  ],
  "trafficTrend": [
    {
      "date": "2024-08-01",
      "traffic": 220000
    },
    {
      "date": "2024-09-01",
      "traffic": 234567
    }
  ]
}
```

#### Response Fields

- **domain** - Domain được phân tích
- **authorityScore** - Điểm authority (1-100)
- **organicKeywords** - Số lượng organic keywords
- **organicTraffic** - Lượng organic traffic ước tính
- **organicCost** - Giá trị organic traffic (USD)
- **backlinks** - Tổng số backlinks
- **referringDomains** - Số lượng referring domains
- **topCountries** - Top 5 quốc gia có traffic cao nhất
- **trafficTrend** - Xu hướng traffic 12 tháng gần nhất

---

## 2. Lấy Top Keywords

### `GET /top-keywords/:domain`

Lấy danh sách top keywords ranking của domain.

#### Parameters

- **domain** (string, required) - Domain cần phân tích
- **limit** (number, optional) - Số lượng keywords trả về (1-500, default: 100)
- **country** (string, optional) - Mã quốc gia (default: "US")

#### Request Example

```bash
GET /api/v1/seo/domain-overview/top-keywords/example.com?limit=50&country=US
```

#### Response Example

```json
{
  "data": [
    {
      "keyword": "best seo tools",
      "position": 3,
      "searchVolume": 8900,
      "traffic": 2340,
      "cpc": 12.5,
      "difficulty": 75,
      "trend": "up",
      "url": "https://example.com/seo-tools"
    },
    {
      "keyword": "domain analysis",
      "position": 1,
      "searchVolume": 5400,
      "traffic": 4200,
      "cpc": 8.75,
      "difficulty": 65,
      "trend": "stable",
      "url": "https://example.com/domain-analysis"
    }
  ],
  "total": 15420,
  "domain": "example.com",
  "country": "US"
}
```

#### Keyword Fields

- **keyword** - Từ khóa
- **position** - Vị trí ranking
- **searchVolume** - Lượng tìm kiếm hàng tháng
- **traffic** - Traffic ước tính từ keyword
- **cpc** - Cost per click (USD)
- **difficulty** - Độ khó SEO (1-100)
- **trend** - Xu hướng (`up`, `down`, `stable`)
- **url** - URL ranking cho keyword

---

## 3. Phân Tích Competitors

### `GET /competitors/:domain`

Lấy danh sách competitors và phân tích cạnh tranh.

#### Parameters

- **domain** (string, required) - Domain cần phân tích
- **limit** (number, optional) - Số lượng competitors trả về (1-100, default: 50)
- **country** (string, optional) - Mã quốc gia (default: "US")

#### Request Example

```bash
GET /api/v1/seo/domain-overview/competitors/example.com?limit=10&country=US
```

#### Response Example

```json
{
  "data": [
    {
      "domain": "competitor1.com",
      "competitionLevel": 85,
      "commonKeywords": 1250,
      "authorityScore": 78,
      "trafficGap": 125000,
      "organicKeywords": 18500,
      "estimatedTraffic": 350000
    },
    {
      "domain": "competitor2.com",
      "competitionLevel": 72,
      "commonKeywords": 980,
      "authorityScore": 65,
      "trafficGap": -45000,
      "organicKeywords": 12400,
      "estimatedTraffic": 189000
    }
  ],
  "total": 45,
  "domain": "example.com",
  "country": "US"
}
```

#### Competitor Fields

- **domain** - Domain của competitor
- **competitionLevel** - Mức độ cạnh tranh (1-100)
- **commonKeywords** - Số keywords chung
- **authorityScore** - Authority score của competitor
- **trafficGap** - Chênh lệch traffic (âm = competitor thấp hơn)
- **organicKeywords** - Tổng organic keywords của competitor
- **estimatedTraffic** - Traffic ước tính của competitor

---

## 4. Phân Tích Content Topics

### `GET /topics/:domain`

Phân tích các chủ đề content chính của domain.

#### Parameters

- **domain** (string, required) - Domain cần phân tích
- **limit** (number, optional) - Số lượng topics trả về (1-200, default: 50)

#### Request Example

```bash
GET /api/v1/seo/domain-overview/topics/example.com?limit=20
```

#### Response Example

```json
{
  "data": [
    {
      "topic": "SEO Tools",
      "keywords": 450,
      "traffic": 45000,
      "difficulty": 68,
      "opportunities": 125,
      "topKeywords": [
        "best seo tools",
        "seo analysis tools",
        "free seo tools",
        "seo audit tools"
      ]
    },
    {
      "topic": "Content Marketing",
      "keywords": 320,
      "traffic": 28500,
      "difficulty": 55,
      "opportunities": 89,
      "topKeywords": [
        "content marketing strategy",
        "content creation tools",
        "content planning",
        "content optimization"
      ]
    }
  ],
  "total": 85,
  "domain": "example.com"
}
```

#### Topic Fields

- **topic** - Tên chủ đề
- **keywords** - Số keywords trong topic
- **traffic** - Traffic từ topic
- **difficulty** - Độ khó trung bình của topic
- **opportunities** - Số cơ hội optimization
- **topKeywords** - Top keywords trong topic

---

## 5. Domain Authority Metrics

### `GET /authority/:domain`

Lấy domain authority metrics từ nhiều nguồn khác nhau.

#### Parameters

- **domain** (string, required) - Domain cần phân tích

#### Request Example

```bash
GET /api/v1/seo/domain-overview/authority/example.com
```

#### Response Example

```json
{
  "domain": "example.com",
  "metrics": {
    "mozDA": 65,
    "mozPA": 58,
    "ahrefsDR": 72,
    "ahrefsUR": 45,
    "semrushAS": 68,
    "majesticTF": 42,
    "majesticCF": 38
  },
  "backlinks": {
    "total": 125400,
    "dofollow": 89500,
    "nofollow": 35900,
    "referringDomains": 8650,
    "referringIPs": 7890
  },
  "trust": {
    "trustFlow": 42,
    "citationFlow": 38,
    "spamScore": 2
  }
}
```

#### Authority Metrics Fields

- **mozDA** - Moz Domain Authority (1-100)
- **mozPA** - Moz Page Authority (1-100)
- **ahrefsDR** - Ahrefs Domain Rating (1-100)
- **ahrefsUR** - Ahrefs URL Rating (1-100)
- **semrushAS** - SEMrush Authority Score (1-100)
- **majesticTF** - Majestic Trust Flow (0-100)
- **majesticCF** - Majestic Citation Flow (0-100)

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Domain parameter is required",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Domain not found or no data available",
  "error": "Not Found"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: Giới hạn requests
  - `X-RateLimit-Remaining`: Số requests còn lại
  - `X-RateLimit-Reset`: Thời gian reset (Unix timestamp)

---

## Code Examples

### JavaScript/Axios

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://your-api-domain.com/api/v1/seo/domain-overview',
  headers: {
    Authorization: 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json',
  },
});

// Lấy domain overview
async function getDomainOverview(domain) {
  try {
    const response = await api.get(`/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Lấy top keywords
async function getTopKeywords(domain, limit = 100) {
  try {
    const response = await api.get(`/top-keywords/${domain}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### Python/Requests

```python
import requests

class DomainOverviewAPI:
    def __init__(self, base_url, token):
        self.base_url = f"{base_url}/api/v1/seo/domain-overview"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def get_domain_overview(self, domain, include_subdomains=False):
        url = f"{self.base_url}/{domain}"
        params = {"includeSubdomains": include_subdomains}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    def get_top_keywords(self, domain, limit=100, country="US"):
        url = f"{self.base_url}/top-keywords/{domain}"
        params = {"limit": limit, "country": country}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

# Usage
api = DomainOverviewAPI("https://your-api-domain.com", "YOUR_JWT_TOKEN")
overview = api.get_domain_overview("example.com")
keywords = api.get_top_keywords("example.com", limit=50)
```

### cURL

```bash
# Lấy domain overview
curl -X GET "https://your-api-domain.com/api/v1/seo/domain-overview/example.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Lấy top keywords
curl -X GET "https://your-api-domain.com/api/v1/seo/domain-overview/top-keywords/example.com?limit=50&country=US" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Lấy competitors
curl -X GET "https://your-api-domain.com/api/v1/seo/domain-overview/competitors/example.com?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Notes

1. **Domain Format**: Domain nên được nhập không có `http://` hoặc `https://` (VD: `example.com` thay vì `https://example.com`)

2. **Rate Limiting**: API có giới hạn rate limiting, hãy implement retry logic với exponential backoff

3. **Data Freshness**: Dữ liệu được cập nhật hàng ngày, một số metrics có thể có độ trễ 24-48 giờ

4. **Country Codes**: Sử dụng ISO 3166-1 alpha-2 country codes (VD: US, UK, DE, FR, etc.)

5. **Caching**: Recommend cache kết quả ít nhất 1 giờ để tối ưu performance

6. **Error Handling**: Luôn implement proper error handling cho tất cả API calls
