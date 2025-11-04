# 系统级问题排查与管理规范

> **目标**: 避免在端口、文件句柄等系统级问题上反复调试,预防严重故障
> 
> **更新日期**: 2024-11-04  
> **版本**: V3.0.1

---

## 🚨 零、常见问题快速检查清单

> **使用场景**: 当遇到任何开发环境问题时,按此清单依次检查,90%的问题可以快速解决!

### 快速诊断流程图

```
遇到问题
    ↓
【步骤1】检查端口占用 (2分钟)
    ↓ 端口正常?
【步骤2】清理编译缓存 (1分钟)
    ↓ 缓存清理完?
【步骤3】检查文件句柄 (1分钟)
    ↓ 句柄充足?
【步骤4】检查代码语法 (3分钟)
    ↓ 语法正确?
【步骤5】完全重置环境 (5分钟)
    ↓
问题解决 ✅
```

### 0.1 常见问题类型与解决方案

#### 🔴 A类高频问题 (90%概率)

| 问题症状 | 可能原因 | 快速解决 | 耗时 |
|---------|---------|---------|------|
| **页面404/500错误** | Next.js编译缓存过期 | `rm -rf .next && npm run dev` | 1-2分钟 |
| **端口EPERM/EADDRINUSE** | 旧进程占用端口 | `lsof -ti:3009 \| xargs kill -9` | 30秒 |
| **EMFILE: too many files** | 文件句柄不足 | `ulimit -n 10240` | 10秒 |
| **模块找不到/导入错误** | node_modules损坏 | `rm -rf node_modules && npm install` | 2-3分钟 |
| **React Component错误** | 编译缓存+端口占用 | 清缓存+重启服务器 | 1-2分钟 |
| **CSS样式丢失** | 编译缓存问题 | `rm -rf .next && npm run dev` | 1-2分钟 |
| **热重载不生效** | 文件句柄不足 | `ulimit -n 10240 && 重启` | 1分钟 |

#### 🟡 B类中频问题 (8%概率)

| 问题症状 | 可能原因 | 快速解决 | 耗时 |
|---------|---------|---------|------|
| **API 500错误** | 环境变量缺失/错误 | 检查`.env.local` | 2-3分钟 |
| **数据库连接失败** | Supabase配置错误 | 验证`SUPABASE_URL/KEY` | 2-3分钟 |
| **TypeScript类型错误** | 类型定义过期 | `npm run build`检查 | 2-5分钟 |
| **Hydration错误** | SSR/CSR不匹配 | 检查client组件标记 | 5-10分钟 |

#### 🟢 C类低频问题 (2%概率)

| 问题症状 | 可能原因 | 快速解决 | 耗时 |
|---------|---------|---------|------|
| **npm install失败** | npm缓存损坏 | `npm cache clean --force` | 3-5分钟 |
| **Git冲突导致错误** | 代码冲突未解决 | 手动解决冲突 | 10-30分钟 |
| **系统资源耗尽** | 内存/磁盘不足 | 重启电脑/清理磁盘 | 5-15分钟 |

### 0.2 一键诊断命令

创建 `scripts/diagnose.sh`:

