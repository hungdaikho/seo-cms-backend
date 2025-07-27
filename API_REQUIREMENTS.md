# API Requirements for SEO CMS Platform

## 📊 Current API Assessment

### ✅ **Already Implemented APIs**

Based on current codebase analysis:

1. **Authentication APIs**
   - Login/Register
   - Profile management
   - Usage stats
   - Notifications

2. **Project Management APIs**
   - CRUD operations for projects
   - Project stats
   - Project settings

3. **Keyword Management APIs**
   - Add/Update/Delete keywords
   - Bulk keyword operations
   - Keyword ranking history
   - Keyword tracking

4. **Audit APIs**
   - Create/Get audit results
   - Basic audit functionality

5. **Competitor Management APIs** ✅ **NEWLY IMPLEMENTED**
   - Add/Update/Delete competitors to projects
   - Get project competitors with pagination
   - Competitor ownership verification

6. **Ranking History APIs** ✅ **NEWLY IMPLEMENTED**
   - Add ranking records for keywords
   - Get keyword ranking history with trends
   - Project rankings overview with analytics

7. **Notification Management APIs** ✅ **NEWLY IMPLEMENTED**
   - Get user notifications with filtering
   - Mark notifications as read (single/all)
   - Delete notifications
   - System notification creation

8. **Backlink Management APIs** ✅ **NEWLY IMPLEMENTED**
   - Add/Update/Delete backlinks
   - Backlink analytics with authority distribution
   - Link type and domain authority tracking

9. **User Management APIs**
   - User profile CRUD
   - Subscription usage tracking
   - Basic notification endpoints (deprecated)

---

## 🚀 **Required Additional APIs**

### 0. **Enhanced Core APIs (Medium Priority)**

#### **Enhanced User Management APIs**

```typescript
// User settings and preferences
GET / api / users / settings;
PUT / api / users / settings;
GET / api / users / activity;
POST / api / users / change - password;
POST / api / users / upload - avatar;

interface UserSettings {
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reportFrequency: 'daily' | 'weekly' | 'monthly';
}
```

#### **Enhanced Subscription APIs**

```typescript
// Additional subscription endpoints
GET / api / subscriptions / usage / { usageType };
POST / api / subscriptions / usage / reset;
GET / api / subscriptions / invoices;
GET / api / subscriptions / invoices / { invoiceId } / download;

interface UsageDetails {
  usageType: UsageType;
  currentUsage: number;
  limitValue: number;
  resetDate: Date;
  percentageUsed: number;
}
```

#### **Project Analytics APIs**

```typescript
GET / api / projects / { projectId } / analytics / overview;
GET / api / projects / { projectId } / analytics / keywords;
GET / api / projects / { projectId } / analytics / rankings;
GET / api / projects / { projectId } / analytics / competitors;

interface ProjectAnalytics {
  keywordStats: {
    total: number;
    tracking: number;
    ranked: number;
    avgPosition: number;
  };
  rankingTrends: RankingTrend[];
  competitorComparison: CompetitorComparison[];
  auditSummary: AuditSummary;
}
```

### 1. **SEO Module Enhancements**

#### **Site Audit APIs**

```typescript
// Site audit comprehensive analysis
POST / api / projects / { projectId } / audits / site;
GET / api / projects / { projectId } / audits / site / { auditId };
GET / api / projects / { projectId } / audits / site / { auditId } / issues;
PUT /
  api /
  projects /
  { projectId } /
  audits /
  site /
  { auditId } /
  issues /
  { issueId } /
  resolve;

interface SiteAuditRequest {
  projectId: string;
  auditType: 'full' | 'technical' | 'content' | 'performance';
  settings: {
    crawlDepth: number;
    includeImages: boolean;
    checkMobileFriendly: boolean;
    analyzePageSpeed: boolean;
  };
}

interface SiteAuditResult {
  auditId: string;
  overview: {
    totalPages: number;
    errors: number;
    warnings: number;
    notices: number;
    overallScore: number;
  };
  issues: SiteIssue[];
  recommendations: Recommendation[];
  performance: PerformanceMetrics;
}
```

#### **Competitor Analysis APIs**

```typescript
POST / api / projects / { projectId } / competitors / analyze;
GET / api / projects / { projectId } / competitors;
POST / api / projects / { projectId } / competitors / compare;

interface CompetitorAnalysisRequest {
  competitors: string[]; // domains
  metrics: ('keywords' | 'backlinks' | 'content' | 'traffic')[];
  location?: string;
}

interface CompetitorData {
  domain: string;
  organicKeywords: number;
  organicTraffic: number;
  paidKeywords: number;
  backlinks: number;
  domainAuthority: number;
  topKeywords: CompetitorKeyword[];
  gapKeywords: GapKeyword[];
}
```

