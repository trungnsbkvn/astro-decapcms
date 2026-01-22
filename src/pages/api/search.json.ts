/**
 * Search API endpoint for SSR
 * Returns all posts and attorneys as JSON for client-side Fuse.js search
 * Cached for 1 hour via CDN headers
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import slugify from 'limax';

// Enable SSR for this API endpoint (Hybrid mode)
export const prerender = true;

// Helper to clean slug from title - must match blog-permalinks.ts
function cleanSlug(text: string): string {
  return slugify(text, { custom: { '&': '' } });
}

// Root paths for each blog type
const ROOT_PATHS: Record<string, string> = {
  post: '/tin-tuc',
  legal: '/phap-ly',
  labor: '/lao-dong',
  consultation: '/tu-van-thuong-xuyen',
  foreigner: '/dau-tu-nuoc-ngoai',
  evaluation: '/dich-vu-danh-gia',
  attorney: '/luat-su-va-cong-su',
};

// Type labels for display
const TYPE_LABELS: Record<string, string> = {
  post: 'Tin tức',
  legal: 'Pháp lý',
  labor: 'Lao động',
  consultation: 'Tư vấn',
  foreigner: 'Đầu tư nước ngoài',
  evaluation: 'Đánh giá',
  attorney: 'Luật sư',
  page: 'Trang',
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

    // Fetch each blog collection
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

    // Add attorneys to search
    const attorneys = await getCollection('attorney').catch(() => []);
    for (const attorney of attorneys) {
      if (attorney.data.draft) continue;
      
      const name = attorney.data.name || '';
      const slug = cleanSlug(name);
      
      searchData.push({
        title: name,
        excerpt: attorney.data.shortBio || attorney.data.bio || '',
        category: (attorney.data.specializations || []).slice(0, 3).join(', '),
        url: `/tac-gia/${slug}`,
        type: 'attorney',
        date: new Date().toISOString().split('T')[0],
      });
    }

    // Add static pages to search
    const staticPages = [
      { title: 'Giới thiệu YP Law Firm', excerpt: 'Công ty Luật TNHH YP - Đội ngũ luật sư giàu kinh nghiệm', url: '/gioi-thieu', category: '' },
      { title: 'Dịch vụ pháp lý', excerpt: 'Các dịch vụ tư vấn pháp luật chuyên nghiệp', url: '/dich-vu', category: '' },
      { title: 'Liên hệ', excerpt: 'Thông tin liên hệ và địa chỉ văn phòng', url: '/lien-he', category: '' },
      { title: 'Đội ngũ Luật sư và Cộng sự', excerpt: 'Danh sách luật sư và chuyên viên pháp lý', url: '/luat-su-va-cong-su', category: '' },
      { title: 'Tin tức pháp luật', excerpt: 'Cập nhật tin tức và bài viết pháp luật mới nhất', url: '/tin-tuc', category: '' },
      { title: 'Pháp lý doanh nghiệp', excerpt: 'Dịch vụ tư vấn pháp lý cho doanh nghiệp', url: '/phap-ly', category: '' },
      { title: 'Lao động', excerpt: 'Tư vấn pháp luật lao động và hợp đồng lao động', url: '/lao-dong', category: '' },
      { title: 'Tư vấn thường xuyên', excerpt: 'Dịch vụ tư vấn pháp luật thường xuyên cho doanh nghiệp', url: '/tu-van-thuong-xuyen', category: '' },
      { title: 'Đầu tư nước ngoài', excerpt: 'Tư vấn đầu tư và thành lập doanh nghiệp cho nhà đầu tư nước ngoài', url: '/dau-tu-nuoc-ngoai', category: '' },
      { title: 'Dịch vụ đánh giá', excerpt: 'Dịch vụ đánh giá pháp lý và thẩm định', url: '/dich-vu-danh-gia', category: '' },
    ];

    for (const page of staticPages) {
      searchData.push({
        title: page.title,
        excerpt: page.excerpt,
        category: page.category,
        url: page.url,
        type: 'page',
        date: new Date().toISOString().split('T')[0],
      });
    }

    // Sort by date descending (posts first, then others)
    searchData.sort((a, b) => {
      // Pages go last
      if (a.type === 'page' && b.type !== 'page') return 1;
      if (a.type !== 'page' && b.type === 'page') return -1;
      // Attorneys go after posts
      if (a.type === 'attorney' && b.type !== 'attorney' && b.type !== 'page') return 1;
      if (a.type !== 'attorney' && a.type !== 'page' && b.type === 'attorney') return -1;
      // Sort by date
      return new Date(b.date).valueOf() - new Date(a.date).valueOf();
    });

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
