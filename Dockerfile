# 1. Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files và cài deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# Build Next.js
RUN npm run build

# 2. Production stage
FROM node:20-alpine
WORKDIR /app

# Copy package.json để cài prod deps
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copy build từ stage trước
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
