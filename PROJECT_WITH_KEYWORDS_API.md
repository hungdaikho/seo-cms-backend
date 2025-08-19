# Enhanced Project API - Create Project with Keywords

## Overview

The `POST /api/v1/projects` endpoint has been enhanced to support creating keywords automatically when creating a new project.

## Updated Request Structure

### Endpoint

```
POST /api/v1/projects
```

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Request Body

```typescript
{
  name: string;                    // Project name
  domain: string;                  // Project domain (without protocol)
  settings: {
    country: string;               // Country code (e.g., "US", "VN")
    language: string;              // Language code (e.g., "en", "vi")
    trackingEnabled: boolean;      // Enable/disable tracking
    keyWordsArray?: string[];      // Optional: Array of keywords to create
  }
}
```

### Example Request

```json
{
  "name": "My SEO Project",
  "domain": "example.com",
  "settings": {
    "country": "US",
    "language": "en",
    "trackingEnabled": true,
    "keyWordsArray": [
      "seo tools",
      "keyword research",
      "rank tracking",
      "website audit",
      "competitor analysis"
    ]
  }
}
```

## Response

The response structure remains the same as before, but now keywords will be automatically created in the background.

```json
{
  "id": "uuid",
  "name": "My SEO Project",
  "domain": "example.com",
  "ownerId": "user-uuid",
  "settings": {
    "country": "US",
    "language": "en",
    "trackingEnabled": true
  },
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "_count": {
    "keywords": 5,
    "competitors": 0,
    "audits": 0
  }
}
```

## Features

### ✅ Automatic Keyword Creation

- Keywords are created automatically after project creation
- Each keyword uses the project domain as the default target URL
- Keyword difficulty is calculated automatically using the AI service
- Keywords are created with tracking enabled by default

### ✅ Error Handling

- If keyword creation fails, the project is still created successfully
- Keyword creation errors are logged but don't affect project creation
- Respects user's keyword limits based on subscription plan

### ✅ Validation

- All keywords are trimmed of whitespace
- Empty keywords are filtered out
- Validates keyword limits before creation

## Backward Compatibility

- The `keyWordsArray` field is optional
- Existing API calls without keywords continue to work as before
- Settings can still contain other configuration options

## Usage Examples

### 1. Create Project Only (Original Behavior)

```json
{
  "name": "Simple Project",
  "domain": "simple.com",
  "settings": {
    "country": "US",
    "language": "en",
    "trackingEnabled": true
  }
}
```

### 2. Create Project with Keywords (New Feature)

```json
{
  "name": "SEO Project with Keywords",
  "domain": "seosite.com",
  "settings": {
    "country": "US",
    "language": "en",
    "trackingEnabled": true,
    "keyWordsArray": [
      "best seo tools",
      "keyword research tools",
      "rank tracking software"
    ]
  }
}
```

### 3. Update Project with Additional Keywords

```json
PATCH /api/v1/projects/{projectId}

{
  "settings": {
    "country": "US",
    "language": "en",
    "trackingEnabled": true,
    "keyWordsArray": [
      "new keyword 1",
      "new keyword 2"
    ]
  }
}
```

## Error Responses

### Project Limit Reached

```json
{
  "statusCode": 403,
  "message": "Project limit reached. Upgrade your plan to create more projects."
}
```

### Keyword Limit Reached

```json
{
  "statusCode": 403,
  "message": "Keyword limit exceeded. You can add X more keywords."
}
```

### Validation Errors

```json
{
  "statusCode": 400,
  "message": ["name should not be empty", "domain should not be empty"]
}
```

## Testing

Use the provided test script: `scripts/test-project-with-keywords.ps1`

```powershell
# Update the token and run
.\scripts\test-project-with-keywords.ps1
```

## Notes

- Keywords are created asynchronously after project creation
- Keyword difficulty calculation may take a few seconds
- Check the project's keyword count in the response `_count.keywords` field
- Use `GET /projects/{id}/keywords` to retrieve created keywords
