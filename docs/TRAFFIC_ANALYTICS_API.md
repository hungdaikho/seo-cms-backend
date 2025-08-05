# Traffic Analytics API

## Overview

The Traffic Analytics API provides comprehensive website traffic analysis using real Google Analytics data. This module enables you to analyze user behavior, traffic sources, page performance, and real-time metrics to gain insights into your website's performance.

## Features

- **Real-time Analytics**: Monitor current active users and live traffic
- **Traffic Overview**: Sessions, users, pageviews, and engagement metrics
- **Page Performance**: Individual page analytics with bounce rates and time on page
- **Traffic Sources**: Organic, direct, referral, social, and paid traffic analysis
- **User Behavior**: Device, geographic, and browser analytics
- **Data Synchronization**: Sync Google Analytics data to local database for faster queries
- **Period Comparisons**: Compare current vs previous periods

## Prerequisites

### Google Analytics Setup

1. **Google Analytics 4 Property**: Ensure you have a GA4 property set up
2. **Service Account**: Create a Google Cloud service account with Analytics API access
3. **Property Access**: Grant the service account viewer access to your GA4 property

### Environment Variables

```bash
# Google Analytics Configuration
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=/path/to/service-account-key.json
# OR
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
```

### Integration Setup

Before using the Traffic Analytics API, you must connect your Google Analytics account:

