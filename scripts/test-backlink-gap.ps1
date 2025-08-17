# Test script for Backlink Gap Analysis API
# Run this script to test the backlink gap endpoints

Write-Host "Testing Backlink Gap Analysis API..." -ForegroundColor Green

# Configuration
$baseUrl = "http://localhost:3000"
$token = "" # Add your JWT token here

# Headers
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

Write-Host "`n1. Testing Backlink Gap Compare API..." -ForegroundColor Yellow

# Test data for backlink gap comparison
$compareData = @{
    targetDomain = "vanhungtran.com"
    competitors = @("dichvuweb.cloud", "competitor2.com")
    filters = @{
        minAuthorityScore = 30
        linkType = "dofollow"
        language = "en"
        minReferringDomains = 5
    }
} | ConvertTo-Json -Depth 3

try {
    $compareResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/seo/backlink-gap/compare" -Method Post -Body $compareData -Headers $headers
    Write-Host "✅ Backlink Gap Compare API Response:" -ForegroundColor Green
    Write-Host ($compareResponse | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error testing Backlink Gap Compare API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n2. Testing Backlink Prospects API..." -ForegroundColor Yellow

# Test data for backlink prospects
$domain = "vanhungtran.com"
$prospectsParams = @{
    limit = 20
    filters = @{
        minAuthorityScore = 40
        linkType = "all"
    }
}

# Convert params to query string
$queryString = ""
if ($prospectsParams.limit) {
    $queryString += "limit=$($prospectsParams.limit)&"
}
if ($prospectsParams.filters.minAuthorityScore) {
    $queryString += "filters.minAuthorityScore=$($prospectsParams.filters.minAuthorityScore)&"
}
if ($prospectsParams.filters.linkType) {
    $queryString += "filters.linkType=$($prospectsParams.filters.linkType)&"
}
$queryString = $queryString.TrimEnd('&')

try {
    $prospectsResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/seo/backlink-gap/prospects/$domain?$queryString" -Method Get -Headers $headers
    Write-Host "✅ Backlink Prospects API Response:" -ForegroundColor Green
    Write-Host ($prospectsResponse | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error testing Backlink Prospects API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n🎉 Backlink Gap Analysis API testing completed!" -ForegroundColor Green
Write-Host "Note: Make sure to set your JWT token in the script before running." -ForegroundColor Yellow
