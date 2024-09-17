FROM docker:dind

# Install necessary packages
RUN apk add --no-cache \
    openssh-server \
    curl \
    gnupg \
    ca-certificates

# Set up SSH
RUN mkdir -p /root/.ssh
COPY id_rsa.pub /root/.ssh/authorized_keys
RUN chmod 700 /root/.ssh && chmod 600 /root/.ssh/authorized_keys

RUN mkdir -p /run/sshd

RUN mkdir -p /data/cloudcrafter
# Generate SSH host keys
RUN ssh-keygen -A
# Expose SSH port
EXPOSE 22

RUN echo '#!/bin/sh' > /start.sh && \
    echo 'dockerd-entrypoint.sh &' >> /start.sh && \
    echo '/usr/sbin/sshd -D' >> /start.sh && \
    chmod +x /start.sh

# Use the startup script as the entrypoint
ENTRYPOINT ["/start.sh"]