#!/usr/bin/env tsx

/**
 * Obsidian 插件配置脚本
 * 
 * 功能：
 * 1. 配置 Templater 插件
 * 2. 配置 Image Uploader 插件
 * 3. 设置工作流快捷键
 * 4. 创建自定义 CSS 样式
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const OBSIDIAN_DIR = 'obsidian';

class ObsidianPluginSetup {
  /**
   * 创建 Templater 配置
   */
  private createTemplaterConfig(): void {
    const templaterConfig = {
      "command_timeout": 5000,
      "templates_folder": "templates",
      "templates_pairs": [
        ["<%", "%>"],
        ["<%*", "*%>"]
      ],
      "enable_system_commands": true,
      "shell_path": "/bin/zsh",
      "user_scripts_folder": "scripts",
      "enable_folder_templates": true,
      "folder_templates": [
        {
          "folder": "content/blog/en",
          "template": "blog-template-optimized.md"
        },
        {
          "folder": "content/blog/zh", 
          "template": "blog-template-optimized.md"
        }
      ],
      "enable_file_templates": true,
      "file_templates": [
        {
          "trigger": "blog",
          "template": "blog-template-optimized.md"
        }
      ]
    };

    const configPath = join(OBSIDIAN_DIR, '.obsidian', 'plugins', 'templater-obsidian', 'data.json');
    
    // 确保目录存在
    const configDir = dirname(configPath);
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    writeFileSync(configPath, JSON.stringify(templaterConfig, null, 2));
    console.log('✅ Templater 配置已创建');
  }

  /**
   * 创建 Image Uploader 配置
   */
  private createImageUploaderConfig(): void {
    const imageUploaderConfig = {
      "uploader": "r2",
      "r2": {
        "endpoint": process.env.R2_ENDPOINT || "https://your-account-id.r2.cloudflarestorage.com",
        "bucket": process.env.R2_BUCKET_NAME || "your-bucket-name",
        "accessKeyId": process.env.R2_USER_ACCESS_KEY_ID || "your-access-key",
        "secretAccessKey": process.env.R2_USER_SECRET_ACCESS_KEY || "your-secret-key",
        "region": "auto",
        "path": "images/blog/",
        "customDomain": "https://cdn.daysfromtoday.ai"
      },
      "uploadedImagesPath": "images/blog/",
      "uploadedImagesUrl": "https://cdn.daysfromtoday.ai/images/blog/",
      "autoRename": true,
      "autoRenamePattern": "{{title}}-{{date}}",
      "dateFormat": "YYYY-MM-DD",
      "timeFormat": "HH-mm-ss"
    };

    const configPath = join(OBSIDIAN_DIR, '.obsidian', 'plugins', 'obsidian-image-uploader', 'data.json');
    
    // 确保目录存在
    const configDir = dirname(configPath);
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    writeFileSync(configPath, JSON.stringify(imageUploaderConfig, null, 2));
    console.log('✅ Image Uploader 配置已创建');
  }

  /**
   * 创建自定义 CSS 样式
   */
  private createCustomCSS(): void {
    const customCSS = `
/* DaysFromToday 博客样式优化 */

/* MDX 文件样式优化 */
.markdown-preview-view .markdown-preview-sizer {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 代码块样式 */
.markdown-preview-view pre {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

/* 引用块样式 */
.markdown-preview-view blockquote {
  border-left: 4px solid #007acc;
  background-color: #f8f9fa;
  padding: 16px;
  margin: 16px 0;
  border-radius: 0 6px 6px 0;
}

/* 表格样式 */
.markdown-preview-view table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-preview-view th,
.markdown-preview-view td {
  border: 1px solid #e9ecef;
  padding: 12px;
  text-align: left;
}

.markdown-preview-view th {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* 链接样式 */
.markdown-preview-view a {
  color: #007acc;
  text-decoration: none;
}

.markdown-preview-view a:hover {
  text-decoration: underline;
}

/* 图片样式 */
.markdown-preview-view img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
.markdown-preview-view h1 {
  color: #2c3e50;
  border-bottom: 2px solid #007acc;
  padding-bottom: 8px;
}

.markdown-preview-view h2 {
  color: #34495e;
  border-bottom: 1px solid #bdc3c7;
  padding-bottom: 4px;
}

/* 列表样式 */
.markdown-preview-view ul,
.markdown-preview-view ol {
  padding-left: 24px;
}

.markdown-preview-view li {
  margin: 8px 0;
}

/* 任务列表样式 */
.markdown-preview-view input[type="checkbox"] {
  margin-right: 8px;
}

/* 分隔线样式 */
.markdown-preview-view hr {
  border: none;
  height: 2px;
  background: linear-gradient(to right, #007acc, #00d4aa);
  margin: 32px 0;
}

/* 代码内联样式 */
.markdown-preview-view code {
  background-color: #f1f3f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-preview-view .markdown-preview-sizer {
    padding: 16px;
  }
  
  .markdown-preview-view table {
    font-size: 0.9em;
  }
  
  .markdown-preview-view th,
  .markdown-preview-view td {
    padding: 8px;
  }
}
`;

    const cssPath = join(OBSIDIAN_DIR, '.obsidian', 'snippets', 'blog-styles.css');
    
    // 确保目录存在
    const cssDir = dirname(cssPath);
    if (!existsSync(cssDir)) {
      mkdirSync(cssDir, { recursive: true });
    }

    writeFileSync(cssPath, customCSS);
    console.log('✅ 自定义 CSS 样式已创建');
  }

  /**
   * 创建快捷键配置
   */
  private createHotkeyConfig(): void {
    const hotkeyConfig = {
      "hotkeys": {
        "templater-obsidian:create-new-note-from-template": [
          {
            "modifiers": ["Ctrl", "Shift"],
            "key": "T"
          }
        ],
        "obsidian-image-uploader:upload-image": [
          {
            "modifiers": ["Ctrl", "Shift"],
            "key": "I"
          }
        ],
        "obsidian-image-uploader:upload-image-from-clipboard": [
          {
            "modifiers": ["Ctrl", "Shift"],
            "key": "V"
          }
        ]
      }
    };

    const configPath = join(OBSIDIAN_DIR, '.obsidian', 'hotkeys.json');
    writeFileSync(configPath, JSON.stringify(hotkeyConfig, null, 2));
    console.log('✅ 快捷键配置已创建');
  }

  /**
   * 创建工作流说明文档
   */
  private createWorkflowGuide(): void {
    const workflowGuide = `# Obsidian 博客工作流指南

## 🚀 快速开始

### 1. 创建新博客文章
- 快捷键：\`Ctrl+Shift+T\`
- 选择模板：\`blog-template-optimized.md\`
- 自动填充：标题、日期、作者等信息

### 2. 插入图片
- 拖拽图片到编辑区域
- 或使用快捷键：\`Ctrl+Shift+I\`
- 自动上传到 R2 CDN

### 3. 同步到网站
- 文件保存后自动同步
- 或手动运行：\`npm run sync:content\`

## 📝 写作流程

### 步骤 1：创建文章
1. 在 Obsidian 中按 \`Ctrl+Shift+T\`
2. 选择博客模板
3. 填写文章标题
4. 模板自动填充基础信息

### 步骤 2：编写内容
1. 在 Obsidian 中编写 Markdown 内容
2. 使用拖拽插入图片
3. 图片自动上传到 CDN
4. 实时预览效果

### 步骤 3：发布上线
1. 保存文件
2. 自动同步到 content 目录
3. Contentlayer 重新生成
4. 网站自动更新

## 🔧 插件配置

### Templater 插件
- 模板目录：\`templates/\`
- 文件夹模板：自动应用模板
- 快捷键：\`Ctrl+Shift+T\`

### Image Uploader 插件
- 上传到：R2 CDN
- 路径：\`images/blog/\`
- 域名：\`https://cdn.daysfromtoday.ai\`

## 📁 文件结构

\`\`\`
obsidian/
├── content/
│   ├── blog/
│   │   ├── en/          # 英文博客
│   │   └── zh/          # 中文博客
│   └── ...
├── templates/
│   └── blog-template-optimized.md
└── .obsidian/
    ├── plugins/
    ├── snippets/
    └── hotkeys.json
\`\`\`

## 🎯 最佳实践

### 1. 文件命名
- 使用小写字母和连字符
- 例如：\`time-management-tips.mdx\`

### 2. 图片管理
- 图片自动上传到 CDN
- 使用描述性文件名
- 保持合理的文件大小

### 3. 内容结构
- 使用清晰的标题层级
- 添加适当的标签
- 包含摘要和结论

### 4. SEO 优化
- 填写准确的描述
- 使用相关标签
- 添加相关链接

## 🚨 注意事项

1. **文件格式**：使用 .mdx 格式以支持 React 组件
2. **图片上传**：确保网络连接正常
3. **同步状态**：定期检查同步状态
4. **备份**：重要内容及时备份

## 🔍 故障排除

### 图片上传失败
- 检查网络连接
- 验证 R2 配置
- 查看控制台错误

### 同步失败
- 检查文件权限
- 验证路径配置
- 重启同步服务

### 模板不生效
- 检查 Templater 配置
- 验证模板路径
- 重启 Obsidian

---

*最后更新：${new Date().toISOString().split('T')[0]}*
`;

    const guidePath = join(OBSIDIAN_DIR, 'OBSIDIAN_WORKFLOW_GUIDE.md');
    writeFileSync(guidePath, workflowGuide);
    console.log('✅ 工作流指南已创建');
  }

  /**
   * 执行完整配置
   */
  public setup(): void {
    console.log('🚀 开始配置 Obsidian 插件...');
    
    this.createTemplaterConfig();
    this.createImageUploaderConfig();
    this.createCustomCSS();
    this.createHotkeyConfig();
    this.createWorkflowGuide();
    
    console.log('✅ Obsidian 插件配置完成');
    console.log('📖 请查看 obsidian/OBSIDIAN_WORKFLOW_GUIDE.md 了解详细使用方法');
  }
}

// 命令行接口
async function main() {
  const setup = new ObsidianPluginSetup();
  setup.setup();
}

if (require.main === module) {
  main().catch(console.error);
}

export { ObsidianPluginSetup };
