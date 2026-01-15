# Build Optimization Guide

## Smart Build System

This project uses an intelligent build system that dramatically reduces build times on Netlify by:
1. **Change Detection** - Only rebuilds when source files actually change
2. **Image Caching** - Reuses optimized images when only content changes (saves 60-80% build time)
3. **Hash-based Tracking** - Tracks all source files to detect what changed

### How It Works

```bash
# Local development
bun run build:smart          # Smart build with caching
bun run build:smart --force  # Force full rebuild

# Netlify (automatic)
# Uses build:netlify command which runs smart-build.js
```

### Build Scenarios

| Scenario | Build Time | What Happens |
|----------|-----------|--------------|
| **No changes** | 2-5 seconds | Build skipped entirely |
| **Content only** | 30-40% faster | Reuses cached images from previous build |
| **Component/Layout** | Full time | Complete rebuild with image optimization |
| **Config change** | Full time | Complete rebuild with image optimization |

### Cache Locations

- **Local**: `.build-cache/` folder (gitignored, ~500MB-1GB)
  - `content-hashes.json` - File fingerprints
  - `_astro/` - Cached optimized images
  - `build-meta.json` - Build metadata

- **Netlify**: Cached between deploys via `netlify-plugin-cache`
  - Persists across deployments
  - Automatically restored before each build

### Configuration

**astro.config.ts optimizations:**
- ✅ Sharp with unlimited pixel support
- ✅ esbuild minification (10-100x faster than terser)
- ✅ Smart code splitting (embed, search, vendor chunks)
- ✅ CSS code splitting + minification
- ✅ Tree shaking optimizations
- ✅ Modern browser targets (es2020)
- ✅ No source maps in production

**netlify.toml optimizations:**
- ✅ Skip Netlify asset processing (Astro handles it)
- ✅ Cache build artifacts (`.build-cache`, `.astro`, etc.)
- ✅ Node.js memory limit: 4GB
- ✅ Sharp caching enabled
- ✅ Immutable cache headers for `/_astro/*` assets

### Performance Tips

1. **Content Updates**: Just edit markdown/MDX and commit
   - Smart build detects only content changed
   - Reuses all optimized images from previous build
   - Build time: ~30-40% of full build

2. **Image Changes**: Only add/modify images when needed
   - Each image generates 6-12 optimized variants (breakpoints × formats)
   - Source: `1 image` → Output: `~10 optimized images`
   - Cached images are reused when possible

3. **Component Changes**: Accept full build time
   - Changes to components/layouts/pages require full rebuild
   - This ensures consistency and prevents stale output

### Monitoring

Check build logs for cache effectiveness:
```
📊 Change Detection Summary:
═══════════════════════════════════════════════
🔍 Changes in: content

📁 CONTENT:
   ✏️  Modified (3):
      - src/content/post/example.md

🖼️  Images will be reused from cache (only content/i18n changed)
⏱️  Build time: 45s (vs 120s full build)
```

### Troubleshooting

**Build seems slow despite caching:**
- Check if config/components changed (requires full rebuild)
- Verify Netlify cache plugin is installed: `netlify-plugin-cache`
- Clear cache with `--force` flag for one build

**Images not being reused:**
- Ensure `.build-cache/_astro/` exists from previous build
- Check if assets changed (triggers image re-optimization)
- Verify Netlify is caching `.build-cache` directory

**Cache too large:**
- `.build-cache/_astro/` can be 500MB-1GB with many images
- This is normal for sites with 800+ pages
- Cache is cost-effective (saves more build time than storage costs)

### When to Use Force Rebuild

Use `--force` flag when:
- Suspecting stale cache causing issues
- After major dependency updates
- After Astro version upgrade
- When cache gets corrupted

```bash
# Local
bun run build:smart --force

# Netlify (one-time)
# Manually clear build cache in Netlify UI
```

### Cost Savings

For a site with 800+ pages:
- **Full build**: ~120 seconds
- **Smart build (content only)**: ~45 seconds
- **Savings**: 75 seconds × 20 deploys/month = **25 minutes/month**
- **Netlify build minutes saved**: Significant for Free/Pro plans
