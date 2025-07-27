# Content Module API Requirements

## 🎯 Project Summary

The Content module requires comprehensive API endpoints to support content management, planning, SEO analysis, and AI-powered content generation. This document outlines all missing APIs needed for full functionality.

## ✅ Currently Available Content APIs

### Existing APIs in seoService:

1. `getContentPerformance(projectId, params)` - Content performance analytics
2. `getContentAnalytics(projectId, contentId)` - Detailed content analytics
3. `getContentCalendar(projectId, params)` - Content calendar data
4. `scheduleContent(projectId, data)` - Schedule content publication
5. `getContentIdeas(projectId, params)` - Content idea generation
6. `generateContentBrief(projectId, data)` - AI content brief generation
7. `analyzeContentSEO(projectId, contentId)` - SEO analysis for content
8. `checkContentReadability(projectId, contentId)` - Readability analysis
9. `getContentSuggestions(projectId)` - Content improvement suggestions

## 🔧 Missing Content APIs - Required for Full Functionality

### 1. Content CRUD Operations

```typescript
// GET /api/v1/content/{projectId}/items
interface GetContentItemsRequest {
  projectId: string;
  status?: "all" | "draft" | "published" | "scheduled" | "archived";
  type?: "all" | "post" | "page" | "landing-page" | "product";
  category?: string;
  search?: string;
  author?: string;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "title" | "wordCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "published" | "scheduled" | "archived";
  type: "post" | "page" | "landing-page" | "product";
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  categories: string[];
  tags: string[];
  seoData: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    seoScore?: number;
    readabilityScore?: number;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  readingTime: number;
  featuredImage?: string;
  projectId: string;
}

// POST /api/v1/content/{projectId}/items
interface CreateContentRequest {
  title: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published" | "scheduled";
  type: "post" | "page" | "landing-page" | "product";
  categories: string[];
  tags: string[];
  seoData?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
  publishedAt?: string;
  featuredImage?: string;
}

// PUT /api/v1/content/{projectId}/items/{contentId}
interface UpdateContentRequest extends CreateContentRequest {
  id: string;
}

// DELETE /api/v1/content/{projectId}/items/{contentId}
interface DeleteContentRequest {
  projectId: string;
  contentId: string;
}
```

### 2. Content Categories Management

```typescript
// GET /api/v1/content/{projectId}/categories
interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  parentId?: string;
  color?: string;
}

// POST /api/v1/content/{projectId}/categories
interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
}

// PUT /api/v1/content/{projectId}/categories/{categoryId}
interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: string;
}

// DELETE /api/v1/content/{projectId}/categories/{categoryId}
```

### 3. Content Planning & Calendar

```typescript
// GET /api/v1/content/{projectId}/calendar/items
interface ContentCalendarItem {
  id: string;
  title: string;
  type:
    | "blog-post"
    | "social-media"
    | "email"
    | "landing-page"
    | "video"
    | "infographic";
  status: "planned" | "in-progress" | "review" | "published" | "archived";
  priority: "high" | "medium" | "low";
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
  targetKeywords: string[];
  estimatedWordCount: number;
  actualWordCount?: number;
  brief: string;
  notes: string;
  tags: string[];
  seoScore?: number;
  readabilityScore?: number;
  performance?: {
    views: number;
    shares: number;
    engagement: number;
  };
}

interface ContentCalendarMetrics {
  planned: number;
  published: number;
  draft: number;
  overdue: number;
}

// PUT /api/v1/content/{projectId}/calendar/items/{itemId}
interface UpdateCalendarItemRequest extends Partial<ContentCalendarItem> {
  id: string;
}

// POST /api/v1/content/{projectId}/calendar/bulk-update
interface BulkUpdateCalendarRequest {
  items: Array<{
    id: string;
    status?: string;
    publishDate?: string;
    priority?: string;
  }>;
}
```

### 4. AI Content Generation

```typescript
// POST /api/v1/content/{projectId}/ai/generate
interface AIContentGenerationRequest {
  type: "blog-post" | "social-media" | "email" | "meta-description" | "title";
  topic: string;
  targetKeywords: string[];
  tone:
    | "professional"
    | "casual"
    | "friendly"
    | "authoritative"
    | "conversational";
  length: "short" | "medium" | "long";
  language: string;
  audience?: string;
  additionalInstructions?: string;
}

interface GeneratedContent {
  id: string;
  type: string;
  content: string;
  title?: string;
  metaDescription?: string;
  suggestions: string[];
  seoScore: number;
  readabilityScore: number;
  keywordDensity: Array<{
    keyword: string;
    count: number;
    density: number;
  }>;
}

// POST /api/v1/content/{projectId}/ai/optimize
interface ContentOptimizationRequest {
  contentId?: string;
  content: string;
  targetKeywords: string[];
  optimizationType: "seo" | "readability" | "engagement" | "conversion";
}

// POST /api/v1/content/{projectId}/ai/rewrite
interface ContentRewriteRequest {
  content: string;
  tone?: string;
  length?: "shorter" | "longer" | "same";
  style?: "formal" | "casual" | "creative" | "technical";
}
```

### 5. Content SEO & Analysis

