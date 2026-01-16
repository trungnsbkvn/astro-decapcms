/**
 * Breadcrumb utility functions
 * Generates breadcrumb items for different page types with i18n support
 */

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
  labelI18n?: string;
}

/**
 * Get the site base URL
 */
export function getSiteUrl(): string {
  return import.meta.env.SITE || 'https://yplawfirm.vn';
}

/**
 * Normalize URL path - ensure consistent format
 */
export function normalizePath(path: string): string {
  // Remove trailing slash except for root
  if (path === '/') return '/';
  return path.replace(/\/$/, '');
}

/**
 * Generate home breadcrumb item
 */
export function getHomeBreadcrumb(): BreadcrumbItem {
  return {
    label: 'Trang chủ',
    href: '/',
    labelI18n: 'breadcrumb.home',
  };
}

/**
 * Generate breadcrumbs for About page
 */
export function getAboutBreadcrumbs(): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    {
      label: 'Giới thiệu',
      href: '/gioi-thieu',
      current: true,
      labelI18n: 'breadcrumb.about',
    },
  ];
}

/**
 * Generate breadcrumbs for Services page
 */
export function getServicesBreadcrumbs(): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    {
      label: 'Dịch vụ',
      href: '/dich-vu',
      current: true,
      labelI18n: 'breadcrumb.services',
    },
  ];
}

/**
 * Generate breadcrumbs for Contact page
 */
export function getContactBreadcrumbs(): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    {
      label: 'Liên hệ',
      href: '/lien-he',
      current: true,
      labelI18n: 'breadcrumb.contact',
    },
  ];
}

/**
 * Generate breadcrumbs for Lawyers page
 */
export function getLawyersBreadcrumbs(): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    {
      label: 'Luật sư và cộng sự',
      href: '/luat-su-va-cong-su',
      current: true,
      labelI18n: 'breadcrumb.lawyers',
    },
  ];
}

/**
 * Generate breadcrumbs for News/Blog section
 */
