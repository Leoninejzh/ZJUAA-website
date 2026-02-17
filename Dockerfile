# --- 阶段 1: Deps ---
FROM node:20-alpine AS deps
# 补齐 Alpine 缺少的库，解决 Prisma 的 libssl 报错
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# --- 阶段 2: Builder ---
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 【核心修复：在编译前强行创建一个 public 目录】
# 这样无论你的 GitHub 仓库里有没有这个文件夹，镜像层里都一定会有它
RUN mkdir -p public

ENV PRISMA_CLI_BINARY_TARGETS="native,linux-musl-openssl-3.0.x"
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build

# --- 阶段 3: Runner ---
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 【核心修复：确保收货地址也存在，并安全搬运】
RUN mkdir -p public
COPY --from=builder /app/public ./public/
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
