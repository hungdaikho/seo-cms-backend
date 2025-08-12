# Admin Module Documentation

Module quản lý admin cho hệ thống SEO CMS Backend với các tính năng quản lý người dùng, subscription plans và dashboard thống kê.

## 🚀 Tính năng chính

### 1. Quản lý người dùng (User Management)

- Xem danh sách người dùng với phân trang và tìm kiếm
- Xem chi tiết thông tin người dùng
- Cập nhật thông tin người dùng (tên, email, role, trạng thái)
- Kích hoạt/vô hiệu hóa tài khoản người dùng
- Xóa người dùng (chỉ Super Admin)

### 2. Quản lý Subscription Plans

- Xem danh sách các gói subscription
- Tạo gói subscription mới
- Cập nhật thông tin gói
- Xóa gói (nếu không có người dùng đang sử dụng)

### 3. Quản lý Subscription của người dùng

- Xem lịch sử subscription của người dùng
- Nâng cấp/hạ cấp gói cho người dùng
- Hủy subscription

### 4. Dashboard thống kê

- Tổng số người dùng
- Số người dùng đang hoạt động
- Thống kê subscription
- Doanh thu tổng và theo tháng

## 🔐 Phân quyền

### Admin (`UserRole.admin`)

- Có thể thực hiện hầu hết các chức năng quản lý
- Không thể xóa người dùng
- Không thể tạo/sửa/xóa subscription plans

### Super Admin (`UserRole.super_admin`)

- Có toàn quyền trên hệ thống
- Có thể xóa người dùng
- Có thể quản lý subscription plans
- Có thể khởi tạo dữ liệu mặc định

## 🏁 Khởi tạo tự động

Khi ứng dụng khởi động, hệ thống sẽ tự động:

1. **Tạo tài khoản admin mặc định:**
   - Email: `admin@gmail.com`
   - Password: `Admin1234`
   - Role: `super_admin`

2. **Tạo các subscription plans mặc định:**
   - Free Trial (0$/month)
   - Starter (29.99$/month)
   - Professional (79.99$/month)
   - Agency (199.99$/month)

## 📚 API Endpoints

### Authentication

Tất cả endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer <jwt_token>
```

### Dashboard

```
GET /api/v1/admin/dashboard/stats
```

### User Management

```
GET /api/v1/admin/users                     # Danh sách users
GET /api/v1/admin/users/:id                 # Chi tiết user
PUT /api/v1/admin/users/:id                 # Cập nhật user
DELETE /api/v1/admin/users/:id              # Xóa user (Super Admin only)
PUT /api/v1/admin/users/:id/activate        # Kích hoạt user
PUT /api/v1/admin/users/:id/deactivate      # Vô hiệu hóa user
```

### Subscription Plans

```
GET /api/v1/admin/subscription-plans        # Danh sách plans
GET /api/v1/admin/subscription-plans/:id    # Chi tiết plan
POST /api/v1/admin/subscription-plans       # Tạo plan mới (Super Admin only)
PUT /api/v1/admin/subscription-plans/:id    # Cập nhật plan (Super Admin only)
DELETE /api/v1/admin/subscription-plans/:id # Xóa plan (Super Admin only)
```

### User Subscriptions

```
GET /api/v1/admin/users/:userId/subscriptions              # Lịch sử subscription
PUT /api/v1/admin/users/:userId/subscription               # Cập nhật subscription
PUT /api/v1/admin/users/:userId/subscriptions/:id/cancel   # Hủy subscription
```

### Initialization (Super Admin only)

```
POST /api/v1/admin/init-admin               # Khởi tạo admin account
POST /api/v1/admin/init-plans               # Khởi tạo default plans
```

## 🧪 Testing

### Sử dụng PowerShell (Windows):

```powershell
cd scripts
.\test-admin-api.ps1
```

### Sử dụng Bash (Linux/Mac):

```bash
cd scripts
chmod +x test-admin-api.sh
./test-admin-api.sh
```

## 📝 Ví dụ sử dụng

### 1. Đăng nhập admin

```javascript
POST /api/v1/auth/login
{
  "email": "admin@gmail.com",
  "password": "Admin1234"
}
```

### 2. Lấy thống kê dashboard

```javascript
GET /api/v1/admin/dashboard/stats
Authorization: Bearer <token>

Response:
{
  "totalUsers": 150,
  "activeUsers": 120,
  "inactiveUsers": 30,
  "totalSubscriptions": 100,
  "activeSubscriptions": 85,
  "expiredSubscriptions": 15,
  "totalRevenue": 15000.50,
  "monthlyRevenue": 2500.75
}
```

### 3. Lấy danh sách users

```javascript
GET /api/v1/admin/users?page=1&limit=10&search=john&isActive=true
Authorization: Bearer <token>
```

### 4. Cập nhật user

```javascript
PUT /api/v1/admin/users/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
{
  "name": "John Doe Updated",
  "isActive": true,
  "role": "admin"
}
```

### 5. Tạo subscription plan mới

```javascript
POST / api / v1 / admin / subscription - plans;
Authorization: Bearer <
  token >
  {
    name: 'Premium',
    slug: 'premium',
    description: 'Premium plan with all features',
    price: 149.99,
    yearlyPrice: 1499.99,
    features: {
      projects: 50,
      keywords: 5000,
      support: 'priority',
    },
    limits: {
      projects: 50,
      keywords_tracking: 5000,
      api_requests_daily: 500,
    },
  };
```

### 6. Nâng cấp subscription cho user

```javascript
PUT /api/v1/admin/users/123e4567-e89b-12d3-a456-426614174000/subscription
Authorization: Bearer <token>
{
  "planId": "456e7890-e89b-12d3-a456-426614174000",
  "status": "active",
  "expiresAt": "2025-12-31T23:59:59.000Z"
}
```

## 🔧 Cấu hình

Module admin được tự động khởi tạo khi ứng dụng start. Bạn có thể tùy chỉnh:

1. **Thông tin admin mặc định** trong `AdminService.createDefaultAdmin()`
2. **Subscription plans mặc định** trong `AdminService.createDefaultPlans()`
3. **Phân quyền** trong `AdminGuard` và `SuperAdminGuard`

## 🚨 Lưu ý bảo mật

1. **Đổi mật khẩu admin mặc định** ngay sau khi triển khai production
2. **Chỉ cấp quyền admin cho người đáng tin cậy**
3. **Log tất cả hoạt động admin** để audit
4. **Sử dụng HTTPS** trong production
5. **Thiết lập rate limiting** cho admin endpoints

## 📊 Monitoring

Hệ thống ghi log các hoạt động quan trọng:

- Tạo/xóa/cập nhật user
- Thay đổi subscription
- Truy cập admin dashboard
- Khởi tạo dữ liệu mặc định
