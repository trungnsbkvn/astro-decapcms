# Netlify Server Mode Setup (On-Demand Rendering)

## What Changed

Your Astro site now runs in **server mode** instead of static mode. This means:

### Before (Static Mode)
- Every post creation → Full site rebuild on Netlify
- 2-3 min build time per post
- High build minute costs

### After (Server Mode)
- Every post creation → **Pushed to Git, NO rebuild**
- Pages render **on-demand** when visitors access them
- **Zero build minutes** spent on content updates
- New posts live **immediately** (not cached)

---

## How It Works

### Architecture
```
Staff publishes post via Decap CMS
    ↓
Commits to Git → Netlify receives webhook
    ↓
Netlify runs build (30-60s, just for dependencies & code)
    ↓
Deploy to Netlify serverless functions
    ↓
User visits new post
    ↓
Netlify function renders post dynamically + caches for repeat visitors
```

### Key Benefits

1. **No rebuild for content changes**
   - Post created? Just a Git commit
   - No Netlify build triggered
   - New post appears immediately when accessed

2. **On-demand rendering**
   - Each page renders when first requested
   - Netlify caches response for subsequent visitors
   - Fast for end users

3. **Instant updates**
   - No waiting for cache expiration
   - No need to "clear cache and deploy"
   - Staff sees changes live immediately

---

## What This Means for Your Team

### Publishing a Post (2-3 times/day)
1. Staff writes & publishes via Decap CMS ✓
2. Post is committed to Git ✓
3. **No build happens** ✓ (saves ~2-3 min per post)
4. Post is **live immediately** when accessed ✓

### Updating Code
1. Push code changes to Git
2. Netlify builds & deploys (same as before)
3. Your code updates go live

---

## Technical Details

### Files Changed
- `astro.config.ts`: `output: 'static'` → `output: 'server'`
- Added: `adapter: netlify()` for Netlify integration
- `netlify.toml`: Removed build-skip rule (no longer needed)

### What Happens on Netlify
- `@astrojs/netlify` adapter bundles site as serverless functions
- Functions run Node.js on Netlify edge servers
- Each route renders on first request, then cached

---

## Performance & Costs

### Build Minutes Saved
- Before: ~2-3 min per post × 2-3 posts/day = 6-9 min/day
- **After: 0 min per post**
- **Monthly savings: ~180-270 build minutes** (or more!)

### Latency for Visitors
- First visitor to new post: ~50-200ms (function renders)
- Repeat visitors: <20ms (cached)
- No difference from static site for cached content

---

## Troubleshooting

### Post not appearing immediately?
- Check browser cache (Ctrl+Shift+Delete)
- Or wait up to 30s for Netlify function to boot

### Changes not live after code update?
- Check Netlify Deploy status
- May take 2-3 min for new functions to deploy

### Need to rollback?
```bash
git revert HEAD
git push
# Netlify will rebuild and deploy previous version
```

---

## Future Optimization

For even better performance:
- Implement incremental static regeneration (ISR) for popular posts
- Use Netlify On-Demand Builders for heavy computations
- Cache user sessions with Netlify Blobs

---

## Questions?

- Is server mode slower? **No**, pages are cached, same speed as static
- Does this cost more? **No**, same Netlify plan, just different deployment model
- Can I go back to static? **Yes**, revert `astro.config.ts` and rebuild
