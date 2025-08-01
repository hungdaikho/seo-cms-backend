# SEO CMS Backend - API Overview

## Authentication APIs

**Base URL:** `/auth`

| Method | URL              | Payload                              | Response                        |
| ------ | ---------------- | ------------------------------------ | ------------------------------- |
| POST   | `/auth/register` | `{ email, password, name, website }` | `{ user, token, subscription }` |
| POST   | `/auth/login`    | `{ email, password }`                | `{ user, token, subscription }` |

## Project Management APIs

**Base URL:** `/projects`

| Method | URL                   | Payload                             | Response                              |
| ------ | --------------------- | ----------------------------------- | ------------------------------------- |
| POST   | `/projects`           | `{ name, website, description }`    | `{ id, name, website, ... }`          |
| GET    | `/projects`           | Query: `{ page, limit }`            | `{ data: [projects], total, page }`   |
| GET    | `/projects/:id`       | -                                   | `{ id, name, website, stats, ... }`   |
| PATCH  | `/projects/:id`       | `{ name?, website?, description? }` | `{ id, name, website, ... }`          |
| DELETE | `/projects/:id`       | -                                   | `{ message: "Project deleted" }`      |
| GET    | `/projects/:id/stats` | -                                   | `{ keywords, audits, rankings, ... }` |

## Keywords Management APIs

**Base URL:** `/projects/:projectId/keywords` & `/keywords`

| Method | URL                                  | Payload                             | Response                              |
| ------ | ------------------------------------ | ----------------------------------- | ------------------------------------- |
| POST   | `/projects/:projectId/keywords`      | `{ keyword, country, location }`    | `{ id, keyword, volume, ... }`        |
| POST   | `/projects/:projectId/keywords/bulk` | `{ keywords: [string] }`            | `{ created: [keywords], errors: [] }` |
| GET    | `/projects/:projectId/keywords`      | Query: `{ page, limit }`            | `{ data: [keywords], total }`         |
| PATCH  | `/keywords/:id`                      | `{ keyword?, country?, location? }` | `{ id, keyword, volume, ... }`        |
| DELETE | `/keywords/:id`                      | -                                   | `{ message: "Keyword deleted" }`      |
| GET    | `/keywords/:id/rankings`             | Query: `{ days }`                   | `{ data: [rankings], period }`        |

## SEO Audits APIs

**Base URL:** `/projects/:projectId/audits`

| Method | URL                                         | Payload                            | Response                           |
| ------ | ------------------------------------------- | ---------------------------------- | ---------------------------------- |
| POST   | `/projects/:projectId/audits`               | `{ audit_type, pages, max_depth }` | `{ id, status, audit_type, ... }`  |
| POST   | `/projects/:projectId/audits/comprehensive` | `{ url, options }`                 | `{ id, status, started_at, ... }`  |
| GET    | `/projects/:projectId/audits`               | Query: `{ page, limit }`           | `{ data: [audits], total }`        |
| GET    | `/projects/:projectId/audits/summary`       | -                                  | `{ total_audits, avg_score, ... }` |
| GET    | `/projects/:projectId/audits/history`       | Query: `{ page, limit }`           | `{ data: [audits], total }`        |

## AI Tools APIs

**Base URL:** `/ai`

### Basic AI Operations

| Method | URL                        | Payload                           | Response                               |
| ------ | -------------------------- | --------------------------------- | -------------------------------------- |
| POST   | `/ai/keyword-research`     | `{ topic, country, language }`    | `{ keywords: [keyword], suggestions }` |
| POST   | `/ai/content-optimization` | `{ content, keywords, language }` | `{ optimized_content, suggestions }`   |
| POST   | `/ai/meta-generation`      | `{ content, keywords, language }` | `{ title, description, keywords }`     |
| POST   | `/ai/content-ideas`        | `{ topic, industry, audience }`   | `{ ideas: [idea], topics }`            |
| POST   | `/ai/competitor-analysis`  | `{ competitors, keywords }`       | `{ analysis, insights, gaps }`         |
| POST   | `/ai/seo-audit`            | `{ url, focus_keywords }`         | `{ score, issues, recommendations }`   |

