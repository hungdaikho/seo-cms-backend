# Organic Research API Module

## Tổng quan

Module Organic Research cung cấp các API để phân tích hiệu suất organic search của domain, bao gồm việc nghiên cứu từ khóa, phân tích đối thủ cạnh tranh, và đánh giá top pages. Module này được thiết kế để tích hợp với các third-party SEO APIs như SEMrush, Ahrefs, và Moz.

## Cấu trúc Module

```
organic-research/
├── organic-research.controller.ts    # REST API endpoints
├── organic-research.service.ts       # Business logic
├── organic-research.module.ts        # NestJS module configuration
├── dto/
│   └── organic-research.dto.ts       # Data Transfer Objects
└── README.md                         # Tài liệu module
```

## API Endpoints

### 1. Domain Analysis

**Endpoint:** `GET /api/v1/seo/organic-research/domain/:domain`

**Mô tả:** Phân tích tổng quan hiệu suất organic search của một domain.

**Parameters:**

- `domain` (path): Domain cần phân tích (ví dụ: example.com)
- `country` (query): Mã quốc gia (ví dụ: US, UK, VN)
- `database` (query, optional): Database sử dụng (mặc định: google)

**Response:**

```json
{
  "domain": "example.com",
  "organicKeywords": 5432,
  "organicTraffic": 45000,
  "organicCost": 12500,
  "avgPosition": 25,
  "visibility": 0.35,
  "lastUpdated": "2025-08-01T10:30:00Z"
}
```

### 2. Organic Keywords

**Endpoint:** `GET /api/v1/seo/organic-research/keywords/:domain`

**Mô tả:** Lấy danh sách các từ khóa organic mà domain đang rank.

**Parameters:**

- `domain` (path): Domain cần phân tích
- `country` (query): Mã quốc gia
- `limit` (query, optional): Số lượng kết quả (mặc định: 100, tối đa: 1000)
- `offset` (query, optional): Offset cho pagination (mặc định: 0)
- `sortBy` (query, optional): Sắp xếp theo (position|traffic|volume)
- `sortOrder` (query, optional): Thứ tự sắp xếp (asc|desc)

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
    }
  ],
  "total": 5432,
  "page": 1,
  "limit": 100,
  "hasNext": true,
  "hasPrev": false
}
```

### 3. Competitor Discovery

**Endpoint:** `GET /api/v1/seo/organic-research/competitors/:domain`

**Mô tả:** Phát hiện và phân tích các đối thủ cạnh tranh organic của domain.

**Parameters:**

- `domain` (path): Domain cần phân tích
- `country` (query): Mã quốc gia
- `limit` (query, optional): Số lượng competitors (mặc định: 50, tối đa: 200)

**Response:**

```json
{
  "data": [
    {
      "domain": "competitor.com",
      "competitionLevel": 85,
      "commonKeywords": 456,
      "keywords": 8900,
      "traffic": 125000,
      "trafficValue": 45000,
      "topKeyword": "seo tools"
    }
  ],
  "total": 25,
  "targetDomain": "example.com",
  "country": "US"
}
```

### 4. Top Pages

**Endpoint:** `GET /api/v1/seo/organic-research/top-pages/:domain`

**Mô tả:** Lấy danh sách các trang có hiệu suất organic tốt nhất của domain.

**Parameters:**

- `domain` (path): Domain cần phân tích
- `country` (query): Mã quốc gia
- `limit` (query, optional): Số lượng pages (mặc định: 100, tối đa: 500)
- `sortBy` (query, optional): Sắp xếp theo (traffic|keywords|value)

**Response:**

```json
{
  "data": [
    {
      "url": "https://example.com/blog/seo-guide",
      "traffic": 8500,
      "keywords": 125,
      "trafficValue": 2400,
      "avgPosition": 8,
      "topKeywords": ["seo guide", "seo tips", "search optimization"]
    }
  ],
  "total": 150,
  "domain": "example.com",
  "country": "US"
}
```

### 5. API Limits

**Endpoint:** `GET /api/v1/seo/organic-research/api-limits`

**Mô tả:** Kiểm tra giới hạn API của các third-party services.

**Response:**

```json
{
  "semrush": 1000,
  "ahrefs": 500,
  "moz": 300
}
```

## Authentication

Tất cả endpoints yêu cầu JWT authentication. Bao gồm header `Authorization: Bearer <jwt_token>` trong request.

## Validation

Module sử dụng `class-validator` để validate input data:

- **Domain**: Required, phải là string hợp lệ
- **Country**: Required, mã quốc gia 2 ký tự
- **Limit**: Optional, từ 1 đến giới hạn tối đa của từng endpoint
- **Offset**: Optional, số nguyên không âm
- **Sort parameters**: Optional, chỉ chấp nhận các giá trị được định nghĩa

## Error Handling

API trả về các HTTP status codes chuẩn:

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing/invalid JWT)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

**Error Response Format:**

```json
{
  "statusCode": 400,
  "message": "Invalid domain format",
  "error": "Bad Request"
}
```

## Rate Limiting

- Mặc định: 100 requests/minute per user
- Heavy endpoints (keywords, competitors): 20 requests/minute per user
- API limits tracking cho third-party services

## Caching Strategy

**Planned Implementation:**

- Domain analysis: Cache 4 giờ
- Keywords data: Cache 2 giờ
- Competitors: Cache 24 giờ
- Top pages: Cache 4 giờ

## Third-party Integration

Module được thiết kế để tích hợp với:

### SEMrush API

- Domain analytics
- Organic keywords
- Competitor research

### Ahrefs API

- Backlink data
- Keyword difficulty
- Content gap analysis

### Moz API

- Domain authority
- Page authority
- Keyword difficulty

## Configuration

**Environment Variables:**

```env
# SEMrush
SEMRUSH_API_KEY=your_semrush_api_key
SEMRUSH_BASE_URL=https://api.semrush.com

