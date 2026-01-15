/**
 * Find Duplicate Images
 * Scans image directories and identifies duplicate images by comparing file hashes
 * 
 * Benefits:
 * - Identify duplicate images across directories
 * - Free up disk space
 * - Reduce build size
 * - Improve site performance
 * 
 * Usage: npm run find:duplicate-images
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const CONFIG = {
  imageDirs: [
    'src/assets/images',
    'public/images',
    'public/assets',
  ],
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'],
  outputFile: 'duplicate-images-report.json',
};

/**
 * Calculate file hash
 */
function getFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.warn(`⚠️  Error hashing file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Get file size in KB
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch {
    return 0;
  }
}

/**
 * Recursively scan directory for images
 */
function scanDirectory(dir, baseDir = dir) {
  const images = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return images;
  }
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);
      
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      
      if (entry.isDirectory()) {
        images.push(...scanDirectory(fullPath, baseDir));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (CONFIG.imageExtensions.includes(ext)) {
          images.push({
            path: relativePath,
            fullPath,
            name: entry.name,
            size: getFileSize(fullPath),
            hash: null, // Will be calculated later
          });
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Error scanning ${dir}:`, error.message);
  }
  
  return images;
}

/**
 * Find duplicate images
 */
async function findDuplicates() {
  console.log('🔍 Scanning for duplicate images...\n');
  
  // Scan all configured directories
  let allImages = [];
  for (const dir of CONFIG.imageDirs) {
    const fullDir = path.join(rootDir, dir);
    console.log(`📁 Scanning: ${dir}`);
    const images = scanDirectory(fullDir);
    allImages.push(...images);
  }
  
  console.log(`\n📊 Found ${allImages.length} images total\n`);
  
  if (allImages.length === 0) {
    console.log('✅ No images found to check');
    return;
  }
  
  // Calculate hashes
  console.log('🔐 Computing file hashes...');
  for (let i = 0; i < allImages.length; i++) {
    const image = allImages[i];
    image.hash = getFileHash(image.fullPath);
    
    // Progress indicator
    if ((i + 1) % 50 === 0 || i === allImages.length - 1) {
      process.stdout.write(`\r   Progress: ${i + 1}/${allImages.length}`);
    }
  }
  console.log('\n');
  
  // Group by hash
  const hashGroups = {};
  for (const image of allImages) {
    if (!image.hash) continue;
    
    if (!hashGroups[image.hash]) {
      hashGroups[image.hash] = [];
    }
    hashGroups[image.hash].push(image);
  }
  
  // Find duplicates (groups with more than 1 image)
  const duplicates = Object.values(hashGroups)
    .filter(group => group.length > 1)
    .map(group => ({
      files: group.map(img => ({
        path: img.path,
        name: img.name,
        size: parseFloat(img.size),
      })),
      count: group.length,
      totalSize: group.reduce((sum, img) => sum + parseFloat(img.size), 0),
      wastedSpace: group.slice(1).reduce((sum, img) => sum + parseFloat(img.size), 0),
    }))
    .sort((a, b) => b.wastedSpace - a.wastedSpace);
  
  // Display results
  if (duplicates.length === 0) {
    console.log('✅ No duplicate images found!');
    return;
  }
  
  console.log(`⚠️  Found ${duplicates.length} sets of duplicate images:\n`);
  
  let totalWasted = 0;
  for (const dup of duplicates) {
    console.log(`📦 Duplicate set (${dup.count} files, wasting ${dup.wastedSpace.toFixed(2)} KB):`);
    for (const file of dup.files) {
      console.log(`   - ${file.path} (${file.size} KB)`);
    }
    console.log('');
    totalWasted += dup.wastedSpace;
  }
  
  console.log(`💾 Total wasted space: ${totalWasted.toFixed(2)} KB (${(totalWasted / 1024).toFixed(2)} MB)`);
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalImages: allImages.length,
      duplicateSets: duplicates.length,
      totalDuplicates: duplicates.reduce((sum, dup) => sum + dup.count, 0) - duplicates.length,
      wastedSpace: {
        kb: parseFloat(totalWasted.toFixed(2)),
        mb: parseFloat((totalWasted / 1024).toFixed(2)),
      },
    },
    duplicates: duplicates.map(dup => ({
      ...dup,
      recommendation: 'Keep one file, delete others or consolidate to single location',
    })),
  };
  
  const reportPath = path.join(rootDir, CONFIG.outputFile);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${CONFIG.outputFile}`);
  console.log('\n⚠️  Important:');
  console.log('   - Review each duplicate set manually before deleting');
  console.log('   - Check if files are referenced in different contexts');
  console.log('   - Consider consolidating to a single location');
  console.log('   - Update references in code after deletion');
}

// Run
findDuplicates().catch(error => {
  console.error('❌ Error finding duplicates:', error);
  process.exit(1);
});
