# Vercel + Supabase 部署指南

## 前置条件

- GitHub 仓库已推送代码
- [Supabase](https://supabase.com) 项目已创建
- [Vercel](https://vercel.com) 账号

## 1. 执行数据库「推流」（关键）

**仅配置环境变量是不够的**，必须把本地 Prisma schema 同步到 Supabase。

在 `.env` 或 `.env.local` 中设置 `DATABASE_URL` 为 Supabase 连接串，然后执行：

```bash
npx prisma db push
```

或一行命令（将 `[YOUR-PASSWORD]` 替换为实际密码）：

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ldbbqlmaewuluqmkclno.supabase.co:5432/postgres" npx prisma db push
```

**验证**：登录 Supabase 后台 → Table Editor，应出现 `SiteSettings`、`Donation`、`Article`、`UploadedImage` 等表。若为空，管理后台会因找不到表而报错。

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
| `NEXTAUTH_URL` | `https://你的域名.vercel.app` | 部署后填写实际域名 |
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

部署完成后，将 `NEXTAUTH_URL` 更新为实际域名（如 `https://zju-donation.vercel.app`）。

## 5. 自定义域名（可选）

在 Vercel 项目 **Settings** → **Domains** 中添加自定义域名。
