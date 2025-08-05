# Content Planning API - Quick Reference

🚀 **Quick start guide for Content Planning & Management APIs**

## 🔗 Essential Endpoints

### Content Calendar

```http
# Create calendar item
POST /api/v1/projects/:projectId/content/calendar/items

# Get calendar items
GET /api/v1/projects/:projectId/content/calendar/items

# Update calendar item
PUT /api/v1/projects/:projectId/content/calendar/items/:itemId

# Bulk update
POST /api/v1/projects/:projectId/content/calendar/bulk-update
```

### AI Content Ideas

```http
# Generate content ideas
POST /ai/content-ideas

# Content optimization
POST /ai/content-optimization

# Generate from template
POST /api/v1/projects/:projectId/content/ai/generate
```

### Topic Research

```http
# Generate topic ideas
POST /api/v1/seo/topic-research/ideas

# Get related topics
GET /api/v1/seo/topic-research/related/:topic

# Get topic questions
GET /api/v1/seo/topic-research/questions/:topic
```

### Content Templates

```http
# Create template
POST /api/v1/projects/:projectId/content/templates

# Get all templates
GET /api/v1/projects/:projectId/content/templates
```

### Analytics

```http
# Content performance
GET /api/v1/projects/:projectId/content/analytics/performance

# Content ROI
GET /api/v1/projects/:projectId/content/analytics/roi
```

## 📋 Quick Examples

### Create Calendar Item

```json
{
  "title": "SEO Guide 2025",
  "type": "blog_post",
  "status": "planned",
  "priority": "high",
  "publishDate": "2025-03-15T10:00:00Z",
  "targetKeywords": ["SEO", "guide"],
  "estimatedWordCount": 2500,
  "brief": "Comprehensive SEO guide for 2025"
}
```

### Generate Content Ideas

```json
{
  "topic": "email marketing",
  "audience": "small business",
  "format": "blog",
  "count": 10
}
```

### Topic Research

```json
{
  "seedKeyword": "content marketing",
  "country": "US",
  "limit": 30
}
```

## 🔐 Authentication

```http
Authorization: Bearer <your-jwt-token>
```

## 📖 Full Documentation

See [CONTENT_PLANNING_API.md](./CONTENT_PLANNING_API.md) for complete documentation.

---

_Quick Reference - Last Updated: August 5, 2025_
