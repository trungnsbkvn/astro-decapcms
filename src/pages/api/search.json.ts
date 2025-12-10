/**
 * Search API endpoint for SSR
 * Returns all posts as JSON for client-side Fuse.js search
 * Cached for 1 hour via CDN headers
 */

import type { APIRoute } from 'astro';
import { fetchPostsFromAllTypes } from '~/utils/blog';
import { getRootPathForType } from '~/utils/blog-permalinks';

export const GET: APIRoute = async () => {
  try {
    const types = ['post', 'consultation', 'evaluation', 'foreigner', 'labor', 'legal'];
    console.log('[Search API] Fetching posts for types:', types);
    
    const posts = await fetchPostsFromAllTypes(types);
    console.log('[Search API] Found posts:', posts.length);

    // Return minimal data needed for search
    const searchData = posts.map((post) => ({
      title: post.title,
      excerpt: post.excerpt || '',
      category: post.category?.title || '',
      url: `${getRootPathForType(post.type)}/${post.permalink}`,
      type: post.type,
      date: post.publishDate.toISOString().split('T')[0],
    }));

    console.log('[Search API] Returning search data count:', searchData.length);

    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[Search API] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts', details: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
