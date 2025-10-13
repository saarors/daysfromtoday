#!/bin/bash

# Obsidian 快速启动脚本
# 功能：一键配置和启动 Obsidian 工作流

set -e

echo "🚀 启动 Obsidian 工作流..."

# 检查 Node.js 环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm 环境
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查项目依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
fi

# 检查环境变量
if [ ! -f ".env.local" ]; then
    echo "⚠️  环境变量文件不存在，请先配置 .env.local"
    echo "📝 复制模板文件："
    echo "   cp env.local.template .env.local"
    echo "   然后编辑 .env.local 文件"
    exit 1
fi

# 检查 Obsidian 目录
if [ ! -d "obsidian" ]; then
    echo "❌ Obsidian 目录不存在，请先创建"
    exit 1
fi

# 配置 Obsidian 插件
echo "🔧 配置 Obsidian 插件..."
npm run obsidian:setup

# 启动同步服务
echo "🔄 启动文件同步服务..."
npm run sync:obsidian:watch &

# 启动开发服务器
echo "🌐 启动开发服务器..."
npm run dev &

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo "✅ 服务状态检查："
echo "   - 开发服务器：http://localhost:3000"
echo "   - 文件同步：已启动"
echo "   - Obsidian：请手动打开"

# 显示使用说明
echo ""
echo "📖 使用说明："
echo "   1. 打开 Obsidian，选择项目目录"
echo "   2. 按 Ctrl+Shift+T 创建新文章"
echo "   3. 编写内容并保存"
echo "   4. 查看网站自动更新"
echo ""
echo "🔧 快捷键："
echo "   - Ctrl+Shift+T：创建新文章"
echo "   - Ctrl+Shift+I：上传图片"
echo "   - Ctrl+Shift+V：从剪贴板上传图片"
echo ""
echo "📁 文件结构："
echo "   obsidian/content/blog/en/  # 英文博客"
echo "   obsidian/content/blog/zh/  # 中文博客"
echo "   obsidian/templates/        # 模板文件"
echo ""
echo "🎉 工作流已启动！按 Ctrl+C 停止所有服务"

# 等待用户中断
trap 'echo "👋 停止所有服务..."; kill $(jobs -p) 2>/dev/null; exit 0' INT
wait
