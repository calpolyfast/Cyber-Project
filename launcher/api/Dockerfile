FROM node:20-alpine
WORKDIR /app

# Install backend packages
COPY ./package*.json ./
RUN npm ci --omit=dev

# Copy server files and run it
COPY . .
EXPOSE 3000
CMD ["node", "./src/app.mjs"]