#### **Keyword Gap Analysis APIs**

```typescript
POST / api / projects / { projectId } / keywords / gap - analysis;
GET / api / projects / { projectId } / keywords / opportunities;

interface KeywordGapRequest {
  competitors: string[];
  filterBy: {
    difficulty?: [number, number];
    volume?: [number, number];
    intent?: (
      | 'informational'
      | 'navigational'
      | 'commercial'
      | 'transactional'
    )[];
  };
}

interface KeywordOpportunity {
  keyword: string;
  difficulty: number;
  volume: number;
  intent: string;
  competitorRankings: Record<string, number>;
  opportunity: 'easy-win' | 'content-gap' | 'quick-win' | 'long-term';
}
```

#### **Position Tracking APIs**

```typescript
POST / api / projects / { projectId } / tracking / setup;
GET / api / projects / { projectId } / tracking / overview;
GET / api / projects / { projectId } / tracking / rankings;
PUT / api / projects / { projectId } / tracking / settings;

interface TrackingSetup {
  keywords: string[];
  competitors: string[];
  searchEngines: ('google' | 'bing' | 'yahoo')[];
  locations: string[];
  devices: ('desktop' | 'mobile' | 'tablet')[];
  frequency: 'daily' | 'weekly' | 'monthly';
}
```

#### **Backlink Analysis APIs**

```typescript
GET / api / projects / { projectId } / backlinks;
POST / api / projects / { projectId } / backlinks / analyze;
GET / api / projects / { projectId } / backlinks / opportunities;
POST / api / projects / { projectId } / backlinks / disavow;

interface BacklinkProfile {
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  trustFlow: number;
  backlinks: Backlink[];
  toxicLinks: ToxicLink[];
  opportunities: BacklinkOpportunity[];
}
```

### 2. **Content Module Enhancements**

#### **Content Performance APIs**

```typescript
GET / api / projects / { projectId } / content / performance;
GET / api / projects / { projectId } / content / { contentId } / analytics;
POST / api / projects / { projectId } / content / optimize;

interface ContentPerformance {
  contentId: string;
  title: string;
  url: string;
  organicTraffic: number;
  averagePosition: number;
  clickThroughRate: number;
  impressions: number;
  engagementMetrics: {
    timeOnPage: number;
    bounceRate: number;
    socialShares: number;
  };
  seoScore: number;
  recommendations: ContentRecommendation[];
}
```

#### **Content Planning APIs**

```typescript
GET / api / projects / { projectId } / content / calendar;
POST / api / projects / { projectId } / content / schedule;
GET / api / projects / { projectId } / content / ideas;
POST / api / projects / { projectId } / content / brief / generate;

interface ContentCalendar {
  month: string;
  items: ContentCalendarItem[];
  metrics: {
    planned: number;
    published: number;
    draft: number;
    overdue: number;
  };
}

interface ContentBrief {
  title: string;
  targetKeywords: string[];
  contentType: string;
  wordCount: number;
  outline: string[];
  references: string[];
  seoGuidelines: string[];
}
```

#### **Content Optimization APIs**

```typescript
POST / api / projects / { projectId } / content / { contentId } / analyze - seo;
POST / api / projects / { projectId } / content / { contentId } / readability;
GET / api / projects / { projectId } / content / suggestions;

interface ContentSEOAnalysis {
  contentId: string;
  seoScore: number;
  titleOptimization: ScoreItem;
  metaDescription: ScoreItem;
  headingStructure: ScoreItem;
  keywordDensity: ScoreItem;
  internalLinking: ScoreItem;
  imageOptimization: ScoreItem;
  suggestions: string[];
}
```

### 3. **Traffic Module Enhancements**

#### **Advanced Traffic Analytics APIs**

```typescript
GET / api / projects / { projectId } / traffic / overview;
GET / api / projects / { projectId } / traffic / sources;
GET / api / projects / { projectId } / traffic / pages;
GET / api / projects / { projectId } / traffic / keywords;
GET / api / projects / { projectId } / traffic / demographics;

interface TrafficOverview {
  period: DateRange;
  totalSessions: number;
  totalUsers: number;
  organicSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversions: number;
  trends: TrafficTrend[];
}

interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  newUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
}
```

