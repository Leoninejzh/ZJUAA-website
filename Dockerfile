FROM node:20-alpine

# 1. 安装系统库 (彻底解决你日志中 Prisma 的 OpenSSL 报错)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 2. 复制依赖描述文件
COPY package.json package-lock.json* ./

# 3. 复制 prisma 以便 postinstall 中的 prisma generate 能执行
COPY prisma ./prisma

# 4. 安装依赖
RUN npm ci

# 5. 【核心修复】复制所有文件（不再分阶段搬运，确保 public 在原地）
COPY . .

# 6. 生成 Prisma 代码
RUN npx prisma generate

# 7. 设置变量并构建
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PRISMA_CLI_BINARY_TARGETS="native,linux-musl-openssl-3.0.x"
# 预设占位符，解决编译时的静态页面生成需求
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN npm run build

# 8. 配置端口
EXPOSE 8080
ENV PORT=8080

# 9. 启动应用 (不再使用 standalone 模式)
CMD ["npm", "start"]
