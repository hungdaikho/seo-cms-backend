# Keyword Magic Tool API Documentation

## Tổng quan

Keyword Magic Tool API là một endpoint tổng hợp cho phép thực hiện nghiên cứu từ khóa toàn diện, kết hợp nhiều tính năng keyword research khác nhau trong một request duy nhất.

## Endpoint

```
POST /ai/keywords/magic-tool
```

**Base URL:** `http://localhost:3001/api/v1`

## Authentication

Requires JWT Bearer token:

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## Request Payload

### Required Fields

| Field         | Type   | Description                       |
| ------------- | ------ | --------------------------------- |
| `seedKeyword` | string | Từ khóa gốc để mở rộng nghiên cứu |

### Optional Fields

| Field                       | Type     | Default | Description                                                                                   |
| --------------------------- | -------- | ------- | --------------------------------------------------------------------------------------------- |
| `industry`                  | string   | -       | Ngành nghề/lĩnh vực (ví dụ: "technology", "healthcare")                                       |
| `location`                  | string   | "US"    | Vị trí địa lý (ví dụ: "US", "VN", "UK")                                                       |
| `language`                  | string   | "en"    | Ngôn ngữ (ví dụ: "en", "vi", "es")                                                            |
| `intentFilter`              | string   | "all"   | Lọc theo search intent: "all", "informational", "commercial", "transactional", "navigational" |
| `minDifficulty`             | number   | 0       | Độ khó tối thiểu (0-100)                                                                      |
| `maxDifficulty`             | number   | 100     | Độ khó tối đa (0-100)                                                                         |
| `minVolume`                 | number   | 0       | Lượng tìm kiếm tối thiểu hàng tháng                                                           |
| `maxVolume`                 | number   | -       | Lượng tìm kiếm tối đa hàng tháng                                                              |
| `includeLongTail`           | boolean  | true    | Bao gồm từ khóa dài                                                                           |
| `includeQuestions`          | boolean  | true    | Bao gồm từ khóa câu hỏi                                                                       |
| `includeCompetitorKeywords` | boolean  | true    | Bao gồm phân tích từ khóa đối thủ                                                             |
| `includeSeasonalTrends`     | boolean  | true    | Bao gồm xu hướng theo mùa                                                                     |
| `includeRelatedTopics`      | boolean  | true    | Bao gồm chủ đề liên quan                                                                      |
| `limitPerCategory`          | number   | 50      | Số lượng từ khóa tối đa mỗi danh mục                                                          |
| `competitorDomains`         | string[] | -       | Danh sách domain đối thủ để phân tích                                                         |
| `contentType`               | string   | -       | Loại nội dung: "blog", "product", "service", "landing-page", "category"                       |
| `targetAudience`            | string   | -       | Mô tả đối tượng mục tiêu                                                                      |

## Request Example

```json
{
  "seedKeyword": "digital marketing",
  "industry": "technology",
  "location": "US",
  "language": "en",
  "intentFilter": "all",
  "minDifficulty": 0,
  "maxDifficulty": 80,
  "minVolume": 100,
  "includeLongTail": true,
  "includeQuestions": true,
  "includeCompetitorKeywords": true,
  "includeSeasonalTrends": true,
  "includeRelatedTopics": true,
  "limitPerCategory": 50,
  "competitorDomains": ["semrush.com", "ahrefs.com"],
  "contentType": "blog",
  "targetAudience": "small business owners"
}
```

## Response Structure

### Main Response Fields

| Field                | Type   | Description                        |
| -------------------- | ------ | ---------------------------------- |
| `seedKeyword`        | string | Từ khóa gốc được sử dụng           |
| `totalKeywords`      | number | Tổng số từ khóa tìm được           |
| `summary`            | object | Thống kê tổng quan                 |
| `primaryKeywords`    | array  | Danh sách từ khóa chính            |
| `longTailKeywords`   | array  | Danh sách từ khóa dài              |
| `questionKeywords`   | array  | Danh sách từ khóa câu hỏi          |
| `relatedTopics`      | array  | Danh sách chủ đề liên quan         |
| `competitorAnalysis` | array  | Phân tích đối thủ (nếu có)         |
| `seasonalData`       | array  | Dữ liệu xu hướng theo mùa (nếu có) |
| `contentSuggestions` | array  | Gợi ý nội dung                     |
| `keywordClusters`    | array  | Nhóm từ khóa theo chủ đề           |
| `filters`            | object | Bộ lọc đã áp dụng                  |

### Summary Object

```json
{
  "avgSearchVolume": 5420,
  "avgDifficulty": 65,
  "totalEstimatedTraffic": 125000,
  "topIntent": "informational",
  "competitionLevel": "medium"
}
```

### Primary Keyword Object

```json
{
  "keyword": "digital marketing strategy",
  "searchVolume": 8900,
  "difficulty": 72,
  "cpc": 15.67,
  "intent": "informational",
  "trend": "rising",
  "competition": "high",
  "opportunity": 78
}
```

### Long-tail Keyword Object

```json
{
  "keyword": "digital marketing strategy for small business",
  "searchVolume": 1200,
  "difficulty": 45,
  "intent": "informational",
  "parentKeyword": "digital marketing strategy",
  "wordCount": 6
}
```

### Question Keyword Object