#### **Competitor Traffic Analysis APIs**

```typescript
GET / api / projects / { projectId } / traffic / competitors;
POST / api / projects / { projectId } / traffic / compare;
GET / api / projects / { projectId } / traffic / market - share;

interface CompetitorTraffic {
  domain: string;
  estimatedMonthlyVisits: number;
  trafficShare: number;
  topPages: CompetitorPage[];
  trafficSources: TrafficSourceBreakdown;
  audienceOverlap: number;
}
```

#### **Page Performance APIs**

```typescript
GET / api / projects / { projectId } / pages / performance;
GET / api / projects / { projectId } / pages / { pageId } / insights;
POST / api / projects / { projectId } / pages / speed - test;

interface PagePerformance {
  url: string;
  pageViews: number;
  uniquePageViews: number;
  avgTimeOnPage: number;
  exitRate: number;
  conversions: number;
  loadSpeed: {
    desktop: number;
    mobile: number;
  };
  coreWebVitals: CoreWebVitals;
}
```

### 4. **AI Module Enhancements**

#### **Content Generation APIs**

```typescript
POST / api / ai / content / generate;
POST / api / ai / content / rewrite;
POST / api / ai / content / expand;
POST / api / ai / meta / generate;

interface ContentGenerationRequest {
  projectId: string;
  type:
    | 'blog-post'
    | 'product-description'
    | 'meta-description'
    | 'social-post';
  topic: string;
  targetKeywords: string[];
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative';
  length: 'short' | 'medium' | 'long';
  audience: string;
  guidelines?: string[];
}

interface GeneratedContent {
  requestId: string;
  content: string;
  alternatives: string[];
  seoScore: number;
  readabilityScore: number;
  suggestions: string[];
  usageCredits: number;
}
```

#### **AI SEO Analysis APIs**

```typescript
POST / api / ai / seo / analyze - page;
POST / api / ai / seo / keyword - suggestions;
POST / api / ai / seo / content - gap;
POST / api / ai / seo / optimize - content;

interface AISEOAnalysis {
  url: string;
  overallScore: number;
  technicalSEO: AIScoreBreakdown;
  contentSEO: AIScoreBreakdown;
  userExperience: AIScoreBreakdown;
  recommendations: AISEORecommendation[];
  actionPlan: ActionItem[];
}
```

#### **Keyword Research APIs**

```typescript
POST / api / ai / keywords / research;
POST / api / ai / keywords / cluster;
POST / api / ai / keywords / intent - analysis;

interface AIKeywordResearch {
  seedKeyword: string;
  industry: string;
  location?: string;
  language: string;
  suggestions: KeywordSuggestion[];
  clusters: KeywordCluster[];
  trends: KeywordTrend[];
  questions: string[];
}
```

### 5. **Reporting & Analytics APIs**

#### **Custom Reports APIs**

```typescript
POST /api/projects/{projectId}/reports/create
GET /api/projects/{projectId}/reports
GET /api/projects/{projectId}/reports/{reportId}/export
PUT /api/projects/{projectId}/reports/{reportId}/schedule

interface CustomReport {
  reportId: string;
  name: string;
  type: 'ranking' | 'traffic' | 'content' | 'comprehensive';
  metrics: string[];
  filters: ReportFilters;
  schedule?: ReportSchedule;
  recipients: string[];
}
```

#### **Dashboard APIs**

```typescript
GET / api / projects / { projectId } / dashboard / overview;
GET / api / projects / { projectId } / dashboard / alerts;
POST / api / projects / { projectId } / dashboard / customize;

interface DashboardOverview {
  kpis: KPIMetric[];
  alerts: Alert[];
  recentActivity: Activity[];
  quickInsights: Insight[];
  competitorUpdates: CompetitorUpdate[];
}
```

### 6. **Integration APIs**

#### **Google Search Console Integration**

```typescript
POST / api / integrations / gsc / connect;
GET / api / integrations / gsc / data;
POST / api / integrations / gsc / sync;

interface GSCIntegration {
  projectId: string;
  property: string;
  syncedData: {
    queries: GSCQuery[];
    pages: GSCPage[];
    impressions: number;
    clicks: number;
    ctr: number;
    avgPosition: number;
  };
}
```

#### **Google Analytics Integration**

```typescript
POST / api / integrations / ga / connect;
GET / api / integrations / ga / data;
POST / api / integrations / ga / goals;

interface GAIntegration {
  projectId: string;
  propertyId: string;
  goals: Goal[];
  audiences: Audience[];
  ecommerceData?: EcommerceData;
}
```

