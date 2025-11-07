# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DaysFromToday** is a multilingual date calculation tool that provides instant answers to "X days from today" queries. The product is designed for SEO-first, open-page-immediate-answer user experience with support for natural days, business days, holidays, and timezone awareness.

**Core Keywords**: days from today, weekdays from today, business days, date calculator
**Live Site**: https://www.daysfromtoday.ai
**Design Style**: Calendly-inspired glassmorphism with gradient accents

## Development Commands

### Essential Commands
```bash
# Development
npm run dev                    # Start dev server (default port 3000)
npm run dev:safe              # Start with increased file handles (port 3009)
npm run dev:clean             # Clean .next and start dev
npm run dev:reset             # Full reset: clean node_modules and reinstall

# Build & Deploy
npm run build                 # Build production (runs contentlayer build first)
npm run start                 # Start production server
npm run lint                  # Run ESLint

# Utility Scripts
npm run health                # Check ports and file handles
npm run diagnose              # Diagnose common issues
npm run fix                   # Fix common development issues
npm run restart               # Restart dev server safely

# Holidays Management
npm run holidays:init         # Initialize holiday data for all countries
npm run holidays:update       # Update holiday data
npm run holidays:validate     # Validate holiday data integrity

# Content & Blog (Obsidian Workflow)
npm run sync:obsidian         # Sync content from Obsidian vault
npm run sync:obsidian:watch   # Watch mode for content sync
npm run blog:workflow         # Run blog publishing workflow
npm run blog:check            # Check blog post status
npm run blog:delete           # Delete a blog post

# Image Management (Cloudflare R2)
npm run images:upload         # Upload images to R2
npm run images:organize       # Organize images by category
npm run images:cleanup        # Clean unused images

# SEO & Analytics
npm run seo:validate          # Validate SEO configuration
npm run ga:verify             # Verify Google Analytics setup
npm run seo-ga:check          # Comprehensive SEO/GA check

# Testing
npm run test:supabase         # Test Supabase connection
npm run verify:supabase       # Verify Supabase setup
```

### Test Single Components
```bash
# The project uses Vitest for testing
npx vitest run <test-file-path>
npx vitest watch              # Run tests in watch mode
```

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 15 (App Router, TypeScript, Edge Runtime)
- **Styling**: Tailwind CSS v4 with custom design system
- **Date Library**: date-fns + date-fns-tz (IANA timezone, DST-safe)
- **i18n**: next-intl v4 (route-level internationalization)
- **Content**: Contentlayer 0.3.4 (MDX blog system)
- **Deployment**: Vercel Edge Functions
- **Storage**: Cloudflare R2 for images
- **Analytics**: Google Analytics 4 + Search Console
- **Database**: Supabase (Auth + PostgreSQL)

### Project Structure
```
app/
├── [locale]/                 # i18n routes (en/zh)
│   ├── page.tsx             # Homepage (Server Component)
│   ├── home-client.tsx      # Homepage (Client Component)
│   ├── days/[n]/            # Natural days calculation
│   ├── business-days/[n]/   # Business days calculation
│   ├── anniversaries/       # Anniversary manager
│   ├── blog/[slug]/         # Blog posts
│   ├── holidays/            # Holidays viewer
│   └── my-cards/            # User goal cards (AI-powered)
├── api/
│   ├── holidays/            # Holiday data API
│   ├── bizdays/             # Business days calculation
│   ├── ai/chat/stream/      # AI chat streaming endpoint
│   └── upload-image/        # Image upload to R2
└── (sitemaps)/              # SEO sitemaps

lib/
├── bizdays.ts               # Business days calculation logic
├── date-calculator.ts       # Core date calculation module
├── date-utils.ts            # Date utility functions
├── holidays.ts              # Holiday fetching and caching
├── weekend-rules.ts         # Weekend detection by country
├── working-days.ts          # Working days calculation
├── ics-generator.ts         # Calendar file (.ics) generation
├── blog-utils.ts            # Blog system utilities
├── supabase/                # Supabase client configuration
└── ai-assistants.ts         # AI prompt matching system

components/
├── DateCalculator.tsx       # Date calculation component
├── CountrySelector.tsx      # Country/timezone selector
├── AnniversaryManager.tsx   # Anniversary CRUD component
├── TopNav.tsx               # Navigation bar
├── mdx/                     # MDX components for blog
└── v3/                      # V3.0 feature components (AI goals)

types/
├── blog.ts                  # Blog post types
├── user-context.ts          # User context (country, timezone)
├── card-template.ts         # Goal card template types
└── ai-assistant.ts          # AI assistant types

obsidian/content/            # Blog content source (synced from Obsidian)
data/holidays/               # Holiday data (JSON + MD documentation)
messages/                    # i18n translation files (en.json, zh.json)
scripts/                     # Automation scripts
docs/                        # Comprehensive project documentation
```

