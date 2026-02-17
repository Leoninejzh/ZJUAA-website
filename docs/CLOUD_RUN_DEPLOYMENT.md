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
gcloud services enable run.googleapis.com containerregistry.googleapis.com
```

## 3. 构建并推送镜像

```bash
# 使用 Cloud Build 构建
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/zju-donation

# 或本地构建后推送
docker build -t gcr.io/YOUR_PROJECT_ID/zju-donation .
docker push gcr.io/YOUR_PROJECT_ID/zju-donation
```

## 4. 部署到 Cloud Run

```bash
gcloud run deploy zju-donation \
  --image gcr.io/YOUR_PROJECT_ID/zju-donation \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://user:pass@host:5432/db" \
  --set-env-vars "NEXTAUTH_SECRET=your_random_secret" \
  --set-env-vars "NEXTAUTH_URL=https://your-service-xxx.run.app" \
  --set-env-vars "ADMIN_USERNAME=admin" \
  --set-env-vars "ADMIN_PASSWORD=your_password"
```

**必填环境变量：**

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 |
| `NEXTAUTH_SECRET` | 随机字符串（如 `openssl rand -base64 32`） |
| `NEXTAUTH_URL` | 部署后的完整 URL |
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

## 故障排查

- **数据库连接失败**：检查 `DATABASE_URL`、Cloud SQL 连接配置、VPC/防火墙
- **NEXTAUTH 回调错误**：确保 `NEXTAUTH_URL` 与部署 URL 完全一致
- **构建失败**：确认 `npm run build` 在本地可成功执行
