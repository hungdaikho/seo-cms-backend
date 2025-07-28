# 🔍 **SEO Audit APIs - Production Ready Documentation**

## 📋 **API Overview**

Hệ thống Audit APIs sử dụng **Puppeteer + Lighthouse + Cheerio** để cung cấp phân tích SEO thực tế toàn diện cho website. Bao gồm:

- 🤖 **Real Browser Automation** với Puppeteer
- ⚡ **Google Lighthouse Performance** analysis
- 🕷️ **SEO Crawling** với Cheerio HTML parsing
- 📱 **Mobile + Desktop** optimization checks
- ♿ **Accessibility** WCAG compliance testing
- 🔗 **Broken Links** detection
- 🖼️ **Image Optimization** analysis

Tất cả APIs sử dụng JWT authentication và kiểm tra quyền sở hữu project.

---

## 🚀 **1. Create New Audit - Tạo Audit Mới**

### **Endpoint**

```http
POST /api/v1/projects/{projectId}/audits
```

### **Description**

Khởi tạo audit SEO thực tế với **Puppeteer browser automation**. Hệ thống sẽ:

1. 🤖 **Launch real Chrome browser** để crawl website
2. ⚡ **Run Google Lighthouse** cho performance analysis
3. 🕷️ **Parse HTML** với Cheerio để extract SEO data
4. 📱 **Test mobile-friendliness**
5. ♿ **Check accessibility** issues
6. 🔗 **Detect broken links**
7. 📊 **Generate comprehensive report** với scores và recommendations

**Processing time**: 2-5 phút tùy số trang và độ phức tạp website.

### **Headers**

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### **Path Parameters**

| Parameter | Type | Required | Description              |
| --------- | ---- | -------- | ------------------------ |
| projectId | UUID | Yes      | ID của project cần audit |

### **Request Body**

```json
{
  "include_mobile": true,
  "check_accessibility": true,
  "analyze_performance": true,
  "check_seo": true,
  "check_content": true,
  "check_technical": true,
  "validate_html": false,
  "check_links": true,
  "check_images": true,
  "check_meta": true,
  "audit_type": "full",
  "pages": ["https://example.com", "https://example.com/about"],
  "max_depth": 3,
  "settings": {
    "timeout": 30000,
    "user_agent": "RankTracker Bot/1.0"
  }
}
```

### **🔧 Advanced Configuration**

```json
{
  "include_mobile": true,
  "analyze_performance": true,
  "check_accessibility": true,
  "audit_type": "full",
  "pages": [
    "https://yourwebsite.com",
    "https://yourwebsite.com/about",
    "https://yourwebsite.com/products"
  ],
  "max_depth": 2,
  "settings": {
    "timeout": 60000,
    "user_agent": "Custom Bot/1.0",
    "viewport": {
      "width": 1920,
      "height": 1080
    },
    "lighthouse_options": {
      "only_categories": ["performance", "seo", "accessibility"],
      "throttling": "fast"
    }
  }
}
```

### **Request Body Fields**

| Field               | Type     | Required | Default | Description                                                                |
| ------------------- | -------- | -------- | ------- | -------------------------------------------------------------------------- |
| include_mobile      | boolean  | No       | false   | Bao gồm kiểm tra mobile-friendly                                           |
| check_accessibility | boolean  | No       | false   | Kiểm tra tuân thủ WCAG accessibility                                       |
| analyze_performance | boolean  | No       | false   | Phân tích hiệu suất website                                                |
| check_seo           | boolean  | No       | true    | Kiểm tra các yếu tố SEO cơ bản                                             |
| check_content       | boolean  | No       | true    | Phân tích chất lượng nội dung                                              |
| check_technical     | boolean  | No       | true    | Kiểm tra kỹ thuật SEO                                                      |
| validate_html       | boolean  | No       | false   | Validate HTML markup                                                       |
| check_links         | boolean  | No       | true    | Kiểm tra broken links                                                      |
| check_images        | boolean  | No       | true    | Phân tích tối ưu hóa hình ảnh                                              |
| check_meta          | boolean  | No       | true    | Kiểm tra meta tags                                                         |
| audit_type          | enum     | No       | "full"  | Loại audit: "technical", "content", "performance", "accessibility", "full" |
| pages               | string[] | No       | []      | Danh sách URLs cụ thể để audit                                             |
| max_depth           | number   | No       | 3       | Độ sâu crawl tối đa                                                        |
| settings            | object   | No       | {}      | Cài đặt tùy chỉnh cho audit                                                |