```bash
#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🔍 DaysFromToday 开发环境诊断工具 🔍                 ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 1. 检查端口
echo "━━━ 1️⃣ 端口检查 ━━━"
PORT=3009
PID=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PID" ]; then
  echo "❌ 端口 $PORT 被占用 (PID: $PID)"
  echo "   解决: lsof -ti:3009 | xargs kill -9"
else
  echo "✅ 端口 $PORT 空闲"
fi
echo ""

# 2. 检查文件句柄
echo "━━━ 2️⃣ 文件句柄限制 ━━━"
ULIMIT=$(ulimit -n)
if [ "$ULIMIT" -lt 10240 ]; then
  echo "❌ 文件句柄限制过低: $ULIMIT (建议: 10240+)"
  echo "   解决: ulimit -n 10240"
else
  echo "✅ 文件句柄限制充足: $ULIMIT"
fi
echo ""

# 3. 检查编译缓存
echo "━━━ 3️⃣ 编译缓存 ━━━"
if [ -d ".next" ]; then
  SIZE=$(du -sh .next | awk '{print $1}')
  echo "⚠️  编译缓存存在: $SIZE"
  echo "   建议定期清理: rm -rf .next"
else
  echo "✅ 无编译缓存 (或已清理)"
fi
echo ""

# 4. 检查node_modules
echo "━━━ 4️⃣ 依赖包 ━━━"
if [ -d "node_modules" ]; then
  echo "✅ node_modules 存在"
else
  echo "❌ node_modules 缺失"
  echo "   解决: npm install"
fi
echo ""

# 5. 检查环境变量
echo "━━━ 5️⃣ 环境变量 ━━━"
if [ -f ".env.local" ]; then
  echo "✅ .env.local 存在"
  # 检查关键变量(不输出值)
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo "✅ SUPABASE_URL 已配置"
  else
    echo "❌ SUPABASE_URL 缺失"
  fi
else
  echo "❌ .env.local 文件缺失"
fi
echo ""

# 总结
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                        诊断完成                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 快速修复命令:"
echo "   1. 停止端口: lsof -ti:3009 | xargs kill -9"
echo "   2. 清理缓存: rm -rf .next"
echo "   3. 重启服务: ulimit -n 10240 && PORT=3009 npm run dev"
echo ""
```

**使用方法**:
```bash
chmod +x scripts/diagnose.sh
./scripts/diagnose.sh
```

### 0.3 一键修复命令

创建 `scripts/fix-common-issues.sh`:

```bash
#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              🔧 一键修复常见问题 🔧                             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 1. 停止端口
echo "1️⃣ 停止旧进程..."
lsof -ti:3009 | xargs kill -9 2>/dev/null || true
echo "   ✅ 完成"
echo ""

# 2. 清理缓存
echo "2️⃣ 清理编译缓存..."
rm -rf .next
echo "   ✅ 完成"
echo ""

# 3. 设置文件句柄
echo "3️⃣ 设置文件句柄限制..."
ulimit -n 10240 2>/dev/null || true
echo "   ✅ 完成 (当前: $(ulimit -n))"
echo ""

# 4. 重启服务器
echo "4️⃣ 重启开发服务器..."
echo "   命令: PORT=3009 npm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 修复完成! 请手动执行上述命令启动服务器"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**使用方法**:
```bash
chmod +x scripts/fix-common-issues.sh
./scripts/fix-common-issues.sh
```

### 0.4 问题分类决策树

```
遇到错误
    ↓
是否包含 "port" "EADDRINUSE" "EPERM"?
    ├─ 是 → 端口问题 → 执行: lsof -ti:3009 | xargs kill -9
    └─ 否 ↓

是否包含 "EMFILE" "too many files"?
    ├─ 是 → 文件句柄问题 → 执行: ulimit -n 10240
    └─ 否 ↓

是否包含 "404" "500" "Component" "CSS"?
    ├─ 是 → 编译缓存问题 → 执行: rm -rf .next
    └─ 否 ↓

是否包含 "module" "import" "cannot find"?
    ├─ 是 → 依赖问题 → 执行: rm -rf node_modules && npm install
    └─ 否 ↓

是否包含 "API" "fetch" "database"?
    ├─ 是 → 环境变量/API问题 → 检查 .env.local
    └─ 否 ↓

其他问题 → 完全重置 → 执行完整重置流程
```

### 0.5 完整重置流程 (终极方案)

当上述方法都无效时,执行完整重置:

```bash
#!/bin/bash
# 完整重置脚本 - 最后的手段

echo "⚠️  警告: 即将执行完整重置,这将:"
echo "   - 停止所有端口"
echo "   - 删除 .next node_modules package-lock.json"
echo "   - 清理 npm 缓存"
echo "   - 重新安装所有依赖"
echo ""
read -p "确认继续? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🔧 开始重置..."
  
  # 1. 停止端口
  lsof -ti:3009 | xargs kill -9 2>/dev/null || true
  
  # 2. 删除缓存和依赖
  rm -rf .next node_modules package-lock.json
  
  # 3. 清理npm缓存
  npm cache clean --force
  
  # 4. 重新安装
  npm install
  
  # 5. 设置文件句柄
  ulimit -n 10240 2>/dev/null || true
  
  echo "✅ 重置完成! 现在执行: PORT=3009 npm run dev"
