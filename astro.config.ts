import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, sharpImageService } from 'astro/config';
import netlify from '@astrojs/netlify';

import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';
import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, extractHeadingsRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  // SERVER MODE with Edge Functions: SSR by default, opt-in to static with `export const prerender = true`
  // Edge Functions provide: better cold starts, global distribution, no chunk bundling issues
  // Static pages (prerender: true) are generated at build time for best performance
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true, // Use Edge Functions for SSR (bypasses Serverless chunk resolution issues)
    cacheOnDemandPages: true, // Cache SSR pages up to 1 year (integrates with Cache-Control)
    // Optimize bundle for large sites
    imageCDN: true, // Use Netlify Image CDN for on-demand image optimization
  }),

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    // sitemap() removed - using custom sitemap.xml.ts instead
    mdx(),
    icon({
      include: {
        // OPTIMIZED: Only include icons actually used (was '*' = 5000+ icons)
        // This significantly reduces build time and bundle size
        tabler: [
          'arrow-right', 'award', 'book', 'brand-facebook', 'brand-linkedin', 'brand-meta',
          'brand-whatsapp', 'brand-x', 'brand-youtube', 'briefcase', 'building',
          'building-skyscraper', 'calendar', 'calendar-event', 'calendar-month',
          'chart-arrows', 'check', 'checklist', 'chevron-down',
          'chevron-left', 'chevron-right', 'clock', 'clock-24', 'download', 'file-text',
          'gavel', 'globe', 'headset', 'heart', 'id-badge-2', 'info-square', 'language', 'mail',
          'mailbox', 'map-pin', 'message-circle', 'message-star', 'moon', 'phone',
          'phone-call', 'point-filled', 'report-search', 'rosette', 'rss', 'school',
          'shield-checkered', 'sort-a-z', 'square-number-1', 'square-number-2',
          'square-number-3', 'square-number-4', 'star', 'star-filled', 'step-out',
          'sun', 'template', 'trophy', 'user', 'user-check', 'users', 'world', 'x',
        ],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),
    partytown({
      config: { 
        forward: [
          'dataLayer.push',      // Google Analytics
          'gtag',                // Google Tag
        ], 
        debug: false,
      },
    }),
    // NOTE: Pagefind disabled for SSR mode - it requires pre-rendered pages
    // For search, use a client-side solution or API-based search
    // pagefind(),
    
    // DISABLED: astro-compress is redundant - Netlify CDN handles compression
    // Netlify automatically applies Brotli/gzip compression at the edge
    // Removing this saves ~30-60 seconds of build time
    // compress({ ... }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
    // Use Sharp for image optimization
    // Works for prerendered pages; on-demand pages use Netlify Image CDN
    service: sharpImageService(),
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, extractHeadingsRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    // Dev server optimization - ignore content files for faster HMR
    server: {
      watch: {
        ignored: ['**/src/content/**/*.mdx', '**/src/content/**/*.md'],
      },
    },
    // Build optimization
    build: {
      // Consolidate chunks to reduce file count (works with Edge Functions)
      rollupOptions: {
        output: {
          // Smart code splitting for better caching and reduced unused JS
          manualChunks: (id) => {
            // Isolate astro-embed components to load only when needed
            if (id.includes('astro-embed') || id.includes('lite-youtube') || id.includes('lite-vimeo')) {
              return 'embed';
            }
            // Isolate search functionality (Fuse.js, motion)
            if (id.includes('fuse.js') || id.includes('/motion/')) {
              return 'search';
            }
            // Keep vendor chunk for other node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            return null;
          },
        },
        // Reduce bundle analysis overhead
        treeshake: {
          moduleSideEffects: false,
        },
      },
      // OPTIMIZATION: Use esbuild instead of terser for faster builds
      // esbuild is 10-100x faster than terser with similar results
      minify: 'esbuild',
      // CSS code splitting - helps reduce critical CSS
      cssCodeSplit: true,
      // PERFORMANCE: Inline small CSS files to reduce requests
      assetsInlineLimit: 4096,
      // Reduce chunk size warnings
      chunkSizeWarningLimit: 1500,
      // No source maps in production
      sourcemap: false,
      // Target modern browsers for smaller bundles
      target: 'es2020',
      // PERFORMANCE: Enable CSS minification
      cssMinify: true,
    },
    // Build performance optimizations
    ssr: {
      // Externalize heavy dependencies to reduce bundle time
      external: ['sharp', 'shiki', '@astrojs/prism'],
      // Don't bundle node_modules in SSR (faster)
      noExternal: [],
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      exclude: ['sharp'],
      // Pre-bundle common deps
      include: ['lodash.merge', 'clsx'],
    },
    // Faster dev/build
    esbuild: {
      // Drop console in production
      drop: ['debugger'],
      // Faster parsing
      legalComments: 'none',
    },
  },
});