export function getNewsBreadcrumbs(
  category?: { name: string; slug: string; i18nKey?: string },
  article?: { title: string; slug: string }
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Tin tức',
      href: '/tin-tuc',
      current: !category && !article,
      labelI18n: 'breadcrumb.news',
    },
  ];

  if (category) {
    items.push({
      label: category.name,
      href: `/tin-tuc/${category.slug}`,
      current: !article,
      labelI18n: category.i18nKey,
    });
  }

  if (article) {
    items.push({
      label: article.title,
      href: `/tin-tuc/${article.slug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Legal section
 */
export function getLegalBreadcrumbs(
  category?: { name: string; slug: string; i18nKey?: string },
  article?: { title: string; slug: string }
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Pháp lý',
      href: '/phap-ly',
      current: !category && !article,
      labelI18n: 'breadcrumb.legal',
    },
  ];

  if (category) {
    items.push({
      label: category.name,
      href: `/phap-ly/${category.slug}`,
      current: !article,
      labelI18n: category.i18nKey,
    });
  }

  if (article) {
    items.push({
      label: article.title,
      href: `/phap-ly/${article.slug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Labor section
 */
export function getLaborBreadcrumbs(
  category?: { name: string; slug: string; i18nKey?: string },
  article?: { title: string; slug: string }
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Lao động',
      href: '/lao-dong',
      current: !category && !article,
      labelI18n: 'breadcrumb.labor',
    },
  ];

  if (category) {
    items.push({
      label: category.name,
      href: `/lao-dong/${category.slug}`,
      current: !article,
      labelI18n: category.i18nKey,
    });
  }

  if (article) {
    items.push({
      label: article.title,
      href: `/lao-dong/${article.slug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Consultation section
 */
export function getConsultationBreadcrumbs(
  category?: { name: string; slug: string; i18nKey?: string },
  article?: { title: string; slug: string }
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Tư vấn thường xuyên',
      href: '/tu-van-thuong-xuyen',
      current: !category && !article,
      labelI18n: 'breadcrumb.consultation',
    },
  ];

  if (category) {
    items.push({
      label: category.name,
      href: `/tu-van-thuong-xuyen/${category.slug}`,
      current: !article,
      labelI18n: category.i18nKey,
    });
  }

  if (article) {
    items.push({
      label: article.title,
      href: `/tu-van-thuong-xuyen/${article.slug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Foreign Investment section
 */
export function getInvestmentBreadcrumbs(
  category?: { name: string; slug: string; i18nKey?: string },
  article?: { title: string; slug: string }
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Đầu tư nước ngoài',
      href: '/dau-tu-nuoc-ngoai',
      current: !category && !article,
      labelI18n: 'breadcrumb.investment',
    },
  ];

  if (category) {
    items.push({
      label: category.name,
      href: `/dau-tu-nuoc-ngoai/${category.slug}`,
      current: !article,
      labelI18n: category.i18nKey,
    });
  }

  if (article) {
    items.push({
      label: article.title,
      href: `/dau-tu-nuoc-ngoai/${article.slug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Evaluation Services section
 */
export function getEvaluationBreadcrumbs(
  category?: { name: string; slug: string; i18nKey?: string },
  article?: { title: string; slug: string }
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Dịch vụ đánh giá',
      href: '/dich-vu-danh-gia',
      current: !category && !article,
      labelI18n: 'breadcrumb.evaluation',
    },
  ];

  if (category) {
    items.push({
      label: category.name,
      href: `/dich-vu-danh-gia/${category.slug}`,
      current: !article,
      labelI18n: category.i18nKey,
    });
  }

  if (article) {
    items.push({
      label: article.title,
      href: `/dich-vu-danh-gia/${article.slug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Author pages
 * Links to /luat-su-va-cong-su as the parent (there's no /tac-gia index page)
 */
export function getAuthorBreadcrumbs(authorName?: string, authorSlug?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Luật sư và cộng sự',
      href: '/luat-su-va-cong-su',
      current: !authorName,
      labelI18n: 'breadcrumb.lawyers',
    },
  ];

  if (authorName && authorSlug) {
    items.push({
      label: authorName,
      href: `/tac-gia/${authorSlug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Tag pages
 */
export function getTagBreadcrumbs(tagName?: string, tagSlug?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    getHomeBreadcrumb(),
    {
      label: 'Thẻ',
      href: '/tag',
      current: !tagName,
      labelI18n: 'breadcrumb.tags',
    },
  ];

  if (tagName && tagSlug) {
    items.push({
      label: tagName,
      href: `/tag/${tagSlug}`,
      current: true,
    });
  }

  return items;
}

/**
 * Generate breadcrumbs for Privacy page
 */
export function getPrivacyBreadcrumbs(): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    {
      label: 'Chính sách bảo mật',
      href: '/privacy',
      current: true,
      labelI18n: 'breadcrumb.privacy',
    },
  ];
}

/**
 * Generate breadcrumbs for Terms page
 */
export function getTermsBreadcrumbs(): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    {
      label: 'Điều khoản sử dụng',
      href: '/terms',
      current: true,
      labelI18n: 'breadcrumb.terms',
    },
  ];
}

/**
 * Generic breadcrumb generator for dynamic pages
 */
export function generateBreadcrumbs(
  pathname: string,
  pageTitle?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [getHomeBreadcrumb()];
  
  // Clean the pathname
  const cleanPath = normalizePath(pathname);
  
  // Skip home page
  if (cleanPath === '/') {
    return [];
  }
  
  // Split path into segments
  const segments = cleanPath.split('/').filter(Boolean);
  
  // Map of known paths to their i18n keys and labels
  const pathMap: Record<string, { label: string; i18nKey: string }> = {
    'gioi-thieu': { label: 'Giới thiệu', i18nKey: 'breadcrumb.about' },
    'dich-vu': { label: 'Dịch vụ', i18nKey: 'breadcrumb.services' },
    'lien-he': { label: 'Liên hệ', i18nKey: 'breadcrumb.contact' },
    'luat-su-va-cong-su': { label: 'Luật sư và cộng sự', i18nKey: 'breadcrumb.lawyers' },
    'tin-tuc': { label: 'Tin tức', i18nKey: 'breadcrumb.news' },
    'phap-ly': { label: 'Pháp lý', i18nKey: 'breadcrumb.legal' },
    'lao-dong': { label: 'Lao động', i18nKey: 'breadcrumb.labor' },
    'tu-van-thuong-xuyen': { label: 'Tư vấn thường xuyên', i18nKey: 'breadcrumb.consultation' },
    'dau-tu-nuoc-ngoai': { label: 'Đầu tư nước ngoài', i18nKey: 'breadcrumb.investment' },
    'dich-vu-danh-gia': { label: 'Dịch vụ đánh giá', i18nKey: 'breadcrumb.evaluation' },
    'tac-gia': { label: 'Tác giả', i18nKey: 'breadcrumb.authors' },
    'tag': { label: 'Thẻ', i18nKey: 'breadcrumb.tags' },
    'privacy': { label: 'Chính sách bảo mật', i18nKey: 'breadcrumb.privacy' },
    'terms': { label: 'Điều khoản sử dụng', i18nKey: 'breadcrumb.terms' },
  };
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    const pathInfo = pathMap[segment];
    
    if (pathInfo) {
      items.push({
        label: pathInfo.label,
        href: currentPath,
        current: isLast,
        labelI18n: pathInfo.i18nKey,
      });
    } else {
      // For dynamic segments (like article slugs), use the page title if available
      items.push({
        label: isLast && pageTitle ? pageTitle : segment.replace(/-/g, ' '),
        href: currentPath,
        current: isLast,
      });
    }
  });
  
  return items;
}
