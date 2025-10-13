// Templater 示例脚本
// 这个文件用于演示 Templater 脚本功能

module.exports = {
  // 获取当前日期
  getCurrentDate: () => {
    return new Date().toISOString().split('T')[0];
  },
  
  // 获取当前时间
  getCurrentTime: () => {
    return new Date().toLocaleTimeString('zh-CN');
  },
  
  // 生成随机ID
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  }
};
