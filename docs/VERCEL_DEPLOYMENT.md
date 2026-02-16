# Vercel 部署指南（推荐方式）

使用 **Neon** 或 **Supabase** 免费 PostgreSQL，与 Vercel 配合最佳。

---

## 方式一：Neon（推荐）

### 1. 创建 Neon 数据库

1. 访问 https://neon.tech 注册
2. 创建新项目，选择区域（如 `us-east-1`）
3. 复制连接字符串：
   - **Pooled**（用于 DATABASE_URL）
   - **Direct**（用于 DIRECT_URL，迁移用）

### 2. 在 Vercel 配置环境变量

在项目 **Settings → Environment Variables** 添加：

| 变量 | 值 |
|------|-----|
| `DATABASE_URL` | Neon 的 **Pooled** 连接字符串（或 Direct 亦可） |
| `NEXTAUTH_SECRET` | 随机字符串（如 `openssl rand -base64 32`） |
| `NEXTAUTH_URL` | `https://你的项目.vercel.app` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | 你的密码 |

### 3. 首次部署

1. 在 Vercel 配置好 `DATABASE_URL` 和 `DIRECT_URL`
2. 推送代码到 GitHub
3. Vercel 构建时会自动执行 `prisma migrate deploy` 创建表

若迁移失败，可在本地先执行一次（需配置好环境变量）：

```bash
npx prisma migrate deploy
```

---

## 方式二：Supabase

### 1. 创建 Supabase 项目

1. 访问 https://supabase.com 注册
2. 创建新项目
3. 进入 **Settings → Database**，复制连接字符串
4. 使用 **Connection pooling** 或 **Direct** 的 URI 作为 `DATABASE_URL`

### 2. 在 Vercel 配置

同方式一，将 Supabase 的连接字符串填入 `DATABASE_URL`。

### 3. 初始化数据库

```bash
npx prisma db push
```

---

## 方式三：Vercel Postgres（Neon 集成）

1. 在 Vercel 项目 → **Storage** → **Create Database**
2. 选择 **Postgres**（由 Neon 提供）
3. 创建后点击 **Connect**，会自动添加 `POSTGRES_URL` 等变量
4. 若变量名为 `POSTGRES_URL`，在 Vercel 中添加 `DATABASE_URL` = `POSTGRES_URL` 的值

---

## 本地开发

### 使用 Neon/Supabase（与生产一致）

在 `.env.local` 中配置相同的 `DATABASE_URL`。

### 使用本地 PostgreSQL

```bash
# Docker 启动 Postgres
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15

# .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zjuaa"
```

```bash
npx prisma db push
npm run dev
```

---

## 常见问题

**Q: 部署后显示 "Application error"？**  
A: 检查 `DATABASE_URL`、`DIRECT_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL` 是否已正确配置。

**Q: 如何初始化数据库？**  
A: Vercel 构建时会自动执行 `prisma db push`。本地执行 `npx prisma db push` 需先配置好 `DATABASE_URL`。

**Q: 图片上传在 Vercel 上不持久？**  
A: Vercel 文件系统为只读，需使用 Vercel Blob 或 Cloudinary 等云存储。
