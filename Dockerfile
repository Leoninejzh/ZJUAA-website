# 阶段 1: 依赖安装
FROM node:20-alpine AS deps
# 安装 openssl 以解决 Prisma 运行时找不到 libssl 的报错
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# 阶段 2: 编译构建
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# 【关键点 1】：确保将所有本地文件（包含 public）都拷进去
COPY . .

# 【关键点 2】：即使由于 ignore 没搬进去，我们也强行造一个，确保搬运工不会报错
RUN mkdir -p public

ENV PRISMA_CLI_BINARY_TARGETS="native,linux-musl-openssl-3.0.x"
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build

# 阶段 3: 运行环境
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 【核心修复】：搬运时使用目录保护
# 即使源路径不存在，mkdir 也会保证目的地有这个路径，防止 COPY 报错
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
