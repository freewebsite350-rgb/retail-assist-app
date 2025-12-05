#!/bin/bash
# Quick test to verify all routes are working

BASE_URL="http://localhost:3000"

echo "🧪 Testing Retail Assist Bot Routes..."
echo ""

# Test homepage
echo "1️⃣  Testing homepage..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/"

# Test auth pages
echo "2️⃣  Testing /auth/login..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/auth/login"

echo "3️⃣  Testing /auth/signup..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/auth/signup"

# Test dashboard (protected)
echo "4️⃣  Testing /dashboard (should redirect if not logged in)..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/dashboard"

echo ""
echo "✅ Route verification complete!"
echo ""
echo "📱 Open http://localhost:3000 in your browser to test the full flow:"
echo "   1. Sign up at /auth/signup"
echo "   2. Go to /dashboard/agents/new to create an agent"
echo "   3. Test chat at /dashboard/agents/[id]"
