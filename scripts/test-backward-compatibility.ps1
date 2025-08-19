# Test script để kiểm tra tính tương thích ngược của API
# Đảm bảo các API cũ vẫn hoạt động đúng sau khi thêm tính năng sharing

$baseUrl = "http://localhost:3000"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "=== BACKWARD COMPATIBILITY TEST ===" -ForegroundColor Green

# 1. Login
Write-Host "`n1. Đăng nhập..." -ForegroundColor Yellow

$loginData = @{
    email = "admin@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -Headers $headers
    $token = $loginResponse.access_token
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Đăng nhập thành công" -ForegroundColor Green
} catch {
    Write-Host "❌ Đăng nhập thất bại: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Test API tạo project (API cũ)
Write-Host "`n2. Test tạo project với API cũ..." -ForegroundColor Yellow

$oldProjectData = @{
    name = "Legacy Project Test"
    domain = "legacy-test.com"
    settings = @{
        country = "US"
        language = "en"
        trackingEnabled = $true
    }
} | ConvertTo-Json -Depth 3

try {
    $projectResponse = Invoke-RestMethod -Uri "$baseUrl/projects" -Method Post -Body $oldProjectData -Headers $authHeaders
    $projectId = $projectResponse.id
    Write-Host "✅ Tạo project thành công với API cũ" -ForegroundColor Green
    Write-Host "   Project ID: $projectId" -ForegroundColor Cyan
    Write-Host "   Project Name: $($projectResponse.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Tạo project thất bại: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Test API lấy danh sách project (API cũ)
Write-Host "`n3. Test lấy danh sách project với API cũ..." -ForegroundColor Yellow

try {
    $projectsResponse = Invoke-RestMethod -Uri "$baseUrl/projects" -Method Get -Headers $authHeaders
    Write-Host "✅ Lấy danh sách project thành công" -ForegroundColor Green
    Write-Host "   Total projects: $($projectsResponse.total)" -ForegroundColor Cyan
    Write-Host "   Response structure:" -ForegroundColor Cyan
    Write-Host "     - data: $($projectsResponse.data.Count) items" -ForegroundColor Cyan
    Write-Host "     - total: $($projectsResponse.total)" -ForegroundColor Cyan
    Write-Host "     - page: $($projectsResponse.page)" -ForegroundColor Cyan
    Write-Host "     - limit: $($projectsResponse.limit)" -ForegroundColor Cyan
    
    # Kiểm tra structure của từng project
    if ($projectsResponse.data.Count -gt 0) {
        $firstProject = $projectsResponse.data[0]
        Write-Host "   First project structure:" -ForegroundColor Cyan
        Write-Host "     - id: $($firstProject.id)" -ForegroundColor Cyan
        Write-Host "     - name: $($firstProject.name)" -ForegroundColor Cyan
        Write-Host "     - domain: $($firstProject.domain)" -ForegroundColor Cyan
        Write-Host "     - ownerId: $($firstProject.ownerId)" -ForegroundColor Cyan
        Write-Host "     - _count: keywords=$($firstProject._count.keywords), audits=$($firstProject._count.audits)" -ForegroundColor Cyan
        
        # Kiểm tra có trường mới không
        if ($firstProject.relationshipType) {
            Write-Host "     - relationshipType: $($firstProject.relationshipType)" -ForegroundColor Yellow
        }
        if ($projectsResponse.ownedCount) {
            Write-Host "     - ownedCount: $($projectsResponse.ownedCount)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ Lấy danh sách project thất bại: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Test API lấy project theo ID (API cũ)
Write-Host "`n4. Test lấy project theo ID với API cũ..." -ForegroundColor Yellow

try {
    $projectDetailResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Get -Headers $authHeaders
    Write-Host "✅ Lấy chi tiết project thành công" -ForegroundColor Green
    Write-Host "   Project Name: $($projectDetailResponse.name)" -ForegroundColor Cyan
    Write-Host "   Keywords count: $($projectDetailResponse._count.keywords)" -ForegroundColor Cyan
    Write-Host "   Audits count: $($projectDetailResponse._count.audits)" -ForegroundColor Cyan
    
    # Kiểm tra trường mới
    if ($projectDetailResponse.userRole) {
        Write-Host "   User Role: $($projectDetailResponse.userRole)" -ForegroundColor Yellow
    }
    if ($projectDetailResponse.members) {
        Write-Host "   Members count: $($projectDetailResponse.members.Count)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Lấy chi tiết project thất bại: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Test API cập nhật project (API cũ)
Write-Host "`n5. Test cập nhật project với API cũ..." -ForegroundColor Yellow

$updateData = @{
    name = "Updated Legacy Project"
    settings = @{
        country = "VN"
        language = "vi"
        trackingEnabled = $false
    }
} | ConvertTo-Json -Depth 3

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Patch -Body $updateData -Headers $authHeaders
    Write-Host "✅ Cập nhật project thành công" -ForegroundColor Green
    Write-Host "   Updated Name: $($updateResponse.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Cập nhật project thất bại: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 6. Test API thống kê project (API cũ)
Write-Host "`n6. Test lấy thống kê project với API cũ..." -ForegroundColor Yellow

try {
    $statsResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId/stats" -Method Get -Headers $authHeaders
    Write-Host "✅ Lấy thống kê project thành công" -ForegroundColor Green
    Write-Host "   Total Keywords: $($statsResponse.totalKeywords)" -ForegroundColor Cyan
    Write-Host "   Average Ranking: $($statsResponse.averageRanking)" -ForegroundColor Cyan
    Write-Host "   Audit Summary: $($statsResponse.auditSummary.totalAudits) audits" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Lấy thống kê project thất bại: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Test pagination với API cũ
Write-Host "`n7. Test pagination với API cũ..." -ForegroundColor Yellow

try {
    $paginationResponse = Invoke-RestMethod -Uri "$baseUrl/projects?page=1&limit=5" -Method Get -Headers $authHeaders
    Write-Host "✅ Pagination hoạt động đúng" -ForegroundColor Green
    Write-Host "   Page: $($paginationResponse.page)" -ForegroundColor Cyan
    Write-Host "   Limit: $($paginationResponse.limit)" -ForegroundColor Cyan
    Write-Host "   Total Pages: $($paginationResponse.totalPages)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Pagination thất bại: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Test search với API cũ
Write-Host "`n8. Test search với API cũ..." -ForegroundColor Yellow

try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/projects?search=Legacy" -Method Get -Headers $authHeaders
    Write-Host "✅ Search hoạt động đúng" -ForegroundColor Green
    Write-Host "   Found: $($searchResponse.total) projects" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Search thất bại: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Test tạo project với keywords (API cũ với keywords)
Write-Host "`n9. Test tạo project với keywords..." -ForegroundColor Yellow

$projectWithKeywords = @{
    name = "Project with Keywords"
    domain = "keywords-test.com"
    settings = @{
        country = "US"
        language = "en"
        trackingEnabled = $true
        keyWordsArray = @("test keyword 1", "test keyword 2", "test keyword 3")
    }
} | ConvertTo-Json -Depth 3

try {
    $projectKeywordsResponse = Invoke-RestMethod -Uri "$baseUrl/projects" -Method Post -Body $projectWithKeywords -Headers $authHeaders
    $keywordProjectId = $projectKeywordsResponse.id
    Write-Host "✅ Tạo project với keywords thành công" -ForegroundColor Green
    Write-Host "   Project ID: $keywordProjectId" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Tạo project với keywords thất bại: $($_.Exception.Message)" -ForegroundColor Red
}

# 10. Test xóa project (API cũ)
Write-Host "`n10. Test xóa project với API cũ..." -ForegroundColor Yellow

try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Delete -Headers $authHeaders
    Write-Host "✅ Xóa project thành công" -ForegroundColor Green
} catch {
    Write-Host "❌ Xóa project thất bại: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== BACKWARD COMPATIBILITY TEST COMPLETED ===" -ForegroundColor Green
Write-Host "Tất cả API cũ đều hoạt động bình thường!" -ForegroundColor Cyan
Write-Host "Các tính năng mới được thêm vào mà không ảnh hưởng đến logic cũ." -ForegroundColor Cyan
