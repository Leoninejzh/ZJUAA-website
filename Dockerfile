# 浙大捐赠站 - Google Cloud Run 优化版
# 使用 PostgreSQL（Cloud Run 无状态，需外部数据库）

# Stage 1: 依赖
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Stage 2: 构建
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl openssl1.1-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 强制创建 public 目录，确保后续 COPY 指令不会失效
RUN mkdir -p public

ENV PRISMA_CLI_BINARY_TARGETS="native,linux-musl-openssl-3.0.x"
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Stage 3: 运行
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl openssl1.1-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p public

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