```typescript
// POST /api/v1/content/{projectId}/seo/bulk-analyze
interface BulkSEOAnalysisRequest {
  contentIds: string[];
  analysisType: "basic" | "comprehensive" | "competitive";
}

interface SEOAnalysisResult {
  contentId: string;
  overallScore: number;
  titleOptimization: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  metaOptimization: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  contentOptimization: {
    score: number;
    keywordDensity: number;
    readabilityScore: number;
    wordCount: number;
    issues: string[];
    suggestions: string[];
  };
  technicalSEO: {
    score: number;
    imageOptimization: number;
    internalLinks: number;
    externalLinks: number;
    issues: string[];
  };
}

// GET /api/v1/content/{projectId}/seo/competitive-analysis
interface CompetitiveContentRequest {
  keyword: string;
  competitors: string[];
  contentType?: string;
}

interface CompetitiveAnalysis {
  keyword: string;
  topPerformingContent: Array<{
    url: string;
    title: string;
    wordCount: number;
    seoScore: number;
    socialShares: number;
    backlinks: number;
    keywordOptimization: string[];
  }>;
  contentGaps: string[];
  recommendations: string[];
}
```

### 6. Content Templates & Workflows

```typescript
// GET /api/v1/content/{projectId}/templates
interface ContentTemplate {
  id: string;
  name: string;
  type: "blog-post" | "landing-page" | "email" | "social-media";
  template: string;
  variables: Array<{
    name: string;
    type: "text" | "keyword" | "date" | "number";
    required: boolean;
  }>;
  seoGuidelines: string[];
  wordCountRange: {
    min: number;
    max: number;
  };
}

// POST /api/v1/content/{projectId}/templates
interface CreateTemplateRequest {
  name: string;
  type: string;
  template: string;
  variables: any[];
  seoGuidelines: string[];
}

// GET /api/v1/content/{projectId}/workflows
interface ContentWorkflow {
  id: string;
  name: string;
  stages: Array<{
    id: string;
    name: string;
    assignee?: string;
    estimatedDuration: number;
    requirements: string[];
  }>;
  triggers: Array<{
    event: string;
    action: string;
  }>;
}
```

### 7. Content Performance & Analytics

```typescript
// GET /api/v1/content/{projectId}/analytics/performance
interface ContentPerformanceRequest {
  period: string; // "7d", "30d", "90d", "custom"
  startDate?: string;
  endDate?: string;
  contentIds?: string[];
  groupBy?: "day" | "week" | "month";
}

interface ContentPerformanceAnalytics {
  period: string;
  totalViews: number;
  totalShares: number;
  totalEngagement: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  topPerformingContent: Array<{
    contentId: string;
    title: string;
    views: number;
    shares: number;
    engagement: number;
    conversionRate: number;
  }>;
  performanceTrends: Array<{
    date: string;
    views: number;
    shares: number;
    engagement: number;
  }>;
}

// GET /api/v1/content/{projectId}/analytics/roi
interface ContentROIRequest {
  period: string;
  contentIds?: string[];
}

interface ContentROI {
  totalInvestment: number;
  totalRevenue: number;
  roi: number;
  costPerLead: number;
  costPerAcquisition: number;
  contentBreakdown: Array<{
    contentId: string;
    title: string;
    investment: number;
    revenue: number;
    roi: number;
    leads: number;
    conversions: number;
  }>;
}
```

### 8. Content Collaboration & Approval

```typescript
// GET /api/v1/content/{projectId}/collaboration/comments
interface ContentComment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  comment: string;
  position?: {
    start: number;
    end: number;
  };
  status: "open" | "resolved";
  createdAt: string;
  replies: ContentComment[];
}

// POST /api/v1/content/{projectId}/collaboration/comments
interface CreateCommentRequest {
  contentId: string;
  comment: string;
  position?: {
    start: number;
    end: number;
  };
}

// PUT /api/v1/content/{projectId}/approval/{contentId}
interface ContentApprovalRequest {
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  approverNotes?: string;
}

interface ApprovalWorkflow {
  id: string;
  contentId: string;
  stages: Array<{
    id: string;
    name: string;
    approver: string;
    status: "pending" | "approved" | "rejected";
    completedAt?: string;
    feedback?: string;
  }>;
  currentStage: string;
  overallStatus: "pending" | "approved" | "rejected";
}
```

## 🎯 Implementation Priority

### Phase 1 (Critical - Core Functionality)

1. **Content CRUD Operations** - Create, read, update, delete content items
2. **Content Calendar Management** - Planning and scheduling interface
3. **Basic SEO Analysis** - Title, meta, keyword optimization
4. **Content Categories** - Organization and filtering

### Phase 2 (Important - Enhanced Features)

1. **AI Content Generation** - Automated content creation
2. **Content Templates** - Reusable content structures
3. **Performance Analytics** - Content effectiveness metrics
4. **Bulk Operations** - Mass content management

### Phase 3 (Advanced - Collaboration & Optimization)

1. **Content Workflows** - Approval and collaboration processes
2. **Competitive Analysis** - Content gap identification
3. **Advanced SEO Analysis** - Comprehensive optimization
4. **ROI Analytics** - Revenue attribution and tracking

### Phase 4 (Premium - AI & Automation)

1. **Content Optimization AI** - Automated improvements
2. **Content Personalization** - Audience-specific content
3. **Automated Workflows** - Smart content processes
4. **Predictive Analytics** - Content performance forecasting

## 🔗 Integration Points

### Required Integrations:

1. **Project Management** - Link content to projects
2. **User Management** - Author and collaboration permissions
3. **SEO Tools** - Keyword and optimization data
4. **Analytics Platforms** - Performance data collection
5. **AI Services** - Content generation and optimization
6. **File Storage** - Media and asset management

## 📋 API Standards

### Authentication:

- Bearer token authentication
- Project-based permissions
- Role-based access control

### Response Format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Error Handling:

- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for validation

---

**Status**: Content Module APIs - Comprehensive requirements documented for backend implementation.
