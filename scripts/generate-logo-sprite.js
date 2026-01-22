/**
 * Generate CSS Sprite for Partner/Client Logos
 * Combines multiple logo images into a single sprite for better performance
 * 
 * Benefits:
 * - Reduces HTTP requests (e.g., 30 logos → 1 sprite)
 * - Better compression when images are combined
 * - Faster page load for partner sections
 * 
 * Usage: npm run sprite:logos
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const CONFIG = {
  inputDir: path.join(rootDir, 'src/assets/images/partners'),
  outputDir: path.join(rootDir, 'public/assets/sprites'),
  imageWidth: 120,      // Standard width for logos
  imageHeight: 48,      // Standard height for logos
  columns: 8,           // Grid layout: 8 columns
  format: 'webp',       // WebP for best compression
  quality: 90,          // Higher quality for logos (text clarity)
  background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background (fixes JPG black bg issue)
  padding: 4,           // Padding around each logo
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
  console.log('🎨 Generating partner logos sprite...\n');
  
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
      sprite: '/assets/sprites/logos-sprite.webp',
      width: (CONFIG.imageWidth + CONFIG.padding * 2) * 2,
      height: CONFIG.imageHeight + CONFIG.padding * 2,
      imageWidth: CONFIG.imageWidth,
      imageHeight: CONFIG.imageHeight,
      padding: CONFIG.padding,
      images: {
        'example-logo-1': { x: CONFIG.padding, y: CONFIG.padding },
        'example-logo-2': { x: CONFIG.imageWidth + CONFIG.padding * 3, y: CONFIG.padding },
      }
    };
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, 'logos-sprite.json'),
      JSON.stringify(testSprite, null, 2)
    );
    
    console.log('✅ Example sprite JSON created');
    return;
  }
  
  // Get all image files
  const files = fs.readdirSync(CONFIG.inputDir)
    .filter(f => /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(f))
    .sort();
  
  if (files.length === 0) {
    console.warn('⚠️  No logo images found in input directory');
    return;
  }
  
  console.log(`📁 Found ${files.length} logos`);
  
  // Calculate sprite dimensions with padding
  const totalImages = files.length;
  const rows = Math.ceil(totalImages / CONFIG.columns);
  const cellWidth = CONFIG.imageWidth + (CONFIG.padding * 2);
  const cellHeight = CONFIG.imageHeight + (CONFIG.padding * 2);
  const spriteWidth = CONFIG.columns * cellWidth;
  const spriteHeight = rows * cellHeight;
  
  console.log(`📐 Sprite dimensions: ${spriteWidth}x${spriteHeight}px`);
  console.log(`📊 Grid: ${CONFIG.columns} columns × ${rows} rows\n`);
  
  // Process each image and create composite array
  const compositeImages = await Promise.all(
    files.map(async (file, index) => {
      const col = index % CONFIG.columns;
      const row = Math.floor(index / CONFIG.columns);
      const x = col * cellWidth + CONFIG.padding;
      const y = row * cellHeight + CONFIG.padding;
      
      try {
        const inputPath = path.join(CONFIG.inputDir, file);
        
        // Handle SVG files differently
        if (file.toLowerCase().endsWith('.svg')) {
          console.log(`ℹ️  Skipping SVG: ${file} (SVG not supported in sprites)`);
          return null;
        }
        
        const buffer = await sharp(inputPath)
          .resize(CONFIG.imageWidth, CONFIG.imageHeight, { 
            fit: 'contain',
            background: CONFIG.background
          })
          .toBuffer();
        
        return { input: buffer, top: y, left: x };
      } catch (error) {
        console.warn(`⚠️  Failed to process ${file}:`, error.message);
        return null;
      }
    })
  );
  
  // Filter out failed images and SVGs
  const validImages = compositeImages.filter(Boolean);
  
  if (validImages.length === 0) {
    console.error('❌ No valid images to create sprite');
    return;
  }
  
  // Generate sprite image
  const spriteFilename = `logos-sprite.${CONFIG.format}`;
  const spritePath = path.join(CONFIG.outputDir, spriteFilename);
  
  const sharpInstance = sharp({
    create: {
      width: spriteWidth,
      height: spriteHeight,
      channels: 4,
      background: CONFIG.background
    }
  }).composite(validImages);

  await sharpInstance[CONFIG.format]({ quality: CONFIG.quality }).toFile(spritePath);
  
  console.log(`✅ Sprite image created: ${spriteFilename}`);
  
  // Generate JSON mapping
  const mapping = {
    sprite: `/assets/sprites/${spriteFilename}`,
    width: spriteWidth,
    height: spriteHeight,
    imageWidth: CONFIG.imageWidth,
    imageHeight: CONFIG.imageHeight,
    padding: CONFIG.padding,
    images: Object.fromEntries(
      files
        .filter(f => !f.toLowerCase().endsWith('.svg'))
        .map((file, index) => {
          const name = path.basename(file, path.extname(file));
          const slug = slugify(name);
          const col = index % CONFIG.columns;
          const row = Math.floor(index / CONFIG.columns);
          const x = col * cellWidth + CONFIG.padding;
          const y = row * cellHeight + CONFIG.padding;
          return [slug, { x, y, original: name }];
        })
    )
  };
  
  const jsonPath = path.join(CONFIG.outputDir, 'logos-sprite.json');
  fs.writeFileSync(jsonPath, JSON.stringify(mapping, null, 2));
  
  console.log(`✅ Sprite mapping created: logos-sprite.json`);
  
  // Calculate stats
  const spriteSize = fs.statSync(spritePath).size;
  const originalSizes = files
    .filter(f => !f.toLowerCase().endsWith('.svg'))
    .map(f => fs.statSync(path.join(CONFIG.inputDir, f)).size);
  const totalOriginalSize = originalSizes.reduce((sum, size) => sum + size, 0);
  
  console.log('\n📊 Statistics:');
  console.log(`   Logos combined: ${validImages.length}`);
  console.log(`   Original total size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`   Sprite size: ${(spriteSize / 1024).toFixed(2)} KB`);
  console.log(`   Savings: ${((1 - spriteSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`   HTTP requests reduced: ${validImages.length} → 1`);
  
  console.log('\n✨ Logo sprite generation complete!');
  console.log('\n📝 Usage example:');
  console.log('   import spriteData from "/assets/sprites/logos-sprite.json";');
  console.log('   const logo = spriteData.images["company-name"];');
  console.log('   style={`background: url(${spriteData.sprite}) -${logo.x}px -${logo.y}px`}');
}

// Run
generateSprite().catch(error => {
  console.error('❌ Error generating logo sprite:', error);
  process.exit(1);
});
