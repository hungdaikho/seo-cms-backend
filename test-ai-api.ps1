# Test AI API Script

# 1. Đăng ký user mới
Write-Host "=== 1. Registering new user ===" -ForegroundColor Green
$registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" -Method POST -Headers @{'Content-Type'='application/json'} -Body (ConvertTo-Json @{
    email = "test@example.com"
    password = "password123"  
    name = "Test User"
})

Write-Host "Register Response:" -ForegroundColor Yellow
$registerResponse | ConvertTo-Json -Depth 3

# 2. Login để lấy token
Write-Host "`n=== 2. Logging in to get token ===" -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -Headers @{'Content-Type'='application/json'} -Body (ConvertTo-Json @{
    email = "test@example.com"
    password = "password123"
})

Write-Host "Login Response:" -ForegroundColor Yellow
$loginResponse | ConvertTo-Json -Depth 3

$token = $loginResponse.access_token
Write-Host "`nAccess Token: $token" -ForegroundColor Cyan

# 3. Test AI API với competitor analysis
Write-Host "`n=== 3. Testing AI API - Competitor Analysis ===" -ForegroundColor Green

$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $token"
}

$payload = @{
    type = "competitor_analysis"
    parameters = @{
        competitorDomain = "competitor.com"
        yourDomain = "vanhungtran.com"
        industry = "technology"
    }
    projectId = "7cd88268-6849-4fd3-a926-57a400742a45"
} | ConvertTo-Json -Depth 3

Write-Host "Payload:" -ForegroundColor Yellow
Write-Host $payload

try {
    $aiResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/ai/request" -Method POST -Headers $headers -Body $payload
    
    Write-Host "`nAI Response:" -ForegroundColor Green
    $aiResponse | ConvertTo-Json -Depth 10
    
    Write-Host "`n✅ SUCCESS: AI API call completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "`n❌ ERROR: AI API call failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get detailed error response
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

# 4. Test với keyword research
Write-Host "`n=== 4. Testing AI API - Keyword Research ===" -ForegroundColor Green

$keywordPayload = @{
    type = "keyword_research"
    parameters = @{
        topic = "digital marketing"
        industry = "technology"
        location = "Vietnam"
        count = 10
    }
    projectId = "7cd88268-6849-4fd3-a926-57a400742a45"
} | ConvertTo-Json -Depth 3

Write-Host "Keyword Research Payload:" -ForegroundColor Yellow
Write-Host $keywordPayload

try {
    $keywordResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/ai/request" -Method POST -Headers $headers -Body $keywordPayload
    
    Write-Host "`nKeyword Research Response:" -ForegroundColor Green
    $keywordResponse | ConvertTo-Json -Depth 10
    
    Write-Host "`n✅ SUCCESS: Keyword Research API call completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "`n❌ ERROR: Keyword Research API call failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Magenta