### **Response - Success (202 Accepted)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "results": {
    "config": {
      "include_mobile": true,
      "check_accessibility": true,
      "analyze_performance": true,
      "audit_type": "full",
      "pages": ["https://example.com"],
      "max_depth": 3
    },
    "started_at": "2025-07-27T21:30:00.000Z",
    "progress": {
      "current_step": 1,
      "total_steps": 7,
      "step_name": "Launching Chrome browser",
      "pages_processed": 0,
      "pages_total": 1,
      "percentage": 14
    },
    "real_time_analysis": {
      "browser_engine": "Chromium 120.0.6099.109",
      "lighthouse_version": "11.4.0",
      "analysis_tools": ["Puppeteer", "Lighthouse", "Cheerio"],
      "performance_mode": "desktop_and_mobile"
    }
  },
  "createdAt": "2025-07-27T21:30:00.000Z",
  "completedAt": null,
  "message": "Real-time audit started using browser automation",
  "estimated_duration": "3-5 minutes"
}
```

### **Response - Error (403)**

```json
{
  "statusCode": 403,
  "message": "Monthly audit limit reached. Upgrade your plan to run more audits.",
  "error": "Forbidden"
}
```

### **Use Cases**

- Kiểm tra SEO tổng quả website mới
- Audit định kỳ để theo dõi tiến bộ SEO
- Phân tích cụ thể mobile performance
- Kiểm tra accessibility compliance

---

## 📊 **2. Get Project Audits - Danh Sách Audits**

### **Endpoint**

```http
GET /api/v1/projects/{projectId}/audits
```

### **Description**

Lấy danh sách tất cả audits của một project với phân trang và tìm kiếm.

### **Headers**

```http
Authorization: Bearer {jwt_token}
```

### **Path Parameters**

| Parameter | Type | Required | Description    |
| --------- | ---- | -------- | -------------- |
| projectId | UUID | Yes      | ID của project |

### **Query Parameters**

| Parameter | Type   | Required | Default     | Description                |
| --------- | ------ | -------- | ----------- | -------------------------- |
| page      | number | No       | 1           | Số trang                   |
| limit     | number | No       | 10          | Số lượng items per page    |
| search    | string | No       | -           | Tìm kiếm theo tên hoặc URL |
| sortBy    | string | No       | "createdAt" | Sắp xếp theo field         |
| sortOrder | string | No       | "desc"      | Thứ tự: "asc" hoặc "desc"  |

### **Response - Success (200)**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "projectId": "123e4567-e89b-12d3-a456-426614174000",
      "status": "completed",
      "results": {
        "overview": {
          "score": 85,
          "total_issues": 12
        }
      },
      "createdAt": "2025-07-27T21:30:00.000Z",
      "completedAt": "2025-07-27T21:33:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### **Use Cases**

- Xem lịch sử audit của project
- So sánh kết quả audit theo thời gian
- Quản lý audits với phân trang

---

## 📈 **3. Get Audit Summary - Tổng Quan Audits**

### **Endpoint**

```http
GET /api/v1/projects/{projectId}/audits/summary
```

### **Description**

Lấy tổng quan thống kê audits của project, bao gồm audit gần nhất và phân bố theo trạng thái.

### **Headers**

```http
Authorization: Bearer {jwt_token}
```

### **Path Parameters**

| Parameter | Type | Required | Description    |
| --------- | ---- | -------- | -------------- |
| projectId | UUID | Yes      | ID của project |

### **Response - Success (200)**

```json
{
  "latestAudit": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "results": {
      "overview": {
        "score": 85,
        "total_issues": 12,
        "critical_issues": 2
      }
    },
    "createdAt": "2025-07-27T21:30:00.000Z",
    "completedAt": "2025-07-27T21:33:00.000Z"
  },
  "stats": {
    "completed": 15,
    "pending": 1,
    "running": 0,
    "failed": 2
  }
}
```

### **Use Cases**

- Dashboard overview cho project
- Hiển thị trạng thái audit gần nhất
- Thống kê tổng quan performance

---

## 🔍 **4. Get Audit Details - Chi Tiết Audit**

### **Endpoint**

```http
GET /api/v1/audits/{auditId}
```

### **Description**

Lấy thông tin chi tiết của một audit cụ thể, bao gồm cấu hình và metadata.

### **Headers**

```http
Authorization: Bearer {jwt_token}
```

### **Path Parameters**

| Parameter | Type | Required | Description  |
| --------- | ---- | -------- | ------------ |
| auditId   | UUID | Yes      | ID của audit |

### **Response - Success (200)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "results": {
    "config": {
      "include_mobile": true,
      "check_accessibility": true,
      "audit_type": "full",
      "browser_engine": "Chromium 120.0.6099.109",
      "lighthouse_version": "11.4.0"
    },
    "started_at": "2025-07-27T21:30:00.000Z",
    "completed_at": "2025-07-27T21:35:00.000Z",
    "progress": 100,
    "processing_details": {
      "browser_launch_time": "1.2s",
      "lighthouse_analysis_time": "45s",
      "html_parsing_time": "8s",
      "mobile_analysis_time": "32s",
      "accessibility_check_time": "15s",
      "broken_links_check_time": "25s",
      "total_processing_time": "4m 35s"
    },
    "technology_stack": {
      "browser_automation": "Puppeteer",
      "performance_analysis": "Google Lighthouse",
      "html_parsing": "Cheerio",
      "mobile_testing": "Chrome DevTools",
      "accessibility_testing": "aXe-core"
    }
  },
  "createdAt": "2025-07-27T21:30:00.000Z",
  "completedAt": "2025-07-27T21:33:00.000Z",
  "project": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "My Website",
    "domain": "https://example.com"
  }
}
```