else
  echo "❌ 已取消"
fi
```

---

## 📋 一、端口管理标准化

### 1.1 项目端口规范

```bash
# DaysFromToday 项目端口规范
开发环境: 3000 (默认) 或 3009 (当前)
生产环境: 由 Vercel 自动分配
数据库(Supabase): 远程托管,不占用本地端口
```

### 1.2 端口检查脚本

创建 `scripts/check-ports.sh`:

```bash
#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                     端口状态检查工具                             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 检查常用开发端口
PORTS=(3000 3001 3009 3010 8080)

for PORT in "${PORTS[@]}"; do
  PID=$(lsof -ti:$PORT 2>/dev/null)
  if [ -n "$PID" ]; then
    PROCESS=$(ps -p $PID -o comm= 2>/dev/null)
    echo "✅ 端口 $PORT: 占用中 (PID: $PID, 进程: $PROCESS)"
  else
    echo "⚪ 端口 $PORT: 空闲"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "当前项目应该运行在: 3009"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**使用方法**:
```bash
chmod +x scripts/check-ports.sh
./scripts/check-ports.sh
```

### 1.3 安全停止端口脚本

创建 `scripts/stop-port.sh`:

```bash
#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ 错误: 请指定端口号"
  echo "用法: ./scripts/stop-port.sh <端口号>"
  exit 1
fi

PORT=$1
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -n "$PID" ]; then
  PROCESS=$(ps -p $PID -o comm= 2>/dev/null)
  echo "🔍 发现端口 $PORT 被占用"
  echo "   PID: $PID"
  echo "   进程: $PROCESS"
  echo ""
  read -p "确认要停止该进程吗? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kill -9 $PID
    echo "✅ 已停止端口 $PORT 的进程 (PID: $PID)"
  else
    echo "⚪ 已取消操作"
  fi
else
  echo "⚪ 端口 $PORT 当前空闲,无需停止"
fi
```

**使用方法**:
```bash
chmod +x scripts/stop-port.sh
./scripts/stop-port.sh 3009
```

### 1.4 启动服务脚本

创建 `scripts/start-dev.sh`:

```bash
#!/bin/bash

# 配置
PROJECT_PORT=3009
MAX_FILE_HANDLES=10240

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                   启动开发服务器                                 ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 1. 检查端口是否被占用
PID=$(lsof -ti:$PROJECT_PORT 2>/dev/null)
if [ -n "$PID" ]; then
  echo "⚠️  端口 $PROJECT_PORT 已被占用 (PID: $PID)"
  read -p "是否停止旧进程? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kill -9 $PID
    echo "✅ 已停止旧进程"
    sleep 2
  else
    echo "❌ 请手动停止旧进程或更换端口"
    exit 1
  fi
fi

# 2. 增加文件句柄限制
echo "🔧 设置文件句柄限制: $MAX_FILE_HANDLES"
ulimit -n $MAX_FILE_HANDLES

# 3. 检查当前限制
CURRENT_LIMIT=$(ulimit -n)
echo "📊 当前文件句柄限制: $CURRENT_LIMIT"

# 4. 启动服务器
echo ""
echo "🚀 启动开发服务器 (端口: $PROJECT_PORT)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PORT=$PROJECT_PORT npm run dev
```

**使用方法**:
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

---

## 📊 二、文件句柄管理

### 2.1 文件句柄问题识别

**症状**:
- ❌ `Error: EMFILE: too many open files`
- ❌ Watchpack Error (watcher)
- ❌ 所有路由返回 404
- ❌ 页面CSS丢失

**根本原因**:
- Node.js + Next.js 需要 watch 大量文件
- macOS 默认文件句柄限制较低 (256-1024)
- node_modules 包含大量小文件

### 2.2 临时解决方案

```bash
# 当前 shell 会话有效
ulimit -n 10240
```

### 2.3 永久解决方案 (macOS)

1. **创建配置文件** `/Library/LaunchDaemons/limit.maxfiles.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>limit.maxfiles</string>
    <key>ProgramArguments</key>
    <array>
      <string>launchctl</string>
      <string>limit</string>
      <string>maxfiles</string>
      <string>65536</string>
      <string>200000</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>ServiceIPC</key>
    <false/>
  </dict>
</plist>
```

