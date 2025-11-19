# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copy file cấu hình để tối ưu cache
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Nhận biến API từ Jenkins
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js (standalone mode)
RUN yarn build

# ===== Stage 2: Runner =====
FROM node:20-alpine AS runner
WORKDIR /app

# Copy output tối ưu từ builder (standalone)
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/.next/static ./standalone/.next/static
COPY --from=builder /app/public ./standalone/public

# Chuyển sang thư mục chạy standalone
WORKDIR /app/standalone

EXPOSE 3000

CMD ["node", "server.js"]
