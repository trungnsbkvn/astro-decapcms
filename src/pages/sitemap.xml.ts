/**
 * Custom Sitemap for SSR mode
 * @astrojs/sitemap only includes prerendered pages
 * This endpoint generates a complete sitemap including SSR single post pages
 */
import { SITE } from 'astrowind:config';
import { getCollection } from 'astro:content';
import { fetchPostsFromAllTypes, findAllPostsByAuthorAndTypes } from '~/utils/blog';
import { getRootPathForType, BLOG_TYPES } from '~/utils/blog-permalinks';
import { AUTHORS } from '~/utils/authors';

export const prerender = true;

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Helper to clean slug from title/name
function cleanSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const GET = async () => {
  const siteUrl = (SITE.site || import.meta.env.SITE || 'https://yplawfirm.vn').replace(/\/$/, '');
  
  const urls: string[] = [];

  // Fetch all posts first (needed for pagination calculation)
  const types = ['post', 'consultation', 'evaluation', 'foreigner', 'labor', 'legal'];
  const posts = await fetchPostsFromAllTypes(types);

  // Static pages - Core site pages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'gioi-thieu', priority: '0.8', changefreq: 'monthly' },
    { path: 'dich-vu', priority: '0.8', changefreq: 'monthly' },
    { path: 'lien-he', priority: '0.7', changefreq: 'monthly' },
    { path: 'luat-su-va-cong-su', priority: '0.8', changefreq: 'weekly' },
    { path: 'privacy', priority: '0.3', changefreq: 'yearly' },
    { path: 'terms', priority: '0.3', changefreq: 'yearly' },
  ];

  for (const { path, priority, changefreq } of staticPages) {
    const loc = path ? `${siteUrl}/${path}` : siteUrl;
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  // Blog listing pages (index pages for each content type) + pagination
  const blogTypesConfig = [
    { path: 'tin-tuc', priority: '0.8', type: 'post' },
    { path: 'phap-ly', priority: '0.8', type: 'legal' },
    { path: 'lao-dong', priority: '0.8', type: 'labor' },
    { path: 'tu-van-thuong-xuyen', priority: '0.8', type: 'consultation' },
    { path: 'dau-tu-nuoc-ngoai', priority: '0.8', type: 'foreigner' },
    { path: 'dich-vu-danh-gia', priority: '0.8', type: 'evaluation' },
  ];

  const POSTS_PER_PAGE = 12; // Should match config

  for (const { path, priority, type } of blogTypesConfig) {
    // Index page
    urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/${path}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`);

    // Count posts for this type to calculate pagination
    const typePosts = posts.filter(p => p.type === type);
    const totalPages = Math.ceil(typePosts.length / POSTS_PER_PAGE);
    
    // Add pagination pages (page 2, 3, etc.) - included for crawl discovery
    // noindex is set in page metadata, but sitemap helps Google find all posts
    for (let page = 2; page <= totalPages; page++) {
      urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/${path}/${page}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.3</priority>
  </url>`);
    }
  }

  // All blog posts (SSR pages) - already fetched above
  for (const post of posts) {
    const rootPath = getRootPathForType(post.type || 'post');
    const loc = `${siteUrl}${rootPath}/${post.permalink}`;
    const lastmod = formatDate(post.updateDate || post.publishDate);
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Attorney profile pages - dynamically from collection
  const attorneys = await getCollection('attorney').catch(() => []);
  for (const attorney of attorneys) {
    if (attorney.data.draft) continue;
    const slug = cleanSlug(attorney.data.name);
    urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/tac-gia/${slug}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Author posts pages (only for authors with posts)
  for (const [slug, authorInfo] of Object.entries(AUTHORS)) {
    const authorPosts = await findAllPostsByAuthorAndTypes(authorInfo.name, BLOG_TYPES);
    if (authorPosts.length > 0) {
      urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/tac-gia/${slug}/bai-viet`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`);
    }
  }

  // Tag pages - NOT included in sitemap (index: false in config)
  // Tags are noindex, so they shouldn't be in sitemap to avoid mixed signals to search engines

  // Category pages - collect all unique categories from posts
  const categoriesMap = new Map<string, { slug: string; title: string; type: string }>();
  for (const post of posts) {
    const postType = post.type || 'post';
    if (post.category?.slug && !categoriesMap.has(`${postType}-${post.category.slug}`)) {
      categoriesMap.set(`${postType}-${post.category.slug}`, { ...post.category, type: postType });
    }
  }

  // Root paths for category URLs
  const categoryRootPaths: Record<string, string> = {
    post: '/tin-tuc',
    legal: '/phap-ly',
    labor: '/lao-dong',
    consultation: '/tu-van-thuong-xuyen',
    foreigner: '/dau-tu-nuoc-ngoai',
    evaluation: '/dich-vu-danh-gia',
  };

  for (const [, category] of categoriesMap) {
    const rootPath = categoryRootPaths[category.type] || '/tin-tuc';
    urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}${rootPath}/${category.slug}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
