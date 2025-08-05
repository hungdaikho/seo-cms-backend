# Content Planning API Documentation

📋 **Comprehensive Content Planning & Management APIs for Client Integration**

## Overview

The Content Planning API provides a unified interface for content strategy, planning, creation, and management. This documentation consolidates all content-related APIs to help clients build comprehensive content management workflows.

---

## 🔗 Base URLs

```
Content Management: /api/v1/projects/:projectId/content
AI Content Tools: /ai
Topic Research: /api/v1/seo/topic-research
```

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [Content Calendar Management](#content-calendar-management)
3. [Content Templates](#content-templates)
4. [AI-Powered Content Planning](#ai-powered-content-planning)
5. [Topic Research & Ideas](#topic-research--ideas)
6. [Content Performance Analytics](#content-performance-analytics)
7. [Content Categories & Organization](#content-categories--organization)
8. [Workflow Examples](#workflow-examples)
9. [Best Practices](#best-practices)

---

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token.

```http
Authorization: Bearer <your-jwt-token>
```

---

## 🗓️ Content Calendar Management

### 1. Create Calendar Item

Plan new content in your editorial calendar.

**Endpoint:** `POST /api/v1/projects/:projectId/content/calendar/items`

**Request Body:**

```json
{
  "title": "Q1 SEO Strategy Guide",
  "type": "blog_post",
  "status": "planned",
  "priority": "high",
  "publishDate": "2025-03-15T10:00:00Z",
  "targetKeywords": ["SEO strategy", "Q1 planning", "content marketing"],
  "estimatedWordCount": 2500,
  "brief": "Comprehensive guide covering SEO strategy planning for Q1 2025, including keyword research, content gaps analysis, and competitor insights.",
  "notes": "Include case studies from successful campaigns",
  "tags": ["seo", "strategy", "quarterly-planning"]
}
```

**Response:**

```json
{
  "id": "calendar-uuid",
  "title": "Q1 SEO Strategy Guide",
  "type": "blog_post",
  "status": "planned",
  "priority": "high",
  "publishDate": "2025-03-15T10:00:00Z",
  "targetKeywords": ["SEO strategy", "Q1 planning", "content marketing"],
  "estimatedWordCount": 2500,
  "actualWordCount": null,
  "brief": "Comprehensive guide covering SEO strategy planning...",
  "notes": "Include case studies from successful campaigns",
  "tags": ["seo", "strategy", "quarterly-planning"],
  "seoScore": null,
  "readabilityScore": null,
  "projectId": "project-uuid",
  "userId": "user-uuid",
  "createdAt": "2025-08-05T10:00:00Z",
  "updatedAt": "2025-08-05T10:00:00Z"
}
```

### 2. Get Calendar Items

Retrieve calendar items with filtering options.

**Endpoint:** `GET /api/v1/projects/:projectId/content/calendar/items`

**Query Parameters:**

- `startDate` (optional): Start date filter (ISO 8601)
- `endDate` (optional): End date filter (ISO 8601)
- `status` (optional): Filter by status (`planned`, `in_progress`, `review`, `published`, `archived`)
- `type` (optional): Filter by type (`blog_post`, `social_media`, `email`, `landing_page`, `video`, `infographic`)
- `author` (optional): Filter by author

**Example Request:**

```http
GET /api/v1/projects/project-uuid/content/calendar/items?status=planned&type=blog_post&startDate=2025-03-01&endDate=2025-03-31
```

**Response:**

```json
{
  "items": [
    {
      "id": "calendar-1",
      "title": "Q1 SEO Strategy Guide",
      "type": "blog_post",
      "status": "planned",
      "priority": "high",
      "publishDate": "2025-03-15T10:00:00Z",
      "targetKeywords": ["SEO strategy", "Q1 planning"],
      "estimatedWordCount": 2500,
      "actualWordCount": null,
      "brief": "Comprehensive guide for Q1 SEO planning",
      "notes": "Include case studies",
      "tags": ["seo", "strategy"],
      "seoScore": null,
      "readabilityScore": null,
      "user": {
        "id": "user-uuid",
        "name": "Content Manager",
        "email": "manager@example.com"
      }
    }
  ],
  "metrics": {
    "planned": 5,
    "in_progress": 3,
    "review": 1,
    "published": 12,
    "overdue": 0
  }
}
```

### 3. Update Calendar Item

**Endpoint:** `PUT /api/v1/projects/:projectId/content/calendar/items/:itemId`

### 4. Bulk Update Calendar Items

**Endpoint:** `POST /api/v1/projects/:projectId/content/calendar/bulk-update`

**Request Body:**

```json
{
  "items": [
    {
      "id": "calendar-1",
      "status": "in_progress",
      "publishDate": "2025-03-20T10:00:00Z"
    },
    {
      "id": "calendar-2",
      "priority": "high"
    }
  ]
}
```

### 5. Delete Calendar Item

**Endpoint:** `DELETE /api/v1/projects/:projectId/content/calendar/items/:itemId`

---

## 📝 Content Templates

### 1. Create Content Template

Create reusable templates for consistent content creation.

**Endpoint:** `POST /api/v1/projects/:projectId/content/templates`

**Request Body:**

```json
{
  "name": "SEO Blog Post Template",
  "type": "blog-post",
  "template": "# {title}\n\n## Introduction\n{introduction}\n\n## Main Content\n{content}\n\n### Key Points\n{keyPoints}\n\n## Conclusion\n{conclusion}\n\n### Call to Action\n{cta}",
  "variables": [
    {
      "name": "title",
      "type": "text",
      "required": true,
      "description": "Main article title with focus keyword"
    },
    {
      "name": "introduction",
      "type": "text",
      "required": true,
      "description": "Engaging introduction paragraph"
    },
    {
      "name": "content",
      "type": "text",
      "required": true,
      "description": "Main article content"
    },
    {
      "name": "keyPoints",
      "type": "text",
      "required": false,
      "description": "Key takeaways or bullet points"
    },
    {
      "name": "conclusion",
      "type": "text",
      "required": true,
      "description": "Article conclusion"
    },
    {
      "name": "cta",
      "type": "text",
      "required": false,
      "description": "Call to action"
    }
  ],
  "seoGuidelines": [
    "Include focus keyword in title (H1)",
    "Use H2-H6 headings for proper structure",
    "Add internal and external links naturally",
    "Include meta description within 150-160 characters",
    "Optimize images with alt text",
    "Ensure keyword density between 1-3%"
  ],
  "wordCountRange": {
    "min": 800,
    "max": 2500
  }
}
```

### 2. Get All Templates

**Endpoint:** `GET /api/v1/projects/:projectId/content/templates`

### 3. Generate Content from Template

**Endpoint:** `POST /api/v1/projects/:projectId/content/ai/generate`

**Request Body:**

```json
{
  "templateId": "template-uuid",
  "variables": {
    "title": "Complete Guide to Technical SEO in 2025",
    "introduction": "Technical SEO forms the foundation of any successful SEO strategy...",
    "content": "Technical SEO encompasses various aspects...",
    "conclusion": "Implementing these technical SEO strategies will..."
  },
  "targetKeyword": "technical SEO guide",
  "additionalKeywords": [
    "SEO optimization",
    "website performance",
    "search rankings"
  ]
}
```

---

## 🧠 AI-Powered Content Planning

### 1. Generate Content Ideas

Get AI-powered content ideas for your topic.

**Endpoint:** `POST /ai/content-ideas`

**Request Body:**

```json
{
  "topic": "email marketing",
  "audience": "small business owners",
  "format": "blog",
  "count": 10
}
```

**Response:**

```json
{
  "ideas": [
    {
      "title": "Email Marketing Automation for Small Businesses: A Complete Guide",
      "description": "Comprehensive guide covering email automation strategies specifically for small business owners",
      "contentType": "blog",
      "targetKeywords": [
        "email marketing automation",
        "small business email",
        "automated email campaigns"
      ],
      "difficulty": "medium",
      "estimatedTraffic": 2500
    },
    {
      "title": "10 Email Marketing Mistakes Small Businesses Make (And How to Fix Them)",
      "description": "Common email marketing pitfalls and practical solutions",
      "contentType": "blog",
      "targetKeywords": [
        "email marketing mistakes",
        "small business marketing",
        "email best practices"
      ],
      "difficulty": "easy",
      "estimatedTraffic": 1800
    }
  ],
  "contentPillars": [
    "Email Marketing Fundamentals",
    "Automation & Workflows",
    "Design & Templates",
    "Analytics & Optimization"
  ],
  "seasonalTopics": [
    {
      "topic": "Holiday Email Marketing Campaigns",
      "season": "Q4",
      "opportunity": "High engagement during holiday season"
    },
    {
      "topic": "New Year Email Marketing Reset",
      "season": "Q1",
      "opportunity": "Fresh start, goal-setting content"
    }
  ]
}
```

### 2. Content Optimization

**Endpoint:** `POST /ai/content-optimization`

**Request Body:**

```json
{
  "content": "Your existing content here...",
  "targetKeyword": "email marketing",
  "goals": ["improve_seo", "increase_readability", "add_keywords"]
}
```

### 3. AI Content Rewriting

**Endpoint:** `POST /api/v1/projects/:projectId/content/ai/rewrite`

**Request Body:**

```json
{
  "content": "Original content to rewrite...",
  "tone": "professional",
  "style": "conversational",
  "length": "shorter"
}
```

---

## 📚 Topic Research & Ideas

### 1. Generate Topic Ideas

**Endpoint:** `POST /api/v1/seo/topic-research/ideas`

**Request Body:**

```json
{
  "seedKeyword": "content marketing",
  "country": "US",
  "limit": 30,
  "contentType": "blog"
}
```

**Response:**

```json
{
  "topicIdeas": [
    {
      "keyword": "content marketing strategy",
      "searchVolume": 8100,
      "difficulty": 65,
      "opportunity": 78,
      "relatedTopics": [
        "content calendar",
        "content planning",
        "editorial calendar"
      ]
    },
    {
      "keyword": "content marketing examples",
      "searchVolume": 5400,
      "difficulty": 58,
      "opportunity": 82,
      "relatedTopics": [
        "successful campaigns",
        "case studies",
        "best practices"
      ]
    }
  ],
  "trendingTopics": [
    "AI content marketing",
    "video content strategy",
    "personalization in content"
  ]
}
```

### 2. Get Related Topics

**Endpoint:** `GET /api/v1/seo/topic-research/related/:topic`

**Query Parameters:**

- `limit`: Number of related topics (default: 30)
- `country`: Country code (default: US)

**Example:**

```http
GET /api/v1/seo/topic-research/related/email%20marketing?limit=20&country=US
```

### 3. Get Topic Questions

Perfect for FAQ sections and content ideas.

**Endpoint:** `GET /api/v1/seo/topic-research/questions/:topic`

**Response:**

```json
{
  "questions": [
    {
      "question": "What is email marketing?",
      "searchVolume": 2400,
      "difficulty": "low",
      "contentType": "beginner"
    },
    {
      "question": "How to start email marketing?",
      "searchVolume": 1900,
      "difficulty": "medium",
      "contentType": "tutorial"
    },
    {
      "question": "What are the best email marketing tools?",
      "searchVolume": 3200,
      "difficulty": "medium",
      "contentType": "comparison"
    }
  ]
}
```

### 4. Batch Topic Analysis

**Endpoint:** `POST /api/v1/seo/topic-research/batch-analysis`

**Request Body:**

```json
{
  "topics": ["email marketing", "content marketing", "social media marketing"],
  "country": "US",
  "includeQuestions": true
}
```

---

## 📊 Content Performance Analytics

### 1. Content Performance Analytics

**Endpoint:** `GET /api/v1/projects/:projectId/content/analytics/performance`

**Query Parameters:**

- `period`: Time period (7d, 30d, 90d, custom)
- `startDate`: Start date for custom period
- `endDate`: End date for custom period
- `contentIds`: Specific content IDs to analyze
- `groupBy`: Group results by (day, week, month)

**Response:**

```json
{
  "overview": {
    "totalViews": 15420,
    "totalEngagement": 2340,
    "averageTimeOnPage": 180,
    "bounceRate": 0.35,
    "conversionRate": 0.08
  },
  "topPerforming": [
    {
      "contentId": "content-1",
      "title": "Ultimate Email Marketing Guide",
      "views": 3200,
      "engagement": 480,
      "conversionRate": 0.12,
      "socialShares": 45
    }
  ],
  "trends": [
    {
      "date": "2025-08-01",
      "views": 520,
      "engagement": 78
    }
  ]
}
```

### 2. Content ROI Analytics

**Endpoint:** `GET /api/v1/projects/:projectId/content/analytics/roi`

### 3. Competitive Content Analysis

**Endpoint:** `GET /api/v1/projects/:projectId/content/seo/competitive-analysis`

**Query Parameters:**

- `keyword`: Target keyword to analyze
- `competitors`: Competitor domains

---

## 🏷️ Content Categories & Organization

### 1. Create Content Category

**Endpoint:** `POST /api/v1/projects/:projectId/content/categories`

**Request Body:**

```json
{
  "name": "SEO Guides",
  "slug": "seo-guides",
  "description": "Comprehensive SEO tutorials and guides",
  "color": "#2563eb",
  "parentId": null
}
```

### 2. Get All Categories

**Endpoint:** `GET /api/v1/projects/:projectId/content/categories`

### 3. Update Category

**Endpoint:** `PUT /api/v1/projects/:projectId/content/categories/:categoryId`

### 4. Delete Category

**Endpoint:** `DELETE /api/v1/projects/:projectId/content/categories/:categoryId`

---

## 🔄 Workflow Examples

### Complete Content Planning Workflow

```javascript
// 1. Research topics and generate ideas
const topicResearch = await fetch('/api/v1/seo/topic-research/ideas', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    seedKeyword: 'email marketing',
    country: 'US',
    limit: 30,
  }),
});

// 2. Generate AI-powered content ideas
const contentIdeas = await fetch('/ai/content-ideas', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'email marketing',
    audience: 'small business owners',
    count: 10,
  }),
});

// 3. Create calendar items for selected ideas
const calendarItem = await fetch(
  '/api/v1/projects/project-uuid/content/calendar/items',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Email Marketing Automation Guide',
      type: 'blog_post',
      status: 'planned',
      priority: 'high',
      publishDate: '2025-03-15T10:00:00Z',
      targetKeywords: ['email marketing automation', 'email automation'],
      estimatedWordCount: 2500,
      brief: 'Comprehensive guide on email automation...',
    }),
  },
);

// 4. Create content using template
const generatedContent = await fetch(
  '/api/v1/projects/project-uuid/content/ai/generate',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateId: 'blog-template-uuid',
      variables: {
        title: 'Email Marketing Automation Guide',
        introduction: 'Email automation is essential...',
        content: 'Step-by-step automation process...',
      },
      targetKeyword: 'email marketing automation',
    }),
  },
);

// 5. Monitor performance
const performance = await fetch(
  '/api/v1/projects/project-uuid/content/analytics/performance?period=30d',
);
```

### Content Calendar Management Workflow

```javascript
// Get calendar overview
const calendar = await fetch(
  '/api/v1/projects/project-uuid/content/calendar/items?startDate=2025-03-01&endDate=2025-03-31',
);

// Bulk update multiple items
const bulkUpdate = await fetch(
  '/api/v1/projects/project-uuid/content/calendar/bulk-update',
  {
    method: 'POST',
    body: JSON.stringify({
      items: [
        { id: 'item-1', status: 'in_progress' },
        { id: 'item-2', publishDate: '2025-03-20T10:00:00Z' },
      ],
    }),
  },
);
```

---

## ✅ Best Practices

### 1. Content Planning Strategy

1. **Start with Research**
   - Use Topic Research APIs to identify opportunities
   - Analyze competitor content gaps
   - Generate AI-powered content ideas

2. **Plan Your Calendar**
   - Create calendar items with detailed briefs
   - Set realistic publish dates and word counts
   - Assign priorities and tags for organization

3. **Use Templates**
   - Create reusable templates for consistency
   - Include SEO guidelines in templates
   - Leverage AI generation with templates

### 2. API Integration Tips

1. **Pagination**: Use proper pagination for large datasets
2. **Error Handling**: Implement retry logic for failed requests
3. **Rate Limiting**: Respect API rate limits
4. **Caching**: Cache static data like templates and categories

### 3. SEO Optimization

1. **Keyword Planning**: Always include target keywords in calendar items
2. **Content Optimization**: Use AI optimization before publishing
3. **Performance Monitoring**: Regularly check content analytics
4. **Competitive Analysis**: Monitor competitor content strategies

---

## 🔧 Error Handling

### Common Error Responses

```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "statusCode": 400,
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Error Codes

- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

---

## 📞 Support

For technical support or questions about the Content Planning APIs:

- **Documentation**: Check the main API documentation
- **Issues**: Report bugs via the project repository
- **Feature Requests**: Submit enhancement requests through proper channels

---

_Last Updated: August 5, 2025_
_API Version: 1.0_
