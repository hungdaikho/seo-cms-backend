# 🔍 On-Page SEO Checker API Documentation

## Tổng quan

On-Page SEO Checker API cung cấp các công cụ phân tích và tối ưu hóa SEO cho từng trang web. API này giúp phát hiện các vấn đề SEO, đánh giá chất lượng content, và đưa ra những khuyến nghị cụ thể để cải thiện ranking.

### 🚀 **Các tính năng chính:**

- ✅ **Technical SEO Analysis**: Title tags, meta descriptions, heading structure
- ✅ **Content Quality Assessment**: Word count, keyword density, readability
- ✅ **Image Optimization**: Alt text analysis, image SEO issues
- ✅ **Performance Metrics**: Page load speed, Core Web Vitals
- ✅ **Mobile-Friendly Testing**: Responsive design analysis
- ✅ **Structured Data Detection**: Schema markup validation
- ✅ **Link Analysis**: Internal/external links assessment
- ✅ **Social Media Optimization**: Open Graph, Twitter Cards

---

## 🔑 Authentication

Tất cả endpoints đều yêu cầu JWT authentication:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 API Endpoints

### 1. 🎯 **Bắt đầu Single Page Analysis**

Phân tích một trang web cụ thể với các tùy chọn tùy chỉnh.

#### **Endpoint:**

```http
POST /api/v1/projects/{projectId}/audits/comprehensive
```

#### **Request Body:**

```json
{
  "url": "https://example.com/page-to-analyze",
  "options": {
    "auditType": "full",
    "settings": {
      "crawlDepth": 1,
      "includeImages": true,
      "checkMobileFriendly": true,
      "analyzePageSpeed": true
    }
  }
}
```

#### **Parameters:**

| Field                                  | Type    | Required | Description                                   |
| -------------------------------------- | ------- | -------- | --------------------------------------------- |
| `url`                                  | string  | ✅       | URL của trang cần phân tích                   |
| `options.auditType`                    | enum    | ❌       | `full`, `technical`, `content`, `performance` |
| `options.settings.crawlDepth`          | number  | ❌       | Độ sâu crawl (mặc định: 1)                    |
| `options.settings.includeImages`       | boolean | ❌       | Phân tích hình ảnh (mặc định: true)           |
| `options.settings.checkMobileFriendly` | boolean | ❌       | Kiểm tra mobile-friendly (mặc định: true)     |
| `options.settings.analyzePageSpeed`    | boolean | ❌       | Phân tích tốc độ trang (mặc định: true)       |

#### **Response (201):**

```json
{
  "id": "audit-550e8400-e29b-41d4-a716-446655440000",
  "projectId": "project-uuid",
  "status": "pending",
  "message": "Audit queued for processing",
  "estimated_duration": "2-5 minutes",
  "createdAt": "2025-08-05T10:30:00.000Z"
}
```

---

### 2. 📊 **Lấy trạng thái phân tích**

Kiểm tra tiến độ và trạng thái của quá trình phân tích.

#### **Endpoint:**

```http
GET /api/v1/audits/{auditId}/status
```

#### **Response (200):**

```json
{
  "id": "audit-550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": 65,
  "created_at": "2025-08-05T10:30:00.000Z",
  "completed_at": null,
  "config": {
    "auditType": "full",
    "includeImages": true,
    "checkMobileFriendly": true
  }
}
```

#### **Status Values:**

- `pending`: Đang chờ xử lý
- `processing`: Đang phân tích
- `completed`: Hoàn thành
- `failed`: Thất bại
- `cancelled`: Đã hủy

---

### 3. 🎯 **Lấy kết quả phân tích chi tiết**

Nhận kết quả đầy đủ sau khi phân tích hoàn thành.

#### **Endpoint:**

```http
GET /api/v1/audits/{auditId}/results
```

#### **Response (200):**

