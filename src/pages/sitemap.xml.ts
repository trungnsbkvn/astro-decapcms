/**
 * Custom Sitemap for SSR mode
 * @astrojs/sitemap only includes prerendered pages
 * This endpoint generates a complete sitemap including SSR single post pages
 */
import { SITE } from 'astrowind:config';
import { fetchPostsFromAllTypes } from '~/utils/blog';
import { getRootPathForType } from '~/utils/blog-permalinks';

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

export const GET = async () => {
  const siteUrl = (SITE.site || import.meta.env.SITE || 'https://yplawfirm.vn').replace(/\/$/, '');
  
  const urls: string[] = [];

  // Static pages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'gioi-thieu', priority: '0.8', changefreq: 'monthly' },
    { path: 'dich-vu', priority: '0.8', changefreq: 'monthly' },
    { path: 'lien-he', priority: '0.7', changefreq: 'monthly' },
    { path: 'luat-su-va-cong-su', priority: '0.7', changefreq: 'monthly' },
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

  // Blog listing pages
  const blogTypes = [
    { path: 'tin-tuc', priority: '0.8' },
    { path: 'phap-ly', priority: '0.8' },
    { path: 'lao-dong', priority: '0.8' },
    { path: 'tu-van-thuong-xuyen', priority: '0.8' },
    { path: 'dau-tu-nuoc-ngoai', priority: '0.8' },
    { path: 'dich-vu-danh-gia', priority: '0.8' },
  ];

  for (const { path, priority } of blogTypes) {
    urls.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/${path}`)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  // All blog posts (SSR pages)
  const types = ['post', 'consultation', 'evaluation', 'foreigner', 'labor', 'legal'];
  const posts = await fetchPostsFromAllTypes(types);

  for (const post of posts) {
    const rootPath = getRootPathForType(post.type);
    const loc = `${siteUrl}${rootPath}/${post.permalink}`;
    const lastmod = formatDate(post.updateDate || post.publishDate);
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
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
