#!/bin/bash
# Start the log script in the background
./log-script.sh &

# Start the wiremock server
./wiremock.sh
./wait-for.sh localhost:8080 -t 60 -- echo "🚀 Wiremock is up"

# Start nginx
echo "🚀 Starting nginx"
nginx -t
exec nginx -g "daemon off;"
