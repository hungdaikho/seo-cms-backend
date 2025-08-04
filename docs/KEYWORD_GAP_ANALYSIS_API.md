# Keyword Gap Analysis API Documentation

## Tổng quan

Keyword Gap Analysis là tính năng cho phép phân tích khoảng cách từ khóa giữa website của bạn và các đối thủ cạnh tranh. Tính năng này giúp:

- Tìm ra các từ khóa mà đối thủ đang ranking nhưng bạn chưa có
- Phát hiện cơ hội từ khóa tiềm năng
- So sánh hiệu suất từ khóa với competitors
- Xác định điểm mạnh/yếu trong chiến lược SEO

## Available APIs

### 1. Keyword Magic Tool (Với Competitor Analysis)

### 2. Dedicated Competitor Analysis

### 3. Organic Research Competitor Discovery

---

## 1. Keyword Magic Tool - Competitor Gap Analysis

### Endpoint

```
POST /ai/keywords/magic-tool
```

### Mô tả

Endpoint tổng hợp cho keyword research với khả năng phân tích gap so với competitors.

### Authentication

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Request Payload

#### Required Fields

| Field                       | Type     | Description                                     |
| --------------------------- | -------- | ----------------------------------------------- |
| `seedKeyword`               | string   | Từ khóa gốc để phân tích                        |
| `competitorDomains`         | string[] | Danh sách domain đối thủ (tối đa 5 domains)     |
| `includeCompetitorKeywords` | boolean  | Bật tính năng phân tích competitor (set `true`) |

#### Optional Fields

| Field              | Type   | Default | Description                               |
| ------------------ | ------ | ------- | ----------------------------------------- |
| `industry`         | string | -       | Ngành nghề (technology, healthcare, etc.) |
| `location`         | string | "US"    | Vị trí địa lý (US, VN, UK, etc.)          |
| `language`         | string | "en"    | Ngôn ngữ (en, vi, es, etc.)               |
| `minDifficulty`    | number | 0       | Độ khó tối thiểu (0-100)                  |
| `maxDifficulty`    | number | 100     | Độ khó tối đa (0-100)                     |
| `minVolume`        | number | 0       | Search volume tối thiểu                   |
| `limitPerCategory` | number | 50      | Số từ khóa tối đa mỗi category            |

### Example Request

```json
{
  "seedKeyword": "seo tools",
  "competitorDomains": ["semrush.com", "ahrefs.com", "moz.com"],
  "includeCompetitorKeywords": true,
  "industry": "technology",
  "location": "US",
  "minVolume": 100,
  "limitPerCategory": 100
}
```

### Response Structure

```json
{
  "seedKeyword": "seo tools",
  "totalKeywords": 324,
  "summary": {
    "avgSearchVolume": 2450,
    "avgDifficulty": 68,
    "totalEstimatedTraffic": 15600,
    "topIntent": "commercial",
    "competitionLevel": "high"
  },
  "competitorAnalysis": [
    {
      "domain": "semrush.com",
      "sharedKeywords": [
        "seo tools",
        "keyword research",
        "seo audit"
      ],
      "keywordGaps": [
        "free seo tools",
        "seo checker online",
        "website seo analysis",
        "competitor seo analysis",
        "seo ranking checker"
      ],
      "competitorStrength": 92
    },
    {
      "domain": "ahrefs.com",
      "sharedKeywords": [
        "seo tools",
        "backlink checker",
        "site audit"
      ],
      "keywordGaps": [
        "ahrefs alternative",
        "backlink analysis tool",
        "seo content gap analysis",
        "keyword difficulty tool"
      ],
      "competitorStrength": 89
    }
  ],
  "primaryKeywords": [...],
  "longTailKeywords": [...],
  "questionKeywords": [...]
}
```

### Key Response Fields

#### competitorAnalysis[]

| Field                | Type     | Description                                       |
| -------------------- | -------- | ------------------------------------------------- |
| `domain`             | string   | Domain của competitor                             |
| `sharedKeywords`     | string[] | Từ khóa chung giữa bạn và competitor              |
| `keywordGaps`        | string[] | **Từ khóa gap - competitor có nhưng bạn chưa có** |
| `competitorStrength` | number   | Điểm sức mạnh competitor (0-100)                  |

---

## 2. Dedicated Competitor Analysis

### Endpoint

```
POST /ai/competitor-analysis
```

### Mô tả

API chuyên biệt để phân tích competitor với focus vào content gaps và strategy gaps.

### Request Payload

```json
{
  "competitorDomain": "semrush.com",
  "yourDomain": "yoursite.com",
  "industry": "seo_tools"
}
```

### Response Structure

