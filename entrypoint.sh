#!/bin/bash
# Start the log script in the background
./log-script.sh &

# Start the wiremock server
./wiremock.sh
./wait-for.sh localhost:8080 -t 60 -- echo "🚀 Wiremock is up"

# check node version
node -v

# Start the wiremock server
ls /home/newman
/home/newman/newman-endpoint.sh
./wait-for.sh localhost:3000 -t 60 -- echo "🚀 Newman-Endpoint is up"

# Start nginx
echo "🚀 Starting nginx"
nginx -t
exec nginx -g "daemon off;"
