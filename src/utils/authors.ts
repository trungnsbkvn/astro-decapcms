/**
 * Author mapping - slug to display name and description
 * This file centralizes author data for use across the site
 */

export interface AuthorInfo {
  name: string;
  description: string;
  slug: string;
}

export const AUTHORS: Record<string, AuthorInfo> = {
  'bui-duc-manh': {
    name: 'Bùi Đức Mạnh',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'bui-duc-manh',
  },
  'do-thi-luong': {
    name: 'Đỗ Thị Lương',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'do-thi-luong',
  },
  'luat-su-mang-dieu-hien': {
    name: 'Luật sư Mang Diệu Hiền',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-mang-dieu-hien',
  },
  'luat-su-nguyen-hoang-anh': {
    name: 'Luật sư Nguyễn Hoàng Anh',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-nguyen-hoang-anh',
  },
  'luat-su-nguyen-hoang-ngoc-lan': {
    name: 'Luật sư Nguyễn Hoàng Ngọc Lan',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-nguyen-hoang-ngoc-lan',
  },
  'luat-su-nguyen-minh-anh': {
    name: 'Luật sư Nguyễn Minh Anh',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-nguyen-minh-anh',
  },
  'luat-su-nguyen-thi-huong': {
    name: 'Luật sư Nguyễn Thị Hướng',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-nguyen-thi-huong',
  },
  'luat-su-nguyen-thi-thom': {
    name: 'Luật sư Nguyễn Thị Thơm',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-nguyen-thi-thom',
  },
  'luat-su-nguyen-thu-nga': {
    name: 'Luật sư Nguyễn Thu Nga',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-nguyen-thu-nga',
  },
  'luat-su-nguyen-van-thanh': {
    name: 'Luật sư Nguyễn Văn Thành',
    description: 'Luật sư Điều hành Youth & Partners Law Firm',
    slug: 'luat-su-nguyen-van-thanh',
  },
  'luat-su-pham-thi-huyen-quyen': {
    name: 'Luật sư Phạm Thị Huyền Quyên',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-pham-thi-huyen-quyen',
  },
  'luat-su-tran-chung-kien': {
    name: 'Luật sư Trần Chung Kiên',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-tran-chung-kien',
  },
  'luat-su-van-thi-thanh-hoa': {
    name: 'Luật sư Văn Thị Thanh Hoa',
    description: 'Luật sư tại Công ty Luật TNHH Youth & Partners',
    slug: 'luat-su-van-thi-thanh-hoa',
  },
  'nghiem-minh-huyen': {
    name: 'Nghiêm Minh Huyền',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nghiem-minh-huyen',
  },
  'nguyen-hoang-dung': {
    name: 'Nguyễn Hoàng Dũng',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nguyen-hoang-dung',
  },
  'nguyen-phan-thuc-chi': {
    name: 'Nguyễn Phan Thục Chi',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nguyen-phan-thuc-chi',
  },
  'nguyen-phung-mai-anh': {
    name: 'Nguyễn Phùng Mai Ánh',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nguyen-phung-mai-anh',
  },
  'nguyen-thi-quynh-giang': {
    name: 'Nguyễn Thị Quỳnh Giang',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nguyen-thi-quynh-giang',
  },
  'nguyen-thi-thu-trang': {
    name: 'Nguyễn Thị Thu Trang',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nguyen-thi-thu-trang',
  },
  'nguyen-thi-thuy-linh': {
    name: 'Nguyễn Thị Thùy Linh',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nguyen-thi-thuy-linh',
  },
  'nguyen-thuy-hang': {
    name: 'Nguyễn Thúy Hằng',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'nguyen-thuy-hang',
  },
  'tien-si-doan-xuan-truong': {
    name: 'TS Đoàn Xuân Trường',
    description: 'Tiến sĩ luật tại Công ty Luật TNHH Youth & Partners',
    slug: 'tien-si-doan-xuan-truong',
  },
  'tran-thi-bich-lien': {
    name: 'Trần Thị Bích Liên',
    description: 'Chuyên viên pháp lý tại Công ty Luật TNHH Youth & Partners',
    slug: 'tran-thi-bich-lien',
  },
};

/**
 * Get author info by name (display name)
 */
export function getAuthorByName(name: string): AuthorInfo | undefined {
  return Object.values(AUTHORS).find(author => author.name === name);
}

/**
 * Get author info by slug
 */
export function getAuthorBySlug(slug: string): AuthorInfo | undefined {
  return AUTHORS[slug];
}

/**
 * Get author slug from display name
 */
export function getAuthorSlug(name: string): string | undefined {
  const author = getAuthorByName(name);
  return author?.slug;
}
