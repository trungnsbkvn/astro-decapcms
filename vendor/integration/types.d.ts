declare module 'astrowind:config' {
  import type { SiteConfig, I18NConfig, MetaDataConfig, AppBlogConfig, AppLegalConfig, UIConfig, AnalyticsConfig } from './config';

  export const SITE: SiteConfig;
  export const I18N: I18NConfig;
  export const METADATA: MetaDataConfig;
  export const APP_BLOG: AppBlogConfig;
  export const APP_LEGAL: AppLegalConfig;
  export const APP_CONSULTATION: AppBlogConfig;
  export const APP_LABOR: AppBlogConfig;
  export const APP_FOREIGNER: AppBlogConfig;
  export const APP_EVALUATION: AppBlogConfig;
  export const UI: UIConfig;
  export const ANALYTICS: AnalyticsConfig;
}
