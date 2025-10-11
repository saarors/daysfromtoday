import { defineDocumentType, makeSource } from 'contentlayer/source-files';
// TODO: 修复 rehype 插件类型错误
// import rehypeHighlight from 'rehype-highlight';
// import rehypeSlug from 'rehype-slug';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// import remarkGfm from 'remark-gfm';

// ============================================================
// 辅助函数
// ============================================================

function getCategoryName(slug: string, lang: string): string {
  const categoryNames: Record<string, Record<string, string>> = {
    'time-value': { zh: '时间价值', en: 'Time Value' },
    'growth': { zh: '成长思考', en: 'Growth' },
    'mindset': { zh: '心态管理', en: 'Mindset' },
    'psychology': { zh: '心理学', en: 'Psychology' },
    'date-calculation': { zh: '日期计算', en: 'Date Calculation' },
    'timezone': { zh: '时区换算', en: 'Timezone' },
    'holidays': { zh: '节假日', en: 'Holidays' },
    'planning': { zh: '时间规划', en: 'Planning' },
    'user-stories': { zh: '用户故事', en: 'User Stories' },
    'founder': { zh: '创始人故事', en: 'Founder' },
    'community': { zh: '社区故事', en: 'Community' },
    'journey': { zh: '成长旅程', en: 'Journey' },
    'getting-started': { zh: '快速上手', en: 'Getting Started' },
    'features': { zh: '功能详解', en: 'Features' },
    'best-practices': { zh: '最佳实践', en: 'Best Practices' },
    'troubleshooting': { zh: '问题排查', en: 'Troubleshooting' },
    'releases': { zh: '版本发布', en: 'Releases' },
    'roadmap': { zh: '产品路线图', en: 'Roadmap' },
    'changelog': { zh: '更新日志', en: 'Changelog' },
    'milestones': { zh: '里程碑', en: 'Milestones' },
  };
  
  return categoryNames[slug]?.[lang] || slug;
}

function generateBreadcrumbs(doc: any, type: string) {
  const parts = doc._raw.flattenedPath.split('/');
  const lang = parts[1];
  const category = parts.length > 3 ? parts[2] : null;
  
  const typeNames: Record<string, Record<string, string>> = {
    philosophy: { zh: '时间哲学', en: 'Philosophy' },
    tools: { zh: '实用工具', en: 'Tools' },
    stories: { zh: '故事与人', en: 'Stories' },
    guides: { zh: '教程指南', en: 'Guides' },
    updates: { zh: '新闻更新', en: 'Updates' },
  };
  
  const breadcrumbs = [
    { label: lang === 'zh' ? '首页' : 'Home', url: `/${lang}` },
    { label: typeNames[type][lang], url: `/${lang}/${type}` },
  ];
  
  if (category && parts.length > 3) {
    breadcrumbs.push({
      label: getCategoryName(category, lang),
      url: `/${lang}/${type}/${category}`,
    });
  }
  
  breadcrumbs.push({
    label: doc.title,
    url: `/${lang}/${type}/${parts.slice(2).join('/')}`,
  });
  
  return breadcrumbs;
}

// ============================================================
// 共享字段
// ============================================================

const sharedFields = {
  title: {
    type: 'string',
    required: true,
  },
  description: {
    type: 'string',
    required: true,
  },
  date: {
    type: 'date',
    required: true,
  },
  lastModified: {
    type: 'date',
  },
  author: {
    type: 'string',
    default: 'Leon',
  },
  published: {
    type: 'boolean',
    default: true,
  },
  featured: {
    type: 'boolean',
    default: false,
  },
  topics: {
    type: 'list',
    of: { type: 'string' },
  },
  keywords: {
    type: 'list',
    of: { type: 'string' },
  },
  ogImage: {
    type: 'string',
  },
  readingTime: {
    type: 'number',
  },
} as const;

// ============================================================
// Philosophy（时间哲学）
// ============================================================

export const Philosophy = defineDocumentType(() => ({
  name: 'Philosophy',
  filePathPattern: 'philosophy/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
    },
    level: {
      type: 'enum',
      options: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/philosophy/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop() || '',
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'philosophy'),
    },
  },
}));

// ============================================================
// Tools（实用工具）
// ============================================================

export const Tools = defineDocumentType(() => ({
  name: 'Tools',
  filePathPattern: 'tools/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
    },
    embeds: {
      type: 'json',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/tools/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop() || '',
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'tools'),
    },
  },
}));

// ============================================================
// Stories（故事与人）
// ============================================================

export const Stories = defineDocumentType(() => ({
  name: 'Stories',
  filePathPattern: 'stories/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
    },
    storyType: {
      type: 'enum',
      options: ['user', 'founder', 'community'],
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/stories/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop() || '',
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'stories'),
    },
  },
}));

// ============================================================
// Guides（教程指南）
// ============================================================

export const Guides = defineDocumentType(() => ({
  name: 'Guides',
  filePathPattern: 'guides/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
    },
    embeds: {
      type: 'json',
    },
    prerequisites: {
      type: 'list',
      of: { type: 'string' },
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/guides/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop() || '',
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'guides'),
    },
  },
}));

// ============================================================
// Updates（新闻更新）
// ============================================================

export const Updates = defineDocumentType(() => ({
  name: 'Updates',
  filePathPattern: 'updates/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
    },
    version: {
      type: 'string',
    },
    releaseDate: {
      type: 'date',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/updates/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop() || '',
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'updates'),
    },
  },
}));

// ============================================================
// 导出配置
// ============================================================

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Philosophy, Tools, Stories, Guides, Updates],
  disableImportAliasWarning: true,
  mdx: {
    // TODO: 修复插件类型问题后重新启用
    // remarkPlugins: [remarkGfm],
    // rehypePlugins: [
    //   rehypeSlug,
    //   [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    //   rehypeHighlight,
    // ],
  },
});

