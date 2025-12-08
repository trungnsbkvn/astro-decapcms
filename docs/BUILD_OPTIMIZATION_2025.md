# Build Optimization - December 2025

## Overview

This document describes the build optimizations implemented to reduce Netlify build times and costs.

## Changes Made

### 1. Hybrid Mode (Astro 5 Server Mode with Pre-rendering)

**File:** `astro.config.ts`

```typescript
output: 'server',
adapter: netlify(),
```

- Changed from `static` to `server` output mode
- Added Netlify adapter for serverless deployment
- All content pages use `export const prerender = true` for static generation
- URLs remain exactly the same - **SEO is preserved**

**How it works:**
- Pages with `prerender = true` → Built as static HTML at build time
- Pages without prerender → Rendered on-demand via Netlify Functions
- All existing blog/content pages are pre-rendered (static)

### 2. Reduced Image Breakpoints

**File:** `src/utils/images-optimization.ts`

**Before:** 15 device sizes (640px → 6016px)
```typescript
deviceSizes: [640, 750, 828, 960, 1080, 1280, 1668, 1920, 2048, 2560, 3200, 3840, 4480, 5120, 6016]
```

**After:** 6 device sizes
```typescript
deviceSizes: [640, 828, 1080, 1920, 2560, 3840]
```

**Impact:** ~60% fewer image variants generated during build

### 3. Faster JavaScript Minification

**File:** `astro.config.ts`

**Before:** Terser (slow but highly optimized)
```typescript
minify: 'terser',
terserOptions: { ... }
```

**After:** esbuild (10-100x faster)
```typescript
minify: 'esbuild',
```

**Impact:** Significantly faster JS minification with minimal size difference

### 4. Netlify Build Configuration

**File:** `netlify.toml`

```toml
[build.environment]
  NODE_VERSION = "20"
  SHARP_IGNORE_GLOBAL_LIBVIPS = "1"

[build.cache]
  packages = [".pnpm-store", "node_modules/.cache", "node_modules/.astro"]
```

**Changes:**
- Added Sharp caching environment variable
- Expanded cache directories for faster subsequent builds
- Removed build skip rule (not needed with hybrid mode)
- Optimized cache headers for dynamic content

## URL Structure (Preserved)

All URLs remain exactly the same:

| Content Type | URL Pattern |
|--------------|-------------|
| News | `/tin-tuc/[slug]` |
| Legal | `/phap-ly/[slug]` |
| Labor | `/lao-dong/[slug]` |
| Consultation | `/tu-van-thuong-xuyen/[slug]` |
| Evaluation | `/dich-vu-danh-gia/[slug]` |
| Foreign Investment | `/dau-tu-nuoc-ngoai/[slug]` |
| Tags | `/tag/[tag]` |
| Categories | `/[section]/[category]` |

## Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Image variants | ~37,860 | ~15,144 | 60% fewer |
| JS minification | Terser (slow) | esbuild (fast) | 10-100x faster |
| Build caching | Basic | Enhanced | 10-20% faster rebuilds |

## Architecture

```
┌─────────────────────────────────────────┐
│           Netlify Deployment            │
├─────────────────────────────────────────┤
│  Pre-rendered Pages (prerender=true)    │
│  → All blog posts, categories, tags     │
│  → Static HTML served from CDN          │
│  → Fast, cached at edge                 │
├─────────────────────────────────────────┤
│  Server-rendered Pages (if needed)      │
│  → Rendered via Netlify Functions       │
│  → On-demand generation                 │
│  → Useful for dynamic/personalized      │
└─────────────────────────────────────────┘
```

## Files Modified

1. `astro.config.ts` - Hybrid mode, esbuild, Netlify adapter
2. `src/utils/images-optimization.ts` - Reduced breakpoints
3. `netlify.toml` - Build caching, headers optimization
4. `src/pages/*.astro` - Added `prerender = true` to static pages

## Notes

- All existing functionality is preserved
- SEO is not affected (same URLs, same content)
- Sitemap generation works the same
- Decap CMS continues to work normally