2. **加载配置**:
```bash
sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

3. **验证**:
```bash
ulimit -n
# 应该显示 65536 或更高
```

### 2.4 检查文件句柄脚本

创建 `scripts/check-file-handles.sh`:

```bash
#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                   文件句柄状态检查                               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 当前限制
SOFT_LIMIT=$(ulimit -n)
HARD_LIMIT=$(ulimit -Hn)

echo "📊 文件句柄限制:"
echo "   软限制 (soft): $SOFT_LIMIT"
echo "   硬限制 (hard): $HARD_LIMIT"
echo ""

# 推荐值
if [ "$SOFT_LIMIT" -lt 10240 ]; then
  echo "⚠️  警告: 当前限制较低,可能导致 EMFILE 错误"
  echo "   推荐值: ≥10240"
  echo "   临时修复: ulimit -n 10240"
  echo "   永久修复: 参考 docs/SYSTEM_TROUBLESHOOTING.md"
else
  echo "✅ 文件句柄限制正常"
fi

# 当前使用情况
PORT=3009
PID=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PID" ]; then
  OPEN_FILES=$(lsof -p $PID 2>/dev/null | wc -l)
  echo ""
  echo "📁 当前服务器 (PID: $PID) 打开的文件数: $OPEN_FILES"
  USAGE_PERCENT=$((OPEN_FILES * 100 / SOFT_LIMIT))
  echo "   使用率: $USAGE_PERCENT%"
  
  if [ "$USAGE_PERCENT" -gt 80 ]; then
    echo "   ⚠️  警告: 使用率过高!"
  fi
fi
```

**使用方法**:
```bash
chmod +x scripts/check-file-handles.sh
./scripts/check-file-handles.sh
```

---

## 🔧 三、常见系统级错误速查表

| 错误信息 | 根本原因 | 快速修复 | 永久方案 |
|---------|---------|---------|---------|
| `EADDRINUSE: address already in use` | 端口被占用 | `lsof -ti:3009 \| xargs kill -9` | 使用 `start-dev.sh` 脚本 |
| `EMFILE: too many open files` | 文件句柄不足 | `ulimit -n 10240` | 配置 launchd (macOS) |
| `Watchpack Error (watcher)` | 文件句柄不足 | 同上 | 同上 |
| 所有路由 404 | Next.js 编译失败 | 清理 `.next` + 重启 | 检查文件句柄 + 清理缓存 |
| CSS 消失 | 静态资源编译失败 | 同上 | 同上 |
| `500 Internal Server Error` | 多种可能 | 查看服务器日志 | 根据具体错误修复 |

---

## 🚨 四、紧急恢复流程

### 4.1 服务器完全不可用

```bash
# 1. 停止所有服务
lsof -ti:3009 | xargs kill -9

# 2. 清理编译缓存
rm -rf .next

# 3. 检查文件句柄
ulimit -n
# 如果 < 10240,执行: ulimit -n 10240

# 4. 重启服务器
./scripts/start-dev.sh
# 或: PORT=3009 npm run dev
```

### 4.2 依赖包损坏

```bash
# 1. 停止服务器
lsof -ti:3009 | xargs kill -9

# 2. 清理所有缓存
rm -rf .next
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force

# 3. 重新安装
npm install

# 4. 重启
./scripts/start-dev.sh
```

### 4.3 数据库连接问题

```bash
# 检查环境变量
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 重新加载 .env.local
source .env.local  # 如果是 shell 变量

# 或重启服务器让 Next.js 重新读取
```

---

## 📦 五、预防性维护清单

### 每次开发前 (推荐)

```bash
# 运行健康检查
./scripts/check-ports.sh
./scripts/check-file-handles.sh
```

### 每次大版本更新后 (必须)

```bash
# 1. 完全清理
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

# 2. 重新安装
npm install

# 3. 健康检查
./scripts/check-ports.sh
./scripts/check-file-handles.sh

# 4. 启动服务器
./scripts/start-dev.sh
```

### 每周 (建议)

```bash
# 清理 npm 缓存
npm cache verify

