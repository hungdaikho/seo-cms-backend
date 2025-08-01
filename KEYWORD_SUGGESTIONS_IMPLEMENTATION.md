# Keyword Suggestions API Implementation

## Overview

This document describes the implemented AI Keyword Suggestions API endpoint that generates AI-powered keyword suggestions based on a seed keyword.

## Implementation Details

### API Endpoint

**POST** `/api/v1/ai/seo/keyword-suggestions`

### Files Created/Modified

1. **DTOs** (`src/ai/dto/ai.dto.ts`):
   - Added `KeywordSuggestionsDto` with validation
   - Added `KeywordSuggestionItem` class
   - Added `KeywordSuggestionsResponse` class
   - Added `KEYWORD_SUGGESTIONS` to `AIRequestType` enum

2. **Public Controller** (`src/ai/public-ai.controller.ts`):
   - New controller for public API endpoints
   - No authentication required
   - Proper error handling and API documentation

3. **Service Methods** (`src/ai/ai.service.ts`):
   - `generateKeywordSuggestions()` - For authenticated users
   - `generateKeywordSuggestionsPublic()` - For public access

4. **Module Updates** (`src/ai/ai.module.ts`):
   - Added `PublicAiController` to controllers

5. **Test Script** (`test-keyword-suggestions.ps1`):
   - Comprehensive test suite for the API endpoint

## API Usage

### Request Format

```json
{
  "seedKeyword": "seo tools",
  "industry": "Technology",
  "location": "US"
}
```

### Parameters

| Parameter     | Type   | Required | Max Length | Description                                        |
| ------------- | ------ | -------- | ---------- | -------------------------------------------------- |
| `seedKeyword` | string | Yes      | 100 chars  | The main keyword to generate suggestions from      |
| `industry`    | string | No       | 50 chars   | Industry context for more relevant suggestions     |
| `location`    | string | No       | 10 chars   | Country/location code for geo-targeted suggestions |

### Response Format

Returns an array of keyword suggestion objects:

```json
[
  {
    "keyword": "best seo tools 2024",
    "searchVolume": 5400,
    "difficulty": 65,
    "intent": "Commercial",
    "relevanceScore": 0.92,
    "category": "Tools"
  }
]
```

### Response Fields

| Field            | Type   | Optional | Description                                   |
| ---------------- | ------ | -------- | --------------------------------------------- |
| `keyword`        | string | No       | The suggested keyword phrase                  |
| `searchVolume`   | number | Yes      | Monthly search volume (if available)          |
| `difficulty`     | number | Yes      | Keyword difficulty score 0-100 (if available) |
| `intent`         | string | Yes      | Search intent classification                  |
| `relevanceScore` | number | Yes      | AI-calculated relevance to seed keyword (0-1) |
| `category`       | string | Yes      | Category or theme of the keyword              |

## Environment Setup

Ensure you have the following environment variable set:

```bash
OPENAI_API_KEY="your-openai-api-key-here"
```

## Testing

Run the comprehensive test script:

```powershell
.\test-keyword-suggestions.ps1
```

### Test Cases Included

1. **Basic Request** - Seed keyword only
2. **Industry Context** - With industry parameter
3. **Location Context** - With location parameter
4. **Full Request** - All parameters
5. **Validation Tests** - Missing/empty seed keyword
6. **Edge Cases** - Long keywords, special characters
7. **Multiple Industries** - Different industry contexts
8. **Multiple Locations** - Different location codes

## Error Handling

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

## API Features

### ✅ Implemented Features

- [x] Basic keyword suggestions generation
- [x] Industry context filtering
- [x] Location-based suggestions
- [x] Input validation (max lengths, required fields)
- [x] Error handling with proper HTTP status codes
- [x] Swagger API documentation
- [x] Multiple search intent types
- [x] Relevance scoring
- [x] Category classification
- [x] No authentication required (public endpoint)

### 🔄 Potential Enhancements

- [ ] Rate limiting implementation
- [ ] Response caching
- [ ] Batch keyword processing
- [ ] Integration with external keyword research APIs
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] Historical tracking
- [ ] A/B testing for different AI prompts

## Security Considerations

1. **Input Sanitization**: All inputs are validated and sanitized
2. **Rate Limiting**: Should be implemented for production use
3. **CORS Configuration**: Configure appropriate CORS headers
4. **Monitoring**: Log requests for monitoring and debugging

## Performance

- **Response Time**: Typically 2-4 seconds depending on OpenAI API
- **Token Usage**: Approximately 500-800 tokens per request
- **Concurrent Requests**: Limited by OpenAI API rate limits

## Monitoring

### Recommended Metrics

- Request volume per hour/day
- Average response time
- Error rates by type
- Most popular seed keywords
- OpenAI API usage and costs

### Logging

All requests and responses are logged for debugging and monitoring purposes.

## Next Steps

1. **Deploy to Staging**: Test the endpoint in staging environment
2. **Frontend Integration**: Update frontend to use the new endpoint
3. **Rate Limiting**: Implement rate limiting for production
4. **Caching**: Add Redis caching for common keywords
5. **Monitoring**: Set up monitoring and alerting
6. **Documentation**: Update main API documentation

## Troubleshooting

### Common Issues

1. **OpenAI API Key Missing**: Ensure `OPENAI_API_KEY` is set in environment
2. **Invalid JSON Response**: AI sometimes returns malformed JSON - handled with error catching
3. **Empty Results**: May occur with very specific or obscure keywords
4. **Rate Limits**: OpenAI has rate limits that may cause 429 errors

### Debug Mode

To enable debug logging, set environment:

```bash
NODE_ENV=development
```

This will log OpenAI responses for debugging purposes.
