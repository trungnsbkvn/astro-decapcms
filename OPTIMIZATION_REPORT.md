# 🚀 Astro Website Optimization Report
**Generated:** January 14, 2026  
**Project:** yplawfirm.vn (Astro + Netlify SSR)

---

## Executive Summary

Your Astro website is **already well-optimized** with many best practices implemented. This report identifies specific opportunities for further improvement across performance, SEO, and maintainability.

**Overall Assessment:** ⭐⭐⭐⭐ (4/5)

**Strengths:**
- ✅ Excellent build configuration (esbuild, smart chunking)
- ✅ Comprehensive SEO implementation with Schema.org
- ✅ Well-structured i18n with hybrid translation system
- ✅ Aggressive edge caching strategy on Netlify
- ✅ Optimized image pipeline with smart breakpoints
- ✅ Partytown integration for analytics

**Opportunities:**
- 🔧 Add CSS sprite optimization for logos/avatars
- 🔧 Enhance content schema with SEO fields
- 🔧 Create maintenance scripts for unused files
- 🔧 Add font preloading optimization
- 🔧 Implement service worker for offline capability

---

## 1. PERFORMANCE OPTIMIZATION

### 1.1 Build Performance ✅ EXCELLENT

**Current State:**
```typescript
// astro.config.ts
build: {
  minify: 'esbuild',           // ✅ 10-100x faster than terser
  cssCodeSplit: true,          // ✅ Reduces critical CSS
  sourcemap: false,            // ✅ No source maps in production
  target: 'es2020',            // ✅ Modern browsers
}
```

**Status:** Already optimized. No changes needed.

---

### 1.2 Runtime Performance - HIGH PRIORITY

#### Issue 1.2.1: Missing Font Preloading
**Severity:** Medium  
**Impact:** Reduced First Contentful Paint (FCP)

**Current:** Fonts loaded via CSS without preload hints.

**Recommendation:** Add font preloading in layout head:

```astro
<!-- src/layouts/Layout.astro -->
<head>
  <!-- Preload critical fonts -->
  <link 
    rel="preload" 
    href="/_astro/inter-latin-variable.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin 
  />
</head>
```

**Expected Improvement:** 100-300ms faster FCP

---

#### Issue 1.2.2: Missing DNS Prefetch for External Domains
**Severity:** Low  
**Impact:** Faster connection to external resources

**Recommendation:** Add DNS prefetch hints:

```astro
<!-- src/components/common/Metadata.astro -->
<head>
  <!-- DNS prefetch for external domains -->
  <link rel="dns-prefetch" href="//translate.google.com" />
  <link rel="dns-prefetch" href="//www.googletagmanager.com" />
  <link rel="dns-prefetch" href="//cdn.pixabay.com" />
</head>
```

**Expected Improvement:** 20-50ms faster external resource loading

---

#### Issue 1.2.3: CSS Sprite Opportunity - RECOMMENDED
**Severity:** Medium  
**Impact:** Reduced HTTP requests, faster page load

**Current:** Individual images for partner logos, testimonial avatars.

**Files to Check:**
- Testimonials component likely loads 10-30+ avatar images
- Partner/Brand components may load 10-20+ logo images

**Recommendation:** Implement CSS sprite generation (see scripts from attached folder).