### Key Architectural Patterns

**Date Calculation Flow**:
1. User input → `lib/date-calculator.ts` determines calculation type
2. Natural days: direct `date-fns` calculation
3. Business days: `lib/bizdays.ts` → fetches holidays via `lib/holidays.ts`
4. Timezone handling: `date-fns-tz` with IANA timezone database
5. Weekend detection: `lib/weekend-rules.ts` (country-specific rules)

**i18n Architecture**:
- Route-level language detection (`/en/`, `/zh/`)
- `next-intl` handles routing and message loading
- Server-side locale detection via middleware
- Translation files in `messages/*.json`
- SEO: proper hreflang tags and canonical URLs

**Content Management**:
- Write in Obsidian vault → sync via `npm run sync:obsidian`
- Contentlayer processes `.md` files into type-safe data
- MDX components in `components/mdx/` for rich content
- Images uploaded to Cloudflare R2 automatically

**AI Goal System (V3.0)**:
- Natural language input → `lib/ai-prompt-matcher.ts` analyzes intent
- Matches difficulty level, persona type, goal category
- Generates personalized methodology and task breakdown
- Streams response via API route `/api/ai/chat/stream`
- Stores goal cards in Supabase with auto-sync

## Critical Development Notes

### Date Calculation Edge Cases
- **DST Transitions**: Always use `date-fns-tz` for timezone-aware calculations
- **Weekend Rules**: Different countries have different weekends (Fri-Sat, Sat-Sun)
- **Holiday Caching**: Nager.Date API responses cached 24h to avoid rate limits
- **Business Days**: Must account for both weekends AND holidays

### i18n Best Practices
- All user-facing strings must be in `messages/*.json`
- Use `useTranslations()` hook in Client Components
- Use `getTranslations()` in Server Components
- Dynamic metadata must use `generateMetadata()` with locale

### SEO Requirements
- Every page must have unique `title` and `description`
- Use `alternates.canonical` for canonical URLs
- Include `alternates.languages` for hreflang tags
- Add JSON-LD structured data where applicable
- Keep LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1

### Contentlayer Notes
- Source directory: `obsidian/content/blog/`
- Auto-builds on `npm run build` via `postinstall` hook
- Type-safe imports from `contentlayer/generated`
- Supports remark-gfm, rehype-prism for syntax highlighting
- Tables in Markdown may have parsing issues - use lists or custom components

### AI System (V3.0)
- Streaming responses use Server-Sent Events (SSE)
- Rate limiting via Upstash Redis
- Prompt system in `lib/v3.1/prompt-composer.ts`
- Store conversations and task history in Supabase
- Auto-sync between local state and database

### Testing Strategy
- Test DST edge cases (spring forward, fall back)
- Test weekend differences (US vs. Middle East)
- Test holiday detection for multiple countries
- Test i18n route switching and message loading
- Test business days calculation with holiday data

### Environment Variables (Required)
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.daysfromtoday.ai

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
NEXT_PUBLIC_R2_PUBLIC_URL=

# AI Features
NEXT_PUBLIC_ANTHROPIC_API_KEY=  # For Claude AI streaming

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Code Standards

### TypeScript Rules
- Strict mode enabled
- No `any` types - use `unknown` or proper types
- All functions must have explicit return types
- Use `interface` for object shapes, `type` for unions/intersections

