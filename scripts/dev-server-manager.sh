#!/bin/bash

###############################################################################
#
#  开发服务器管理工具
#  用途: 统一管理开发服务器的启动、停止、状态检查
#  避免端口冲突、文件句柄不足等系统级问题
#
###############################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="DaysFromToday"
DEFAULT_PORT=3009
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="/tmp/daysfromtoday-dev.log"

###############################################################################
# 1. 系统诊断函数
###############################################################################

# 检查当前所有Node.js进程
check_all_node_processes() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📊 系统中所有 Node.js 进程${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if pgrep -f "node" > /dev/null; then
        ps aux | grep -i node | grep -v grep | while read line; do
            echo -e "${YELLOW}$line${NC}"
        done
    else
        echo -e "${GREEN}✅ 没有运行中的 Node.js 进程${NC}"
    fi
    echo ""
}

# 检查特定端口占用
check_port() {
    local port=$1
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔍 检查端口 ${port} 占用情况${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if lsof -ti:${port} > /dev/null 2>&1; then
        echo -e "${RED}❌ 端口 ${port} 已被占用${NC}"
        echo ""
        lsof -i:${port}
        return 1
    else
        echo -e "${GREEN}✅ 端口 ${port} 可用${NC}"
        return 0
    fi
    echo ""
}

# 检查常用开发端口
check_common_ports() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔍 检查常用开发端口 (3000-3010)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    for port in {3000..3010}; do
        if lsof -ti:${port} > /dev/null 2>&1; then
            local pid=$(lsof -ti:${port})
            local process=$(ps -p ${pid} -o comm= 2>/dev/null || echo "unknown")
            echo -e "${RED}❌ 端口 ${port}: 被占用 (PID: ${pid}, Process: ${process})${NC}"
        else
            echo -e "${GREEN}✅ 端口 ${port}: 可用${NC}"
        fi
    done
    echo ""
}

# 检查文件句柄限制
check_ulimit() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📂 文件句柄限制检查${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local current_limit=$(ulimit -n)
    local soft_limit=$(ulimit -Sn)
    local hard_limit=$(ulimit -Hn)
    
    echo -e "当前限制: ${YELLOW}${current_limit}${NC}"
    echo -e "软限制: ${YELLOW}${soft_limit}${NC}"
    echo -e "硬限制: ${YELLOW}${hard_limit}${NC}"
    echo ""
    
    if [ ${current_limit} -lt 4096 ]; then
        echo -e "${RED}⚠️  警告: 文件句柄限制过低 (当前: ${current_limit})${NC}"
        echo -e "${YELLOW}   建议: 至少 4096, 推荐 10240${NC}"
        echo -e "${YELLOW}   可能导致: 'EMFILE: too many open files' 错误${NC}"
        return 1
    else
        echo -e "${GREEN}✅ 文件句柄限制正常 (${current_limit})${NC}"
        return 0
    fi
    echo ""
}

# 系统资源检查
check_system_resources() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}💻 系统资源状态${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # CPU使用率
    echo -e "${YELLOW}CPU 使用率:${NC}"
    top -l 1 | grep "CPU usage" || echo "无法获取"
    echo ""
    
    # 内存使用
    echo -e "${YELLOW}内存使用:${NC}"
    vm_stat | grep -E "Pages (free|active|inactive|wired)" || echo "无法获取"
    echo ""
    
    # 磁盘空间
    echo -e "${YELLOW}磁盘空间:${NC}"
    df -h . | tail -1
    echo ""
}

###############################################################################
# 2. 端口管理函数
###############################################################################

