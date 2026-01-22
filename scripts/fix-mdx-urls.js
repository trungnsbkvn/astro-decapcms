/**
 * Fix MDX Image URLs Script
 * 
 * Updates image references in MDX/MD files from .jpg/.png/.jpeg to .webp
 * after running the optimize-source-images.js script
 * 
 * Usage: node scripts/fix-mdx-urls.js
 * 
 * Options:
 *   --dry-run    Show what would be changed without making changes
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, extname } from 'path';

const CONTENT_DIRS = [
  './src/content',
  './src/pages',
];

const DRY_RUN = process.argv.includes('--dry-run');

// Extensions to replace (case insensitive)
const OLD_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function getFilesRecursive(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await getFilesRecursive(fullPath));
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (['.md', '.mdx', '.astro'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist, skip
  }
  
  return files;
}

function replaceImageExtensions(content) {
  let newContent = content;
  let changes = [];
  
  // Pattern to match image references in various formats:
  // 1. Markdown: ![alt](path.jpg)
  // 2. MDX/JSX: src="path.jpg" or src={...path.jpg...}
  // 3. Frontmatter: image: ~/assets/images/path.jpg
  // 4. import statements: import img from '~/assets/images/path.jpg'
  
  for (const oldExt of OLD_EXTENSIONS) {
    // Match various image reference patterns
    const patterns = [
      // Markdown image syntax
      new RegExp(`(\\!\\[[^\\]]*\\]\\([^)]+)${oldExt.replace('.', '\\.')}(\\))`, 'gi'),
      // src attribute (JSX/HTML)
      new RegExp(`(src=["'][^"']+)${oldExt.replace('.', '\\.')}(["'])`, 'gi'),
      // import statements
      new RegExp(`(from\\s+["'][^"']+)${oldExt.replace('.', '\\.')}(["'])`, 'gi'),
      // Frontmatter image field
      new RegExp(`(image:\\s*[~./][^\\s]+)${oldExt.replace('.', '\\.')}(\\s|$)`, 'gim'),
      // Generic path ending with extension (in quotes)
      new RegExp(`(["'][^"']*\\/[^"'/]+)${oldExt.replace('.', '\\.')}(["'])`, 'gi'),
    ];
    
    for (const pattern of patterns) {
      const matches = newContent.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (!changes.includes(match)) {
            changes.push(match);
          }
        }
        newContent = newContent.replace(pattern, '$1.webp$2');
      }
    }
  }
  
  return { newContent, changes };
}

async function processFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const { newContent, changes } = replaceImageExtensions(content);
  
  if (changes.length === 0) {
    return { file: filePath, changed: false };
  }
  
  if (!DRY_RUN) {
    await writeFile(filePath, newContent, 'utf-8');
  }
  
  return { file: filePath, changed: true, changes };
}

async function main() {
  console.log('🔄 Fix MDX Image URLs');
  console.log('=====================');
  console.log(`🎯 Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'UPDATING FILES'}`);
  console.log('');
  
  let allFiles = [];
  for (const dir of CONTENT_DIRS) {
    const files = await getFilesRecursive(dir);
    allFiles.push(...files);
  }
  
  console.log(`Found ${allFiles.length} content files\n`);
  
  let changedCount = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await processFile(file);
    
    if (result.changed) {
      changedCount++;
      totalChanges += result.changes.length;
      console.log(`${DRY_RUN ? '[DRY]' : '✅'} ${file}`);
      for (const change of result.changes) {
        console.log(`   ${change.substring(0, 80)}${change.length > 80 ? '...' : ''}`);
      }
    }
  }
  
  console.log('\n=====================');
  console.log('📊 Summary:');
  console.log(`   Files changed: ${changedCount}`);
  console.log(`   Total replacements: ${totalChanges}`);
  
  if (DRY_RUN) {
    console.log('\n⚠️  This was a dry run. Run without --dry-run to apply changes.');
  } else if (changedCount > 0) {
    console.log('\n✅ Done! All image references updated to .webp');
  } else {
    console.log('\n✅ No changes needed - all references already use .webp');
  }
}

main().catch(console.error);
