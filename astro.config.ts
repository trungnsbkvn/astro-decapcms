import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import netlify from '@astrojs/netlify';
import type { AstroIntegration } from 'astro';
import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, extractHeadingsRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'server',
  adapter: netlify(),

  integrations: [
    image(),
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
    // pagefind disabled in server mode (doesn't work with dynamic rendering)
    // pagefind(),

    // Compression disabled in server mode (Netlify handles this)
    // compress({
    //   CSS: true,
    //   HTML: {
    //     'html-minifier-terser': {
    //       removeAttributeQuotes: false,
    //     },
    //   },
    //   Image: false,
    //   JavaScript: true,
    //   SVG: false,
    //   Logger: 1,
    // }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
    service: {
      // Use @astrojs/image sharp service (installed as dev dep)
      entrypoint: '@astrojs/image/sharp',
    },
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, extractHeadingsRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: Object.assign(
        {
          '~': path.resolve(__dirname, './src'),
        },
        process.env.NODE_ENV !== 'production'
          ? {
              // In dev only: provide a minimal image service shim so getImage doesn't fail
              'virtual:image-service': path.resolve(__dirname, './src/virtual-image-service.js'),
            }
          : {}
      ) as any,
    },
    build: {
      // Optimize CSS and JS minification for better performance
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      cssCodeSplit: true,
      // Reduce CSS chunk size
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['solid-js', 'react'],
          },
        },
      },
    },
    ssr: {
      // Optimize external dependencies in server mode
      external: ['tabler-icons'],
    },
  },
});
