# Multi-stage Docker build for backend
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Production Runner stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Security: Non-root user
USER node

EXPOSE 5000

CMD ["node", "dist/index.js"]
