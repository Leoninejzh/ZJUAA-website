# 浙大捐赠站 - Google Cloud Run 优化版
# 使用 PostgreSQL（Cloud Run 无状态，需外部数据库）

# --- 阶段 1: deps ---
FROM node:20-alpine AS deps
# 核心修复：安装 openssl 解决 Prisma 运行环境问题
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# --- 阶段 2: builder ---
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 关键补丁：如果源码里没 public 文件夹，在这里强行造一个，runner 搬运时不会报错
RUN mkdir -p public

ENV PRISMA_CLI_BINARY_TARGETS="native,linux-musl-openssl-3.0.x"
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# --- 阶段 3: runner ---
FROM node:20-alpine AS runner
# 运行环境也必须有 openssl，否则上线后 Prisma 会报 SSL 错误
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 关键搬运：builder 里肯定有 public 了，哪怕是空的
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
