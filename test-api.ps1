# Test API endpoints
$baseUrl = "http://localhost:3001/api/v1"
$projectId = "7cd88268-6849-4fd3-a926-57a400742a45"

Write-Host "Testing Summary API..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/projects/$projectId/audits/summary" -Method GET -UseBasicParsing
    Write-Host "Summary API Status: $($response.StatusCode)"
    Write-Host "Summary API Response: $($response.Content)"
} catch {
    Write-Host "Summary API Error: $($_.Exception.Message)"
}

Write-Host "`nTesting History API..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/projects/$projectId/audits/history" -Method GET -UseBasicParsing
    Write-Host "History API Status: $($response.StatusCode)"
    Write-Host "History API Response: $($response.Content)"
} catch {
    Write-Host "History API Error: $($_.Exception.Message)"
}

Write-Host "`nTesting General Audits API..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/projects/$projectId/audits" -Method GET -UseBasicParsing
    Write-Host "General Audits API Status: $($response.StatusCode)"
    Write-Host "General Audits API Response: $($response.Content)"
} catch {
    Write-Host "General Audits API Error: $($_.Exception.Message)"
}
