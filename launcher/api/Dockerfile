FROM node:20-alpine
WORKDIR /api

# Install bash, envsubst (via gettext), and curl (to download kubectl)
RUN apk add --no-cache \
    bash \
    gettext \
    curl

# Install kubectl
# This downloads the latest stable version and puts it in the system path
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && install -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl

# Install backend packages
COPY ./package*.json ./
RUN npm ci --omit=dev

# Copy server files and web package files
COPY . .
COPY ../web/package*.json ./web/

# Copy web source and build
RUN cd ./web & npm ci --omit=dev
RUN cd ./web & npm run build --outDir ./build --emptyOutDir
RUN rm -rf ./web

# Ensure deploy.sh is executable
RUN chmod +x ./infra_copy/scripts/deploy.sh

# Run the server
EXPOSE 3000
CMD ["node", "./src/app.mjs"]