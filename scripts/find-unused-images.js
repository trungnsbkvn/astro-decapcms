/**
 * Find Unused Images in Project
 * Scans image directories and checks if they're referenced in code
 * 
 * Usage: npm run find:unused-images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  // Image directories to check
  imageDirs: [
    'src/assets/images',
    'public/images',
    'public/assets',
  ],
  
  // File extensions to scan for references
  codeExts: ['.astro', '.ts', '.tsx', '.jsx', '.js', '.md', '.mdx', '.yml', '.yaml'],
  
  // Directories to scan for code
  codeDirs: ['src', 'public/admin'],
  
  // Image extensions
  imageExts: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif', '.jfif'],
};

/**
 * Recursively get all files with specific extensions
 */
function getAllFiles(dir, exts = null) {
  if (!fs.existsSync(dir)) return [];
  
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    // Skip node_modules and other build artifacts
    if (item.isDirectory()) {
      if (['node_modules', '.astro', 'dist', '.git'].includes(item.name)) {
        continue;
      }
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (!exts || exts.some(ext => item.name.toLowerCase().endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract filename patterns that might be referenced
 */
function getImagePatterns(imagePath) {
  const filename = path.basename(imagePath);
  const nameWithoutExt = path.basename(imagePath, path.extname(imagePath));
  const relative = path.relative(rootDir, imagePath).replace(/\\/g, '/');
  
  return [
    filename,           // logo.png
    nameWithoutExt,     // logo
    relative,           // public/images/logo.png
    relative.replace(/^public\//, '/'), // /images/logo.png
  ];
}

/**
 * Main function to find unused images
 */
function findUnusedImages() {
  console.log('🔍 Scanning for unused images...\n');
  
  // Get all images
  const allImages = CONFIG.imageDirs.flatMap(dir => {
    const fullDir = path.join(rootDir, dir);
    return getAllFiles(fullDir, CONFIG.imageExts);
  });
  
  console.log(`📁 Found ${allImages.length} images in ${CONFIG.imageDirs.length} directories\n`);
  
  if (allImages.length === 0) {
    console.log('✅ No images to check');
    return;
  }
  
  // Get all code files
  const codeFiles = CONFIG.codeDirs.flatMap(dir => {
    const fullDir = path.join(rootDir, dir);
    return getAllFiles(fullDir, CONFIG.codeExts);
  });
  
  console.log(`📄 Scanning ${codeFiles.length} code files...\n`);
  
  // Read all code into one string for faster searching
  const codeContent = codeFiles
    .map(f => {
      try {
        return fs.readFileSync(f, 'utf-8');
      } catch (error) {
        console.warn(`⚠️  Could not read ${f}`);
        return '';
      }
    })
    .join('\n')
    .toLowerCase(); // Case-insensitive search
  
  // Check each image
  const unusedImages = [];
  const usedImages = [];
  
  for (const imagePath of allImages) {
    const patterns = getImagePatterns(imagePath);
    const isUsed = patterns.some(pattern => 
      codeContent.includes(pattern.toLowerCase())
    );
    
    if (isUsed) {
      usedImages.push(imagePath);
    } else {
      unusedImages.push(imagePath);
    }
  }
  
  // Report
  console.log('📊 Results:\n');
  console.log(`   ✅ Used images: ${usedImages.length}`);
  console.log(`   ⚠️  Potentially unused: ${unusedImages.length}\n`);
  
  if (unusedImages.length === 0) {
    console.log('✅ All images appear to be in use!');
    return;
  }
  
  // List unused images
  console.log('⚠️  Potentially unused images:\n');
  
  // Group by directory
  const byDirectory = {};
  for (const img of unusedImages) {
    const dir = path.dirname(path.relative(rootDir, img));
    if (!byDirectory[dir]) byDirectory[dir] = [];
    byDirectory[dir].push(img);
  }
  
  for (const [dir, images] of Object.entries(byDirectory)) {
    console.log(`\n📁 ${dir}/`);
    for (const img of images) {
      const size = (fs.statSync(img).size / 1024).toFixed(2);
      const filename = path.basename(img);
      console.log(`   - ${filename} (${size} KB)`);
    }
  }
  
  // Calculate total size
  const totalSize = unusedImages.reduce((sum, img) => 
    sum + fs.statSync(img).size, 0
  );
  
  console.log(`\n💾 Total size of unused images: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);
  
  // Save report
  const report = {
    scannedAt: new Date().toISOString(),
    totalImages: allImages.length,
    usedImages: usedImages.length,
    unusedImages: unusedImages.length,
    unusedImagesList: unusedImages.map(img => ({
      path: path.relative(rootDir, img).replace(/\\/g, '/'),
      size: fs.statSync(img).size,
      sizeKB: (fs.statSync(img).size / 1024).toFixed(2),
    })),
    totalSizeBytes: totalSize,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
  };
  
  const reportPath = path.join(rootDir, 'unused-images-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📄 Detailed report saved to: unused-images-report.json`);
  console.log('\n⚠️  Note: This is a heuristic scan. Verify before deleting!');
  console.log('   Some images may be:');
  console.log('   - Referenced dynamically');
  console.log('   - Used in CMS content');
  console.log('   - Required for future use');
}

// Run
try {
  findUnusedImages();
} catch (error) {
  console.error('❌ Error scanning for unused images:', error);
  process.exit(1);
}
