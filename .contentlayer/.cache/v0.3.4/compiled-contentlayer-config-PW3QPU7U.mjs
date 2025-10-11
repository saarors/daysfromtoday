// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";
var Blog = defineDocumentType(() => ({
  name: "Blog",
  contentType: "mdx",
  filePathPattern: `blog/**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    author: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    featured: { type: "boolean", default: false },
    image: { type: "string" },
    readingTime: { type: "string" },
    locale: { type: "string", required: true }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/blog/${doc._raw.flattenedPath.split("/").pop()}`
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop()
    }
  }
}));
var Philosophy = defineDocumentType(() => ({
  name: "Philosophy",
  contentType: "mdx",
  filePathPattern: `philosophy/**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    author: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    featured: { type: "boolean", default: false },
    image: { type: "string" },
    readingTime: { type: "string" },
    locale: { type: "string", required: true }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/philosophy/${doc._raw.flattenedPath.split("/").pop()}`
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop()
    }
  }
}));
var Tools = defineDocumentType(() => ({
  name: "Tools",
  contentType: "mdx",
  filePathPattern: `tools/**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    author: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    featured: { type: "boolean", default: false },
    image: { type: "string" },
    readingTime: { type: "string" },
    locale: { type: "string", required: true }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/tools/${doc._raw.flattenedPath.split("/").pop()}`
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop()
    }
  }
}));
var Stories = defineDocumentType(() => ({
  name: "Stories",
  contentType: "mdx",
  filePathPattern: `stories/**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    author: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    featured: { type: "boolean", default: false },
    image: { type: "string" },
    readingTime: { type: "string" },
    locale: { type: "string", required: true }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/stories/${doc._raw.flattenedPath.split("/").pop()}`
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop()
    }
  }
}));
var Guides = defineDocumentType(() => ({
  name: "Guides",
  contentType: "mdx",
  filePathPattern: `guides/**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    author: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    featured: { type: "boolean", default: false },
    image: { type: "string" },
    readingTime: { type: "string" },
    locale: { type: "string", required: true }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/guides/${doc._raw.flattenedPath.split("/").pop()}`
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop()
    }
  }
}));
var Updates = defineDocumentType(() => ({
  name: "Updates",
  contentType: "mdx",
  filePathPattern: `updates/**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    author: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    featured: { type: "boolean", default: false },
    image: { type: "string" },
    readingTime: { type: "string" },
    locale: { type: "string", required: true }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.locale}/updates/${doc._raw.flattenedPath.split("/").pop()}`
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop()
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Blog, Philosophy, Tools, Stories, Guides, Updates],
  mdx: {
    remarkPlugins: [
      remarkGfm
      // GitHub Flavored Markdown
    ],
    rehypePlugins: [
      rehypeSlug,
      // 为标题添加 ID
      rehypeAutolinkHeadings,
      // 为标题添加链接
      rehypeCodeTitles,
      // 代码块标题
      rehypePrism
      // 语法高亮
    ]
  }
});
export {
  Blog,
  Guides,
  Philosophy,
  Stories,
  Tools,
  Updates,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-PW3QPU7U.mjs.map
