# Netlify Build Cost Optimization

## Problem
Every time you create a new post via Decap CMS, it commits to Git, triggering a full Netlify rebuild (even though only content changed). This consumes unnecessary build minutes.

## Solutions Implemented

### 1. **Selective Deployment (Primary Optimization)**
Added a build ignore rule in `netlify.toml`:
```toml
[build]
  ignore = "git diff --quiet $COMMIT_PARENT $COMMIT -- . ':!src/content' && echo skip_build"
```

**How it works:**
- Compares the current commit with the parent commit
- Ignores changes to `src/content/` folder (where posts are stored)
- If ONLY content files changed → **Netlify skips the build entirely**
- If code or other files changed → **Netlify builds normally**

**Result:** When you publish a post via Decap CMS, Netlify will **NOT trigger a rebuild**, saving you significant build minutes.

### 2. **Environment Optimization**
Set explicit Node version:
```toml
[build.environment]
  NODE_VERSION = "20"
```

This ensures consistent builds and faster dependency resolution.

### 3. **Smart Caching Strategy**
Added cache headers for:
- **Static assets** (`/_astro/*`): Cached indefinitely (1 year) - these never change
- **Content pages** (`/tin-tuc/*`, `/phap-ly/*`, `/lao-dong/*`): Cached for 1 hour
  - Users see fresh content every hour
  - CDN (Netlify Edge) caches for efficiency
  - `s-maxage=3600` tells shared caches (CDN) to revalidate after 1 hour

## Important Notes

### ⚠️ Manual Deployment Required
Since content-only changes now skip builds:

**When you publish a post:**
1. Post is committed to Git ✓
2. Netlify build is skipped ✓
3. **New post appears on site within 1 hour** (from cache invalidation) ✓

If you need the new post **live immediately**, manually trigger a build:
- Go to Netlify dashboard
- Click "Deploy site" button (under "Deploys")
- Or set a manual webhook deploy (optional)

### ✅ When Builds Still Happen
Builds will still trigger for:
- Code changes (components, integrations, config)
- Template modifications
- Any files outside `src/content/`

## Cost Impact

**Before:** Every post creation = 1-3 minute build
**After:** Post creation = 0 minutes (content cached for 1 hour)

**Estimated Savings:** If you post daily, save ~30 build minutes/month

## Testing

To test if this works:
1. Create a new post in Decap CMS
2. Go to Netlify dashboard → Deploys
3. Confirm no build was triggered
4. Visit your site - new post appears within 1 hour (or clear cache for immediate)

## Cache Invalidation

To make changes live immediately (without waiting 1 hour):
1. Modify any code file (even a comment)
2. Push to GitHub
3. This triggers a full build which invalidates all caches

Or simply click "Clear cache and deploy" on Netlify dashboard.

## Future Optimization

For even more control, consider:
- Using Netlify Functions to rebuild only affected pages
- Setting up manual deploy webhooks
- Using Astro's server-side rendering for dynamic content (requires Netlify Pro)