**Script to Create:**
```javascript
// scripts/generate-testimonials-sprite.js
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CONFIG = {
  inputDir: './public/assets/profiles',
  outputDir: './public/assets/sprites',
  imageSize: 64,        // Size per image
  columns: 10,          // Grid layout
  format: 'webp',
  quality: 85,
};

async function generateSprite() {
  const files = fs.readdirSync(CONFIG.inputDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  const totalImages = files.length;
  const rows = Math.ceil(totalImages / CONFIG.columns);
  const spriteWidth = CONFIG.columns * CONFIG.imageSize;
  const spriteHeight = rows * CONFIG.imageSize;
  
  const compositeImages = await Promise.all(
    files.map(async (file, index) => {
      const x = (index % CONFIG.columns) * CONFIG.imageSize;
      const y = Math.floor(index / CONFIG.columns) * CONFIG.imageSize;
      
      const buffer = await sharp(path.join(CONFIG.inputDir, file))
        .resize(CONFIG.imageSize, CONFIG.imageSize, { fit: 'cover' })
        .toBuffer();
      
      return { input: buffer, top: y, left: x };
    })
  );
  
  // Generate sprite image
  await sharp({
    create: {
      width: spriteWidth,
      height: spriteHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
    .composite(compositeImages)
    [CONFIG.format]({ quality: CONFIG.quality })
    .toFile(path.join(CONFIG.outputDir, `testimonials-sprite.${CONFIG.format}`));
  
  // Generate JSON mapping
  const mapping = {
    sprite: `/assets/sprites/testimonials-sprite.${CONFIG.format}`,
    width: spriteWidth,
    height: spriteHeight,
    imageSize: CONFIG.imageSize,
    images: Object.fromEntries(
      files.map((file, index) => {
        const name = path.basename(file, path.extname(file));
        const x = (index % CONFIG.columns) * CONFIG.imageSize;
        const y = Math.floor(index / CONFIG.columns) * CONFIG.imageSize;
        return [name, { x, y }];
      })
    )
  };
  
  fs.writeFileSync(
    path.join(CONFIG.outputDir, 'testimonials-sprite.json'),
    JSON.stringify(mapping, null, 2)
  );
  
  console.log(`✅ Sprite generated: ${totalImages} images → 1 sprite`);
}

generateSprite().catch(console.error);
```

**Component Usage:**
```astro
---
// src/components/widgets/Testimonials.astro
import spriteData from '/public/assets/sprites/testimonials-sprite.json';

function getSprite(imageName: string) {
  // Convert name to slug for lookup
  const slug = imageName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return spriteData.images[slug];
}

const { testimonials } = Astro.props;
---

{testimonials.map(testimonial => {
  const sprite = getSprite(testimonial.image);
  return (
    <div class="testimonial">
      {sprite ? (
        <div 
          class="avatar w-16 h-16 rounded-full"
          style={`
            background-image: url(${spriteData.sprite}); 
            background-position: -${sprite.x}px -${sprite.y}px; 
            background-size: ${spriteData.width}px ${spriteData.height}px;
          `}
          role="img"
          aria-label={testimonial.name}
        />
      ) : (
        <Image src={testimonial.image} alt={testimonial.name} width={64} height={64} />
      )}
      <p>{testimonial.quote}</p>
    </div>
  );
})}
```

**Add to package.json:**
```json
{
  "scripts": {
    "sprite:testimonials": "node scripts/generate-testimonials-sprite.js",
    "sprite:logos": "node scripts/generate-logo-sprite.js",
    "sprite:all": "npm run sprite:testimonials && npm run sprite:logos",
    "prebuild": "npm run sprite:all"
  }
}
```

**Expected Improvement:**
- 20-50 HTTP requests → 2 requests (1 sprite image + 1 JSON)
- 300-800KB total → 50-150KB (better compression)
- Faster page load, especially on mobile networks

---

### 1.3 Image Optimization ✅ EXCELLENT

**Current State:**
```typescript
// Optimized breakpoints (6 sizes instead of 15+)
deviceSizes: [320, 480, 640, 768, 1024, 1280]

// Modern formats first
formats: ['image/avif', 'image/webp']

// fetchpriority="high" on hero images
// Lazy loading on below-fold images
```

**Status:** Already optimized. Great work!

**Minor Enhancement:** Consider reducing to 5 breakpoints if most traffic is desktop:
```typescript
deviceSizes: [375, 640, 768, 1024, 1280] // Remove 320, add 375 for modern phones
```

---

### 1.4 Caching Strategy ✅ EXCELLENT

**Current State:**
```toml
# netlify.toml - Aggressive edge caching
Cache-Control: public, max-age=86400, stale-while-revalidate=2592000
Netlify-CDN-Cache-Control: public, max-age=604800, stale-while-revalidate=2592000, durable
```

