# 📊 ADMIN DASHBOARD API DOCUMENTATION

## 📋 Tổng quan

Tài liệu này mô tả các API dành cho Admin Dashboard, bao gồm quản lý người dùng và gói đăng ký (price plans). Tất cả API đều yêu cầu xác thực JWT và quyền Admin.

### 🔐 Authentication

- **Yêu cầu**: Bearer Token trong header
- **Quyền**: Admin hoặc Super Admin
- **Header**: `Authorization: Bearer <JWT_TOKEN>`

---

## 👥 USER MANAGEMENT APIs

### 1. Dashboard Statistics

**GET** `/api/v1/admin/dashboard/stats`

Lấy thống kê tổng quan cho dashboard admin.

**Response:**

```json
{
  "totalUsers": 1250,
  "activeUsers": 1100,
  "inactiveUsers": 150,
  "totalSubscriptions": 850,
  "activeSubscriptions": 800,
  "expiredSubscriptions": 50,
  "totalRevenue": 125000.5,
  "monthlyRevenue": 15600.25
}
```

### 2. Get All Users

**GET** `/api/v1/admin/users`

Lấy danh sách tất cả người dùng với phân trang và filter.

**Query Parameters:**

```typescript
{
  page?: number;        // Trang hiện tại (default: 1)
  limit?: number;       // Số item/trang (default: 10, max: 100)
  search?: string;      // Tìm kiếm theo email hoặc tên
  role?: UserRole;      // Filter theo role: user, admin, super_admin
  isActive?: boolean;   // Filter theo trạng thái active
}
```

**Example Request:**

```
GET /api/v1/admin/users?page=1&limit=20&search=john&role=user&isActive=true
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "isActive": true,
      "phone": "+1234567890",
      "timezone": "UTC",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-08-18T15:45:00Z",
      "lastLoginAt": "2024-08-18T12:00:00Z"
    }
  ],
  "meta": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "totalPages": 63
  }
}
```

### 3. Get User by ID

**GET** `/api/v1/admin/users/{id}`

Lấy thông tin chi tiết của một người dùng.

**Parameters:**

- `id` (UUID) - ID của người dùng

**Response:**

```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "isActive": true,
  "phone": "+1234567890",
  "timezone": "UTC",
  "subscription": {
    "id": "uuid",
    "planName": "Professional",
    "status": "active",
    "expiresAt": "2024-09-18T00:00:00Z"
  },
  "projects": 5,
  "keywordsTracking": 250,
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLoginAt": "2024-08-18T12:00:00Z"
}
```

### 4. Update User

**PUT** `/api/v1/admin/users/{id}`

Cập nhật thông tin người dùng.

**Parameters:**

