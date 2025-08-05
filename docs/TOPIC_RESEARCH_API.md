# Topic Research API Documentation

## Overview

The Topic Research API provides comprehensive keyword and topic analysis using Google APIs and advanced algorithms. This API helps content creators, SEO specialists, and marketers discover trending topics, generate content ideas, and analyze keyword opportunities.

## Base URL

```
https://your-domain.com/api/v1/seo/topic-research
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### 1. Generate Topic Ideas

Generate topic ideas based on a seed keyword using real Google data.

**Endpoint:** `POST /ideas`

**Request Body:**

```json
{
  "seedKeyword": "digital marketing",
  "country": "US",
  "industry": "technology",
  "contentType": "blog",
  "limit": 20
}
```

**Parameters:**

- `seedKeyword` (required): The main keyword to generate topics around
- `country` (required): Country code (US, UK, CA, etc.)
- `industry` (optional): Industry category for better targeting
- `contentType` (optional): Type of content (blog, product, service)
- `limit` (optional): Number of topic ideas to return (default: 50, max: 200)

**Response:**

```json
{
  "seedKeyword": "digital marketing",
  "country": "US",
  "industry": "technology",
  "contentType": "blog",
  "topicIdeas": [
    {
      "topic": "Best digital marketing strategies for 2024",
      "volume": 8500,
      "difficulty": 65,
      "opportunity": 78,
      "questions": 15,
      "relatedKeywords": [
        "digital marketing tools",
        "online marketing tactics",
        "seo strategy",
        "content marketing",
        "social media marketing"
      ],
      "contentGap": 35,
      "seasonality": "high",
      "competitiveness": 65
    }
  ],
  "total": 20,
  "metrics": {
    "avgVolume": 5250,
    "avgDifficulty": 58,
    "avgOpportunity": 68,
    "totalQuestions": 320
  }
}
```

**Response Fields:**

- `volume`: Estimated monthly search volume
- `difficulty`: Keyword difficulty score (1-100)
- `opportunity`: Content opportunity score (1-100)
- `questions`: Number of related questions found
- `relatedKeywords`: Semantically related keywords
- `contentGap`: Content gap opportunity (1-100)
- `seasonality`: Search seasonality (high/medium/low)
- `competitiveness`: Competition level (1-100)

### 2. Get Related Topics

Find related topics for content expansion and cluster building.

**Endpoint:** `GET /related/{topic}`

**Parameters:**

- `topic` (path): The topic to find related topics for
- `limit` (query, optional): Number of related topics (default: 30, max: 100)
- `country` (query, optional): Country code (default: US)

**Example:**

```http
GET /related/seo%20optimization?limit=20&country=US
```

**Response:**

```json
{
  "baseTopic": "seo optimization",
  "country": "US",
  "relatedTopics": [
    {
      "topic": "seo optimization tools",
      "relevance": 95,
      "volume": 12000,
      "difficulty": 72,
      "trending": true,
      "topKeywords": ["seo tools", "optimization software", "keyword research"],
      "contentOpportunities": 18
    }
  ],
  "total": 20,
  "clusters": [
    {
      "name": "Tools",
      "topics": ["seo tools", "optimization software"],
      "volume": 25000
    }
  ]
}
```

### 3. Get Topic Questions

Retrieve questions related to a topic for content creation and FAQ development.

**Endpoint:** `GET /questions/{topic}`

**Parameters:**

- `topic` (path): The topic to find questions for
- `limit` (query, optional): Number of questions (default: 50, max: 200)
- `country` (query, optional): Country code (default: US)

**Example:**

```http
GET /questions/content%20marketing?limit=25&country=US
```

**Response:**

```json
{
  "topic": "content marketing",
  "country": "US",
  "questions": [
    {
      "question": "What is content marketing?",
      "volume": 2800,
      "difficulty": 45,
      "intent": "informational",
      "relatedKeywords": [
        "content strategy",
        "digital marketing",
        "brand awareness"
      ],
      "competitiveness": 60,
      "answerLength": "medium"
    }
  ],
  "total": 25,
  "questionTypes": {
    "what": 8,
    "how": 12,
    "why": 3,
    "when": 1,
    "where": 1,
    "who": 0
  }
}
```

**Question Intent Types:**

- `informational`: Educational content
- `commercial`: Comparison/review content
- `transactional`: Purchase-intent content
- `navigational`: Brand/website-specific

**Answer Length:**

- `short`: 1-2 paragraphs
- `medium`: 3-5 paragraphs
- `long`: Comprehensive guide/article

### 4. Batch Topic Analysis

Analyze multiple topics simultaneously for content planning.

**Endpoint:** `POST /batch-analysis`

**Request Body:**

```json
{
  "topics": ["seo optimization", "content marketing", "social media strategy"],
  "country": "US",
  "includeQuestions": true
}
```

**Parameters:**

- `topics` (required): Array of topics to analyze (max: 10)
- `country` (required): Country code
- `includeQuestions` (optional): Include top questions for each topic

**Response:**

```json
{
  "batchResults": [
    {
      "topic": "seo optimization",
      "relatedTopics": [...],
      "clusters": [...],
      "topQuestions": [...]
    }
  ],
  "totalTopics": 3,
  "country": "US",
  "timestamp": "2025-08-05T10:30:00.000Z"
}
```

### 5. Get Trending Topics

Discover currently trending topics for timely content creation.

**Endpoint:** `GET /trending-topics`

**Parameters:**

- `category` (query, optional): Topic category filter
- `country` (query, optional): Country code (default: global)
- `limit` (query, optional): Number of trending topics (default: 20)

**Example:**

```http
GET /trending-topics?category=technology&country=US&limit=15
```

**Response:**

```json
{
  "trendingTopics": [
    {
      "topic": "AI and Machine Learning",
      "volume": 15000,
      "growth": 45
    },
    {
      "topic": "Voice Search SEO",
      "volume": 6500,
      "growth": 42
    }
  ],
  "category": "technology",
  "country": "US",
  "lastUpdated": "2025-08-05T10:30:00.000Z"
}
```

### 6. Check API Status

Verify the status of external API integrations and data sources.

**Endpoint:** `GET /api-status`

**Response:**

```json
{
  "apis": {
    "googleSearch": true,
    "youtube": true,
    "googleTrends": true
  },
  "hasRealData": true,
  "message": "Google APIs are configured and available",
  "recommendations": {
    "freeOptions": [
      "Set up Google Custom Search API (100 free searches/day)",
      "Configure YouTube Data API (10,000 free units/day)",
      "Google Trends is automatically available"
    ],
    "benefits": [
      "Real search volume estimates",
      "Actual competition data",
      "Live trending topics",
      "YouTube content insights"
    ]
  },
  "timestamp": "2025-08-05T10:30:00.000Z"
}
```

### 7. Comprehensive Keyword Demo

Get a complete keyword analysis demonstration with all available data.

**Endpoint:** `GET /demo/{keyword}`

**Parameters:**

- `keyword` (path): Keyword to analyze
- `country` (query, optional): Country code (default: US)

**Example:**

```http
GET /demo/digital%20marketing?country=US
```

**Response:**

```json
{
  "keyword": "digital marketing",
  "country": "US",
  "overview": {
    "searchVolume": 8500,
    "competition": 65,
    "interest": 78,
    "videoCount": 45000
  },
  "relatedKeywords": [
    "digital marketing strategy",
    "online marketing tools",
    "SEO optimization"
  ],
  "suggestions": [
    "digital marketing for beginners",
    "digital marketing tutorial",
    "digital marketing examples"
  ],
  "risingTopics": ["AI marketing automation", "Voice search optimization"],
  "topVideos": [
    "Complete Digital Marketing Tutorial",
    "Digital Marketing for Beginners"
  ],
  "questions": [
    "What is digital marketing?",
    "How to start digital marketing?"
  ],
  "contentOpportunities": {
    "blogPosts": ["strategy guides", "tool reviews"],
    "videos": ["tutorials", "case studies"],
    "socialMedia": ["trending topics", "quick tips"]
  },
  "dataSource": "Google APIs (Free)",
  "generatedAt": "2025-08-05T10:30:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Seed keyword is required",
  "error": "Bad Request"
}
```

**Common Error Codes:**

- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing JWT token)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **Free Tier**: 100 requests per hour
- **Paid Tier**: 1000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1691145600
```

