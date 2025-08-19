# 📧 CÁC LỰA CHỌN EMAIL ĐỠN GIẢN

## 🚀 ZohoMail (Khuyến nghị - Đơn giản nhất)

### Ưu điểm:

- ✅ Free 5GB
- ✅ Dùng password thường
- ✅ Không cần App Password
- ✅ Setup 2 phút
- ✅ Ít bị spam filter

### Cấu hình:

```bash
SMTP_HOST="smtp.zoho.com"
SMTP_PORT=587
SMTP_USER="your-email@zoho.com"
SMTP_PASS="your-normal-password"
```

### Đăng ký:

1. Vào [zoho.com/mail](https://www.zoho.com/mail/)
2. Sign up free
3. Verify email
4. Dùng luôn!

---

## 📮 Outlook/Hotmail (Dễ)

### Ưu điểm:

- ✅ Dùng password thường
- ✅ Microsoft reliable
- ✅ Free unlimited

### Cấu hình:

```bash
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT=587
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-normal-password"
```

### Note:

Có thể cần bật "Less secure app access"

---

## 📫 SendGrid (Professional)

### Ưu điểm:

- ✅ 100 emails/day free
- ✅ API key thay vì password
- ✅ Delivery reliability cao
- ✅ Professional features

### Cấu hình:

```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

### Setup:

1. Đăng ký [sendgrid.com](https://sendgrid.com)
2. Tạo API Key
3. Verify domain (optional)

---

## 🔧 Mailtrap (Development Only)

### Ưu điểm:

- ✅ Fake SMTP cho testing
- ✅ Không gửi email thật
- ✅ Debug email content
- ✅ Free 500 emails/month

### Cấu hình:

```bash
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="your-mailtrap-username"
SMTP_PASS="your-mailtrap-password"
```

---

## 📊 So Sánh

| Provider     | Setup      | Free Tier | Password Type | Reliability |
| ------------ | ---------- | --------- | ------------- | ----------- |
| **ZohoMail** | ⭐⭐⭐⭐⭐ | 5GB       | Normal        | ⭐⭐⭐⭐    |
| **Outlook**  | ⭐⭐⭐⭐   | Unlimited | Normal        | ⭐⭐⭐⭐⭐  |
| **SendGrid** | ⭐⭐⭐     | 100/day   | API Key       | ⭐⭐⭐⭐⭐  |
| **Gmail**    | ⭐⭐       | 15GB      | App Password  | ⭐⭐⭐⭐⭐  |
| **Mailtrap** | ⭐⭐⭐⭐⭐ | 500/month | Normal        | ⭐⭐⭐      |

---

## 🎯 Khuyến Nghị

### Cho Development:

1. **ZohoMail** - Đơn giản nhất
2. **Mailtrap** - Nếu chỉ test

### Cho Production:

1. **SendGrid** - Professional
2. **Outlook** - Reliable và dễ

### Tránh:

- Gmail (phức tạp với App Password)
- Yahoo (thường bị block)

---

## 🚀 Quick Start với ZohoMail

```bash
# 1. Đăng ký tại zoho.com/mail
# 2. Verify email
# 3. Update .env:

SMTP_HOST="smtp.zoho.com"
SMTP_PORT=587
SMTP_USER="your-new-email@zoho.com"
SMTP_PASS="your-password"

# 4. Restart server
npm run start:dev

# 5. Test
.\scripts\test-password-reset.ps1
```

**🎉 Xong! Không cần App Password hay 2FA phức tạp!**
