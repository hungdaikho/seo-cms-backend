# CMS API Documentation

Tài liệu API cho module quản lý nội dung CMS của RankTracker Pro.

## Tổng quan

Module CMS cung cấp các API để quản lý các trang thông tin công ty như About Us, Privacy Policy, Legal Info, Security Info, Contact Us. Hệ thống được chia thành hai nhóm API:

- **Public APIs**: Dành cho client/frontend hiển thị nội dung
- **Admin APIs**: Dành cho admin quản lý nội dung

## Base URL

```
/api/cms
```

---

## 🌐 PUBLIC APIs

### 1. Lấy danh sách trang công khai

**GET** `/cms/pages/public`

Lấy danh sách các trang đã được publish.

**Query Parameters:**

- `pageType` (optional): Lọc theo loại trang
  - `about_us`
  - `legal_info`
  - `privacy_policy`
  - `cookie_settings`
  - `security_info`
  - `contact_us`
  - `terms_of_service`
  - `custom`

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "About Us",
    "slug": "about-us",
    "pageType": "about_us",
    "content": "<h2>About RankTracker Pro</h2>...",
    "excerpt": "Learn about RankTracker Pro...",
    "metaTitle": "About RankTracker Pro - SEO Management Platform",
    "metaDescription": "Discover RankTracker Pro...",
    "metaKeywords": "SEO platform, rank tracking...",
    "status": "published",
    "sortOrder": 0,
    "publishedAt": "2025-08-19T10:00:00Z",
    "createdAt": "2025-08-19T09:00:00Z",
    "updatedAt": "2025-08-19T10:00:00Z",
    "sections": [
      {
        "id": "uuid",
        "title": "Mission Statement",
        "content": "<p>Our mission is...</p>",
        "sectionType": "text",
        "settings": {},
        "sortOrder": 0,
        "isActive": true
      }
    ]
  }
]
```

### 2. Lấy trang theo slug

**GET** `/cms/pages/public/:slug`

Lấy chi tiết một trang theo slug (chỉ trang đã publish).

**Path Parameters:**

- `slug`: Slug của trang (ví dụ: "about-us", "privacy-policy")

**Response:**

```json
{
  "id": "uuid",
  "title": "About Us",
  "slug": "about-us",
  "pageType": "about_us",
  "content": "<h2>About RankTracker Pro</h2>...",
  "excerpt": "Learn about RankTracker Pro...",
  "metaTitle": "About RankTracker Pro - SEO Management Platform",
  "metaDescription": "Discover RankTracker Pro...",
  "metaKeywords": "SEO platform, rank tracking...",
  "status": "published",
  "sortOrder": 0,
  "publishedAt": "2025-08-19T10:00:00Z",
  "createdAt": "2025-08-19T09:00:00Z",
  "updatedAt": "2025-08-19T10:00:00Z",
  "sections": [
    {
      "id": "uuid",
      "title": "Mission Statement",
      "content": "<p>Our mission is...</p>",
      "sectionType": "text",
      "settings": {},
      "sortOrder": 0,
      "isActive": true
    }
  ]
}
```

**Error Responses:**

- `404`: Trang không tồn tại hoặc chưa được publish

### 3. Gửi form liên hệ

**POST** `/cms/contact`

Gửi thông tin liên hệ từ contact form.

**Request Body:**

```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "+84901234567",
  "subject": "Inquiry about SEO services",
  "message": "I would like to know more about your SEO tools...",
  "company": "ABC Company",
  "website": "https://abc-company.com",
  "contactType": "sales"
}
```

**Required Fields:**

- `name`: Tên người liên hệ (max 100 ký tự)
- `email`: Email hợp lệ (max 255 ký tự)
- `message`: Nội dung tin nhắn (max 2000 ký tự)

**Optional Fields:**

- `phone`: Số điện thoại (max 20 ký tự)
- `subject`: Tiêu đề (max 200 ký tự)
- `company`: Tên công ty (max 100 ký tự)
- `website`: Website (max 255 ký tự)
- `contactType`: Loại liên hệ (`general`, `support`, `sales`, `partnership`)

**Response:**

```json
{
  "id": "uuid",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "+84901234567",
  "subject": "Inquiry about SEO services",
  "message": "I would like to know more about your SEO tools...",
  "company": "ABC Company",
  "website": "https://abc-company.com",
  "contactType": "sales",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "isRead": false,
  "isReplied": false,
  "createdAt": "2025-08-19T10:30:00Z"
}
```

---

## 🔐 ADMIN APIs

**Lưu ý:** Tất cả Admin APIs yêu cầu authentication với JWT token và quyền admin.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### CMS Pages Management

#### 1. Tạo trang CMS mới

**POST** `/cms/pages`

**Request Body:**

```json
{
  "title": "Terms of Service",
  "slug": "terms-of-service",
  "pageType": "terms_of_service",
  "content": "<h2>Terms of Service</h2><p>Content here...</p>",
  "excerpt": "Our terms of service...",
  "metaTitle": "Terms of Service - RankTracker Pro",
  "metaDescription": "Read our terms of service...",
  "metaKeywords": "terms, service, legal",
  "status": "draft",
  "sortOrder": 5
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Terms of Service",
  "slug": "terms-of-service",
  "pageType": "terms_of_service",
  "content": "<h2>Terms of Service</h2><p>Content here...</p>",
  "excerpt": "Our terms of service...",
  "metaTitle": "Terms of Service - RankTracker Pro",
  "metaDescription": "Read our terms of service...",
  "metaKeywords": "terms, service, legal",
  "status": "draft",
  "isSystem": false,
  "sortOrder": 5,
  "lastEditedBy": "admin-user-id",
  "publishedAt": null,
  "createdAt": "2025-08-19T11:00:00Z",
  "updatedAt": "2025-08-19T11:00:00Z",
  "lastEditor": {
    "id": "admin-user-id",
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "sections": []
}
```

#### 2. Lấy danh sách trang CMS (Admin)

**GET** `/cms/pages`

**Query Parameters:**

- `status` (optional): Lọc theo trạng thái (`draft`, `published`, `archived`)
- `pageType` (optional): Lọc theo loại trang

**Response:** Tương tự API public nhưng bao gồm cả trang draft và thông tin editor.

#### 3. Lấy trang theo ID

**GET** `/cms/pages/:id`

**Response:** Chi tiết trang bao gồm cả sections và thông tin editor.

#### 4. Cập nhật trang CMS

**PATCH** `/cms/pages/:id`

**Request Body:** Tương tự create nhưng tất cả fields đều optional.

**Response:** Trang đã được cập nhật.

#### 5. Xóa trang CMS

**DELETE** `/cms/pages/:id`

**Response:**

```json
{
  "message": "Page deleted successfully"
}
```

**Error:** Không thể xóa trang hệ thống (`isSystem: true`).

### Page Sections Management

#### 1. Tạo section cho trang

**POST** `/cms/sections`

**Request Body:**

```json
{
  "pageId": "page-uuid",
  "title": "Company History",
  "content": "<p>Founded in 2020...</p>",
  "sectionType": "text",
  "settings": {
    "backgroundColor": "#f5f5f5",
    "textAlign": "left"
  },
  "sortOrder": 1,
  "isActive": true
}
```

#### 2. Lấy sections của trang

**GET** `/cms/pages/:pageId/sections`

#### 3. Cập nhật section

**PATCH** `/cms/sections/:id`

#### 4. Xóa section

**DELETE** `/cms/sections/:id`

### Contact Submissions Management

#### 1. Lấy danh sách liên hệ

**GET** `/cms/contacts`

**Query Parameters:**

- `page` (default: 1): Trang hiện tại
- `limit` (default: 20): Số item mỗi trang
- `isRead` (optional): Lọc theo trạng thái đã đọc (`true`/`false`)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "phone": "+84901234567",
      "subject": "Inquiry about SEO services",
      "message": "I would like to know more...",
      "company": "ABC Company",
      "website": "https://abc-company.com",
      "contactType": "sales",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "isRead": false,
      "isReplied": false,
      "repliedAt": null,
      "notes": null,
      "createdAt": "2025-08-19T10:30:00Z",
      "replier": null
    }
  ],
  "pagination": {
    "total": 45,
    "skip": 0,
    "take": 20,
    "hasMore": true
  }
}
```

#### 2. Lấy liên hệ theo ID

**GET** `/cms/contacts/:id`

#### 3. Đánh dấu đã đọc

**PATCH** `/cms/contacts/:id/read`

#### 4. Đánh dấu đã trả lời

**PATCH** `/cms/contacts/:id/reply`

**Request Body:**

```json
{
  "notes": "Đã gọi điện và giải đáp thắc mắc của khách hàng"
}
```

#### 5. Xóa liên hệ

**DELETE** `/cms/contacts/:id`

### Statistics

#### Thống kê CMS

**GET** `/cms/statistics`

**Response:**

```json
{
  "pages": {
    "total": 6,
    "published": 5,
    "draft": 1,
    "archived": 0
  },
  "contacts": {
    "total": 45,
    "unread": 12,
    "unreplied": 8
  }
}
```

---

## Page Types

Hệ thống hỗ trợ các loại trang sau:

- `about_us`: Giới thiệu về công ty
- `legal_info`: Thông tin pháp lý
- `privacy_policy`: Chính sách bảo mật
- `cookie_settings`: Cài đặt cookie
- `security_info`: Thông tin bảo mật
- `contact_us`: Liên hệ
- `terms_of_service`: Điều khoản dịch vụ
- `custom`: Trang tùy chỉnh

## Page Status

- `draft`: Bản nháp (chỉ admin thấy)
- `published`: Đã công bố (public)
- `archived`: Đã lưu trữ

## Section Types

- `text`: Nội dung văn bản
- `image`: Hình ảnh
- `video`: Video
- `contact_form`: Form liên hệ
- `faq`: Câu hỏi thường gặp

## Error Codes

### Common Errors

- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `401 Unauthorized`: Chưa đăng nhập
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Tài nguyên không tồn tại
- `409 Conflict`: Slug đã tồn tại

### Specific Error Messages

```json
{
  "statusCode": 409,
  "message": "Slug đã tồn tại",
  "error": "Conflict"
}
```

```json
{
  "statusCode": 400,
  "message": "Không thể xóa trang hệ thống",
  "error": "Bad Request"
}
```

---

## Frontend Implementation Examples

### React Hook để lấy trang CMS

```typescript
const useCmsPage = (slug: string) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/cms/pages/public/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPage(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [slug]);

  return { page, loading, error };
};
```

### Contact Form Component

```typescript
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    // ... other fields
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Gửi liên hệ thành công!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

---

## Database Schema

Hệ thống sử dụng 3 bảng chính:

1. **cms_pages**: Lưu trữ thông tin trang
2. **cms_page_sections**: Lưu trữ các sections của trang
3. **contact_submissions**: Lưu trữ form liên hệ

Chi tiết schema có thể xem trong file `prisma/schema.prisma`.
