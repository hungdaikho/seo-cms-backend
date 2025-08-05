# Topic Research Real Data Integration Guide

## Overview

The Topic Research API has been upgraded to support real data from external SEO APIs. By default, it uses mock data, but you can configure real API keys to get actual market data.

## Supported APIs

### 1. SEMrush API

- **Purpose**: Keyword research, search volume, difficulty scores
- **Cost**: Starting from $99/month
- **Setup**:
  1. Sign up at [semrush.com](https://www.semrush.com/api/)
  2. Get your API key from the account dashboard
  3. Add to `.env`: `SEMRUSH_API_KEY="your-api-key"`

### 2. Ahrefs API

- **Purpose**: Keyword data, related keywords, difficulty metrics
- **Cost**: Starting from $99/month
- **Setup**:
  1. Sign up at [ahrefs.com](https://ahrefs.com/api)
  2. Generate API token
  3. Add to `.env`: `AHREFS_API_KEY="your-api-key"`

### 3. SerpAPI

- **Purpose**: "People Also Ask" questions, SERP features
- **Cost**: Starting from $50/month
- **Setup**:
  1. Sign up at [serpapi.com](https://serpapi.com/)
  2. Get API key
  3. Add to `.env`: `SERPAPI_KEY="your-api-key"`

### 4. Google Trends

- **Purpose**: Trending topics, search interest over time
- **Cost**: Free (with rate limits)
- **Setup**: Automatically available via `google-trends-api` package

## Environment Variables

Add these to your `.env` file:

```bash
# SEO APIs for real data
SEMRUSH_API_KEY="your-semrush-api-key-here"
AHREFS_API_KEY="your-ahrefs-api-key-here"
MOZ_ACCESS_ID="your-moz-access-id-here"
MOZ_SECRET_KEY="your-moz-secret-key-here"
SERPAPI_KEY="your-serpapi-key-here"

# Google APIs
GOOGLE_TRENDS_API_KEY="your-google-trends-api-key-here"
GOOGLE_SEARCH_API_KEY="your-google-search-api-key-here"
GOOGLE_SEARCH_ENGINE_ID="your-custom-search-engine-id"
```

## API Endpoints

### Check API Status

```http
GET /api/v1/seo/topic-research/api-status
```

Returns the status of configured APIs:

```json
{
  "apis": {
    "semrush": true,
    "ahrefs": false,
    "serpapi": true,
    "googleTrends": true
  },
  "hasRealData": true,
  "message": "Some real APIs are configured and available",
  "timestamp": "2025-08-05T10:30:00.000Z"
}
```

### Generate Topic Ideas (with real data)

```http
POST /api/v1/seo/topic-research/ideas
```

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

**Response (with real data):**

```json
{
  "seedKeyword": "digital marketing",
  "country": "US",
  "topicIdeas": [
    {
      "topic": "Best digital marketing strategies",
      "volume": 8500,
      "difficulty": 65,
      "opportunity": 78,
      "questions": 15,
      "relatedKeywords": [
        "digital marketing tools",
        "online marketing",
        "seo strategy"
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

## Fallback Behavior

- **No API Keys**: Uses mock data with simulated metrics
- **API Errors**: Automatically falls back to mock data with error logging
- **Rate Limits**: Implements retry logic and graceful degradation

## Data Quality Improvements

With real APIs configured, you'll get:

1. **Accurate Search Volumes**: Real monthly search volumes from SEMrush/Ahrefs
2. **True Difficulty Scores**: Actual keyword difficulty based on SERP analysis
3. **Real Related Keywords**: Semantically related terms from API databases
4. **Trending Data**: Current trending topics from Google Trends
5. **Real Questions**: "People Also Ask" data from SERPs

## Cost Optimization

To minimize API costs:

1. **Cache Results**: Implement Redis caching for frequent queries
2. **Batch Requests**: Group related keyword queries
3. **Rate Limiting**: Respect API rate limits
4. **Selective Usage**: Use real APIs only for important keywords

## Monitoring

The system logs all API calls and errors:

```typescript
// Check logs
tail -f logs/topic-research.log

// Example log entries
[2025-08-05T10:30:00.000Z] INFO: SEMrush API successful for keyword "digital marketing"
[2025-08-05T10:30:05.000Z] WARN: Ahrefs API rate limit hit, using mock data
[2025-08-05T10:30:10.000Z] ERROR: SerpAPI timeout, falling back to template questions
```

## Development vs Production

### Development

- Use mock data for most testing
- Configure one API (like SerpAPI) for testing real integration
- Keep API costs minimal

### Production

- Configure all APIs for maximum data accuracy
- Implement proper caching and rate limiting
- Monitor API usage and costs

## Next Steps

1. **Choose APIs**: Start with SerpAPI (cheapest) for questions
2. **Add Caching**: Implement Redis for frequently requested data
3. **Add Webhooks**: Set up notifications for API quota limits
4. **Analytics**: Track which topics perform best with real vs mock data

## Example Implementation

```typescript
// Check if real data is available
const apiStatus = await fetch('/api/v1/seo/topic-research/api-status');
const { hasRealData } = await apiStatus.json();

if (hasRealData) {
  console.log('Using real SEO data for analysis');
} else {
  console.log('Using mock data - consider configuring API keys');
}
```
