# Project Sharing API Documentation

## Tổng quan

Tính năng chia sẻ project cho phép người dùng:

- Chia sẻ project của mình với người khác
- Tìm kiếm và apply vào các project được chia sẻ
- Quản lý thành viên trong project
- Truy cập và làm việc với cả project của mình và project đã apply

## Permissions & Access Control

### Owner Permissions

- ✅ Tạo, cập nhật, xóa project
- ✅ Bật/tắt sharing cho project
- ✅ Xem danh sách thành viên
- ✅ Xóa thành viên khỏi project
- ✅ Xem thống kê project
- ✅ Truy cập tất cả dữ liệu project

### Member Permissions

- ✅ Xem chi tiết project
- ✅ Xem thống kê project (rankings, keywords, audits)
- ✅ Truy cập data project (keywords, competitors, audits, etc.)
- ✅ Rời khỏi project
- ❌ Cập nhật thông tin project
- ❌ Xóa project
- ❌ Quản lý thành viên
- ❌ Thay đổi cài đặt sharing

## Database Schema Changes

### Project Model Updates

```prisma
model Project {
  id            String    @id @default(uuid()) @db.Uuid
  name          String
  domain        String
  description   String?   // Mô tả project
  ownerId       String    @map("owner_id") @db.Uuid
  isShared      Boolean   @default(false) @map("is_shared") // Cho phép share
  shareCode     String?   @unique @map("share_code") // Mã chia sẻ unique

  // Relations
  owner         User              @relation(fields: [ownerId], references: [id])
  members       ProjectMember[]   // Thành viên đã apply
  // ... other relations
}
```

### New ProjectMember Model

```prisma
model ProjectMember {
  id          String              @id @default(uuid()) @db.Uuid
  projectId   String              @map("project_id") @db.Uuid
  userId      String              @map("user_id") @db.Uuid
  role        ProjectMemberRole   @default(member)
  status      ProjectMemberStatus @default(active)
  appliedAt   DateTime            @default(now()) @map("applied_at")
  approvedAt  DateTime?           @map("approved_at")

  // Relations
  project Project @relation(fields: [projectId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @@unique([projectId, userId])
}

enum ProjectMemberRole {
  member    // Thành viên thường
  moderator // Quản trị viên phụ (future feature)
}

enum ProjectMemberStatus {
  active    // Đang hoạt động
  inactive  // Không hoạt động
}
```

## API Endpoints

### 1. Search Shared Projects

**GET** `/projects/shared/search`

Tìm kiếm các project được chia sẻ công khai.

**Query Parameters:**

