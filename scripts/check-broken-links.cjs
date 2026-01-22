/**
 * Script to check for broken links in MDX files
 * Checks URLs for HTTP errors (404, 5xx, etc.)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');
const TIMEOUT = 10000; // 10 seconds timeout
const CONCURRENT_REQUESTS = 10;
const DELAY_BETWEEN_BATCHES = 1000; // 1 second between batches

// URL regex pattern
const URL_PATTERN = /https?:\/\/[^\s\)\]"'<>]+/g;

// Skip checking these domains (Google Maps short links, social media, etc.)
const SKIP_DOMAINS = [
  'maps.app.goo.gl',
  'goo.gl',
  'g.co',
  'share.google',
  'facebook.com',
  'zalo.me',
  'youtube.com',
  'youtu.be',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'instagram.com',
];

/**
 * Recursively find all MDX files
 */
function findMdxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract URLs from file content
 */
function extractUrls(content) {
  const matches = content.match(URL_PATTERN) || [];
  return matches.map(url => url.replace(/[,.]$/, '')); // Remove trailing comma or period
}

/**
 * Check if URL should be skipped
 */
function shouldSkipUrl(url) {
  try {
    const urlObj = new URL(url);
    return SKIP_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return true; // Skip invalid URLs
  }
}

/**
 * Check a single URL
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        method: 'HEAD', // Use HEAD to avoid downloading full content
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        timeout: TIMEOUT,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      };

      const req = protocol.request(options, (res) => {
        const elapsed = Date.now() - startTime;
        resolve({
          url,
          status: res.statusCode,
          elapsed,
          error: null,
        });
      });

      req.on('error', (err) => {
        resolve({
          url,
          status: null,
          elapsed: Date.now() - startTime,
          error: err.message,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: null,
          elapsed: TIMEOUT,
          error: 'TIMEOUT',
        });
      });

      req.end();
    } catch (err) {
      resolve({
        url,
        status: null,
        elapsed: 0,
        error: err.message,
      });
    }
  });
}

/**
 * Process URLs in batches
 */
async function checkUrlsInBatches(urls) {
  const results = [];
  
  for (let i = 0; i < urls.length; i += CONCURRENT_REQUESTS) {
    const batch = urls.slice(i, i + CONCURRENT_REQUESTS);
    const batchNum = Math.floor(i / CONCURRENT_REQUESTS) + 1;
    const totalBatches = Math.ceil(urls.length / CONCURRENT_REQUESTS);
    
    console.log(`Checking batch ${batchNum}/${totalBatches} (${batch.length} URLs)...`);
    
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    
    // Small delay between batches to avoid rate limiting
    if (i + CONCURRENT_REQUESTS < urls.length) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
    }
  }
  
  return results;
}

/**
 * Main function
 */
async function main() {
  console.log('=== Broken Link Checker ===\n');
  
  // Find all MDX files
  console.log('Scanning MDX files...');
  const mdxFiles = findMdxFiles(CONTENT_DIR);
  console.log(`Found ${mdxFiles.length} MDX files\n`);
  
  // Extract URLs from files
  const urlToFiles = new Map(); // URL -> list of files containing it
  
  for (const file of mdxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const urls = extractUrls(content);
    const relativePath = path.relative(CONTENT_DIR, file);
    
    for (const url of urls) {
      if (!urlToFiles.has(url)) {
        urlToFiles.set(url, []);
      }
      if (!urlToFiles.get(url).includes(relativePath)) {
        urlToFiles.get(url).push(relativePath);
      }
    }
  }
  
  console.log(`Found ${urlToFiles.size} unique URLs\n`);
  
  // Filter URLs to check
  const urlsToCheck = [];
  const skippedUrls = [];
  
  for (const url of urlToFiles.keys()) {
    if (shouldSkipUrl(url)) {
      skippedUrls.push(url);
    } else {
      urlsToCheck.push(url);
    }
  }
  
  console.log(`URLs to check: ${urlsToCheck.length}`);
  console.log(`Skipped URLs (maps/social): ${skippedUrls.length}\n`);
  
  // Check URLs
  console.log('Checking URLs for errors...\n');
  const results = await checkUrlsInBatches(urlsToCheck);
  
  // Categorize results
  const errors = {
    '4xx': [],
    '5xx': [],
    'timeout': [],
    'network': [],
    'redirect': [],
  };
  
  const successCount = { count: 0 };
  
  for (const result of results) {
    if (result.error === 'TIMEOUT') {
      errors.timeout.push({ ...result, files: urlToFiles.get(result.url) });
    } else if (result.error) {
      errors.network.push({ ...result, files: urlToFiles.get(result.url) });
    } else if (result.status >= 500) {
      errors['5xx'].push({ ...result, files: urlToFiles.get(result.url) });
    } else if (result.status >= 400) {
      errors['4xx'].push({ ...result, files: urlToFiles.get(result.url) });
    } else if (result.status >= 300 && result.status < 400) {
      errors.redirect.push({ ...result, files: urlToFiles.get(result.url) });
    } else {
      successCount.count++;
    }
  }
  
  // Report
  console.log('\n=== RESULTS ===\n');
  console.log(`✅ Successful (2xx): ${successCount.count}`);
  console.log(`🔀 Redirects (3xx): ${errors.redirect.length}`);
  console.log(`❌ Client Errors (4xx): ${errors['4xx'].length}`);
  console.log(`💥 Server Errors (5xx): ${errors['5xx'].length}`);
  console.log(`⏱️  Timeouts: ${errors.timeout.length}`);
  console.log(`🌐 Network Errors: ${errors.network.length}`);
  
  // Report broken links
  if (errors['4xx'].length > 0) {
    console.log('\n=== 4xx ERRORS (Not Found, etc.) ===\n');
    for (const err of errors['4xx']) {
      console.log(`[${err.status}] ${err.url}`);
      console.log(`    Files: ${err.files.join(', ')}`);
    }
  }
  
  if (errors['5xx'].length > 0) {
    console.log('\n=== 5xx ERRORS (Server Errors) ===\n');
    for (const err of errors['5xx']) {
      console.log(`[${err.status}] ${err.url}`);
      console.log(`    Files: ${err.files.join(', ')}`);
    }
  }
  
  if (errors.timeout.length > 0) {
    console.log('\n=== TIMEOUTS ===\n');
    for (const err of errors.timeout) {
      console.log(`${err.url}`);
      console.log(`    Files: ${err.files.join(', ')}`);
    }
  }
  
  if (errors.network.length > 0) {
    console.log('\n=== NETWORK ERRORS ===\n');
    for (const err of errors.network) {
      console.log(`[${err.error}] ${err.url}`);
      console.log(`    Files: ${err.files.join(', ')}`);
    }
  }
  
  // Save report to file
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalUrls: urlToFiles.size,
      checkedUrls: urlsToCheck.length,
      skippedUrls: skippedUrls.length,
      successful: successCount.count,
      redirects: errors.redirect.length,
      clientErrors: errors['4xx'].length,
      serverErrors: errors['5xx'].length,
      timeouts: errors.timeout.length,
      networkErrors: errors.network.length,
    },
    errors,
  };
  
  const reportPath = path.join(__dirname, 'broken-links-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
}

main().catch(console.error);
