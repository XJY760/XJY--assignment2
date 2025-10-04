# 部署说明

## GitHub Pages 部署

本项目已通过 GitHub Pages 自动部署。

### 部署状态
- ✅ 自动部署已启用
- 源分支：main
- 发布目录：/(root)

### 访问地址
https://[你的GitHub用户名].github.io/[你的仓库名]

### 部署配置
部署通过 GitHub Actions 自动触发，当代码推送到 main 分支时自动构建和发布。

## 本地开发

### 开发服务器
可以使用任何静态文件服务器进行本地开发：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js http-server
npx http-server

# 使用 PHP
php -S localhost:8000