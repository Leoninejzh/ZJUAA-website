# Vercel + Supabase 部署指南

## 前置条件

- GitHub 仓库已推送代码
- [Supabase](https://supabase.com) 项目已创建
- [Vercel](https://vercel.com) 账号

## 1. 执行数据库「推流」（关键）

**仅配置环境变量是不够的**，必须把本地 Prisma schema 同步到 Supabase。

### 方式 A：本地执行（网络可访问 Supabase 时）

在 `.env` 中设置 `DATABASE_URL` 后执行：

```bash
npx prisma db push
```

### 方式 B：GitHub Actions 云端执行（本地无法连接 Supabase 时）

若本地网络无法访问 Supabase（如 "This site can't be reached"），可用 GitHub 云端执行：

1. 打开仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加：
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:你的密码@db.ldbbqlmaewuluqmkclno.supabase.co:5432/postgres`
3. 打开 **Actions** → 选择 **Prisma DB Push** → **Run workflow**

**验证**：Supabase 后台 → Table Editor，应出现 `SiteSettings`、`Donation`、`Article`、`UploadedImage` 等表。

## 2. 连接 Vercel

1. 登录 [Vercel](https://vercel.com)
2. 点击 **Add New** → **Project**
3. 选择 GitHub 仓库 `Leoninejzh/ZJUAA-website`
4. 框架预设选择 **Next.js**（自动识别）

## 3. 配置环境变量

在 Vercel 项目 **Settings** → **Environment Variables** 中添加：

| 变量 | 值 | 说明 |
|------|-----|------|
| `DATABASE_URL` | Supabase 连接串 | 见下方「密码特殊字符」说明 |
| `NEXTAUTH_SECRET` | 随机字符串 | 如 `openssl rand -base64 32` 生成 |
| `NEXTAUTH_URL` | `https://你的域名.vercel.app` | **必填**，必须与部署后的完整网址一致，否则管理后台会报错 |
| `ADMIN_USERNAME` | `admin` | 管理员用户名 |
| `ADMIN_PASSWORD` | 你的密码 | 管理员密码 |

### 密码包含特殊字符时

若 Supabase 密码含 `@`、`#`、`!`、`*` 等，直接粘贴到 `DATABASE_URL` 会导致 Prisma 解析失败。需对密码进行 **URL 编码**：

| 字符 | 编码 |
|------|------|
| `@` | `%40` |
| `#` | `%23` |
| `!` | `%21` |
| `*` | `%2A` |

例如密码为 `My@Pass#123`，应写为 `My%40Pass%23123`。

## 4. 部署

点击 **Deploy**，Vercel 会自动构建并部署。

**重要**：部署完成后，务必在 Vercel 环境变量中将 `NEXTAUTH_URL` 更新为实际域名（如 `https://zju-donation.vercel.app`），否则管理后台会报「加载时发生错误」。

## 5. 自定义域名（可选）

在 Vercel 项目 **Settings** → **Domains** 中添加自定义域名。
