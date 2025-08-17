# Keyword Research & Content Ideas API Documentation

Tài liệu này mô tả các API endpoints cho Keyword Research và Content Ideas phù hợp với giao diện đã cung cấp.

## 📋 Mục Lục

- [1. Keyword Research APIs](#1-keyword-research-apis)
- [2. Content Ideas APIs](#2-content-ideas-apis)
- [3. SERP Analysis APIs](#3-serp-analysis-apis)
- [4. Keyword Difficulty APIs](#4-keyword-difficulty-apis)
- [5. AI-Powered Keyword Tools](#5-ai-powered-keyword-tools)
- [6. Public APIs (No Authentication)](#6-public-apis-no-authentication)
- [7. Response Models](#7-response-models)
- [8. Usage Examples](#8-usage-examples)

---

## 🔍 1. KEYWORD RESEARCH APIs

### 1.1 Get Keyword Analysis (Main Feature)

```http
GET /api/v1/seo/organic-research/keywords/{domain}
```

**Parameters:**

- `domain` (path) - Target domain for analysis
- `country` (query) - Country code (e.g., "US", "VN")
- `limit` (query) - Number of results (default: 100)
- `offset` (query) - Pagination offset (default: 0)
- `sortBy` (query) - Sort field: "position", "traffic", "volume"
- `sortOrder` (query) - Sort order: "asc", "desc"

**Response:**

```json
{
  "data": [
    {
      "keyword": "UX",
      "position": 3,
      "previousPosition": 5,
      "searchVolume": 10320,
      "trafficShare": 8.5,
      "cpc": 234,
      "difficulty": 80,
      "intent": "informational",
      "url": "https://example.com/ux-design",
      "features": ["featured_snippet", "people_also_ask"],
      "trend": "high",
      "lastUpdated": "2022-08-19"
    }
  ],
  "total": 5432,
  "page": 1,
  "limit": 100,
  "hasNext": true,
  "hasPrev": false
}
```

### 1.2 Generate Keyword Variations

```http
GET /api/v1/seo/organic-research/keywords/{domain}/variations
```

**Response:**

```json
{
  "baseKeyword": "UX",
  "variations": [
    {
      "keyword": "Designer",
      "searchVolume": 5400,
      "difficulty": 54,
      "cpc": 46,
      "paidDifficulty": 31,
      "type": "variation",
      "trend": "stable"
    },
    {
      "keyword": "Designs",
      "searchVolume": 5400,
      "difficulty": 54,
      "cpc": 46,
      "paidDifficulty": 31,
      "type": "variation",
      "trend": "stable"
    }
  ],
  "suggestions": 99,
  "related": 12,
  "questions": 24
}
```

### 1.3 Get Keyword Ideas

```http
POST /api/v1/ai/keywords/magic-tool
```

**Request Body:**

```json
{
  "seedKeyword": "UX design",
  "country": "US",
  "includeLongTail": true,
  "includeQuestions": true,
  "includeRelated": true,
  "filters": {
    "minSearchVolume": 100,
    "maxDifficulty": 80,
    "intents": ["informational", "commercial"]
  }
}
```

**Response:**

```json
{
  "seedKeyword": "UX design",
  "totalKeywords": 500,
  "summary": {
    "avgSearchVolume": 2400,
    "avgDifficulty": 65,
    "totalEstimatedTraffic": 125000,
    "topIntent": "informational",
    "competitionLevel": "high"
  },
  "primaryKeywords": [
    {
      "keyword": "UX design process",
      "searchVolume": 8100,
      "difficulty": 72,
      "cpc": 45.2,
      "intent": "informational",
      "trend": "rising",
      "competition": "high",
      "opportunity": 78
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "UX design best practices for mobile apps",
      "searchVolume": 320,
      "difficulty": 45,
      "intent": "informational",
      "parentKeyword": "UX design",
      "wordCount": 6
    }
  ],
  "questionKeywords": [
    {
      "question": "What is UX design?",
      "searchVolume": 1900,
      "difficulty": 68,
      "answerType": "definition",
      "featuredSnippetChance": 85
    }
  ]
}
```

### 1.4 Search Volume & Trends

```http
GET /api/v1/seo/topic-research/demo/{keyword}
```

**Parameters:**

- `keyword` (path) - Target keyword
- `country` (query) - Country code (default: "US")

**Response:**

```json
{
  "keyword": "UX",
  "country": "US",
  "overview": {
    "searchVolume": 10320,
    "competition": "high",
    "interest": [
      { "month": "2022-01", "value": 85 },
      { "month": "2022-02", "value": 92 }
    ],
    "videoCount": 15000
  },
  "relatedKeywords": ["UI design", "user experience", "design thinking"],
  "suggestions": ["UX designer", "UX research", "UX portfolio"],
  "risingTopics": ["UX writing", "voice UX", "inclusive design"],
  "topVideos": [
    {
      "title": "UX Design Tutorial",
      "views": 125000,
      "engagement": 4.2
    }
  ]
}
```

---

## 💡 2. CONTENT IDEAS APIs

### 2.1 Generate Topic Ideas

```http
POST /api/v1/seo/topic-research/ideas
```

**Request Body:**

```json
{
  "seedKeyword": "UX design",
  "country": "US",
  "limit": 30,
  "industry": "Technology",
  "contentTypes": ["blog", "tutorial", "case-study"]
}
```

**Response:**

```json
{
  "seedKeyword": "UX design",
  "country": "US",
  "topicIdeas": [
    {
      "title": "Complete Guide to UX Design for Beginners",
      "volume": 2400,
      "difficulty": 65,
      "opportunity": 78,
      "contentType": "guide",
      "estimatedTraffic": 850,
      "seasonality": "stable",
      "competitiveness": 72
    },
    {
      "title": "UX Design Tools Comparison 2024",
      "volume": 1800,
      "difficulty": 58,
      "opportunity": 82,
      "contentType": "comparison",
      "estimatedTraffic": 920,
      "seasonality": "growing",
      "competitiveness": 68
    }
  ],
  "metrics": {
    "avgVolume": 2100,
    "avgDifficulty": 61,
    "avgOpportunity": 80,
    "totalIdeas": 30
  }
}
```

### 2.2 Content Ideas from Popular Content

```http
GET /api/v1/seo/topic-research/trending-topics
```

**Parameters:**

- `category` (query) - Content category (optional)
- `country` (query) - Country code (default: "US")
- `limit` (query) - Number of topics (default: 20)

**Response:**

```json
{
  "trendingTopics": [
    {
      "topic": "AI and Machine Learning in UX",
      "volume": 15000,
      "growth": 45,
      "category": "Technology"
    },
    {
      "topic": "Sustainable UX Design Practices",
      "volume": 8500,
      "growth": 38,
      "category": "Design"
    }
  ],
  "category": "all",
  "country": "US",
  "lastUpdated": "2024-08-19T10:30:00Z"
}
```

### 2.3 Question-Based Content Ideas

```http
GET /api/v1/seo/topic-research/questions/{topic}
```

**Parameters:**

- `topic` (path) - Base topic
- `limit` (query) - Number of questions (default: 50)
- `country` (query) - Country code (default: "US")

**Response:**

```json
{
  "topic": "UX design",
  "questions": [
    {
      "question": "What is UX design?",
      "searchVolume": 1900,
      "difficulty": 68,
      "intent": "informational",
      "answerLength": "medium",
      "featuredSnippetChance": 85,
      "relatedQuestions": [
        "What does a UX designer do?",
        "How to become a UX designer?"
      ]
    }
  ],
  "total": 150,
  "country": "US"
}
```

### 2.4 AI-Powered Content Ideas

```http
POST /api/v1/ai/content-ideas
```

**Request Body:**

```json
{
  "topic": "UX design",
  "audience": "beginners",
  "format": "blog",
  "count": 10
}
```

**Response:**

```json
{
  "ideas": [
    {
      "title": "10 UX Design Principles Every Beginner Should Know",
      "description": "A comprehensive guide covering fundamental UX principles",
      "contentType": "listicle",
      "estimatedWordCount": 2500,
      "targetKeywords": ["UX principles", "UX design basics"],
      "difficulty": "beginner",
      "estimatedTraffic": 1200
    }
  ],
  "contentPillars": [
    "UX Fundamentals",
    "Design Process",
    "User Research",
    "Prototyping"
  ]
}
```

### 2.5 Related Topics Discovery

```http
GET /api/v1/seo/topic-research/related/{topic}
```

**Parameters:**

- `topic` (path) - Base topic
- `limit` (query) - Number of related topics (default: 30)
- `country` (query) - Country code (default: "US")

**Response:**

```json
{
  "baseTopic": "UX design",
  "country": "US",
  "relatedTopics": [
    {
      "topic": "UI design",
      "relevance": 95,
      "volume": 18000,
      "difficulty": 72,
      "trending": true,
      "topKeywords": ["UI designer", "interface design", "UI patterns"],
      "contentOpportunities": 15
    }
  ],
  "clusters": [
    {
      "clusterName": "Design Process",
      "topics": ["wireframing", "prototyping", "user testing"],
      "relevance": 90
    }
  ],
  "total": 25
}
```

---

## 📊 3. SERP ANALYSIS APIs

### 3.1 SERP Analysis Data

```http
GET /api/v1/projects/{projectId}/serp-analysis
```

**Response:**

```json
{
  "serpData": [
    {
      "rank": 1,
      "url": "http://wordpress.com/",
      "title": "UX Design Best Practices - WordPress",
      "pageRank": 44,
      "backlinks": "20K",
      "searchTraffic": "135.93K",
      "keywords": 900,
      "domain": "wordpress.com",
      "snippet": "Complete guide to UX design best practices..."
    },
    {
      "rank": 2,
      "url": "http://wordpress.org/",
      "title": "User Experience Design Guidelines",
      "pageRank": 44,
      "backlinks": "20K",
      "searchTraffic": "135.93K",
      "keywords": 900,
      "domain": "wordpress.org",
      "snippet": "Learn UX design fundamentals and implementation..."
    }
  ],
  "total": 10,
  "keyword": "UX design",
  "lastUpdated": "2024-08-19T10:30:00Z"
}
```

### 3.2 Top Pages Analysis

```http
GET /api/v1/seo/organic-research/top-pages/{domain}
```

**Parameters:**

- `domain` (path) - Target domain
- `country` (query) - Country code
- `limit` (query) - Number of pages (default: 100)
- `sortBy` (query) - Sort by: "traffic", "keywords", "value"

**Response:**

```json
{
  "data": [
    {
      "url": "https://example.com/ux-design-guide",
      "title": "Complete UX Design Guide",
      "traffic": 15420,
      "keywords": 245,
      "topKeywords": ["UX design", "user experience", "design process"],
      "avgPosition": 8,
      "estimatedValue": 2850
    }
  ],
  "total": 150,
  "domain": "example.com",
  "country": "US"
}
```

---

## 🎯 4. KEYWORD DIFFICULTY APIs

### 4.1 Analyze Keyword Difficulty

```http
POST /api/v1/seo/keyword-difficulty/analyze
```

**Request Body:**

```json
{
  "keywords": ["UX design", "UI design", "user experience"],
  "country": "US"
}
```

**Response:**

```json
{
  "results": [
    {
      "keyword": "UX design",
      "difficulty": 80,
      "difficultyLevel": "Very Hard",
      "searchVolume": 10320,
      "factors": {
        "searchResultsCount": 125000000,
        "avgDomainAuthority": 75,
        "avgPageAuthority": 68,
        "avgBacklinks": 1250,
        "contentQuality": 82,
        "competitionDensity": 85,
        "commercialIntent": 65
      },
      "topCompetitors": [
        {
          "url": "https://example.com/ux-design",
          "domainAuthority": 85,
          "pageAuthority": 72,
          "backlinks": 2500,
          "position": 1
        }
      ],
      "recommendations": [
        "Focus on long-tail variations",
        "Create comprehensive content",
        "Build high-quality backlinks"
      ]
    }
  ]
}
```

---

## 🤖 5. AI-POWERED KEYWORD TOOLS

### 5.1 Long-Tail Keywords Generation

```http
POST /api/v1/ai/keywords/long-tail
```

**Request Body:**

```json
{
  "seedKeyword": "UX design",
  "country": "US",
  "industry": "Technology",
  "intent": "informational",
  "minWords": 3,
  "maxWords": 7,
  "count": 50
}
```

**Response:**

```json
{
  "seedKeyword": "UX design",
  "longTailKeywords": [
    {
      "keyword": "UX design best practices for mobile apps",
      "searchVolume": 320,
      "difficulty": 45,
      "intent": "informational",
      "wordCount": 6,
      "competitionLevel": "medium",
      "opportunity": 75,
      "parentKeyword": "UX design"
    }
  ],
  "total": 50,
  "avgDifficulty": 52,
  "avgOpportunity": 73
}
```

### 5.2 Question-Based Keywords

```http
POST /api/v1/ai/keywords/questions
```

**Request Body:**

```json
{
  "seedKeyword": "UX design",
  "country": "US",
  "questionTypes": ["what", "how", "why", "when"],
  "count": 30
}
```

**Response:**

```json
{
  "seedKeyword": "UX design",
  "questionKeywords": [
    {
      "question": "What is UX design process?",
      "searchVolume": 1200,
      "difficulty": 58,
      "questionType": "what",
      "answerType": "definition",
      "featuredSnippetChance": 78,
      "intent": "informational",
      "relatedQuestions": [
        "How to start UX design process?",
        "What are UX design steps?"
      ]
    }
  ],
  "total": 30,
  "questionTypes": {
    "what": 12,
    "how": 10,
    "why": 5,
    "when": 3
  }
}
```

### 5.3 Seasonal Keyword Trends

```http
POST /api/v1/ai/keywords/seasonal-trends
```

**Request Body:**

```json
{
  "keywords": ["UX design", "UI design"],
  "timeframe": "12months",
  "country": "US"
}
```

**Response:**

```json
{
  "keywords": [
    {
      "keyword": "UX design",
      "seasonalData": [
        { "month": "Jan", "volume": 8500, "trend": "stable" },
        { "month": "Feb", "volume": 9200, "trend": "rising" }
      ],
      "peakMonths": ["September", "October"],
      "lowMonths": ["June", "July"],
      "yearlyTrend": "growing",
      "seasonalityScore": 25
    }
  ],
  "timeframe": "12months",
  "country": "US"
}
```

---

## 🌐 6. PUBLIC APIs (No Authentication)

### 6.1 Public Keyword Suggestions

```http
POST /api/v1/ai/seo/keyword-suggestions
```

**Request Body:**

```json
{
  "seedKeyword": "seo tools",
  "industry": "Technology",
  "location": "US"
}
```

**Response:**

```json
[
  {
    "keyword": "best seo tools 2024",
    "searchVolume": 5400,
    "difficulty": 65,
    "intent": "Commercial",
    "relevanceScore": 0.92,
    "category": "Tools"
  },
  {
    "keyword": "free seo tools",
    "searchVolume": 3200,
    "difficulty": 58,
    "intent": "Commercial",
    "relevanceScore": 0.88,
    "category": "Tools"
  }
]
```

### 6.2 Test AI Connection

```http
GET /api/v1/ai/test-connection
```

**Response:**

```json
{
  "message": "OpenAI test successful",
  "response": {
    "status": "connected",
    "model": "gpt-4",
    "timestamp": "2024-08-19T10:30:00Z"
  }
}
```

---

## 📋 7. RESPONSE MODELS

### KeywordAnalysisResult

```typescript
interface KeywordAnalysisResult {
  keyword: string;
  position?: number;
  previousPosition?: number;
  searchVolume: number;
  trafficShare?: number;
  cpc?: number;
  difficulty: number;
  intent: string;
  url?: string;
  features?: string[];
  trend: 'rising' | 'stable' | 'declining';
  lastUpdated?: string;
}
```

### TopicIdea

```typescript
interface TopicIdea {
  title: string;
  volume: number;
  difficulty: number;
  opportunity: number;
  contentType: string;
  estimatedTraffic: number;
  seasonality: string;
  competitiveness: number;
}
```

### ContentIdea

```typescript
interface ContentIdea {
  title: string;
  description: string;
  contentType: string;
  estimatedWordCount: number;
  targetKeywords: string[];
  difficulty: string;
  estimatedTraffic: number;
}
```

### SerpResult

```typescript
interface SerpResult {
  rank: number;
  url: string;
  title: string;
  pageRank: number;
  backlinks: string;
  searchTraffic: string;
  keywords: number;
  domain: string;
  snippet?: string;
}
```

---

## 🔧 8. USAGE EXAMPLES

### JavaScript/TypeScript Client

```typescript
// Keyword Analysis
const keywordAnalysis = await fetch(
  '/api/v1/seo/organic-research/keywords/example.com?country=US&limit=50',
  {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  },
);

// AI Keyword Suggestions (Public)
const suggestions = await fetch('/api/v1/ai/seo/keyword-suggestions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    seedKeyword: 'UX design',
    industry: 'Technology',
    location: 'US',
  }),
});

// Content Ideas Generation
const contentIdeas = await fetch('/api/v1/seo/topic-research/ideas', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    seedKeyword: 'UX design',
    country: 'US',
    limit: 30,
    industry: 'Technology',
  }),
});

// Keyword Magic Tool
const magicTool = await fetch('/api/v1/ai/keywords/magic-tool', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    seedKeyword: 'UX design',
    country: 'US',
    includeLongTail: true,
    includeQuestions: true,
    filters: {
      minSearchVolume: 100,
      maxDifficulty: 80,
    },
  }),
});
```

### cURL Examples

```bash
# Keyword Analysis
curl -X GET "http://localhost:3000/api/v1/seo/organic-research/keywords/example.com?country=US&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Public Keyword Suggestions
curl -X POST "http://localhost:3000/api/v1/ai/seo/keyword-suggestions" \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "UX design",
    "industry": "Technology",
    "location": "US"
  }'

# Content Ideas
curl -X POST "http://localhost:3000/api/v1/seo/topic-research/ideas" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "UX design",
    "country": "US",
    "limit": 30
  }'

# SERP Analysis
curl -X GET "http://localhost:3000/api/v1/projects/{projectId}/serp-analysis" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Examples

```python
import requests

# Keyword Analysis
response = requests.get(
    'http://localhost:3000/api/v1/seo/organic-research/keywords/example.com',
    params={'country': 'US', 'limit': 50},
    headers={'Authorization': 'Bearer YOUR_JWT_TOKEN'}
)

# AI Keyword Suggestions
response = requests.post(
    'http://localhost:3000/api/v1/ai/seo/keyword-suggestions',
    json={
        'seedKeyword': 'UX design',
        'industry': 'Technology',
        'location': 'US'
    }
)

# Content Ideas
response = requests.post(
    'http://localhost:3000/api/v1/seo/topic-research/ideas',
    headers={'Authorization': 'Bearer YOUR_JWT_TOKEN'},
    json={
        'seedKeyword': 'UX design',
        'country': 'US',
        'limit': 30
    }
)
```

---

## 🔐 Authentication

Hầu hết các endpoints yêu cầu JWT authentication, ngoại trừ các public APIs.

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

## 📊 Rate Limits

- **Public APIs**: 100 requests/hour
- **Authenticated APIs**: 1000 requests/hour
- **AI-powered APIs**: 50 requests/hour

## 🎯 Error Handling

**Standard Error Response:**

```json
{
  "error": "Bad Request",
  "message": "seedKeyword is required",
  "statusCode": 400
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

## 📝 Notes

1. Tất cả dữ liệu search volume và keyword difficulty được cung cấp như estimates
2. AI-powered endpoints có thể mất 10-30 giây để xử lý
3. Dữ liệu trend được cập nhật hàng tuần
4. SERP analysis data được cache trong 4 giờ
5. Các public APIs không yêu cầu authentication nhưng có rate limit thấp hơn

Để biết thêm thông tin chi tiết, vui lòng tham khảo các file API documentation khác trong project.
