# Quick Implementation Guide

## Priority 1: CSS Sprites (Highest Impact)

### 1. Generate Sprites
```bash
npm run sprite:testimonials
npm run sprite:logos
```

### 2. Update Component to Use Sprite
```astro
---
// src/components/widgets/Testimonials.astro
import spriteData from '/public/assets/sprites/testimonials-sprite.json';

function getSprite(imageName: string) {
  const slug = imageName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return spriteData.images[slug];
}
---

{testimonials.map(item => {
  const sprite = getSprite(item.avatar);
  return (
    <div class="testimonial">
      {sprite ? (
        <!-- Use sprite -->
        <div 
          class="avatar w-16 h-16 rounded-full"
          style={`
            background-image: url(${spriteData.sprite}); 
            background-position: -${sprite.x}px -${sprite.y}px; 
            background-size: ${spriteData.width}px ${spriteData.height}px;
          `}
          role="img"
          aria-label={item.name}
        />
      ) : (
        <!-- Fallback to regular image -->
        <Image src={item.avatar} alt={item.name} width={64} height={64} />
      )}
    </div>
  );
})}
```

### 3. Add to Build Process
```json
// package.json
{
  "scripts": {
    "prebuild": "npm run sprite:all",
    "build": "astro build"
  }
}
```

**Expected Impact:** 20-50 fewer HTTP requests, 50-70% smaller total size

---

## Priority 2: Font Preloading (Quick Win)

### Add to Layout Head
```astro
---
// src/layouts/Layout.astro
---
<head>
  <!-- Existing meta tags -->
  
  <!-- Preload critical fonts -->
  <link 
    rel="preload" 
    href="/_astro/inter-latin-variable.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin 
  />
  
  <!-- DNS prefetch for external domains -->
  <link rel="dns-prefetch" href="//translate.google.com" />
  <link rel="dns-prefetch" href="//www.googletagmanager.com" />
  <link rel="dns-prefetch" href="//cdn.pixabay.com" />
  
  <!-- Preconnect for critical origins -->
  <link rel="preconnect" href="https://www.googletagmanager.com" />
</head>
```

**Expected Impact:** 100-300ms faster First Contentful Paint

---

## Priority 3: Enhanced Content Schema

### Update Content Collections
```typescript
// src/content/config.ts
const postCollection = defineCollection({
  schema: z.object({
    // Existing fields
    title: z.string(),
    excerpt: z.string().optional(),
    
    // SEO enhancements
    focusKeyword: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    customTitle: z.string().optional(),
    customDescription: z.string().optional(),
    noindex: z.boolean().default(false),
  }),
});
```

### Use in Metadata
```astro
---
// In blog post page
const { entry } = Astro.props;
const title = entry.data.customTitle || entry.data.title;
const description = entry.data.customDescription || entry.data.excerpt;
const keywords = entry.data.keywords?.join(', ');
---

<Metadata 
  title={title}
  description={description}
  keywords={keywords}
  robots={{ index: !entry.data.noindex }}
/>
```

---

## Priority 4: New SEO Schema Components

### FAQ Schema
```astro
---
// In FAQ page or blog post with FAQs
import FAQSchema from '~/components/seo/FAQSchema.astro';

const faqs = [
  { 
    question: 'Làm thế nào để thành lập công ty?', 
    answer: 'Bạn cần chuẩn bị hồ sơ bao gồm...' 
  },
  { 
    question: 'Thời gian thành lập mất bao lâu?', 
    answer: 'Thông thường từ 7-10 ngày làm việc...' 
  },
];
---

<FAQSchema {faqs} />
```

### HowTo Schema
```astro
---
import HowToSchema from '~/components/seo/HowToSchema.astro';

const guide = {
  name: 'Cách đăng ký công ty TNHH',
  description: 'Hướng dẫn chi tiết từng bước',
  totalTime: 'P7D',
  steps: [
    { name: 'Bước 1: Chuẩn bị hồ sơ', text: 'Bao gồm...' },
    { name: 'Bước 2: Nộp hồ sơ', text: 'Tại phòng đăng ký...' },
  ]
};
---

<HowToSchema {...guide} />
```

---

## Maintenance Scripts

### Find Unused Images
```bash
npm run find:unused-images
```
Check `unused-images-report.json` before deleting.

### Compare Locales
```bash
npm run i18n:compare
```
Check `locale-comparison-report.json` for missing translations.

---

## Testing After Implementation

### 1. Build Test
```bash
npm run build
```
Should complete without errors. Check build time improvement.

### 2. Lighthouse Audit
```bash
npm run preview
```
Run Lighthouse on key pages:
- Homepage
- Blog post
- Contact page

Target scores:
- Performance: 95+
- SEO: 100
- Best Practices: 95+
- Accessibility: 95+

### 3. Validate Schema
Use [Google's Rich Results Test](https://search.google.com/test/rich-results)

### 4. Check Sprite Loading
- Open Network tab
- Should see sprite file loaded once
- Individual avatar images should not load

---

## Rollback Plan

If issues occur:

1. **Sprite Issues:** Remove `prebuild` script, use regular images
2. **Font Issues:** Remove preload links
3. **Schema Issues:** Comment out new schema components

---

## Next Steps After Implementation

1. Monitor Core Web Vitals in Google Search Console
2. Check page load times in real user monitoring
3. Verify search appearance with rich results
4. Run periodic unused file scans
5. Keep locale files in sync

---

## Need Help?

Refer to:
- `OPTIMIZATION_REPORT.md` - Full analysis
- `scripts/` - Working script examples
- Attached folders from luatsumienbac.vn - Reference implementations
