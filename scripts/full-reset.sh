#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              ⚠️  完整环境重置 (终极方案) ⚠️                    ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  警告: 即将执行完整重置,这将:"
echo "   - 停止所有端口 (3009)"
echo "   - 删除 .next 编译缓存"
echo "   - 删除 node_modules 依赖包"
echo "   - 删除 package-lock.json"
echo "   - 清理 npm 缓存"
echo "   - 重新安装所有依赖 (可能需要5-10分钟)"
echo ""
echo "💡 提示: 通常情况下,执行 ./scripts/fix-common-issues.sh 即可解决问题"
echo "        只有在普通修复无效时,才需要执行完整重置"
echo ""
read -p "确认继续? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 已取消"
  exit 0
fi

echo ""
echo "🔧 开始完整重置..."
echo ""

# 1. 停止端口
echo "━━━ 1️⃣ 停止端口 ━━━"
lsof -ti:3009 | xargs kill -9 2>/dev/null || true
sleep 1
echo "✅ 完成"
echo ""

# 2. 删除编译缓存
echo "━━━ 2️⃣ 删除编译缓存 ━━━"
if [ -d ".next" ]; then
  rm -rf .next
  echo "✅ .next 已删除"
else
  echo "⚪ .next 不存在,跳过"
fi
echo ""

# 3. 删除依赖
echo "━━━ 3️⃣ 删除依赖包 ━━━"
if [ -d "node_modules" ]; then
  rm -rf node_modules
  echo "✅ node_modules 已删除"
else
  echo "⚪ node_modules 不存在,跳过"
fi

if [ -f "package-lock.json" ]; then
  rm -f package-lock.json
  echo "✅ package-lock.json 已删除"
else
  echo "⚪ package-lock.json 不存在,跳过"
fi
echo ""

# 4. 清理npm缓存
echo "━━━ 4️⃣ 清理 npm 缓存 ━━━"
npm cache clean --force
echo "✅ 完成"
echo ""

# 5. 重新安装依赖
echo "━━━ 5️⃣ 重新安装依赖 (需要5-10分钟) ━━━"
npm install
echo "✅ 完成"
echo ""

# 6. 设置文件句柄
echo "━━━ 6️⃣ 设置文件句柄限制 ━━━"
ulimit -n 10240 2>/dev/null || true
CURRENT_LIMIT=$(ulimit -n)
echo "✅ 完成 (当前: $CURRENT_LIMIT)"
echo ""

# 完成
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ 重置完成 ✅                               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 下一步:"
echo "   执行: PORT=3009 npm run dev"
echo ""
echo "   或者: npm run dev:safe"
echo ""