### 7. **Backlink Management APIs** ✅ **IMPLEMENTED**

#### **Backlink APIs**

```typescript
✅ GET /api/projects/{projectId}/backlinks
✅ POST /api/projects/{projectId}/backlinks
✅ PUT /api/projects/{projectId}/backlinks/{backlinkId}
✅ DELETE /api/projects/{projectId}/backlinks/{backlinkId}
✅ GET /api/projects/{projectId}/backlinks/analytics

interface CreateBacklinkDto {
  sourceDomain: string;
  targetUrl: string;
  anchorText?: string;
  linkType?: 'follow' | 'nofollow';
  authorityScore?: number;
}

interface BacklinkAnalytics {
  totalBacklinks: number;
  totalDomains: number;
  averageAuthorityScore: number;
  followLinks: number;
  nofollowLinks: number;
  newBacklinks: BacklinkResponse[];
  lostBacklinks: BacklinkResponse[];
}
```

### 8. **Enhanced Analytics & Reporting APIs**

#### **Project Analytics APIs**

```typescript
GET / api / projects / { projectId } / analytics / overview;
GET / api / projects / { projectId } / analytics / keywords;
GET / api / projects / { projectId } / analytics / rankings;
GET / api / projects / { projectId } / analytics / competitors;

interface ProjectAnalytics {
  keywordStats: {
    total: number;
    tracking: number;
    ranked: number;
    avgPosition: number;
  };
  rankingTrends: RankingTrend[];
  competitorComparison: CompetitorComparison[];
  auditSummary: AuditSummary;
}
```

#### **Export & Import APIs**

```typescript
POST /api/projects/{projectId}/export
POST /api/projects/{projectId}/import
GET /api/projects/{projectId}/export/{exportId}/download

interface ExportRequest {
  dataTypes: ('keywords' | 'rankings' | 'audits' | 'backlinks')[];
  format: 'csv' | 'xlsx' | 'json';
  dateRange?: {
    start: Date;
    end: Date;
  };
}
```

### 9. **Bulk Operations APIs**

#### **Bulk Management APIs**

```typescript
POST /api/projects/{projectId}/keywords/bulk-update
POST /api/projects/{projectId}/keywords/bulk-delete
POST /api/projects/{projectId}/rankings/bulk-import
POST /api/projects/{projectId}/backlinks/bulk-import

interface BulkUpdateKeywordsDto {
  keywordIds: string[];
  updates: Partial<UpdateKeywordDto>;
}

interface BulkImportResponse {
  successCount: number;
  errorCount: number;
  errors: ImportError[];
  results: any[];
}
```

---

## 🔧 **Database Schema Enhancements**

### New Tables Required:

1. **site_audits** - Store comprehensive audit results ✅ (Exists as `audits`)
2. **competitors** - Track competitor data ✅ (Already exists)
3. **backlinks** - Store backlink profiles ✅ (Already exists)
4. **content_performance** - Track content metrics ❌ (Missing)
5. **traffic_data** - Store traffic analytics ❌ (Missing)
6. **ai_requests** - Track AI tool usage ❌ (Missing)
7. **reports** - Custom report configurations ❌ (Missing)
8. **integrations** - Third-party service connections ❌ (Missing)
9. **alerts** - User notification preferences ❌ (Missing)
10. **content_calendar** - Content planning data ❌ (Missing)

### Missing Database Tables to Add:

