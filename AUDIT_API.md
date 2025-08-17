# AUDIT API Documentation

## Tổng quan

API Audit cho phép client thực hiện các phép kiểm tra SEO toàn diện trên website, bao gồm phân tích technical SEO, performance, accessibility, content quality và các vấn đề khác.

## Authentication

Tất cả API endpoints yêu cầu Bearer token authentication:

```
Authorization: Bearer {your_token}
```

---

## 1. Project Audits Endpoints

### 1.1 Tạo Audit mới cho Project

**POST** `/projects/{projectId}/audits`

Khởi tạo một audit SEO mới cho project.

**Parameters:**

- `projectId` (path, required): UUID của project

**Request Body:**

```json
{
  "audit_type": "full", // "technical" | "content" | "performance" | "accessibility" | "full"
  "pages": ["https://example.com", "https://example.com/about"], // Optional: specific pages
  "max_depth": 3, // Optional: crawl depth (default: 3)
  "include_mobile": true, // Optional: include mobile audit
  "check_accessibility": true, // Optional: check accessibility
  "analyze_performance": true, // Optional: analyze performance
  "check_seo": true, // Optional: check SEO (default: true)
  "check_content": true, // Optional: check content quality
  "check_technical": true, // Optional: check technical SEO
  "validate_html": false, // Optional: validate HTML markup
  "check_links": true, // Optional: check broken links
  "check_images": true, // Optional: analyze images
  "check_meta": true, // Optional: check meta tags
  "settings": {} // Optional: custom settings object
}
```

**Response:**

```json
{
  "id": "audit-uuid",
  "projectId": "project-uuid",
  "status": "pending",
  "results": {
    "config": {...},
    "started_at": "2025-08-18T10:00:00Z",
    "progress": 0
  },
  "createdAt": "2025-08-18T10:00:00Z",
  "completedAt": null,
  "message": "Audit queued for processing",
  "estimated_duration": "2 minutes"
}
```

### 1.2 Tạo Comprehensive Audit

**POST** `/projects/{projectId}/audits/comprehensive`

API đơn giản hóa để tạo audit toàn diện với interface thân thiện.

**Parameters:**

- `projectId` (path, required): UUID của project

**Request Body:**

```json
{
  "url": "https://example.com",
  "options": {
    "auditType": "full", // "full" | "technical" | "content" | "performance"
    "settings": {
      "crawlDepth": 2, // Optional: crawl depth
      "includeImages": true, // Optional: include image analysis
      "checkMobileFriendly": true, // Optional: check mobile friendly
      "analyzePageSpeed": true // Optional: analyze page speed
    }
  }
}
```

**Response:** Tương tự như endpoint tạo audit thông thường.

### 1.3 Lấy danh sách Audits của Project

**GET** `/projects/{projectId}/audits`

**Parameters:**

- `projectId` (path, required): UUID của project
- `page` (query, optional): Số trang (default: 1)
- `limit` (query, optional): Số items per page (default: 10)
- `sortBy` (query, optional): Sắp xếp theo field (default: "createdAt")
- `sortOrder` (query, optional): "asc" hoặc "desc" (default: "desc")

**Response:**

