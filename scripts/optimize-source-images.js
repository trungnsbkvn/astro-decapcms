/**
 * Image Optimization Script
 * 
 * Converts large PNG/JPG images to optimized WebP format
 * Reduces file size by 70-90% while maintaining visual quality
 * 
 * Usage: node scripts/optimize-source-images.js
 * 
 * Options:
 *   --dry-run    Show what would be converted without making changes
 *   --min-size   Minimum file size in MB to convert (default: 0.5)
 */

import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGES_DIR = './src/assets/images';
const MIN_SIZE_MB = parseFloat(process.argv.find(arg => arg.startsWith('--min-size='))?.split('=')[1] || '0.5');
const DRY_RUN = process.argv.includes('--dry-run');
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// WebP quality settings - balance between size and quality
const WEBP_OPTIONS = {
  quality: 82,        // Good quality, significant size reduction
  effort: 6,          // Higher effort = better compression (0-6)
  lossless: false,    // Lossy compression for photos
  nearLossless: false,
  smartSubsample: true,
};

// Maximum dimensions - resize if larger
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

async function getFilesRecursive(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFilesRecursive(fullPath));
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

async function convertImage(inputPath) {
  const stats = await stat(inputPath);
  const sizeMB = stats.size / (1024 * 1024);
  
  if (sizeMB < MIN_SIZE_MB) {
    return { skipped: true, reason: 'too small', sizeMB };
  }
  
  const ext = extname(inputPath).toLowerCase();
  const baseName = basename(inputPath, ext);
  const dir = inputPath.slice(0, -basename(inputPath).length);
  const outputPath = join(dir, `${baseName}.webp`);
  
  if (DRY_RUN) {
    return { 
      dryRun: true, 
      input: inputPath, 
      output: outputPath, 
      originalSizeMB: sizeMB 
    };
  }
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Determine if resize is needed
    let pipeline = sharp(inputPath);
    
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    
    // Convert to WebP
    await pipeline
      .webp(WEBP_OPTIONS)
      .toFile(outputPath);
    
    // Get new file size
    const newStats = await stat(outputPath);
    const newSizeMB = newStats.size / (1024 * 1024);
    const savedMB = sizeMB - newSizeMB;
    const savedPercent = ((savedMB / sizeMB) * 100).toFixed(1);
    
    // Remove original file
    await unlink(inputPath);
    
    return {
      converted: true,
      input: inputPath,
      output: outputPath,
      originalSizeMB: sizeMB.toFixed(2),
      newSizeMB: newSizeMB.toFixed(2),
      savedMB: savedMB.toFixed(2),
      savedPercent,
    };
  } catch (error) {
    return {
      error: true,
      input: inputPath,
      message: error.message,
    };
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('=============================');
  console.log(`📁 Directory: ${IMAGES_DIR}`);
  console.log(`📏 Minimum size: ${MIN_SIZE_MB} MB`);
  console.log(`🎯 Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'CONVERTING'}`);
  console.log('');
  
  const files = await getFilesRecursive(IMAGES_DIR);
  console.log(`Found ${files.length} image files\n`);
  
  let totalSaved = 0;
  let converted = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of files) {
    const result = await convertImage(file);
    
    if (result.skipped) {
      skipped++;
    } else if (result.dryRun) {
      console.log(`[DRY] ${basename(file)} (${result.originalSizeMB.toFixed(2)} MB)`);
      converted++;
    } else if (result.converted) {
      console.log(`✅ ${basename(result.input)} → ${basename(result.output)}`);
      console.log(`   ${result.originalSizeMB} MB → ${result.newSizeMB} MB (saved ${result.savedPercent}%)`);
      totalSaved += parseFloat(result.savedMB);
      converted++;
    } else if (result.error) {
      console.log(`❌ ${basename(result.input)}: ${result.message}`);
      errors++;
    }
  }
  
  console.log('\n=============================');
  console.log('📊 Summary:');
  console.log(`   Converted: ${converted}`);
  console.log(`   Skipped (< ${MIN_SIZE_MB} MB): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  if (!DRY_RUN && totalSaved > 0) {
    console.log(`   Total saved: ${totalSaved.toFixed(2)} MB`);
  }
  
  if (DRY_RUN) {
    console.log('\n⚠️  This was a dry run. Run without --dry-run to convert.');
  } else if (converted > 0) {
    console.log('\n✅ Done! Remember to update any MDX files that reference the old extensions.');
  }
}

main().catch(console.error);
