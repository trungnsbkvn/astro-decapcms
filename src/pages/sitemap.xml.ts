/**
 * Custom Sitemap for SSR mode
 * @astrojs/sitemap only includes prerendered pages
 * This endpoint generates a complete sitemap including SSR single post pages
 */
import { SITE, APP_BLOG, APP_LEGAL, APP_LABOR, APP_CONSULTATION, APP_FOREIGNER, APP_EVALUATION } from 'astrowind:config';
import { getCollection } from 'astro:content';
import { fetchPostsFromAllTypes, findAllPostsByAuthorAndTypes, getPaginatedPostsByAuthor } from '~/utils/blog';
import { getRootPathForType, BLOG_TYPES } from '~/utils/blog-permalinks';
import { AUTHORS } from '~/utils/authors';
import { getAttorneySlug } from '~/utils/attorneys';

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

/** Get postsPerPage config by blog type */
const getPostsPerPageByType = (type: string): number => {
  switch (type) {
    case 'post':
      return APP_BLOG?.postsPerPage || 12;
    case 'legal':
      return APP_LEGAL?.postsPerPage || 12;
    case 'labor':
      return APP_LABOR?.postsPerPage || 12;
    case 'consultation':
      return APP_CONSULTATION?.postsPerPage || 12;
    case 'foreigner':
      return APP_FOREIGNER?.postsPerPage || 12;
    case 'evaluation':
      return APP_EVALUATION?.postsPerPage || 12;
    default:
      return APP_BLOG?.postsPerPage || 12;
  }
};

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

  for (const { path, priority, type } of blogTypesConfig) {
    const postsPerPage = getPostsPerPageByType(type);
    
    // Index page
    urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/${path}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`);

    // Count posts for this type to calculate pagination
    const typePosts = posts.filter(p => p.type === type);
    const totalPages = Math.ceil(typePosts.length / postsPerPage);
    
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
    const slug = getAttorneySlug(attorney);
    urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/tac-gia/${slug}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // Author posts pages (only for authors with posts) + pagination
  const AUTHOR_POSTS_PER_PAGE = 12;
  for (const [slug, authorInfo] of Object.entries(AUTHORS)) {
    const { totalPages, total } = await getPaginatedPostsByAuthor(authorInfo.name, BLOG_TYPES, 1, AUTHOR_POSTS_PER_PAGE);
    
    if (total > 0) {
      // Index page
      urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/tac-gia/${slug}/bai-viet`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`);
      
      // Pagination pages (page 2+)
      for (let page = 2; page <= totalPages; page++) {
        urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/tac-gia/${slug}/bai-viet/${page}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.3</priority>
  </url>`);
      }
    }
  }

  // Tag pages - NOT included in sitemap (index: false in config)
  // Tags are noindex, so they shouldn't be in sitemap to avoid mixed signals to search engines

  // Category pages - collect all unique categories from posts with post counts
  const categoriesMap = new Map<string, { slug: string; title: string; type: string; postCount: number }>();
  for (const post of posts) {
    const postType = post.type || 'post';
    const key = `${postType}-${post.category?.slug}`;
    if (post.category?.slug) {
      if (categoriesMap.has(key)) {
        const existing = categoriesMap.get(key)!;
        existing.postCount++;
      } else {
        categoriesMap.set(key, { ...post.category, type: postType, postCount: 1 });
      }
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
    const postsPerPage = getPostsPerPageByType(category.type);
    const totalPages = Math.ceil(category.postCount / postsPerPage);
    
    // Category index page
    urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}${rootPath}/${category.slug}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`);
    
    // Category pagination pages (page 2+)
    for (let page = 2; page <= totalPages; page++) {
      urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}${rootPath}/${category.slug}/${page}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.3</priority>
  </url>`);
    }
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
