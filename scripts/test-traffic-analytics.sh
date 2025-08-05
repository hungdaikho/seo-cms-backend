#!/bin/bash

# Traffic Analytics API Test Script
# Test các endpoint của Traffic Analytics

BASE_URL="http://localhost:3000/api/v1"
PROJECT_ID="your-project-id"
TOKEN="your-jwt-token"

echo "🚀 Testing Traffic Analytics API Endpoints"
echo "=========================================="

# Function to make API calls
make_request() {
    local endpoint=$1
    local method=${2:-GET}
    echo "Testing: $method $endpoint"
    curl -s -X $method \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        "$BASE_URL$endpoint" | jq '.' || echo "❌ Failed"
    echo ""
}

# Test Traffic Overview
echo "📊 1. Traffic Overview"
make_request "/projects/$PROJECT_ID/traffic-analytics/overview?period=7d"

# Test Page Performance
echo "📄 2. Page Performance"
make_request "/projects/$PROJECT_ID/traffic-analytics/pages?limit=10"

# Test Traffic Sources
echo "🔗 3. Traffic Sources"
make_request "/projects/$PROJECT_ID/traffic-analytics/sources?period=30d"

# Test User Behavior
echo "👥 4. User Behavior"
make_request "/projects/$PROJECT_ID/traffic-analytics/user-behavior"

# Test Real-time Analytics
echo "⚡ 5. Real-time Analytics"
make_request "/projects/$PROJECT_ID/traffic-analytics/real-time"

# Test Data Sync
echo "🔄 6. Data Synchronization"
make_request "/projects/$PROJECT_ID/traffic-analytics/sync" "POST"

# Test Advanced Endpoints
echo "🧪 7. Advanced Features"
make_request "/projects/$PROJECT_ID/traffic-analytics/conversion-funnel"
make_request "/projects/$PROJECT_ID/traffic-analytics/cohort-analysis"
make_request "/projects/$PROJECT_ID/traffic-analytics/audience-insights"
make_request "/projects/$PROJECT_ID/traffic-analytics/custom-events"

echo "✅ Traffic Analytics API Testing Complete!"
echo ""
echo "📚 API Documentation: /docs/TRAFFIC_ANALYTICS_API.md"
echo "🔧 Setup Guide: Check the documentation for Google Analytics integration"
