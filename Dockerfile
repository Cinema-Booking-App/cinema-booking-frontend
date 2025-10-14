# ===== Stage 1: Build =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copy file cấu hình dependency
COPY package.json yarn.lock ./

# Cài đặt dependencies với Yarn
RUN yarn install --frozen-lockfile

# Copy toàn bộ mã nguồn
COPY . .

# Build dự án Next.js
RUN yarn build

# ===== Stage 2: Run =====
FROM node:20-alpine AS runner
WORKDIR /app

# Copy build từ stage 1
COPY --from=builder /app ./

# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng Next.js
CMD ["yarn", "start"]
