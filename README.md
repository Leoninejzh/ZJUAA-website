# 浙大大纽约校友会 - 捐赠页面

基于 Next.js 14 和 Tailwind CSS 的捐赠网站，支持 Vercel + Supabase 或 Google Cloud Run 部署。

## 功能

- 捐赠表单（金额、信息、Zelle/信用卡）
- 管理后台（网站设置、活动文章、图片管理）
- 响应式设计，求是蓝主题

## 本地开发

```bash
npm install
cp .env.example .env.local
# 编辑 .env.local：DATABASE_URL、NEXTAUTH_*、ADMIN_*
npm run db:push
npm run dev
```

- 捐赠页: http://localhost:3000
- 管理后台: http://localhost:3000/admin

## 部署

### 方式 A：Vercel + Supabase（推荐）

1. 在 Supabase 创建项目，获取 `DATABASE_URL`
2. 在 Vercel 导入 GitHub 仓库，配置环境变量
3. 首次部署前本地执行 `npx prisma db push` 初始化数据库

详见 [docs/VERCEL_SUPABASE_DEPLOYMENT.md](docs/VERCEL_SUPABASE_DEPLOYMENT.md)。

### 方式 B：Google Cloud Run

```bash
gcloud run deploy zju-donation \
  --image gcr.io/YOUR_PROJECT_ID/zju-donation \
  --set-env-vars "DATABASE_URL=postgresql://..." \
  --set-env-vars "NEXTAUTH_SECRET=..." \
  --set-env-vars "NEXTAUTH_URL=https://xxx.run.app" \
  --set-env-vars "ADMIN_USERNAME=admin" \
  --set-env-vars "ADMIN_PASSWORD=..."
```

详见 [docs/CLOUD_RUN_DEPLOYMENT.md](docs/CLOUD_RUN_DEPLOYMENT.md)。

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `DATABASE_URL` | ✓ | PostgreSQL 连接串 |
| `NEXTAUTH_SECRET` | ✓ | 随机字符串 |
| `NEXTAUTH_URL` | ✓ | 站点完整 URL |
| `ADMIN_USERNAME` | ✓ | 管理员用户名 |
| `ADMIN_PASSWORD` | ✓ | 管理员密码 |