### **Response - Error (404)**

```json
{
  "statusCode": 404,
  "message": "Audit not found",
  "error": "Not Found"
}
```

### **Use Cases**

- Xem chi tiết cấu hình audit
- Kiểm tra metadata và timing
- Debug audit issues

---

## ⏱️ **5. Get Audit Status - Trạng Thái Audit**

### **Endpoint**

```http
GET /api/v1/audits/{auditId}/status
```

### **Description**

Kiểm tra trạng thái hiện tại và tiến độ của audit. Sử dụng để polling trong quá trình audit đang chạy.

### **Headers**

```http
Authorization: Bearer {jwt_token}
```

### **Path Parameters**

| Parameter | Type | Required | Description  |
| --------- | ---- | -------- | ------------ |
| auditId   | UUID | Yes      | ID của audit |

### **Response - Success (200)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "running",
  "created_at": "2025-07-27T21:30:00.000Z",
  "completed_at": null,
  "progress": {
    "percentage": 65,
    "current_step": 4,
    "total_steps": 7,
    "step_name": "Running mobile analysis",
    "pages_processed": 2,
    "pages_total": 3
  },
  "real_time_analysis": {
    "browser_instances": 2,
    "current_operations": [
      "Lighthouse performance analysis on mobile",
      "Cheerio HTML parsing for SEO metrics"
    ],
    "estimated_time_remaining": "2m 15s"
  },
  "config": {
    "include_mobile": true,
    "check_accessibility": true,
    "audit_type": "full",
    "pages": ["https://example.com"],
    "max_depth": 3,
    "browser_engine": "Chromium 120.0.6099.109"
  }
}
```

### **Status Values**

| Status    | Description                 |
| --------- | --------------------------- |
| pending   | Audit đang chờ xử lý        |
| running   | Audit đang được thực hiện   |
| completed | Audit hoàn thành thành công |
| failed    | Audit thất bại              |

### **Use Cases**

- Polling để theo dõi tiến độ audit
- Hiển thị progress bar
- Kiểm tra trạng thái trước khi lấy kết quả

---

## 📋 **6. Get Audit Results - Kết Quả Audit**

### **Endpoint**

```http
GET /api/v1/audits/{auditId}/results
```

### **Description**

Lấy kết quả đầy đủ của audit đã hoàn thành, bao gồm điểm số, issues và recommendations.

### **Headers**

```http
Authorization: Bearer {jwt_token}
```

### **Path Parameters**

| Parameter | Type | Required | Description               |
| --------- | ---- | -------- | ------------------------- |
| auditId   | UUID | Yes      | ID của audit đã completed |

### **Response - Success (200)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "results": {
    "overview": {
      "score": 85,
      "total_issues": 12,
      "critical_issues": 2,
      "warnings": 7,
      "passed_checks": 68,
      "analysis_engine": "Puppeteer + Lighthouse + Cheerio",
      "audit_timestamp": "2025-07-27T21:35:00.000Z",
      "processing_time": "4m 35s"
    },
    "lighthouse_performance": {
      "desktop": {
        "performance_score": 89,
        "first_contentful_paint": "1.2s",
        "largest_contentful_paint": "2.1s",
        "cumulative_layout_shift": 0.08,
        "first_input_delay": "45ms",
        "speed_index": "2.3s"
      },
      "mobile": {
        "performance_score": 76,
        "first_contentful_paint": "2.1s",
        "largest_contentful_paint": "3.4s",
        "cumulative_layout_shift": 0.12,
        "first_input_delay": "89ms",
        "speed_index": "3.8s"
      }
    },
    "seo_analysis": {
      "score": 90,
      "cheerio_parsed_elements": {
        "total_headings": 45,
        "missing_alt_tags": 3,
        "internal_links": 78,
        "external_links": 12,
        "meta_descriptions": 7,
        "canonical_tags": 10
      },
      "issues": [
        {
          "type": "warning",
          "title": "Missing Meta Descriptions",
          "description": "3 pages are missing meta descriptions (detected via HTML parsing)",
          "impact": "medium",
          "recommendation": "Add unique meta descriptions to improve click-through rates",
          "affected_pages": ["/about", "/contact", "/services"],
          "detection_method": "Cheerio HTML parsing"
        },
        {
          "type": "error",
          "title": "Missing XML Sitemap",
          "description": "No XML sitemap found during browser navigation",
          "impact": "high",
          "recommendation": "Create and submit an XML sitemap to search engines",
          "detection_method": "Puppeteer navigation test"
        }
      ]
    },
    "content_analysis": {
      "score": 82,
      "cheerio_content_analysis": {
        "total_words": 15420,
        "average_words_per_page": 1285,
        "headings_structure": {
          "h1_count": 10,
          "h2_count": 34,
          "h3_count": 28,
          "missing_h1": 2
        },
        "content_quality": {
          "readability_score": 78,
          "keyword_density": 2.3,
          "duplicate_content": 0
        }
      },
      "issues": [
        {
          "type": "warning",
          "title": "Thin Content",
          "description": "2 pages have less than 300 words (analyzed via Cheerio text extraction)",
          "impact": "medium",
          "recommendation": "Expand content to provide more value to users",
          "affected_pages": ["/privacy", "/terms"],
          "detection_method": "Cheerio word count analysis"
        }
      ]
    },
    "lighthouse_accessibility": {
      "score": 88,
      "axe_core_results": {
        "violations": 3,
        "passes": 45,
        "incomplete": 2,
        "total_elements_tested": 1247
      },
      "issues": [
        {
          "type": "error",
          "title": "Missing Alt Text",
          "description": "5 images are missing alt text (detected via Lighthouse accessibility audit)",
          "impact": "high",
          "recommendation": "Add descriptive alt text to all images for better accessibility",
          "wcag_level": "A",
          "detection_method": "Google Lighthouse + aXe-core"
        }
      ]
    },
    "broken_links": {
      "total_links_checked": 127,
      "broken_links": 3,
      "external_links": 45,
      "internal_links": 82,
      "broken_link_details": [
        {
          "url": "https://example.com/old-page",
          "status_code": 404,
          "found_on": "https://example.com/blog",
          "detection_method": "Puppeteer navigation test"
        }
      ]
    },
    "pages_analyzed": [
      {
        "url": "https://example.com",
        "status_code": 200,
        "title": "Homepage Title",
        "meta_description": "Homepage meta description",
        "h1_count": 1,
        "word_count": 450,
        "lighthouse_scores": {
          "performance": 89,
          "seo": 95,
          "accessibility": 88,
          "best_practices": 92
        },
        "cheerio_analysis": {
          "total_elements": 342,
          "images_count": 15,
          "links_count": 23,
          "forms_count": 2,
          "missing_alt_tags": 1
        },
        "core_web_vitals": {
          "first_contentful_paint": "1.2s",
          "largest_contentful_paint": "2.1s",
          "cumulative_layout_shift": 0.08
        },
        "issues_count": 3,
        "score": 88
      },
      {
        "url": "https://example.com/about",
        "status_code": 200,
        "title": "About Us",
        "meta_description": "",
        "h1_count": 1,
        "word_count": 280,
        "lighthouse_scores": {
          "performance": 76,
          "seo": 82,
          "accessibility": 85,
          "best_practices": 88
        },
        "cheerio_analysis": {
          "total_elements": 189,
          "images_count": 8,
          "links_count": 12,
          "forms_count": 0,
          "missing_alt_tags": 2
        },
        "core_web_vitals": {
          "first_contentful_paint": "2.1s",
          "largest_contentful_paint": "3.4s",
          "cumulative_layout_shift": 0.12
        },
        "issues_count": 5,
        "score": 72
      }
    ],
    "audit_technology_summary": {
      "browser_automation": "Puppeteer (Chrome DevTools Protocol)",
      "performance_testing": "Google Lighthouse 11.4.0",
      "html_parsing": "Cheerio server-side DOM manipulation",
      "accessibility_testing": "aXe-core integration via Lighthouse",
      "mobile_testing": "Chrome Mobile Device Emulation",
      "link_checking": "HTTP status validation via Puppeteer"
    },
    "completed_at": "2025-07-27T21:33:15.000Z",
    "processing_time": "3m 15s"
  },
  "createdAt": "2025-07-27T21:30:00.000Z",
  "completedAt": "2025-07-27T21:33:15.000Z"
}
```