# 强制停止特定端口的服务
stop_port() {
    local port=$1
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🛑 停止端口 ${port} 的服务${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if lsof -ti:${port} > /dev/null 2>&1; then
        local pids=$(lsof -ti:${port})
        echo -e "${YELLOW}发现进程: ${pids}${NC}"
        
        for pid in ${pids}; do
            local process=$(ps -p ${pid} -o comm= 2>/dev/null || echo "unknown")
            echo -e "${YELLOW}正在停止 PID ${pid} (${process})...${NC}"
            kill -9 ${pid} 2>/dev/null || true
        done
        
        sleep 2
        
        if lsof -ti:${port} > /dev/null 2>&1; then
            echo -e "${RED}❌ 停止失败,端口 ${port} 仍被占用${NC}"
            return 1
        else
            echo -e "${GREEN}✅ 端口 ${port} 已释放${NC}"
            return 0
        fi
    else
        echo -e "${GREEN}✅ 端口 ${port} 未被占用,无需停止${NC}"
        return 0
    fi
    echo ""
}

# 停止所有开发服务器
stop_all() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🛑 停止所有开发服务器 (3000-3010)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local stopped_count=0
    for port in {3000..3010}; do
        if lsof -ti:${port} > /dev/null 2>&1; then
            stop_port ${port}
            stopped_count=$((stopped_count + 1))
        fi
    done
    
    if [ ${stopped_count} -eq 0 ]; then
        echo -e "${GREEN}✅ 没有运行中的服务器${NC}"
    else
        echo -e "${GREEN}✅ 已停止 ${stopped_count} 个服务器${NC}"
    fi
    echo ""
}

###############################################################################
# 3. 服务器启动函数
###############################################################################

# 修复系统环境
fix_environment() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔧 修复系统环境${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # 增加文件句柄限制
    local current_limit=$(ulimit -n)
    if [ ${current_limit} -lt 10240 ]; then
        echo -e "${YELLOW}正在增加文件句柄限制...${NC}"
        ulimit -n 10240 2>/dev/null || {
            echo -e "${YELLOW}⚠️  无法设置到 10240, 尝试设置到最大值...${NC}"
            ulimit -n $(ulimit -Hn) 2>/dev/null || true
        }
        echo -e "${GREEN}✅ 文件句柄限制已设置为: $(ulimit -n)${NC}"
    else
        echo -e "${GREEN}✅ 文件句柄限制已足够: ${current_limit}${NC}"
    fi
    
    # 清理旧日志
    if [ -f "${LOG_FILE}" ]; then
        local log_size=$(du -h "${LOG_FILE}" | cut -f1)
        if [ $(stat -f%z "${LOG_FILE}" 2>/dev/null || echo 0) -gt 10485760 ]; then  # 10MB
            echo -e "${YELLOW}清理旧日志文件 (${log_size})...${NC}"
            rm -f "${LOG_FILE}"
            echo -e "${GREEN}✅ 日志文件已清理${NC}"
        fi
    fi
    
    echo ""
}

