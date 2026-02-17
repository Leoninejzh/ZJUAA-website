# 阶段 1: 依赖安装
FROM node:20-alpine AS deps
# 核心补丁：安装 openssl 以解决 Prisma 运行时找不到 libssl 的报错
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# 阶段 2: 编译构建
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# 【关键】：这里确保把所有文件（包含 public）都拷进去
COPY . .

# 如果由于某种不可抗力 public 没拷进去，我们手动补一个，确保构建不中断
RUN mkdir -p public

ENV NODE_OPTIONS="--max-old-space-size=4096"
# 这里即使数据库没连上也能编译，解决日志中的渲染错误
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
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080
ENV PORT 8080

CMD ["node", "server.js"]