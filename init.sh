#!/bin/bash

# Start Docker containers
docker compose up --build -d

# Wait for npm install inside playwright-runner to be ready
echo "Waiting for npm install to complete..."
while ! docker exec playwright-runner [ -d "/app/node_modules" ]; do
  sleep 2
done

# Sync node_modules from container wih host
echo "Syncing node_modules to host..."
docker cp playwright-runner:/app/node_modules/. ./node_modules

echo "Done! node_modules is now available on the host."