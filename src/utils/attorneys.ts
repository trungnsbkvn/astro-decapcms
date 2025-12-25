/**
 * Attorney utilities - Load and manage attorney data from content collection
 * Supports 5 languages: vi, en, zh, ja, ko
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import slugify from 'limax';

export type Attorney = CollectionEntry<'attorney'>;
export type SupportedLanguage = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

/**
 * Get all attorneys sorted by order and featured status
 */
export async function getAllAttorneys(): Promise<Attorney[]> {
  const attorneys = await getCollection('attorney', ({ data }) => !data.draft);
  
  return attorneys.sort((a, b) => {
    // Featured first
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    // Then by order
    return (a.data.order ?? 999) - (b.data.order ?? 999);
  });
}

/**
 * Get featured attorneys only
 */
export async function getFeaturedAttorneys(): Promise<Attorney[]> {
  const attorneys = await getAllAttorneys();
  return attorneys.filter(a => a.data.featured);
}

/**
 * Get attorney by slug (filename without extension)
 */
export async function getAttorneyBySlug(slug: string): Promise<Attorney | undefined> {
  const attorneys = await getCollection('attorney');
  return attorneys.find(a => a.slug === slug);
}

/**
 * Get attorney by name slug (generated from name field)
 */
export async function getAttorneyByNameSlug(nameSlug: string): Promise<Attorney | undefined> {
  const attorneys = await getCollection('attorney');
  return attorneys.find(a => {
    const generatedSlug = slugify(a.data.name);
    return generatedSlug === nameSlug;
  });
}

/**
 * Generate URL slug from attorney name
 */
export function getAttorneySlug(attorney: Attorney): string {
  return slugify(attorney.data.name);
}

/**
 * Get localized name for attorney
 */
export function getLocalizedName(attorney: Attorney, lang: SupportedLanguage = 'vi'): string {
  const data = attorney.data;
  if (lang === 'vi') return data.name;
  return data[`name_${lang}` as keyof typeof data] as string || data.name;
}

/**
 * Get localized bio for attorney
 */
export function getLocalizedBio(attorney: Attorney, lang: SupportedLanguage = 'vi'): string {
  const data = attorney.data;
  if (lang === 'vi') return data.bio || '';
  return (data[`bio_${lang}` as keyof typeof data] as string) || data.bio || '';
}

/**
 * Get localized short bio for attorney
 */
export function getLocalizedShortBio(attorney: Attorney, lang: SupportedLanguage = 'vi'): string {
  const data = attorney.data;
  if (lang === 'vi') return data.shortBio || '';
  return (data[`shortBio_${lang}` as keyof typeof data] as string) || data.shortBio || '';
}

/**
 * Get localized specializations for attorney
 */
export function getLocalizedSpecializations(attorney: Attorney, lang: SupportedLanguage = 'vi'): string[] {
  const data = attorney.data;
  if (lang === 'vi') return data.specializations || [];
  return (data[`specializations_${lang}` as keyof typeof data] as string[]) || data.specializations || [];
}

/**
 * Get localized credentials for attorney
 */
export function getLocalizedCredentials(attorney: Attorney, lang: SupportedLanguage = 'vi'): string[] {
  const data = attorney.data;
  if (lang === 'vi') return data.credentials || [];
  return (data[`credentials_${lang}` as keyof typeof data] as string[]) || data.credentials || [];
}

/**
 * Get localized education for attorney
 */
export function getLocalizedEducation(attorney: Attorney, lang: SupportedLanguage = 'vi'): Array<{
  degree: string;
  institution: string;
  year?: number;
}> {
  const data = attorney.data;
  const education = data.education || [];
  
  return education.map(edu => ({
    degree: lang === 'vi' ? edu.degree : (edu[`degree_${lang}` as keyof typeof edu] as string || edu.degree),
    institution: lang === 'vi' ? edu.institution : (edu[`institution_${lang}` as keyof typeof edu] as string || edu.institution),
    year: edu.year,
  }));
}

/**
 * Position i18n key mapping
 */
export const positionI18nKeys: Record<string, string> = {
  'Luật sư Điều hành': 'team.managingLawyer',
  'Luật sư điều hành': 'team.managingLawyer',
  'Luật sư thành viên': 'team.partnerLawyer',
  'Luật sư cộng sự': 'team.partnerLawyer',
  'Luật sư cao cấp': 'team.seniorLawyer',
  'Luật sư tập sự': 'team.traineeLawyer',
  'Luật gia': 'team.jurist',
  'Chuyên viên pháp lý': 'team.legalStaff',
  'Chuyên viên Pháp lý': 'team.legalStaff',
  'Thực tập sinh pháp lý': 'team.legalIntern',
  'Thực tập sinh Pháp lý': 'team.legalIntern',
};

/**
 * Get i18n key for position
 */
export function getPositionI18nKey(position: string): string | undefined {
  return positionI18nKeys[position];
}

/**
 * Extract title prefix from name (e.g., "Tiến Sĩ", "Luật sư")
 */
export function extractNamePrefix(name: string): { prefix: string | null; baseName: string; i18nKey: string | null } {
  const prefixes = [
    { prefix: 'Tiến Sĩ', i18nKey: 'lawyerProfile.doctor' },
    { prefix: 'Tiến sĩ', i18nKey: 'lawyerProfile.doctor' },
    { prefix: 'TS.', i18nKey: 'lawyerProfile.doctor' },
    { prefix: 'Thạc Sĩ', i18nKey: 'lawyerProfile.master' },
    { prefix: 'Thạc sĩ', i18nKey: 'lawyerProfile.master' },
    { prefix: 'ThS.', i18nKey: 'lawyerProfile.master' },
    { prefix: 'Luật sư', i18nKey: 'lawyerProfile.lawyer' },
    { prefix: 'Luật Sư', i18nKey: 'lawyerProfile.lawyer' },
    { prefix: 'LS.', i18nKey: 'lawyerProfile.lawyer' },
    { prefix: 'Luật gia', i18nKey: 'team.jurist' },
    { prefix: 'Chuyên viên', i18nKey: 'team.legalStaff' },
  ];
  
  for (const { prefix, i18nKey } of prefixes) {
    if (name.startsWith(prefix + ' ')) {
      return {
        prefix,
        baseName: name.slice(prefix.length + 1).trim(),
        i18nKey,
      };
    }
  }
  
  return { prefix: null, baseName: name, i18nKey: null };
}

/**
 * Transform attorneys to team format for Partners widget
 */
export function transformAttorneysToTeams(attorneys: Attorney[]) {
  return attorneys.map(attorney => {
    const { prefix, baseName, i18nKey } = extractNamePrefix(attorney.data.name);
    const positionKey = attorney.data.position ? getPositionI18nKey(attorney.data.position) : undefined;
    
    return {
      name: baseName,
      name_en: attorney.data.name_en || baseName,
      name_zh: attorney.data.name_zh || baseName,
      name_ja: attorney.data.name_ja || baseName,
      name_ko: attorney.data.name_ko || baseName,
      title: prefix || undefined,
      i18nMemberTitle: i18nKey || undefined,
      position: attorney.data.position || 'Luật sư',
      i18nPosition: positionKey,
      link: `/tac-gia/${getAttorneySlug(attorney)}`,
      image: attorney.data.image ? {
        src: attorney.data.image,
        alt: attorney.data.name,
      } : undefined,
      featured: attorney.data.featured,
      order: attorney.data.order,
    };
  });
}
