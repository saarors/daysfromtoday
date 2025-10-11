// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
function getCategoryName(slug, lang) {
  const categoryNames = {
    "time-value": { zh: "\u65F6\u95F4\u4EF7\u503C", en: "Time Value" },
    "growth": { zh: "\u6210\u957F\u601D\u8003", en: "Growth" },
    "mindset": { zh: "\u5FC3\u6001\u7BA1\u7406", en: "Mindset" },
    "psychology": { zh: "\u5FC3\u7406\u5B66", en: "Psychology" },
    "date-calculation": { zh: "\u65E5\u671F\u8BA1\u7B97", en: "Date Calculation" },
    "timezone": { zh: "\u65F6\u533A\u6362\u7B97", en: "Timezone" },
    "holidays": { zh: "\u8282\u5047\u65E5", en: "Holidays" },
    "planning": { zh: "\u65F6\u95F4\u89C4\u5212", en: "Planning" },
    "user-stories": { zh: "\u7528\u6237\u6545\u4E8B", en: "User Stories" },
    "founder": { zh: "\u521B\u59CB\u4EBA\u6545\u4E8B", en: "Founder" },
    "community": { zh: "\u793E\u533A\u6545\u4E8B", en: "Community" },
    "journey": { zh: "\u6210\u957F\u65C5\u7A0B", en: "Journey" },
    "getting-started": { zh: "\u5FEB\u901F\u4E0A\u624B", en: "Getting Started" },
    "features": { zh: "\u529F\u80FD\u8BE6\u89E3", en: "Features" },
    "best-practices": { zh: "\u6700\u4F73\u5B9E\u8DF5", en: "Best Practices" },
    "troubleshooting": { zh: "\u95EE\u9898\u6392\u67E5", en: "Troubleshooting" },
    "releases": { zh: "\u7248\u672C\u53D1\u5E03", en: "Releases" },
    "roadmap": { zh: "\u4EA7\u54C1\u8DEF\u7EBF\u56FE", en: "Roadmap" },
    "changelog": { zh: "\u66F4\u65B0\u65E5\u5FD7", en: "Changelog" },
    "milestones": { zh: "\u91CC\u7A0B\u7891", en: "Milestones" }
  };
  return categoryNames[slug]?.[lang] || slug;
}
function generateBreadcrumbs(doc, type) {
  const parts = doc._raw.flattenedPath.split("/");
  const lang = parts[1];
  const category = parts.length > 3 ? parts[2] : null;
  const typeNames = {
    philosophy: { zh: "\u65F6\u95F4\u54F2\u5B66", en: "Philosophy" },
    tools: { zh: "\u5B9E\u7528\u5DE5\u5177", en: "Tools" },
    stories: { zh: "\u6545\u4E8B\u4E0E\u4EBA", en: "Stories" },
    guides: { zh: "\u6559\u7A0B\u6307\u5357", en: "Guides" },
    updates: { zh: "\u65B0\u95FB\u66F4\u65B0", en: "Updates" }
  };
  const breadcrumbs = [
    { label: lang === "zh" ? "\u9996\u9875" : "Home", url: `/${lang}` },
    { label: typeNames[type][lang], url: `/${lang}/${type}` }
  ];
  if (category && parts.length > 3) {
    breadcrumbs.push({
      label: getCategoryName(category, lang),
      url: `/${lang}/${type}/${category}`
    });
  }
  breadcrumbs.push({
    label: doc.title,
    url: `/${lang}/${type}/${parts.slice(2).join("/")}`
  });
  return breadcrumbs;
}
var sharedFields = {
  title: {
    type: "string",
    required: true
  },
  description: {
    type: "string",
    required: true
  },
  date: {
    type: "date",
    required: true
  },
  lastModified: {
    type: "date"
  },
  author: {
    type: "string",
    default: "Leon"
  },
  published: {
    type: "boolean",
    default: true
  },
  featured: {
    type: "boolean",
    default: false
  },
  topics: {
    type: "list",
    of: { type: "string" }
  },
  keywords: {
    type: "list",
    of: { type: "string" }
  },
  ogImage: {
    type: "string"
  },
  readingTime: {
    type: "number"
  }
};
var Philosophy = defineDocumentType(() => ({
  name: "Philosophy",
  filePathPattern: "philosophy/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...sharedFields,
    category: {
      type: "string",
      required: true
    },
    level: {
      type: "enum",
      options: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const lang = parts[1];
        const rest = parts.slice(2).join("/");
        return `/${lang}/philosophy/${rest}`;
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop() || ""
    },
    locale: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1]
    },
    breadcrumbs: {
      type: "json",
      resolve: (doc) => generateBreadcrumbs(doc, "philosophy")
    }
  }
}));
var Tools = defineDocumentType(() => ({
  name: "Tools",
  filePathPattern: "tools/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...sharedFields,
    category: {
      type: "string",
      required: true
    },
    embeds: {
      type: "json"
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const lang = parts[1];
        const rest = parts.slice(2).join("/");
        return `/${lang}/tools/${rest}`;
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop() || ""
    },
    locale: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1]
    },
    breadcrumbs: {
      type: "json",
      resolve: (doc) => generateBreadcrumbs(doc, "tools")
    }
  }
}));
var Stories = defineDocumentType(() => ({
  name: "Stories",
  filePathPattern: "stories/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...sharedFields,
    category: {
      type: "string",
      required: true
    },
    storyType: {
      type: "enum",
      options: ["user", "founder", "community"]
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const lang = parts[1];
        const rest = parts.slice(2).join("/");
        return `/${lang}/stories/${rest}`;
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop() || ""
    },
    locale: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1]
    },
    breadcrumbs: {
      type: "json",
      resolve: (doc) => generateBreadcrumbs(doc, "stories")
    }
  }
}));
var Guides = defineDocumentType(() => ({
  name: "Guides",
  filePathPattern: "guides/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...sharedFields,
    category: {
      type: "string",
      required: true
    },
    embeds: {
      type: "json"
    },
    prerequisites: {
      type: "list",
      of: { type: "string" }
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const lang = parts[1];
        const rest = parts.slice(2).join("/");
        return `/${lang}/guides/${rest}`;
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop() || ""
    },
    locale: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1]
    },
    breadcrumbs: {
      type: "json",
      resolve: (doc) => generateBreadcrumbs(doc, "guides")
    }
  }
}));
var Updates = defineDocumentType(() => ({
  name: "Updates",
  filePathPattern: "updates/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...sharedFields,
    category: {
      type: "string",
      required: true
    },
    version: {
      type: "string"
    },
    releaseDate: {
      type: "date"
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const lang = parts[1];
        const rest = parts.slice(2).join("/");
        return `/${lang}/updates/${rest}`;
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop() || ""
    },
    locale: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1]
    },
    breadcrumbs: {
      type: "json",
      resolve: (doc) => generateBreadcrumbs(doc, "updates")
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
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
  }
});
export {
  Guides,
  Philosophy,
  Stories,
  Tools,
  Updates,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-NEN7V6J6.mjs.map