# 启动开发服务器
start_server() {
    local port=${1:-$DEFAULT_PORT}
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🚀 启动开发服务器 (端口: ${port})${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # 1. 检查端口
    if ! check_port ${port} > /dev/null 2>&1; then
        echo -e "${RED}❌ 端口 ${port} 已被占用${NC}"
        read -p "是否停止占用进程? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            stop_port ${port}
        else
            echo -e "${RED}❌ 启动取消${NC}"
            return 1
        fi
    fi
    
    # 2. 修复环境
    fix_environment
    
    # 3. 切换到项目目录
    cd "${PROJECT_ROOT}"
    
    # 4. 启动服务器
    echo -e "${GREEN}正在启动服务器...${NC}"
    echo -e "${YELLOW}日志文件: ${LOG_FILE}${NC}"
    echo ""
    
    PORT=${port} npm run dev > "${LOG_FILE}" 2>&1 &
    local pid=$!
    
    # 5. 等待启动
    echo -e "${YELLOW}等待服务器启动...${NC}"
    sleep 5
    
    # 6. 检查是否成功
    if ps -p ${pid} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 服务器启动成功!${NC}"
        echo -e "${GREEN}   PID: ${pid}${NC}"
        echo -e "${GREEN}   端口: ${port}${NC}"
        echo -e "${GREEN}   URL: http://localhost:${port}${NC}"
        echo -e "${YELLOW}   日志: tail -f ${LOG_FILE}${NC}"
        echo ""
        
        # 显示最近的日志
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}📋 最近日志 (最后20行)${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        sleep 2
        tail -20 "${LOG_FILE}" || echo "日志文件还未生成"
    else
        echo -e "${RED}❌ 服务器启动失败!${NC}"
        echo -e "${RED}请查看日志: ${LOG_FILE}${NC}"
        return 1
    fi
    echo ""
}

# 重启服务器
restart_server() {
    local port=${1:-$DEFAULT_PORT}
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔄 重启服务器 (端口: ${port})${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    stop_port ${port}
    sleep 2
    start_server ${port}
}

###############################################################################
# 4. 完整诊断
###############################################################################

full_diagnosis() {
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                  ║${NC}"
    echo -e "${GREEN}║         ${PROJECT_NAME} 开发环境完整诊断                         ║${NC}"
    echo -e "${GREEN}║                                                                  ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_all_node_processes
    check_common_ports
    check_ulimit
    check_system_resources
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ 诊断完成${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

###############################################################################
# 5. 使用说明
###############################################################################

show_help() {
    cat << EOF

${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}
${GREEN}║                                                                  ║${NC}
${GREEN}║         ${PROJECT_NAME} 开发服务器管理工具                       ║${NC}
${GREEN}║                                                                  ║${NC}
${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}

${BLUE}用法:${NC}
  $0 <command> [port]

${BLUE}命令:${NC}
  ${GREEN}status${NC}        - 查看当前服务器状态
  ${GREEN}start [port]${NC}  - 启动服务器 (默认端口: ${DEFAULT_PORT})
  ${GREEN}stop [port]${NC}   - 停止服务器 (默认端口: ${DEFAULT_PORT})
  ${GREEN}restart [port]${NC}- 重启服务器 (默认端口: ${DEFAULT_PORT})
  ${GREEN}stop-all${NC}      - 停止所有开发服务器 (3000-3010)
  ${GREEN}check${NC}         - 检查端口占用情况
  ${GREEN}fix${NC}           - 修复系统环境 (文件句柄等)
  ${GREEN}diagnosis${NC}     - 完整系统诊断
  ${GREEN}logs${NC}          - 查看服务器日志
  ${GREEN}help${NC}          - 显示此帮助信息

${BLUE}示例:${NC}
  $0 status              # 查看当前状态
  $0 start               # 在默认端口(${DEFAULT_PORT})启动服务器
  $0 start 3000          # 在3000端口启动服务器
  $0 stop                # 停止默认端口的服务器
  $0 restart 3009        # 重启3009端口的服务器
  $0 stop-all            # 停止所有开发服务器
  $0 diagnosis           # 完整诊断
  $0 fix                 # 修复环境问题

${BLUE}常见问题:${NC}
  ${YELLOW}Q: 端口被占用怎么办?${NC}
  A: 运行 '$0 stop [port]' 或 '$0 stop-all'

  ${YELLOW}Q: 出现 'EMFILE: too many open files' 错误?${NC}
  A: 运行 '$0 fix' 增加文件句柄限制

  ${YELLOW}Q: 所有页面都404?${NC}
  A: 可能是文件句柄不足或缓存问题,运行 '$0 diagnosis' 诊断

  ${YELLOW}Q: CSS消失或样式错误?${NC}
  A: 清理缓存: rm -rf .next && $0 restart

${BLUE}日志文件:${NC}
  ${LOG_FILE}
  查看: tail -f ${LOG_FILE}

EOF
}

###############################################################################
# 6. 主程序入口
###############################################################################

main() {
    local command=${1:-help}
    local port=${2:-$DEFAULT_PORT}
    
    case ${command} in
        status)
            check_all_node_processes
            check_port ${port}
            ;;
        start)
            start_server ${port}
            ;;
        stop)
            stop_port ${port}
            ;;
        restart)
            restart_server ${port}
            ;;
        stop-all)
            stop_all
            ;;
        check)
            check_common_ports
            ;;
        fix)
            fix_environment
            ;;
        diagnosis)
            full_diagnosis
            ;;
        logs)
            if [ -f "${LOG_FILE}" ]; then
                tail -f "${LOG_FILE}"
            else
                echo -e "${RED}❌ 日志文件不存在: ${LOG_FILE}${NC}"
            fi
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}❌ 未知命令: ${command}${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 运行主程序
main "$@"

