# Performance & Image Optimization Testing Checklist

## ✅ Image Optimization Already Configured

Your site has these optimizations in place:

### 1. **Lazy Loading**
```astro
loading: 'lazy'  // Images load only when visible
decoding: 'async'  // Async image decode doesn't block rendering
```

### 2. **Responsive Images**
- Width & height are automatically parsed and set
- Images scale to fit display boxes
- Aspect ratio preserved (no CLS - Cumulative Layout Shift)

### 3. **Multiple Optimization Strategies**
- **Unpic Optimizer**: For external CDN images (cdn.pixabay.com)
- **Astro Assets Optimizer**: For local images (using Sharp)

### 4. **Image Formats**
- `.webp` for modern browsers (better compression)
- `.avif` for latest browsers (even better compression)
- Fallback to original format for older browsers

---

## 🧪 Manual Testing Checklist

Use browser DevTools to check these:

### Performance Tests

1. **Open DevTools → Performance Tab**
   - Go to http://localhost:4321
   - Click Record
   - Scroll page slowly
   - Click Stop
   - Check:
     - ✅ First Contentful Paint (FCP) < 1.5s
     - ✅ Largest Contentful Paint (LCP) < 2.5s
     - ✅ Cumulative Layout Shift (CLS) < 0.1

2. **Open DevTools → Network Tab**
   - Clear cache (Ctrl+Shift+Delete)
   - Reload page
   - Check:
     - ✅ Total page size < 3MB
     - ✅ Images use .webp format (lighter than .jpg)
     - ✅ Images lazy-load (not all requested immediately)

### Image Display Tests

1. **Homepage**
   - ✅ Hero image loads properly
   - ✅ Team photos display correctly
   - ✅ Images fit their containers (no cropping issues)
   - ✅ No layout shift when images load

2. **Blog Post Pages** (`/tin-tuc/`, `/phap-ly/`, etc)
   - ✅ Featured images display with correct aspect ratio
   - ✅ Images in content are properly sized
   - ✅ Image captions (if any) align properly

3. **Image Sizing Test**
   ```
   Right-click on image → Inspect → Compute styles
   Check:
   - Display width matches container width
   - Height maintains aspect ratio
   - No visible pixelation or blurring
   ```

### Responsive Design Tests

1. **Desktop** (1920px width)
   - ✅ Images look crisp and clear
   - ✅ No wasted space

2. **Tablet** (768px width)
   - ✅ Images scale down proportionally
   - ✅ Still maintain quality

3. **Mobile** (375px width)
   - ✅ Images scale to fit screen
   - ✅ Touch-friendly sizes

---

## 📊 Performance Metrics to Check

### LCP (Largest Contentful Paint)
- **Good**: < 2.5s
- **Your target**: < 2.0s (server mode may add ~300-500ms)

### FCP (First Contentful Paint)
- **Good**: < 1.5s
- **Your target**: < 1.5s

### CLS (Cumulative Layout Shift)
- **Good**: < 0.1
- **Your target**: < 0.05 (images have fixed sizes, shouldn't shift)

### Image File Sizes
- **Typical blog image**: 50-200KB
- **Your site should**: Average 100-150KB per image
- **Check**: Network tab → Images → Size

---

## 🔍 Specific Tests to Run

### Test 1: Image Quality on First Load
1. Open http://localhost:4321/phap-ly/doanh-nghiep
2. Scroll slowly through post
3. Images should appear crisp (no pixelation)
4. No visible artifacts or color banding

### Test 2: Lazy Loading Works
1. Open DevTools → Network
2. Go to homepage
3. Scroll down (don't scroll all the way)
4. Check Network tab:
   - Only visible images requested
   - Below-the-fold images NOT requested yet

### Test 3: Responsive Images
1. Open DevTools → Device Toolbar (F12)
2. Set to iPhone 12 (390px)
3. Homepage images should fit phone screen
4. No horizontal scroll needed

### Test 4: Build Size Comparison
- Run: `pnpm run build`
- Check output: `dist/` folder size
- Should be **< 50MB** (vs 500MB+ in static mode)

---

## ⚠️ Known Issue: Server Mode Slowness

**Dev mode is slow because:**
- Pages render on first request (not pre-built)
- Takes ~200-500ms to render page
- But **cached after first render**

**Production will be faster:**
- Netlify has better caching
- CDN speeds up delivery
- Repeat visitors: < 100ms

---

## What to Report

After testing, check if:

✅ **Performance**
- [ ] Lighthouse score > 80
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Total page size reasonable

✅ **Images**
- [ ] Images display correctly in all containers
- [ ] No pixelation or blurring
- [ ] Lazy loading works (Network tab)
- [ ] Responsive on mobile/tablet

✅ **Server Mode Benefits**
- [ ] Dev server runs without crashes
- [ ] Pages load (even if slow initially)
- [ ] Content renders dynamically

---

## Next Steps

1. **Test locally** using this checklist
2. **Commit changes** to GitHub
3. **Push to Netlify** and test in production
4. **Run Lighthouse audit** on production:
   - Netlify > Analytics > Performance or
   - Use PageSpeed Insights (https://pagespeed.web.dev/)