# 检查过期依赖
npm outdated
```

---

## 🎯 六、package.json 脚本集成

建议在 `package.json` 中添加:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:safe": "ulimit -n 10240 && PORT=3009 next dev",
    "dev:check": "bash scripts/check-ports.sh && bash scripts/check-file-handles.sh",
    "dev:clean": "rm -rf .next && npm run dev:safe",
    "dev:reset": "rm -rf .next node_modules package-lock.json && npm install && npm run dev:safe",
    "port:check": "bash scripts/check-ports.sh",
    "port:stop": "bash scripts/stop-port.sh",
    "health": "bash scripts/check-ports.sh && bash scripts/check-file-handles.sh"
  }
}
```

**使用方法**:
```bash
npm run dev:safe      # 安全启动 (自动设置文件句柄)
npm run dev:check     # 启动前检查
npm run dev:clean     # 清理缓存后启动
npm run dev:reset     # 完全重置后启动
npm run health        # 健康检查
```

---

## 📝 七、日志管理

### 7.1 日志文件规范

```bash
# 开发日志
/tmp/daysfromtoday-dev.log

# 错误日志
/tmp/daysfromtoday-error.log
```

### 7.2 日志查看

```bash
# 实时查看
tail -f /tmp/daysfromtoday-dev.log

# 查看错误
tail -100 /tmp/daysfromtoday-dev.log | grep -i error

# 查看端口相关
tail -100 /tmp/daysfromtoday-dev.log | grep -i "EADDRINUSE\|listen"

# 查看文件句柄相关
tail -100 /tmp/daysfromtoday-dev.log | grep -i "EMFILE\|watchpack"
```

---

## 🔍 八、故障诊断决策树

```
服务器问题
├─ 启动失败?
│  ├─ EADDRINUSE → 端口被占用 → stop-port.sh
│  ├─ EMFILE → 文件句柄不足 → ulimit -n 10240
│  └─ 其他错误 → 查看日志 → 根据具体错误修复
│
├─ 启动成功但页面404?
│  ├─ 所有页面404 → Watchpack Error → 文件句柄不足
│  ├─ 特定页面404 → 路由配置错误 → 检查 page.tsx
│  └─ 间歇性404 → 编译缓存问题 → rm -rf .next
│
├─ 页面加载但CSS消失?
│  └─ 静态资源编译失败 → 文件句柄不足 + 清理缓存
│
└─ 页面500错误?
   ├─ 查看浏览器控制台 → 获取详细错误
   ├─ 查看服务器日志 → tail -f /tmp/daysfromtoday-dev.log
   └─ 根据具体错误堆栈修复
```

---

## ✅ 九、最佳实践总结

### 启动开发服务器的标准流程

```bash
# Step 1: 健康检查
npm run health

# Step 2: 如有异常,先清理
npm run dev:clean

# Step 3: 正常启动
npm run dev:safe

# 或一键完成:
./scripts/start-dev.sh
```

### AI Coding 时的注意事项

1. **端口管理**:
   - ✅ 明确当前使用的端口 (当前: 3009)
   - ✅ 重启前先检查端口占用
   - ✅ 停止旧进程后等待 2-3 秒再启动

2. **文件句柄**:
   - ✅ 每次启动前检查: `ulimit -n`
   - ✅ 如果 < 10240,先执行: `ulimit -n 10240`
   - ✅ 大版本更新后必须检查

3. **缓存管理**:
   - ✅ 修改配置文件后清理 `.next`
   - ✅ 依赖更新后清理 `node_modules`
   - ✅ 遇到诡异问题时完全重置

4. **日志查看**:
   - ✅ 启动服务器时输出到日志文件
   - ✅ 问题排查时先看日志
   - ✅ 提供详细错误堆栈

---

## 📚 十、相关文档

- [Next.js 官方文档 - 性能优化](https://nextjs.org/docs/pages/building-your-application/optimizing)
- [Node.js 官方文档 - 文件系统限制](https://nodejs.org/api/fs.html#file-system-flags)
- [macOS ulimit 配置](https://wilsonmar.github.io/maximum-limits/)

---

**文档版本**: v1.0  
**最后更新**: 2024-11-04  
**维护者**: AI Coding Team  
**审核**: Leon

---

**⚠️ 重要提示**:
- 本文档应随项目演进持续更新
- 遇到新的系统级问题时,及时补充到本文档
- 所有 AI Coding 操作前必须先检查本文档
