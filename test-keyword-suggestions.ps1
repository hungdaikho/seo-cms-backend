# Test script for Keyword Suggestions API endpoint
# Test the AI Keyword Suggestions endpoint according to API specification

$baseUrl = "http://localhost:3001"
$endpoint = "/api/v1/ai/seo/keyword-suggestions"

# Colors for output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Blue"

Write-Host "=== AI Keyword Suggestions API Test ===" -ForegroundColor $Blue
Write-Host ""

# Function to make API request
function Test-KeywordSuggestions {
    param (
        [hashtable]$Body,
        [string]$TestName,
        [bool]$ShouldSucceed = $true
    )
    
    Write-Host "Testing: $TestName" -ForegroundColor $Yellow
    
    try {
        $jsonBody = $Body | ConvertTo-Json -Depth 3
        Write-Host "Request Body: $jsonBody" -ForegroundColor $Blue
        
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method POST -Body $jsonBody -ContentType "application/json" -ErrorAction Stop
        
        if ($ShouldSucceed) {
            Write-Host "✓ Success" -ForegroundColor $Green
            Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor $Green
            
            # Validate response structure
            if ($response.suggestions -and $response.suggestions.Count -gt 0) {
                Write-Host "✓ Response contains suggestions array with $($response.suggestions.Count) items" -ForegroundColor $Green
                
                # Check first suggestion structure
                $firstSuggestion = $response.suggestions[0]
                if ($firstSuggestion.keyword) {
                    Write-Host "✓ Suggestions contain keyword field" -ForegroundColor $Green
                } else {
                    Write-Host "✗ Missing keyword field in suggestions" -ForegroundColor $Red
                }
                
                if ($firstSuggestion.searchVolume -ne $null) {
                    Write-Host "✓ Suggestions contain searchVolume field" -ForegroundColor $Green
                }
                
                if ($firstSuggestion.difficulty -ne $null) {
                    Write-Host "✓ Suggestions contain difficulty field" -ForegroundColor $Green
                }
                
                if ($firstSuggestion.intent) {
                    Write-Host "✓ Suggestions contain intent field: $($firstSuggestion.intent)" -ForegroundColor $Green
                }
                
                if ($firstSuggestion.relevanceScore -ne $null) {
                    Write-Host "✓ Suggestions contain relevanceScore field: $($firstSuggestion.relevanceScore)" -ForegroundColor $Green
                }
            } else {
                Write-Host "✗ Response missing or empty suggestions array" -ForegroundColor $Red
            }
        } else {
            Write-Host "✗ Expected failure but request succeeded" -ForegroundColor $Red
        }
    }
    catch {
        if ($ShouldSucceed) {
            Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor $Red
            if ($_.Exception.Response) {
                $statusCode = [int]$_.Exception.Response.StatusCode
                Write-Host "Status Code: $statusCode" -ForegroundColor $Red
                
                try {
                    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                    $responseBody = $reader.ReadToEnd()
                    Write-Host "Error Response: $responseBody" -ForegroundColor $Red
                }
                catch {
                    Write-Host "Could not read error response body" -ForegroundColor $Red
                }
            }
        } else {
            Write-Host "✓ Expected failure occurred: $($_.Exception.Message)" -ForegroundColor $Green
        }
    }
    Write-Host ""
}

# Test 1: Basic request with just seed keyword
Test-KeywordSuggestions -Body @{
    seedKeyword = "digital marketing"
} -TestName "Basic Request - Seed keyword only"

# Test 2: Request with industry context
Test-KeywordSuggestions -Body @{
    seedKeyword = "seo tools"
    industry = "Technology"
} -TestName "Request with Industry Context"

# Test 3: Request with location context
Test-KeywordSuggestions -Body @{
    seedKeyword = "social media marketing"
    location = "US"
} -TestName "Request with Location Context"

# Test 4: Full request with all parameters
Test-KeywordSuggestions -Body @{
    seedKeyword = "content marketing"
    industry = "E-commerce"
    location = "US"
} -TestName "Full Request - All Parameters"

# Test 5: Invalid request - missing seed keyword (should fail)
Test-KeywordSuggestions -Body @{
    industry = "Technology"
    location = "US"
} -TestName "Invalid Request - Missing Seed Keyword" -ShouldSucceed $false

# Test 6: Invalid request - empty seed keyword (should fail)
Test-KeywordSuggestions -Body @{
    seedKeyword = ""
    industry = "Technology"
} -TestName "Invalid Request - Empty Seed Keyword" -ShouldSucceed $false

# Test 7: Long seed keyword (edge case)
Test-KeywordSuggestions -Body @{
    seedKeyword = "very long seed keyword for testing maximum length validation rules in the api endpoint"
} -TestName "Edge Case - Long Seed Keyword"

# Test 8: Special characters in seed keyword
Test-KeywordSuggestions -Body @{
    seedKeyword = "seo & digital marketing tools"
} -TestName "Edge Case - Special Characters"

# Test 9: Different industries
$industries = @("Healthcare", "Technology", "E-commerce", "Finance", "Education")
foreach ($industry in $industries) {
    Test-KeywordSuggestions -Body @{
        seedKeyword = "online marketing"
        industry = $industry
    } -TestName "Industry Test - $industry"
}

# Test 10: Different locations
$locations = @("US", "UK", "CA", "AU", "DE")
foreach ($location in $locations) {
    Test-KeywordSuggestions -Body @{
        seedKeyword = "web development"
        location = $location
    } -TestName "Location Test - $location"
}

Write-Host "=== Test Complete ===" -ForegroundColor $Blue
Write-Host ""
Write-Host "Next steps:" -ForegroundColor $Yellow
Write-Host "1. Verify all successful tests return valid keyword suggestions"
Write-Host "2. Check that error handling works for invalid requests"
Write-Host "3. Validate response format matches API specification"
Write-Host "4. Test rate limiting if implemented"
Write-Host "5. Test authentication if required"
