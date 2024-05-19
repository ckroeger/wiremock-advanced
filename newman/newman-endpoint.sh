#!/bin/bash
cd /home/newman
export NMV=$(newman -v)

echo "🚀 Starting newman-endpoint with version: $NMV"
node index.js &
node websocket.js &