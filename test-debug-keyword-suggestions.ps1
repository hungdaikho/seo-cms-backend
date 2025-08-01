# Enhanced debug script for keyword suggestions API
$baseUrl = "http://localhost:3001"

Write-Host "=== Enhanced Debugging Keyword Suggestions API ===" -ForegroundColor Blue
Write-Host "Server URL: $baseUrl" -ForegroundColor Blue
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Blue
Write-Host ""

# Test 1: Test OpenAI connection first
Write-Host "=== Step 1: Testing OpenAI Connection ===" -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/ai/test-connection" -Method GET -ContentType "application/json" -TimeoutSec 30
    Write-Host "✓ OpenAI Connection: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($testResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "✗ OpenAI Connection: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error Details: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error details" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Step 2: Testing Keyword Suggestions ===" -ForegroundColor Yellow

# Test 2: Simple keyword suggestion with detailed error handling
$testCases = @(
    @{
        name = "Basic Test - SEO Tools"
        body = @{
            seedKeyword = "seo tools"
        }
    },
    @{
        name = "With Industry Context"
        body = @{
            seedKeyword = "digital marketing"
            industry = "Technology"
        }
    },
    @{
        name = "With Location"
        body = @{
            seedKeyword = "web design"
            location = "US"
        }
    },
    @{
        name = "Full Parameters"
        body = @{
            seedKeyword = "content marketing"
            industry = "E-commerce"
            location = "UK"
        }
    }
)

foreach ($testCase in $testCases) {
    Write-Host ""
    Write-Host "Testing: $($testCase.name)" -ForegroundColor Cyan
    
    try {
        $jsonBody = $testCase.body | ConvertTo-Json -Depth 3
        Write-Host "Request Body: $jsonBody" -ForegroundColor Blue
        
        Write-Host "Sending request..." -ForegroundColor Blue
        $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/ai/seo/keyword-suggestions" -Method POST -Body $jsonBody -ContentType "application/json" -TimeoutSec 60
        
        Write-Host "✓ SUCCESS: $($testCase.name)" -ForegroundColor Green
        Write-Host "Response Type: $($response.GetType().Name)" -ForegroundColor Green
        Write-Host "Response Count: $($response.Count)" -ForegroundColor Green
        
        if ($response.Count -gt 0) {
            Write-Host "Sample Suggestions:" -ForegroundColor Green
            $response | Select-Object -First 3 | ForEach-Object {
                Write-Host "  - $($_.keyword) (Intent: $($_.intent), Score: $($_.relevanceScore))" -ForegroundColor Green
            }
        }
        
        # Full response for debugging
        Write-Host "Full Response:" -ForegroundColor Blue
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Blue
        
    } catch {
        Write-Host "✗ FAILED: $($testCase.name)" -ForegroundColor Red
        Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            Write-Host "Status Code: $statusCode" -ForegroundColor Red
            
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "Error Response Body:" -ForegroundColor Red
                Write-Host $responseBody -ForegroundColor Red
                
                # Try to parse as JSON for better formatting
                try {
                    $errorJson = $responseBody | ConvertFrom-Json
                    Write-Host "Parsed Error Details:" -ForegroundColor Red
                    Write-Host "  Error: $($errorJson.error)" -ForegroundColor Red
                    Write-Host "  Message: $($errorJson.message)" -ForegroundColor Red
                    Write-Host "  Status Code: $($errorJson.statusCode)" -ForegroundColor Red
                } catch {
                    Write-Host "Could not parse error response as JSON" -ForegroundColor Red
                }
            } catch {
                Write-Host "Could not read error response body" -ForegroundColor Red
            }
        }
        
        Write-Host "Exception Details:" -ForegroundColor Red
        Write-Host "  Type: $($_.Exception.GetType().Name)" -ForegroundColor Red
        Write-Host "  Source: $($_.Exception.Source)" -ForegroundColor Red
        if ($_.Exception.InnerException) {
            Write-Host "  Inner Exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Debug Complete ===" -ForegroundColor Blue
Write-Host ""
Write-Host "Next Steps for Debugging:" -ForegroundColor Yellow
Write-Host "1. Check the server terminal logs for detailed debugging output" -ForegroundColor Yellow
Write-Host "2. Verify OPENAI_API_KEY is set in .env file" -ForegroundColor Yellow
Write-Host "3. Ensure the server is running on port 3001" -ForegroundColor Yellow
Write-Host "4. Check if there are any compilation errors in the server" -ForegroundColor Yellow