## SDK Examples

### JavaScript/TypeScript

```javascript
class TopicResearchAPI {
  constructor(
    apiKey,
    baseURL = 'https://your-domain.com/api/v1/seo/topic-research',
  ) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async generateTopicIdeas(params) {
    const response = await fetch(`${this.baseURL}/ideas`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async getRelatedTopics(topic, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${this.baseURL}/related/${encodeURIComponent(topic)}?${queryString}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );
    return response.json();
  }

  async getTopicQuestions(topic, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${this.baseURL}/questions/${encodeURIComponent(topic)}?${queryString}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );
    return response.json();
  }
}

// Usage
const api = new TopicResearchAPI('your-jwt-token');

// Generate topic ideas
const topics = await api.generateTopicIdeas({
  seedKeyword: 'digital marketing',
  country: 'US',
  limit: 20,
});

// Get related topics
const related = await api.getRelatedTopics('seo optimization', {
  limit: 15,
  country: 'US',
});

// Get questions
const questions = await api.getTopicQuestions('content marketing', {
  limit: 25,
});
```

### Python

```python
import requests
import json

class TopicResearchAPI:
    def __init__(self, api_key, base_url='https://your-domain.com/api/v1/seo/topic-research'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def generate_topic_ideas(self, params):
        response = requests.post(
            f'{self.base_url}/ideas',
            headers=self.headers,
            json=params
        )
        return response.json()

    def get_related_topics(self, topic, params=None):
        if params is None:
            params = {}
        response = requests.get(
            f'{self.base_url}/related/{topic}',
            headers={'Authorization': f'Bearer {self.api_key}'},
            params=params
        )
        return response.json()

    def get_topic_questions(self, topic, params=None):
        if params is None:
            params = {}
        response = requests.get(
            f'{self.base_url}/questions/{topic}',
            headers={'Authorization': f'Bearer {self.api_key}'},
            params=params
        )
        return response.json()

# Usage
api = TopicResearchAPI('your-jwt-token')

# Generate topic ideas
topics = api.generate_topic_ideas({
    'seedKeyword': 'digital marketing',
    'country': 'US',
    'limit': 20
})

# Get related topics
related = api.get_related_topics('seo optimization', {
    'limit': 15,
    'country': 'US'
})
```

