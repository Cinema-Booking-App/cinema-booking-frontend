# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Copy dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Fix permission cho binary next
RUN chmod +x /app/node_modules/.bin/next

# Build Next.js
RUN yarn build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy build từ stage trước
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]