```json
{
  "id": "audit-550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "overall_score": 87,
  "analysis_url": "https://example.com/page-to-analyze",
  "results": {
    "technical_seo": {
      "score": 92,
      "issues": [
        {
          "type": "warning",
          "title": "Meta Description Too Short",
          "description": "Meta description is only 98 characters",
          "impact": "medium",
          "recommendation": "Expand meta description to 150-160 characters",
          "affected_elements": []
        }
      ],
      "metrics": {
        "title_length": 58,
        "meta_description_length": 98,
        "h1_count": 1,
        "h2_count": 5,
        "canonical_url": "https://example.com/page-to-analyze",
        "schema_markup_count": 2,
        "hreflang_tags": 0
      }
    },
    "content_analysis": {
      "score": 85,
      "metrics": {
        "word_count": 1247,
        "readability_score": 75,
        "keyword_density": 2.3,
        "internal_links": 12,
        "external_links": 8
      },
      "issues": [
        {
          "type": "info",
          "title": "Good Content Length",
          "description": "Page has optimal content length",
          "impact": "low",
          "recommendation": "Continue maintaining quality content"
        }
      ]
    },
    "image_optimization": {
      "score": 78,
      "metrics": {
        "total_images": 15,
        "images_without_alt": 3,
        "images_optimized": 12
      },
      "issues": [
        {
          "type": "error",
          "title": "Missing Image Alt Text",
          "description": "3 out of 15 images are missing alt text",
          "impact": "high",
          "recommendation": "Add descriptive alt text to all images for accessibility and SEO",
          "affected_elements": [
            "img[src='/hero-banner.jpg']",
            "img[src='/product-1.png']",
            "img[src='/testimonial.jpg']"
          ]
        }
      ]
    },
    "performance": {
      "score": 82,
      "metrics": {
        "page_load_time": 2.1,
        "core_web_vitals": {
          "lcp": 1.8,
          "fid": 35,
          "cls": 0.08
        },
        "mobile_friendly": true
      },
      "issues": []
    },
    "social_media": {
      "score": 90,
      "metrics": {
        "og_title": "Complete Guide to SEO in 2025",
        "og_description": "Learn the latest SEO strategies and best practices...",
        "og_image": "https://example.com/og-image.jpg",
        "twitter_card": "summary_large_image"
      },
      "issues": []
    }
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "Technical SEO",
      "title": "Fix Missing Alt Text",
      "description": "Add alt text to 3 images to improve accessibility and SEO",
      "effort": "Low",
      "impact": "High"
    },
    {
      "priority": "medium",
      "category": "Content",
      "title": "Expand Meta Description",
      "description": "Increase meta description length to 150-160 characters",
      "effort": "Low",
      "impact": "Medium"
    }
  ],
  "createdAt": "2025-08-05T10:30:00.000Z",
  "completedAt": "2025-08-05T10:33:42.000Z"
}
```

---

### 4. 📋 **Lấy danh sách audits**

Xem lịch sử các lần phân tích cho project.

#### **Endpoint:**