**Status:** Excellent caching strategy. No changes needed.

---

## 2. SEO OPTIMIZATION

### 2.1 Technical SEO ✅ EXCELLENT

**Current Implementation:**
- ✅ Custom sitemap.xml.ts with all dynamic routes
- ✅ Comprehensive meta tags (title, description, OG, Twitter)
- ✅ Schema.org JSON-LD (Organization, LocalBusiness, Article)
- ✅ Breadcrumbs with structured data
- ✅ Canonical URLs
- ✅ robots.txt properly configured
- ✅ Geo tags for local SEO
- ✅ Hreflang tags

**Status:** Already excellent. Minor enhancements below.

---

### 2.2 Content Schema Enhancement - RECOMMENDED

#### Issue 2.2.1: Missing SEO Fields in Content Schema
**Severity:** Low  
**Impact:** Better SEO control per post

**Current Schema:**
```typescript
// src/content/config.ts
const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Missing: focus keyword, custom meta
  }),
});
```

**Recommended Enhancement:**
```typescript
// src/content/config.ts
const postCollection = defineCollection({
  schema: z.object({
    // Existing fields
    title: z.string(),
    excerpt: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    
    // SEO enhancements
    focusKeyword: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    customTitle: z.string().optional(),      // Override title in meta
    customDescription: z.string().optional(), // Override excerpt in meta
    noindex: z.boolean().default(false),
    
    // Analytics
    readingTime: z.number().optional(),       // Auto-calculated
    headings: z.array(z.object({             // Auto-extracted
      depth: z.number(),
      text: z.string(),
      slug: z.string(),
    })).optional(),
  }),
});
```

**Benefits:**
- Better keyword targeting
- Custom meta per post
- Reading time displayed
- Table of contents support

---

### 2.3 Additional Schema Types - OPTIONAL

**Current:** Organization, LocalBusiness, Article, BreadcrumbList

**Recommended Additions (create these components):**

```astro
<!-- src/components/seo/FAQSchema.astro -->
---
export interface FAQItem {
  question: string;
  answer: string;
}

export interface Props {
  faqs: FAQItem[];
}

const { faqs } = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

```astro
<!-- src/components/seo/HowToSchema.astro -->
---
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface Props {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}

const { name, description, steps, totalTime } = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  totalTime,
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    image: step.image,
  })),
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Usage:**
```astro
---
// In blog post or page
import FAQSchema from '~/components/seo/FAQSchema.astro';
import HowToSchema from '~/components/seo/HowToSchema.astro';

const faqs = [
  { question: 'Làm thế nào để...?', answer: 'Bạn có thể...' },
];
---

<FAQSchema {faqs} />
```

---

## 3. INTERNATIONALIZATION (i18n)

### 3.1 i18n Implementation ✅ EXCELLENT

**Current Implementation:**
- ✅ Hybrid system: Static translations (UI) + Google Translate (content)
- ✅ 5 languages supported (vi, en, zh, ja, ko)
- ✅ Professional translation utilities with fallbacks
- ✅ Locale detection and storage
- ✅ Google Translate deferred loading (after 2s idle)

**Status:** Excellent implementation. No changes needed.

---

### 3.2 Translation Maintenance Scripts - RECOMMENDED

**Issue:** No scripts to compare locales or find missing keys.