- `search` (optional): Tìm kiếm theo tên, domain, hoặc mô tả
- `shareCode` (optional): Tìm project cụ thể bằng share code
- `page` (optional, default: 1): Số trang
- `limit` (optional, default: 10): Số lượng kết quả mỗi trang

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Project Name",
      "domain": "example.com",
      "description": "Project description",
      "shareCode": "ABC123DEF456",
      "owner": {
        "id": "uuid",
        "name": "Owner Name",
        "email": "owner@example.com"
      },
      "_count": {
        "keywords": 15,
        "competitors": 3,
        "audits": 5,
        "members": 2
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 2. Apply to Project

**POST** `/projects/shared/apply`

Apply để tham gia vào một project được chia sẻ.

**Request Body:**

```json
{
  "shareCode": "ABC123DEF456"
}
```

**Response:**

```json
{
  "message": "Successfully applied to project",
  "membership": {
    "id": "uuid",
    "projectId": "uuid",
    "userId": "uuid",
    "role": "member",
    "status": "active",
    "appliedAt": "2025-08-19T10:30:00Z",
    "project": {
      "id": "uuid",
      "name": "Project Name",
      "domain": "example.com",
      "description": "Project description"
    }
  }
}
```

### 3. Get Applied Projects

**GET** `/projects/applied`

Lấy danh sách các project mà user đã apply.

**Query Parameters:** Same as pagination

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "userId": "uuid",
      "role": "member",
      "status": "active",
      "appliedAt": "2025-08-19T10:30:00Z",
      "project": {
        "id": "uuid",
        "name": "Project Name",
        "domain": "example.com",
        "owner": {
          "id": "uuid",
          "name": "Owner Name",
          "email": "owner@example.com"
        },
        "_count": {
          "keywords": 15,
          "competitors": 3,
          "audits": 5,
          "members": 2
        }
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 4. Leave Applied Project

**DELETE** `/projects/applied/{projectId}`

Rời khỏi một project đã apply.

**Response:**

```json
{
  "message": "Successfully left the project"
}
```

### 5. Toggle Project Sharing

**PATCH** `/projects/{id}/sharing`

Bật/tắt tính năng chia sẻ cho project của mình.

**Request Body:**

```json
{
  "isShared": true
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Project Name",
  "domain": "example.com",
  "isShared": true,
  "shareCode": "ABC123DEF456",
  "message": "Project sharing enabled"
}
```

### 6. Get Project Members

**GET** `/projects/{id}/members`

Lấy danh sách thành viên của project (chỉ owner).

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "userId": "uuid",
      "role": "member",
      "status": "active",
      "appliedAt": "2025-08-19T10:30:00Z",
      "user": {
        "id": "uuid",
        "name": "Member Name",
        "email": "member@example.com",
        "avatarUrl": "https://..."
      }
    }
  ],
  "total": 1
}
```

### 7. Remove Project Member

**DELETE** `/projects/{id}/members/{memberId}`

Xóa thành viên khỏi project (chỉ owner).

**Response:**

```json
{
  "message": "Member removed successfully"
}
```

## Updated Existing Endpoints

### Get User Projects (Updated)

**GET** `/projects`

Endpoint này đã được cập nhật để trả về cả project của user và project đã apply.

**New Response Format:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "My Project",
      "domain": "mysite.com",
      "relationshipType": "owner", // "owner" hoặc "member"
      "_count": { ... }
    },
    {
      "id": "uuid",
      "name": "Applied Project",
      "domain": "othersite.com",
      "relationshipType": "member",
      "owner": {
        "id": "uuid",
        "name": "Owner Name",
        "email": "owner@example.com"
      },
      "_count": { ... }
    }
  ],
  "total": 2,
  "ownedCount": 1,
  "appliedCount": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Get Project by ID (Updated)

**GET** `/projects/{id}`

Endpoint này đã được cập nhật để cho phép truy cập project nếu user là owner hoặc member.

**New Response includes:**

```json
{
  "id": "uuid",
  "name": "Project Name",
  // ... other fields
  "userRole": "owner", // "owner", "member", hoặc null
  "owner": {
    "id": "uuid",
    "name": "Owner Name",
    "email": "owner@example.com"
  },
  "members": [
    {
      "id": "uuid",
      "role": "member",
      "status": "active",
      "user": {
        "id": "uuid",
        "name": "Member Name",
        "email": "member@example.com"
      }
    }
  ],
  "_count": {
    // ... existing counts
    "members": 1
  }
}
```

## Usage Examples

### 1. Enable Sharing for Your Project

```bash
curl -X PATCH http://localhost:3000/projects/{projectId}/sharing \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"isShared": true}'
```

### 2. Search for Shared Projects

```bash
curl "http://localhost:3000/projects/shared/search?search=seo" \
  -H "Authorization: Bearer {token}"
```

### 3. Apply to a Project

```bash
curl -X POST http://localhost:3000/projects/shared/apply \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"shareCode": "ABC123DEF456"}'
```

### 4. View Dashboard (Own + Applied Projects)

```bash
curl "http://localhost:3000/projects" \
  -H "Authorization: Bearer {token}"
```

## Security & Permissions

### Access Control

- **Project Owner**: Có quyền full access, quản lý sharing, thêm/xóa members
- **Project Member**: Có quyền read access, có thể view data nhưng không edit
- **Non-member**: Không thể truy cập project

### Share Code

- Được generate tự động khi enable sharing
- 12 ký tự alphanumeric uppercase
- Unique trong toàn bộ system
- Không thay đổi khi disable/enable lại sharing

### Data Protection

- Chỉ project với `isShared = true` mới xuất hiện trong search
- User không thể apply vào project của chính mình
- Không thể apply 2 lần vào cùng một project

## Testing

Sử dụng script test để kiểm tra tất cả tính năng:

```bash
cd scripts
./test-project-sharing.ps1
```

Script sẽ test:

1. Tạo project và enable sharing
2. Search shared projects
3. Apply vào project
4. Kiểm tra dashboard
5. Test access permissions
6. Leave project
7. Verify access revoked
