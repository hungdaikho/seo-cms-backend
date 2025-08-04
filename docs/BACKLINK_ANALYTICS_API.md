# 🔗 Backlink Analytics API Documentation

## Overview

The Backlink Analytics API provides comprehensive backlink management and analysis capabilities for SEO projects. It allows you to track, analyze, and manage backlinks with detailed metrics and insights.

**Base URL:** `https://api.ranktackerpro.com/api/v1`  
**Development URL:** `http://localhost:3001/api/v1`

## Authentication

All endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 🔍 **Quick Reference**

| Endpoint                                        | Purpose                 | Time Filtering                          | Pagination |
| ----------------------------------------------- | ----------------------- | --------------------------------------- | ---------- |
| `GET /projects/{projectId}/backlinks`           | List all backlinks      | ❌ No                                   | ✅ Yes     |
| `GET /projects/{projectId}/backlinks/analytics` | Analytics & insights    | ✅ Yes (`days`, `startDate`, `endDate`) | ❌ No      |
| `GET /projects/{projectId}/backlinks/{id}`      | Single backlink details | ❌ No                                   | ❌ No      |

### 1. 📋 Get Project Backlinks

Retrieve all backlinks for a specific project with pagination support.

```http
GET /projects/{projectId}/backlinks
```

**Parameters:**

- `projectId` (path, required): Project UUID
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page (default: 20, max: 100)

**⚠️ Note:** This endpoint does NOT support `days`, `startDate`, or `endDate` parameters. For time-based filtering, use the analytics endpoint instead.

**Response (200):**