```prisma
model ContentPerformance {
  id                String   @id @default(uuid()) @db.Uuid
  projectId         String   @map("project_id") @db.Uuid
  url               String
  title             String?
  organicTraffic    Int      @default(0) @map("organic_traffic")
  averagePosition   Float?   @map("average_position")
  clickThroughRate  Float?   @map("click_through_rate")
  impressions       Int      @default(0)
  timeOnPage        Int?     @map("time_on_page")
  bounceRate        Float?   @map("bounce_rate")
  socialShares      Int      @default(0) @map("social_shares")
  seoScore          Int?     @map("seo_score")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @default(now()) @updatedAt @map("updated_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  @@map("content_performance")
}

model TrafficData {
  id                  String   @id @default(uuid()) @db.Uuid
  projectId           String   @map("project_id") @db.Uuid
  date                DateTime @db.Date
  totalSessions       Int      @default(0) @map("total_sessions")
  totalUsers          Int      @default(0) @map("total_users")
  organicSessions     Int      @default(0) @map("organic_sessions")
  avgSessionDuration  Int?     @map("avg_session_duration")
  bounceRate          Float?   @map("bounce_rate")
  conversions         Int      @default(0)
  source              String?
  medium              String?

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  @@map("traffic_data")
}

model AIRequest {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  requestType String   @map("request_type")
  credits     Int      @default(0)
  request     Json?
  response    Json?
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("ai_requests")
}

model Report {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  projectId   String?  @map("project_id") @db.Uuid
  name        String
  type        String
  config      Json
  schedule    Json?
  recipients  String[]
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  @@map("reports")
}

model Integration {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  projectId   String?  @map("project_id") @db.Uuid
  type        String   // 'gsc', 'ga', 'semrush', etc.
  config      Json
  credentials Json?
  isActive    Boolean  @default(true) @map("is_active")
  lastSync    DateTime? @map("last_sync")
  createdAt   DateTime @default(now()) @map("created_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  @@map("integrations")
}

model ContentCalendar {
  id            String   @id @default(uuid()) @db.Uuid
  projectId     String   @map("project_id") @db.Uuid
  title         String
  contentType   String   @map("content_type")
  status        String   @default("planned")
  targetKeywords String[] @map("target_keywords")
  assignee      String?
  plannedDate   DateTime? @map("planned_date")
  publishedDate DateTime? @map("published_date")
  notes         String?  @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @default(now()) @updatedAt @map("updated_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  @@map("content_calendar")
}
```

### Update Existing Models:

```prisma
// Add these relations to existing models
model User {
  // ... existing fields
  aiRequests    AIRequest[]
  reports       Report[]
  integrations  Integration[]
}

model Project {
  // ... existing fields
  contentPerformance ContentPerformance[]
  trafficData       TrafficData[]
  reports           Report[]
  integrations      Integration[]
  contentCalendar   ContentCalendar[]
}
```

---

## 💰 **API Rate Limits & Usage**

### Suggested Rate Limits:

- **Free Tier**: 100 requests/day
- **Basic Plan**: 1,000 requests/day
- **Pro Plan**: 10,000 requests/day
- **Enterprise**: Unlimited

### Credit System for AI APIs:

- Content Generation: 10 credits
- SEO Analysis: 5 credits
- Keyword Research: 15 credits
- Competitor Analysis: 20 credits

---

## 🔄 **Real-time Features**

### WebSocket APIs for:

1. Real-time ranking updates
2. Live audit progress
3. Content collaboration
4. Alert notifications
5. Dashboard live updates

---

## 📱 **Mobile API Considerations**

### Mobile-specific endpoints:

- Simplified dashboard data
- Optimized image responses
- Compressed JSON responses
- Offline data sync capabilities

---

## 🔐 **Security Enhancements**

### Required Security Features:

1. **API Key Management**
2. **OAuth 2.0 Integration**
3. **Request Signing**
4. **IP Whitelisting**
5. **Data Encryption**
6. **Audit Logging**

---

## 📈 **Priority Implementation Order**

### ✅ **Phase 1 COMPLETED - Core APIs Implemented:**

1. **Competitor Management APIs** ✅ **DONE** - Full CRUD operations
2. **Ranking History APIs** ✅ **DONE** - History tracking with analytics
3. **Notification Management APIs** ✅ **DONE** - Complete notification system
4. **Backlink Management APIs** ✅ **DONE** - Full backlink analytics

### Phase 2 (Medium Priority - Enhanced Features):

1. **Enhanced User Management APIs** ⭐ (Settings, avatar, activity)
2. **Enhanced Subscription APIs** ⭐ (Usage details, invoices)
3. **Project Analytics APIs** ⭐ (Overview, trends, comparisons)
4. **Export/Import APIs** ⭐ (Data export in multiple formats)
5. **Bulk Operations APIs** ⭐ (Bulk updates and imports)

### Phase 3 (Advanced Features - New Modules):

1. Site Audit APIs Enhancement
2. Traffic Analytics APIs
3. Content Performance APIs
4. Basic AI Content APIs

### Phase 4 (Enterprise Features):

1. Competitor Analysis APIs
2. Advanced Keyword APIs
3. Advanced AI Features
4. Integration APIs
5. Custom Reports APIs

### Phase 5 (Future Enhancements):

1. Real-time WebSocket APIs
2. Mobile-specific APIs
3. Advanced Analytics
4. Machine Learning Features---

## 🎯 **Current Implementation Status**

### ✅ **APIs Successfully Implemented:**

