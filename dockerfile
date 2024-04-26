# Use Fedora image created at ???
FROM fedora@sha256:4e007f288dce23966216be81ef62ba05d139b9338f327c1d1c73b7167dd47312

# Update the system and install Nginx
RUN dnf -y update && \
    dnf -y install nginx java-11-openjdk-devel

# Copy the static HTML files from your host to the container
COPY static /usr/share/nginx/html

# Add the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the log script and the entrypoint script
COPY log-script.sh /log-script.sh
COPY entrypoint.sh /entrypoint.sh
COPY wiremock/wiremock-standalone-3.5.4 /var/wiremock/lib/wiremock-standalone.jar

# Make the scripts executable
RUN chmod +x /log-script.sh /entrypoint.sh

# Expose port 80
EXPOSE 80

# Start the entrypoint script when the container launches
ENTRYPOINT ["/entrypoint.sh"]