```json
{
  "data": [
    {
      "id": "backlink-uuid",
      "sourceDomain": "authority-site.com",
      "targetUrl": "https://yoursite.com/target-page",
      "anchorText": "best seo tools",
      "linkType": "follow",
      "authorityScore": 85,
      "isActive": true,
      "discoveredAt": "2025-07-15T10:30:00.000Z",
      "createdAt": "2025-07-15T10:30:00.000Z",
      "updatedAt": "2025-07-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

### 2. ➕ Add New Backlink

Add a new backlink to the project.

```http
POST /projects/{projectId}/backlinks
```

**Request Body:**

```json
{
  "sourceDomain": "authority-site.com",
  "targetUrl": "https://yoursite.com/target-page",
  "anchorText": "best seo tools",
  "linkType": "follow",
  "authorityScore": 85
}
```

**Response (201):**

```json
{
  "id": "backlink-uuid",
  "sourceDomain": "authority-site.com",
  "targetUrl": "https://yoursite.com/target-page",
  "anchorText": "best seo tools",
  "linkType": "follow",
  "authorityScore": 85,
  "isActive": true,
  "discoveredAt": "2025-08-04T10:30:00.000Z",
  "createdAt": "2025-08-04T10:30:00.000Z",
  "updatedAt": "2025-08-04T10:30:00.000Z"
}
```

**Error Responses:**

- `409 Conflict`: Backlink already exists
- `404 Not Found`: Project not found
- `400 Bad Request`: Invalid data

### 3. 📊 Get Backlink Analytics

Get comprehensive analytics and insights for project backlinks.

```http
GET /projects/{projectId}/backlinks/analytics
```

**Query Parameters:**

- `startDate` (optional): Start date for analytics (ISO 8601 format)
- `endDate` (optional): End date for analytics (ISO 8601 format)
- `days` (optional): Number of days to analyze (default: 360 for comprehensive yearly analysis)

**⚠️ Note:** Time-based parameters (`days`, `startDate`, `endDate`) are ONLY available on this analytics endpoint, not on the basic backlinks list endpoint. Default analysis period is 360 days for comprehensive yearly insights.

**Response (200):**

```json
{
  "summary": {
    "totalBacklinks": 156,
    "totalDomains": 78,
    "activeLinks": 142,
    "followLinks": 98,
    "nofollowLinks": 58,
    "averageAuthorityScore": 67.5,
    "newBacklinksCount": 12
  },
  "newBacklinks": [
    {
      "id": "backlink-uuid",
      "sourceDomain": "newsite.com",
      "targetUrl": "https://yoursite.com/page",
      "anchorText": "seo guide",
      "linkType": "follow",
      "authorityScore": 72,
      "discoveredAt": "2025-08-01T14:20:00.000Z"
    }
  ],
  "topDomains": [
    {
      "domain": "authority-site.com",
      "count": 8
    },
    {
      "domain": "tech-blog.net",
      "count": 5
    }
  ],
  "topTargetUrls": [
    {
      "url": "https://yoursite.com/seo-tools",
      "count": 15
    },
    {
      "url": "https://yoursite.com/guide",
      "count": 12
    }
  ],
  "linkTypeDistribution": {
    "follow": 98,
    "nofollow": 58,
    "unknown": 0
  },
  "authorityDistribution": {
    "0-20": 5,
    "21-40": 18,
    "41-60": 45,
    "61-80": 62,
    "81-100": 26
  }
}
```

### 4. 🔍 Get Backlink Details

Get detailed information about a specific backlink.

```http
GET /projects/{projectId}/backlinks/{backlinkId}
```

**Response (200):**

```json
{
  "id": "backlink-uuid",
  "sourceDomain": "authority-site.com",
  "targetUrl": "https://yoursite.com/target-page",
  "anchorText": "best seo tools",
  "linkType": "follow",
  "authorityScore": 85,
  "isActive": true,
  "discoveredAt": "2025-07-15T10:30:00.000Z",
  "createdAt": "2025-07-15T10:30:00.000Z",
  "updatedAt": "2025-07-15T10:30:00.000Z",
  "project": {
    "id": "project-uuid",
    "name": "My SEO Project",
    "domain": "yoursite.com"
  }
}
```

### 5. ✏️ Update Backlink

Update an existing backlink's information.

```http
PUT /projects/{projectId}/backlinks/{backlinkId}
```

**Request Body:**

```json
{
  "anchorText": "updated anchor text",
  "linkType": "nofollow",
  "authorityScore": 90,
  "isActive": false
}
```

**Response (200):**

```json
{
  "id": "backlink-uuid",
  "sourceDomain": "authority-site.com",
  "targetUrl": "https://yoursite.com/target-page",
  "anchorText": "updated anchor text",
  "linkType": "nofollow",
  "authorityScore": 90,
  "isActive": false,
  "discoveredAt": "2025-07-15T10:30:00.000Z",
  "createdAt": "2025-07-15T10:30:00.000Z",
  "updatedAt": "2025-08-04T11:45:00.000Z"
}
```

### 6. 🗑️ Delete Backlink

Remove a backlink from the project.

```http
DELETE /projects/{projectId}/backlinks/{backlinkId}
```

**Response (200):**

```json
{
  "message": "Backlink deleted successfully"
}
```

## Data Models

### Backlink Object

| Field            | Type     | Description                                         |
| ---------------- | -------- | --------------------------------------------------- |
| `id`             | string   | Unique backlink identifier (UUID)                   |
| `sourceDomain`   | string   | Domain providing the backlink                       |
| `targetUrl`      | string   | URL being linked to                                 |
| `anchorText`     | string   | Link anchor text (optional)                         |
| `linkType`       | enum     | Link type: `follow`, `nofollow`, `sponsored`, `ugc` |
| `authorityScore` | number   | Domain authority score (0-100)                      |
| `isActive`       | boolean  | Whether the link is currently active                |
| `discoveredAt`   | datetime | When the backlink was first discovered              |
| `createdAt`      | datetime | Record creation timestamp                           |
| `updatedAt`      | datetime | Last update timestamp                               |

### Link Types

- `follow`: Standard follow link that passes authority
- `nofollow`: Link with nofollow attribute
- `sponsored`: Paid/sponsored link
- `ugc`: User-generated content link

## Analytics Metrics

### Summary Metrics

- **Total Backlinks**: Total number of backlinks
- **Total Domains**: Number of unique referring domains
- **Active Links**: Currently active/live backlinks
- **Follow/Nofollow Ratio**: Distribution of link types
- **Average Authority Score**: Mean authority score of referring domains
- **New Backlinks**: Recently discovered backlinks

### Time-based Analysis

- Filter analytics by date range
- Track backlink acquisition over time
- Monitor link loss and gains

### Domain Analysis

- Top referring domains by link count
- Authority score distribution
- Domain diversity metrics

### Target URL Analysis

- Most linked-to pages
- URL-specific backlink performance
- Content performance insights

## Error Handling

### Common Mistakes

**❌ Wrong: Using time parameters on list endpoint**

```bash
# This will return "property days should not exist"
GET /projects/{projectId}/backlinks?days=30
```

**✅ Correct: Use analytics endpoint for time filtering**

```bash
# For comprehensive yearly analytics (360 days default)
GET /projects/{projectId}/backlinks/analytics

# For specific time period
GET /projects/{projectId}/backlinks/analytics?days=90

