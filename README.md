# 浙大大纽约校友会 - 捐赠页面

基于 Next.js (App Router) 和 Tailwind CSS 构建的高性能、响应式非营利组织捐赠页面。

## 技术栈

- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide-react
- **表单验证**: Zod + React Hook Form
- **部署**: Vercel / Docker (Google Cloud Run)

## 功能特性

- 现代化 Hero 区域，求是蓝主题
- 双栏布局：捐赠故事/资金透明度 + 捐赠表单
- 三步捐赠流程：金额 → 信息 → 支付方式
- Zelle 弹窗（收款账号 + 二维码）
- 信用卡/PayPal 预留接口
- 移动端优先响应式设计
- 提交成功感谢弹窗
- API 路由 `/api/donate` 模拟接收数据
- **管理后台**：Admin 登录后可上传图片、修改网站各项要素

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量并配置
cp .env.example .env.local

# 初始化数据库
npm run db:push

# 开发模式
npm run dev

# 构建
npm run build

# 生产运行
npm start
```

- 捐赠页面: http://localhost:3000/donation
- 管理后台: http://localhost:3000/admin

## Admin 账户配置

在 `.env.local` 中配置：

```env
# 方式1: 明文密码（开发环境）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password

# 方式2: 密码哈希（生产环境推荐）
# 运行: node scripts/hash-password.js your_password
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$...
```

并设置 `NEXTAUTH_SECRET`（随机字符串）和 `NEXTAUTH_URL`（如 `http://localhost:3000`）。

## 部署

### Vercel 一键部署

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 点击 Deploy 即可

或使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

### Docker 部署

使用 Node.js 24 镜像，支持本地开发和生产部署。

```powershell
# 方式1: 开发模式（无需安装 Node.js，用 Docker 跑）
cd "c:\Users\zhji\Projects\ZJU web"
.\dev-docker.ps1 setup   # 首次运行
.\dev-docker.ps1 dev     # 启动

# 方式2: Docker Compose（生产式运行）
docker compose up --build

# 方式3: 直接构建运行
docker build -t zju-donation .
docker run -p 3000:3000 \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=admin123 \
  -e NEXTAUTH_SECRET=your_secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -v zju-data:/app/data \
  -v zju-uploads:/app/public/uploads \
  zju-donation
```

访问 http://localhost:3000/donation 和 http://localhost:3000/admin

## Vercel 部署必填环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | SQLite: `file:./prisma/dev.db`（Vercel 上 SQLite 受限，建议用 Vercel Postgres 或 Turso） |
| `NEXTAUTH_SECRET` | 随机字符串，可用 `openssl rand -base64 32` 生成 |
| `NEXTAUTH_URL` | 部署后的完整 URL，如 `https://xxx.vercel.app` |
| `ADMIN_USERNAME` | 管理员用户名 |
| `ADMIN_PASSWORD` | 管理员密码 |

## 配置说明

- **网站内容**: 登录 Admin 后台 `/admin`，在「网站设置」中修改 Hero 标题、捐赠故事、Zelle 邮箱等
- **图片上传**: 在「图片管理」中上传，复制链接后填入网站设置的 Hero 背景图 URL
- **品牌色**: 在 `tailwind.config.ts` 中已配置 `zju-blue` (#003f87)