```http
GET /api/v1/projects/{projectId}/audits?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

#### **Query Parameters:**

| Parameter   | Type   | Description                                                 |
| ----------- | ------ | ----------------------------------------------------------- |
| `page`      | number | Trang hiện tại (mặc định: 1)                                |
| `limit`     | number | Số items per page (mặc định: 10)                            |
| `sortBy`    | string | Sắp xếp theo field (`createdAt`, `status`, `overall_score`) |
| `sortOrder` | string | Thứ tự (`asc`, `desc`)                                      |

#### **Response (200):**

```json
{
  "audits": [
    {
      "id": "audit-uuid-1",
      "status": "completed",
      "overall_score": 87,
      "analysis_url": "https://example.com/page-1",
      "createdAt": "2025-08-05T10:30:00.000Z",
      "completedAt": "2025-08-05T10:33:42.000Z"
    },
    {
      "id": "audit-uuid-2",
      "status": "processing",
      "progress": 45,
      "analysis_url": "https://example.com/page-2",
      "createdAt": "2025-08-05T09:15:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### 5. 🗑️ **Xóa audit**

Xóa một audit (chỉ được phép khi audit không đang chạy).

#### **Endpoint:**

```http
DELETE /api/v1/audits/{auditId}
```

#### **Response (200):**

```json
{
  "success": true,
  "message": "Audit deleted successfully"
}
```

---

## 🎯 Scoring System

### **Overall Score Calculation:**

| Score Range | Rating    | Description                             |
| ----------- | --------- | --------------------------------------- |
| 90-100      | Excellent | Trang web được tối ưu rất tốt           |
| 80-89       | Good      | Trang web tốt, cần một số cải thiện nhỏ |
| 70-79       | Fair      | Cần cải thiện một số vấn đề quan trọng  |
| 60-69       | Poor      | Nhiều vấn đề cần được khắc phục         |
| 0-59        | Critical  | Cần tối ưu hóa toàn diện                |

### **Individual Category Scores:**

- **Technical SEO**: Title tags, meta descriptions, heading structure, technical elements
- **Content Analysis**: Word count, readability, keyword optimization
- **Image Optimization**: Alt text, image sizes, optimization
- **Performance**: Page speed, Core Web Vitals, mobile-friendliness
- **Social Media**: Open Graph, Twitter Cards, social sharing optimization

---

## 🚨 Issue Types & Priority

### **Issue Types:**

- `error`: Vấn đề nghiêm trọng cần khắc phục ngay
- `warning`: Vấn đề quan trọng nên được xử lý
- `info`: Thông tin tham khảo hoặc suggestions

### **Impact Levels:**

- `high`: Ảnh hưởng lớn đến SEO ranking
- `medium`: Ảnh hưởng trung bình
- `low`: Ảnh hưởng nhỏ nhưng vẫn nên khắc phục

### **Effort Levels:**

- `Low`: Dễ khắc phục, ít thời gian
- `Medium`: Cần effort trung bình
- `High`: Cần nhiều thời gian và effort

---

## 💻 Integration Examples

### **JavaScript/TypeScript**

```javascript
class OnPageSEOChecker {
  constructor(baseURL, authToken) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  async analyzeePage(projectId, url, options = {}) {
    const response = await fetch(
      `${this.baseURL}/api/v1/projects/${projectId}/audits/comprehensive`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          options: {
            auditType: options.auditType || 'full',
            settings: {
              crawlDepth: options.crawlDepth || 1,
              includeImages: options.includeImages !== false,
              checkMobileFriendly: options.checkMobileFriendly !== false,
              analyzePageSpeed: options.analyzePageSpeed !== false,
            },
          },
        }),
      },
    );

    return await response.json();
  }

  async checkStatus(auditId) {
    const response = await fetch(
      `${this.baseURL}/api/v1/audits/${auditId}/status`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      },
    );

    return await response.json();
  }

  async getResults(auditId) {
    const response = await fetch(
      `${this.baseURL}/api/v1/audits/${auditId}/results`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      },
    );

    return await response.json();
  }

  async waitForCompletion(auditId, pollInterval = 5000) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.checkStatus(auditId);

          if (status.status === 'completed') {
            const results = await this.getResults(auditId);
            resolve(results);
          } else if (status.status === 'failed') {
            reject(new Error('Audit failed'));
          } else {
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

// Usage Example
const seoChecker = new OnPageSEOChecker(
  'https://api.yourapp.com',
  'your-jwt-token',
);

async function analyzePage() {
  try {
    // Start analysis
    const audit = await seoChecker.analyzeePage(
      'project-uuid',
      'https://example.com/page-to-analyze',
      {
        auditType: 'full',
        includeImages: true,
        checkMobileFriendly: true,
      },
    );

    console.log('Audit started:', audit.id);

    // Wait for completion
    const results = await seoChecker.waitForCompletion(audit.id);

    console.log('Overall Score:', results.overall_score);
    console.log('Technical SEO Score:', results.results.technical_seo.score);

    // Display issues
    results.results.technical_seo.issues.forEach((issue) => {
      console.log(`${issue.type.toUpperCase()}: ${issue.title}`);
      console.log(`Recommendation: ${issue.recommendation}`);
    });
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}
```

### **Python**

```python
import requests
import time
import json

class OnPageSEOChecker:
    def __init__(self, base_url, auth_token):
        self.base_url = base_url
        self.auth_token = auth_token
        self.headers = {
            'Authorization': f'Bearer {auth_token}',
            'Content-Type': 'application/json'
        }

    def analyze_page(self, project_id, url, options=None):
        if options is None:
            options = {}

        payload = {
            'url': url,
            'options': {
                'auditType': options.get('audit_type', 'full'),
                'settings': {
                    'crawlDepth': options.get('crawl_depth', 1),
                    'includeImages': options.get('include_images', True),
                    'checkMobileFriendly': options.get('check_mobile_friendly', True),
                    'analyzePageSpeed': options.get('analyze_page_speed', True)
                }
            }
        }

        response = requests.post(
            f'{self.base_url}/api/v1/projects/{project_id}/audits/comprehensive',
            headers=self.headers,
            json=payload
        )

        return response.json()

    def check_status(self, audit_id):
        response = requests.get(
            f'{self.base_url}/api/v1/audits/{audit_id}/status',
            headers=self.headers
        )
        return response.json()

    def get_results(self, audit_id):
        response = requests.get(
            f'{self.base_url}/api/v1/audits/{audit_id}/results',
            headers=self.headers
        )
        return response.json()

    def wait_for_completion(self, audit_id, poll_interval=5):
        while True:
            status = self.check_status(audit_id)

            if status['status'] == 'completed':
                return self.get_results(audit_id)
            elif status['status'] == 'failed':
                raise Exception('Audit failed')

            time.sleep(poll_interval)

# Usage Example
seo_checker = OnPageSEOChecker('https://api.yourapp.com', 'your-jwt-token')

try:
    # Start analysis
    audit = seo_checker.analyze_page(
        'project-uuid',
        'https://example.com/page-to-analyze',
        {
            'audit_type': 'full',
            'include_images': True,
            'check_mobile_friendly': True
        }
    )

    print(f"Audit started: {audit['id']}")

    # Wait for completion
    results = seo_checker.wait_for_completion(audit['id'])

    print(f"Overall Score: {results['overall_score']}")
    print(f"Technical SEO Score: {results['results']['technical_seo']['score']}")

    # Display high-priority issues
    for issue in results['results']['technical_seo']['issues']:
        if issue['impact'] == 'high':
            print(f"❌ {issue['title']}: {issue['recommendation']}")

except Exception as e:
    print(f"Analysis failed: {e}")
```

### **cURL Examples**

```bash
# 1. Start page analysis
curl -X POST "https://api.yourapp.com/api/v1/projects/project-uuid/audits/comprehensive" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/page-to-analyze",
    "options": {
      "auditType": "full",
      "settings": {
        "crawlDepth": 1,
        "includeImages": true,
        "checkMobileFriendly": true,
        "analyzePageSpeed": true
      }
    }
  }'

# 2. Check status
curl -X GET "https://api.yourapp.com/api/v1/audits/audit-uuid/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Get results
curl -X GET "https://api.yourapp.com/api/v1/audits/audit-uuid/results" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. List project audits
curl -X GET "https://api.yourapp.com/api/v1/projects/project-uuid/audits?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ⚠️ Error Handling

### **Common Error Responses:**

#### **400 Bad Request**

```json
{
  "success": false,
  "message": "Invalid URL format",
  "statusCode": 400,
  "error": "Bad Request",
  "details": ["URL must be a valid HTTP/HTTPS URL"]
}
```

#### **401 Unauthorized**

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "statusCode": 401,
  "error": "Unauthorized"
}
```

#### **403 Forbidden**

```json
{
  "success": false,
  "message": "Audit limit reached for this month",
  "statusCode": 403,
  "error": "Forbidden",
  "details": {
    "current_usage": 10,
    "monthly_limit": 10,
    "reset_date": "2025-09-01T00:00:00.000Z"
  }
}
```

#### **404 Not Found**

```json
{
  "success": false,
  "message": "Audit not found",
  "statusCode": 404,
  "error": "Not Found"
}
```

#### **429 Too Many Requests**

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "statusCode": 429,
  "error": "Too Many Requests",
  "details": {
    "retry_after": 60
  }
}
```

---

## 📊 Rate Limits & Quotas

### **Rate Limits:**

- **Analysis Requests**: 10 requests/minute per user
- **Status Checks**: 60 requests/minute per user
- **Results Retrieval**: 30 requests/minute per user

### **Monthly Quotas:**

| Plan         | Monthly Audits | Concurrent Audits |
| ------------ | -------------- | ----------------- |
| Free         | 5              | 1                 |
| Starter      | 50             | 2                 |
| Professional | 200            | 5                 |
| Enterprise   | Unlimited      | 10                |

---

## 🔧 Best Practices

### **1. Efficient Usage:**

- ✅ Cache results when possible
- ✅ Use appropriate poll intervals (5-10 seconds)
- ✅ Implement exponential backoff for rate limits
- ✅ Monitor your quota usage

### **2. Error Handling:**

- ✅ Always check response status codes
- ✅ Handle network timeouts gracefully
- ✅ Implement retry logic for transient errors
- ✅ Log errors for debugging

### **3. Performance Optimization:**

- ✅ Don't poll status too frequently
- ✅ Use webhooks if available (coming soon)
- ✅ Batch multiple page analyses when possible
- ✅ Cache results for repeated analysis

### **4. Security:**

- ✅ Never expose JWT tokens in client-side code
- ✅ Use HTTPS for all requests
- ✅ Rotate tokens regularly
- ✅ Validate URLs before submission

---

## 🆕 Upcoming Features

### **Q4 2025:**

- 🔔 **Webhooks**: Real-time notifications when analysis completes
- 📱 **Mobile-First Analysis**: Enhanced mobile SEO scoring
- 🤖 **AI-Powered Recommendations**: Smarter optimization suggestions
- 📊 **Comparative Analysis**: Compare multiple pages side-by-side

### **Q1 2026:**

- 🔍 **Advanced Schema Detection**: More schema types support
- 🌐 **Multi-Language SEO**: International SEO analysis
- 📈 **Historical Tracking**: Track SEO improvements over time
- 🎯 **Competitor Comparison**: Compare your pages with competitors

---

## 📞 Support & Resources

### **Documentation:**

- 📖 [Main API Documentation](./API_DOCUMENTATION.md)
- 🔧 [Technical SEO Guide](./TECHNICAL_SEO_GUIDE.md)
- 📊 [Performance Optimization](./PERFORMANCE_GUIDE.md)

### **Support Channels:**

- 📧 **Email**: api-support@yourapp.com
- 💬 **Chat**: Available in developer portal
- 📚 **Knowledge Base**: https://docs.yourapp.com
- 🔄 **Status Page**: https://status.yourapp.com

### **Community:**

- 👥 **Developer Forum**: https://forum.yourapp.com
- 💻 **GitHub**: https://github.com/yourapp/seo-api
- 🐦 **Twitter**: @YourAppAPI

---

## 📋 Changelog

### **v2.1.0** (2025-08-05)

- ✅ Added comprehensive on-page SEO analysis
- ✅ Enhanced scoring algorithm
- ✅ Improved performance metrics
- ✅ Better mobile-friendly detection

### **v2.0.0** (2025-07-20)

- ✅ Complete API redesign
- ✅ Added real-time processing
- ✅ Enhanced error handling
- ✅ Improved response format

### **v1.5.0** (2025-07-01)

- ✅ Initial on-page SEO checker release
- ✅ Basic technical SEO analysis
- ✅ Image optimization checks
- ✅ Content quality assessment

---

_Last updated: August 5, 2025_
_API Version: v2.1.0_
