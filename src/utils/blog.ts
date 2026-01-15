import type { PaginateFunction } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post } from '~/types';
import { APP_BLOG, APP_LEGAL, APP_CONSULTATION, APP_LABOR, APP_FOREIGNER, APP_EVALUATION } from 'astrowind:config';
import { cleanSlug, trimSlash, BLOG_BASE, POST_PERMALINK_PATTERN, CATEGORY_BASE, TAG_BASE, BLOG_TYPES } from './blog-permalinks';

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

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    //.replace('%rootPath%', BLOG_ROOTPATH || '')
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

/**
 * LAZY NORMALIZATION: Only extract metadata, NO render() call
 * This prevents EMFILE errors by not opening all MDX files at once
 * Use this for listing pages where Content is not needed
 */
const getNormalizedPostLazy = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, data } = post;

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    rating,
    draft = false,
    metadata = {},
  } = data;

  // Slug is calculated from title, not MDX filename
  const slug = cleanSlug(title);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? {
        slug: cleanSlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    category: category,
    tags: tags,
    author: author,
    rating: rating,

    draft: draft,

    metadata,

    // Content NOT rendered - will be undefined for listing pages
    Content: undefined,
    readingTime: undefined,
    headings: undefined,
  };
};

/**
 * FULL NORMALIZATION: Includes render() for Content
 * Use this ONLY for single post pages where Content is needed
 */
const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await post.render();

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    rating,
    draft = false,
    metadata = {},
  } = data;

  // Slug is calculated from title, not MDX filename
  const slug = cleanSlug(title);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? {
        slug: cleanSlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    category: category,
    tags: tags,
    author: author,
    rating: rating,

    draft: draft,

    metadata,

    Content: Content,
    // or 'content' in case you consume from API

    readingTime: remarkPluginFrontmatter?.readingTime,
    headings: remarkPluginFrontmatter?.headings,
  };
};

// Helper to get collection by type - using explicit calls for SSR compatibility
const getCollectionByType = async (type: string): Promise<CollectionEntry<'post'>[]> => {
  // Netlify SSR requires explicit collection names, not dynamic strings
  switch (type) {
    case 'post':
      return await getCollection('post').catch(() => []);
    case 'legal':
      return await getCollection('legal').catch(() => []) as unknown as CollectionEntry<'post'>[];
    case 'labor':
      return await getCollection('labor').catch(() => []) as unknown as CollectionEntry<'post'>[];
    case 'consultation':
      return await getCollection('consultation').catch(() => []) as unknown as CollectionEntry<'post'>[];
    case 'foreigner':
      return await getCollection('foreigner').catch(() => []) as unknown as CollectionEntry<'post'>[];
    case 'evaluation':
      return await getCollection('evaluation').catch(() => []) as unknown as CollectionEntry<'post'>[];
    default:
      console.warn(`Unknown collection type: ${type}`);
      return [];
  }
};

/**
 * LAZY LOAD: For listing pages - NO render(), fast and no EMFILE
 */
