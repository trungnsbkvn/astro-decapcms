# Copilot Instructions - YP Law Firm Website

## Architecture Overview

**AstroWind-based Vietnamese law firm website** with DecapCMS, multi-language support, and performance-first approach. Static site generation (SSG) outputs plain HTML/CSS/JS to Netlify.

### Key Components
- **Content Collections**: 6 types (`post`, `legal`, `labor`, `foreigner`, `evaluation`, `consultation`) defined in [src/content/config.ts](src/content/config.ts). All use identical schema with `.mdx` extension.
- **Hybrid i18n System**: Static UI uses [src/i18n/translations.ts](src/i18n/translations.ts) (`vi`/`en`/`zh`/`ja`/`ko`), CMS content uses Google Translate Widget. See [docs/I18N_CONTENT_MARKUP_GUIDE.md](docs/I18N_CONTENT_MARKUP_GUIDE.md).
- **Custom Integration**: [vendor/integration/](vendor/integration/) contains custom Astro integration (future v2 prep).
- **DecapCMS**: Backend at [public/admin/config.yml](public/admin/config.yml) with Git Gateway on Netlify.

## Critical Development Patterns

### Content & Permalinks
- **Permalink System**: Use `getPermalink(slug, type, content_type)` from [src/utils/blog-permalinks.ts](src/utils/blog-permalinks.ts). Types: `post`, `category`, `tag`, `author`. Content types map to collection folders (`legal`, `labor`, etc.).
- **Navigation**: [src/navigation.ts](src/navigation.ts) defines header/footer menus. Uses Vietnamese labels (i18n handles translation).
- **Content Query Pattern**: Always filter `draft: false` and sort by `publishDate`:
  ```typescript
  const posts = await getCollection('post', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
  ```

### Image Optimization
- **Never use Astro's `<Image />`** - use custom [src/components/common/Image.astro](src/components/common/Image.astro) which wraps `getImagesOptimized()` from [src/utils/image-optimization-advanced.ts](src/utils/image-optimization-advanced.ts).
- **Sprite System**: Testimonials/logos use CSS sprites (run `bun run sprite:all` after adding images). Commit generated files in `public/assets/sprites/`.
- Images in `src/assets/images/` are processed at build time. External images use CDN parameters (`?w=800&format=webp`).

### i18n Translation Pattern
**UI Elements (buttons, labels)**: Vietnamese text + `class="notranslate" translate="no"`:
```astro
<span class="notranslate" translate="no">Tác giả:</span>
```
**CMS Content (titles, excerpts)**: Mark for Google Translate:
```astro
<h1 class="user-content" data-user-content translate="yes">{post.title}</h1>
```
Use `t(key, locale)` function from [src/i18n/index.ts](src/i18n/index.ts) for static translations.

### Component Standards
- **File Paths**: Use `~/` alias for imports (maps to `src/`): `import { COMPANY } from '~/data/company'`
- **Widgets**: Located in [src/components/widgets/](src/components/widgets/). Examples: `Hero.astro`, `Features3.astro`, `Content.astro`.
- **Layouts**: Use `PageLayout.astro` (standard pages) or `MarkdownLayout.astro` (MDX content). Both wrap `Layout.astro`.

## Build & Deployment

### Netlify Auto-Deploy
- **Trigger**: Any commit to `main` branch automatically deploys to Netlify
- **Build Command**: `bun install && bun run build` (configured in [netlify.toml](netlify.toml))
- **Caching**: Netlify caches `node_modules/.astro`, `.build-cache`, `.bun` for faster builds
- **No manual deploy needed** - push to Git, Netlify handles the rest

### Smart Build System
**Default command**: `bun run build` uses [scripts/smart-build.js](scripts/smart-build.js)
- Content hashing detects changes (skip build if no changes)
- Caches processed images in `.build-cache/_astro/`
- Only regenerates changed content collections
- **Force full rebuild**: `bun run build:force`

### Performance Configuration
- **Inline CSS**: All styles inlined (`build.inlineStylesheets: 'always'`) to eliminate render-blocking
- **Icon Optimization**: Only 60 Tabler icons loaded (not entire 5000+ set). Add needed icons to [astro.config.ts](astro.config.ts) `include.tabler` array.
- **Partytown**: Analytics run in web worker (Google Tag, dataLayer)
- **Netlify Caching**: Caches `node_modules/.astro`, `.build-cache`, `.bun` - configured in [netlify.toml](netlify.toml)

### Development Commands
```bash
bun dev                        # Start dev server
bun run build                  # Smart build (default)
bun run build:full             # Full build + regenerate sprites
bun run sprite:all             # Generate CSS sprites (commit after)
bun run find:unused-images     # Audit unused images
bun run i18n:compare           # Check translation key mismatches
```

## Common Workflows

### Adding a New Content Type
1. Add schema to [src/content/config.ts](src/content/config.ts)
2. Create folder `src/content/{type}/`
3. Add collection config to [public/admin/config.yml](public/admin/config.yml)
4. Add permalink logic to [src/utils/blog-permalinks.ts](src/utils/blog-permalinks.ts)
5. Create page template `src/pages/{type}/[...slug].astro`
6. Update [src/config.yaml](src/config.yaml) with collection settings

### Adding i18n Translations
1. Add keys to [src/i18n/translations.ts](src/i18n/translations.ts) for all 5 locales
2. Use `t('key.path', locale)` in components
3. Run `bun run i18n:compare` to validate

### Modifying Navigation
Edit [src/navigation.ts](src/navigation.ts) `headerData` or `footerData`. Use Vietnamese labels. Call `getPermalink()` for internal links.

## Project-Specific Notes

- **Company Data**: Centralized in [src/data/company.ts](src/data/company.ts) (name, address, phones, social links)
- **Code Quality**: Run `bun run check` before committing (Astro check + ESLint + Prettier)
- **No Automated Tests**: Project currently has no test suite - rely on TypeScript checking and manual QA
- **MDX Support**: All content uses `.mdx` (supports JSX). Use `<MarkdownImage />` for images in MDX.
- **SEO**: Metadata defined per-collection in frontmatter. OpenGraph images required.
- **Sharp Image Service**: Uses `sharpImageService()` in [astro.config.ts](astro.config.ts) for image processing
- **Private Repository**: This is a private repo - ensure Git Gateway is properly configured in Netlify for CMS access

## DecapCMS Integration

**Active content management** - editors use `/admin` interface for all content updates.

- **Admin UI**: Access at `https://yplawfirm.vn/admin` (Netlify Identity authentication via Git Gateway)
- **Workflow**: Editorial workflow enabled (draft → in review → ready → publish)
- **Content Creation**: Use DecapCMS for creating/editing posts across all 6 collections
- **Media Management**: Upload images via CMS → saves to `src/assets/images/` → reference as `~/assets/images/...`
- **Custom Widgets**: [public/admin/media-widgets.js](public/admin/media-widgets.js) for YouTube/Vimeo embeds
- **Deployment**: CMS commits trigger Netlify auto-deploy (no manual build needed)

### Important: Private Repository
This is a **private repository**. Git Gateway is configured in Netlify to allow CMS access without exposing repo credentials.
