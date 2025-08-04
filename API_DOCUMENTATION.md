# SEO CMS Backend API Documentation

## Tổng quan

SEO CMS Backend là một hệ thống quản lý SEO toàn diện được xây dựng với NestJS, cung cấp các API để quản lý và phân tích SEO cho websites. Hệ thống hỗ trợ nhiều tính năng từ phân tích từ khóa, theo dõi thứ hạng, phân tích đối thủ cạnh tranh đến quản lý nội dung và báo cáo SEO.

## Thông tin chung

- **Framework**: NestJS
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: JWT (JSON Web Token)
- **Documentation**: Swagger/OpenAPI
- **API Version**: v1
- **Base URL**: `http://localhost:3000` (development)

## Authentication

Hệ thống sử dụng JWT authentication. Để truy cập các API được bảo vệ, bạn cần:

1. Đăng nhập qua `/auth/login` để nhận JWT token
2. Thêm header `Authorization: Bearer <token>` vào các request

## Modules & APIs

### 1. 🔐 Authentication (`/auth`)

Module xử lý đăng ký, đăng nhập và quản lý phiên làm việc.

**Endpoints:**

- `POST /auth/register` - Đăng ký tài khoản mới
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Làm mới token
- `GET /auth/profile` - Lấy thông tin profile

### 2. 👥 Users (`/users`)

Quản lý thông tin người dùng và cài đặt tài khoản.

**Endpoints:**

- `GET /users` - Lấy danh sách users
- `GET /users/:id` - Lấy thông tin user theo ID
- `PUT /users/:id` - Cập nhật thông tin user
- `DELETE /users/:id` - Xóa user
- `GET /users/:id/projects` - Lấy projects của user

### 3. 📊 Projects (`/projects`)

Quản lý các dự án SEO.

**Endpoints:**

- `GET /projects` - Lấy danh sách projects
- `POST /projects` - Tạo project mới
- `GET /projects/:id` - Lấy chi tiết project
- `PUT /projects/:id` - Cập nhật project
- `DELETE /projects/:id` - Xóa project
- `GET /projects/:id/overview` - Tổng quan project

### 4. 🔍 Keywords (`/keywords` & `/projects/:projectId/keywords`)

Quản lý từ khóa và theo dõi thứ hạng.

**Endpoints:**

- `GET /projects/:projectId/keywords` - Lấy từ khóa của project
- `POST /projects/:projectId/keywords` - Thêm từ khóa mới
- `PUT /projects/:projectId/keywords/:id` - Cập nhật từ khóa
- `DELETE /projects/:projectId/keywords/:id` - Xóa từ khóa
- `GET /keywords/search` - Tìm kiếm từ khóa
- `GET /keywords/:id/rankings` - Lịch sử thứ hạng từ khóa

### 5. 📈 Rankings (`/rankings`)

Theo dõi và phân tích thứ hạng từ khóa.

**Endpoints:**

- `GET /rankings` - Lấy dữ liệu rankings
- `POST /rankings/track` - Bắt đầu theo dõi rankings
- `GET /rankings/history` - Lịch sử thay đổi rankings
- `GET /rankings/analytics` - Phân tích rankings

### 6. 🔬 Organic Research (`/api/v1/seo/organic-research`)

Nghiên cứu và phân tích organic search performance.

**Endpoints:**

- `GET /api/v1/seo/organic-research/domain/:domain` - Phân tích domain
- `GET /api/v1/seo/organic-research/keywords/:domain` - Từ khóa organic
- `GET /api/v1/seo/organic-research/competitors/:domain` - Phát hiện đối thủ
- `GET /api/v1/seo/organic-research/top-pages/:domain` - Top pages analysis
- `GET /api/v1/seo/organic-research/api-limits` - Kiểm tra API limits

### 7. 🏆 Competitors (`/projects/:projectId/competitors`)

Phân tích đối thủ cạnh tranh.

**Endpoints:**

- `GET /projects/:projectId/competitors` - Danh sách competitors
- `POST /projects/:projectId/competitors` - Thêm competitor
- `GET /projects/:projectId/competitors/:id` - Chi tiết competitor
- `DELETE /projects/:projectId/competitors/:id` - Xóa competitor
- `GET /projects/:projectId/competitors/:id/analysis` - Phân tích competitor

### 8. 🔗 Backlinks (`/projects/:projectId/backlinks`)

Quản lý và phân tích backlinks.

**Endpoints:**

- `GET /projects/:projectId/backlinks` - Danh sách backlinks
- `POST /projects/:projectId/backlinks` - Thêm backlink
- `GET /projects/:projectId/backlinks/analysis` - Phân tích backlinks
- `GET /projects/:projectId/backlinks/opportunities` - Cơ hội backlinks
- `DELETE /projects/:projectId/backlinks/:id` - Xóa backlink

### 9. 🛠️ Audits (`/projects/:projectId/audits` & `/audits`)

SEO audit và phân tích kỹ thuật website.

**Endpoints:**

- `POST /projects/:projectId/audits` - Tạo audit mới
- `GET /projects/:projectId/audits` - Lấy danh sách audits
- `GET /projects/:projectId/audits/:id` - Chi tiết audit
- `GET /audits/:id/results` - Kết quả audit
- `POST /audits/lighthouse` - Chạy Lighthouse audit
- `POST /audits/seo-analysis` - Phân tích SEO

