/**
 * Compress Large Source Images Script
 * 
 * Resizes and compresses large JPG/PNG images in place
 * Keeps the same format (JPG/PNG), only reduces file size
 * Astro will then convert to WebP/AVIF at build time
 * 
 * Usage: node scripts/compress-large-images.js
 * 
 * Options:
 *   --dry-run    Show what would be compressed without making changes
 *   --min-size   Minimum file size in MB to process (default: 2)
 */

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const IMAGES_DIR = './src/assets/images';
const MIN_SIZE_MB = parseFloat(process.argv.find(arg => arg.startsWith('--min-size='))?.split('=')[1] || '2');
const DRY_RUN = process.argv.includes('--dry-run');
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Maximum dimensions - resize if larger (typical HD resolution)
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 1600;

// JPEG quality
const JPEG_QUALITY = 85;

// PNG compression
const PNG_COMPRESSION = 9;

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

async function compressImage(inputPath) {
  const stats = await stat(inputPath);
  const sizeMB = stats.size / (1024 * 1024);
  
  if (sizeMB < MIN_SIZE_MB) {
    return { skipped: true, reason: 'too small', sizeMB };
  }
  
  const ext = extname(inputPath).toLowerCase();
  const dir = dirname(inputPath);
  const baseName = basename(inputPath);
  const tempPath = join(dir, `_temp_${baseName}`);
  
  if (DRY_RUN) {
    // Get metadata to show dimensions
    const metadata = await sharp(inputPath).metadata();
    return { 
      dryRun: true, 
      input: inputPath, 
      originalSizeMB: sizeMB,
      width: metadata.width,
      height: metadata.height,
      needsResize: metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT
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
    
    // Apply format-specific compression
    if (ext === '.png') {
      pipeline = pipeline.png({ 
        compressionLevel: PNG_COMPRESSION,
        adaptiveFiltering: true,
        palette: false // Keep full color
      });
    } else {
      // JPG/JPEG
      pipeline = pipeline.jpeg({ 
        quality: JPEG_QUALITY,
        mozjpeg: true // Use mozjpeg for better compression
      });
    }
    
    // Save to temp file
    await pipeline.toFile(tempPath);
    
    // Get new file size
    const newStats = await stat(tempPath);
    const newSizeMB = newStats.size / (1024 * 1024);
    
    // Only replace if we actually reduced the size
    if (newSizeMB < sizeMB) {
      await unlink(inputPath);
      await rename(tempPath, inputPath);
      
      const savedMB = sizeMB - newSizeMB;
      const savedPercent = ((savedMB / sizeMB) * 100).toFixed(1);
      
      return {
        compressed: true,
        input: inputPath,
        originalSizeMB: sizeMB.toFixed(2),
        newSizeMB: newSizeMB.toFixed(2),
        savedMB: savedMB.toFixed(2),
        savedPercent,
        wasResized: metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT,
      };
    } else {
      // Cleanup temp file if no size reduction
      await unlink(tempPath);
      return {
        skipped: true,
        reason: 'no size reduction',
        input: inputPath,
        sizeMB: sizeMB.toFixed(2)
      };
    }
  } catch (error) {
    // Cleanup temp file on error
    try { await unlink(tempPath); } catch {}
    return {
      error: true,
      input: inputPath,
      message: error.message,
    };
  }
}

async function main() {
  console.log('🖼️  Compress Large Images Script');
  console.log('================================');
  console.log(`📁 Directory: ${IMAGES_DIR}`);
  console.log(`📏 Minimum size: ${MIN_SIZE_MB} MB`);
  console.log(`📐 Max dimensions: ${MAX_WIDTH}x${MAX_HEIGHT}`);
  console.log(`🎯 Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'COMPRESSING'}`);
  console.log('');
  
  const files = await getFilesRecursive(IMAGES_DIR);
  console.log(`Found ${files.length} image files\n`);
  
  let totalSaved = 0;
  let compressed = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of files) {
    const result = await compressImage(file);
    
    if (result.skipped) {
      if (result.reason === 'too small') {
        skipped++;
      } else {
        console.log(`⏭️  ${basename(result.input)} - ${result.reason}`);
        skipped++;
      }
    } else if (result.dryRun) {
      const resize = result.needsResize ? ` [needs resize: ${result.width}x${result.height}]` : '';
      console.log(`[DRY] ${basename(file)} (${result.originalSizeMB.toFixed(2)} MB)${resize}`);
      compressed++;
    } else if (result.compressed) {
      const resizeNote = result.wasResized ? ' (resized)' : '';
      console.log(`✅ ${basename(result.input)}${resizeNote}`);
      console.log(`   ${result.originalSizeMB} MB → ${result.newSizeMB} MB (saved ${result.savedPercent}%)`);
      totalSaved += parseFloat(result.savedMB);
      compressed++;
    } else if (result.error) {
      console.log(`❌ ${basename(result.input)}: ${result.message}`);
      errors++;
    }
  }
  
  console.log('\n================================');
  console.log('📊 Summary:');
  console.log(`   Compressed: ${compressed}`);
  console.log(`   Skipped (< ${MIN_SIZE_MB} MB): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  if (!DRY_RUN && totalSaved > 0) {
    console.log(`   Total saved: ${totalSaved.toFixed(2)} MB`);
  }
  
  if (DRY_RUN) {
    console.log('\n⚠️  This was a dry run. Run without --dry-run to compress.');
  } else if (compressed > 0) {
    console.log('\n✅ Done! Images compressed in place. No MDX changes needed.');
    console.log('   Astro will convert to WebP/AVIF at build time.');
  }
}

main().catch(console.error);
