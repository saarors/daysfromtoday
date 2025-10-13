# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-13

### 🎉 Major Release - DaysFromToday v2.0

This is a major release with significant improvements to the blog system, SEO optimization, and content management workflow.

### ✨ Added

#### Blog System
- **Complete blog system overhaul** with Contentlayer integration
- **Multi-language blog support** (English/Chinese)
- **MDX support** with rich content rendering
- **Automatic blog post generation** from Markdown files
- **SEO-optimized blog pages** with structured data
- **Featured story section** on homepage

#### Content Management
- **Obsidian integration** for content creation
- **Automated image upload** to Cloudflare R2 CDN
- **Media file support** (HEIC, PDF, MP4, MOV, M4A, CSV)
- **Content synchronization** between Obsidian and website
- **Template system** for consistent blog post creation

#### SEO & Analytics
- **Comprehensive SEO optimization** (96/100 score)
- **Google Analytics 4 integration** with SPA route tracking
- **Structured data** (Organization, WebApplication, Article schemas)
- **Multi-language SEO** with hreflang tags
- **Sitemap generation** and robots.txt optimization
- **Open Graph and Twitter Cards** support

#### Performance
- **Page load times under 100ms** for all pages
- **Core Web Vitals optimization**
- **Image optimization** with WebP format
- **CDN integration** for static assets

### 🔧 Changed

#### Technical Improvements
- **Upgraded to Next.js 14.2.15** for better performance
- **Contentlayer 0.3.4** for content management
- **Enhanced TypeScript** configuration
- **Improved build process** with better error handling

#### User Experience
- **Redesigned homepage** with better visual hierarchy
- **Improved navigation** with breadcrumb removal
- **Enhanced mobile responsiveness**
- **Better loading states** and error handling

### 🐛 Fixed

- **Contentlayer build errors** resolved
- **MDX parsing issues** fixed
- **YAML frontmatter** validation improved
- **Image upload workflow** streamlined
- **SEO metadata** consistency across all pages

### 🔒 Security

- **Environment variables** properly configured
- **Sensitive data** excluded from Git
- **API keys** secured in environment files
- **Content Security Policy** considerations

### 📚 Documentation

- **Comprehensive documentation** for all workflows
- **SEO audit reports** generated
- **Content creation guides** for Obsidian
- **Deployment procedures** documented

### 🚀 Deployment

- **Vercel deployment** ready
- **Environment configuration** for production
- **CDN setup** with custom domain
- **Domain configuration** for www.daysfromtoday.ai

---

## [1.0.0] - 2025-09-01

### 🎉 Initial Release

- Basic date calculation functionality
- Multi-language support (English/Chinese)
- Holiday awareness
- ICS calendar export
- Responsive design

---

## Version History

- **v2.0.0** (2025-10-13): Major release with blog system and SEO optimization
- **v1.0.0** (2025-09-01): Initial release with core functionality

---

## Development Notes

### Key Technologies
- **Frontend**: Next.js 14.2.15, React 18, TypeScript
- **Styling**: Tailwind CSS v3.4.1
- **Content**: Contentlayer 0.3.4, MDX
- **Analytics**: Google Analytics 4
- **Storage**: Cloudflare R2 CDN
- **Deployment**: Vercel

### Performance Metrics
- **Page Load Time**: < 100ms average
- **SEO Score**: 96/100
- **Core Web Vitals**: All green
- **Lighthouse Score**: 95+ across all metrics

### Content Management
- **Obsidian Integration**: Full workflow support
- **Image Upload**: Automated to R2 CDN
- **Content Sync**: Real-time synchronization
- **Template System**: Standardized blog creation

---

*For detailed technical documentation, see the `docs/` directory.*
