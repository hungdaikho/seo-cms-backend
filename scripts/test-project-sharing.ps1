# Test script for Project Sharing features
# Run this script to test the new project sharing functionality

$baseUrl = "http://localhost:3000"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "=== PROJECT SHARING FEATURE TEST ===" -ForegroundColor Green

# First, login to get tokens
Write-Host "`n1. Login with two different accounts..." -ForegroundColor Yellow

# Login User 1 (Owner)
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
    Write-Host "✅ User 1 logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ User 1 login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Login User 2 (Member)
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
    Write-Host "✅ User 2 logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ User 2 login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Creating User 2..." -ForegroundColor Yellow
    
    $user2Register = @{
        name = "Test User 2"
        email = "user@test.com"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $user2Register -Headers $headers
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

# 2. Create a project with User 1
Write-Host "`n2. Creating a project with User 1..." -ForegroundColor Yellow

$projectData = @{
    name = "Shared SEO Project"
    domain = "example-shared.com"
    description = "This is a shared project for testing collaboration features"
    settings = @{
        country = "US"
        language = "en"
        trackingEnabled = $true
        keyWordsArray = @("shared keyword", "collaboration test", "seo sharing")
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

# 3. Enable sharing for the project
Write-Host "`n3. Enabling sharing for the project..." -ForegroundColor Yellow

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

# 4. Search for shared projects with User 2
Write-Host "`n4. Searching for shared projects with User 2..." -ForegroundColor Yellow

try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/projects/shared/search?search=shared" -Method Get -Headers $user2Headers
    Write-Host "✅ Found $($searchResponse.total) shared projects" -ForegroundColor Green
    
    if ($searchResponse.total -gt 0) {
        $foundProject = $searchResponse.data[0]
        Write-Host "   Found project: $($foundProject.name) by $($foundProject.owner.name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to search shared projects: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Apply to the project with User 2
Write-Host "`n5. Applying to the project with User 2..." -ForegroundColor Yellow

$applyData = @{
    shareCode = $shareCode
} | ConvertTo-Json

try {
    $applyResponse = Invoke-RestMethod -Uri "$baseUrl/projects/shared/apply" -Method Post -Body $applyData -Headers $user2Headers
    Write-Host "✅ Successfully applied to project" -ForegroundColor Green
    Write-Host "   $($applyResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to apply to project: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Check User 2's projects (should include applied project)
Write-Host "`n6. Checking User 2's projects dashboard..." -ForegroundColor Yellow

try {
    $user2ProjectsResponse = Invoke-RestMethod -Uri "$baseUrl/projects" -Method Get -Headers $user2Headers
    Write-Host "✅ User 2 has access to $($user2ProjectsResponse.total) projects" -ForegroundColor Green
    Write-Host "   Owned: $($user2ProjectsResponse.ownedCount)" -ForegroundColor Cyan
    Write-Host "   Applied: $($user2ProjectsResponse.appliedCount)" -ForegroundColor Cyan
    
    foreach ($project in $user2ProjectsResponse.data) {
        $type = $project.relationshipType
        Write-Host "   - $($project.name) ($type)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to get User 2's projects: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Check project members with User 1
Write-Host "`n7. Checking project members with User 1..." -ForegroundColor Yellow

try {
    $membersResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId/members" -Method Get -Headers $user1Headers
    Write-Host "✅ Project has $($membersResponse.total) members" -ForegroundColor Green
    
    foreach ($member in $membersResponse.data) {
        Write-Host "   - $($member.user.name) ($($member.user.email)) - Applied: $($member.appliedAt)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to get project members: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Test project access with User 2
Write-Host "`n8. Testing project access with User 2..." -ForegroundColor Yellow

try {
    $projectDetailsResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Get -Headers $user2Headers
    Write-Host "✅ User 2 can access project details" -ForegroundColor Green
    Write-Host "   Role: $($projectDetailsResponse.userRole)" -ForegroundColor Cyan
    Write-Host "   Members count: $($projectDetailsResponse._count.members)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ User 2 cannot access project: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Test leaving project with User 2
Write-Host "`n9. Testing leave project with User 2..." -ForegroundColor Yellow

try {
    $leaveResponse = Invoke-RestMethod -Uri "$baseUrl/projects/applied/$projectId" -Method Delete -Headers $user2Headers
    Write-Host "✅ User 2 left the project successfully" -ForegroundColor Green
    Write-Host "   $($leaveResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to leave project: $($_.Exception.Message)" -ForegroundColor Red
}

# 10. Verify User 2 can no longer access the project
Write-Host "`n10. Verifying User 2 no longer has access..." -ForegroundColor Yellow

try {
    $projectDetailsResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" -Method Get -Headers $user2Headers
    Write-Host "❌ User 2 still has access (unexpected)" -ForegroundColor Red
} catch {
    Write-Host "✅ User 2 correctly lost access to the project" -ForegroundColor Green
}

Write-Host "`n=== PROJECT SHARING TEST COMPLETED ===" -ForegroundColor Green
Write-Host "All sharing features have been tested!" -ForegroundColor Cyan
