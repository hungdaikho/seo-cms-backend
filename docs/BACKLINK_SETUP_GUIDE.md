# 🔗 Backlink Analytics - Setup & Testing Guide

## 📊 **Tóm tắt thay đổi**

### ✅ **Đã hoàn thành:**

1. **360 ngày mặc định** thay vì 30 ngày cho analytics
2. **Dữ liệu seed realistic** với 300+ backlinks từ 50+ domains authority
3. **API không thay đổi** - chỉ cải thiện logic và data
4. **Data chính xác** với authority scores, link types, discovery dates

## 🚀 **Quick Start**

### 1. **Chạy server**

```bash
npm run start:dev
```

### 2. **Seed dữ liệu (nếu chưa có)**

```bash
npm run db:seed
```

### 3. **Test API**

#### **Lấy danh sách backlinks:**

```bash
GET http://localhost:3001/api/v1/projects/{projectId}/backlinks?page=1&limit=20
```

#### **Lấy analytics (360 ngày mặc định):**

```bash
GET http://localhost:3001/api/v1/projects/{projectId}/backlinks/analytics
```

#### **Lấy analytics cho period cụ thể:**

```bash
GET http://localhost:3001/api/v1/projects/{projectId}/backlinks/analytics?days=90
```

## 📈 **Dữ liệu Seed bao gồm:**

### **🌐 50+ Authority Domains:**

- TechCrunch (92), Forbes (95), Mashable (87)
- HubSpot (89), Moz (86), SEMrush (88)
- GitHub (96), LinkedIn (97), Medium (90)
- BBC (95), CNN (93), New York Times (96)
- ... và nhiều domains khác

### **🎯 Realistic Anchor Texts:**

- "SEO tools", "keyword research", "digital marketing"
- "backlink analysis", "competitor analysis"
- "content optimization", "technical SEO"
- ... 50+ anchor texts thực tế

### **📊 Data Distribution:**

- **85% follow links**, 15% nofollow (realistic ratio)
- **95% active links** (một số links có thể bị mất)
- **Authority scores 1-100** với variation tự nhiên
- **Discovery dates** phân bố đều trong 360 ngày qua

## 🔍 **Analytics Response Example**

```json
{
  "summary": {
    "totalBacklinks": 156,
    "totalDomains": 78,
    "activeLinks": 142,
    "followLinks": 132,
    "nofollowLinks": 24,
    "averageAuthorityScore": 84.7,
    "newBacklinksCount": 12
  },
  "newBacklinks": [...],
  "topDomains": [
    {"domain": "techcrunch.com", "count": 3},
    {"domain": "forbes.com", "count": 2}
  ],
  "topTargetUrls": [
    {"url": "https://yoursite.com/seo-tools", "count": 15},
    {"url": "https://yoursite.com/", "count": 12}
  ],
  "linkTypeDistribution": {
    "follow": 132,
    "nofollow": 24,
    "unknown": 0
  },
  "authorityDistribution": {
    "0-20": 2,
    "21-40": 8,
    "41-60": 15,
    "61-80": 45,
    "81-100": 86
  }
}
```

## 🛠️ **Technical Details**

### **Database Schema:**

```sql
model Backlink {
  id             String    @id @default(uuid())
  projectId      String
  sourceDomain   String    -- Domain nguồn (techcrunch.com)
  targetUrl      String    -- URL đích (yoursite.com/page)
  anchorText     String?   -- Text anchor (optional)
  linkType       LinkType? -- follow/nofollow
  authorityScore Int?      -- 1-100
  isActive       Boolean   -- Link còn hoạt động
  discoveredAt   DateTime  -- Ngày phát hiện
}
```

### **Authority Score Distribution:**

- **81-100**: 35% (High authority sites)
- **61-80**: 30% (Medium-high authority)
- **41-60**: 20% (Medium authority)
- **21-40**: 10% (Lower authority)
- **0-20**: 5% (Low authority)

### **Target Pages per Project:**

- Homepage, main product pages
- Blog posts về SEO topics
- Resource pages, documentation
- About, contact, pricing pages

## 📝 **Testing Checklist**

### ✅ **Basic Functionality:**

- [ ] List backlinks với pagination
- [ ] Analytics với 360 ngày mặc định
- [ ] Analytics với custom days
- [ ] Individual backlink details
- [ ] Add/update/delete backlinks

### ✅ **Data Quality:**

- [ ] Authority scores realistic (60-95 cho major sites)
- [ ] Link types distribution (85% follow)
- [ ] Discovery dates spread over 360 days
- [ ] Active/inactive ratio realistic
- [ ] Domain diversity (50+ unique domains)

### ✅ **Performance:**

- [ ] Analytics response < 500ms
- [ ] Pagination works smoothly
- [ ] No N+1 queries
- [ ] Proper indexes on projectId

## 🔧 **Customization**

### **Thay đổi default period:**

```typescript
// In backlinks.service.ts line ~147
: new Date(Date.now() - (query.days || 360) * 24 * 60 * 60 * 1000);
//                                      ^^^
//                                   Change this number
```

### **Thêm domains mới:**

```typescript
// In backlinks.seed.ts
const authorityDomains = [
  { domain: 'yournewdomain.com', authority: 85 },
  // ... existing domains
];
```

### **Seed thêm data:**

```bash
# Clear and re-seed
npm run db:reset
npm run db:seed

# Or add more data
npm run db:seed
```

## 🎯 **Project IDs for Testing**

Sau khi seed, bạn có thể dùng các project IDs này:

- Kiểm tra database để lấy UUID của projects
- Hoặc tạo endpoint để list projects

```sql
SELECT id, name, domain FROM projects;
```

## 📊 **Expected Results**

Với dữ liệu seed hiện tại, bạn sẽ thấy:

- **~100 backlinks** per project
- **Authority score trung bình**: ~84-86
- **Follow ratio**: ~85%
- **Active links**: ~95%
- **Unique domains**: 40-50 per project
- **Time distribution**: Đều đặn trong 360 ngày

## 🐛 **Troubleshooting**

### **Không có data:**

```bash
npm run db:seed
```

### **Lỗi 404 Project not found:**

- Kiểm tra projectId có đúng không
- Kiểm tra user ownership

### **Analytics trống:**

- Kiểm tra có backlinks trong database không
- Thử với period ngắn hơn (days=30)

## 🚀 **Next Steps**

1. **Auto-discovery**: Implement crawler tự động tìm backlinks
2. **External APIs**: Tích hợp Ahrefs, SEMrush APIs
3. **Real-time monitoring**: Check link status định kỳ
4. **Bulk import**: CSV/Excel upload
5. **Notifications**: Alert khi có new/lost backlinks

---

**🎉 Chúc bạn test thành công với data realistic này!**
