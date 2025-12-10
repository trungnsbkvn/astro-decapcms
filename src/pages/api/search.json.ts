/**
 * Search API endpoint for SSR
 * Returns all posts as JSON for client-side Fuse.js search
 * Cached for 1 hour via CDN headers
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Enable SSR for this API endpoint (Hybrid mode)
export const prerender = false;

// Helper to clean slug from title
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

// Root paths for each blog type
const ROOT_PATHS: Record<string, string> = {
  post: '/tin-tuc',
  legal: '/phap-ly',
  labor: '/lao-dong',
  consultation: '/tu-van-thuong-xuyen',
  foreigner: '/dau-tu-nuoc-ngoai',
  evaluation: '/dich-vu-danh-gia',
};

export const GET: APIRoute = async () => {
  try {
    const searchData: Array<{
      title: string;
      excerpt: string;
      category: string;
      url: string;
      type: string;
      date: string;
    }> = [];

    // Fetch each collection explicitly to avoid dynamic import issues
    const collections = [
      { name: 'post', data: await getCollection('post').catch(() => []) },
      { name: 'legal', data: await getCollection('legal').catch(() => []) },
      { name: 'labor', data: await getCollection('labor').catch(() => []) },
      { name: 'consultation', data: await getCollection('consultation').catch(() => []) },
      { name: 'foreigner', data: await getCollection('foreigner').catch(() => []) },
      { name: 'evaluation', data: await getCollection('evaluation').catch(() => []) },
    ];

    for (const collection of collections) {
      for (const post of collection.data) {
        if (post.data.draft) continue;
        
        const title = post.data.title || '';
        const slug = cleanSlug(title);
        const publishDate = post.data.publishDate ? new Date(post.data.publishDate) : new Date();
        
        searchData.push({
          title,
          excerpt: post.data.excerpt || '',
          category: post.data.category || '',
          url: `${ROOT_PATHS[collection.name] || '/tin-tuc'}/${slug}`,
          type: collection.name,
          date: publishDate.toISOString().split('T')[0],
        });
      }
    }

    // Sort by date descending
    searchData.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[Search API Error]', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }
};