### **Response - Error (400)**

```json
{
  "statusCode": 400,
  "message": "Audit is not completed yet",
  "error": "Bad Request"
}
```

### **Issue Types**

| Type    | Description                      | Priority |
| ------- | -------------------------------- | -------- |
| error   | Vấn đề nghiêm trọng cần sửa ngay | High     |
| warning | Vấn đề cần chú ý                 | Medium   |
| info    | Thông tin tham khảo              | Low      |

### **Impact Levels**

| Impact | Description                    |
| ------ | ------------------------------ |
| high   | Ảnh hưởng nghiêm trọng đến SEO |
| medium | Ảnh hưởng vừa phải             |
| low    | Ảnh hưởng nhỏ                  |

### **Use Cases**

- Hiển thị báo cáo audit đầy đủ
- Xuất PDF report
- Phân tích chi tiết các issues
- Tạo action plan SEO

---

## 🗑️ **7. Delete Audit - Xóa Audit**

### **Endpoint**

```http
DELETE /api/v1/audits/{auditId}
```

### **Description**

Xóa một audit khỏi hệ thống. Không thể xóa audit đang chạy.

### **Headers**

```http
Authorization: Bearer {jwt_token}
```

### **Path Parameters**

| Parameter | Type | Required | Description          |
| --------- | ---- | -------- | -------------------- |
| auditId   | UUID | Yes      | ID của audit cần xóa |

