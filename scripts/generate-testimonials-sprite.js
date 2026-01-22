/**
 * Generate CSS Sprite for Testimonial Avatars
 * Combines multiple small images into a single sprite for better performance
 * 
 * Benefits:
 * - Reduces HTTP requests (e.g., 30 images → 1 sprite)
 * - Better compression when images are combined
 * - Faster page load, especially on mobile
 * 
 * Usage: npm run sprite:testimonials
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const CONFIG = {
  inputDir: path.join(rootDir, 'src/assets/images/customers'),
  outputDir: path.join(rootDir, 'public/assets/sprites'),
  avatarSize: 90,       // Size per avatar in sprite (90px for 2x retina at 45px display)
  columns: 10,          // Grid layout: 10 columns
  format: 'webp',       // WebP for best compression
  quality: 85,          // Quality: 85 is good balance
  background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
  circular: true,       // Create circular avatars
};

/**
 * Generate slug from filename
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Generate sprite image and JSON mapping
 */
async function generateSprite() {
  console.log('🎨 Generating testimonials sprite...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Check if input directory exists
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.warn(`⚠️  Input directory not found: ${CONFIG.inputDir}`);
    console.log('Creating example sprite for testing...\n');
    
    // Create a minimal sprite for testing
    const testSprite = {
      sprite: '/assets/sprites/testimonials-sprite.webp',
      width: CONFIG.imageSize * 2,
      height: CONFIG.imageSize,
      imageSize: CONFIG.imageSize,
      images: {
        'example-1': { x: 0, y: 0 },
        'example-2': { x: CONFIG.imageSize, y: 0 },
      }
    };
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, 'testimonials-sprite.json'),
      JSON.stringify(testSprite, null, 2)
    );
    
    console.log('✅ Example sprite JSON created');
    return;
  }
  
  // Get all image files
  const files = fs.readdirSync(CONFIG.inputDir)
    .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    .sort();
  
  if (files.length === 0) {
    console.warn('⚠️  No images found in input directory');
    return;
  }
  
  console.log(`📁 Found ${files.length} images`);
  
  // Calculate sprite dimensions
  const totalImages = files.length;
  const rows = Math.ceil(totalImages / CONFIG.columns);
  const size = CONFIG.avatarSize;
  const spriteWidth = Math.min(totalImages, CONFIG.columns) * size;
  const spriteHeight = rows * size;
  
  console.log(`📐 Sprite dimensions: ${spriteWidth}x${spriteHeight}px`);
  console.log(`📐 Avatar size: ${size}px (display at ${size/2}px for retina)`);
  console.log(`📊 Grid: ${CONFIG.columns} columns × ${rows} rows\n`);
  
  // Create circular mask for avatars
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
    </svg>`
  );
  
  // Process each image and create composite array
  const compositeImages = await Promise.all(
    files.map(async (file, index) => {
      const x = (index % CONFIG.columns) * size;
      const y = Math.floor(index / CONFIG.columns) * size;
      
      try {
        // 1. Resize to square, crop to center
        const resized = await sharp(path.join(CONFIG.inputDir, file))
          .resize(size, size, { 
            fit: 'cover',
            position: 'attention' // Focus on most interesting part
          })
          .png()
          .toBuffer();
        
        // 2. Apply circular mask if enabled
        let buffer = resized;
        if (CONFIG.circular) {
          buffer = await sharp(resized)
            .composite([{ input: circleMask, blend: 'dest-in' }])
            .png()
            .toBuffer();
        }
        
        console.log(`  ✓ ${file} → position ${index}`);
        return { input: buffer, top: y, left: x };
      } catch (error) {
        console.warn(`⚠️  Failed to process ${file}:`, error.message);
        return null;
      }
    })
  );
  
  // Filter out failed images
  const validImages = compositeImages.filter(Boolean);
  
  if (validImages.length === 0) {
    console.error('❌ No valid images to create sprite');
    return;
  }
  
  // Generate sprite image
  const spriteFilename = `testimonials-sprite.${CONFIG.format}`;
  const spritePath = path.join(CONFIG.outputDir, spriteFilename);
  
  await sharp({
    create: {
      width: spriteWidth,
      height: spriteHeight,
      channels: 4,
      background: CONFIG.background
    }
  })
    .composite(validImages)
    [CONFIG.format]({ quality: CONFIG.quality })
    .toFile(spritePath);
  
  console.log(`✅ Sprite image created: ${spriteFilename}`);
  
  // Generate JSON mapping
  const mapping = {
    sprite: `/assets/sprites/${spriteFilename}`,
    width: spriteWidth,
    height: spriteHeight,
    avatarSize: size,
    avatars: Object.fromEntries(
      files.map((file, index) => {
        const name = path.basename(file, path.extname(file));
        const slug = slugify(name);
        const x = (index % CONFIG.columns) * size;
        const y = Math.floor(index / CONFIG.columns) * size;
        return [slug, { x, y, size, original: name }];
      })
    )
  };
  
  const jsonPath = path.join(CONFIG.outputDir, 'testimonials-sprite.json');
  fs.writeFileSync(jsonPath, JSON.stringify(mapping, null, 2));
  
  console.log(`✅ Sprite mapping created: testimonials-sprite.json`);
  
  // Calculate stats
  const spriteSize = fs.statSync(spritePath).size;
  const originalSizes = files.map(f => 
    fs.statSync(path.join(CONFIG.inputDir, f)).size
  );
  const totalOriginalSize = originalSizes.reduce((sum, size) => sum + size, 0);
  
  console.log('\n📊 Statistics:');
  console.log(`   Images combined: ${files.length}`);
  console.log(`   Original total size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`   Sprite size: ${(spriteSize / 1024).toFixed(2)} KB`);
  console.log(`   Savings: ${((1 - spriteSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`   HTTP requests reduced: ${files.length} → 1`);
  
  console.log('\n✨ Sprite generation complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Import sprite JSON in your component');
  console.log('   2. Use CSS background-position to display images');
  console.log('   3. Run this script before build (add to prebuild)');
}

// Run
generateSprite().catch(error => {
  console.error('❌ Error generating sprite:', error);
  process.exit(1);
});