```json
{
  "strengths": [
    "Strong content marketing strategy",
    "Comprehensive keyword coverage",
    "High domain authority"
  ],
  "weaknesses": ["Limited local SEO content", "Weak social media presence"],
  "opportunities": [
    "Video content creation",
    "Local SEO expansion",
    "Long-tail keyword targeting"
  ],
  "contentGaps": [
    "Beginner SEO tutorials",
    "Case studies and success stories",
    "Industry-specific SEO guides",
    "Free tool alternatives content"
  ],
  "recommendations": [
    {
      "category": "Content Strategy",
      "recommendation": "Create beginner-friendly SEO content",
      "priority": "High",
      "effort": "Medium"
    },
    {
      "category": "Keyword Strategy",
      "recommendation": "Target long-tail informational keywords",
      "priority": "Medium",
      "effort": "Low"
    }
  ]
}
```

---

## 3. Organic Research - Competitor Discovery

### Endpoint

```
GET /seo/organic-research/competitors/{domain}
```

### Mô tả

Tìm kiếm competitors dựa trên organic keywords overlap.

### Parameters

| Parameter | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| `domain`  | string | Yes      | Domain để phân tích                 |
| `country` | string | Yes      | Country code (US, VN, UK)           |
| `limit`   | number | No       | Số competitors trả về (default: 50) |

### Example Request

```
GET /seo/organic-research/competitors/yoursite.com?country=US&limit=20
```

### Response

```json
{
  "domain": "yoursite.com",
  "competitors": [
    {
      "domain": "semrush.com",
      "commonKeywords": 156,
      "competitionLevel": "High",
      "overlapScore": 0.67,
      "estimatedTraffic": 2500000,
      "keywordGaps": 1247
    },
    {
      "domain": "ahrefs.com",
      "commonKeywords": 134,
      "competitionLevel": "High",
      "overlapScore": 0.58,
      "estimatedTraffic": 1800000,
      "keywordGaps": 982
    }
  ],
  "totalCompetitors": 20,
  "analysisDate": "2025-08-05T10:30:00Z"
}
```

---

## Workflow Recommendations

### 1. Discovery Workflow

```
Step 1: GET /seo/organic-research/competitors/{domain}
        → Tìm main competitors

Step 2: POST /ai/keywords/magic-tool
        → Phân tích keyword gaps chi tiết với top competitors

Step 3: POST /ai/competitor-analysis
        → Phân tích strategy gaps và content gaps
```

### 2. Content Planning Workflow

```
Step 1: Identify keyword gaps từ Magic Tool
Step 2: Prioritize keywords based on:
        - Search volume
        - Keyword difficulty
        - Competitor strength
        - Business relevance
Step 3: Create content plan targeting high-opportunity gaps
```

### 3. Monitoring Workflow

```
Step 1: Định kỳ chạy competitor analysis (monthly)
Step 2: Track changes trong keyword gaps
Step 3: Adjust content strategy based on new gaps
```

---

## Best Practices

### 1. Competitor Selection

- **Quality over Quantity**: Chọn 3-5 competitors chất lượng thay vì 10+ competitors
- **Relevant Competitors**: Chọn competitors trong cùng niche/industry
- **Mix Competitor Types**: Bao gồm cả direct và indirect competitors

### 2. Gap Analysis Strategy

- **Focus on Achievable Gaps**: Ưu tiên keywords có difficulty phù hợp với domain authority
- **Consider Search Intent**: Đảm bảo keyword gaps align với business goals
- **Volume vs Competition**: Balance giữa search volume và competition level

### 3. Implementation Tips

- **Batch Processing**: Xử lý gaps theo batches thay vì individual keywords
- **Regular Monitoring**: Set up định kỳ analysis để track changes
- **Content Mapping**: Map keyword gaps to specific content types và pages

---

## Error Handling

### Common Error Codes

| Code | Error           | Description                   | Solution                                     |
| ---- | --------------- | ----------------------------- | -------------------------------------------- |
| 400  | Invalid Domain  | Domain format không đúng      | Kiểm tra domain format (không có http/https) |
| 429  | Rate Limit      | Quá nhiều requests            | Đợi và retry sau vài phút                    |
| 500  | Analysis Failed | Lỗi trong quá trình phân tích | Retry hoặc liên hệ support                   |

### Example Error Response

```json
{
  "error": "Invalid Domain",
  "message": "Domain 'invalid-domain' is not accessible or does not exist",
  "code": 400,
  "timestamp": "2025-08-05T10:30:00Z"
}
```

---

## Rate Limits & Quotas

### Rate Limits

- **Keyword Magic Tool**: 5 requests/minute per user
- **Competitor Analysis**: 10 requests/minute per user
- **Organic Research**: 20 requests/minute per user

### Quotas (Monthly)

- **Free Tier**: 50 gap analyses
- **Pro Tier**: 500 gap analyses
- **Enterprise**: Unlimited

---

## Integration Examples

### JavaScript/TypeScript

```typescript
interface KeywordGapRequest {
  seedKeyword: string;
  competitorDomains: string[];
  includeCompetitorKeywords: boolean;
  minVolume?: number;
  location?: string;
}

interface KeywordGapResponse {
  competitorAnalysis: {
    domain: string;
    keywordGaps: string[];
    sharedKeywords: string[];
    competitorStrength: number;
  }[];
}

async function analyzeKeywordGaps(
  request: KeywordGapRequest,
): Promise<KeywordGapResponse> {
  const response = await fetch('/api/v1/ai/keywords/magic-tool', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Gap analysis failed: ${response.statusText}`);
  }

  return response.json();
}

