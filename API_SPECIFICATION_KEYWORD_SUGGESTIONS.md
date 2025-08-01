# API Specification: AI Keyword Suggestions

## Overview

This document describes the API endpoint for AI-powered keyword suggestions that needs to be implemented by the backend team.

## Endpoint Details

### POST /api/v1/ai/seo/keyword-suggestions

**Description**: Generate AI-powered keyword suggestions based on a seed keyword, with optional location and industry context.

**Method**: POST
**URL**: `http://localhost:3001/api/v1/ai/seo/keyword-suggestions`
**Content-Type**: `application/json`

## Request Format

### Request Body

```json
{
  "seedKeyword": "string (required)",
  "industry": "string (optional)",
  "location": "string (optional)"
}
```

### Request Parameters Description

| Parameter     | Type   | Required | Description                                        | Example                                             |
| ------------- | ------ | -------- | -------------------------------------------------- | --------------------------------------------------- |
| `seedKeyword` | string | Yes      | The main keyword to generate suggestions from      | "seo tools", "digital marketing", "content writing" |
| `industry`    | string | No       | Industry context for more relevant suggestions     | "Technology", "Healthcare", "E-commerce"            |
| `location`    | string | No       | Country/location code for geo-targeted suggestions | "US", "UK", "CA", "AU"                              |

### Example Request

```json
{
  "seedKeyword": "seo tools",
  "industry": "Technology",
  "location": "US"
}
```

## Response Format

### Success Response (200 OK)

```json
[
  {
    "keyword": "string",
    "searchVolume": "number (optional)",
    "difficulty": "number (optional)",
    "intent": "string (optional)",
    "relevanceScore": "number (optional)",
    "category": "string (optional)"
  }
]
```

### Response Fields Description

| Field            | Type   | Description                                   | Example                                                        |
| ---------------- | ------ | --------------------------------------------- | -------------------------------------------------------------- |
| `keyword`        | string | The suggested keyword phrase                  | "best seo tools 2024"                                          |
| `searchVolume`   | number | Monthly search volume (if available)          | 5400                                                           |
| `difficulty`     | number | Keyword difficulty score 0-100 (if available) | 65                                                             |
| `intent`         | string | Search intent classification                  | "Commercial", "Informational", "Navigational", "Transactional" |
| `relevanceScore` | number | AI-calculated relevance to seed keyword (0-1) | 0.85                                                           |
| `category`       | string | Category or theme of the keyword              | "Tools", "Software", "SEO"                                     |

### Example Response

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
    "searchVolume": 8100,
    "difficulty": 58,
    "intent": "Commercial",
    "relevanceScore": 0.89,
    "category": "Tools"
  },
  {
    "keyword": "seo analysis tools",
    "searchVolume": 2900,
    "difficulty": 72,
    "intent": "Commercial",
    "relevanceScore": 0.87,
    "category": "Analysis"
  },
  {
    "keyword": "how to use seo tools",
    "searchVolume": 1600,
    "difficulty": 45,
    "intent": "Informational",
    "relevanceScore": 0.78,
    "category": "Education"
  },
  {
    "keyword": "seo tools comparison",
    "searchVolume": 3200,
    "difficulty": 62,
    "intent": "Commercial",
    "relevanceScore": 0.85,
    "category": "Comparison"
  }
]
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "seedKeyword is required",
  "statusCode": 400
}
```

### 422 Unprocessable Entity

```json
{
  "error": "Unprocessable Entity",
  "message": "Invalid location code. Supported codes: US, UK, CA, AU, DE, FR, ES, IT, etc.",
  "statusCode": 422
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "AI service temporarily unavailable",
  "statusCode": 500
}
```

## Implementation Requirements

### 1. Input Validation

- **seedKeyword**: Required, non-empty string, max 100 characters
- **industry**: Optional string, max 50 characters
- **location**: Optional string, validate against supported country codes
- Sanitize input to prevent injection attacks

### 2. AI Integration Suggestions

The backend should integrate with an AI service (OpenAI, Claude, etc.) or keyword research API to generate suggestions. Consider these approaches:

#### Option A: AI-Powered Generation

```prompt
Generate 10-15 relevant keyword suggestions for the seed keyword "${seedKeyword}".
Context: Industry - ${industry}, Location - ${location}
Include variations like:
- Long-tail keywords
- Question-based keywords
- Commercial intent keywords
- Informational keywords
Return keywords that users would actually search for.
```

#### Option B: Keyword Research API Integration

- Integrate with services like SEMrush API, Ahrefs API, or Google Keyword Planner API
- Use the seed keyword to fetch related keywords
- Apply filters based on location and industry

### 3. Response Processing

- Sort suggestions by relevance score (highest first)
- Filter out exact duplicates
- Limit response to 15-20 suggestions maximum
- Include estimated metrics when available

### 4. Caching Strategy

- Cache results for common seed keywords (1-4 hours)
- Use combination of seedKeyword + location + industry as cache key
- Implement cache invalidation strategy

### 5. Rate Limiting

- Implement rate limiting (e.g., 100 requests per hour per IP)
- Consider user-based rate limiting for authenticated requests

## Testing Examples

### Test Case 1: Basic Request

```bash
curl -X POST http://localhost:3001/api/v1/ai/seo/keyword-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "digital marketing"
  }'
