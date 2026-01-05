/**
 * Centralized Company Information
 * Single source of truth for all company data used across the site
 * Used by: SchemaMarkup.astro, Metadata.astro, Footer, Contact pages, etc.
 */

export const COMPANY = {
  // Basic Info
  name: 'Công ty Luật TNHH Youth & Partners',
  legalName: 'CÔNG TY LUẬT TNHH YOUTH AND PARTNERS',
  shortName: 'Y&P Law Firm',
  alternateName: ['Youth & Partners Law Firm', 'Y&P Law Firm', 'Luật Youth & Partners', 'YP Law Firm'],
  
  // URLs
  url: 'https://yplawfirm.vn',
  // Logo in public/images/ - served as static file, not processed by Astro
  // Using 411x411 JPG for optimal file size while meeting Schema.org requirements (min 112x112)
  logo: 'https://yplawfirm.vn/images/logo-square.jpg',
  logoWidth: 411,
  logoHeight: 411,
  
  // Contact
  phone: '+84-88-995-6888',
  phoneDisplay: '088 995 6888',
  phoneHref: 'tel:0889956888',
  email: 'contact@yplawfirm.vn',
  ceoEmail: 'ceo@yplawfirm.vn',
  
  // Address - Headquarters (Hà Nội)
  address: {
    street: 'P219, Tháp Đông, Chung cư Học viện Quốc Phòng, phường Nghĩa Đô',
    locality: 'Quận Cầu Giấy',
    region: 'Hà Nội',
    country: 'VN',
    postalCode: '100000',
    full: 'P219, Tháp Đông, Chung cư Học viện Quốc Phòng, phường Nghĩa Đô, Hà Nội',
  },
  
  // Geo coordinates
  geo: {
    latitude: 21.0478,
    longitude: 105.8007,
  },
  
  // Social Media
  social: {
    facebook: 'https://www.facebook.com/yplawfirm',
    linkedin: 'https://www.linkedin.com/company/yplawfirm',
    youtube: 'https://www.youtube.com/@YPLawFirmOfficial',
  },
  
  // Business Info
  foundingDate: '2019',
  founder: 'Luật sư Nguyễn Văn Thành',
  priceRange: '$',
  
  // Languages supported
  languages: ['vi', 'en', 'ja', 'zh', 'ko'] as const,
  
  // Opening Hours
  openingHours: {
    weekdays: { opens: '08:00', closes: '17:30' },
    saturday: { opens: '08:00', closes: '12:00' },
  },
} as const;

// Branch offices (department)
export const BRANCHES = [
  {
    name: 'Y&P Law Firm - Chi nhánh Bắc Ninh',
    address: {
      street: 'Số 26 Đoàn Trần Nghiệp, phường Kinh Bắc',
      locality: 'Thành phố Bắc Ninh',
      region: 'Bắc Ninh',
      country: 'VN',
    },
    phone: COMPANY.phone,
  },
  {
    name: 'Y&P Law Firm - Chi nhánh Phú Thọ',
    address: {
      street: 'Số 170, đường Nguyễn Văn Linh, phường Vĩnh Phúc',
      locality: 'Thành phố Việt Trì',
      region: 'Phú Thọ',
      country: 'VN',
    },
    phone: COMPANY.phone,
  },
] as const;

// Sub-organization (luatsumienbac.vn)
export const SUB_ORGANIZATION = {
  name: 'Luật Sư Miền Bắc',
  legalName: 'Luật Sư Miền Bắc - Chi nhánh Công ty Luật TNHH Youth & Partners',
  alternateName: ['Luật Sư Miền Bắc', 'LSMB', 'Northern Lawyers Vietnam'],
  url: 'https://luatsumienbac.vn',
  description: 'Chi nhánh miền Bắc của Công ty Luật TNHH Youth & Partners - Cung cấp dịch vụ tư vấn pháp luật, giải quyết tranh chấp, đại diện pháp lý chuyên nghiệp tại 15 tỉnh thành phía Bắc Việt Nam.',
  phone: COMPANY.phone,
  email: 'contact@luatsumienbac.vn',
  languages: ['vi', 'en', 'ja', 'zh', 'ko'] as const,
  // 15 provinces served
  areaServed: [
    'Miền Bắc Việt Nam',
    'Hà Nội',
    'Hải Phòng',
    'Bắc Ninh',
    'Hưng Yên',
    'Ninh Bình',
    'Phú Thọ',
    'Tuyên Quang',
    'Lào Cai',
    'Lai Châu',
    'Điện Biên',
    'Lạng Sơn',
    'Cao Bằng',
    'Sơn La',
    'Thái Nguyên',
    'Quảng Ninh',
  ] as const,
} as const;

// Helper function to generate Schema.org OpeningHoursSpecification
export function getOpeningHoursSchema() {
  return [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: COMPANY.openingHours.weekdays.opens,
      closes: COMPANY.openingHours.weekdays.closes,
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: COMPANY.openingHours.saturday.opens,
      closes: COMPANY.openingHours.saturday.closes,
    },
  ];
}

// Helper to get sameAs array for Schema.org
export function getSameAsArray() {
  return Object.values(COMPANY.social);
}

// Type exports
export type CompanyType = typeof COMPANY;
export type BranchType = typeof BRANCHES[number];
export type SubOrgType = typeof SUB_ORGANIZATION;
