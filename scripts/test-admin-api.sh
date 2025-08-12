#!/bin/bash

# Test Admin API Endpoints
# Make sure the server is running before executing this script

BASE_URL="http://localhost:3001/api/v1"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="Admin1234"

echo "🚀 Testing Admin API..."

# Step 1: Login as admin to get JWT token
echo "📝 Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

echo "Login Response: $LOGIN_RESPONSE"

# Extract token using jq (if available) or grep/sed
if command -v jq &> /dev/null; then
    JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
else
    JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
fi

if [ "$JWT_TOKEN" = "null" ] || [ -z "$JWT_TOKEN" ]; then
    echo "❌ Failed to get JWT token"
    exit 1
fi

echo "✅ JWT Token obtained: ${JWT_TOKEN:0:50}..."

# Step 2: Test admin dashboard stats
echo "📊 Testing dashboard stats..."
curl -s -X GET "$BASE_URL/admin/dashboard/stats" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Dashboard stats response received"

# Step 3: Test get all users
echo "👥 Testing get users..."
curl -s -X GET "$BASE_URL/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Users list response received"

# Step 4: Test get subscription plans
echo "💰 Testing get subscription plans..."
curl -s -X GET "$BASE_URL/admin/subscription-plans" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Subscription plans response received"

# Step 5: Test create new subscription plan
echo "➕ Testing create subscription plan..."
curl -s -X POST "$BASE_URL/admin/subscription-plans" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Plan",
    "slug": "test-plan",
    "description": "Test plan for API testing",
    "price": 9.99,
    "yearlyPrice": 99.99,
    "features": {"test": true},
    "limits": {"test_limit": 100}
  }' | jq '.' || echo "Create plan response received"

echo "🎉 Admin API testing completed!"
