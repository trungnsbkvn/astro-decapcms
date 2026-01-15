/**
 * i18n API Endpoint - STATIC SITE COMPATIBLE
 * 
 * For static sites with prerender=true, we need to generate static paths
 * for each language since query parameters don't work at build time.
 * 
 * Generates: /api/i18n/en.json, /api/i18n/zh.json, etc.
 */
import type { APIRoute } from 'astro';
import { translations } from '~/i18n/translations';
import { textToKeyMap } from '~/i18n/textToKeyMap';

export const prerender = true;

// Generate static paths for each language
export function getStaticPaths() {
  const languages = ['en', 'zh', 'zh-CN', 'ja', 'ko', 'vi'];
  return languages.map(lang => ({
    params: { lang }
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang;
  
  if (!lang || lang === 'vi') {
    // No translation data needed for Vietnamese
    return new Response(JSON.stringify({ translations: {}, textToKeyMap: {} }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }
  
  // Map Google Translate codes to i18n codes
  const gtToI18nMap: Record<string, string> = {
    'zh-CN': 'zh',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'vi': 'vi',
  };
  
  const i18nLang = gtToI18nMap[lang] || lang;
  
  // Extract only the requested language's translations
  const langTranslations: Record<string, Record<string, string>> = {};
  
  for (const [section, sectionData] of Object.entries(translations)) {
    const langData = (sectionData as Record<string, unknown>)[i18nLang];
    if (langData && typeof langData === 'object') {
      langTranslations[section] = langData as Record<string, string>;
    }
  }
  
  return new Response(JSON.stringify({
    translations: langTranslations,
    textToKeyMap,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
};