# Ahrefs
AHREFS_API_KEY=your_ahrefs_api_key
AHREFS_BASE_URL=https://apiv2.ahrefs.com

# Moz
MOZ_ACCESS_ID=your_moz_access_id
MOZ_SECRET_KEY=your_moz_secret_key
MOZ_BASE_URL=https://lsapi.seomoz.com

# Redis Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

## Usage Examples

### TypeScript/JavaScript Client

```typescript
// Domain Analysis
const domainAnalysis = await fetch(
  '/api/v1/seo/organic-research/domain/example.com?country=US',
  {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  },
);

// Get Organic Keywords with Pagination
const keywords = await fetch(
  '/api/v1/seo/organic-research/keywords/example.com?country=US&limit=50&offset=0&sortBy=position&sortOrder=asc',
  {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  },
);

// Discover Competitors
const competitors = await fetch(
  '/api/v1/seo/organic-research/competitors/example.com?country=US&limit=25',
  {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  },
);
```

### cURL Examples

```bash
# Domain Analysis
curl -X GET "http://localhost:3000/api/v1/seo/organic-research/domain/example.com?country=US" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get Keywords
curl -X GET "http://localhost:3000/api/v1/seo/organic-research/keywords/example.com?country=US&limit=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get Competitors
curl -X GET "http://localhost:3000/api/v1/seo/organic-research/competitors/example.com?country=US" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development Status

### ✅ Completed Features

- [x] Basic API structure và endpoints
- [x] Input validation với DTOs
- [x] JWT authentication
- [x] Swagger documentation
- [x] Mock data responses
- [x] Error handling cơ bản
- [x] Logging

### 🔄 In Progress

- [ ] Third-party API integration (SEMrush, Ahrefs, Moz)
- [ ] Redis caching implementation
- [ ] Rate limiting
- [ ] Unit tests
- [ ] Integration tests

### 📋 Planned Features

- [ ] Historical data tracking
- [ ] Keyword gap analysis
- [ ] SERP features analysis
- [ ] Content gap analysis
- [ ] Position tracking over time
- [ ] Export functionality (CSV, Excel)
- [ ] Webhook notifications
- [ ] Advanced filtering options

## Testing

### Running Tests

```bash
# Unit tests
npm run test src/organic-research

# Integration tests
npm run test:e2e organic-research

# Coverage report
npm run test:cov src/organic-research
```

### Test Coverage Goals

- Unit tests: >90%
- Integration tests: >80%
- E2E tests: Core user journeys

## Performance Considerations

- **Database queries**: Optimize với indexing và pagination
- **Third-party APIs**: Implement retry logic và circuit breakers
- **Caching**: Redis cho frequently accessed data
- **Rate limiting**: Protect từ abuse và manage API costs
- **Background jobs**: Heavy processing tasks

## Security

- JWT authentication required
- Input validation và sanitization
- API key encryption trong database
- Rate limiting để prevent abuse
- Audit logging cho sensitive operations

## Monitoring & Analytics

### Metrics to Track

- API response times
- Third-party API usage/costs
- Cache hit rates
- Error rates
- User activity patterns

### Logging

- Request/response logging
- Error tracking với stack traces
- Performance metrics
- Third-party API call logs

## Contributing

1. Follow NestJS conventions
2. Add appropriate validation
3. Include unit tests
4. Update Swagger documentation
5. Add error handling
6. Consider performance impact

## Related Documentation

- [API Overview](../../API_OVERVIEW.md)
- [Authentication Guide](../auth/README.md)
- [Database Schema](../../prisma/schema.prisma)
- [Deployment Guide](../../docs/deployment.md)
