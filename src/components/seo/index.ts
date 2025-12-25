/**
 * SEO Components Export
 * 
 * Components for Search Engine Optimization and Structured Data
 */

// Re-export breadcrumbs for easy imports
export { default as Breadcrumbs } from './Breadcrumbs.astro';
export { default as BreadcrumbsWrapper } from './BreadcrumbsWrapper.astro';
export { default as SchemaOrg } from './SchemaOrg.astro';

// Re-export types
export type { BreadcrumbItem, Props as BreadcrumbsProps } from './Breadcrumbs.astro';
