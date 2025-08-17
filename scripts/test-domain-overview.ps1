# Test Domain Overview API endpoints
$baseUrl = "http://localhost:3000"
$domain = "vanhungtran.com"

# Test endpoints
$endpoints = @(
    "/api/v1/seo/domain-overview/$domain",
    "/api/v1/seo/domain-overview/top-keywords/$domain?limit=20&country=UK",
    "/api/v1/seo/domain-overview/authority/$domain",
    "/api/v1/seo/domain-overview/competitors/$domain?limit=10&country=UK",
    "/api/v1/seo/domain-overview/topics/$domain?limit=10"
)

Write-Host "Testing Domain Overview API endpoints..." -ForegroundColor Green
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow
Write-Host "Domain: $domain" -ForegroundColor Yellow
Write-Host ""

foreach ($endpoint in $endpoints) {
    $url = "$baseUrl$endpoint"
    Write-Host "Testing: $endpoint" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method GET -Headers @{
            "Authorization" = "Bearer test-token"
            "Content-Type" = "application/json"
        } -ErrorAction Stop
        
        Write-Host "✅ SUCCESS: Status 200" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "❌ FAILED: Status $statusCode" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Test completed!" -ForegroundColor Green
