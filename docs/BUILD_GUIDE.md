# Build & Performance Guide

> Consolidated documentation for build optimization, caching, and performance.

---

## Quick Reference

### Common Commands

```bash
# Development
bun dev                       # Start local dev server
bun run build                 # Smart build with caching
bun run build:full            # Full build with sprites (no caching)
bun run build:force           # Force full rebuild (ignore cache)
bun run preview               # Preview production build

# Manual Optimization (run locally, commit results)
bun run sprite:all            # Generate CSS sprites
bun run sprite:logos          # Generate logo sprites only
bun run sprite:testimonials   # Generate testimonial sprites only

# Maintenance Scripts
bun run find:unused-images    # Find unused images
bun run find:duplicate-images # Find duplicate images
bun run i18n:compare          # Compare translation keys
bun run i18n:sync             # Sync translation keys
```

---

## Build Strategy

### Smart Build (Default)

`bun run build` uses smart caching:
- ✅ Detects file changes via content hashing
- ✅ Skips build if no changes detected
- ✅ Reuses cached images when only content changes
- ✅ Uses pre-committed sprites and Partytown files

### Full Build (With Sprites)

For full builds including sprite regeneration:
```bash
bun run build:full
```

**Important:** After running sprite generation, **commit the sprite files**:
```bash
git add public/assets/sprites/*
git commit -m "Update sprites"
```

### Force Rebuild

To bypass cache and force a complete rebuild:
```bash
bun run build:force
```

### Pre-committed Assets

These files are committed to git (no regeneration needed):

| Directory | Purpose |
|-----------|---------|
| `public/assets/sprites/` | CSS sprites for logos/avatars |
| `public/~partytown/` | Partytown library files |

---

## Build Configuration

### Output Mode: Static

The site uses **static generation** for optimal performance:

```typescript
// astro.config.ts
output: 'static'  // Pre-rendered HTML, no server required
```

**Benefits:**
- Zero server-side processing
- Fast CDN delivery
- No serverless function costs

### Build Optimizations

```typescript
// astro.config.ts
build: {
  minify: 'esbuild',       // 10-100x faster than terser
  cssCodeSplit: true,      // Reduces critical CSS
  sourcemap: false,        // No source maps in production
  target: 'es2020',        // Modern browser support
}
```

### Image Breakpoints

Optimized from 15 to 6 breakpoints for faster builds:

```typescript
// src/utils/images-optimization.ts
deviceSizes: [640, 828, 1080, 1920, 2560, 3840]
```

**Impact:** ~60% fewer image variants generated

---

## Smart Build System

### How It Works

1. **Change Detection** - Only rebuilds when source files change
2. **Image Caching** - Reuses optimized images when only content changes
3. **Hash-based Tracking** - Tracks all source files to detect changes

### Build Scenarios

| Scenario | Build Time | What Happens |
|----------|-----------|--------------|
| No changes | 2-5 seconds | Build skipped |
| Content only | 30-40% faster | Reuses cached images |
| Component/Layout | Full time | Complete rebuild |
| Config change | Full time | Complete rebuild |

### Cache Locations

- **Local**: `.build-cache/` folder (~500MB-1GB)
- **Netlify**: Persisted via `netlify-plugin-cache`

### Force Full Rebuild

```bash
bun run build:smart --force
```

---

## Netlify Configuration

### netlify.toml Settings

```toml
[build]
  command = "bun run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  SHARP_IGNORE_GLOBAL_LIBVIPS = "1"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Cache Headers

| Path | Cache Duration | Notes |
|------|---------------|-------|
| `/_astro/*` | 1 year (immutable) | Hashed assets never change |
| `/images/*` | 7 days | Static images |
| Content pages | 1 hour (s-maxage) | CDN caches, revalidates |

---

## Performance Optimizations Applied

### Font & Resource Preloading

```astro
<!-- Already in Layout.astro -->
<link rel="preload" href="/_astro/font.woff2" as="font" type="font/woff2" crossorigin />
<link rel="dns-prefetch" href="//translate.google.com" />
<link rel="dns-prefetch" href="//www.googletagmanager.com" />
<link rel="preconnect" href="https://www.googletagmanager.com" />
```

### CSS Sprites

Logos and avatars combined into sprites for fewer HTTP requests:

```bash
bun run sprite:logos         # Partner logos
bun run sprite:testimonials  # Testimonial avatars
```

**Results:** 
- Logo sprite: 29 requests → 1 (96.5% reduction)
- Size: 1266 KB → 66 KB (94.8% savings)

### Third-Party Scripts

- **Tawk.to**: Deferred 2 seconds after page load
- **Google Analytics**: Standard async (no Partytown for static sites)

---

## Analytics Configuration

```yaml
# src/config.yaml
analytics:
  vendors:
    googleAnalytics:
      id: 'G-HB9LNKY6F2'
      partytown: false  # Disabled for static sites
```

**Why Partytown is disabled:**
- Static sites are already fast
- Google Analytics is only ~17KB
- Partytown adds complexity with minimal benefit for static sites

---

## Troubleshooting

### Build Seems Slow

1. Check if config/components changed (triggers full rebuild)
2. Verify Netlify cache plugin: `netlify-plugin-cache`
3. Force one build with `--force` flag to reset cache

### Images Not Being Reused

1. Verify `.build-cache/_astro/` exists from previous build
2. Check if assets changed (triggers re-optimization)

### Analytics Not Tracking

1. Verify `partytown: false` in config.yaml
2. Check browser console for GA script loading
3. Confirm GA tracking ID is correct

---

## URL Structure

All URLs are SEO-friendly and preserved:

| Content Type | URL Pattern |
|--------------|-------------|
| News | `/tin-tuc/[slug]` |
| Legal | `/phap-ly/[slug]` |
| Labor | `/lao-dong/[slug]` |
| Consultation | `/tu-van-thuong-xuyen/[slug]` |
| Evaluation | `/dich-vu-danh-gia/[slug]` |
| Foreign Investment | `/dau-tu-nuoc-ngoai/[slug]` |
| Tags | `/tag/[tag]` |

---

## Related Documentation

- [Scripts Documentation](../scripts/README.md) - Maintenance & optimization scripts
- [I18N Content Guide](./I18N_CONTENT_MARKUP_GUIDE.md) - Translation markup
- [YouTube Integration](./YOUTUBE_INTEGRATION_GUIDE.md) - Video embedding