**Recommended Script:**
```javascript
// scripts/compare-locales.js
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = './src/i18n/locales';
const DEFAULT_LOCALE = 'vi';

function loadJSON(locale) {
  return JSON.parse(
    fs.readFileSync(path.join(LOCALES_DIR, `${locale}.json`), 'utf-8')
  );
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function compareLocales() {
  const defaultData = loadJSON(DEFAULT_LOCALE);
  const defaultKeys = new Set(getAllKeys(defaultData));
  
  const locales = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json') && f !== `${DEFAULT_LOCALE}.json`)
    .map(f => f.replace('.json', ''));
  
  console.log(`\n📊 Locale Comparison (baseline: ${DEFAULT_LOCALE})\n`);
  
  for (const locale of locales) {
    const data = loadJSON(locale);
    const keys = new Set(getAllKeys(data));
    
    const missing = [...defaultKeys].filter(k => !keys.has(k));
    const extra = [...keys].filter(k => !defaultKeys.has(k));
    
    console.log(`\n${locale.toUpperCase()}:`);
    console.log(`  ✅ ${keys.size} keys`);
    
    if (missing.length > 0) {
      console.log(`  ⚠️  ${missing.length} missing keys:`);
      missing.slice(0, 5).forEach(k => console.log(`     - ${k}`));
      if (missing.length > 5) console.log(`     ... and ${missing.length - 5} more`);
    }
    
    if (extra.length > 0) {
      console.log(`  ℹ️  ${extra.length} extra keys (not in ${DEFAULT_LOCALE})`);
    }
  }
}

compareLocales();
```

**Add to package.json:**
```json
{
  "scripts": {
    "i18n:compare": "node scripts/compare-locales.js",
    "i18n:sync": "node scripts/sync-translations.js"
  }
}
```

---

## 4. CODE QUALITY & MAINTENANCE

### 4.1 Unused Files Detection - RECOMMENDED

**Issue:** No automated way to find unused images or components.

**Recommended Scripts:**

```javascript
// scripts/find-unused-images.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Image directories to check
const IMAGE_DIRS = [
  'src/assets/images',
  'public/images',
  'public/assets/profiles',
];

// File extensions to scan for image references
const CODE_EXTS = ['.astro', '.ts', '.tsx', '.jsx', '.md', '.mdx'];

function getAllFiles(dir, exts = null) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (!exts || exts.some(ext => item.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

function findUnusedImages() {
  console.log('🔍 Scanning for unused images...\n');
  
  // Get all images
  const allImages = IMAGE_DIRS.flatMap(dir => {
    const fullDir = path.join(rootDir, dir);
    if (!fs.existsSync(fullDir)) return [];
    return getAllFiles(fullDir, ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif']);
  });
  
  console.log(`📁 Found ${allImages.length} images\n`);
  
  // Get all code files
  const codeFiles = [
    ...getAllFiles(path.join(rootDir, 'src'), CODE_EXTS),
    ...getAllFiles(path.join(rootDir, 'public/admin'), ['.yml']),
  ];
  
  // Read all code into one string for faster searching
  const codeContent = codeFiles
    .map(f => fs.readFileSync(f, 'utf-8'))
    .join('\n');
  
  // Check each image
  const unusedImages = allImages.filter(imagePath => {
    const filename = path.basename(imagePath);
    const nameWithoutExt = path.basename(imagePath, path.extname(imagePath));
    
    // Check if filename or name without extension appears in code
    return !codeContent.includes(filename) && !codeContent.includes(nameWithoutExt);
  });
  
  // Report
  if (unusedImages.length === 0) {
    console.log('✅ No unused images found!');
  } else {
    console.log(`⚠️  Found ${unusedImages.length} potentially unused images:\n`);
    unusedImages.forEach(img => {
      const rel = path.relative(rootDir, img);
      const size = (fs.statSync(img).size / 1024).toFixed(2);
      console.log(`  - ${rel} (${size} KB)`);
    });
    
    const totalSize = unusedImages.reduce((sum, img) => 
      sum + fs.statSync(img).size, 0
    );
    console.log(`\n💾 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Save report
  fs.writeFileSync(
    path.join(rootDir, 'unused-images-report.json'),
    JSON.stringify({ unusedImages, totalSize }, null, 2)
  );
  console.log('\n📄 Report saved to unused-images-report.json');
}

