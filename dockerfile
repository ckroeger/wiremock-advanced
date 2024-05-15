# Use Fedora image created at ???
FROM fedora@sha256:4e007f288dce23966216be81ef62ba05d139b9338f327c1d1c73b7167dd47312

# Update the system and install Nginx
RUN dnf -y update && \
    dnf -y install nginx \
    java-11-openjdk-devel \
    dos2unix

# Install Node.js v20.9.0
RUN curl -sL https://rpm.nodesource.com/setup_20.x | bash - && \
    dnf -y install nodejs

# Copy the static HTML files from your host to the container
COPY static /usr/share/nginx/html

# Add the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the log script and the entrypoint script
COPY *.sh /

# Copy the Wiremock files
COPY wiremock/wiremock-standalone-3.5.4.jar /var/wiremock/lib/wiremock-standalone.jar
COPY wiremock/__files /home/wiremock/__files
COPY wiremock/mappings /home/wiremock/mappings
COPY wiremock/wiremock.sh /home/wiremock/wiremock.sh

# Make the scripts executable
RUN chmod +x /log-script.sh /entrypoint.sh /wiremock.sh /home/wiremock/wiremock.sh
RUN dos2unix /log-script.sh /entrypoint.sh /wiremock.sh /home/wiremock/wiremock.sh

# Expose port 80
EXPOSE 80

# Start the entrypoint script when the container launches
ENTRYPOINT ["/entrypoint.sh"]