```json
{
  "question": "What is digital marketing strategy?",
  "searchVolume": 3400,
  "difficulty": 38,
  "answerType": "definition",
  "featuredSnippetChance": 85
}
```

### Related Topic Object

```json
{
  "topic": "Content Marketing",
  "relevance": 92,
  "keywordCount": 45,
  "topKeywords": ["content marketing", "content strategy", "content creation"]
}
```

### Keyword Cluster Object

```json
{
  "cluster": "SEO and Optimization",
  "keywords": [
    "seo optimization",
    "search engine optimization",
    "seo strategy"
  ],
  "pillarKeyword": "seo optimization",
  "difficulty": 68,
  "totalVolume": 25400
}
```

## Response Example

```json
{
  "seedKeyword": "digital marketing",
  "totalKeywords": 247,
  "summary": {
    "avgSearchVolume": 4250,
    "avgDifficulty": 58,
    "totalEstimatedTraffic": 89500,
    "topIntent": "informational",
    "competitionLevel": "medium"
  },
  "primaryKeywords": [
    {
      "keyword": "digital marketing",
      "searchVolume": 12500,
      "difficulty": 75,
      "cpc": 18.9,
      "intent": "informational",
      "trend": "stable",
      "competition": "high",
      "opportunity": 65
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "digital marketing for small business",
      "searchVolume": 2100,
      "difficulty": 52,
      "intent": "commercial",
      "parentKeyword": "digital marketing",
      "wordCount": 5
    }
  ],
  "questionKeywords": [
    {
      "question": "What is digital marketing?",
      "searchVolume": 5600,
      "difficulty": 42,
      "answerType": "definition",
      "featuredSnippetChance": 78
    }
  ],
  "relatedTopics": [
    {
      "topic": "Content Marketing",
      "relevance": 88,
      "keywordCount": 32,
      "topKeywords": ["content marketing", "blog marketing", "content strategy"]
    }
  ],
  "contentSuggestions": [
    {
      "contentType": "blog",
      "suggestedTopics": [
        "Digital Marketing Guide for Beginners",
        "Best Digital Marketing Strategies"
      ],
      "primaryKeywords": ["digital marketing", "digital marketing strategy"],
      "supportingKeywords": ["online marketing", "internet marketing"],
      "estimatedWordCount": 2500
    }
  ],
  "keywordClusters": [
    {
      "cluster": "Strategy and Planning",
      "keywords": [
        "digital marketing strategy",
        "marketing plan",
        "campaign planning"
      ],
      "pillarKeyword": "digital marketing strategy",
      "difficulty": 68,
      "totalVolume": 15200
    }
  ],
  "filters": {
    "location": "US",
    "language": "en",
    "intentFilter": "all",
    "difficultyRange": "0-80",
    "volumeRange": "100+"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
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

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Failed to parse AI response for keyword magic tool analysis",
  "error": "Internal Server Error"
}
```

## Usage Tips

1. **Start Simple**: Bắt đầu với chỉ `seedKeyword` để có overview tổng quan
2. **Use Filters**: Sử dụng filters để thu hẹp kết quả theo nhu cầu cụ thể
3. **Competitor Analysis**: Thêm `competitorDomains` để có insights về keyword gaps
4. **Content Planning**: Sử dụng `contentType` và `targetAudience` để có suggestions phù hợp
5. **Limit Results**: Điều chỉnh `limitPerCategory` để tránh response quá lớn

## Rate Limits

- Tối đa 10 requests/phút cho mỗi user
- Timeout: 30 giây cho mỗi request
- Max response size: 4MB

## Supported Languages

- English (en)
- Vietnamese (vi)
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)

## Supported Locations

- United States (US)
- Vietnam (VN)
- United Kingdom (UK)
- Canada (CA)
- Australia (AU)
- Germany (DE)
- France (FR)
- Spain (ES)
- Japan (JP)
- Korea (KR)
- Singapore (SG)

## Integration Examples

### JavaScript/Fetch

```javascript
const response = await fetch('/api/v1/ai/keywords/magic-tool', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    seedKeyword: 'digital marketing',
    industry: 'technology',
    includeLongTail: true,
    includeQuestions: true,
    limitPerCategory: 25,
  }),
});

const data = await response.json();
console.log(data);
```

### cURL

```bash
curl -X POST "http://localhost:3001/api/v1/ai/keywords/magic-tool" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "digital marketing",
    "industry": "technology",
    "includeLongTail": true,
    "includeQuestions": true,
    "limitPerCategory": 25
  }'
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:3001/api/v1/ai/keywords/magic-tool',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    json={
        'seedKeyword': 'digital marketing',
        'industry': 'technology',
        'includeLongTail': True,
        'includeQuestions': True,
        'limitPerCategory': 25
    }
)

data = response.json()
print(data)
```

## Best Practices

1. **Keyword Selection**: Chọn seed keyword có độ phổ biến vừa phải (không quá broad, không quá niche)
2. **Filter Optimization**: Sử dụng filters hợp lý để có kết quả chất lượng
3. **Batch Processing**: Với danh sách lớn, chia nhỏ thành nhiều requests
4. **Cache Results**: Cache kết quả để tránh duplicate requests
5. **Monitor Usage**: Theo dõi usage để optimize chi phí API calls

## Support

- **Documentation**: https://docs.your-domain.com
- **Support Email**: support@your-domain.com
- **Status Page**: https://status.your-domain.com
