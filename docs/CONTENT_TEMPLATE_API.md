# Content Template API Documentation

📋 **API Documentation for SEO Content Template Management**

## Overview

The Content Template API provides comprehensive endpoints for creating, managing, and utilizing SEO-optimized content templates. These templates help standardize content creation while ensuring SEO best practices.

---

## 🔗 Base URL

```
/api/v1/projects/:projectId/content/templates
```

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [Template CRUD Operations](#template-crud-operations)
3. [AI-Powered Templates](#ai-powered-templates)
4. [Template Types & Variables](#template-types--variables)
5. [SEO Guidelines](#seo-guidelines)
6. [Error Handling](#error-handling)
7. [Examples](#examples)

---

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token.

```http
Authorization: Bearer <your-jwt-token>
```

---

## 📝 Template CRUD Operations

### 1. Create Content Template

Create a new SEO-optimized content template.

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
      "required": true
    },
    {
      "name": "introduction",
      "type": "text",
      "required": true
    },
    {
      "name": "content",
      "type": "text",
      "required": true
    },
    {
      "name": "keyPoints",
      "type": "text",
      "required": false
    },
    {
      "name": "conclusion",
      "type": "text",
      "required": true
    },
    {
      "name": "cta",
      "type": "text",
      "required": false
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

**Response (201 Created):**

```json
{
  "id": "template-uuid-here",
  "name": "SEO Blog Post Template",
  "type": "blog-post",
  "template": "# {title}\n\n## Introduction\n{introduction}...",
  "variables": [...],
  "seoGuidelines": [...],
  "wordCountRange": {
    "min": 800,
    "max": 2500
  },
  "projectId": "project-uuid",
  "userId": "user-uuid",
  "createdAt": "2025-08-05T10:00:00Z",
  "updatedAt": "2025-08-05T10:00:00Z"
}
```

### 2. Get All Templates

Retrieve all content templates for a project.

**Endpoint:** `GET /api/v1/projects/:projectId/content/templates`

**Response (200 OK):**

```json
[
  {
    "id": "template-1",
    "name": "Blog Post Template",
    "type": "blog-post",
    "template": "# {title}\n\n{introduction}...",
    "variables": [...],
    "seoGuidelines": [...],
    "wordCountRange": {
      "min": 1000,
      "max": 3000
    },
    "projectId": "project-uuid",
    "userId": "user-uuid",
    "createdAt": "2025-08-05T09:00:00Z",
    "updatedAt": "2025-08-05T09:00:00Z"
  },
  {
    "id": "template-2",
    "name": "Landing Page Template",
    "type": "landing-page",
    "template": "# {headline}\n\n{heroSection}...",
    "variables": [...],
    "seoGuidelines": [...],
    "wordCountRange": {
      "min": 500,
      "max": 1500
    },
    "projectId": "project-uuid",
    "userId": "user-uuid",
    "createdAt": "2025-08-05T08:00:00Z",
    "updatedAt": "2025-08-05T08:00:00Z"
  }
]
```

### 3. Update Template

Update an existing content template.

**Endpoint:** `PUT /api/v1/projects/:projectId/content/templates/:templateId`

**Request Body:**

```json
{
  "name": "Updated SEO Blog Post Template",
  "type": "blog-post",
  "template": "# {title}\n\n## Enhanced Introduction\n{introduction}\n\n## Main Content Sections\n{content}\n\n### Expert Tips\n{expertTips}\n\n## Conclusion\n{conclusion}",
  "variables": [
    {
      "name": "title",
      "type": "text",
      "required": true
    },
    {
      "name": "introduction",
      "type": "text",
      "required": true
    },
    {
      "name": "content",
      "type": "text",
      "required": true
    },
    {
      "name": "expertTips",
      "type": "text",
      "required": false
    },
    {
      "name": "conclusion",
      "type": "text",
      "required": true
    }
  ],
  "seoGuidelines": [
    "Include focus keyword in title and meta description",
    "Use semantic HTML structure (H1-H6)",
    "Add schema markup when applicable",
    "Include internal linking strategy",
    "Optimize for featured snippets"
  ],
  "wordCountRange": {
    "min": 1200,
    "max": 3000
  }
}
```

**Response (200 OK):**

```json
{
  "id": "template-uuid",
  "name": "Updated SEO Blog Post Template",
  "type": "blog-post",
  "template": "# {title}\n\n## Enhanced Introduction...",
  "variables": [...],
  "seoGuidelines": [...],
  "wordCountRange": {
    "min": 1200,
    "max": 3000
  },
  "projectId": "project-uuid",
  "userId": "user-uuid",
  "createdAt": "2025-08-05T09:00:00Z",
  "updatedAt": "2025-08-05T11:00:00Z"
}
```

### 4. Delete Template

Delete a content template.

**Endpoint:** `DELETE /api/v1/projects/:projectId/content/templates/:templateId`

**Response (200 OK):**

```json
{
  "message": "Template deleted successfully"
}
```

---

## 🤖 AI-Powered Templates

### 1. Create AI Template

Create intelligent templates with AI assistance.

**Endpoint:** `POST /ai/templates`

**Query Parameters:**

- `projectId` (required): Project UUID

**Request Body:**

```json
{
  "name": "AI SEO Article Generator",
  "description": "Generate comprehensive SEO articles with AI assistance",
  "toolId": "content-generation",
  "parameters": {
    "contentType": "blog-post",
    "tone": "professional",
    "targetAudience": "business professionals",
    "includeStats": true,
    "includeCaseStudies": true,
    "seoOptimization": "advanced"
  },
  "isShared": false
}
```

**Response (201 Created):**

```json
{
  "id": "ai-template-uuid",
  "projectId": "project-uuid",
  "name": "AI SEO Article Generator",
  "description": "Generate comprehensive SEO articles with AI assistance",
  "toolId": "content-generation",
  "parameters": {
    "contentType": "blog-post",
    "tone": "professional",
    "targetAudience": "business professionals",
    "includeStats": true,
    "includeCaseStudies": true,
    "seoOptimization": "advanced"
  },
  "isShared": false,
  "createdBy": "user-uuid",
  "createdAt": "2025-08-05T12:00:00Z",
  "usageCount": 0
}
```

### 2. Get AI Templates

Retrieve AI-powered templates with filtering options.

**Endpoint:** `GET /ai/templates`

**Query Parameters:**

- `projectId` (optional): Filter by project
- `toolId` (optional): Filter by tool type
- `isShared` (optional): Filter by shared status

**Response (200 OK):**

```json
[
  {
    "id": "ai-template-1",
    "projectId": "project-uuid",
    "name": "AI SEO Article Generator",
    "description": "Generate comprehensive SEO articles",
    "toolId": "content-generation",
    "parameters": {...},
    "isShared": false,
    "createdBy": "user-uuid",
    "createdAt": "2025-08-05T12:00:00Z",
    "usageCount": 15
  }
]
```

---

## 📋 Template Types & Variables

### Supported Template Types

| Type           | Description              | Use Case                        |
| -------------- | ------------------------ | ------------------------------- |
| `blog-post`    | Blog article templates   | SEO articles, tutorials, guides |
| `landing-page` | Landing page templates   | Product pages, service pages    |
| `email`        | Email campaign templates | Newsletters, promotional emails |
| `social-media` | Social media content     | Posts, captions, hashtags       |

### Variable Types

| Type      | Description        | Example                              |
| --------- | ------------------ | ------------------------------------ |
| `text`    | Plain text content | Titles, descriptions, content blocks |
| `keyword` | SEO keywords       | Focus keywords, secondary keywords   |
| `date`    | Date values        | Publish dates, event dates           |
| `number`  | Numeric values     | Statistics, counts, prices           |

### Variable Structure

```json
{
  "name": "variableName",
  "type": "text|keyword|date|number",
  "required": true|false,
  "description": "Optional description",
  "defaultValue": "Optional default value"
}
```

---

## 🎯 SEO Guidelines

### Built-in SEO Best Practices

Templates include predefined SEO guidelines:

```json
{
  "seoGuidelines": [
    "Include focus keyword in H1 title",
    "Use H2-H6 headings for content structure",
    "Add internal links to related content",
    "Include external links to authoritative sources",
    "Optimize meta description (150-160 characters)",
    "Add alt text to all images",
    "Maintain keyword density between 1-3%",
    "Include schema markup when applicable",
    "Optimize for featured snippets",
    "Use semantic HTML structure"
  ]
}
```

### Word Count Recommendations

```json
{
  "wordCountRange": {
    "min": 800, // Minimum words for SEO effectiveness
    "max": 3000 // Maximum words to maintain readability
  }
}
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "name",
      "message": "Template name is required"
    }
  ]
}
```

### Common Error Codes

| Code  | Description      | Solution                       |
| ----- | ---------------- | ------------------------------ |
| `400` | Bad Request      | Check request body format      |
| `401` | Unauthorized     | Provide valid JWT token        |
| `403` | Forbidden        | Check user permissions         |
| `404` | Not Found        | Verify template/project exists |
| `409` | Conflict         | Template name already exists   |
| `422` | Validation Error | Fix validation issues          |

---

## 💡 Examples

### Example 1: Blog Post Template

```json
{
  "name": "Technical SEO Guide Template",
  "type": "blog-post",
  "template": "# {title}\n\n> **Last Updated:** {lastUpdated}\n\n## Table of Contents\n{tableOfContents}\n\n## Introduction\n{introduction}\n\n## What is {mainTopic}?\n{definition}\n\n## Why {mainTopic} Matters for SEO\n{importance}\n\n## Step-by-Step Guide\n{stepByStep}\n\n### Tools You'll Need\n{toolsList}\n\n## Common Mistakes to Avoid\n{commonMistakes}\n\n## Advanced Tips\n{advancedTips}\n\n## Case Study\n{caseStudy}\n\n## Conclusion\n{conclusion}\n\n## Related Resources\n{relatedResources}",
  "variables": [
    {
      "name": "title",
      "type": "text",
      "required": true,
      "description": "Main article title with focus keyword"
    },
    {
      "name": "lastUpdated",
      "type": "date",
      "required": true,
      "description": "Article last update date"
    },
    {
      "name": "mainTopic",
      "type": "keyword",
      "required": true,
      "description": "Primary focus keyword"
    },
    {
      "name": "introduction",
      "type": "text",
      "required": true,
      "description": "Engaging introduction paragraph"
    }
  ],
  "seoGuidelines": [
    "Include focus keyword in title and first paragraph",
    "Use semantic HTML structure",
    "Add table of contents for long articles",
    "Include last updated date for freshness",
    "Link to related internal content"
  ],
  "wordCountRange": {
    "min": 1500,
    "max": 4000
  }
}
```

### Example 2: Landing Page Template

```json
{
  "name": "SaaS Product Landing Page",
  "type": "landing-page",
  "template": "# {headline}\n\n## {subheadline}\n\n### Hero Section\n{heroDescription}\n\n**Key Benefits:**\n{keyBenefits}\n\n### Features\n{featuresSection}\n\n### Social Proof\n{testimonials}\n\n### Pricing\n{pricingSection}\n\n### FAQ\n{faqSection}\n\n### CTA Section\n{ctaSection}",
  "variables": [
    {
      "name": "headline",
      "type": "text",
      "required": true,
      "description": "Main headline with primary keyword"
    },
    {
      "name": "subheadline",
      "type": "text",
      "required": true,
      "description": "Supporting headline"
    },
    {
      "name": "keyBenefits",
      "type": "text",
      "required": true,
      "description": "List of key product benefits"
    }
  ],
  "seoGuidelines": [
    "Include primary keyword in headline",
    "Optimize meta description for click-through rate",
    "Add schema markup for products/services",
    "Include local SEO elements if applicable",
    "Optimize images with descriptive alt text"
  ],
  "wordCountRange": {
    "min": 500,
    "max": 1500
  }
}
```

### Example 3: Using Template with Content Generation

After creating a template, use it to generate content:

```http
POST /api/v1/projects/:projectId/content/ai/generate
```

```json
{
  "templateId": "template-uuid",
  "variables": {
    "title": "Complete Guide to Technical SEO in 2025",
    "mainTopic": "Technical SEO",
    "introduction": "Technical SEO forms the foundation of any successful SEO strategy...",
    "lastUpdated": "2025-08-05"
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

## 🔧 Best Practices

### 1. Template Naming

- Use descriptive, specific names
- Include template type in name
- Version templates when making major changes

### 2. Variable Design

- Keep variable names semantic and clear
- Mark essential variables as required
- Provide helpful descriptions

### 3. SEO Optimization

- Always include focus keyword guidance
- Specify heading structure requirements
- Include meta data recommendations

### 4. Content Structure

- Use logical content flow
- Include placeholders for all content sections
- Consider user experience in template design

---

## 📞 Support

For technical support or questions about the Content Template API:

- **Documentation**: Check the main API documentation
- **Issues**: Report bugs via the project repository
- **Feature Requests**: Submit enhancement requests through proper channels

---

_Last Updated: August 5, 2025_
_API Version: 1.0_
