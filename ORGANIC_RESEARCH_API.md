# Organic Research API Documentation

## Tổng quan

Module Organic Research cung cấp các API để phân tích hiệu suất organic search của domain, bao gồm việc nghiên cứu từ khóa, phân tích đối thủ cạnh tranh, và đánh giá top pages. Module này được thiết kế để tích hợp với các third-party SEO APIs như SEMrush, Ahrefs, và Moz.

## Base URL

```
/api/v1/seo/organic-research
```

## Authentication

Tất cả các endpoints đều yêu cầu JWT authentication:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. 🔍 Domain Analysis

**Endpoint:** `GET /domain/:domain`

**Mô tả:** Phân tích tổng quan hiệu suất organic search của một domain.

**Parameters:**

- `domain` (path, required): Domain cần phân tích (ví dụ: example.com)
- `country` (query, required): Mã quốc gia (ví dụ: US, UK, VN)
- `database` (query, optional): Database sử dụng (mặc định: google)

**Request Example:**

```bash
GET /api/v1/seo/organic-research/domain/example.com?country=US&database=google
```

**Response:**

```json
{
  "domain": "example.com",
  "organicKeywords": 5432,
  "organicTraffic": 45000,
  "organicCost": 12500,
  "avgPosition": 25,
  "visibility": 0.35,
  "lastUpdated": "2025-08-04T10:30:00Z"
}
```

**Response Fields:**

- `domain`: Domain được phân tích
- `organicKeywords`: Tổng số từ khóa organic
- `organicTraffic`: Lượng traffic organic ước tính (monthly)
- `organicCost`: Giá trị traffic organic ước tính ($)
- `avgPosition`: Vị trí trung bình của các từ khóa
- `visibility`: Độ hiển thị trong search results (0-1)
- `lastUpdated`: Thời gian cập nhật dữ liệu cuối cùng

---

### 2. 📝 Organic Keywords

**Endpoint:** `GET /keywords/:domain`

**Mô tả:** Lấy danh sách các từ khóa organic mà domain đang rank.

**Parameters:**

- `domain` (path, required): Domain cần phân tích
- `country` (query, required): Mã quốc gia
- `limit` (query, optional): Số lượng kết quả (mặc định: 100, tối đa: 1000)
- `offset` (query, optional): Offset cho pagination (mặc định: 0)
- `sortBy` (query, optional): Sắp xếp theo (`position`, `traffic`, `volume`)
- `sortOrder` (query, optional): Thứ tự sắp xếp (`asc`, `desc`)

**Request Example:**

```bash
GET /api/v1/seo/organic-research/keywords/example.com?country=US&limit=50&sortBy=position&sortOrder=asc
```

**Response:**

```json
{
  "data": [
    {
      "keyword": "seo tools guide",
      "position": 3,
      "previousPosition": 5,
      "searchVolume": 2400,
      "trafficShare": 8.5,
      "cpc": 12.5,
      "difficulty": 65,
      "intent": "informational",
      "url": "https://example.com/seo-tools",
      "features": ["featured_snippet", "people_also_ask"]
    },
    {
      "keyword": "keyword research tips",
      "position": 7,
      "previousPosition": 9,
      "searchVolume": 1800,
      "trafficShare": 6.2,
      "cpc": 8.3,
      "difficulty": 58,
      "intent": "informational",
      "url": "https://example.com/keyword-research",
      "features": ["people_also_ask"]
    }
  ],
  "total": 5432,
  "page": 1,
  "limit": 50,
  "hasNext": true,
  "hasPrev": false
}
```

**Keyword Object Fields:**

- `keyword`: Từ khóa
- `position`: Vị trí hiện tại trong SERP
- `previousPosition`: Vị trí trước đó
- `searchVolume`: Khối lượng tìm kiếm hàng tháng
- `trafficShare`: Phần trăm traffic từ từ khóa này
- `cpc`: Cost per click ước tính
- `difficulty`: Độ khó của từ khóa (1-100)
- `intent`: Ý định tìm kiếm (informational, commercial, transactional, navigational)
- `url`: URL đang rank cho từ khóa
- `features`: Các SERP features (featured_snippet, people_also_ask, local_pack, etc.)

---

### 3. 🏆 Competitor Discovery

**Endpoint:** `GET /competitors/:domain`

**Mô tả:** Phát hiện và phân tích các đối thủ cạnh tranh organic của domain.

**Parameters:**

- `domain` (path, required): Domain cần phân tích
- `country` (query, required): Mã quốc gia
- `limit` (query, optional): Số lượng competitors (mặc định: 50, tối đa: 200)

**Request Example:**

```bash
GET /api/v1/seo/organic-research/competitors/example.com?country=US&limit=20
```

**Response:**

```json
{
  "data": [
    {
      "domain": "semrush.com",
      "competitionLevel": 85,
      "commonKeywords": 245,
      "keywords": 12500,
      "traffic": 850000,
      "trafficValue": 125000,
      "topKeyword": "seo tools"
    },
    {
      "domain": "ahrefs.com",
      "competitionLevel": 78,
      "commonKeywords": 198,
      "keywords": 9800,
      "traffic": 720000,
      "trafficValue": 98000,
      "topKeyword": "backlink analysis"
    }
  ],
  "total": 45,
  "targetDomain": "example.com",
  "country": "US"
}
```

**Competitor Object Fields:**

- `domain`: Domain của đối thủ cạnh tranh
- `competitionLevel`: Mức độ cạnh tranh (1-100)
- `commonKeywords`: Số từ khóa chung với domain target
- `keywords`: Tổng số từ khóa của competitor
- `traffic`: Traffic organic ước tính của competitor
- `trafficValue`: Giá trị traffic ước tính ($)
- `topKeyword`: Từ khóa mang lại traffic nhiều nhất

