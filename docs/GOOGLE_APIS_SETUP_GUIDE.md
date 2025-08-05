# Google APIs Setup Guide for Topic Research

## Overview

This guide will help you set up free Google APIs to get real data for Topic Research instead of using expensive third-party APIs like SEMrush or Ahrefs.

## Required Google APIs (All Free with Usage Limits)

### 1. Google Custom Search API

- **Purpose**: Search results, keyword analysis, competition estimation
- **Free Quota**: 100 searches per day
- **Cost**: $5 per 1,000 additional queries

#### Setup Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Custom Search API"
4. Create credentials (API Key)
5. Go to [Custom Search Engine](https://cse.google.com/)
6. Create a new search engine
7. Add "www.google.com" as a site to search
8. Get the Search Engine ID

### 2. YouTube Data API v3

- **Purpose**: Video keyword analysis, trending topics, content ideas
- **Free Quota**: 10,000 units per day (≈ 100 searches)
- **Cost**: $0.20 per 10,000 additional units

#### Setup Steps:

1. In Google Cloud Console, enable "YouTube Data API v3"
2. Use the same API Key from step 1 or create a new one

### 3. Google Trends (Free, No API Key Required)

- **Purpose**: Trending topics, search interest over time
- **Free**: Unlimited usage through unofficial API
- **Limitations**: Rate limits apply

## Environment Configuration

Add these to your `.env` file:

```bash
# Google APIs (Free with limits)
GOOGLE_SEARCH_API_KEY="AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
GOOGLE_SEARCH_ENGINE_ID="e6bf7f2b695394e87"
YOUTUBE_DATA_API_KEY="AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
```

**Note**: You can use the same API key for both Google Search and YouTube.

## What Data You'll Get

### 1. Keyword Analysis

```json
{
  "keyword": "digital marketing",
  "searchVolume": 8500,
  "competition": 65,
  "interest": 78,
  "videoCount": 45000,
  "relatedKeywords": [
    "digital marketing strategy",
    "online marketing tools",
    "SEO optimization",
    "content marketing",
    "social media marketing"
  ]
}
```

### 2. Topic Questions (from Google Search)

```json
{
  "questions": [
    "What is digital marketing?",
    "How to start digital marketing?",
    "Best digital marketing tools?",
    "Digital marketing vs traditional marketing?",
    "How much does digital marketing cost?"
  ]
}
```

### 3. Trending Topics (from Google Trends)

```json
{
  "trendingTopics": [
    "AI marketing automation",
    "Voice search optimization",
    "Video marketing trends",
    "Influencer marketing ROI"
  ]
}
```

## API Usage Optimization

### 1. Caching Strategy

```typescript
// Implement Redis caching to reduce API calls
const cacheKey = `keyword_${keyword}_${country}`;
const cachedData = await redis.get(cacheKey);

if (cachedData) {
  return JSON.parse(cachedData);
}

const freshData = await this.getGoogleKeywordData(keyword, country);
await redis.setex(cacheKey, 3600, JSON.stringify(freshData)); // Cache for 1 hour
```

### 2. Batch Processing

```typescript
// Process multiple keywords in batches to optimize quota usage
const keywords = ['seo', 'marketing', 'content'];
const batchSize = 10;

for (let i = 0; i < keywords.length; i += batchSize) {
  const batch = keywords.slice(i, i + batchSize);
  await Promise.all(batch.map((keyword) => this.processKeyword(keyword)));

  // Add delay between batches to respect rate limits
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
```

## Cost Breakdown

### Daily Usage Example:

- **Startup/Small Business**: ~50 keyword searches per day
  - Google Custom Search: Free (within 100/day limit)
  - YouTube API: Free (within 10,000 units/day)
  - **Total Cost**: $0/month

- **Medium Business**: ~500 keyword searches per day
  - Google Custom Search: $20/month (400 extra searches × $5/1000)
  - YouTube API: Free (still within limits)
  - **Total Cost**: ~$20/month

- **Enterprise**: ~2000 keyword searches per day
  - Google Custom Search: $300/month
  - YouTube API: $40/month
  - **Total Cost**: ~$340/month

**Compare to paid alternatives:**

- SEMrush: $99-$399/month
- Ahrefs: $99-$999/month
- Moz: $99-$599/month

## Testing Your Setup

### 1. Check API Status

```bash
curl -X GET "http://localhost:3001/api/v1/seo/topic-research/api-status"
```

### 2. Test Topic Ideas

```bash
curl -X POST "http://localhost:3001/api/v1/seo/topic-research/ideas" \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "digital marketing",
    "country": "US",
    "limit": 10
  }'
```

### 3. Test Questions

```bash
curl -X GET "http://localhost:3001/api/v1/seo/topic-research/questions/seo?limit=10"
```

## Data Quality Improvements

With Google APIs, you get:

✅ **Real Search Volume Estimates** (based on search results count)
✅ **Actual Competition Data** (based on search time and results)
✅ **Real Related Keywords** (extracted from search results)
✅ **Trending Topics** (from Google Trends)
✅ **YouTube Insights** (video count, popular videos)
✅ **Real Questions** (extracted from search results)

## Limitations & Workarounds

### 1. Search Volume Accuracy

- **Limitation**: Estimated based on search results count
- **Workaround**: Use multiple data points and trending data for validation

### 2. Rate Limits

- **Limitation**: 100 searches/day free limit
- **Workaround**: Implement intelligent caching and batch processing

### 3. Keyword Difficulty

- **Limitation**: No direct difficulty score
- **Workaround**: Calculate based on competition metrics and search time

## Advanced Features

### 1. Geographic Analysis

```typescript
// Get data for multiple countries
const countries = ['US', 'UK', 'CA', 'AU'];
const geoData = await Promise.all(
  countries.map((country) => this.getGoogleKeywordData(keyword, country)),
);
```

### 2. Seasonal Trends

```typescript
// Analyze keyword trends over time
const trendsData = await this.getGoogleTrendsData(keyword, 'US');
const seasonality = this.analyzeSeasonality(trendsData.geographicData);
```

### 3. Content Gap Analysis

```typescript
// Find content opportunities
const topResults = await this.getGoogleSearchData(keyword, 'US');
const contentGaps = this.analyzeContentGaps(topResults.items);
```

## Next Steps

1. **Set up Google APIs** using the guide above
2. **Test with a few keywords** to verify everything works
3. **Implement caching** to optimize API usage
4. **Monitor quota usage** in Google Cloud Console
5. **Scale gradually** as your needs grow

## Support

If you encounter issues:

1. Check Google Cloud Console for API quotas
2. Verify API keys are correctly set in `.env`
3. Check application logs for specific error messages
4. Use the `/api-status` endpoint to verify configuration

This setup gives you 80% of the functionality of paid tools at a fraction of the cost!