### Naming Conventions
- Files: kebab-case (`date-calculator.tsx`)
- Functions: camelCase (`getHolidays()`)
- Components: PascalCase (`DateCalculator`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_LOCALE`)

### Commit Message Format
```
feat: Add new feature
fix: Fix bug
chore: Update build configuration
docs: Update documentation
perf: Performance improvement
style: Code style changes
refactor: Code refactoring
test: Add or update tests
```

### AI Coding Guidelines (from .cursor/rules)
1. **Before Changes**: Output change list, risk analysis (SEO/performance/security)
2. **After Changes**: Show diff preview, testing steps, Definition of Done
3. **Dependencies**: Explain purpose, size, alternatives, security before adding
4. **No Modifications**: Don't touch DNS/Cloudflare config, never output API keys

### Design System
- Primary color: `#0069FF` (blue)
- Gradient: `#D946EF` (pink) → `#8B5CF6` (purple) → `#0069FF` (blue)
- Glass effect: `backdrop-blur-lg bg-white/10`
- Spacing: Tailwind's default scale
- Typography: `next/font` optimized fonts

## Important Gotchas

1. **Contentlayer Build**: Always runs on `npm install` via `postinstall`. If blog content changes, re-run `npm run build`.

2. **Holiday Data**: Generated via `npm run holidays:init`. Must be regenerated annually. Files in `data/holidays/*.json`.

3. **R2 Image URLs**: Public images use `cdn.daysfromtoday.ai`. Ensure CORS configured for cross-origin access.

4. **Next.js Config**: `next-intl` plugin wraps config. Order matters: Contentlayer first, then next-intl.

5. **Edge Runtime**: Some Node.js APIs unavailable. Use Edge-compatible alternatives (e.g., Web Crypto API instead of `crypto`).

6. **Supabase Auth**: Cookie-based auth using `@supabase/ssr`. Server Components use `createClient()` from `lib/supabase/server.ts`.

7. **Streaming AI**: Response chunks must be properly encoded. See `app/api/ai/chat/stream/route.ts` for SSE format.

8. **Timezone Detection**: Use Vercel headers `x-vercel-ip-timezone` for automatic detection, fallback to browser API.

## Documentation

Key documentation files:
- `docs/getting-started/TECH_STACK_QUICK_REFERENCE.md` - Quick tech stack overview
- `docs/getting-started/OBSIDIAN_BLOG_WORKFLOW.md` - Blog content creation workflow
- `docs/ai/tech-architecture.md` - Technical architecture details
- `docs/ai/product-context.md` - Product requirements and goals
- `docs/ai/coding-standards.md` - Detailed coding standards
- `docs/seo-optimization/SEO_CHECKLIST.md` - SEO implementation checklist
- `docs/content-creation/BLOG_SYSTEM.md` - Blog system guide

## Common Workflows

### Adding a New Language
1. Add locale to `i18n/config.ts`: `locales` array
2. Create `messages/{locale}.json` with translations
3. Update `middleware.ts` to handle new locale
4. Add hreflang tags in page metadata

### Adding a New Page
1. Create route in `app/[locale]/your-page/page.tsx`
2. Implement `generateMetadata()` for SEO
3. Add translations to `messages/*.json`
4. Update sitemap in `app/(sitemaps)/sitemap-pages.xml/route.ts`

### Debugging Date Calculations
1. Check timezone: Use `Intl.DateTimeFormat().resolvedOptions().timeZone`
2. Verify holiday data: `npm run holidays:validate`
3. Test DST: Use dates around March/November
4. Check weekend rules: See `lib/weekend-rules.ts` for country-specific logic

### Publishing a Blog Post
1. Write in Obsidian vault (see workflow docs)
2. Run `npm run sync:obsidian` to sync content
3. Verify with `npm run blog:check`
4. Run `npm run build` to rebuild Contentlayer
5. Deploy to Vercel

---

**Version**: 3.0 (AI Intelligence Upgrade)
**Last Updated**: 2025-01-07
**Maintained By**: Leon
