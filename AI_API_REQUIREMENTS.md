# AI Module API Requirements

## 📋 Overview

This document outlines the comprehensive API requirements for the AI Tools Management module. The module has been converted from mock data to API integration, utilizing existing seoService methods where available and documenting missing APIs for backend implementation.

## ✅ Currently Available & Integrated APIs

### 1. Content Generation APIs

```typescript
// ✅ IMPLEMENTED
generateContent(data: ContentGenerationRequest): Promise<GeneratedContent>
rewriteContent(data: { content: string; style?: string; tone?: string }): Promise<GeneratedContent>
expandContent(data: { content: string; targetLength: number }): Promise<GeneratedContent>
generateMeta(data: { content: string; targetKeywords?: string[] }): Promise<{ title: string; description: string; }>
```

### 2. AI SEO Analysis APIs

```typescript
// ✅ IMPLEMENTED
aiAnalyzePage(data: { url: string; targetKeywords?: string[] }): Promise<AISEOAnalysis>
aiOptimizeContent(data: { content: string; targetKeywords: string[] }): Promise<any>
```

### 3. AI Keyword Research APIs

```typescript
// ✅ IMPLEMENTED
aiKeywordSuggestions(data: { seedKeyword: string; industry?: string; location?: string }): Promise<any[]>
aiContentGap(data: { competitors: string[]; topic: string }): Promise<any>
```

---

## 🔧 Required API Implementations

### 1. AI Request Management APIs

#### Get AI Request History

```typescript
GET /ai/requests
Query Parameters:
- projectId: string
- page: number (default: 1)
- limit: number (default: 10)
- status?: 'pending' | 'processing' | 'completed' | 'failed'
- toolId?: string
- dateFrom?: string (ISO date)
- dateTo?: string (ISO date)

Response: {
  data: AiRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

#### Get Single AI Request

```typescript
GET / ai / requests / { requestId };
Response: AiRequest;
```

#### Create AI Request

```typescript
POST /ai/requests
Body: {
  projectId: string;
  toolId: string;
  input: any;
  metadata?: any;
}
Response: AiRequest
```

#### Update AI Request Status

```typescript
PATCH /ai/requests/{requestId}
Body: {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string;
  tokens?: number;
  cost?: number;
  completedAt?: string;
}
Response: AiRequest
```

### 2. AI Tools Management APIs

#### Get Available AI Tools

```typescript
GET /ai/tools
Query Parameters:
- category?: 'content' | 'seo' | 'analysis' | 'research' | 'optimization'
- isActive?: boolean
- userId?: string (for usage tracking)

Response: AiTool[]
```

#### Get Tool Usage Statistics

```typescript
GET /ai/tools/{toolId}/usage
Query Parameters:
- projectId?: string
- userId?: string
- period?: 'day' | 'week' | 'month' | 'year'