- `id` (UUID) - ID của người dùng

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "admin",
  "isActive": true,
  "phone": "+1234567890",
  "timezone": "America/New_York"
}
```

**Response:**

```json
{
  "id": "uuid",
  "email": "john.smith@example.com",
  "name": "John Smith",
  "role": "admin",
  "isActive": true,
  "updatedAt": "2024-08-18T15:45:00Z"
}
```

### 5. Delete User (Super Admin Only)

**DELETE** `/api/v1/admin/users/{id}`

Xóa người dùng (chỉ Super Admin).

**Parameters:**

- `id` (UUID) - ID của người dùng

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

**Notes:**

- Không thể xóa Super Admin
- Sẽ xóa tất cả dữ liệu liên quan (projects, subscriptions, etc.)

### 6. Activate User

**PUT** `/api/v1/admin/users/{id}/activate`

Kích hoạt tài khoản người dùng.

**Parameters:**

- `id` (UUID) - ID của người dùng

**Response:**

```json
{
  "id": "uuid",
  "isActive": true,
  "message": "User activated successfully"
}
```

### 7. Deactivate User

**PUT** `/api/v1/admin/users/{id}/deactivate`

Vô hiệu hóa tài khoản người dùng.

**Parameters:**

- `id` (UUID) - ID của người dùng

**Response:**

```json
{
  "id": "uuid",
  "isActive": false,
  "message": "User deactivated successfully"
}
```

---

## 💰 SUBSCRIPTION PLANS MANAGEMENT APIs

### 1. Get All Subscription Plans

**GET** `/api/v1/admin/subscription-plans`

Lấy danh sách tất cả gói đăng ký.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Free Trial",
    "slug": "trial",
    "description": "14-day free trial with full Pro features",
    "price": 0.0,
    "yearlyPrice": 0.0,
    "currency": "USD",
    "features": [
      "Full Pro features for 14 days",
      "Up to 50 keywords tracking",
      "Up to 3 competitors",
      "Daily ranking updates",
      "Complete SEO audits",
      "Email support"
    ],
    "limits": {
      "projects": 5,
      "keywords_tracking": 50,
      "api_requests_daily": 100,
      "api_requests_monthly": 3000,
      "audits_monthly": 5,
      "competitors_tracking": 3,
      "backlinks_monitoring": 1000
    },
    "isActive": true,
    "sortOrder": 0,
    "subscriptionsCount": 125,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### 2. Get Subscription Plan by ID

**GET** `/api/v1/admin/subscription-plans/{id}`

Lấy thông tin chi tiết của một gói đăng ký.

**Parameters:**

- `id` (UUID) - ID của gói đăng ký

**Response:**

```json
{
  "id": "uuid",
  "name": "Professional",
  "slug": "professional",
  "description": "Advanced SEO tools for growing businesses",
  "price": 79.0,
  "yearlyPrice": 63.2,
  "currency": "USD",
  "features": [
    "15 projects",
    "1,000 keywords tracking",
    "Daily reports",
    "Advanced competitor analysis",
    "Priority email support",
    "Custom integrations"
  ],
  "limits": {
    "projects": 15,
    "keywords_tracking": 1000,
    "api_requests_daily": 200,
    "api_requests_monthly": 6000,
    "audits_monthly": 10,
    "competitors_tracking": 10,
    "backlinks_monitoring": 2000
  },
  "isActive": true,
  "sortOrder": 3,
  "subscriptions": [
    {
      "id": "uuid",
      "status": "active",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User Name"
      }
    }
  ],
  "subscriptionsCount": 245
}
```

### 3. Create Subscription Plan (Super Admin Only)

**POST** `/api/v1/admin/subscription-plans`

Tạo gói đăng ký mới.

**Request Body:**

```json
{
  "name": "Premium",
  "slug": "premium",
  "description": "Premium plan for large businesses",
  "price": 199.99,
  "yearlyPrice": 1999.99,
  "currency": "USD",
  "features": [
    "50 projects",
    "5,000 keywords tracking",
    "Real-time reporting",
    "White-label reports",
    "Dedicated support"
  ],
  "limits": {
    "projects": 50,
    "keywords_tracking": 5000,
    "api_requests_daily": 500,
    "api_requests_monthly": 15000,
    "audits_monthly": 25,
    "competitors_tracking": 25,
    "backlinks_monitoring": 5000
  },
  "sortOrder": 4
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Premium",
  "slug": "premium",
  "price": 199.99,
  "yearlyPrice": 1999.99,
  "isActive": true,
  "createdAt": "2024-08-18T15:45:00Z"
}
```

### 4. Update Subscription Plan (Super Admin Only)

**PUT** `/api/v1/admin/subscription-plans/{id}`

Cập nhật gói đăng ký.

**Parameters:**

- `id` (UUID) - ID của gói đăng ký

**Request Body:**

```json
{
  "name": "Premium Plus",
  "description": "Enhanced premium plan",
  "price": 249.99,
  "yearlyPrice": 2399.99,
  "features": [
    "100 projects",
    "10,000 keywords tracking",
    "Real-time reporting",
    "White-label reports",
    "24/7 dedicated support"
  ],
  "limits": {
    "projects": 100,
    "keywords_tracking": 10000,
    "api_requests_daily": 1000,
    "api_requests_monthly": 30000,
    "audits_monthly": 50,
    "competitors_tracking": 50,
    "backlinks_monitoring": 10000
  },
  "isActive": true
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Premium Plus",
  "price": 249.99,
  "updatedAt": "2024-08-18T15:45:00Z"
}
```

### 5. Delete Subscription Plan (Super Admin Only)

**DELETE** `/api/v1/admin/subscription-plans/{id}`

Xóa gói đăng ký.

**Parameters:**

- `id` (UUID) - ID của gói đăng ký

**Response:**

```json
{
  "message": "Subscription plan deleted successfully"
}
```

**Notes:**

- Không thể xóa gói đang có subscription active
- Sẽ kiểm tra ràng buộc trước khi xóa

---

## 👤 USER SUBSCRIPTION MANAGEMENT APIs

### 1. Get User Subscriptions

**GET** `/api/v1/admin/users/{userId}/subscriptions`

Lấy lịch sử subscription của một user.

**Parameters:**

- `userId` (UUID) - ID của người dùng

**Response:**

```json
[
  {
    "id": "uuid",
    "status": "active",
    "billingCycle": "monthly",
    "startedAt": "2024-07-01T00:00:00Z",
    "expiresAt": "2024-08-01T00:00:00Z",
    "plan": {
      "id": "uuid",
      "name": "Professional",
      "price": 79.0
    },
    "payments": [
      {
        "id": "uuid",
        "amount": 79.0,
        "status": "completed",
        "paidAt": "2024-07-01T10:30:00Z"
      }
    ]
  }
]
```

### 2. Update User Subscription

**PUT** `/api/v1/admin/users/{userId}/subscription`

Cập nhật subscription của user (upgrade/downgrade).

**Parameters:**

- `userId` (UUID) - ID của người dùng

**Request Body:**

```json
{
  "planId": "uuid",
  "status": "active",
  "expiresAt": "2024-09-01T00:00:00Z"
}
```

**Response:**

```json
{
  "id": "uuid",
  "status": "active",
  "planId": "uuid",
  "expiresAt": "2024-09-01T00:00:00Z",
  "updatedAt": "2024-08-18T15:45:00Z"
}
```

### 3. Cancel User Subscription

**PUT** `/api/v1/admin/users/{userId}/subscriptions/{subscriptionId}/cancel`

Hủy subscription của user.

**Parameters:**

- `userId` (UUID) - ID của người dùng
- `subscriptionId` (UUID) - ID của subscription

**Response:**

```json
{
  "id": "uuid",
  "status": "cancelled",
  "cancelledAt": "2024-08-18T15:45:00Z",
  "message": "Subscription cancelled successfully"
}
```

---

## 🛠️ ADMIN PROFILE MANAGEMENT APIs

### 1. Update Admin Password

**PUT** `/api/v1/admin/profile/password`

Cập nhật mật khẩu admin.

**Request Body:**

```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response:**

