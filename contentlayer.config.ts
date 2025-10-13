import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'

/**
 * Contentlayer 配置文件
 * 
 * 支持的内容类型：
 * 1. Blog - 博客文章
 * 2. Philosophy - 哲学思考
 * 3. Tools - 工具介绍
 * 4. Stories - 用户故事
 * 5. Guides - 使用指南
 * 6. Updates - 产品更新
 * 
 * 符合项目规范：
 * - 支持多语言内容（en/zh）
 * - 完整的 SEO 元数据
 * - MDX 插件支持
 * - 类型安全的内容访问
 */

// 博客文章类型
export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  contentType: 'mdx',
  filePathPattern: `blog/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    featured: { type: 'boolean', default: false },
    image: { type: 'string' },
    readingTime: { type: 'string' },
    locale: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc.locale}/blog/${doc._raw.flattenedPath.split('/').pop()}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '',
    },
  },
}))

// 哲学思考类型
export const Philosophy = defineDocumentType(() => ({
  name: 'Philosophy',
  contentType: 'mdx',
  filePathPattern: `philosophy/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    featured: { type: 'boolean', default: false },
    image: { type: 'string' },
    readingTime: { type: 'string' },
    locale: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc.locale}/philosophy/${doc._raw.flattenedPath.split('/').pop()}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '',
    },
  },
}))

// 工具介绍类型
export const Tools = defineDocumentType(() => ({
  name: 'Tools',
  contentType: 'mdx',
  filePathPattern: `tools/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    featured: { type: 'boolean', default: false },
    image: { type: 'string' },
    readingTime: { type: 'string' },
    locale: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc.locale}/tools/${doc._raw.flattenedPath.split('/').pop()}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '',
    },
  },
}))

// 用户故事类型
export const Stories = defineDocumentType(() => ({
  name: 'Stories',
  contentType: 'mdx',
  filePathPattern: `stories/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    featured: { type: 'boolean', default: false },
    image: { type: 'string' },
    readingTime: { type: 'string' },
    locale: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc.locale}/stories/${doc._raw.flattenedPath.split('/').pop()}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '',
    },
  },
}))

// 使用指南类型
export const Guides = defineDocumentType(() => ({
  name: 'Guides',
  contentType: 'mdx',
  filePathPattern: `guides/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    featured: { type: 'boolean', default: false },
    image: { type: 'string' },
    readingTime: { type: 'string' },
    locale: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc.locale}/guides/${doc._raw.flattenedPath.split('/').pop()}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '',
    },
  },
}))

// 产品更新类型
export const Updates = defineDocumentType(() => ({
  name: 'Updates',
  contentType: 'mdx',
  filePathPattern: `updates/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    featured: { type: 'boolean', default: false },
    image: { type: 'string' },
    readingTime: { type: 'string' },
    locale: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc.locale}/updates/${doc._raw.flattenedPath.split('/').pop()}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop()?.replace(/\.mdx?$/, '') || '',
    },
  },
}))

export default makeSource({
  contentDirPath: 'obsidian/content',
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown
    ],
    rehypePlugins: [
      rehypeSlug, // 为标题添加 ID
      rehypeAutolinkHeadings, // 为标题添加链接
      rehypeCodeTitles, // 代码块标题
      rehypePrism, // 语法高亮
    ],
  },
})
