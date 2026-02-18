# Google Cloud Run 部署指南

## 前置条件

- Google Cloud 账号
- 已安装 [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- PostgreSQL 数据库（Cloud SQL 或 Neon/Supabase）

## 1. 创建数据库

### 方式 A：Cloud SQL（推荐，与 GCP 同区域）

```bash
# 创建实例
gcloud sql instances create zjuaa-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# 创建数据库
gcloud sql databases create zjuaa --instance=zjuaa-db

# 创建用户并设置密码
gcloud sql users create zjuaa --instance=zjuaa-db --password=YOUR_PASSWORD

# 获取连接名
gcloud sql instances describe zjuaa-db --format='value(connectionName)'
```

连接串格式：`postgresql://zjuaa:YOUR_PASSWORD@/zjuaa?host=/cloudsql/CONNECTION_NAME`

### 方式 B：Neon（免费，无需 GCP）

1. 访问 [neon.tech](https://neon.tech) 创建项目
2. 复制 **Connection string** 作为 `DATABASE_URL`

## 2. 配置 gcloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
```

## 3. 构建并推送镜像

```bash
# 在项目根目录执行
cd /path/to/ZJUAA-website

# 使用 cloudbuild.yaml 构建（推荐，内存更大）
gcloud builds submit --config=cloudbuild.yaml

# 或简单方式
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/zju-donation
```

若构建失败，确保在**项目根目录**执行，且已启用 Cloud Build API。

## 4. 部署到 Cloud Run

```bash
gcloud run deploy zju-website \
  --image gcr.io/YOUR_PROJECT_ID/zju-website \
  --platform managed \
  --region us-east1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://postgres:密码@db.xxx.supabase.co:5432/postgres" \
  --set-env-vars "NEXTAUTH_SECRET=your_random_secret" \
  --set-env-vars "NEXTAUTH_URL=https://zju-website-xxx.run.app" \
  --set-env-vars "ADMIN_USERNAME=admin" \
  --set-env-vars "ADMIN_PASSWORD=your_password"
```

**重要**：部署后首次访问前，必须在 Cloud Run 控制台确认环境变量已正确设置：
- 进入 **Cloud Run** → 选择服务 **zju-website** → **编辑与部署新版本** → **变量和密钥**
- 确保 `DATABASE_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL`、`ADMIN_USERNAME`、`ADMIN_PASSWORD` 均已填写

**Supabase 连接**：若使用 Supabase，推荐使用 **Transaction Pooler (6543 端口)** 地址，更适合 serverless：
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```
在 Supabase 控制台 → Connect → Transaction 模式 复制。

**必填环境变量：**

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | Supabase/PostgreSQL 连接串（推荐 6543 pooler） |
| `NEXTAUTH_SECRET` | 随机字符串（如 `openssl rand -base64 32`） |
| `NEXTAUTH_URL` | 部署后的完整 URL（如 https://zju-website-xxx.run.app） |
| `ADMIN_USERNAME` | 管理员用户名 |
| `ADMIN_PASSWORD` | 管理员密码 |

## 5. 连接 Cloud SQL（若使用 Cloud SQL）

```bash
gcloud run deploy zju-donation \
  --image gcr.io/YOUR_PROJECT_ID/zju-donation \
  --add-cloudsql-instances=PROJECT:REGION:INSTANCE \
  --set-env-vars "DATABASE_URL=postgresql://user:pass@/db?host=/cloudsql/PROJECT:REGION:INSTANCE"
```

## 6. 自定义域名（可选）

在 Cloud Run 控制台 → 服务 → 管理自定义网域，添加你的域名。

## 部署前必做：数据库推流

**仅配置环境变量不够**，必须执行一次 `npx prisma db push` 将表结构同步到 Supabase：

```bash
DATABASE_URL="postgresql://postgres:密码@db.xxx.supabase.co:5432/postgres" npx prisma db push
```

验证：Supabase Table Editor 中应出现 `SiteSettings`、`Donation`、`Article` 等表。

## 环境变量：密码特殊字符

若密码含 `@`、`#`、`!`、`*`，需 URL 编码：`@` → `%40`，`#` → `%23`，`!` → `%21`，`*` → `%2A`。

**必填清单**：Cloud Run 面板中需手动添加 `DATABASE_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL`、`ADMIN_USERNAME`、`ADMIN_PASSWORD`。

## 故障排查

- **build step 0 failed**：在项目根目录执行 `gcloud builds submit`；或使用 `gcloud builds submit --config=cloudbuild.yaml`
- **找不到数据库 / PrismaClientInitializationError**：① 确认 Cloud Run 已设置 `DATABASE_URL`；② 若用 Supabase，使用 Transaction Pooler (6543) 地址；③ 可尝试在 URL 末尾加 `?connect_timeout=30`
- **Table "xxx" not found**：未执行 `npx prisma db push`，需先同步表结构
- **数据库连接失败**：检查 `DATABASE_URL`、Cloud SQL 连接配置、VPC/防火墙
- **NEXTAUTH 回调错误**：确保 `NEXTAUTH_URL` 与部署 URL 完全一致

## 查看 Cloud Run 实时日志

1. 进入 Google Cloud 控制台 → 你的服务
2. 点击「日志」(LOGS) 选项卡
3. 查找红色报错信息，根据错误类型对照上方故障排查
