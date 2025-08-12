# Simple test for Admin API
$baseUrl = "http://localhost:3001/api/v1"
$adminEmail = "admin@gmail.com" 
$adminPassword = "Admin1234"

Write-Host "🚀 Testing Admin API..." -ForegroundColor Green

# Login
Write-Host "📝 Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.access_token

if ($token) {
    Write-Host "✅ Login successful!" -ForegroundColor Green
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Test dashboard stats
    Write-Host "📊 Getting dashboard stats..." -ForegroundColor Yellow
    $stats = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/stats" -Method GET -Headers $headers
    Write-Host "Total Users: $($stats.totalUsers)" -ForegroundColor Cyan
    Write-Host "Active Users: $($stats.activeUsers)" -ForegroundColor Cyan
    
    # Test get users
    Write-Host "👥 Getting users..." -ForegroundColor Yellow
    $users = Invoke-RestMethod -Uri "$baseUrl/admin/users?page=1&limit=5" -Method GET -Headers $headers
    Write-Host "Found $($users.pagination.total) users" -ForegroundColor Cyan
    
    # Test get plans
    Write-Host "💰 Getting subscription plans..." -ForegroundColor Yellow
    $plans = Invoke-RestMethod -Uri "$baseUrl/admin/subscription-plans" -Method GET -Headers $headers
    Write-Host "Found $($plans.Count) subscription plans:" -ForegroundColor Cyan
    foreach ($plan in $plans) {
        Write-Host "  - $($plan.name): $($plan.price) $($plan.currency)" -ForegroundColor White
    }
    
    Write-Host "🎉 All tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Login failed!" -ForegroundColor Red
}