### Advanced Content Generation

| Method | URL                               | Payload                                | Response                              |
| ------ | --------------------------------- | -------------------------------------- | ------------------------------------- |
| POST   | `/ai/content/blog-outline`        | `{ topic, keywords, audience }`        | `{ outline, sections, meta }`         |
| POST   | `/ai/content/product-description` | `{ product_name, features, specs }`    | `{ description, benefits, seo_text }` |
| POST   | `/ai/content/social-media`        | `{ content, platform, tone }`          | `{ posts: [post], hashtags }`         |
| POST   | `/ai/content/rewrite`             | `{ content, tone, purpose }`           | `{ rewritten_content, changes }`      |
| POST   | `/ai/content/expand`              | `{ content, keywords, target_length }` | `{ expanded_content, additions }`     |

### Advanced SEO Analysis

| Method | URL                                   | Payload                      | Response                             |
| ------ | ------------------------------------- | ---------------------------- | ------------------------------------ |
| POST   | `/ai/seo/competitor-content-analysis` | `{ competitors, keywords }`  | `{ content_gaps, opportunities }`    |
| POST   | `/ai/seo/optimization-suggestions`    | `{ content, url, keywords }` | `{ suggestions, priority, impact }`  |
| POST   | `/ai/seo/schema-generation`           | `{ content, page_type }`     | `{ schema_markup, structured_data }` |

### Advanced Keyword Research

| Method | URL                            | Payload                             | Response                             |
| ------ | ------------------------------ | ----------------------------------- | ------------------------------------ |
| POST   | `/ai/keywords/long-tail`       | `{ seed_keywords, niche }`          | `{ long_tail_keywords, difficulty }` |
| POST   | `/ai/keywords/questions`       | `{ topic, audience }`               | `{ question_keywords, intent }`      |
| POST   | `/ai/keywords/seasonal-trends` | `{ keywords, timeframe }`           | `{ trends, seasonal_data }`          |
| POST   | `/ai/keywords/magic-tool`      | `{ seedKeyword, filters, options }` | `{ comprehensive_keyword_analysis }` |

### AI Management

| Method | URL                                 | Payload                           | Response                         |
| ------ | ----------------------------------- | --------------------------------- | -------------------------------- |
| POST   | `/ai/request`                       | `{ type, parameters, projectId }` | `{ request_id, status, result }` |
| GET    | `/ai/requests`                      | Query: `{ projectId }`            | `{ data: [requests], total }`    |
| GET    | `/ai/requests/:id`                  | -                                 | `{ id, type, status, result }`   |
| GET    | `/ai/analytics`                     | Query: `{ projectId, period }`    | `{ usage, costs, performance }`  |
| GET    | `/ai/tools`                         | Query: `{ category, isActive }`   | `{ tools: [tool], categories }`  |
| GET    | `/ai/templates`                     | Query: `{ projectId, toolId }`    | `{ templates: [template] }`      |
| POST   | `/ai/templates`                     | `{ name, config, toolId }`        | `{ id, name, config, ... }`      |
| GET    | `/ai/workflows`                     | Query: `{ projectId }`            | `{ workflows: [workflow] }`      |
| POST   | `/ai/workflows`                     | `{ name, steps, config }`         | `{ id, name, steps, ... }`       |
| POST   | `/ai/workflows/:workflowId/execute` | `{ initialInput }`                | `{ execution_id, status }`       |

## Content Management APIs

**Base URL:** `/api/v1/projects/:projectId/content`

### Content CRUD

| Method | URL                 | Payload                                | Response                            |
| ------ | ------------------- | -------------------------------------- | ----------------------------------- |
| POST   | `/items`            | `{ title, content, type, status }`     | `{ id, title, content, ... }`       |
| GET    | `/items`            | Query: `{ page, limit, status, type }` | `{ data: [content], total }`        |
| GET    | `/items/:contentId` | -                                      | `{ id, title, content, meta, ... }` |
| PUT    | `/items/:contentId` | `{ title?, content?, status? }`        | `{ id, title, content, ... }`       |
| DELETE | `/items/:contentId` | -                                      | `{ message: "Content deleted" }`    |