### **Response - Success (200)**

```json
{
  "message": "Audit deleted successfully"
}
```

### **Response - Error (400)**

```json
{
  "statusCode": 400,
  "message": "Cannot delete a running audit",
  "error": "Bad Request"
}
```

### **Use Cases**

- Dọn dẹp audits cũ
- Xóa audit test
- Quản lý storage

---

## 🔐 **Authentication & Authorization**

### **JWT Token Required**

Tất cả APIs yêu cầu JWT token trong header:

```http
Authorization: Bearer {your_jwt_token}
```

### **Permission Checks**

- User chỉ có thể audit projects mà họ sở hữu
- Kiểm tra subscription limits trước khi tạo audit
- Rate limiting theo plan của user

---

## � **Technology Stack Details**

### **Real-Time Website Analysis Engine**

Our audit system uses a comprehensive technology stack for real website analysis:

#### **🌐 Browser Automation**

- **Puppeteer**: Controls headless Chrome browsers for real website interaction
- **Chrome DevTools Protocol**: Direct browser communication for deep inspection
- **Browser Pool Management**: Concurrent browser instances for faster processing

#### **⚡ Performance Analysis**

- **Google Lighthouse 11.4.0**: Industry-standard performance and SEO metrics
- **Core Web Vitals**: Real measurement of FCP, LCP, CLS, FID
- **Mobile & Desktop Testing**: Separate analysis for different devices