# For simple backlinks list
GET /projects/{projectId}/backlinks?page=1&limit=20
```

### Common Error Responses

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "sourceDomain",
      "message": "Source domain is required"
    }
  ]
}
```

**401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Unauthorized access"
}
```

**403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Backlink not found"
}
```

**409 Conflict**

```json
{
  "statusCode": 409,
  "message": "Backlink already exists for this source domain and target URL"
}
```

**429 Too Many Requests**

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded"
}
```

## Rate Limiting

- **Standard Plan**: 100 requests per minute
- **Professional Plan**: 300 requests per minute
- **Enterprise Plan**: 1000 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

## Usage Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'https://api.ranktackerpro.com/api/v1';
const TOKEN = 'your-jwt-token';

// Get backlinks with analytics (360 days by default)
async function getBacklinkAnalytics(projectId) {
  try {
    const response = await axios.get(
      `${API_BASE}/projects/${projectId}/backlinks/analytics`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Analytics:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Add new backlink
async function addBacklink(projectId, backlinkData) {
  try {
    const response = await axios.post(
      `${API_BASE}/projects/${projectId}/backlinks`,
      backlinkData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('New backlink:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### Python

```python
import requests
import json

API_BASE = 'https://api.ranktackerpro.com/api/v1'
TOKEN = 'your-jwt-token'

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

# Get backlink analytics (360 days by default)
def get_backlink_analytics(project_id, days=360):
    url = f'{API_BASE}/projects/{project_id}/backlinks/analytics'
    params = {}
    if days != 360:  # Only add days param if different from default
        params['days'] = days

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        print(f'Error: {response.status_code} - {response.text}')
        return None

# Add new backlink
def add_backlink(project_id, backlink_data):
    url = f'{API_BASE}/projects/{project_id}/backlinks'

    response = requests.post(url, headers=headers, json=backlink_data)

    if response.status_code == 201:
        return response.json()
    else:
        print(f'Error: {response.status_code} - {response.text}')
        return None
```

### cURL

```bash
# Get backlink analytics (360 days by default)
curl -X GET \
  "https://api.ranktackerpro.com/api/v1/projects/PROJECT_ID/backlinks/analytics" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Get backlink analytics for specific period
curl -X GET \
  "https://api.ranktackerpro.com/api/v1/projects/PROJECT_ID/backlinks/analytics?days=90" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Add new backlink
curl -X POST \
  "https://api.ranktackerpro.com/api/v1/projects/PROJECT_ID/backlinks" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceDomain": "authority-site.com",
    "targetUrl": "https://yoursite.com/target-page",
    "anchorText": "best seo tools",
    "linkType": "follow",
    "authorityScore": 85
  }'
```

## Best Practices

### 1. **Efficient Pagination**

- Use appropriate page sizes (20-50 items)
- Implement cursor-based pagination for large datasets
- Cache results when possible

### 2. **Analytics Optimization**

- Use specific date ranges instead of large time windows
- Implement client-side caching for analytics data
- Poll analytics endpoints sparingly (max once per hour)

### 3. **Data Quality**

- Validate domain names before submission
- Regularly check and update `isActive` status
- Monitor authority scores for changes

### 4. **Error Handling**

- Implement exponential backoff for rate limits
- Handle network timeouts gracefully
- Log errors for debugging

### 5. **Security**

- Never expose API tokens in client-side code
- Use HTTPS for all requests
- Rotate tokens regularly

## Changelog

### v1.3.0 (2025-08-04)

- ✅ **Enhanced default analytics period to 360 days** for comprehensive yearly insights
- ✅ **Added realistic backlinks seed data** with 50+ authority domains
- ✅ **Improved data quality** with authentic anchor texts and discovery patterns
- ✅ **Better authority score distribution** across different domain types

### v1.2.0 (2025-08-04)

- ✅ Added comprehensive backlink analytics
- ✅ Improved authority score tracking
- ✅ Enhanced domain analysis features

### v1.1.0 (2025-07-20)

- ✅ Added pagination support
- ✅ Improved error handling
- ✅ Added link type validation

### v1.0.0 (2025-07-15)

- ✅ Initial backlink management API
- ✅ Basic CRUD operations
- ✅ Authentication integration

## Support

For API support and questions:

- **Email**: api-support@ranktackerpro.com
- **Documentation**: https://docs.ranktackerpro.com
- **Status Page**: https://status.ranktackerpro.com

---

**Note**: This API is actively maintained and updated. Please refer to the latest documentation for any changes or new features.