### Content Categories

| Method | URL                       | Payload                            | Response                          |
| ------ | ------------------------- | ---------------------------------- | --------------------------------- |
| POST   | `/categories`             | `{ name, description, parent_id }` | `{ id, name, description, ... }`  |
| GET    | `/categories`             | -                                  | `{ categories: [category] }`      |
| PUT    | `/categories/:categoryId` | `{ name?, description? }`          | `{ id, name, description, ... }`  |
| DELETE | `/categories/:categoryId` | -                                  | `{ message: "Category deleted" }` |

### Content Calendar

| Method | URL                       | Payload                             | Response                       |
| ------ | ------------------------- | ----------------------------------- | ------------------------------ |
| POST   | `/calendar/items`         | `{ title, date, type, content_id }` | `{ id, title, date, ... }`     |
| GET    | `/calendar/items`         | Query: `{ start_date, end_date }`   | `{ data: [calendar_items] }`   |
| PUT    | `/calendar/items/:itemId` | `{ title?, date?, status? }`        | `{ id, title, date, ... }`     |
| POST   | `/calendar/bulk-update`   | `{ items: [update] }`               | `{ updated: [items], errors }` |

### Content Analytics

| Method | URL                      | Payload                      | Response                             |
| ------ | ------------------------ | ---------------------------- | ------------------------------------ |
| GET    | `/analytics/performance` | Query: `{ period, metrics }` | `{ views, engagement, conversions }` |
| GET    | `/analytics/roi`         | Query: `{ period }`          | `{ revenue, costs, roi }`            |

### AI Content Features

| Method | URL            | Payload                           | Response                         |
| ------ | -------------- | --------------------------------- | -------------------------------- |
| POST   | `/ai/generate` | `{ type, topic, keywords, tone }` | `{ generated_content, meta }`    |
| POST   | `/ai/optimize` | `{ content_id, keywords }`        | `{ optimized_content, changes }` |
| POST   | `/ai/rewrite`  | `{ content_id, tone, purpose }`   | `{ rewritten_content, diff }`    |

### SEO Analysis

| Method | URL                         | Payload                  | Response                            |
| ------ | --------------------------- | ------------------------ | ----------------------------------- |
| POST   | `/seo/bulk-analyze`         | `{ content_ids: [id] }`  | `{ analysis: [result], scores }`    |
| GET    | `/seo/competitive-analysis` | Query: `{ competitors }` | `{ gaps, opportunities, insights }` |

### Collaboration

| Method | URL                                  | Payload                              | Response                       |
| ------ | ------------------------------------ | ------------------------------------ | ------------------------------ |
| POST   | `/collaboration/comments`            | `{ content_id, comment, parent_id }` | `{ id, comment, author, ... }` |
| GET    | `/collaboration/comments/:contentId` | -                                    | `{ comments: [comment] }`      |
| PUT    | `/approval/:contentId`               | `{ action, feedback }`               | `{ status, feedback }`         |

### Templates

| Method | URL                      | Payload                       | Response                          |
| ------ | ------------------------ | ----------------------------- | --------------------------------- |
| POST   | `/templates`             | `{ name, structure, fields }` | `{ id, name, structure, ... }`    |
| GET    | `/templates`             | -                             | `{ templates: [template] }`       |
| PUT    | `/templates/:templateId` | `{ name?, structure? }`       | `{ id, name, structure, ... }`    |
| DELETE | `/templates/:templateId` | -                             | `{ message: "Template deleted" }` |

## Topic Research APIs

**Base URL:** `/api/v1/seo/topic-research`

| Method | URL                 | Payload                               | Response                                 |
| ------ | ------------------- | ------------------------------------- | ---------------------------------------- |
| POST   | `/ideas`            | `{ keyword, industry, audience }`     | `{ ideas: [topic], volume, difficulty }` |
| GET    | `/related/:topic`   | Query: `{ limit, country }`           | `{ related_topics: [topic] }`            |
| GET    | `/questions/:topic` | Query: `{ limit, country }`           | `{ questions: [question] }`              |
| POST   | `/batch-analysis`   | `{ topics: [topic], country }`        | `{ analysis: [result] }`                 |
| GET    | `/trending-topics`  | Query: `{ category, country, limit }` | `{ trending: [topic] }`                  |