1. **GET/POST/PUT/DELETE** `/api/projects/{projectId}/competitors` ✅
2. **GET/POST** `/api/keywords/{keywordId}/rankings` ✅
3. **GET/PUT/DELETE** `/api/notifications` ✅
4. **GET/POST/PUT/DELETE** `/api/projects/{projectId}/backlinks` ✅
5. **GET** `/api/projects/{projectId}/rankings/overview` ✅

### 🔄 **Next Priority APIs to Implement:**

1. **Enhanced User Settings** - `/api/users/settings`
2. **Project Analytics** - `/api/projects/{projectId}/analytics/overview`
3. **Subscription Usage Details** - `/api/subscriptions/usage/{type}`
4. **Export Functionality** - `/api/projects/{projectId}/export`
5. **Bulk Operations** - `/api/projects/{projectId}/keywords/bulk-update`

### 📊 **Database Schema Status:**

#### ✅ **Tables Ready (No Migration Needed):**

- `competitors` ✅ Ready
- `backlinks` ✅ Ready
- `rankings` ✅ Ready
- `notifications` ✅ Ready

#### ❌ **Tables Missing (Migration Required):**

1. `content_performance` - Track content metrics
2. `traffic_data` - Store traffic analytics
3. `ai_requests` - Track AI tool usage
4. `reports` - Custom report configurations
5. `integrations` - Third-party service connections
6. `content_calendar` - Content planning data

---

## 🧪 **API Testing Guide**

### **Start Development Server:**

```bash
cd d:\WORK\OTHER\seo-cms-backend
npm run start:dev
```

### **Access API Documentation:**

```
🌐 Swagger UI: http://localhost:3001/api/docs
📚 All endpoints with interactive testing available
```

### **Authentication Setup:**

1. Register/Login via `/api/v1/auth/register` or `/api/v1/auth/login`
2. Copy the `accessToken` from response
3. Click "Authorize" in Swagger UI and enter: `Bearer {your-token}`

### **Test Sequence for New APIs:**

#### **1. Competitor Management:**

```bash
# 1. Create a project first (if not exists)
POST /api/v1/projects

# 2. Add competitor
POST /api/v1/projects/{projectId}/competitors
{
  "domain": "competitor.com",
  "name": "Main Competitor"
}

# 3. List competitors
GET /api/v1/projects/{projectId}/competitors
```

#### **2. Ranking Tracking:**

```bash
# 1. Add keyword to project (if not exists)
POST /api/v1/projects/{projectId}/keywords

# 2. Add ranking record
POST /api/v1/keywords/{keywordId}/rankings
{
  "position": 5,
  "url": "https://example.com/ranking-page"
}

# 3. View ranking history
GET /api/v1/keywords/{keywordId}/rankings?days=30

# 4. Project ranking overview
GET /api/v1/projects/{projectId}/rankings/overview
```

#### **3. Notifications:**

```bash
# 1. Get notifications
GET /api/v1/notifications?limit=10

# 2. Mark as read
PUT /api/v1/notifications/{notificationId}/read

# 3. Mark all as read
PUT /api/v1/notifications/mark-all-read
```

#### **4. Backlink Analytics:**

```bash
# 1. Add backlink
POST /api/v1/projects/{projectId}/backlinks
{
  "sourceDomain": "authority-site.com",
  "targetUrl": "https://yoursite.com/target",
  "anchorText": "great seo tool",
  "linkType": "follow",
  "authorityScore": 85
}

# 2. View backlinks
GET /api/v1/projects/{projectId}/backlinks

# 3. Analytics dashboard
GET /api/v1/projects/{projectId}/backlinks/analytics
```

---

## 📈 **Current Implementation Success**

### ✅ **4 Complete API Modules Added:**

- **Competitors Module:** Full CRUD + ownership verification
- **Rankings Module:** History tracking + trend analysis
- **Notifications Module:** Complete notification system
- **Backlinks Module:** Full analytics + authority tracking

### 🔧 **Technical Achievements:**

- ✅ JWT Authentication on all endpoints
- ✅ Request/Response validation
- ✅ Swagger documentation
- ✅ Pagination support
- ✅ Error handling
- ✅ Database relationships
- ✅ Analytics calculations

### 🚀 **Ready for Production:**

All implemented APIs are production-ready with proper security, validation, and documentation.

---

This comprehensive API specification will transform the current SEO CMS into a professional-grade SEO platform capable of competing with industry leaders like SEMrush and Ahrefs.
