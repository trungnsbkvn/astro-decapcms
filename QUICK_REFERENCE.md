# Quick Reference Card

> **Print this page for easy reference during implementation**

---

## 🚀 Quick Start Commands

```bash
# Generate sprites
npm run sprite:testimonials
npm run sprite:logos
npm run sprite:all

# Find unused files
npm run find:unused-images

# Check translations
npm run i18n:compare

# Build with sprites
npm run build
```

---

## 📁 Key Files to Modify

### 1. Layout (Font Preloading)
**File:** `src/layouts/Layout.astro`

```astro
<head>
  <!-- Add these -->
  <link rel="preload" href="/_astro/font.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="dns-prefetch" href="//translate.google.com" />
  <link rel="preconnect" href="https://www.googletagmanager.com" />
</head>
```

---

### 2. Content Schema (SEO Fields)
**File:** `src/content/config.ts`

```typescript
const postCollection = defineCollection({
  schema: z.object({
    // Add these
    focusKeyword: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    customTitle: z.string().optional(),
    customDescription: z.string().optional(),
    noindex: z.boolean().default(false),
  }),
});
```

---

### 3. Sprite Usage
**File:** Any component with multiple images

```astro
---
import spriteData from '/public/assets/sprites/testimonials-sprite.json';
const sprite = spriteData.images['slug-name'];
---

<div 
  style={`
    background-image: url(${spriteData.sprite}); 
    background-position: -${sprite.x}px -${sprite.y}px; 
    background-size: ${spriteData.width}px ${spriteData.height}px;
  `}
/>
```

---

## 🎯 Priority Order

| Priority | Task | Time | Impact |
|----------|------|------|--------|
| 🔴 HIGH | Font preloading | 15m | 100-300ms |
| 🔴 HIGH | CSS sprites | 2-3h | 20-50 requests |
| 🟡 MEDIUM | Content schema | 1-2h | SEO control |
| 🟡 MEDIUM | SEO schemas | 30m each | Rich results |
| 🟢 LOW | Maintenance scripts | As needed | Cleanup |

---

## 📊 Testing Checklist

### After Each Change
- [ ] `npm run build` succeeds
- [ ] Pages load without errors
- [ ] Images display correctly
- [ ] No console errors

### Before Deployment
- [ ] Lighthouse score ≥ 95
- [ ] All Schema.org valid
- [ ] Cross-browser tested
- [ ] Mobile tested

---

## 🔧 Troubleshooting

### Sprites Not Loading
1. Check sprite file exists: `public/assets/sprites/`
2. Verify JSON mapping: Look for your image slug
3. Check CSS syntax: `-${sprite.x}px` (include minus)
4. Clear browser cache

### Build Fails
1. Check script syntax
2. Verify dependencies: `npm install`
3. Check file paths
4. Review error message carefully

### Schema Errors
1. Validate on [validator.schema.org](https://validator.schema.org/)
2. Check required fields
3. Verify URL format (absolute URLs)
4. Test JSON syntax

---

## 📈 Expected Results

### Performance
- **Before:** 90-95 Lighthouse
- **After:** 95-100 Lighthouse
- **Gain:** 5-10 points

### HTTP Requests
- **Before:** 80-120 requests
- **After:** 40-70 requests
- **Gain:** 40-50 fewer

### Page Size
- **Before:** 1-2 MB
- **After:** 500KB-1MB
- **Gain:** 30-50% smaller

---

## 🆘 Emergency Rollback

### If Something Breaks

1. **Revert last commit:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Disable sprites:**
   - Remove `prebuild` script
   - Use `<Image>` component instead of sprite

3. **Disable new schemas:**
   - Comment out `<FAQSchema>` etc.
   - Redeploy

4. **Contact support:**
   - Review OPTIMIZATION_REPORT.md
   - Check error logs
   - Restore from backup

---

## 📞 Reference Documents

| Document | Purpose |
|----------|---------|
| `OPTIMIZATION_SUMMARY.md` | Overview & quick wins |
| `OPTIMIZATION_REPORT.md` | Detailed analysis |
| `IMPLEMENTATION_GUIDE.md` | Step-by-step instructions |
| `OPTIMIZATION_CHECKLIST.md` | Task tracking |
| `scripts/README.md` | Script documentation |

---

## 🎓 New Components Created

```astro
// Import these for SEO
import { 
  FAQSchema,
  HowToSchema, 
  ReviewsSchema,
  VideoSchema 
} from '~/components/seo';

// Use like this
<FAQSchema faqs={[...]} />
<HowToSchema name="..." steps={[...]} />
<ReviewsSchema ratingValue={4.8} reviewCount={127} />
<VideoSchema name="..." thumbnailUrl="..." />
```

---

## ⚡ Performance Tips

1. **Sprites**: Only for 10+ similar images
2. **Preload**: Only critical fonts (1-2 max)
3. **Prefetch**: Only external domains actually used
4. **Schema**: Only add where content matches
5. **Keywords**: 3-5 per post max

---

## 🎯 Success Indicators

✅ Build time: <3 minutes  
✅ Page load: <2 seconds  
✅ LCP: <2.5 seconds  
✅ HTTP requests: <50  
✅ Lighthouse: ≥95  
✅ SEO score: 100  
✅ No console errors  
✅ All images load  

---

## 📱 Quick Contact

**Documentation**: See markdown files in project root  
**Scripts**: See `scripts/README.md`  
**Issues**: Check GitHub/Netlify logs  
**Testing**: Use Lighthouse + Rich Results Test  

---

**Version:** 1.0  
**Date:** January 14, 2026  
**Status:** Ready for Implementation  

---

> 💡 **Tip:** Bookmark this page for quick reference during implementation!
