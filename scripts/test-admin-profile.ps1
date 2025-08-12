# Test script for Admin Profile Management APIs
$baseUrl = "http://localhost:3000"

# First, get an admin token (replace with actual admin credentials)
Write-Host "=== Testing Admin Profile Management APIs ===" -ForegroundColor Green

# Test 1: Update Admin Password
Write-Host "`n1. Testing Update Admin Password..." -ForegroundColor Yellow
$passwordData = @{
    currentPassword = "admin123"
    newPassword = "newAdmin123!"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_ADMIN_TOKEN_HERE"
}

try {
    Write-Host "PUT $baseUrl/admin/profile/password"
    Write-Host "Body: $passwordData"
    # Uncomment to run actual test:
    # $response = Invoke-RestMethod -Uri "$baseUrl/admin/profile/password" -Method PUT -Body $passwordData -Headers $headers
    # Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Green
    Write-Host "⚠️  Replace YOUR_ADMIN_TOKEN_HERE with actual admin token to test" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Update Admin Email
Write-Host "`n2. Testing Update Admin Email..." -ForegroundColor Yellow
$emailData = @{
    email = "new-admin@example.com"
    password = "newAdmin123!"
} | ConvertTo-Json

try {
    Write-Host "PUT $baseUrl/admin/profile/email"
    Write-Host "Body: $emailData"
    # Uncomment to run actual test:
    # $response = Invoke-RestMethod -Uri "$baseUrl/admin/profile/email" -Method PUT -Body $emailData -Headers $headers
    # Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Green
    Write-Host "⚠️  Replace YOUR_ADMIN_TOKEN_HERE with actual admin token to test" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Admin Profile Management API Tests Complete ===" -ForegroundColor Green
Write-Host "Note: Update the token and uncomment the actual API calls to run real tests" -ForegroundColor Yellow