Response: {
  toolId: string;
  totalUsage: number;
  remainingUsage: number;
  usageLimit: number;
  currentPeriodUsage: number;
  costThisPeriod: number;
}
```

#### Update Tool Usage

```typescript
POST / ai / tools / { toolId } / usage;
Body: {
  projectId: string;
  userId: string;
  tokens: number;
  cost: number;
  requestId: string;
}
Response: {
  success: boolean;
}
```

### 3. Advanced Content Generation APIs

#### Generate Blog Post Outline

```typescript
POST /ai/content/blog-outline
Body: {
  projectId: string;
  topic: string;
  targetKeywords: string[];
  targetAudience: string;
  wordCount: number;
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative';
}
Response: {
  outline: {
    sections: {
      title: string;
      description: string;
      estimatedWords: number;
      keyPoints: string[];
    }[];
  };
  suggestedImages: string[];
  internalLinkOpportunities: string[];
}
```

#### Generate Product Descriptions

```typescript
POST /ai/content/product-description
Body: {
  projectId: string;
  productName: string;
  features: string[];
  benefits: string[];
  targetAudience: string;
  tone: string;
  length: 'short' | 'medium' | 'long';
}
Response: {
  descriptions: string[];
  bulletPoints: string[];
  callToActions: string[];
}
```

#### Generate Social Media Content

```typescript
POST /ai/content/social-media
Body: {
  projectId: string;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
  contentType: 'post' | 'caption' | 'story' | 'ad';
  topic: string;
  tone: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
}
Response: {
  content: string;
  hashtags: string[];
  alternativeVersions: string[];
}
```

### 4. Advanced SEO Analysis APIs

#### Competitor Content Analysis

```typescript
POST /ai/seo/competitor-analysis
Body: {
  projectId: string;
  targetUrl: string;
  competitorUrls: string[];
  targetKeywords: string[];
}
Response: {
  contentGaps: {
    keyword: string;
    competitorCoverage: number;
    opportunity: 'high' | 'medium' | 'low';
    suggestedContent: string;
  }[];
  topicGaps: string[];
  structureRecommendations: string[];
}
```

#### Content Optimization Suggestions

```typescript
POST /ai/seo/optimize-suggestions
Body: {
  projectId: string;
  content: string;
  targetKeywords: string[];
  currentUrl?: string;
  targetAudience: string;
}
Response: {
  keywordDensity: {
    keyword: string;
    currentDensity: number;
    recommendedDensity: number;
    suggestions: string[];
  }[];
  readabilityIssues: string[];
  structureImprovements: string[];
  internalLinkSuggestions: string[];
}
```

#### Schema Markup Generation

```typescript
POST /ai/seo/schema-generation
Body: {
  projectId: string;
  contentType: 'article' | 'product' | 'service' | 'local-business';
  content: string;
  metadata: any;
}
Response: {
  schemaMarkup: string;
  implementationInstructions: string[];
}
```

### 5. Advanced Keyword Research APIs

#### Long-tail Keyword Discovery

```typescript
POST /ai/keywords/long-tail
Body: {
  projectId: string;
  seedKeywords: string[];
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  location?: string;
  language?: string;
}
Response: {
  keywords: {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    intent: string;
    relatedQuestions: string[];
  }[];
  topicClusters: {
    topic: string;
    keywords: string[];
    contentOpportunity: string;
  }[];
}
```

#### Question-based Keywords

```typescript
POST /ai/keywords/questions
Body: {
  projectId: string;
  topic: string;
  location?: string;
  language?: string;
}
Response: {
  questions: {
    question: string;
    searchVolume: number;
    difficulty: number;
    answerFormat: 'paragraph' | 'list' | 'table' | 'video';
  }[];
  featuredSnippetOpportunities: string[];
}
```

#### Seasonal Keyword Trends

```typescript
POST /ai/keywords/seasonal-trends
Body: {
  projectId: string;
  keywords: string[];
  industry: string;
  location?: string;
}
Response: {
  trends: {
    keyword: string;
    seasonality: {
      month: number;
      relativeInterest: number;
    }[];
    peakMonths: number[];
    contentCalendarSuggestions: {
      month: number;
      contentType: string;
      topics: string[];
    }[];
  }[];
}
```

### 6. AI Analytics & Reporting APIs

#### Content Performance Prediction

```typescript
POST /ai/analytics/content-prediction
Body: {
  projectId: string;
  content: string;
  targetKeywords: string[];
  publishDate: string;
  contentType: string;
}
Response: {
  predictedMetrics: {
    estimatedTraffic: number;
    estimatedEngagement: number;
    estimatedConversions: number;
    confidenceScore: number;
  };
  improvementSuggestions: string[];
  competitorComparison: any;
}
```

#### AI Usage Analytics

```typescript
GET /ai/analytics/usage
Query Parameters:
- projectId: string
- period: 'day' | 'week' | 'month' | 'quarter' | 'year'
- userId?: string

Response: {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensUsed: number;
  totalCost: number;
  toolUsageBreakdown: {
    toolId: string;
    toolName: string;
    requestCount: number;
    tokensUsed: number;
    cost: number;
  }[];
  dailyUsage: {
    date: string;
    requests: number;
    tokens: number;
    cost: number;
  }[];
}
```

#### ROI Analysis

```typescript
GET /ai/analytics/roi
Query Parameters:
- projectId: string
- period: string

