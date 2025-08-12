# Test Admin API Endpoints (PowerShell version)
# Make sure the server is running before executing this script

$baseUrl = "http://localhost:3001/api/v1"
$adminEmail = "admin@gmail.com"
$adminPassword = "Admin1234"

Write-Host "🚀 Testing Admin API..." -ForegroundColor Green

# Step 1: Login as admin to get JWT token
Write-Host "📝 Logging in as admin..." -ForegroundColor Yellow

$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $jwtToken = $loginResponse.access_token
    
    if (-not $jwtToken) {
        Write-Host "❌ Failed to get JWT token" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ JWT Token obtained: $($jwtToken.Substring(0, [Math]::Min(50, $jwtToken.Length)))..." -ForegroundColor Green
    
    $headers = @{
        "Authorization" = "Bearer $jwtToken"
        "Content-Type" = "application/json"
    }
    
    # Step 2: Test admin dashboard stats
    Write-Host "📊 Testing dashboard stats..." -ForegroundColor Yellow
    try {
        $statsResponse = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/stats" -Method GET -Headers $headers
        Write-Host "Dashboard Stats:" -ForegroundColor Cyan
        Write-Host "Total Users: $($statsResponse.totalUsers)" -ForegroundColor White
        Write-Host "Active Users: $($statsResponse.activeUsers)" -ForegroundColor White
        Write-Host "Total Revenue: $($statsResponse.totalRevenue)" -ForegroundColor White
    } catch {
        Write-Host "Dashboard stats error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Step 3: Test get all users
    Write-Host "👥 Testing get users..." -ForegroundColor Yellow
    try {
        $usersResponse = Invoke-RestMethod -Uri "$baseUrl/admin/users?page=1&limit=5" -Method GET -Headers $headers
        Write-Host "Users Count: $($usersResponse.pagination.total)" -ForegroundColor Cyan
        if ($usersResponse.users.Count -gt 0) {
            Write-Host "First user: $($usersResponse.users[0].email)" -ForegroundColor White
        }
    } catch {
        Write-Host "Get users error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Step 4: Test get subscription plans
    Write-Host "💰 Testing get subscription plans..." -ForegroundColor Yellow
    try {
        $plansResponse = Invoke-RestMethod -Uri "$baseUrl/admin/subscription-plans" -Method GET -Headers $headers
        Write-Host "Subscription Plans Count: $($plansResponse.Length)" -ForegroundColor Cyan
        foreach ($plan in $plansResponse) {
            Write-Host "- $($plan.name): $($plan.price) $($plan.currency)" -ForegroundColor White
        }
    } catch {
        Write-Host "Get plans error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Step 5: Test create new subscription plan
    Write-Host "➕ Testing create subscription plan..." -ForegroundColor Yellow
    $randomSuffix = Get-Random -Minimum 1000 -Maximum 9999
    $planBody = @{
        name = "Test Plan $randomSuffix"
        slug = "test-plan-$randomSuffix"
        description = "Test plan for API testing"
        price = 9.99
        yearlyPrice = 99.99
        features = @{ test = $true }
        limits = @{ test_limit = 100 }
    } | ConvertTo-Json
    
    try {
        $createPlanResponse = Invoke-RestMethod -Uri "$baseUrl/admin/subscription-plans" -Method POST -Body $planBody -Headers $headers
        Write-Host "✅ Created plan: $($createPlanResponse.name)" -ForegroundColor Green
    } catch {
        Write-Host "Create plan error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "🎉 Admin API testing completed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
