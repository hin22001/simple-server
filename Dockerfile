# Dockerfile
# Stage 1: Build (only needed if you have npm install)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Stage 2: Runtime (super small final image)
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejsuser -u 1001
USER nodejsuser

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]