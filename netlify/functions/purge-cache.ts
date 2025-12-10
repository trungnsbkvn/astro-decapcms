/**
 * Cache Purge Function for Netlify
 * 
 * Call this endpoint to invalidate cached content when posts are updated.
 * 
 * Usage:
 *   POST /.netlify/functions/purge-cache
 *   Body: { "tags": ["blog"], "secret": "your-secret-key" }
 * 
 * Or purge specific paths:
 *   POST /.netlify/functions/purge-cache
 *   Body: { "paths": ["/tin-tuc/my-post"], "secret": "your-secret-key" }
 * 
 * Setup:
 *   1. Set PURGE_SECRET environment variable in Netlify
 *   2. Set NETLIFY_SITE_ID environment variable
 *   3. Create a Build Hook in Netlify and set NETLIFY_BUILD_HOOK_URL
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface PurgeRequest {
  tags?: string[];
  paths?: string[];
  secret?: string;
  purgeAll?: boolean;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body: PurgeRequest = JSON.parse(event.body || '{}');
    
    // Verify secret (set PURGE_SECRET in Netlify environment variables)
    const secret = process.env.PURGE_SECRET;
    if (secret && body.secret !== secret) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Option 1: Trigger a new deploy (rebuilds everything, clears all cache)
    if (body.purgeAll) {
      const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
      if (buildHookUrl) {
        await fetch(buildHookUrl, { method: 'POST' });
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            message: 'Build triggered - all caches will be cleared',
          }),
        };
      }
    }

    // Option 2: Use Netlify's Cache-Tag purge API (Enterprise feature)
    // For standard plans, we trigger a deploy which clears cache
    const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const netlifyToken = process.env.NETLIFY_AUTH_TOKEN;
    
    if (siteId && netlifyToken && body.tags?.length) {
      // Netlify Cache Purge API (if available on your plan)
      const response = await fetch(
        `https://api.netlify.com/api/v1/purge`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${netlifyToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            site_id: siteId,
            cache_tags: body.tags,
          }),
        }
      );

      if (response.ok) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: `Purged cache tags: ${body.tags.join(', ')}`,
          }),
        };
      }
    }

    // Fallback: Trigger deploy to clear cache
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
    if (buildHookUrl) {
      await fetch(buildHookUrl, { method: 'POST' });
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Build triggered to refresh cache',
          note: 'For instant cache purge, upgrade to Netlify Enterprise for Cache-Tag support',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        message: 'No purge method available. Set NETLIFY_BUILD_HOOK_URL for deploy-based cache clearing.',
      }),
    };

  } catch (error) {
    console.error('Cache purge error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
