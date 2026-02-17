# --- 阶段 1: Deps ---
FROM node:20-alpine AS deps
# 核心补丁：加上 Prisma 需要的库
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

# 【关键保险 1】：在编译前，不管源码有没有，强行在 Builder 容器里造一个 public
RUN mkdir -p public

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

# 【关键保险 2】：在搬运前，在 Runner 容器里也造一个，并使用通配符 COPY
RUN mkdir -p public
# 即使文件夹是空的，通配符也不会报错
COPY --from=builder /app/public* ./public/
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080
ENV PORT 8080

CMD ["node", "server.js"]