const loadLazy = async function (type: string): Promise<Array<Post>> {
  const posts = await getCollectionByType(type);
  
  const normalizedPosts = posts.map(async (post) => await getNormalizedPostLazy(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

/**
 * FULL LOAD: For single post pages - includes render() for Content
 * @deprecated Use loadLazy + findPostBySlugWithContent for better performance
 */
const load = async function (type: string): Promise<Array<Post>> {
  const posts = await getCollectionByType(type);
  
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _posts: Array<Post>;

/** */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/** 
 * Fetch posts for listing pages - uses LAZY load (no Content, fast)
 * This prevents EMFILE errors on Netlify by not calling render() for all posts
 */
export const fetchPosts = async (type: string): Promise<Array<Post>> => {
  const allPosts: Post[] = [];
  const typePosts = await loadLazy(type);

  const resultPosts = typePosts.map(post => ({ ...post, type }));
  allPosts.push(...resultPosts);
  
  return allPosts;
};

/** 
 * Fetch posts WITH Content rendered - use only when Content is needed
 * @deprecated Prefer fetchPosts + findPostBySlugWithContent for better performance
 */
export const fetchPostsWithContent = async (type: string): Promise<Array<Post>> => {
  const allPosts: Post[] = [];
  const typePosts = await load(type);

  const resultPosts = typePosts.map(post => ({ ...post, type }));
  allPosts.push(...resultPosts);
  
  return allPosts;
};

/** */
export const findPostsBySlugs = async (type: string, slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts(type);

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findPostsByIds = async (type: string, ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts(type);

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export async function findLatestBlogPosts(categories: Record<string, string[]>, count: number): Promise<Post[]> {
  const latestPosts: Post[] = [];

  for (const type in categories) {
    const posts = await getCollectionByType(type);
    // Use lazy normalize - no Content needed for listing
    const normalizedPosts = posts.map(async (post) => await getNormalizedPostLazy(post));

    const collectionPosts = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
      .filter((post) => !post.draft);

    if (categories[type].length === 0) {
      // If no categories specified, get only 1 post for the type
      if (collectionPosts.length > 0) {
        latestPosts.push({ ...collectionPosts[0], type });
      }
      continue;
    }
  
    const filteredPosts = collectionPosts.filter(post => categories[type].includes(post.category.title));
    const typePosts = filteredPosts.map(post => ({ ...post, type }));

    typePosts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    const categoryMap = new Map<string, Post>();
    for (const post of typePosts) {
      if (!categoryMap.has(post.category.title)) {
        categoryMap.set(post.category.title, post);
      }
    }

    latestPosts.push(...categoryMap.values());
  }

  return latestPosts.slice(0, count);
}

/** */
export async function findPostsByAuthorAndTypes(author: string, types: string[], count: number): Promise<Post[]> {
  const allPosts: Post[] = [];

  for (const type of types) {
    const typedPost = await getCollectionByType(type);
    // Use lazy normalize - no Content needed for listing
    const normalizedPosts = typedPost.map(async (post) => await getNormalizedPostLazy(post));

    const collectionPosts = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
      .filter((post) => !post.draft);
    
    const resultPosts = collectionPosts.map(post => ({ ...post, type }));
    allPosts.push(...resultPosts);
  }

  const filteredPosts = allPosts.filter(post => post.author === author);
  return filteredPosts.slice(0, count);
}

/** Get all posts by author across types (no limit) */
export async function findAllPostsByAuthorAndTypes(author: string, types: string[]): Promise<Post[]> {
  const allPosts: Post[] = [];

  for (const type of types) {
    const typedPost = await getCollectionByType(type);
    const normalizedPosts = typedPost.map(async (post) => await getNormalizedPostLazy(post));

    const collectionPosts = (await Promise.all(normalizedPosts))
      .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
      .filter((post) => !post.draft);
    
    const resultPosts = collectionPosts.map(post => ({ ...post, type }));
    allPosts.push(...resultPosts);
  }

  const filteredPosts = allPosts.filter(post => post.author === author);
  // Sort all posts by date
  filteredPosts.sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf());
  return filteredPosts;
}

/** Get paginated posts by author for SSR */
export const getPaginatedPostsByAuthor = async (
  author: string,
  types: string[],
  page: number = 1,
  pageSize: number = 12
): Promise<{
  posts: Post[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  const allPosts = await findAllPostsByAuthorAndTypes(author, types);
  const total = allPosts.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const posts = allPosts.slice(start, start + pageSize);

  return { posts, totalPages, currentPage: page, total };
};

export async function fetchPostsFromAllTypes(types: string[]): Promise<Post[]> {
  const allPosts: Post[] = [];

  for (const type of types) {
    const typedPost = await getCollectionByType(type);
    // Use lazy normalize - no Content needed for listing
    const normalizedPosts = typedPost.map(async (post) => await getNormalizedPostLazy(post));
    const collectionPosts = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
      .filter((post) => !post.draft);
    
    const resultPosts = collectionPosts.map(post => ({ ...post, type }));
    allPosts.push(...resultPosts);
  }

  return allPosts;
}


/** */
/** */
export const getStaticPathsBlogList = async (type: string, { paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  return paginate(await fetchPosts(type), {
    params: { blog: BLOG_BASE || undefined },
    pageSize: getPostsPerPageByType(type),
  });
};

/** */
export const getStaticPathsBlogPost = async (type: string) => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts(type)).flatMap((post) => ({
    params: {
      blog: post.permalink,
    },
    props: { post },
  }));
};

/** */
export const getStaticPathsBlogCategory = async (type: string, { paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts(type);
  const categories = {};
  posts.map((post) => {
    if (post.category?.slug) {
      categories[post.category?.slug] = post.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug) =>
    paginate(
      posts.filter((post) => post.category?.slug && categorySlug === post.category?.slug),
      {
        params: { category: categorySlug, blog: CATEGORY_BASE || undefined },
        pageSize: getPostsPerPageByType(type),
        props: { category: categories[categorySlug] },
      }
    )
  );
};

/** */
export const getStaticPathsBlogTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await fetchPostsFromAllTypes(BLOG_TYPES);

  const tags = {};
  posts.map((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.map((tag) => {
        tags[tag?.slug] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      posts.filter((post) => Array.isArray(post.tags) && post.tags.find((elem) => elem.slug === tagSlug)),
      {
        params: { tag: tagSlug, blog: TAG_BASE || undefined },
        pageSize: 12,
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export async function getRelatedPosts(type: string, originalPost: Post, maxResults: number = 4): Promise<Post[]> {
  const allPosts = await fetchPosts(type);
  const originalTagsSet = new Set(originalPost.tags ? originalPost.tags.map((tag) => tag.slug) : []);

  const postsWithScores = allPosts.reduce((acc: { post: Post; score: number }[], iteratedPost: Post) => {
    if (iteratedPost.slug === originalPost.slug) return acc;

    let score = 0;
    if (iteratedPost.category && originalPost.category && iteratedPost.category.slug === originalPost.category.slug) {
      score += 5;
    }

    if (iteratedPost.tags) {
      iteratedPost.tags.forEach((tag) => {
        if (originalTagsSet.has(tag.slug)) {
          score += 1;
        }
      });
    }

    acc.push({ post: iteratedPost, score });
    return acc;
  }, []);

  postsWithScores.sort((a, b) => b.score - a.score);

  const selectedPosts: Post[] = [];
  let i = 0;
  while (selectedPosts.length < maxResults && i < postsWithScores.length) {
    selectedPosts.push(postsWithScores[i].post);
    i++;
  }

  return selectedPosts;
}

// ============ SSR Helper Functions ============

// Cache for posts by type to avoid repeated fetches
// In production SSR: each request creates a new context, so cache is per-request
// This is still useful for multiple calls within the same request
const postsCache = new Map<string, { posts: Post[]; timestamp: number }>();
const CACHE_TTL = import.meta.env.PROD ? 3600000 : 60000; // 1 hour prod, 1 min dev

/** Get cached posts or fetch fresh */
const getCachedPosts = async (type: string): Promise<Post[]> => {
  const cached = postsCache.get(type);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.posts;
  }
  
  const posts = await fetchPosts(type);
  postsCache.set(type, { posts, timestamp: now });
  return posts;
};

// Category slugs cache - even faster lookup
const categorySlugsCache = new Map<string, Set<string>>();

/** Check if a slug matches any category in the type (fast check) */
export const isCategory = async (type: string, slug: string): Promise<boolean> => {
  // Check if we have cached category slugs
  let categorySlugs = categorySlugsCache.get(type);
  
  if (!categorySlugs) {
    const posts = await getCachedPosts(type);
    categorySlugs = new Set<string>();
    for (const post of posts) {
      if (post.category?.slug) {
        categorySlugs.add(post.category.slug);
      }
    }
    categorySlugsCache.set(type, categorySlugs);
  }
  
  return categorySlugs.has(slug);
};

/** Fetch a single post by permalink slug (for SSR listing - NO Content) */
export const findPostBySlug = async (type: string, slug: string): Promise<Post | undefined> => {
  const posts = await getCachedPosts(type);
  return posts.find((post) => post.permalink === slug);
};

/** 
 * SSR OPTIMIZED: Fetch a single post WITH Content rendered
 * Only renders ONE post, not all 381 - solves EMFILE error!
 */
export const findPostBySlugWithContent = async (type: string, slug: string): Promise<Post | undefined> => {
  // First, find the post metadata using lazy load (fast, no file handles)
  const posts = await getCachedPosts(type);
  const postMeta = posts.find((post) => post.permalink === slug);
  
  if (!postMeta) return undefined;
  
  // Now get the raw collection entry and render ONLY this one post
  const rawPosts = await getCollectionByType(type);
  const rawPost = rawPosts.find((p) => p.id === postMeta.id);
  
  if (!rawPost) return undefined;
  
  // Render only this single post's content
  const { Content, remarkPluginFrontmatter } = await rawPost.render();
  
  return {
    ...postMeta,
    Content,
    readingTime: remarkPluginFrontmatter?.readingTime,
    headings: remarkPluginFrontmatter?.headings,
  };
};

/** Get paginated posts for SSR list pages */
export const getPaginatedPosts = async (
  type: string,
  page: number = 1,
  pageSize?: number
): Promise<{
  posts: Post[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  const effectivePageSize = pageSize ?? getPostsPerPageByType(type);
  const allPosts = await getCachedPosts(type);
  const total = allPosts.length;
  const totalPages = Math.ceil(total / effectivePageSize);
  const start = (page - 1) * effectivePageSize;
  const posts = allPosts.slice(start, start + effectivePageSize);

  return { posts, totalPages, currentPage: page, total };
};

/** Get paginated posts by category for SSR */
export const getPaginatedPostsByCategory = async (
  type: string,
  categorySlug: string,
  page: number = 1,
  pageSize?: number
): Promise<{
  posts: Post[];
  totalPages: number;
  currentPage: number;
  total: number;
  category: { slug: string; title: string } | undefined;
}> => {
  const effectivePageSize = pageSize ?? getPostsPerPageByType(type);
  const allPosts = await getCachedPosts(type);
  const filteredPosts = allPosts.filter((post) => post.category?.slug === categorySlug);
  const category = filteredPosts[0]?.category;
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / effectivePageSize);
  const start = (page - 1) * effectivePageSize;
  const posts = filteredPosts.slice(start, start + effectivePageSize);

  return { posts, totalPages, currentPage: page, total, category };
};

/** Get paginated posts by tag for SSR */
export const getPaginatedPostsByTag = async (
  tagSlug: string,
  page: number = 1,
  pageSize: number = 12
): Promise<{
  posts: Post[];
  totalPages: number;
  currentPage: number;
  total: number;
  tag: { slug: string; title: string } | undefined;
}> => {
  const allPosts = await fetchPostsFromAllTypes(BLOG_TYPES);
  const filteredPosts = allPosts.filter(
    (post) => Array.isArray(post.tags) && post.tags.find((t) => t.slug === tagSlug)
  );
  const tag = filteredPosts[0]?.tags?.find((t) => t.slug === tagSlug);
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const posts = filteredPosts.slice(start, start + pageSize);

  return { posts, totalPages, currentPage: page, total, tag };
};

// ============ Pre-render Static Paths Helpers (no paginate) ============

/** Get all pagination pages for a blog type (for pre-rendering) */
export const getStaticPathsForBlogPagination = async (type: string): Promise<Array<{
  params: { page: string };
  props: { posts: Post[]; totalPages: number; currentPage: number };
}>> => {
  const postsPerPage = getPostsPerPageByType(type);
  const allPosts = await fetchPosts(type);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  
  const paths = [];
  for (let page = 2; page <= totalPages; page++) {
    const start = (page - 1) * postsPerPage;
    const posts = allPosts.slice(start, start + postsPerPage);
    paths.push({
      params: { page: String(page) },
      props: { posts, totalPages, currentPage: page },
    });
  }
  return paths;
};

/** Get all category page 1 paths (for pre-rendering) */
export const getStaticPathsForCategoryIndex = async (type: string): Promise<Array<{
  params: { category: string };
  props: { posts: Post[]; totalPages: number; category: { slug: string; title: string } };
}>> => {
  const postsPerPage = getPostsPerPageByType(type);
  const allPosts = await fetchPosts(type);
  const categories: Record<string, { slug: string; title: string }> = {};
  
  allPosts.forEach((post) => {
    if (post.category?.slug) {
      categories[post.category.slug] = post.category;
    }
  });
  
  const paths = [];
  for (const categorySlug of Object.keys(categories)) {
    const categoryPosts = allPosts.filter((p) => p.category?.slug === categorySlug);
    const totalPages = Math.ceil(categoryPosts.length / postsPerPage);
    const posts = categoryPosts.slice(0, postsPerPage);
    
    paths.push({
      params: { category: categorySlug },
      props: { posts, totalPages, category: categories[categorySlug] },
    });
  }
  return paths;
};

/** Get all category pagination pages 2+ (for pre-rendering) */
export const getStaticPathsForCategoryPagination = async (type: string): Promise<Array<{
  params: { category: string; page: string };
  props: { posts: Post[]; totalPages: number; currentPage: number; category: { slug: string; title: string } };
}>> => {
  const postsPerPage = getPostsPerPageByType(type);
  const allPosts = await fetchPosts(type);
  const categories: Record<string, { slug: string; title: string }> = {};
  
  allPosts.forEach((post) => {
    if (post.category?.slug) {
      categories[post.category.slug] = post.category;
    }
  });
  
  const paths = [];
  for (const categorySlug of Object.keys(categories)) {
    const categoryPosts = allPosts.filter((p) => p.category?.slug === categorySlug);
    const totalPages = Math.ceil(categoryPosts.length / postsPerPage);
    
    for (let page = 2; page <= totalPages; page++) {
      const start = (page - 1) * postsPerPage;
      const posts = categoryPosts.slice(start, start + postsPerPage);
      
      paths.push({
        params: { category: categorySlug, page: String(page) },
        props: { posts, totalPages, currentPage: page, category: categories[categorySlug] },
      });
    }
  }
  return paths;
};

/** Get all single post paths for pre-rendering */
export const getStaticPathsForSinglePost = async (type: string): Promise<Array<{
  params: { slug: string };
  props: { post: Post };
}>> => {
  const allPosts = await load(type);
  return allPosts.map((post) => ({
    params: { slug: post.permalink },
    props: { post: { ...post, type } },
  }));
};

/** Get static paths for tag pages with pagination */
export const getStaticPathsForTagPages = async (): Promise<Array<{
  params: { tag: string; page?: string };
  props: { posts: Post[]; totalPages: number; tag: any };
}>> => {
  const posts = await fetchPostsFromAllTypes(BLOG_TYPES);
  const postsPerPage = APP_BLOG?.postsPerPage || 12;
  
  // Group posts by tag
  const tagMap = new Map<string, { posts: Post[]; tag: any }>();
  posts.forEach((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach((tag) => {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, { posts: [], tag });
        }
        tagMap.get(tag.slug)!.posts.push(post);
      });
    }
  });
  
  // Generate paths with pagination
  const paths: Array<{ params: { tag: string; page?: string }; props: { posts: Post[]; totalPages: number; tag: any } }> = [];
  
  tagMap.forEach(({ posts: tagPosts, tag }, tagSlug) => {
    const totalPages = Math.ceil(tagPosts.length / postsPerPage);
    
    // Generate paths for each page
    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * postsPerPage;
      const end = start + postsPerPage;
      const pagePosts = tagPosts.slice(start, end);
      
      paths.push({
        params: { 
          tag: tagSlug,
          page: page === 1 ? undefined : page.toString()
        },
        props: {
          posts: pagePosts,
          totalPages,
          tag
        }
      });
    }
  });
  
  return paths;
};
