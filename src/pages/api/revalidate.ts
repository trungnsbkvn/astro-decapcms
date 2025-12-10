/**
 * Cache Revalidation Webhook
 * 
 * Call this endpoint when content is updated in Decap CMS to trigger a rebuild.
 * 
 * Setup in Decap CMS (public/admin/config.yml):
 *   backend:
 *     name: github
 *     ...
 *   publish_mode: editorial_workflow
 *   # Add webhook to trigger on publish:
 *   # Use Netlify Build Hooks instead for automatic cache clearing
 * 
 * Or call manually:
 *   POST /api/revalidate
 *   Headers: { "x-revalidate-token": "your-secret" }
 */

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  // Verify token
  const token = request.headers.get('x-revalidate-token');
  const expectedToken = import.meta.env.REVALIDATE_TOKEN;
  
  if (expectedToken && token !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // The best way to invalidate SSR cache on Netlify is to trigger a new deploy
  // This clears all edge caches and rebuilds the site
  const buildHookUrl = import.meta.env.NETLIFY_BUILD_HOOK_URL;
  
  if (buildHookUrl) {
    try {
      await fetch(buildHookUrl, { method: 'POST' });
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Build triggered - cache will be refreshed',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Failed to trigger build',
        details: String(error),
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ 
    success: false,
    message: 'NETLIFY_BUILD_HOOK_URL not configured',
    hint: 'Create a Build Hook in Netlify Site Settings > Build & deploy > Build hooks',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

// Also allow GET for easy testing
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    endpoint: '/api/revalidate',
    method: 'POST',
    headers: { 'x-revalidate-token': 'your-secret-token' },
    description: 'Triggers a Netlify rebuild to clear all caches',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
