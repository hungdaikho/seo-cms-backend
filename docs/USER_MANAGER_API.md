# User Manager API Documentation

## Tổng quan

API User Manager cung cấp các chức năng quản lý tài khoản người dùng bao gồm:

- Xác thực và đăng ký
- Quản lý thông tin cá nhân
- Bảo mật tài khoản
- Quản lý phiên đăng nhập
- Xuất dữ liệu người dùng

## Base URL

```
https://api.example.com
```

## Authentication

Các API yêu cầu authentication sử dụng JWT Token trong header:

```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication APIs

### 1. Đăng ký tài khoản mới

**Endpoint:** `POST /auth/register`

**Mô tả:** Đăng ký tài khoản mới với trial 14 ngày miễn phí

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "name": "John Doe",
  "website": "example.com" // Optional
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully with trial activated",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "isEmailVerified": false,
      "subscription": {
        "planType": "TRIAL",
        "status": "ACTIVE",
        "expiresAt": "2025-08-25T00:00:00Z"
      }
    },
    "accessToken": "jwt_token"
  }
}
```

**Lợi ích Trial 14 ngày:**

- Đầy đủ tính năng Pro
- Theo dõi tối đa 50 keywords
- Tối đa 3 competitors
- SEO audit hoàn chỉnh
- Hỗ trợ email

### 2. Đăng nhập

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "isEmailVerified": true,
      "subscription": {
        "planType": "PRO",
        "status": "ACTIVE"
      }
    },
    "accessToken": "jwt_token"
  }
}
```

### 3. Thay đổi mật khẩu

**Endpoint:** `POST /auth/change-password`
**Auth Required:** ✅

**Request Body:**

```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 4. Quên mật khẩu

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset email sent (if email exists)"
}
```

### 5. Reset mật khẩu

**Endpoint:** `POST /auth/reset-password`

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 6. Xác thực email

**Endpoint:** `POST /auth/verify-email`

**Request Body:**

```json
{
  "token": "verification-token-from-email"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 7. Gửi lại email xác thực

**Endpoint:** `POST /auth/resend-verification`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Verification email sent (if email exists and not verified)"
}
```

---

## 👤 User Profile APIs

### 1. Lấy thông tin profile

**Endpoint:** `GET /users/profile`
**Auth Required:** ✅

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "timezone": "UTC",
    "avatarUrl": "https://example.com/avatar.jpg",
    "isEmailVerified": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "subscription": {
      "planType": "PRO",
      "status": "ACTIVE",
      "expiresAt": "2025-12-31T00:00:00Z"
    }
  }
}
```

### 2. Cập nhật profile

**Endpoint:** `PATCH /users/profile`
**Auth Required:** ✅

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "newemaiL@example.com",
  "phone": "+9876543210",
  "timezone": "Asia/Ho_Chi_Minh",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "newemail@example.com",
    "name": "John Smith",
    "phone": "+9876543210",
    "timezone": "Asia/Ho_Chi_Minh",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
}
```

---

## 📊 Usage & Analytics APIs

### 1. Lấy thông tin sử dụng subscription

**Endpoint:** `GET /users/usage`
**Auth Required:** ✅

**Response (200):**

```json
{
  "success": true,
  "data": {
    "subscription": {
      "planType": "PRO",
      "status": "ACTIVE",
      "usage": {
        "keywords": {
          "used": 45,
          "limit": 500
        },
        "competitors": {
          "used": 2,
          "limit": 10
        },
        "projects": {
          "used": 3,
          "limit": 20
        },
        "audits": {
          "used": 12,
          "limit": 100
        }
      },
      "resetDate": "2025-09-01T00:00:00Z"
    }
  }
}
```

---

## 🔔 Notifications APIs (Deprecated)

### 1. Lấy thông báo người dùng

**Endpoint:** `GET /users/notifications?limit=10`
**Auth Required:** ✅
**Status:** ⚠️ Deprecated - Sử dụng `/notifications` endpoint thay thế

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Audit Completed",
      "message": "Your website audit for example.com has been completed",
      "type": "audit",
      "isRead": false,
      "createdAt": "2025-08-11T10:30:00Z"
    }
  ]
}
```

### 2. Đánh dấu thông báo đã đọc

**Endpoint:** `PATCH /users/notifications/{id}/read`
**Auth Required:** ✅
**Status:** ⚠️ Deprecated - Sử dụng `/notifications` endpoint thay thế

**Response (200):**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 🔒 Account Security APIs

### 1. Vô hiệu hóa tài khoản tạm thời

**Endpoint:** `POST /users/deactivate`
**Auth Required:** ✅

**Mô tả:** Vô hiệu hóa tài khoản trong khi vẫn bảo toàn dữ liệu để có thể kích hoạt lại

