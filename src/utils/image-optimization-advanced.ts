/**
 * Advanced Image Optimization Utility
 * Supports: WebP, AVIF, lazy loading, responsive images, and CDN integration
 */

export interface ResponsiveImageSet {
  src?: string;
  srcSet: string;
  sizes?: string;
  type?: string;
}

export interface OptimizedImageData {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  width?: number;
  height?: number;
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'sync' | 'auto';
  formats: {
    avif?: ResponsiveImageSet;
    webp?: ResponsiveImageSet;
    jpg?: ResponsiveImageSet;
  };
}

/**
 * Generate responsive image srcset with multiple formats
 * @param imageUrl - Source image URL
 * @param sizes - Array of breakpoints [400, 800, 1200, 1600]
 * @param formats - Image formats to generate (avif, webp, jpg)
 */
export function generateResponsiveSrcSet(
  imageUrl: string,
  sizes: number[] = [400, 600, 800, 1200, 1600],
  formats: ('avif' | 'webp' | 'jpg')[] = ['avif', 'webp', 'jpg']
): Record<string, ResponsiveImageSet> {
  const result: Record<string, ResponsiveImageSet> = {};

  // Generate srcset for each format
  for (const format of formats) {
    const srcsetEntries = sizes
      .map((size) => {
        // Support both local and external images
        if (imageUrl.startsWith('http')) {
          // External image - use CDN parameter or service
          return `${imageUrl}?w=${size}&format=${format} ${size}w`;
        }
        // Local image - would be handled by Astro Image service
        return `${imageUrl}?w=${size}&format=${format} ${size}w`;
      })
      .join(', ');

    result[format] = {
      srcSet: srcsetEntries,
      type: format === 'avif' ? 'image/avif' : format === 'webp' ? 'image/webp' : 'image/jpeg',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 100vw',
    };
  }

  return result;
}

/**
 * Calculate intrinsic width/height to prevent layout shift
 * @param width - Original width
 * @param height - Original height
 * @param maxWidth - Maximum display width
 */
export function calculateAspectRatioPadding(
  width: number,
  height: number,
  maxWidth: number = 1200
): { paddingBottom: string; maxWidth: string } {
  const displayWidth = Math.min(width, maxWidth);
  const displayHeight = (displayWidth / width) * height;
  const aspectRatio = (displayHeight / displayWidth) * 100;

  return {
    paddingBottom: `${aspectRatio}%`,
    maxWidth: `${displayWidth}px`,
  };
}

/**
 * Generate picture element with multiple format sources
 * @param alt - Alt text for accessibility
 * @param src - Source image URL
 * @param width - Image width
 * @param height - Image height
 * @param loading - Lazy or eager loading
 */
export function generatePictureHTML(
  alt: string,
  src: string,
  width?: number,
  height?: number,
  loading: 'lazy' | 'eager' = 'lazy'
): string {
  const formats = generateResponsiveSrcSet(src);

  const avifSource = formats.avif ? `<source srcset="${formats.avif.srcSet}" type="image/avif" sizes="${formats.avif.sizes}" />` : '';
  const webpSource = formats.webp ? `<source srcset="${formats.webp.srcSet}" type="image/webp" sizes="${formats.webp.sizes}" />` : '';
  const jpgSource = formats.jpg ? `<source srcset="${formats.jpg.srcSet}" type="image/jpeg" sizes="${formats.jpg.sizes}" />` : '';

  const imgAttrs = [
    `src="${src}"`,
    `alt="${alt}"`,
    loading === 'lazy' ? 'loading="lazy"' : '',
    'decoding="async"',
    width ? `width="${width}"` : '',
    height ? `height="${height}"` : '',
    'crossorigin="anonymous"',
  ]
    .filter(Boolean)
    .join(' ');

  return `<picture>${avifSource}${webpSource}${jpgSource}<img ${imgAttrs} /></picture>`;
}

/**
 * Estimate image file size reduction with modern formats
 */
export const formatSizeEstimate = {
  avif: 0.6, // AVIF is ~40% smaller
  webp: 0.75, // WebP is ~25% smaller
  jpg: 1.0, // Baseline
};

/**
 * Generate LCP image optimization data
 * For critical above-the-fold images
 */
export function optimizeForLCP(
  imageUrl: string,
  alt: string,
  width: number = 1200,
  height: number = 600
): OptimizedImageData {
  const formats = generateResponsiveSrcSet(imageUrl, [480, 960, 1200, 1600], ['avif', 'webp']);

  return {
    src: imageUrl,
    srcSet: formats.jpg?.srcSet || '',
    sizes: formats.jpg?.sizes || '100vw',
    alt,
    width,
    height,
    loading: 'eager',
    decoding: 'async',
    formats,
  };
}

/**
 * Generate image preload hints
 */
export function generatePreloadHints(
  imageUrl: string,
  as: 'image' = 'image',
  imageSrcSet?: string
): string {
  let preload = `<link rel="preload" as="${as}" href="${imageUrl}"`;
  if (imageSrcSet) {
    preload += ` imagesrcset="${imageSrcSet}"`;
  }
  preload += ' fetchpriority="high" />';
  return preload;
}