```json
{
  "message": "Admin password updated successfully"
}
```

### 2. Update Admin Email

**PUT** `/api/v1/admin/profile/email`

Cập nhật email admin.

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "password": "currentPassword123"
}
```

**Response:**

```json
{
  "message": "Admin email updated successfully. Please verify your new email address."
}
```

---

## 🔧 SYSTEM INITIALIZATION APIs (Super Admin Only)

### 1. Initialize Admin Account

**POST** `/api/v1/admin/init-admin`

Khởi tạo tài khoản admin mặc định.

**Response:**

```json
{
  "message": "Admin account created or already exists",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 2. Initialize Default Plans

**POST** `/api/v1/admin/init-plans`

Khởi tạo các gói đăng ký mặc định.

**Response:**

```json
{
  "message": "Default subscription plans created",
  "plans": [
    {
      "id": "uuid",
      "name": "Free Trial",
      "slug": "trial"
    },
    {
      "id": "uuid",
      "name": "Free",
      "slug": "free"
    },
    {
      "id": "uuid",
      "name": "Starter",
      "slug": "starter"
    },
    {
      "id": "uuid",
      "name": "Professional",
      "slug": "professional"
    },
    {
      "id": "uuid",
      "name": "Agency",
      "slug": "agency"
    }
  ]
}
```

---

## 📊 DEFAULT SUBSCRIPTION PLANS

### 1. Free Trial

- **Price**: $0.00/month
- **Features**: Full Pro features for 14 days
- **Limits**: 5 projects, 50 keywords, 100 API requests/day

### 2. Free

- **Price**: $0.00/month
- **Features**: Basic SEO tracking
- **Limits**: 1 project, 25 keywords, 10 API requests/day

### 3. Starter

- **Price**: $29.00/month ($23.20/month yearly)
- **Features**: Perfect for small businesses
- **Limits**: 5 projects, 250 keywords, 50 API requests/day

### 4. Professional

- **Price**: $79.00/month ($63.20/month yearly)
- **Features**: Advanced SEO tools for growing businesses
- **Limits**: 15 projects, 1,000 keywords, 200 API requests/day

### 5. Agency

- **Price**: $159.00/month ($127.20/month yearly)
- **Features**: Enterprise solution for agencies
- **Limits**: 50 projects, 5,000 keywords, 1,000 API requests/day

---

## 🚦 Error Codes

| Status Code | Description                       |
| ----------- | --------------------------------- |
| 200         | Success                           |
| 201         | Created                           |
| 400         | Bad Request                       |
| 401         | Unauthorized                      |
| 403         | Forbidden (Admin access required) |
| 404         | Not Found                         |
| 409         | Conflict (Already exists)         |
| 500         | Internal Server Error             |

---

## 📝 Notes

### Authentication & Authorization

- Tất cả API yêu cầu JWT token hợp lệ
- Một số API chỉ dành cho Super Admin (được đánh dấu rõ ràng)
- Token phải được gửi trong header: `Authorization: Bearer <token>`

### Rate Limiting

- API có thể áp dụng rate limiting
- Kiểm tra response headers để xem thông tin về limits

### Pagination

- Sử dụng `page` và `limit` parameters
- Response bao gồm metadata về pagination
- Default: page=1, limit=10, max limit=100

### Data Validation

- Tất cả request body được validate
- UUID parameters được kiểm tra format
- Email phải đúng format
- Password có yêu cầu độ dài tối thiểu

### Security Considerations

- Không thể xóa Super Admin
- Không thể xóa subscription plan đang có user active
- Sensitive operations yêu cầu Super Admin role
- Password changes yêu cầu current password
