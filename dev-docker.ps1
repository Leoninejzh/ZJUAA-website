# 使用 Docker 运行项目（无需本地安装 Node.js）
# 用法: .\dev-docker.ps1 [setup|install|db|dev]

$ProjectPath = (Get-Location).Path
$Image = "node:24-alpine"

$Action = $args[0]
if (-not $Action) { $Action = "dev" }

switch ($Action) {
    "setup" {
        Write-Host "首次运行：安装依赖 + 初始化数据库..." -ForegroundColor Cyan
        docker run -it --rm -v "${ProjectPath}:/app" -w /app $Image npm install
        docker run -it --rm -v "${ProjectPath}:/app" -w /app `
            -e DATABASE_URL="file:./prisma/dev.db" `
            $Image npx prisma db push
        Write-Host "完成！运行 .\dev-docker.ps1 dev 启动" -ForegroundColor Green
    }
    "install" {
        Write-Host "安装依赖..." -ForegroundColor Cyan
        docker run -it --rm -v "${ProjectPath}:/app" -w /app $Image npm install
    }
    "db" {
        Write-Host "初始化数据库..." -ForegroundColor Cyan
        docker run -it --rm -v "${ProjectPath}:/app" -w /app `
            -e DATABASE_URL="file:./prisma/dev.db" `
            $Image npx prisma db push
    }
    "dev" {
        Write-Host "启动开发服务器..." -ForegroundColor Cyan
        Write-Host "访问 http://localhost:3000/donation 和 http://localhost:3000/admin" -ForegroundColor Green
        docker run -it --rm -v "${ProjectPath}:/app" -w /app -p 3000:3000 `
            -e DATABASE_URL="file:./prisma/dev.db" `
            -e ADMIN_USERNAME=admin `
            -e ADMIN_PASSWORD=admin123 `
            -e NEXTAUTH_SECRET=dev-secret-change-in-prod `
            -e NEXTAUTH_URL=http://localhost:3000 `
            $Image npm run dev
    }
    default {
        Write-Host "用法: .\dev-docker.ps1 [setup|install|db|dev]"
        Write-Host "  setup   - 首次运行：安装依赖 + 初始化数据库"
        Write-Host "  install - 仅安装依赖"
        Write-Host "  db      - 仅初始化数据库"
        Write-Host "  dev     - 启动开发服务器 (默认)"
    }
}
