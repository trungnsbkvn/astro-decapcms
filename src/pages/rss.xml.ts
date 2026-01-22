import { getRssString } from '@astrojs/rss';

import { SITE, METADATA, APP_BLOG } from 'astrowind:config';
import { fetchPostsFromAllTypes } from '~/utils/blog';
import { getRootPathForType } from '~/utils/blog-permalinks';

export const prerender = true;

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const types = ['post', 'consultation', 'evaluation', 'foreigner', 'labor', 'legal'];
  const posts = await fetchPostsFromAllTypes(types);

  const allPosts = posts.map((post) => ({
    ...post,
    permalink: `${getRootPathForType(post.type)}/${post.permalink}`,
  }));

  const rss = await getRssString({
    title: `${SITE.name}’s articles`,
    description: METADATA?.description || '',
    site: import.meta.env.SITE,

    items: allPosts.map((post) => ({
      link: `${post.permalink}`,
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishDate,
    })),

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
