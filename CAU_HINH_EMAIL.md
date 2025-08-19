# 📧 CẤU HÌNH EMAIL CHO TÍNH NĂNG QUÊN MẬT KHẨU

## 📋 Checklist Cấu Hình

### ✅ 1. Tạo File .env

Tạo file `.env` trong thư mục root và thêm:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/seo_cms_database?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Email Configuration (QUAN TRỌNG!)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend URL (để tạo link reset)
FRONTEND_URL="http://localhost:3000"

# Server
PORT=3001
NODE_ENV=development
```

### ✅ 2. Cấu Hình Gmail App Password

#### Bước 1: Bật 2-Factor Authentication

1. Vào [Google Account Security](https://myaccount.google.com/security)
2. Tìm "2-Step Verification" và bật nó
3. Hoàn thành quá trình xác thực

#### Bước 2: Tạo App Password

1. Vào "Security" > "App passwords"
2. Chọn "Mail" từ dropdown
3. Chọn device (hoặc chọn "Other" và nhập "SEO CMS")
4. Copy password được tạo (16 ký tự)
5. Dán vào `SMTP_PASS` trong file .env

### ✅ 3. Test Cấu Hình

Chạy script test:

```powershell
.\scripts\test-password-reset.ps1
```

## 🔧 Các SMTP Provider Khác

### Gmail (Khuyến nghị)

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-digit-app-password"
```

### Outlook/Hotmail

```bash
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT=587
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

### Yahoo Mail

```bash
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT=587
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

### SendGrid (Professional)

```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

## 🚨 Xử Lý Lỗi Thường Gặp

### Lỗi: "SMTP connection failed"

```bash
# Kiểm tra:
1. SMTP credentials có đúng không
2. App password đã được tạo chưa
3. 2FA đã được bật chưa
4. Port 587 có bị firewall chặn không
```

### Lỗi: "Failed to send email"

```bash
# Debug:
1. Kiểm tra logs trong console
2. Thử gửi email test từ Gmail web
3. Đảm bảo không có typo trong .env
```

### Email không nhận được

```bash
# Kiểm tra:
1. Spam folder
2. Email address chính xác
3. SMTP_USER phải là email gửi
4. Logs có báo "email sent" không
```

## 🧪 Test Manual

### 1. Kiểm tra SMTP Connection

```javascript
// Thêm vào auth.service.ts để test
console.log('SMTP Config:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? '***masked***' : 'missing',
});
```

### 2. Test API với Postman

```json
POST http://localhost:3001/api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "your-test-email@gmail.com"
}
```

### 3. Kiểm tra Database

```sql
-- Xem token được tạo
SELECT id, user_id, token, expires_at, used, created_at
FROM password_resets
ORDER BY created_at DESC;

-- Xem user
SELECT id, email, name FROM users WHERE email = 'your-email@gmail.com';
```

## 📱 Development vs Production

### Development

```bash
# File .env.development
SMTP_HOST="smtp.gmail.com"
SMTP_USER="dev-email@gmail.com"
FRONTEND_URL="http://localhost:3000"
```

### Production

```bash
# File .env.production
SMTP_HOST="smtp.sendgrid.net"
SMTP_USER="apikey"
SMTP_PASS="your-production-api-key"
FRONTEND_URL="https://your-domain.com"
```

## 📝 Logs Quan Trọng

### Thành Công

```
[EmailService] SMTP server is ready to take our messages
[EmailService] Password reset email sent to user@example.com
```

### Lỗi

```
[EmailService] SMTP connection failed: Error message
[EmailService] Failed to send password reset email: Error details
```

## 🎯 Bước Tiếp Theo

1. **Cấu hình email** theo hướng dẫn trên
2. **Test API** với script PowerShell
3. **Kiểm tra logs** để đảm bảo email được gửi
4. **Test frontend integration**
5. **Deploy và test production**

---

**🔗 Links Hữu Ích:**

- [Google App Passwords](https://support.google.com/accounts/answer/185833)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [SendGrid Documentation](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)

**💡 Tip:** Giữ app password an toàn và không share trong code!