findUnusedImages();
```

**Add to package.json:**
```json
{
  "scripts": {
    "find:unused-images": "node scripts/find-unused-images.js",
    "find:duplicate-images": "node scripts/find-duplicate-images.js"
  }
}
```

---

### 4.2 Console Statement Cleanup - LOW PRIORITY

**Issue:** 9 console statements found in production code.

**Files:**
- src/pages/lien-he.astro (1)
- src/components/common/SearchSSR.astro (1)
- src/components/common/LazyYouTube.astro (1)
- src/components/common/LanguageSelector.astro (5)
- src/components/common/GoogleTranslate.astro (1)

**Recommendation:**
These are all error/warning logs which are fine for production. However, consider wrapping in a debug utility:

```typescript
// src/utils/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  error: (...args: unknown[]) => console.error(...args),
  warn: (...args: unknown[]) => isDev && console.warn(...args),
  log: (...args: unknown[]) => isDev && console.log(...args),
  debug: (...args: unknown[]) => isDev && console.debug(...args),
};
```

**Usage:**
```typescript
// Instead of console.warn
import { logger } from '~/utils/logger';
logger.warn('Failed to load i18n data:', e);
```

**Impact:** Reduces production bundle size by 1-2KB.

---

## 5. ADDITIONAL RECOMMENDATIONS

### 5.1 Service Worker for Offline Support - OPTIONAL

**Current:** No service worker or PWA support.

**Recommendation:** Add basic offline support:

```javascript
// public/sw.js
const CACHE_NAME = 'yplawfirm-v1';
const urlsToCache = [
  '/',
  '/gioi-thieu',
  '/dich-vu',
  '/lien-he',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

```astro
<!-- Register in layout -->
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

---

### 5.2 Critical CSS Inline - ALREADY DONE ✅

```typescript
build: {
  inlineStylesheets: 'always', // ✅ Already configured
}
```

---

### 5.3 Preconnect for Critical Origins

**Recommendation:** Add preconnect for frequently used external domains:

```astro
<!-- In head -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://cdn.pixabay.com" />
```

---

## 6. SUMMARY OF RECOMMENDATIONS

### High Priority (Implement First)
1. ✅ **Already Optimized** - Build configuration, caching, SEO
2. 🔧 **CSS Sprites** - Reduce HTTP requests for logos/avatars (scripts attached)
3. 🔧 **Font Preloading** - Add preload for critical fonts

### Medium Priority
4. 🔧 **Enhanced Content Schema** - Add focusKeyword, keywords, customTitle
5. 🔧 **Maintenance Scripts** - compare-locales.js, find-unused-images.js
6. 🔧 **Additional Schema Types** - FAQSchema, HowToSchema components
7. 🔧 **DNS Prefetch** - Add for external domains

### Low Priority (Nice to Have)
8. 🔧 **Logger Utility** - Wrap console statements for production
9. 🔧 **Service Worker** - Offline support for static pages
10. 🔧 **Preconnect** - For critical external origins

---

## 7. PERFORMANCE METRICS PROJECTION

**Current Estimated Scores:**
- Performance: 90-95/100
- Accessibility: 95/100
- Best Practices: 95/100
- SEO: 98/100

**After All Optimizations:**
- Performance: 95-100/100 (CSS sprites, font preload)
- Accessibility: 95/100 (no change)
- Best Practices: 98/100 (PWA, logger)
- SEO: 100/100 (enhanced schema)

---

## 8. NEXT STEPS

1. **Week 1:** Implement CSS sprite scripts and font preloading
2. **Week 2:** Add maintenance scripts (unused images, locale comparison)
3. **Week 3:** Enhance content schema with SEO fields
4. **Week 4:** Add additional schema types (FAQ, HowTo)

---

## 9. CONCLUSION

Your Astro website is **already well-optimized** with:
- ✅ Excellent build performance (esbuild, smart chunking)
- ✅ Comprehensive SEO (custom sitemap, schema, meta tags)
- ✅ Professional i18n system
- ✅ Aggressive caching strategy
- ✅ Optimized images with modern formats

**Key Improvements to Implement:**
1. CSS sprites for logos/avatars (largest impact)
2. Font preloading (quick win)
3. Maintenance scripts (developer productivity)
4. Enhanced content schema (better SEO control)

**Estimated Time to Implement All Recommendations:** 2-3 days

---

**Questions or need help implementing?** Refer to the attached scripts folder for working examples from luatsumienbac.vn.
