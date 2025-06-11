# Build stage
FROM node:22-alpine3.20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Accept build argument for API URL
ARG VITE_API_URL=http://goalflow-backend:5000
ENV VITE_API_URL=${VITE_API_URL}

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine3.20

WORKDIR /app

# Install serve package globally to serve static files
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S goalflow -u 1001
RUN chown -R goalflow:nodejs /app
USER goalflow

# Expose port
EXPOSE 5173

# Health check using Node.js
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5173/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start serve to host the React app
CMD ["serve", "-s", "dist", "-l", "5173"]