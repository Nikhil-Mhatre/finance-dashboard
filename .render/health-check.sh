#!/usr/bin/env bash
# AI Finance Dashboard - Health Check Script

# Exit codes: 0 = healthy, 1 = unhealthy

echo "🔍 Running health checks..."

# Check if server is responding
if curl -f -s http://localhost:$PORT/health > /dev/null; then
    echo "✅ Server responding"
else
    echo "❌ Server not responding"
    exit 1
fi

# Check database connection (via health endpoint)
HEALTH_RESPONSE=$(curl -s http://localhost:$PORT/health)
if echo "$HEALTH_RESPONSE" | grep -q '"database":"connected"'; then
    echo "✅ Database connected"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Check Redis connection (via health endpoint)
if echo "$HEALTH_RESPONSE" | grep -q '"redis":"healthy"'; then
    echo "✅ Redis connected"
else
    echo "⚠️ Redis not available (continuing without cache)"
fi

echo "✅ All health checks passed!"
exit 0
