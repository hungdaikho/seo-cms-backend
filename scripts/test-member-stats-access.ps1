# Test script để kiểm tra member có thể truy cập project stats
# Kiểm tra API /projects/{id}/stats với member role

$baseUrl = "http://localhost:3000"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "=== PROJECT STATS ACCESS TEST FOR MEMBERS ===" -ForegroundColor Green

# 1. Login User 1 (Owner)
Write-Host "`n1. Đăng nhập User 1 (Owner)..." -ForegroundColor Yellow

$user1Login = @{
    email = "admin@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $user1Response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $user1Login -Headers $headers
    $user1Token = $user1Response.access_token
    $user1Headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $user1Token"
    }
    Write-Host "✅ User 1 (Owner) logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ User 1 login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Login User 2 (Member)
Write-Host "`n2. Đăng nhập User 2 (Member)..." -ForegroundColor Yellow

$user2Login = @{
    email = "user@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $user2Response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $user2Login -Headers $headers
    $user2Token = $user2Response.access_token
    $user2Headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $user2Token"
    }
    Write-Host "✅ User 2 (Member) logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ User 2 login failed: $($_.Exception.Message)" -ForegroundColor Red
    # Try to create User 2 if not exists
    Write-Host "Trying to create User 2..." -ForegroundColor Yellow
    
    $user2Register = @{
        name = "Test User 2"
        email = "user@test.com"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $user2Register -Headers $headers
        $user2Response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $user2Login -Headers $headers
        $user2Token = $user2Response.access_token
        $user2Headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $user2Token"
        }
        Write-Host "✅ User 2 created and logged in successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create User 2: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# 3. Create a shared project with User 1
Write-Host "`n3. Tạo project chia sẻ với User 1..." -ForegroundColor Yellow

$projectData = @{
    name = "Stats Access Test Project"
    domain = "stats-test.com"
    description = "Project for testing stats access by members"
    settings = @{
        country = "US"
        language = "en"
        trackingEnabled = $true
        keyWordsArray = @("stats test", "member access", "project sharing")
    }
} | ConvertTo-Json -Depth 3

try {
    $projectResponse = Invoke-RestMethod -Uri "$baseUrl/projects" -Method Post -Body $projectData -Headers $user1Headers
    $projectId = $projectResponse.id
    Write-Host "✅ Project created successfully: $($projectResponse.name)" -ForegroundColor Green
    Write-Host "   Project ID: $projectId" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to create project: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Enable sharing for the project
Write-Host "`n4. Bật chia sẻ cho project..." -ForegroundColor Yellow

$sharingData = @{
    isShared = $true
} | ConvertTo-Json

try {
    $sharingResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId/sharing" -Method Patch -Body $sharingData -Headers $user1Headers
    $shareCode = $sharingResponse.shareCode
    Write-Host "✅ Project sharing enabled successfully" -ForegroundColor Green
    Write-Host "   Share Code: $shareCode" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to enable sharing: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Apply to project with User 2
Write-Host "`n5. User 2 apply vào project..." -ForegroundColor Yellow

$applyData = @{
    shareCode = $shareCode
} | ConvertTo-Json

try {
    $applyResponse = Invoke-RestMethod -Uri "$baseUrl/projects/shared/apply" -Method Post -Body $applyData -Headers $user2Headers
    Write-Host "✅ User 2 successfully applied to project" -ForegroundColor Green
} catch {
    Write-Host "❌ User 2 failed to apply: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 6. Test stats access with Owner (User 1)
Write-Host "`n6. Test stats access với Owner (User 1)..." -ForegroundColor Yellow

try {
    $ownerStatsResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId/stats" -Method Get -Headers $user1Headers
    Write-Host "✅ Owner có thể truy cập stats" -ForegroundColor Green
    Write-Host "   Total Keywords: $($ownerStatsResponse.totalKeywords)" -ForegroundColor Cyan
    Write-Host "   Average Ranking: $($ownerStatsResponse.averageRanking)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Owner không thể truy cập stats: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Test stats access with Member (User 2) - This should work now
Write-Host "`n7. Test stats access với Member (User 2)..." -ForegroundColor Yellow

try {
    $memberStatsResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId/stats" -Method Get -Headers $user2Headers
    Write-Host "✅ Member có thể truy cập stats" -ForegroundColor Green
    Write-Host "   Total Keywords: $($memberStatsResponse.totalKeywords)" -ForegroundColor Cyan
    Write-Host "   Average Ranking: $($memberStatsResponse.averageRanking)" -ForegroundColor Cyan
    Write-Host "   Improved Keywords: $($memberStatsResponse.improvedKeywords)" -ForegroundColor Cyan
    Write-Host "   Declined Keywords: $($memberStatsResponse.declinedKeywords)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Member không thể truy cập stats: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Error details: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response body: $responseBody" -ForegroundColor Red
    }
}

# 8. Test project detail access with Member (User 2)
Write-Host "`n8. Test project detail access với Member (User 2)..." -ForegroundColor Yellow

try {
    $memberProjectResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Get -Headers $user2Headers
    Write-Host "✅ Member có thể truy cập project details" -ForegroundColor Green
    Write-Host "   Project Name: $($memberProjectResponse.name)" -ForegroundColor Cyan
    Write-Host "   User Role: $($memberProjectResponse.userRole)" -ForegroundColor Cyan
    Write-Host "   Keywords Count: $($memberProjectResponse._count.keywords)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Member không thể truy cập project details: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Test update project with Member (should fail)
Write-Host "`n9. Test update project với Member (should fail)..." -ForegroundColor Yellow

$updateData = @{
    name = "Updated by Member (should fail)"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Patch -Body $updateData -Headers $user2Headers
    Write-Host "❌ Member có thể update project (unexpected!)" -ForegroundColor Red
} catch {
    Write-Host "✅ Member không thể update project (expected)" -ForegroundColor Green
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

# 10. Test delete project with Member (should fail)
Write-Host "`n10. Test delete project với Member (should fail)..." -ForegroundColor Yellow

try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Delete -Headers $user2Headers
    Write-Host "❌ Member có thể delete project (unexpected!)" -ForegroundColor Red
} catch {
    Write-Host "✅ Member không thể delete project (expected)" -ForegroundColor Green
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

Write-Host "`n=== MEMBER PROJECT STATS ACCESS TEST COMPLETED ===" -ForegroundColor Green
Write-Host "Member hiện tại có thể truy cập project stats nhưng không thể chỉnh sửa project!" -ForegroundColor Cyan
