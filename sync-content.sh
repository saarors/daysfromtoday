#!/bin/bash
# sync-content.sh - 同步 Obsidian 内容到项目目录

echo "🔄 同步 Obsidian 内容到项目目录..."

# 检查 obsidian/content 目录是否存在
if [ ! -d "obsidian/content" ]; then
    echo "❌ obsidian/content 目录不存在，请先创建内容"
    exit 1
fi

# 同步博客文章
if [ -d "obsidian/content/blog" ]; then
    echo "📝 同步博客文章..."
    rsync -av --delete obsidian/content/blog/ content/blog/
fi

# 同步哲学文章
if [ -d "obsidian/content/philosophy" ]; then
    echo "🤔 同步哲学文章..."
    rsync -av --delete obsidian/content/philosophy/ content/philosophy/
fi

# 同步工具文章
if [ -d "obsidian/content/tools" ]; then
    echo "🔧 同步工具文章..."
    rsync -av --delete obsidian/content/tools/ content/tools/
fi

# 同步故事文章
if [ -d "obsidian/content/stories" ]; then
    echo "📚 同步故事文章..."
    rsync -av --delete obsidian/content/stories/ content/stories/
fi

# 同步指南文章
if [ -d "obsidian/content/guides" ]; then
    echo "📖 同步指南文章..."
    rsync -av --delete obsidian/content/guides/ content/guides/
fi

# 同步更新日志
if [ -d "obsidian/content/updates" ]; then
    echo "📋 同步更新日志..."
    rsync -av --delete obsidian/content/updates/ content/updates/
fi

echo "✅ 内容同步完成！"
echo "💡 提示：运行 'npm run dev' 启动开发服务器查看效果"

