/**
 * Compare Translation Locales
 * Find missing translation keys across locale files
 * 
 * Usage: npm run i18n:compare
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const LOCALES_DIR = path.join(rootDir, 'src/i18n/locales');
const DEFAULT_LOCALE = 'vi';

/**
 * Load JSON file
 */
function loadJSON(locale) {
  const filePath = path.join(LOCALES_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Locale file not found: ${locale}.json`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Get all nested keys from an object
 */
function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse for nested objects
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Check if a value is empty
 */
function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/**
 * Get empty translations (keys with empty values)
 */
function getEmptyKeys(obj, prefix = '') {
  let emptyKeys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      emptyKeys = emptyKeys.concat(getEmptyKeys(value, fullKey));
    } else if (isEmptyValue(value)) {
      emptyKeys.push(fullKey);
    }
  }
  
  return emptyKeys;
}

/**
 * Compare locales and find differences
 */
function compareLocales() {
  console.log('\n📊 Translation Locale Comparison\n');
  console.log(`   Baseline: ${DEFAULT_LOCALE.toUpperCase()}`);
  console.log(`   Directory: ${path.relative(rootDir, LOCALES_DIR)}\n`);
  console.log('─'.repeat(60) + '\n');
  
  // Load default locale
  let defaultData;
  try {
    defaultData = loadJSON(DEFAULT_LOCALE);
  } catch (error) {
    console.error(`❌ Failed to load default locale (${DEFAULT_LOCALE}):`, error.message);
    process.exit(1);
  }
  
  const defaultKeys = getAllKeys(defaultData);
  const defaultSet = new Set(defaultKeys);
  const defaultEmpty = getEmptyKeys(defaultData);
  
  console.log(`📁 ${DEFAULT_LOCALE.toUpperCase()} (baseline):`);
  console.log(`   Total keys: ${defaultKeys.length}`);
  if (defaultEmpty.length > 0) {
    console.log(`   ⚠️  Empty values: ${defaultEmpty.length}`);
  }
  console.log();
  
  // Get all locale files except default
  const localeFiles = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .filter(l => l !== DEFAULT_LOCALE)
    .sort();
  
  if (localeFiles.length === 0) {
    console.log('⚠️  No other locale files found');
    return;
  }
  
  // Compare each locale
  const results = [];
  
  for (const locale of localeFiles) {
    console.log(`📁 ${locale.toUpperCase()}:`);
    
    try {
      const data = loadJSON(locale);
      const keys = getAllKeys(data);
      const keySet = new Set(keys);
      const emptyKeys = getEmptyKeys(data);
      
      // Find differences
      const missing = [...defaultSet].filter(k => !keySet.has(k));
      const extra = [...keySet].filter(k => !defaultSet.has(k));
      
      console.log(`   Total keys: ${keys.length}`);
      
      if (missing.length > 0) {
        console.log(`   ❌ Missing keys: ${missing.length}`);
      }
      
      if (extra.length > 0) {
        console.log(`   ℹ️  Extra keys: ${extra.length}`);
      }
      
      if (emptyKeys.length > 0) {
        console.log(`   ⚠️  Empty values: ${emptyKeys.length}`);
      }
      
      if (missing.length === 0 && extra.length === 0 && emptyKeys.length === 0) {
        console.log(`   ✅ Perfect match!`);
      }
      
      console.log();
      
      results.push({
        locale,
        totalKeys: keys.length,
        missing,
        extra,
        empty: emptyKeys,
      });
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
  
  // Detailed report
  console.log('─'.repeat(60) + '\n');
  console.log('📝 DETAILED REPORT\n');
  
  for (const result of results) {
    if (result.missing.length === 0 && result.extra.length === 0 && result.empty.length === 0) {
      continue; // Skip perfect matches
    }
    
    console.log(`\n${result.locale.toUpperCase()}:\n`);
    
    if (result.missing.length > 0) {
      console.log(`❌ Missing keys (${result.missing.length}):`);
      const displayCount = Math.min(result.missing.length, 10);
      for (let i = 0; i < displayCount; i++) {
        console.log(`   - ${result.missing[i]}`);
      }
      if (result.missing.length > 10) {
        console.log(`   ... and ${result.missing.length - 10} more`);
      }
      console.log();
    }
    
    if (result.extra.length > 0) {
      console.log(`ℹ️  Extra keys (${result.extra.length}):`);
      const displayCount = Math.min(result.extra.length, 10);
      for (let i = 0; i < displayCount; i++) {
        console.log(`   - ${result.extra[i]}`);
      }
      if (result.extra.length > 10) {
        console.log(`   ... and ${result.extra.length - 10} more`);
      }
      console.log();
    }
    
    if (result.empty.length > 0) {
      console.log(`⚠️  Empty values (${result.empty.length}):`);
      const displayCount = Math.min(result.empty.length, 10);
      for (let i = 0; i < displayCount; i++) {
        console.log(`   - ${result.empty[i]}`);
      }
      if (result.empty.length > 10) {
        console.log(`   ... and ${result.empty.length - 10} more`);
      }
      console.log();
    }
  }
  
  // Save detailed report
  const report = {
    comparedAt: new Date().toISOString(),
    baseline: DEFAULT_LOCALE,
    baselineKeys: defaultKeys.length,
    locales: results.map(r => ({
      locale: r.locale,
      totalKeys: r.totalKeys,
      missingCount: r.missing.length,
      extraCount: r.extra.length,
      emptyCount: r.empty.length,
      missingKeys: r.missing,
      extraKeys: r.extra,
      emptyKeys: r.empty,
    })),
  };
  
  const reportPath = path.join(rootDir, 'locale-comparison-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('─'.repeat(60));
  console.log(`\n📄 Detailed report saved to: locale-comparison-report.json`);
  
  // Summary
  const totalIssues = results.reduce((sum, r) => 
    sum + r.missing.length + r.extra.length + r.empty.length, 0
  );
  
  if (totalIssues === 0) {
    console.log('\n✅ All locales are in sync!');
  } else {
    console.log(`\n⚠️  Found ${totalIssues} issues across ${results.length} locales`);
    console.log('   Review and update translation files as needed.');
  }
}

// Run
try {
  compareLocales();
} catch (error) {
  console.error('\n❌ Error comparing locales:', error);
  process.exit(1);
}