#### **🔍 HTML & Content Analysis**

- **Cheerio**: Server-side jQuery-like DOM manipulation for content extraction
- **Real HTML Parsing**: Analyzes actual rendered HTML, not mock data
- **Content Quality Analysis**: Word count, readability, structure validation

#### **♿ Accessibility Testing**

- **aXe-core Integration**: Via Google Lighthouse for WCAG compliance
- **Real Accessibility Issues**: Detected from actual page rendering
- **WCAG 2.1 Standards**: Level A, AA, AAA compliance checking

#### **🔗 Link Validation**

- **HTTP Status Checking**: Real navigation to validate all links
- **Internal/External Classification**: Intelligent link categorization
- **404 Detection**: Actual broken link identification

---

## �📊 **Subscription Limits**

### **Free Plan**

- 1 audit/tháng với real browser analysis
- Basic SEO + Performance checks
- 3 pages maximum per audit
- Desktop analysis only

### **Pro Plan**

- 10 audits/tháng với full Lighthouse integration
- All features including mobile testing
- 50 pages maximum per audit
- Accessibility + Content analysis

### **Enterprise Plan**

- Unlimited audits với dedicated browser pool
- All premium features
- Unlimited pages per audit
- Priority processing + Custom reporting

---

## 🚨 **Error Codes & Handling**

### **Common Error Responses**

#### **401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### **403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "You do not have access to this project",
  "error": "Forbidden"
}
```

#### **404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Project not found",
  "error": "Not Found"
}
```

#### **400 Bad Request**

```json
{
  "statusCode": 400,
  "message": [
    "include_mobile must be a boolean value",
    "pages must be an array of URLs"
  ],
  "error": "Bad Request"
}
```

#### **429 Too Many Requests**

```json
{
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "error": "Too Many Requests"
}
```

---

## 🔄 **Workflow Examples**

### **Real-Time Audit Workflow**

```javascript
// 1. Start real-time audit with browser automation
const audit = await createAudit(projectId, {
  include_mobile: true,
  analyze_performance: true,
  check_accessibility: true,
  audit_type: 'full',
});

// 2. Monitor real-time progress with detailed steps
while (audit.status !== 'completed') {
  await sleep(3000); // Allow time for browser operations
  const status = await getAuditStatus(audit.id);

  // Real-time progress details
  console.log(
    `Step ${status.progress.current_step}/7: ${status.progress.step_name}`,
  );
  console.log(
    `Browser instances: ${status.real_time_analysis.browser_instances}`,
  );
  console.log(
    `Pages processed: ${status.progress.pages_processed}/${status.progress.pages_total}`,
  );

  updateProgressBar(status.progress.percentage);
}

// 3. Get comprehensive results with real analysis data
const results = await getAuditResults(audit.id);
displayLighthouseMetrics(results.lighthouse_performance);
displayCheerioAnalysis(results.seo_analysis.cheerio_parsed_elements);
displayBrokenLinks(results.broken_links);
```