// Usage
const gaps = await analyzeKeywordGaps({
  seedKeyword: 'seo tools',
  competitorDomains: ['semrush.com', 'ahrefs.com'],
  includeCompetitorKeywords: true,
  minVolume: 100,
  location: 'US',
});

console.log('Keyword gaps found:', gaps.competitorAnalysis[0].keywordGaps);
```

### Python

```python
import requests
from typing import List, Dict, Any

class KeywordGapAnalyzer:
    def __init__(self, api_token: str, base_url: str):
        self.api_token = api_token
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }

    def analyze_keyword_gaps(
        self,
        seed_keyword: str,
        competitor_domains: List[str],
        min_volume: int = 100,
        location: str = 'US'
    ) -> Dict[str, Any]:

        payload = {
            'seedKeyword': seed_keyword,
            'competitorDomains': competitor_domains,
            'includeCompetitorKeywords': True,
            'minVolume': min_volume,
            'location': location
        }

        response = requests.post(
            f'{self.base_url}/ai/keywords/magic-tool',
            headers=self.headers,
            json=payload
        )

        response.raise_for_status()
        return response.json()

    def get_gap_opportunities(
        self,
        analysis_result: Dict[str, Any],
        min_competitor_strength: int = 70
    ) -> List[Dict[str, Any]]:

        opportunities = []

        for competitor in analysis_result.get('competitorAnalysis', []):
            if competitor['competitorStrength'] >= min_competitor_strength:
                for gap_keyword in competitor['keywordGaps']:
                    opportunities.append({
                        'keyword': gap_keyword,
                        'competitor': competitor['domain'],
                        'strength': competitor['competitorStrength']
                    })

        return sorted(opportunities, key=lambda x: x['strength'], reverse=True)

# Usage
analyzer = KeywordGapAnalyzer('your-api-token', 'http://localhost:3001/api/v1')

result = analyzer.analyze_keyword_gaps(
    seed_keyword='seo tools',
    competitor_domains=['semrush.com', 'ahrefs.com'],
    min_volume=100
)

opportunities = analyzer.get_gap_opportunities(result, min_competitor_strength=80)
print(f"Found {len(opportunities)} high-value gap opportunities")
```

### cURL Examples

```bash
# Basic keyword gap analysis
curl -X POST "http://localhost:3001/api/v1/ai/keywords/magic-tool" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "digital marketing",
    "competitorDomains": ["hubspot.com", "salesforce.com"],
    "includeCompetitorKeywords": true,
    "minVolume": 500,
    "location": "US"
  }'

# Competitor strategy analysis
curl -X POST "http://localhost:3001/api/v1/ai/competitor-analysis" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "competitorDomain": "hubspot.com",
    "yourDomain": "yoursite.com",
    "industry": "marketing"
  }'

# Discover competitors
curl -X GET "http://localhost:3001/api/v1/seo/organic-research/competitors/yoursite.com?country=US&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## FAQ

### Q: Tối đa bao nhiêu competitors có thể phân tích cùng lúc?

**A:** Keyword Magic Tool hỗ trợ tối đa 5 competitors per request để đảm bảo performance.

### Q: Làm sao để filter keyword gaps theo độ khó?

**A:** Sử dụng `minDifficulty` và `maxDifficulty` parameters để filter theo keyword difficulty phù hợp với domain authority của bạn.

### Q: Kết quả gap analysis có độ chính xác như thế nào?

**A:** Độ chính xác phụ thuộc vào data sources và AI model. Kết quả nên được validated với manual research.

### Q: Có thể schedule automatic gap analysis không?

**A:** Hiện tại chưa hỗ trợ scheduling built-in. Bạn có thể sử dụng cron jobs hoặc external schedulers.

### Q: Gap analysis có support multiple languages không?

**A:** Có, hỗ trợ 8 ngôn ngữ chính: en, vi, es, fr, de, ja, ko, zh.

---

## Support & Resources

- **API Documentation**: [Main API Docs](./API_DOCUMENTATION.md)
- **Keyword Magic Tool**: [Detailed Guide](./KEYWORD_MAGIC_TOOL_API.md)
- **Support Email**: support@your-domain.com
- **Status Page**: https://status.your-domain.com
- **Rate Limit Info**: [Rate Limits Guide](./API_DOCUMENTATION.md#rate-limits)

---

## Changelog

### v1.2.0 (2025-08-05)

- Added dedicated competitor analysis endpoint
- Enhanced keyword gap detection accuracy
- Added support for content gap analysis

### v1.1.0 (2025-07-20)

- Added organic research competitor discovery
- Improved error handling and validation
- Added batch processing capabilities

### v1.0.0 (2025-07-01)

- Initial release of keyword gap analysis
- Basic competitor comparison functionality
- Integration with Keyword Magic Tool
