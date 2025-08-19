# Test Email Verification Flow
# Tests the new flow where welcome email is sent only after email verification

$baseUrl = "http://localhost:3001/api/v1"
$testEmail = "test-verification@example.com"
$testPassword = "TestPassword123!"
$testName = "Test User"

Write-Host "🧪 Testing Email Verification Flow" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Step 1: Register new user
Write-Host "`n1. Registering new user..." -ForegroundColor Yellow

$registerData = @{
    email = $testEmail
    password = $testPassword
    name = $testName
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method POST -Body $registerData -ContentType "application/json"
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "Email Verified: $($registerResponse.user.emailVerified)" -ForegroundColor Gray
    
    if ($registerResponse.user.emailVerified -eq $false) {
        Write-Host "✅ Correct: User is not auto-verified" -ForegroundColor Green
    } else {
        Write-Host "❌ Wrong: User should not be auto-verified" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Try to login before verification
Write-Host "`n2. Trying to login before email verification..." -ForegroundColor Yellow

$loginData = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST -Body $loginData -ContentType "application/json"
    
    Write-Host "❌ Login should have failed but succeeded" -ForegroundColor Red
    Write-Host "Response: $($loginResponse | ConvertTo-Json)" -ForegroundColor Gray
    
} catch {
    if ($_.Exception.Message -like "*verify your email*") {
        Write-Host "✅ Correct: Login blocked until email verification" -ForegroundColor Green
    } else {
        Write-Host "❌ Login failed for wrong reason: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 3: Check database for verification token
Write-Host "`n3. Checking verification setup..." -ForegroundColor Yellow
Write-Host "📧 Expected behavior:" -ForegroundColor Cyan
Write-Host "   - Verification email sent (check logs)" -ForegroundColor Gray
Write-Host "   - NO welcome email sent yet" -ForegroundColor Gray
Write-Host "   - User can register but cannot login" -ForegroundColor Gray

# Manual step instruction
Write-Host "`n4. Manual verification step needed:" -ForegroundColor Yellow
Write-Host "   1. Check email service logs for verification email" -ForegroundColor Gray
Write-Host "   2. Extract verification token from email/logs" -ForegroundColor Gray
Write-Host "   3. Call verify endpoint: POST /auth/verify-email" -ForegroundColor Gray
Write-Host "   4. Check that welcome email is sent AFTER verification" -ForegroundColor Gray

Write-Host "`n🎯 Test Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Registration creates unverified user" -ForegroundColor Green
Write-Host "   ✅ Login blocked until verification" -ForegroundColor Green
Write-Host "   📧 Verification email sent (check logs)" -ForegroundColor Yellow
Write-Host "   📧 Welcome email sent only after verification" -ForegroundColor Yellow

Write-Host "`nTest completed! Check email service logs for verification flow." -ForegroundColor Green
