#!/bin/bash
set -e

echo "Checking if node_modules exists..."
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, installing dependencies..."
  npm ci --legacy-peer-deps
else
  echo "node_modules found"
fi

echo "Verifying next binary..."
if [ ! -f "node_modules/.bin/next" ]; then
  echo "ERROR: next binary not found after npm install!"
  ls -la node_modules/.bin/ 2>/dev/null || echo "node_modules/.bin does not exist"
  exit 1
fi

echo "Starting Next.js..."
exec npm start