**Request Body:**

```json
{
  "reason": "I no longer need this service",
  "password": "CurrentPassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account deactivated successfully",
  "data": {
    "reactivationPeriod": "30 days",
    "contactSupport": "support@example.com"
  }
}
```

### 2. Xóa tài khoản vĩnh viễn

**Endpoint:** `DELETE /users/account`
**Auth Required:** ✅

**Mô tả:** Yêu cầu xóa tài khoản vĩnh viễn. Dữ liệu sẽ được ẩn danh/xóa trong vòng 30 ngày.

**Request Body:**

```json
{
  "password": "CurrentPassword123!",
  "confirmation": "DELETE",
  "reason": "Too expensive" // Optional
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account deletion requested",
  "data": {
    "deletionDate": "2025-09-10T00:00:00Z",
    "dataRetention": "30 days",
    "cancellation": "Contact support within 7 days to cancel deletion"
  }
}
```

### 3. Xuất dữ liệu người dùng (GDPR)

**Endpoint:** `POST /users/export-data`
**Auth Required:** ✅

**Mô tả:** Xuất tất cả dữ liệu người dùng định dạng JSON hoặc CSV để tuân thủ GDPR

**Request Body:**

```json
{
  "dataTypes": ["profile", "projects", "keywords", "audits"], // Optional
  "format": "json" // "json" | "csv"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Data exported successfully",
  "data": {
    "downloadUrl": "https://example.com/exports/user-data-uuid.zip",
    "expiresAt": "2025-08-18T00:00:00Z",
    "fileSize": "2.5 MB",
    "includes": ["profile", "projects", "keywords", "audits"]
  }
}
```

---

## 🖥️ Session Management APIs

### 1. Lấy danh sách phiên đăng nhập

**Endpoint:** `GET /auth/sessions`
**Auth Required:** ✅

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "session-uuid",
      "deviceInfo": "Chrome on Windows",
      "ipAddress": "192.168.1.1",
      "location": "Ho Chi Minh City, Vietnam",
      "lastActive": "2025-08-11T10:30:00Z",
      "createdAt": "2025-08-10T08:00:00Z",
      "isCurrent": true
    },
    {
      "id": "session-uuid-2",
      "deviceInfo": "Safari on iPhone",
      "ipAddress": "192.168.1.2",
      "location": "Ho Chi Minh City, Vietnam",
      "lastActive": "2025-08-10T22:15:00Z",
      "createdAt": "2025-08-10T20:00:00Z",
      "isCurrent": false
    }
  ]
}
```

### 2. Thu hồi phiên đăng nhập cụ thể

**Endpoint:** `DELETE /auth/sessions/{sessionId}`
**Auth Required:** ✅

**Response (200):**

```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

**Error (400):**

```json
{
  "success": false,
  "message": "Cannot revoke current session"
}
```

### 3. Thu hồi tất cả phiên đăng nhập khác

**Endpoint:** `DELETE /auth/sessions`
**Auth Required:** ✅

**Mô tả:** Thu hồi tất cả phiên đăng nhập trừ phiên hiện tại

**Response (200):**

```json
{
  "success": true,
  "message": "All other sessions revoked successfully",
  "data": {
    "revokedSessions": 3
  }
}
```

---

## 📋 Response Codes

| Code | Description                                            |
| ---- | ------------------------------------------------------ |
| 200  | OK - Thành công                                        |
| 201  | Created - Tạo thành công                               |
| 400  | Bad Request - Lỗi validation hoặc dữ liệu không hợp lệ |
| 401  | Unauthorized - Không được phép hoặc token không hợp lệ |
| 403  | Forbidden - Không có quyền truy cập                    |
| 404  | Not Found - Không tìm thấy tài nguyên                  |
| 409  | Conflict - Xung đột (email đã tồn tại)                 |
| 429  | Too Many Requests - Quá nhiều yêu cầu                  |
| 500  | Internal Server Error - Lỗi server                     |

---

## 🔧 Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## 🚀 Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- Other endpoints: 100 requests per minute per user
- Reset password: 3 requests per hour per email

## 🔐 Security Notes

1. **Passwords:** Tối thiểu 6 ký tự, khuyến nghị sử dụng ký tự đặc biệt
2. **JWT Tokens:** Hết hạn sau 30 ngày
3. **Email Verification:** Bắt buộc cho các chức năng nhạy cảm
4. **Two-Factor Authentication:** Sẽ được bổ sung trong phiên bản tương lai
5. **Session Management:** Tự động đăng xuất sau 30 ngày không hoạt động

## 📞 Support

- Email: support@example.com
- Documentation: https://docs.example.com
- Status Page: https://status.example.com
