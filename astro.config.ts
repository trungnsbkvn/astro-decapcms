import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';
import astrowind from './vendor/integration';
import pagefind from "astro-pagefind";

import { readingTimeRemarkPlugin, extractHeadingsRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  // SERVER MODE: Pages render on-demand via Netlify Functions
  // Static pages can be pre-rendered by adding `export const prerender = true`
  // This eliminates rebuilds for content changes - new posts appear instantly
  output: 'server',
  adapter: netlify(),

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
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
      config: { forward: ['dataLayer.push'], debug: false },
    }),
    pagefind(),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
    // Optimize image service for faster builds
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
    // Reduce quality slightly for faster processing (still looks great)
    // This reduces file sizes and processing time
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
    // Build optimization
    build: {
      // Better code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-core': ['react', 'solid-js'],
            'vendor-ui': ['motion'],
          },
        },
      },
      // OPTIMIZATION: Use esbuild instead of terser for faster builds
      // esbuild is 10-100x faster than terser with similar results
      minify: 'esbuild',
      // CSS code splitting
      cssCodeSplit: true,
      // Reduce chunk size warnings
      chunkSizeWarningLimit: 1200,
      // Faster source map generation
      sourcemap: false,
    },
    // Build performance optimizations
    ssr: {
      external: ['sharp'],
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      exclude: ['sharp'],
    },
  },
});