```json
{
  "data": [
    {
      "id": "audit-uuid",
      "projectId": "project-uuid",
      "status": "completed",
      "results": {...},
      "createdAt": "2025-08-18T10:00:00Z",
      "completedAt": "2025-08-18T10:02:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### 1.4 Lấy tóm tắt Audits của Project

**GET** `/projects/{projectId}/audits/summary`

**Parameters:**

- `projectId` (path, required): UUID của project

**Response:**

```json
{
  "latestAudit": {
    "id": "audit-uuid",
    "status": "completed",
    "results": {...},
    "createdAt": "2025-08-18T10:00:00Z",
    "completedAt": "2025-08-18T10:02:00Z"
  },
  "stats": {
    "completed": 15,
    "running": 1,
    "pending": 2,
    "failed": 1
  }
}
```

### 1.5 Lấy lịch sử Audits

**GET** `/projects/{projectId}/audits/history`

**Parameters:**

- `projectId` (path, required): UUID của project
- `page`, `limit`, `sortBy`, `sortOrder`: Tương tự như endpoint danh sách audits

**Response:**

```json
{
  "data": [
    {
      "id": "audit-uuid",
      "status": "completed",
      "created_at": "2025-08-18T10:00:00Z",
      "completed_at": "2025-08-18T10:02:00Z",
      "summary": {
        "score": 85,
        "issues_found": 12,
        "pages_audited": 5
      }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

## 2. Individual Audit Endpoints

### 2.1 Lấy thông tin Audit theo ID

**GET** `/audits/{auditId}`

**Parameters:**

- `auditId` (path, required): UUID của audit

**Response:**

```json
{
  "id": "audit-uuid",
  "projectId": "project-uuid",
  "status": "completed",
  "results": {
    "config": {...},
    "overview": {
      "score": 85,
      "total_issues": 12,
      "pages_analyzed": 5
    },
    "technical": {...},
    "content": {...},
    "performance": {...},
    "accessibility": {...}
  },
  "createdAt": "2025-08-18T10:00:00Z",
  "completedAt": "2025-08-18T10:02:00Z",
  "project": {
    "id": "project-uuid",
    "name": "My Website",
    "url": "https://example.com"
  }
}
```

### 2.2 Lấy trạng thái và tiến độ Audit

**GET** `/audits/{auditId}/status`

**Parameters:**

- `auditId` (path, required): UUID của audit

**Response:**

```json
{
  "id": "audit-uuid",
  "status": "running", // "pending" | "running" | "completed" | "failed"
  "created_at": "2025-08-18T10:00:00Z",
  "completed_at": null,
  "progress": 45, // Percentage (0-100)
  "config": {
    "audit_type": "full",
    "include_mobile": true,
    "check_accessibility": true
  }
}
```

### 2.3 Lấy kết quả Audit

**GET** `/audits/{auditId}/results`

Chỉ trả về kết quả khi audit đã hoàn thành.

**Parameters:**

- `auditId` (path, required): UUID của audit

**Response:**

```json
{
  "id": "audit-uuid",
  "status": "completed",
  "results": {
    "overview": {
      "score": 85,
      "total_issues": 12,
      "pages_analyzed": 5,
      "audit_duration": "2m 15s"
    },
    "technical": {
      "score": 90,
      "issues": [
        {
          "type": "missing_meta_description",
          "severity": "warning",
          "message": "Meta description missing on 2 pages",
          "pages": ["https://example.com/page1", "https://example.com/page2"]
        }
      ]
    },
    "performance": {
      "score": 80,
      "metrics": {
        "first_contentful_paint": "1.2s",
        "largest_contentful_paint": "2.1s",
        "cumulative_layout_shift": 0.05
      }
    },
    "content": {
      "score": 88,
      "issues": [...]
    },
    "accessibility": {
      "score": 92,
      "issues": [...]
    }
  },
  "createdAt": "2025-08-18T10:00:00Z",
  "completedAt": "2025-08-18T10:02:00Z"
}
```

### 2.4 Xóa Audit

**DELETE** `/audits/{auditId}`

Xóa audit (không thể xóa audit đang chạy).

**Parameters:**

- `auditId` (path, required): UUID của audit

**Response:**

```json
{
  "message": "Audit deleted successfully"
}
```

---

## 3. Audit Types

### 3.1 Các loại Audit

- **`full`**: Audit toàn diện (technical + content + performance + accessibility)
- **`technical`**: Chỉ kiểm tra technical SEO
- **`content`**: Chỉ kiểm tra chất lượng content
- **`performance`**: Chỉ kiểm tra hiệu suất trang web
- **`accessibility`**: Chỉ kiểm tra khả năng tiếp cận

### 3.2 Audit Status

- **`pending`**: Audit được tạo, chờ xử lý
- **`running`**: Audit đang được thực hiện
- **`completed`**: Audit hoàn thành thành công
- **`failed`**: Audit thất bại

---

## 4. Rate Limits & Quotas

Hệ thống áp dụng giới hạn audit theo subscription plan:

- **Free plan**: 1 audit/tháng
- **Basic plan**: 10 audits/tháng
- **Pro plan**: 50 audits/tháng
- **Enterprise**: Unlimited

---

## 5. Error Responses

### 5.1 Common Error Codes

- **400**: Bad Request - Dữ liệu không hợp lệ
- **401**: Unauthorized - Token không hợp lệ
- **403**: Forbidden - Vượt quá giới hạn hoặc không có quyền
- **404**: Not Found - Audit hoặc project không tồn tại
- **429**: Too Many Requests - Vượt quá rate limit

### 5.2 Error Response Format

```json
{
  "statusCode": 403,
  "message": "Monthly audit limit reached. Upgrade your plan to run more audits.",
  "error": "Forbidden"
}
```

---

## 6. Best Practices

### 6.1 Polling cho kết quả

Để theo dõi tiến độ audit:

1. Tạo audit bằng POST `/projects/{projectId}/audits`
2. Poll trạng thái bằng GET `/audits/{auditId}/status` mỗi 5-10 giây
3. Khi `status` = "completed", lấy kết quả bằng GET `/audits/{auditId}/results`

### 6.2 Audit Configuration

- Với website lớn, hạn chế `max_depth` để tránh audit quá lâu
- Chỉ bật các option cần thiết để tiết kiệm thời gian
- Sử dụng `pages` array để audit specific pages thay vì toàn bộ site

### 6.3 Xử lý lỗi

- Luôn kiểm tra quota trước khi tạo audit
- Implement retry logic cho network errors
- Cache kết quả audit để tránh duplicate requests

---

## 7. Examples

### 7.1 Tạo audit đơn giản

```javascript
const response = await fetch('/projects/123/audits/comprehensive', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://mywebsite.com',
    options: {
      auditType: 'full',
      settings: {
        crawlDepth: 2,
        includeImages: true,
        checkMobileFriendly: true,
      },
    },
  }),
});

const audit = await response.json();
console.log('Audit created:', audit.id);
```

### 7.2 Theo dõi tiến độ audit

```javascript
async function waitForAuditCompletion(auditId) {
  while (true) {
    const status = await fetch(`/audits/${auditId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());

    console.log(`Progress: ${status.progress}%`);

    if (status.status === 'completed') {
      const results = await fetch(`/audits/${auditId}/results`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());

      return results;
    }

    if (status.status === 'failed') {
      throw new Error('Audit failed');
    }

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s
  }
}
```
