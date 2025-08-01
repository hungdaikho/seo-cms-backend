# Test Keyword Magic Tool API Endpoint
# PowerShell script to test the new Keyword Magic Tool endpoint

Write-Host "=== Testing Keyword Magic Tool API ===" -ForegroundColor Green

# API Configuration
$baseUrl = "http://localhost:3001/api/v1"
$endpoint = "$baseUrl/ai/keywords/magic-tool"

# Test JWT Token (replace with your actual token)
$token = "YOUR_JWT_TOKEN_HERE"

# Headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test Payload - Comprehensive keyword research
$payload = @{
    seedKeyword = "digital marketing"
    industry = "technology"
    location = "US"
    language = "en"
    intentFilter = "all"
    minDifficulty = 0
    maxDifficulty = 80
    minVolume = 100
    includeLongTail = $true
    includeQuestions = $true
    includeCompetitorKeywords = $true
    includeSeasonalTrends = $true
    includeRelatedTopics = $true
    limitPerCategory = 25
    competitorDomains = @("semrush.com", "ahrefs.com", "moz.com")
    contentType = "blog"
    targetAudience = "small business owners and marketing managers"
} | ConvertTo-Json -Depth 3

Write-Host "`nPayload:" -ForegroundColor Yellow
Write-Host $payload

Write-Host "`nSending request to: $endpoint" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method POST -Headers $headers -Body $payload
    
    Write-Host "`n✅ SUCCESS! Keyword Magic Tool API Response:" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    
    # Display summary
    Write-Host "`n📊 SUMMARY:" -ForegroundColor Magenta
    Write-Host "Seed Keyword: $($response.seedKeyword)" -ForegroundColor White
    Write-Host "Total Keywords: $($response.totalKeywords)" -ForegroundColor White
    Write-Host "Avg Search Volume: $($response.summary.avgSearchVolume)" -ForegroundColor White
    Write-Host "Avg Difficulty: $($response.summary.avgDifficulty)" -ForegroundColor White
    Write-Host "Competition Level: $($response.summary.competitionLevel)" -ForegroundColor White
    
    # Display primary keywords (first 5)
    if ($response.primaryKeywords -and $response.primaryKeywords.Count -gt 0) {
        Write-Host "`n🎯 PRIMARY KEYWORDS (Top 5):" -ForegroundColor Magenta
        for ($i = 0; $i -lt [Math]::Min(5, $response.primaryKeywords.Count); $i++) {
            $kw = $response.primaryKeywords[$i]
            Write-Host "  $($i+1). $($kw.keyword) | Vol: $($kw.searchVolume) | Diff: $($kw.difficulty) | Intent: $($kw.intent)" -ForegroundColor White
        }
    }
    
    # Display long-tail keywords (first 3)
    if ($response.longTailKeywords -and $response.longTailKeywords.Count -gt 0) {
        Write-Host "`n🔗 LONG-TAIL KEYWORDS (Top 3):" -ForegroundColor Magenta
        for ($i = 0; $i -lt [Math]::Min(3, $response.longTailKeywords.Count); $i++) {
            $kw = $response.longTailKeywords[$i]
            Write-Host "  $($i+1). $($kw.keyword) | Vol: $($kw.searchVolume) | Words: $($kw.wordCount)" -ForegroundColor White
        }
    }
    
    # Display question keywords (first 3)
    if ($response.questionKeywords -and $response.questionKeywords.Count -gt 0) {
        Write-Host "`n❓ QUESTION KEYWORDS (Top 3):" -ForegroundColor Magenta
        for ($i = 0; $i -lt [Math]::Min(3, $response.questionKeywords.Count); $i++) {
            $kw = $response.questionKeywords[$i]
            Write-Host "  $($i+1). $($kw.question) | Vol: $($kw.searchVolume) | Type: $($kw.answerType)" -ForegroundColor White
        }
    }
    
    # Display related topics
    if ($response.relatedTopics -and $response.relatedTopics.Count -gt 0) {
        Write-Host "`n🏷️  RELATED TOPICS:" -ForegroundColor Magenta
        foreach ($topic in $response.relatedTopics) {
            Write-Host "  • $($topic.topic) (Relevance: $($topic.relevance))" -ForegroundColor White
        }
    }
    
    # Display keyword clusters
    if ($response.keywordClusters -and $response.keywordClusters.Count -gt 0) {
        Write-Host "`n📂 KEYWORD CLUSTERS:" -ForegroundColor Magenta
        foreach ($cluster in $response.keywordClusters) {
            Write-Host "  • $($cluster.cluster) | Pillar: $($cluster.pillarKeyword) | Keywords: $($cluster.keywords.Count)" -ForegroundColor White
        }
    }
    
    # Display filters applied
    Write-Host "`n⚙️  FILTERS APPLIED:" -ForegroundColor Magenta
    Write-Host "  Location: $($response.filters.location)" -ForegroundColor White
    Write-Host "  Language: $($response.filters.language)" -ForegroundColor White
    Write-Host "  Intent Filter: $($response.filters.intentFilter)" -ForegroundColor White
    Write-Host "  Difficulty Range: $($response.filters.difficultyRange)" -ForegroundColor White
    Write-Host "  Volume Range: $($response.filters.volumeRange)" -ForegroundColor White
    
    Write-Host "`n================================================" -ForegroundColor Green
    Write-Host "✅ Test completed successfully!" -ForegroundColor Green
    
    # Optional: Save full response to file
    $response | ConvertTo-Json -Depth 10 | Out-File -FilePath "keyword-magic-tool-response.json" -Encoding UTF8
    Write-Host "`n💾 Full response saved to: keyword-magic-tool-response.json" -ForegroundColor Blue
    
}
catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Completed ===" -ForegroundColor Green

# Alternative test with generic /ai/request endpoint
Write-Host "`n=== Testing via Generic AI Request Endpoint ===" -ForegroundColor Green

$genericEndpoint = "$baseUrl/ai/request"
$genericPayload = @{
    type = "keyword_magic_tool"
    parameters = @{
        seedKeyword = "seo tools"
        industry = "software"
        location = "US"
        includeLongTail = $true
        includeQuestions = $true
        limitPerCategory = 15
    }
    projectId = "test-project-id"
} | ConvertTo-Json -Depth 3

Write-Host "`nGeneric payload:" -ForegroundColor Yellow
Write-Host $genericPayload

try {
    $genericResponse = Invoke-RestMethod -Uri $genericEndpoint -Method POST -Headers $headers -Body $genericPayload
    
    Write-Host "`n✅ Generic endpoint test successful!" -ForegroundColor Green
    Write-Host "Request ID: $($genericResponse.requestId)" -ForegroundColor White
    Write-Host "Status: $($genericResponse.status)" -ForegroundColor White
}
catch {
    Write-Host "`n❌ Generic endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}
