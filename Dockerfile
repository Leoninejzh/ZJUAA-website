FROM node:20-alpine

# 1. 安装系统补丁 (彻底解决日志中 Prisma 的 libssl 报错)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 2. 复制依赖文件
COPY package.json package-lock.json* ./

# 3. 复制 prisma 以便 postinstall 能执行
COPY prisma ./prisma

# 4. 安装依赖
RUN npm ci

# 5. 【核心修复】：一次性复制所有文件，不再搬运
COPY . .

# 6. 生成 Prisma
RUN npx prisma generate

# 7. 设置变量并构建 (忽略数据库连接以完成构建)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN npm run build

# 8. 配置端口与启动
EXPOSE 8080
ENV PORT=8080

# 关键：不再使用 standalone 搬运模式，直接启动
CMD ["npm", "start"]
