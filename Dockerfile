FROM node:20-alpine

# 1. 安装必要的系统运行库 (解决 Prisma 在 Alpine 上的兼容性问题)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 2. 首先复制 package 文件以利用 Docker 缓存
COPY package.json package-lock.json* ./

# 3. 复制 prisma 以便 postinstall 中的 prisma generate 能执行
COPY prisma ./prisma

# 4. 安装全部依赖 (--ignore-scripts 避免 postinstall 在无 schema 时失败)
RUN npm ci --ignore-scripts

# 5. 复制项目所有文件 (包括 public 等)
COPY . .

# 6. 确保 public 存在
RUN mkdir -p public

# 7. 设置环境变量并构建 (build 内含 prepare-db + prisma generate)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PRISMA_CLI_BINARY_TARGETS="native,linux-musl-openssl-3.0.x"
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN npm run build

# 8. 配置运行参数
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# 9. 启动命令
CMD ["npm", "start"]
