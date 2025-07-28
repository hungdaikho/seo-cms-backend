# AI Module API Documentation

This document describes the available API endpoints and methods provided by the AI module (`AiService`) for client integration. All endpoints are assumed to be under the `/ai` route (adjust as needed for your application).

## 1. AI Request Processing

### POST `/ai/request`

- **Description:** Process an AI request of a specific type with parameters.
- **Body:**
  - `userId` (string, required)
  - `type` (enum, required) — see supported types below
  - `parameters` (object, required) — DTO for the request type
  - `projectId` (string, optional)
- **Response:** `{ requestId: string, result: any }`

#### Supported `type` values (AIRequestType):

- `KEYWORD_RESEARCH`
- `CONTENT_OPTIMIZATION`
- `META_GENERATION`
- `CONTENT_IDEAS`
- `COMPETITOR_ANALYSIS`
- `SEO_AUDIT`
- `BLOG_OUTLINE`
- `PRODUCT_DESCRIPTION`
- `SOCIAL_MEDIA`
- `CONTENT_REWRITE`
- `CONTENT_EXPANSION`
- `COMPETITOR_CONTENT_ANALYSIS`
- `CONTENT_OPTIMIZATION_SUGGESTIONS`
- `SCHEMA_MARKUP_GENERATION`
- `LONG_TAIL_KEYWORDS`
- `QUESTION_BASED_KEYWORDS`
- `SEASONAL_KEYWORD_TRENDS`
- `CONTENT_PERFORMANCE_PREDICTION`

---

## 2. Get User AI Requests

### GET `/ai/requests?userId=...&projectId=...`

- **Description:** List all AI requests for a user (optionally filter by project).
- **Response:** `Array<AIRequest>`

---

## 3. Get AI Request by ID

### GET `/ai/request/:requestId?userId=...`

- **Description:** Get details and result of a specific AI request.
- **Response:** `AIRequest`

---

## 4. AI Tools

### GET `/ai/tools?category=...&isActive=...`

- **Description:** List available AI tools (optionally filter by category and status).
- **Response:** `Array<AITool>`

### GET `/ai/tool-usage?userId=...&projectId=...&toolId=...`

- **Description:** Get usage statistics for a specific tool.
- **Response:** `AIToolUsageResponse`

---

## 5. AI Analytics

### GET `/ai/usage-analytics?userId=...&projectId=...`

- **Description:** Get AI usage analytics for a user/project.
- **Response:** `AIUsageAnalyticsResponse`

---

## 6. AI Templates

### POST `/ai/template`

- **Description:** Create a new AI template.
- **Body:** `userId`, `projectId`, `dto: AITemplateDto`
- **Response:** `AITemplate`

### GET `/ai/templates?userId=...&projectId=...&toolId=...&isShared=...`

- **Description:** List AI templates (filterable).
- **Response:** `Array<AITemplate>`

---

## 7. AI Workflows

### POST `/ai/workflow`

- **Description:** Create a new AI workflow.
- **Body:** `userId`, `projectId`, `dto: AIWorkflowDto`
- **Response:** `AIWorkflow`

### GET `/ai/workflows?userId=...&projectId=...`

- **Description:** List AI workflows for a project.
- **Response:** `Array<AIWorkflow>`

### POST `/ai/workflow/execute`

- **Description:** Execute an AI workflow.
- **Body:** `userId`, `projectId`, `workflowId`, `initialInput`
- **Response:** Workflow execution result

---

## 8. Track Tool Usage

### POST `/ai/tool-usage`

- **Description:** Track usage of an AI tool.
- **Body:** `userId`, `projectId`, `dto: AIToolUsageDto`
- **Response:** `{ success: boolean }`

---

## Notes

- All endpoints expect authentication (e.g., JWT) as per your backend setup.
- DTOs and response types are defined in `src/ai/dto/ai.dto.ts`.
- Error responses follow standard NestJS error format.

---

For detailed DTO and response structures, refer to the TypeScript interfaces in the codebase.
