/**
 * Search API endpoint for SSR
 * Returns all posts as JSON for client-side Fuse.js search
 * Cached for 1 hour via CDN headers
 */

import type { APIRoute } from 'astro';
import { fetchPostsFromAllTypes } from '~/utils/blog';
import { getRootPathForType } from '~/utils/blog-permalinks';

export const GET: APIRoute = async () => {
  const types = ['post', 'consultation', 'evaluation', 'foreigner', 'labor', 'legal'];
  const posts = await fetchPostsFromAllTypes(types);

  // Return minimal data needed for search
  const searchData = posts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt || '',
    category: post.category?.title || '',
    url: `${getRootPathForType(post.type)}/${post.permalink}`,
    type: post.type,
    date: post.publishDate.toISOString().split('T')[0],
  }));

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