### 10. 📝 Content (`/api/v1/projects/:projectId/content`)

Quản lý nội dung và tối ưu hóa SEO content.

**Endpoints:**

- `GET /api/v1/projects/:projectId/content` - Danh sách content
- `POST /api/v1/projects/:projectId/content` - Tạo content mới
- `GET /api/v1/projects/:projectId/content/:id` - Chi tiết content
- `PUT /api/v1/projects/:projectId/content/:id` - Cập nhật content
- `DELETE /api/v1/projects/:projectId/content/:id` - Xóa content
- `POST /api/v1/projects/:projectId/content/:id/optimize` - Tối ưu content

### 11. 🌐 Domain Overview (`/api/v1/seo/domain-overview`)

Tổng quan về domain và hiệu suất SEO.

**Endpoints:**

- `GET /api/v1/seo/domain-overview/:domain` - Tổng quan domain
- `GET /api/v1/seo/domain-overview/:domain/metrics` - Metrics chi tiết
- `GET /api/v1/seo/domain-overview/:domain/history` - Lịch sử domain

### 12. 🧠 AI Tools (`/ai` & `/api/v1/ai`)

AI-powered SEO tools và suggestions.

**Endpoints:**

- `POST /ai/content/generate` - Tạo nội dung bằng AI
- `POST /ai/keywords/suggest` - Gợi ý từ khóa
- `POST /ai/meta/optimize` - Tối ưu meta tags
- `POST /api/v1/ai/analyze` - Phân tích AI
- `POST /api/v1/ai/recommendations` - Đề xuất AI

### 13. 📚 Topic Research (`/api/v1/seo/topic-research`)

Nghiên cứu chủ đề và content planning.

**Endpoints:**

- `GET /api/v1/seo/topic-research/topics` - Tìm kiếm topics
- `GET /api/v1/seo/topic-research/trending` - Topics trending
- `GET /api/v1/seo/topic-research/questions` - Câu hỏi phổ biến
- `GET /api/v1/seo/topic-research/content-gaps` - Phân tích content gaps

### 14. 🔔 Notifications (`/notifications`)

Hệ thống thông báo và alerts.

**Endpoints:**

- `GET /notifications` - Danh sách notifications
- `POST /notifications` - Tạo notification
- `PUT /notifications/:id/read` - Đánh dấu đã đọc
- `DELETE /notifications/:id` - Xóa notification

### 15. 📊 Reports (`/reports`)

Tạo và quản lý báo cáo SEO.

**Endpoints:**

- `GET /reports` - Danh sách reports
- `POST /reports` - Tạo report mới
- `GET /reports/:id` - Chi tiết report
- `GET /reports/:id/export` - Export report
- `DELETE /reports/:id` - Xóa report

### 16. 💳 Subscriptions (`/subscriptions`)

Quản lý gói đăng ký và billing.

**Endpoints:**

- `GET /subscriptions` - Thông tin subscription
- `POST /subscriptions/upgrade` - Nâng cấp gói
- `POST /subscriptions/cancel` - Hủy subscription
- `GET /subscriptions/usage` - Thống kê sử dụng

### 17. 🔗 Integrations (`/integrations`)

Tích hợp với các dịch vụ bên thứ ba.

**Endpoints:**

- `GET /integrations` - Danh sách integrations
- `POST /integrations` - Thêm integration mới
- `PUT /integrations/:id` - Cập nhật integration
- `DELETE /integrations/:id` - Xóa integration
- `POST /integrations/:id/test` - Test kết nối

## Định dạng Response

### Thành công (2xx)

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Lỗi (4xx, 5xx)

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {...}
  }
}
```

### Pagination

```json
{
  "data": [...],
  "total": 1000,
  "page": 1,
  "limit": 20,
  "hasNext": true,
  "hasPrev": false
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Rate Limiting

API có giới hạn request rate để đảm bảo hiệu suất:

- **Free tier**: 100 requests/hour
- **Pro tier**: 1000 requests/hour
- **Enterprise**: Unlimited

## Swagger Documentation

Chi tiết đầy đủ về các API có thể xem tại:

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## SDK & Libraries

Đang phát triển SDK cho các ngôn ngữ:

- JavaScript/TypeScript
- Python
- PHP
- Ruby

## Changelog

### v1.0.0 (Current)

- ✅ Authentication & Authorization
- ✅ Project Management
- ✅ Keywords & Rankings Tracking
- ✅ Organic Research
- ✅ Competitor Analysis
- ✅ Backlinks Management
- ✅ SEO Audits
- ✅ Content Management
- ✅ AI-powered Tools
- ✅ Reports & Analytics

### Upcoming Features

- 🔄 Advanced Analytics Dashboard
- 🔄 White-label Solutions
- 🔄 API v2 with GraphQL
- 🔄 Real-time Notifications
- 🔄 Mobile App APIs

## Support

Để được hỗ trợ về API:

- **Email**: support@seo-cms.com
- **Documentation**: [Link to detailed docs]
- **Status Page**: [Link to status page]

---

**Last Updated**: August 4, 2025
**API Version**: v1.0.0