---

### 4. 📄 Top Pages Analysis

**Endpoint:** `GET /top-pages/:domain`

**Mô tả:** Lấy danh sách các trang có hiệu suất organic tốt nhất của domain.

**Parameters:**

- `domain` (path, required): Domain cần phân tích
- `country` (query, required): Mã quốc gia
- `limit` (query, optional): Số lượng pages (mặc định: 100, tối đa: 500)
- `sortBy` (query, optional): Sắp xếp theo (`traffic`, `keywords`, `value`)

**Request Example:**

```bash
GET /api/v1/seo/organic-research/top-pages/example.com?country=US&limit=25&sortBy=traffic
```

**Response:**

```json
{
  "data": [
    {
      "url": "https://example.com/blog/seo-guide",
      "traffic": 8500,
      "keywords": 145,
      "trafficValue": 2800,
      "avgPosition": 12,
      "topKeywords": ["seo guide", "seo tutorial", "search optimization"]
    },
    {
      "url": "https://example.com/tools/keyword-research",
      "traffic": 6200,
      "keywords": 98,
      "trafficValue": 2100,
      "avgPosition": 8,
      "topKeywords": ["keyword research", "keyword tool", "seo keywords"]
    }
  ],
  "total": 250,
  "domain": "example.com",
  "country": "US"
}
```

**Top Page Object Fields:**

- `url`: URL của trang
- `traffic`: Traffic organic ước tính (monthly)
- `keywords`: Số lượng từ khóa mà trang đang rank
- `trafficValue`: Giá trị traffic ước tính ($)
- `avgPosition`: Vị trí trung bình của các từ khóa
- `topKeywords`: Các từ khóa mang lại traffic nhiều nhất

---

### 5. 📊 API Limits Check

**Endpoint:** `GET /api-limits`

**Mô tả:** Kiểm tra giới hạn và quota của các third-party APIs.

**Request Example:**

```bash
GET /api/v1/seo/organic-research/api-limits
```

**Response:**

```json
{
  "semrush": {
    "remaining": 850,
    "total": 1000,
    "resetDate": "2025-09-01T00:00:00Z"
  },
  "ahrefs": {
    "remaining": 420,
    "total": 500,
    "resetDate": "2025-08-15T00:00:00Z"
  },
  "moz": {
    "remaining": 280,
    "total": 300,
    "resetDate": "2025-08-10T00:00:00Z"
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DOMAIN",
    "message": "Domain format is invalid",
    "details": {
      "domain": "example..com",
      "reason": "Double dot not allowed"
    }
  }
}
```

### Common Error Codes

| Code                    | Description                       | Status |
| ----------------------- | --------------------------------- | ------ |
| `INVALID_DOMAIN`        | Domain format không hợp lệ        | 400    |
| `COUNTRY_NOT_SUPPORTED` | Quốc gia không được hỗ trợ        | 400    |
| `DOMAIN_NOT_FOUND`      | Không tìm thấy dữ liệu cho domain | 404    |
| `API_QUOTA_EXCEEDED`    | Vượt quá giới hạn API             | 429    |
| `THIRD_PARTY_API_ERROR` | Lỗi từ third-party API            | 502    |
| `DATA_NOT_AVAILABLE`    | Dữ liệu chưa có sẵn               | 404    |

## Rate Limiting

- **Authenticated users**: 100 requests/hour
- **Premium users**: 500 requests/hour
- **Enterprise**: 2000 requests/hour

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1628123456
```

## Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

// Get domain analysis
async function getDomainAnalysis(domain, country) {
  try {
    const response = await axios.get(
      `https://api.example.com/api/v1/seo/organic-research/domain/${domain}`,
      {
        params: { country },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Get organic keywords
async function getOrganicKeywords(domain, options = {}) {
  const { country, limit = 100, sortBy = 'position' } = options;

  try {
    const response = await axios.get(
      `https://api.example.com/api/v1/seo/organic-research/keywords/${domain}`,
      {
        params: { country, limit, sortBy },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### Python

```python
import requests

class OrganicResearchAPI:
    def __init__(self, token, base_url="https://api.example.com"):
        self.token = token
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {token}"}

    def get_domain_analysis(self, domain, country, database="google"):
        url = f"{self.base_url}/api/v1/seo/organic-research/domain/{domain}"
        params = {"country": country, "database": database}

        response = requests.get(url, params=params, headers=self.headers)
        return response.json()

    def get_organic_keywords(self, domain, country, limit=100, sort_by="position"):
        url = f"{self.base_url}/api/v1/seo/organic-research/keywords/{domain}"
        params = {
            "country": country,
            "limit": limit,
            "sortBy": sort_by
        }

        response = requests.get(url, params=params, headers=self.headers)
        return response.json()

# Usage
api = OrganicResearchAPI("your-jwt-token")
analysis = api.get_domain_analysis("example.com", "US")
keywords = api.get_organic_keywords("example.com", "US", limit=50)
```

## Integration Notes

### Third-party APIs

Module này được thiết kế để tích hợp với:

- **SEMrush API** - Domain analysis, keywords, competitors
- **Ahrefs API** - Backlinks, organic keywords
- **Moz API** - Domain authority, keyword difficulty

### Data Freshness

- Domain analysis: Cập nhật hàng tuần
- Keywords data: Cập nhật hàng ngày
- Competitors: Cập nhật hàng tuần
- Top pages: Cập nhật hàng ngày

### Performance Tips

1. Sử dụng pagination cho large datasets
2. Cache kết quả khi có thể
3. Sử dụng appropriate sorting để lấy data quan trọng nhất
4. Monitor API quota để tránh limit exceeded

---

**Last Updated**: August 4, 2025  
**API Version**: v1.0.0  
**Module Version**: 1.0.0
