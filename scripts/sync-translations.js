/**
 * Sync Translation Keys
 * Synchronizes translation keys across all locale files based on a baseline locale
 * 
 * Features:
 * - Adds missing keys from baseline to other locales
 * - Removes extra keys not in baseline
 * - Preserves existing translations
 * - Adds placeholders for missing translations
 * - Creates backup before modifying files
 * 
 * Usage: npm run i18n:sync
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const CONFIG = {
  localesDir: path.join(rootDir, 'src/i18n/locales'),
  baselineLocale: 'vi',
  backupDir: path.join(rootDir, 'backups/locales'),
  placeholder: '[NEEDS TRANSLATION]',
};

/**
 * Load JSON file
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Save JSON file with pretty formatting
 */
function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Create backup of locale file
 */
function createBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const fileName = path.basename(filePath);
  const backupPath = path.join(CONFIG.backupDir, `${timestamp}-${fileName}`);
  
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }
  
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

/**
 * Get all keys from an object recursively
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Get value from nested object using dot notation
 */
function getValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set value in nested object using dot notation
 */
function setValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Remove value from nested object using dot notation
 */
function removeValue(obj, path) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => current?.[key], obj);
  
  if (target && lastKey in target) {
    delete target[lastKey];
    return true;
  }
  return false;
}

/**
 * Sync translations
 */
async function syncTranslations() {
  console.log('🔄 Synchronizing translation keys...\n');
  
  // Check if locales directory exists
  if (!fs.existsSync(CONFIG.localesDir)) {
    console.error(`❌ Locales directory not found: ${CONFIG.localesDir}`);
    process.exit(1);
  }
  
  // Load baseline locale
  const baselinePath = path.join(CONFIG.localesDir, `${CONFIG.baselineLocale}.json`);
  if (!fs.existsSync(baselinePath)) {
    console.error(`❌ Baseline locale file not found: ${baselinePath}`);
    process.exit(1);
  }
  
  const baseline = loadJSON(baselinePath);
  if (!baseline) {
    console.error('❌ Failed to load baseline locale');
    process.exit(1);
  }
  
  const baselineKeys = getAllKeys(baseline);
  console.log(`📋 Baseline (${CONFIG.baselineLocale}): ${baselineKeys.length} keys\n`);
  
  // Get all locale files
  const localeFiles = fs.readdirSync(CONFIG.localesDir)
    .filter(f => f.endsWith('.json') && f !== `${CONFIG.baselineLocale}.json`)
    .sort();
  
  if (localeFiles.length === 0) {
    console.log('ℹ️  No other locale files found to sync');
    return;
  }
  
  let totalModified = 0;
  
  // Process each locale
  for (const file of localeFiles) {
    const localeName = path.basename(file, '.json').toUpperCase();
    const localePath = path.join(CONFIG.localesDir, file);
    
    console.log(`📁 Processing ${localeName}...`);
    
    // Load locale
    const locale = loadJSON(localePath);
    if (!locale) continue;
    
    const localeKeys = getAllKeys(locale);
    
    // Find missing and extra keys
    const missingKeys = baselineKeys.filter(key => !localeKeys.includes(key));
    const extraKeys = localeKeys.filter(key => !baselineKeys.includes(key));
    
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(`   ✅ Already in sync (${localeKeys.length} keys)\n`);
      continue;
    }
    
    // Create backup
    const backupPath = createBackup(localePath);
    console.log(`   💾 Backup created: ${path.relative(rootDir, backupPath)}`);
    
    // Add missing keys
    if (missingKeys.length > 0) {
      console.log(`   ➕ Adding ${missingKeys.length} missing keys...`);
      for (const key of missingKeys) {
        const baselineValue = getValue(baseline, key);
        // Use baseline value with placeholder prefix if it's a string
        const value = typeof baselineValue === 'string' 
          ? `${CONFIG.placeholder} ${baselineValue}`
          : baselineValue;
        setValue(locale, key, value);
      }
    }
    
    // Remove extra keys
    if (extraKeys.length > 0) {
      console.log(`   ➖ Removing ${extraKeys.length} extra keys...`);
      for (const key of extraKeys) {
        removeValue(locale, key);
      }
    }
    
    // Save updated locale
    if (saveJSON(localePath, locale)) {
      console.log(`   ✅ Updated successfully`);
      totalModified++;
    } else {
      console.log(`   ❌ Failed to update`);
    }
    
    console.log('');
  }
  
  console.log('📊 Summary:');
  console.log(`   Processed: ${localeFiles.length} locales`);
  console.log(`   Modified: ${totalModified} files`);
  console.log(`   Baseline keys: ${baselineKeys.length}`);
  
  if (totalModified > 0) {
    console.log('\n✨ Synchronization complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review files with [NEEDS TRANSLATION] placeholders');
    console.log('   2. Replace placeholders with actual translations');
    console.log('   3. Run "npm run i18n:compare" to verify');
    console.log(`   4. Backups saved in: ${path.relative(rootDir, CONFIG.backupDir)}`);
  } else {
    console.log('\n✅ All locales are already in sync!');
  }
}

// Run
syncTranslations().catch(error => {
  console.error('❌ Error syncing translations:', error);
  process.exit(1);
});
