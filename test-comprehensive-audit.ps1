# Test script for comprehensive audit endpoint
# Make sure to replace the JWT token with a valid one

$baseUrl = "http://localhost:3001/api/v1"
$projectId = "7cd88268-6849-4fd3-a926-57a400742a45"
$jwtToken = "YOUR_JWT_TOKEN_HERE"

$headers = @{
    "Authorization" = "Bearer $jwtToken"
    "Content-Type" = "application/json"
}

$body = @{
    url = "https://example.com"
    options = @{
        auditType = "full"
        settings = @{
            crawlDepth = 1
            includeImages = $true
            checkMobileFriendly = $true
            analyzePageSpeed = $true
        }
    }
} | ConvertTo-Json -Depth 3

$url = "$baseUrl/projects/$projectId/audits/comprehensive"

Write-Host "Testing endpoint: $url"
Write-Host "Request body: $body"

try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    Write-Host "Success! Response:"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode"
    }
}