```http
POST /api/v1/integrations/google/analytics
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "projectId": "your-project-id",
  "propertyId": "123456789",
  "credentials": {
    "type": "service_account",
    "project_id": "your-gcp-project",
    "private_key_id": "...",
    "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
    "client_email": "service-account@your-project.iam.gserviceaccount.com",
    "client_id": "...",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

## API Endpoints

### 1. Traffic Overview

Get comprehensive traffic metrics and trends.

```http
GET /api/v1/projects/{projectId}/traffic-analytics/overview
```

**Query Parameters:**

- `period` (optional): Time period (`today`, `yesterday`, `7d`, `30d`, `90d`, `12m`, `custom`)
- `startDate` (optional): Start date for custom period (YYYY-MM-DD)
- `endDate` (optional): End date for custom period (YYYY-MM-DD)
- `metrics` (optional): Array of metrics to include
- `dimensions` (optional): Array of dimensions to group by

**Response Example:**

```json
{
  "totalSessions": 12450,
  "totalUsers": 8932,
  "totalPageviews": 23891,
  "avgBounceRate": 45.2,
  "avgSessionDuration": 185.5,
  "newUsersPercentage": 68.3,
  "returningUsersPercentage": 31.7,
  "trends": [
    {
      "date": "2025-08-01",
      "sessions": 1240,
      "users": 892,
      "pageviews": 2389,
      "bounceRate": 42.1,
      "avgSessionDuration": 178.2,
      "newUsers": 612,
      "returningUsers": 280
    }
  ],
  "periodComparison": {
    "sessionsChange": 15.3,
    "usersChange": 12.8,
    "pageviewsChange": 18.7,
    "bounceRateChange": -2.1
  }
}
```

### 2. Page Performance

Analyze individual page performance metrics.

```http
GET /api/v1/projects/{projectId}/traffic-analytics/pages
```

**Query Parameters:**

- `period` (optional): Time period
- `pagePath` (optional): Filter by specific page path
- `sortBy` (optional): Sort by metric (`pageviews`, `sessions`, `bounceRate`)
- `sortOrder` (optional): Sort order (`asc`, `desc`)
- `limit` (optional): Number of pages to return

**Response Example:**

```json
{
  "pages": [
    {
      "pagePath": "/",
      "pageTitle": "Home Page",
      "sessions": 5420,
      "pageviews": 8932,
      "uniquePageviews": 7234,
      "avgTimeOnPage": 124.5,
      "bounceRate": 38.2,
      "exitRate": 42.1,
      "entrances": 4821
    }
  ],
  "totalPages": 156,
  "totalPageviews": 23891,
  "avgTimeOnPage": 142.3,
  "avgBounceRate": 45.2
}
```

### 3. Traffic Sources

Analyze traffic sources and acquisition channels.

```http
GET /api/v1/projects/{projectId}/traffic-analytics/sources
```

**Response Example:**

```json
{
  "sources": [
    {
      "source": "google",
      "medium": "organic",
      "sessions": 4521,
      "users": 3892,
      "newUsers": 2634,
      "bounceRate": 41.3,
      "avgSessionDuration": 198.7,
      "conversions": 124,
      "conversionRate": 2.74
    }
  ],
  "organicPercentage": 52.3,
  "directPercentage": 28.7,
  "referralPercentage": 12.4,
  "socialPercentage": 4.2,
  "paidPercentage": 2.4
}
```

### 4. User Behavior

Analyze user behavior patterns and demographics.

```http
GET /api/v1/projects/{projectId}/traffic-analytics/user-behavior
```

**Query Parameters:**

- `includeDevices` (optional): Include device breakdown (default: true)
- `includeGeographic` (optional): Include geographic data (default: true)
- `includeBrowsers` (optional): Include browser data (default: false)

**Response Example:**

```json
{
  "devices": [
    {
      "deviceCategory": "mobile",
      "sessions": 6234,
      "users": 4521,
      "bounceRate": 48.3,
      "avgSessionDuration": 156.2,
      "percentage": 62.1
    }
  ],
  "geographic": [
    {
      "country": "United States",
      "countryCode": "US",
      "sessions": 4821,
      "users": 3456,
      "bounceRate": 43.2,
      "avgSessionDuration": 187.4,
      "percentage": 48.2
    }
  ],
  "summary": {
    "mobilePercentage": 62.1,
    "desktopPercentage": 32.4,
    "tabletPercentage": 5.5,
    "topCountry": "United States",
    "topCountryPercentage": 48.2
  }
}
```

### 5. Real-time Analytics

Get current active users and real-time traffic data.

```http
GET /api/v1/projects/{projectId}/traffic-analytics/real-time
```

**Response Example:**

```json
{
  "activeUsers": 67,
  "activePages": 23,
  "topPages": [
    {
      "pagePath": "/product/new-feature",
      "activeUsers": 12
    }
  ],
  "topSources": [],
  "topCountries": [],
  "timestamp": "2025-08-05T10:30:00.000Z"
}
```

### 6. Data Synchronization

Manually sync Google Analytics data to local database.

```http
POST /api/v1/projects/{projectId}/traffic-analytics/sync
```

**Response Example:**

```json
{
  "message": "Traffic data synchronized successfully",
  "recordsSynced": 90
}
```

## Advanced Features

### Custom Metrics and Dimensions

You can specify custom metrics and dimensions in your queries:

```http
GET /api/v1/projects/{projectId}/traffic-analytics/overview?metrics=sessions,users,pageviews&dimensions=date,source
```

### Period Comparisons

All endpoints automatically include period-over-period comparisons to help identify trends and changes.

### Data Caching

Traffic data is automatically synced to the local database for faster queries and historical analysis. The system intelligently caches frequently requested data while ensuring real-time accuracy.

## Error Handling

### Common Error Responses

**400 Bad Request** - Invalid parameters

```json
{
  "error": "Bad Request",
  "message": "Invalid date format. Use YYYY-MM-DD",
  "statusCode": 400
}
```

**404 Not Found** - Integration not found

```json
{
  "error": "Not Found",
  "message": "Google Analytics integration not found or property ID not configured",
  "statusCode": 404
}
```

**500 Internal Server Error** - Google Analytics API error

```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch traffic data from Google Analytics",
  "statusCode": 500
}
```

## Rate Limits

- Google Analytics API has daily quota limits (default: 100,000 requests/day)
- Real-time API has stricter limits (10 requests/minute)
- Local database queries have no limits

## Best Practices

1. **Use Appropriate Time Periods**: Longer periods provide better insights but may take longer to process
2. **Cache Results**: Use the sync endpoint to cache frequently accessed data
3. **Monitor Quotas**: Keep track of your Google Analytics API usage
4. **Real-time Sparingly**: Use real-time endpoints only when necessary due to rate limits
5. **Batch Requests**: Group multiple metrics in single requests when possible

## Integration Examples

### JavaScript/React

```javascript
const getTrafficOverview = async (projectId, period = '7d') => {
  const response = await fetch(
    `/api/v1/projects/${projectId}/traffic-analytics/overview?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.json();
};
```

### Python

```python
import requests

def get_page_performance(project_id, token, limit=50):
    url = f"/api/v1/projects/{project_id}/traffic-analytics/pages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {"limit": limit, "sortBy": "pageviews"}

    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

## Roadmap

- **Conversion Funnel Analysis**: Track user journey and conversion paths
- **Cohort Analysis**: Analyze user retention over time
- **Audience Insights**: Detailed demographics and interests
- **Custom Events**: Track specific user interactions
- **Automated Alerts**: Set up notifications for traffic anomalies
- **Predictive Analytics**: AI-powered traffic forecasting
