# Test script for creating project with keywords
# PowerShell script to test the new project creation with keywords feature

$baseUrl = "http://localhost:3001/api/v1"
$token = "YOUR_JWT_TOKEN_HERE"

# Test data for creating project with keywords
$projectData = @{
    name = "SEO Test Project"
    domain = "example.com"
    settings = @{
        country = "US"
        language = "en"
        trackingEnabled = $true
        keyWordsArray = @(
            "seo tools",
            "keyword research",
            "rank tracking",
            "website audit",
            "competitor analysis"
        )
    }
} | ConvertTo-Json -Depth 3

Write-Host "🚀 Testing Project Creation with Keywords..." -ForegroundColor Cyan
Write-Host "Request Data:" -ForegroundColor Yellow
Write-Host $projectData

# Create project with keywords
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/projects" -Method Post -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $projectData

    Write-Host "✅ Project created successfully!" -ForegroundColor Green
    Write-Host "Project ID: $($response.id)" -ForegroundColor Green
    Write-Host "Project Name: $($response.name)" -ForegroundColor Green
    Write-Host "Domain: $($response.domain)" -ForegroundColor Green
    
    # Wait a moment for keywords to be created
    Start-Sleep -Seconds 2
    
    # Get project keywords to verify they were created
    Write-Host "`n🔍 Checking created keywords..." -ForegroundColor Cyan
    $keywordsResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$($response.id)/keywords" -Method Get -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Keywords found: $($keywordsResponse.total)" -ForegroundColor Green
    foreach ($keyword in $keywordsResponse.data) {
        Write-Host "  - $($keyword.keyword)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorDetails = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorDetails)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n📝 Example request body:" -ForegroundColor Yellow
Write-Host @"
{
  "name": "My SEO Project",
  "domain": "mywebsite.com",
  "settings": {
    "country": "US",
    "language": "en", 
    "trackingEnabled": true,
    "keyWordsArray": [
      "seo tools",
      "keyword research", 
      "rank tracking"
    ]
  }
}
"@ -ForegroundColor White