Response: {
  timeSaved: number; // in hours
  contentProduced: number; // number of pieces
  estimatedManualCost: number;
  actualAiCost: number;
  savings: number;
  qualityScore: number;
  userSatisfactionScore: number;
}
```

### 7. AI Template & Workflow APIs

#### Save AI Template

```typescript
POST / ai / templates;
Body: {
  projectId: string;
  name: string;
  description: string;
  toolId: string;
  parameters: any;
  isShared: boolean;
}
Response: AITemplate;
```

#### Get AI Templates

```typescript
GET /ai/templates
Query Parameters:
- projectId?: string
- toolId?: string
- isShared?: boolean

Response: AITemplate[]
```

#### Create AI Workflow

```typescript
POST / ai / workflows;
Body: {
  projectId: string;
  name: string;
  description: string;
  steps: {
    toolId: string;
    parameters: any;
    order: number;
  }
  [];
}
Response: AIWorkflow;
```

#### Execute AI Workflow

```typescript
POST /ai/workflows/{workflowId}/execute
Body: {
  projectId: string;
  initialInput: any;
}
Response: {
  workflowExecutionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: {
    stepId: string;
    status: string;
    output?: any;
  }[];
}
```

---

## 📊 Data Models

### AiRequest Interface

```typescript
interface AiRequest {
  id: string;
  toolId: string;
  toolName: string;
  input: string;
  output?: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  tokens?: number;
  cost?: number;
  projectId?: string;
  userId?: string;
  metadata?: any;
}
```

### AiTool Interface

```typescript
interface AiTool {
  id: string;
  name: string;
  description: string;
  category: "content" | "seo" | "analysis" | "research" | "optimization";
  icon: string;
  isActive: boolean;
  isPremium: boolean;
  usageCount: number;
  maxUsage?: number;
  features: string[];
  costPerRequest?: number;
  averageTokens?: number;
}
```

### AITemplate Interface

```typescript
interface AITemplate {
  id: string;
  projectId: string;
  name: string;
  description: string;
  toolId: string;
  parameters: any;
  isShared: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}
```

### AIWorkflow Interface

```typescript
interface AIWorkflow {
  id: string;
  projectId: string;
  name: string;
  description: string;
  steps: {
    id: string;
    toolId: string;
    parameters: any;
    order: number;
    dependsOn?: string[];
  }[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}
```

---

## 🔐 Authentication & Rate Limiting

### Authentication

- All AI endpoints require valid JWT authentication
- Project-level access control for AI resources
- Usage tracking per user and project

### Rate Limiting

```typescript
// Suggested rate limits per user/project
- Content Generation: 100 requests/hour, 1000 requests/day
- SEO Analysis: 50 requests/hour, 500 requests/day
- Keyword Research: 200 requests/hour, 2000 requests/day
- Analytics: 1000 requests/hour (read-only)
```

### Usage Quotas

```typescript
// Suggested usage quotas per subscription tier
Free Tier:
- 10 AI requests/month
- Basic tools only
- No workflow automation

Pro Tier:
- 500 AI requests/month
- All tools available
- Basic workflow automation

Enterprise Tier:
- Unlimited AI requests
- Custom tools and workflows
- Advanced analytics and reporting
```

---

## 🚀 Implementation Priority

### Phase 1 (High Priority)

1. AI Request Management APIs
2. AI Tools Usage Tracking
3. Basic Content Generation Enhancement
4. SEO Analysis Enhancement

### Phase 2 (Medium Priority)

1. Advanced Keyword Research APIs
2. Content Optimization Suggestions
3. AI Analytics & Reporting
4. Template System

### Phase 3 (Future Enhancement)

1. AI Workflow System
2. Advanced Competitor Analysis
3. Content Performance Prediction
4. Custom AI Model Integration

---

## 🧪 Testing Requirements

### Unit Tests

- API endpoint response validation
- Error handling and rate limiting
- Authentication and authorization
- Data model validation

### Integration Tests

- End-to-end AI request workflow
- Multi-tool workflow execution
- Usage tracking and billing
- Performance under load

### User Acceptance Tests

- Content quality assessment
- SEO suggestion accuracy
- Keyword research relevance
- User interface usability

---

This comprehensive API specification ensures the AI module can evolve from its current basic implementation to a full-featured AI-powered content and SEO optimization platform.