### **Production-Ready Batch Processing**

```javascript
// Audit multiple websites with real browser automation
const projects = ['project1', 'project2', 'project3'];

// Stagger audit starts to manage browser pool resources
const audits = [];
for (const projectId of projects) {
  const audit = await createAudit(projectId, {
    include_mobile: true,
    analyze_performance: true,
    settings: { timeout: 60000 }, // Extended timeout for real analysis
  });
  audits.push(audit);
  await sleep(5000); // Prevent browser pool overload
}

// Monitor all audits with real-time updates
const results = await Promise.all(
  audits.map((audit) => pollUntilComplete(audit.id)),
);
```

---

## 📈 **Performance Considerations**

### **Performance Considerations**

#### **Real Browser Automation Impact**

- **Processing Time**: 3-7 minutes per audit (vs 30 seconds for mock data)
- **Resource Usage**: Each audit requires Chrome browser instance
- **Concurrent Limits**: Maximum 5 concurrent audits to prevent resource exhaustion

#### **Rate Limiting (Updated for Real Analysis)**

- 5 audit creations/hour per user (reduced due to resource intensity)
- 60 requests/minute cho status checking
- 100 requests/minute cho result retrieval

#### **Timeouts (Extended for Real Processing)**

- Audit creation: 60 seconds (browser initialization)
- Lighthouse analysis: 120 seconds per page
- Full audit completion: 15 minutes maximum
- Status check: 10 seconds
- Results retrieval: 60 seconds

### **Caching Strategy**

- **Audit Results**: Cached 7 days (longer due to processing cost)
- **Lighthouse Metrics**: Cached 24 hours
- **Status Responses**: Real-time, no caching
- **Summary Data**: Cached 1 hour

---

## 🎯 **Best Practices for Real Implementation**

### **For Frontend Developers**

1. **Enhanced Progress Monitoring**:
   - Display current step (1-7) with descriptive names
   - Show browser instances count and estimated time remaining
   - Update every 3-5 seconds (not 1-2 due to processing intensity)

2. **Real-Time User Experience**:
   - Show "Launching Chrome browser..." messages
   - Display "Running Lighthouse analysis..." progress
   - Indicate "Parsing HTML with Cheerio..." status

3. **Error Handling for Browser Operations**:
   - Handle browser timeout errors gracefully
   - Implement retry logic for browser launch failures
   - Show meaningful error messages for accessibility/performance issues

4. **Results Presentation**:
   - Highlight real vs simulated data badges
   - Display Lighthouse scores prominently
   - Show browser engine version used
   - Include processing time in results

### **For Backend Integration**

1. **Browser Pool Management**:
   - Monitor browser instance health
   - Implement browser recycling after N audits
   - Handle memory cleanup and crash recovery

2. **Real-Time Processing**:
   - Use WebSockets for live progress updates
   - Implement queue management for audit requests
   - Background job processing with Redis/Bull

3. **Quality Assurance**:
   - Validate Lighthouse scores accuracy
   - Cross-check Cheerio parsing results
   - Monitor browser automation success rates

4. **Scalability Planning**:
   - Implement horizontal browser pool scaling
   - Use dedicated audit processing servers
   - Monitor CPU/memory usage patterns

---

## 🔗 **Related APIs**

- **Projects API**: Quản lý projects
- **Users API**: User authentication
- **Subscriptions API**: Plan management
- **Reports API**: Generate PDF reports

---

## 📞 **Support**

Để hỗ trợ kỹ thuật hoặc câu hỏi về APIs:

- Email: support@ranktracker.com
- Documentation: https://docs.ranktracker.com
- Status Page: https://status.ranktracker.com
