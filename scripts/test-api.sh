#!/bin/bash

# RankTracker Pro API Test Script
# This script tests all major API endpoints

BASE_URL="http://localhost:3001/api/v1"
ACCESS_TOKEN=""
PROJECT_ID=""
KEYWORD_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 RankTracker Pro API Test Suite"
echo "=================================="

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth_header=""
    
    if [ ! -z "$ACCESS_TOKEN" ]; then
        auth_header="-H \"Authorization: Bearer $ACCESS_TOKEN\""
    fi
    
    if [ ! -z "$data" ]; then
        curl -s -X $method \
            -H "Content-Type: application/json" \
            $auth_header \
            -d "$data" \
            "$BASE_URL$endpoint"
    else
        curl -s -X $method \
            $auth_header \
            "$BASE_URL$endpoint"
    fi
}

# Test 1: Register User
echo -e "\n${YELLOW}Test 1: Register User${NC}"
REGISTER_DATA='{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
}'

REGISTER_RESPONSE=$(make_request "POST" "/auth/register" "$REGISTER_DATA")
echo $REGISTER_RESPONSE | jq .

if echo $REGISTER_RESPONSE | jq -e '.accessToken' > /dev/null; then
    ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
    echo -e "${GREEN}✅ Registration successful${NC}"
else
    echo -e "${RED}❌ Registration failed${NC}"
fi

# Test 2: Login User
echo -e "\n${YELLOW}Test 2: Login User${NC}"
LOGIN_DATA='{
    "email": "test@example.com",
    "password": "TestPassword123!"
}'

LOGIN_RESPONSE=$(make_request "POST" "/auth/login" "$LOGIN_DATA")
echo $LOGIN_RESPONSE | jq .

if echo $LOGIN_RESPONSE | jq -e '.accessToken' > /dev/null; then
    ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
    echo -e "${GREEN}✅ Login successful${NC}"
else
    echo -e "${RED}❌ Login failed${NC}"
fi

# Test 3: Get User Profile
echo -e "\n${YELLOW}Test 3: Get User Profile${NC}"
PROFILE_RESPONSE=$(make_request "GET" "/users/profile")
echo $PROFILE_RESPONSE | jq .

# Test 4: Get Subscription Plans
echo -e "\n${YELLOW}Test 4: Get Subscription Plans${NC}"
PLANS_RESPONSE=$(make_request "GET" "/subscriptions/plans")
echo $PLANS_RESPONSE | jq .

# Test 5: Create Project
echo -e "\n${YELLOW}Test 5: Create Project${NC}"
PROJECT_DATA='{
    "name": "Test SEO Project",
    "domain": "test-example.com",
    "settings": {
        "location": "United States",
        "language": "en"
    }
}'

PROJECT_RESPONSE=$(make_request "POST" "/projects" "$PROJECT_DATA")
echo $PROJECT_RESPONSE | jq .

if echo $PROJECT_RESPONSE | jq -e '.id' > /dev/null; then
    PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
    echo -e "${GREEN}✅ Project created successfully${NC}"
else
    echo -e "${RED}❌ Project creation failed${NC}"
fi

# Test 6: Get Projects
echo -e "\n${YELLOW}Test 6: Get Projects${NC}"
PROJECTS_RESPONSE=$(make_request "GET" "/projects")
echo $PROJECTS_RESPONSE | jq .

# Test 7: Add Keyword (if project was created)
if [ ! -z "$PROJECT_ID" ]; then
    echo -e "\n${YELLOW}Test 7: Add Keyword to Project${NC}"
    KEYWORD_DATA='{
        "keyword": "test seo keyword",
        "targetUrl": "https://test-example.com/seo",
        "searchVolume": 500,
        "difficulty": 45.5,
        "cpc": 1.25
    }'
    
    KEYWORD_RESPONSE=$(make_request "POST" "/projects/$PROJECT_ID/keywords" "$KEYWORD_DATA")
    echo $KEYWORD_RESPONSE | jq .
    
    if echo $KEYWORD_RESPONSE | jq -e '.id' > /dev/null; then
        KEYWORD_ID=$(echo $KEYWORD_RESPONSE | jq -r '.id')
        echo -e "${GREEN}✅ Keyword added successfully${NC}"
    else
        echo -e "${RED}❌ Keyword addition failed${NC}"
    fi
    
    # Test 8: Get Project Keywords
    echo -e "\n${YELLOW}Test 8: Get Project Keywords${NC}"
    KEYWORDS_RESPONSE=$(make_request "GET" "/projects/$PROJECT_ID/keywords")
    echo $KEYWORDS_RESPONSE | jq .
    
    # Test 9: Start Audit
    echo -e "\n${YELLOW}Test 9: Start SEO Audit${NC}"
    AUDIT_DATA='{
        "settings": {
            "include_mobile": true,
            "check_accessibility": true
        }
    }'
    
    AUDIT_RESPONSE=$(make_request "POST" "/projects/$PROJECT_ID/audits" "$AUDIT_DATA")
    echo $AUDIT_RESPONSE | jq .
fi

# Test 10: Get Usage Statistics
echo -e "\n${YELLOW}Test 10: Get Usage Statistics${NC}"
USAGE_RESPONSE=$(make_request "GET" "/users/usage")
echo $USAGE_RESPONSE | jq .

echo -e "\n${GREEN}🎉 API Test Suite Completed!${NC}"
echo "Check the responses above for any errors."