### cURL Examples

```bash
# Generate topic ideas
curl -X POST "https://your-domain.com/api/v1/seo/topic-research/ideas" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "digital marketing",
    "country": "US",
    "limit": 20
  }'

# Get related topics
curl -X GET "https://your-domain.com/api/v1/seo/topic-research/related/seo%20optimization?limit=15&country=US" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get topic questions
curl -X GET "https://your-domain.com/api/v1/seo/topic-research/questions/content%20marketing?limit=25" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check API status
curl -X GET "https://your-domain.com/api/v1/seo/topic-research/api-status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Use Cases

### 1. Content Planning

```javascript
// Get comprehensive content ideas for a topic
const contentPlan = await Promise.all([
  api.generateTopicIdeas({
    seedKeyword: 'email marketing',
    country: 'US',
    limit: 30,
  }),
  api.getTopicQuestions('email marketing', { limit: 20 }),
  api.getRelatedTopics('email marketing', { limit: 15 }),
]);

const [topics, questions, related] = contentPlan;
```

### 2. SEO Research

```javascript
// Analyze keyword opportunities
const seoResearch = await api.generateTopicIdeas({
  seedKeyword: 'e-commerce seo',
  country: 'US',
  contentType: 'blog',
  limit: 50,
});

// Filter high-opportunity, low-competition topics
const opportunities = seoResearch.topicIdeas.filter(
  (topic) => topic.opportunity > 70 && topic.difficulty < 50,
);
```

### 3. Competitive Analysis

```javascript
// Analyze multiple competitor topics
const competitorTopics = [
  'social media marketing',
  'influencer marketing',
  'brand awareness',
];
const analysis = await api.batchAnalysis({
  topics: competitorTopics,
  country: 'US',
  includeQuestions: true,
});
```

## Best Practices

1. **Caching**: Cache API responses to reduce costs and improve performance
2. **Rate Limiting**: Implement client-side rate limiting to avoid hitting limits
3. **Error Handling**: Always handle API errors gracefully
4. **Pagination**: Use appropriate limits to avoid timeouts
5. **Monitoring**: Track API usage and performance metrics

## Support

- **Documentation**: https://your-domain.com/docs/topic-research
- **API Reference**: https://your-domain.com/api-docs
- **Support Email**: support@your-domain.com
- **Status Page**: https://status.your-domain.com

## Changelog

### v1.0.0 (Current)

- Initial release with Google APIs integration
- Topic ideas generation
- Related topics discovery
- Question research
- Batch analysis
- Trending topics
- Comprehensive keyword demo

---

_Last Updated: August 5, 2025_
