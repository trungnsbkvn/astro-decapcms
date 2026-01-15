# Optimization & Maintenance Scripts

This directory contains utility scripts for optimizing and maintaining your Astro website.

---

## 📋 Available Scripts

### Performance Optimization

#### `generate-testimonials-sprite.js`
Combines testimonial avatar images into a single CSS sprite.

**Benefits:**
- Reduces HTTP requests (e.g., 30 images → 1 sprite)
- Better compression (50-70% smaller)
- Faster page load

**Usage:**
```bash
npm run sprite:testimonials
```

**Output:**
- `public/assets/sprites/testimonials-sprite.webp` - Sprite image
- `public/assets/sprites/testimonials-sprite.json` - Position mapping

**Component Usage:**
```astro
---
import spriteData from '/public/assets/sprites/testimonials-sprite.json';
const sprite = spriteData.images['avatar-name'];
---
<div 
  style={`
    background-image: url(${spriteData.sprite}); 
    background-position: -${sprite.x}px -${sprite.y}px;
  `}
/>
```

---

#### `generate-logo-sprite.js` *(Template - Create Similar to Testimonials)*
Combines partner/client logos into a single CSS sprite.

**Usage:**
```bash
npm run sprite:logos
```

---

### Maintenance & Analysis

#### `find-unused-images.js`
Scans image directories and identifies images not referenced in code.

**Usage:**
```bash
npm run find:unused-images
```

**Output:**
- Console report with file paths and sizes
- `unused-images-report.json` - Detailed JSON report

**What it checks:**
- `src/assets/images/`
- `public/images/`
- `public/assets/`

**Note:** Manual verification recommended before deleting:
- Dynamic references (e.g., CMS content)
- Future use images
- External references

---

#### `find-duplicate-images.js` *(To be created)*
Finds duplicate images by comparing file hashes.

**Usage:**
```bash
npm run find:duplicate-images
```

---

#### `compare-locales.js`
Compares translation files to find missing or extra keys.

**Usage:**
```bash
npm run i18n:compare
```

**Output:**
- Console report with missing/extra keys
- `locale-comparison-report.json` - Detailed comparison

**Checks:**
- Missing keys in non-default locales
- Extra keys not in default locale
- Empty values

---

#### `sync-translations.js` *(To be created)*
Synchronizes translation keys across locale files.

**Usage:**
```bash
npm run i18n:sync
```

---

## 🔧 Configuration

### Sprite Generation

Edit sprite configuration in each script:

```javascript
const CONFIG = {
  inputDir: './public/assets/profiles',  // Source images
  outputDir: './public/assets/sprites',  // Output directory
  imageSize: 64,                         // Size per image (px)
  columns: 10,                           // Grid columns
  format: 'webp',                        // Output format
  quality: 85,                           // Compression quality
};
```

---

### Unused Images

Edit directories to scan:

```javascript
const CONFIG = {
  imageDirs: [
    'src/assets/images',
    'public/images',
    'public/assets',
  ],
  codeExts: ['.astro', '.ts', '.md', '.mdx'],
  codeDirs: ['src', 'public/admin'],
};
```

---

### Locale Comparison

Set default locale:

```javascript
const DEFAULT_LOCALE = 'vi';
const LOCALES_DIR = path.join(rootDir, 'src/i18n/locales');
```

---

## 📊 Script Output Examples

### Sprite Generation
```
🎨 Generating testimonials sprite...

📁 Found 35 images
📐 Sprite dimensions: 640x256px
📊 Grid: 10 columns × 4 rows

✅ Sprite image created: testimonials-sprite.webp
✅ Sprite mapping created: testimonials-sprite.json

📊 Statistics:
   Images combined: 35
   Original total size: 847.32 KB
   Sprite size: 234.18 KB
   Savings: 72.4%
   HTTP requests reduced: 35 → 1
```

---

### Unused Images
```
🔍 Scanning for unused images...

📁 Found 287 images in 3 directories
📄 Scanning 156 code files...

📊 Results:
   ✅ Used images: 265
   ⚠️  Potentially unused: 22

⚠️  Potentially unused images:

📁 public/images/
   - old-banner.jpg (234.56 KB)
   - temp-photo.png (89.23 KB)

💾 Total size of unused images: 1.47 MB
📄 Detailed report saved to: unused-images-report.json
```

---

### Locale Comparison
```
📊 Translation Locale Comparison

   Baseline: VI
   Directory: src/i18n/locales

📁 VI (baseline):
   Total keys: 247

📁 EN:
   Total keys: 247
   ✅ Perfect match!

📁 ZH:
   Total keys: 241
   ❌ Missing keys: 6
   ℹ️  Extra keys: 0

📄 Detailed report saved to: locale-comparison-report.json
```

---

## 🚀 Integration with Build

### Auto-generate Sprites Before Build

```json
// package.json
{
  "scripts": {
    "prebuild": "npm run sprite:all",
    "build": "astro build"
  }
}
```

---

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
- name: Generate sprites
  run: npm run sprite:all

- name: Check for unused images
  run: npm run find:unused-images

- name: Validate locales
  run: npm run i18n:compare
```

---

## 🛠️ Development Tips

### Testing Scripts Locally

```bash
# Test sprite generation without affecting production
node scripts/generate-testimonials-sprite.js

# Check output
ls -lh public/assets/sprites/
```

---

### Debugging

Each script includes verbose logging. Check console output for:
- ✅ Success messages
- ⚠️  Warnings (non-critical)
- ❌ Errors (requires fix)

---

### Creating New Scripts

Template structure:

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const CONFIG = {
  // Configuration
};

async function main() {
  try {
    console.log('🚀 Starting...');
    // Your logic here
    console.log('✅ Complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
```

---

## 📝 Best Practices

### When to Run Scripts

| Script | Frequency | Timing |
|--------|-----------|--------|
| `sprite:*` | Before each build | Automated in prebuild |
| `find:unused-images` | Monthly | Manual review |
| `i18n:compare` | When adding translations | Before deployment |
| `find:duplicate-images` | Quarterly | During cleanup |

---

### Safety Checks

Before deleting files identified by scripts:
1. ✅ Review full report JSON
2. ✅ Search codebase manually for edge cases
3. ✅ Check CMS content references
4. ✅ Test on staging environment
5. ✅ Keep backups for 30 days

---

## 🔍 Troubleshooting

### "Module not found" Error
```bash
# Install dependencies
npm install
```

### "Input directory not found"
```bash
# Create directory or update CONFIG.inputDir
mkdir -p public/assets/profiles
```

### Sprite Generation Fails
- Check image file formats (jpg, png, webp supported)
- Verify Sharp is installed: `npm list sharp`
- Check disk space

### "Permission denied"
```bash
# On Unix/Linux/Mac
chmod +x scripts/*.js
```

---

## 📚 Additional Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/) - Image processing
- [CSS Sprites Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_images/Implementing_image_sprites_in_CSS)
- [Astro Assets](https://docs.astro.build/en/guides/images/)

---

## 🤝 Contributing

When adding new scripts:
1. Follow existing naming convention
2. Include comprehensive comments
3. Add configuration section at top
4. Provide usage examples
5. Generate JSON reports for complex operations
6. Update this README

---

**Last Updated:** January 14, 2026  
**Maintained by:** Y&P Development Team