```

### Test Case 2: With Context

```bash
curl -X POST http://localhost:3001/api/v1/ai/seo/keyword-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "social media marketing",
    "industry": "E-commerce",
    "location": "US"
  }'
```

### Test Case 3: Invalid Request

```bash
curl -X POST http://localhost:3001/api/v1/ai/seo/keyword-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "Technology"
  }'
```

## Frontend Integration

The frontend calls this API through the `seoService.aiKeywordSuggestions()` method:

```typescript
// Current frontend usage
const suggestions = await seoService.aiKeywordSuggestions({
  seedKeyword: "seo tools",
  location: "US",
});
```

## Performance Requirements

- **Response Time**: < 3 seconds for most requests
- **Availability**: 99.5% uptime
- **Throughput**: Handle at least 100 concurrent requests
- **Scalability**: Design to handle increased load during peak usage

## Security Considerations

1. **Input Sanitization**: Prevent SQL injection and XSS attacks
2. **Rate Limiting**: Prevent abuse and DoS attacks
3. **Authentication**: Consider requiring API key or user authentication
4. **CORS**: Configure appropriate CORS headers for frontend access
5. **Logging**: Log requests for monitoring and debugging (without sensitive data)

## Monitoring and Logging

### Metrics to Track

- Request volume per hour/day
- Average response time
- Error rates by type
- Most popular seed keywords
- Cache hit/miss ratios

### Log Format

```json
{
  "timestamp": "2024-08-01T10:30:00Z",
  "method": "POST",
  "endpoint": "/api/v1/ai/seo/keyword-suggestions",
  "seedKeyword": "seo tools",
  "location": "US",
  "responseTime": 1250,
  "statusCode": 200,
  "suggestionsCount": 12
}
```

## Next Steps for Backend Team

1. **Choose AI/API Provider**: Decide between OpenAI, keyword research APIs, or hybrid approach
2. **Set up Database**: Create tables for caching if needed
3. **Implement Rate Limiting**: Use Redis or similar for rate limiting
4. **Testing**: Create comprehensive test suite
5. **Documentation**: Update API documentation
6. **Deployment**: Deploy to staging environment for frontend testing

## Frontend Testing Checklist

Once implemented, test these scenarios:

- [ ] Search with single keyword works
- [ ] Search with multiple words works
- [ ] Different countries return appropriate suggestions
- [ ] Error handling works for invalid requests
- [ ] Loading states work correctly
- [ ] Results display properly in the UI
- [ ] Integration with existing keyword management works