## Domain Analysis APIs

**Base URL:** `/api/v1/seo/domain-overview`

| Method | URL                     | Payload                        | Response                               |
| ------ | ----------------------- | ------------------------------ | -------------------------------------- |
| GET    | `/:domain`              | Query: `{ includeSubdomains }` | `{ domain, authority, traffic, ... }`  |
| GET    | `/top-keywords/:domain` | Query: `{ limit, country }`    | `{ keywords: [keyword], total }`       |
| GET    | `/competitors/:domain`  | Query: `{ limit, country }`    | `{ competitors: [competitor], total }` |
| GET    | `/topics/:domain`       | Query: `{ limit }`             | `{ topics: [topic], total }`           |
| GET    | `/authority/:domain`    | -                              | `{ moz, ahrefs, semrush }`             |

## Organic Research APIs

**Base URL:** `/api/v1/seo/organic-research`

| Method | URL                    | Payload                             | Response                             |
| ------ | ---------------------- | ----------------------------------- | ------------------------------------ |
| GET    | `/domain/:domain`      | Query: `{ country, database }`      | `{ domain, keywords, traffic, ... }` |
| GET    | `/keywords/:domain`    | Query: `{ country, limit, sortBy }` | `{ keywords: [keyword], total }`     |
| GET    | `/competitors/:domain` | Query: `{ country, limit }`         | `{ competitors: [domain], overlap }` |
| GET    | `/top-pages/:domain`   | Query: `{ country, limit, sortBy }` | `{ pages: [page], traffic }`         |
| GET    | `/api-limits`          | -                                   | `{ semrush: {}, ahrefs: {}, ... }`   |

## Integrations APIs

**Base URL:** `/integrations`

| Method | URL                      | Payload                       | Response                             |
| ------ | ------------------------ | ----------------------------- | ------------------------------------ |
| POST   | `/`                      | `{ platform, credentials }`   | `{ id, platform, status, ... }`      |
| GET    | `/`                      | -                             | `{ integrations: [integration] }`    |
| GET    | `/auth/google`           | -                             | `{ auth_url, state }`                |
| POST   | `/google/search-console` | `{ auth_code, site_url }`     | `{ id, platform, connected_at }`     |
| POST   | `/google/analytics`      | `{ auth_code, property_id }`  | `{ id, platform, connected_at }`     |
| GET    | `/:id`                   | -                             | `{ id, platform, status, data }`     |
| PUT    | `/:id`                   | `{ credentials?, settings? }` | `{ id, platform, status, ... }`      |
| DELETE | `/:id`                   | -                             | `{ message: "Integration deleted" }` |

## Reports APIs

**Base URL:** `/reports`

| Method | URL         | Payload                             | Response                           |
| ------ | ----------- | ----------------------------------- | ---------------------------------- |
| POST   | `/`         | `{ name, type, filters, schedule }` | `{ id, name, type, ... }`          |
| POST   | `/generate` | `{ type, data_sources, filters }`   | `{ id, generated_at, data, ... }`  |
| GET    | `/`         | Query: `{ projectId }`              | `{ data: [report], total }`        |
| GET    | `/:id`      | -                                   | `{ id, name, data, generated_at }` |
| DELETE | `/:id`      | -                                   | `{ message: "Report deleted" }`    |

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

### Pagination Response

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Authentication

Tất cả API (trừ auth) yêu cầu Bearer Token trong header:

```
Authorization: Bearer <jwt_token>
```

## Query Parameters

- `page`: Số trang (mặc định: 1)
- `limit`: Số item per page (mặc định: 20)
- `projectId`: ID dự án (cho filter)
- `country`: Mã quốc gia (mặc định: 'US')
- `language`: Mã ngôn ngữ (mặc định: 'en')
