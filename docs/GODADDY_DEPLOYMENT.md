# GoDaddy 部署指南

## 方案概览

| 方案 | 适用场景 | 难度 |
|------|----------|------|
| A. 域名在 GoDaddy + 应用托管 Vercel | 推荐，最简单 | ⭐ |
| B. GoDaddy VPS | 需要服务器控制权 | ⭐⭐⭐ |
| C. GoDaddy cPanel (Node.js) | 部分共享主机支持 | ⭐⭐ |

---

## 方案 A：GoDaddy 域名 + Vercel 托管（推荐）

GoDaddy 共享主机**不支持** Node.js，建议用 Vercel 托管应用，仅用 GoDaddy 管理域名。

### 步骤

1. **在 Vercel 部署**
   - 访问 https://vercel.com，用 GitHub 导入 `Leoninejzh/ZJUAA-website`
   - 配置环境变量后部署

2. **在 GoDaddy 绑定域名**
   - 登录 GoDaddy → 我的产品 → 域名 → 管理 DNS
   - 添加记录：
     - 类型 `A`，主机 `@`，值 `76.76.21.21`（Vercel IP）
     - 类型 `CNAME`，主机 `www`，值 `cname.vercel-dns.com`
   - 在 Vercel 项目 Settings → Domains 中添加你的域名

---

## 方案 B：GoDaddy VPS 部署

若使用 GoDaddy VPS（Linux），可按以下步骤部署。

### 1. 服务器准备

```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2（进程管理）
sudo npm install -g pm2
```

### 2. 上传并构建项目

```bash
# 克隆项目
git clone https://github.com/Leoninejzh/ZJUAA-website.git
cd ZJUAA-website

# 创建 .env 文件
nano .env
# 填入：DATABASE_URL、NEXTAUTH_SECRET、NEXTAUTH_URL、ADMIN_USERNAME、ADMIN_PASSWORD

# 构建
npm install
npx prisma generate
npx prisma db push
npm run build
```

### 3. 使用 PM2 运行

```bash
# 使用 standalone 输出（更轻量，需先 npm run build）
npm run start:standalone

# 或使用 PM2 守护进程（在项目根目录）
pm2 start npm --name zjuaa -- run start:standalone
pm2 save
pm2 startup
```

### 4. 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name 你的域名.com www.你的域名.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. 配置 SSL（Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名.com -d www.你的域名.com
```

---

## 方案 C：GoDaddy cPanel + Node.js

若你的 GoDaddy 主机支持 cPanel 的 Node.js 应用：

1. 登录 cPanel → **Setup Node.js App** → Create Application
2. 上传项目文件（或通过 Git 拉取）
3. 设置 Node.js 版本为 18 或 20
4. 在 Application Root 中执行：
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run build
   ```
5. 将 Start Script 设为 `npm start` 或 `node .next/standalone/server.js`
6. 启动应用

---

## 环境变量（所有方案通用）

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET=随机字符串
NEXTAUTH_URL=https://你的域名.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的密码
```

---

## 建议

- **优先使用方案 A**：维护成本低，自动 HTTPS，适合大多数场景。
- 若必须使用 GoDaddy 服务器，选择 **方案 B（VPS）** 更稳定。
- GoDaddy 共享主机通常不支持 Node.js，不建议使用。
