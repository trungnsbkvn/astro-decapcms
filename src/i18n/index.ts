/**
 * Core i18n utilities for hybrid translation system
 * - Professional static translations for UI elements
 * - Google Translate integration for dynamic/user content
 */

import { translations } from './translations';

// Supported locales
export const SUPPORTED_LOCALES = ['vi', 'en', 'zh', 'ja', 'ko'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Default locale (Vietnamese - primary language)
export const DEFAULT_LOCALE: SupportedLocale = 'vi';

// Locale display names
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

// Locale flags (emoji)
export const LOCALE_FLAGS: Record<SupportedLocale, string> = {
  vi: '🇻🇳',
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
};

// Google Translate language codes
export const GT_LANGUAGE_CODES: Record<SupportedLocale, string> = {
  vi: 'vi',
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
};

/**
 * Check if a locale is supported
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Get nested value from object using dot notation
 * @param obj - Object to traverse
 * @param path - Dot-notation path (e.g., 'nav.home')
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * Replace dynamic parameters in translation string
 * @param str - Translation string with {{param}} placeholders
 * @param params - Object with parameter values
 */
function replaceParams(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key]?.toString() ?? `{{${key}}}`;
  });
}

/**
 * Main translation function
 * @param key - Translation key (dot notation, e.g., 'nav.home', 'blog.datDaiTitle')
 * @param locale - Target locale (defaults to 'vi')
 * @param params - Dynamic parameters to replace in the translation
 * @returns Translated string or the key itself if not found
 * 
 * Structure: translations.section.locale.key (e.g., translations.blog.vi.datDaiTitle)
 * Usage: t('blog.datDaiTitle', 'vi') => 'Đất đai'
 */
export function t(
  key: string,
  locale: SupportedLocale = DEFAULT_LOCALE,
  params?: Record<string, string | number>
): string {
  // Parse key into section and remaining path
  // e.g., 'blog.datDaiTitle' => section='blog', remainingKey='datDaiTitle'
  const parts = key.split('.');
  if (parts.length < 2) {
    console.warn(`Invalid translation key format: ${key}. Expected format: section.key`);
    return key;
  }
  
  const section = parts[0];
  const remainingKey = parts.slice(1).join('.');
  
  // Access translations[section][locale][remainingKey]
  const sectionTranslations = (translations as Record<string, unknown>)[section];
  if (!sectionTranslations || typeof sectionTranslations !== 'object') {
    console.warn(`Translation section not found: ${section}`);
    return key;
  }
  
  const localeTranslations = (sectionTranslations as Record<string, unknown>)[locale];
  let value = localeTranslations ? getNestedValue(localeTranslations as Record<string, unknown>, remainingKey) : undefined;
  
  // Fallback to default locale if not found
  if (value === undefined && locale !== DEFAULT_LOCALE) {
    const defaultLocaleTranslations = (sectionTranslations as Record<string, unknown>)[DEFAULT_LOCALE];
    value = defaultLocaleTranslations ? getNestedValue(defaultLocaleTranslations as Record<string, unknown>, remainingKey) : undefined;
  }
  
  // Return key if translation not found
  if (value === undefined || typeof value !== 'string') {
    console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
    return key;
  }
  
  return replaceParams(value, params);
}

/**
 * Get all translations for a specific locale
 */
export function getTranslations(locale: SupportedLocale = DEFAULT_LOCALE) {
  return translations[locale] || translations[DEFAULT_LOCALE];
}

/**
 * Client-side locale detection and management
 */
export const localeUtils = {
  /**
   * Get stored locale from localStorage
   */
  getStoredLocale(): SupportedLocale | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('preferredLocale');
    return stored && isValidLocale(stored) ? stored : null;
  },

  /**
   * Store locale preference
   */
  setStoredLocale(locale: SupportedLocale): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('preferredLocale', locale);
  },

  /**
   * Detect browser locale
   */
  getBrowserLocale(): SupportedLocale {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;
    
    const browserLang = navigator.language.split('-')[0];
    return isValidLocale(browserLang) ? browserLang : DEFAULT_LOCALE;
  },

  /**
   * Get current effective locale
   * Priority: stored > browser > default
   */
  getCurrentLocale(): SupportedLocale {
    return this.getStoredLocale() || this.getBrowserLocale() || DEFAULT_LOCALE;
  },

  /**
   * Check if Google Translate should be loaded
   * (only for non-default locales)
   */
  shouldLoadGoogleTranslate(): boolean {
    const currentLocale = this.getCurrentLocale();
    return currentLocale !== DEFAULT_LOCALE;
  },
};

/**
 * Google Translate cookie management
 */
export const googleTranslateUtils = {
  /**
   * Set Google Translate cookie
   */
  setGoogleTranslateCookie(locale: SupportedLocale): void {
    if (typeof document === 'undefined') return;
    
    const gtLang = GT_LANGUAGE_CODES[locale];
    const domain = window.location.hostname;
    const path = '/';
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    
    document.cookie = `googtrans=/vi/${gtLang}; expires=${expires}; path=${path}; domain=${domain}`;
    // Also set without domain for localhost
    document.cookie = `googtrans=/vi/${gtLang}; expires=${expires}; path=${path}`;
  },

  /**
   * Remove Google Translate cookie
   */
  removeGoogleTranslateCookie(): void {
    if (typeof document === 'undefined') return;
    
    const domain = window.location.hostname;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },

  /**
   * Get current Google Translate locale from cookie
   */
  getGoogleTranslateLocale(): SupportedLocale | null {
    if (typeof document === 'undefined') return null;
    
    const match = document.cookie.match(/googtrans=\/vi\/([^;]+)/);
    if (match) {
      const gtLang = match[1];
      const entry = Object.entries(GT_LANGUAGE_CODES).find(([, code]) => code === gtLang);
      return entry ? (entry[0] as SupportedLocale) : null;
    }
    return null;
  },
};

// Export types
export type { SupportedLocale as Locale };

// Default export for convenience
export default {
  t,
  getTranslations,
  localeUtils,
  googleTranslateUtils,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_NAMES,
  LOCALE_FLAGS,
  GT_LANGUAGE_CODES,
  isValidLocale,
};
