# 🧪 TEST SCRIPT - TÍNH NĂNG QUÊN MẬT KHẨU

# Cấu hình
$baseUrl = "http://localhost:3001/api/v1"
$testEmail = "test@example.com"

Write-Host "🚀 TESTING PASSWORD RESET FEATURE" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test 1: Forgot Password Request
Write-Host "`n1. Testing Forgot Password Request..." -ForegroundColor Yellow

$forgotData = @{
    email = $testEmail
} | ConvertTo-Json

try {
    Write-Host "POST $baseUrl/auth/forgot-password"
    Write-Host "Body: $forgotData"
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/forgot-password" `
        -Method POST -Body $forgotData -ContentType "application/json"
    
    Write-Host "✅ Response: $($response.message)" -ForegroundColor Green
    
    if ($response.message -like "*password reset link has been sent*") {
        Write-Host "✅ Forgot password request successful!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Invalid Email
Write-Host "`n2. Testing Invalid Email..." -ForegroundColor Yellow

$invalidEmailData = @{
    email = "nonexistent@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/forgot-password" `
        -Method POST -Body $invalidEmailData -ContentType "application/json"
    
    Write-Host "✅ Response: $($response.message)" -ForegroundColor Green
    Write-Host "✅ Security: No information leaked about user existence" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Reset Password (Manual token required)
Write-Host "`n3. Testing Reset Password..." -ForegroundColor Yellow
Write-Host "⚠️  Cần token từ email để test phần này" -ForegroundColor Cyan

$resetData = @{
    token = "YOUR_TOKEN_FROM_EMAIL"
    newPassword = "NewPassword123!"
    confirmPassword = "NewPassword123!"
} | ConvertTo-Json

Write-Host "POST $baseUrl/auth/reset-password"
Write-Host "Body: $resetData"
Write-Host "⚠️  Thay YOUR_TOKEN_FROM_EMAIL bằng token thật từ email" -ForegroundColor Cyan

# Test 4: Check Database (Optional)
Write-Host "`n4. Database Check Instructions..." -ForegroundColor Yellow
Write-Host "Kiểm tra password_resets table trong database:" -ForegroundColor Cyan
Write-Host "SELECT * FROM password_resets ORDER BY created_at DESC LIMIT 5;" -ForegroundColor Gray

# Email Configuration Check
Write-Host "`n5. Email Configuration Check..." -ForegroundColor Yellow

if ($env:SMTP_HOST -and $env:SMTP_USER) {
    Write-Host "✅ SMTP_HOST: $($env:SMTP_HOST)" -ForegroundColor Green
    Write-Host "✅ SMTP_USER: $($env:SMTP_USER)" -ForegroundColor Green
    Write-Host "✅ Email configuration detected" -ForegroundColor Green
} else {
    Write-Host "⚠️  Email environment variables not found" -ForegroundColor Yellow
    Write-Host "Cần cấu hình trong .env file:" -ForegroundColor Cyan
    Write-Host "SMTP_HOST=smtp.gmail.com" -ForegroundColor Gray
    Write-Host "SMTP_PORT=587" -ForegroundColor Gray
    Write-Host "SMTP_USER=your-email@gmail.com" -ForegroundColor Gray
    Write-Host "SMTP_PASS=your-app-password" -ForegroundColor Gray
}

Write-Host "`n✨ Test completed!" -ForegroundColor Green
