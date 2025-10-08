/**
 * 博客文章类型定义
 * 
 * 用于统一管理博客文章的数据结构
 */

export interface BlogPost {
  // 基础信息
  slug: string;
  title: {
    en: string;
    zh: string;
  };
  author: string;
  date: string; // ISO 8601 格式: YYYY-MM-DD
  
  // 内容
  excerpt: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  
  // 分类和标签
  category: {
    en: BlogCategory;
    zh: string;
  };
  keywords: string[];
  
  // 阅读信息
  readTime: {
    en: string;
    zh: string;
  };
  
  // 图片
  cover?: string; // 封面图路径
  ogImage?: string; // OG 分享图路径
  
  // 状态
  published: boolean;
  featured?: boolean; // 是否为精选文章
  
  // 语言
  lang: 'zh' | 'en' | 'zh-en';
}

export type BlogCategory = 'Story' | 'Guide' | 'News' | 'Update';

export interface BlogMetadata {
  // SEO 元数据
  metaTitle: {
    en: string;
    zh: string;
  };
  metaDescription: {
    en: string;
    zh: string;
  };
  canonicalUrl: string;
  
  // Open Graph
  ogTitle: {
    en: string;
    zh: string;
  };
  ogDescription: {
    en: string;
    zh: string;
  };
  ogImage: string;
  ogType: 'article';
  
  // Twitter Card
  twitterCard: 'summary_large_image';
  twitterTitle: {
    en: string;
    zh: string;
  };
  twitterDescription: {
    en: string;
    zh: string;
  };
  
  // 结构化数据
  jsonLd: BlogPostJsonLd;
}

export interface BlogPostJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  image?: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string[];
}

export interface BlogSection {
  heading?: string;
  content: string[];
}

export interface BlogContent {
  en: {
    title: string;
    date: string;
    readTime: string;
    sections: BlogSection[];
  };
  zh: {
    title: string;
    date: string;
    readTime: string;
    sections: BlogSection[];
  };
}

/**
 * 博客配置
 */
export interface BlogConfig {
  // 图片规范
  images: {
    cover: {
      width: number;
      height: number;
      maxSize: number; // KB
    };
    og: {
      width: number;
      height: number;
      maxSize: number; // KB
    };
    inline: {
      maxWidth: number;
      maxSize: number; // KB
    };
  };
  
  // SEO 规范
  seo: {
    titleLength: {
      min: number;
      max: number;
    };
    descriptionLength: {
      min: number;
      max: number;
    };
    keywordsCount: {
      min: number;
      max: number;
    };
  };
  
  // 内容规范
  content: {
    minWords: number;
    recommendedWords: number;
  };
}

export const DEFAULT_BLOG_CONFIG: BlogConfig = {
  images: {
    cover: {
      width: 1200,
      height: 675,
      maxSize: 200,
    },
    og: {
      width: 1200,
      height: 630,
      maxSize: 200,
    },
    inline: {
      maxWidth: 1200,
      maxSize: 150,
    },
  },
  seo: {
    titleLength: {
      min: 30,
      max: 60,
    },
    descriptionLength: {
      min: 120,
      max: 160,
    },
    keywordsCount: {
      min: 3,
      max: 8,
    },
  },
  content: {
    minWords: 800,
    recommendedWords: 1500,
  },
};

