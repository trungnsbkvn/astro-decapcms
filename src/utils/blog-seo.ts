/**
 * SEO Metadata Configuration for Blog Types and Categories
 * Each blog type and category has its own keywords and description
 */

export interface BlogTypeSEO {
  title: string;
  description: string;
  keywords: string[];
  subtitle: string;
}

export interface CategorySEO {
  title: string;
  description: string;
  keywords: string[];
  subtitle: string;
}

// Blog Type SEO Metadata
export const BLOG_TYPE_SEO: Record<string, BlogTypeSEO> = {
  // Tin tức (post)
  post: {
    title: 'Tin tức pháp luật',
    description: 'Cập nhật tin tức pháp luật mới nhất, các văn bản pháp luật, nghị định, thông tư và hướng dẫn từ Công ty Luật Youth & Partners.',
    keywords: [
      'tin tức pháp luật',
      'văn bản pháp luật',
      'nghị định mới',
      'thông tư pháp luật',
      'luật mới ban hành',
      'cập nhật pháp luật',
      'Youth Partners',
      'công ty luật',
    ],
    subtitle: 'Cập nhật tin tức pháp luật mới nhất từ Công ty Luật Youth & Partners',
  },

  // Pháp lý (legal)
  legal: {
    title: 'Pháp lý doanh nghiệp',
    description: 'Tư vấn pháp lý doanh nghiệp, thành lập công ty, soạn thảo hợp đồng, giải quyết tranh chấp thương mại từ đội ngũ luật sư chuyên nghiệp.',
    keywords: [
      'tư vấn pháp lý doanh nghiệp',
      'luật doanh nghiệp',
      'thành lập công ty',
      'soạn thảo hợp đồng',
      'tranh chấp thương mại',
      'pháp chế doanh nghiệp',
      'luật sư doanh nghiệp',
      'tư vấn pháp luật',
    ],
    subtitle: 'Trang pháp lý của chúng tôi cung cấp những thông tin cập nhật và mới nhất về các vấn đề pháp lý',
  },

  // Tư vấn thường xuyên (consultation)
  consultation: {
    title: 'Tư vấn pháp lý thường xuyên',
    description: 'Dịch vụ tư vấn pháp lý thường xuyên cho doanh nghiệp, phòng pháp chế thuê ngoài, hỗ trợ pháp lý toàn diện từ Công ty Luật Youth & Partners.',
    keywords: [
      'tư vấn pháp lý thường xuyên',
      'phòng pháp chế thuê ngoài',
      'dịch vụ pháp lý doanh nghiệp',
      'luật sư tư vấn',
      'hợp đồng tư vấn pháp lý',
      'retainer legal services',
      'outsource legal',
      'pháp chế doanh nghiệp',
    ],
    subtitle: 'Dịch vụ tư vấn pháp lý thường xuyên - Người bạn đồng hành đáng tin cậy của doanh nghiệp',
  },

  // Lao động (labor)
  labor: {
    title: 'Pháp luật lao động',
    description: 'Tư vấn pháp luật lao động, hợp đồng lao động, bảo hiểm xã hội, giải quyết tranh chấp lao động, kỷ luật lao động từ chuyên gia.',
    keywords: [
      'luật lao động',
      'hợp đồng lao động',
      'tranh chấp lao động',
      'kỷ luật lao động',
      'bảo hiểm xã hội',
      'BHXH',
      'quyền lợi người lao động',
      'tư vấn nhân sự',
      'luật sư lao động',
    ],
    subtitle: 'Tư vấn và giải quyết các vấn đề pháp luật lao động cho doanh nghiệp',
  },

  // Đầu tư nước ngoài (foreigner)
  foreigner: {
    title: 'Đầu tư nước ngoài',
    description: 'Tư vấn đầu tư nước ngoài tại Việt Nam, thành lập công ty vốn nước ngoài, giấy phép đầu tư, M&A và các thủ tục pháp lý cho nhà đầu tư ngoại.',
    keywords: [
      'đầu tư nước ngoài',
      'FDI Việt Nam',
      'thành lập công ty nước ngoài',
      'giấy phép đầu tư',
      'IRC',
      'ERC',
      'M&A Việt Nam',
      'luật đầu tư',
      'tư vấn đầu tư',
      'foreign investment Vietnam',
    ],
    subtitle: 'Hỗ trợ pháp lý toàn diện cho nhà đầu tư nước ngoài tại Việt Nam',
  },

  // Dịch vụ đánh giá (evaluation)
  evaluation: {
    title: 'Dịch vụ đánh giá pháp lý',
    description: 'Dịch vụ audit, đánh giá và thẩm định pháp lý (Due Diligence), đánh giá tuân thủ lao động, nhân quyền, đạo đức kinh doanh cho doanh nghiệp.',
    keywords: [
      'due diligence',
      'thẩm định pháp lý',
      'audit pháp lý',
      'đánh giá tuân thủ',
      'legal audit',
      'compliance audit',
      'đánh giá lao động',
      'ESG audit',
      'kiểm tra pháp lý',
    ],
    subtitle: 'Dịch vụ đánh giá, thẩm định và audit pháp lý chuyên nghiệp',
  },
};

// Category SEO Metadata - organized by blog type
// Key format: "blogType:categorySlug"
export const CATEGORY_SEO: Record<string, CategorySEO> = {
  // ========== POST (Tin tức) Categories ==========
  'post:tin-moi': {
    title: 'Tin mới',
    description: 'Cập nhật tin tức pháp luật mới nhất, các sự kiện pháp lý nổi bật và thay đổi trong hệ thống pháp luật Việt Nam.',
    keywords: ['tin tức pháp luật', 'tin mới', 'cập nhật pháp luật', 'sự kiện pháp lý'],
    subtitle: 'Tin tức pháp luật mới nhất',
  },
  'post:su-kien': {
    title: 'Sự kiện',
    description: 'Các sự kiện pháp lý, hội thảo, seminar và hoạt động của Công ty Luật Youth & Partners.',
    keywords: ['sự kiện pháp lý', 'hội thảo luật', 'seminar', 'Youth Partners'],
    subtitle: 'Sự kiện và hoạt động của Youth & Partners',
  },

  // ========== LEGAL (Pháp lý) Categories ==========
  'legal:doanh-nghiep': {
    title: 'Pháp lý doanh nghiệp',
    description: 'Tư vấn pháp lý doanh nghiệp, thành lập công ty, thay đổi đăng ký kinh doanh, giải thể doanh nghiệp.',
    keywords: ['pháp lý doanh nghiệp', 'thành lập công ty', 'đăng ký kinh doanh', 'giải thể công ty'],
    subtitle: 'Tư vấn pháp lý doanh nghiệp toàn diện',
  },
  'legal:hop-dong': {
    title: 'Hợp đồng',
    description: 'Soạn thảo, rà soát và tư vấn các loại hợp đồng thương mại, hợp đồng dân sự, hợp đồng lao động.',
    keywords: ['soạn thảo hợp đồng', 'rà soát hợp đồng', 'hợp đồng thương mại', 'tư vấn hợp đồng'],
    subtitle: 'Dịch vụ soạn thảo và tư vấn hợp đồng',
  },
  'legal:tranh-chap': {
    title: 'Tranh chấp',
    description: 'Giải quyết tranh chấp thương mại, tranh chấp hợp đồng, trọng tài thương mại và tố tụng tại tòa.',
    keywords: ['tranh chấp thương mại', 'giải quyết tranh chấp', 'trọng tài', 'tố tụng'],
    subtitle: 'Giải quyết tranh chấp thương mại và dân sự',
  },
  'legal:so-huu-tri-tue': {
    title: 'Sở hữu trí tuệ',
    description: 'Đăng ký bảo hộ nhãn hiệu, sáng chế, bản quyền, xử lý vi phạm sở hữu trí tuệ.',
    keywords: ['sở hữu trí tuệ', 'nhãn hiệu', 'bản quyền', 'sáng chế', 'bảo hộ thương hiệu'],
    subtitle: 'Bảo vệ quyền sở hữu trí tuệ cho doanh nghiệp',
  },

  // ========== CONSULTATION (Tư vấn thường xuyên) Categories ==========
  'consultation:phap-che-thue-ngoai': {
    title: 'Pháp chế thuê ngoài',
    description: 'Dịch vụ phòng pháp chế thuê ngoài, cung cấp nhân sự pháp lý chuyên nghiệp cho doanh nghiệp.',
    keywords: ['pháp chế thuê ngoài', 'outsource pháp lý', 'nhân sự pháp lý', 'legal outsourcing'],
    subtitle: 'Dịch vụ phòng pháp chế thuê ngoài chuyên nghiệp',
  },
  'consultation:tu-van-thuong-xuyen': {
    title: 'Tư vấn thường xuyên',
    description: 'Dịch vụ tư vấn pháp lý thường xuyên theo tháng, quý, năm cho doanh nghiệp.',
    keywords: ['tư vấn pháp lý', 'retainer legal', 'tư vấn thường xuyên', 'hợp đồng tư vấn'],
    subtitle: 'Gói tư vấn pháp lý thường xuyên cho doanh nghiệp',
  },
  'consultation:luat-su-rieng': {
    title: 'Luật sư riêng',
    description: 'Dịch vụ luật sư riêng tiếng Nhật, Anh, Trung, Hàn cho doanh nghiệp và cá nhân.',
    keywords: ['luật sư riêng', 'luật sư tiếng Nhật', 'luật sư tiếng Anh', 'personal lawyer'],
    subtitle: 'Dịch vụ luật sư riêng đa ngôn ngữ',
  },

  // ========== LABOR (Lao động) Categories ==========
  'labor:hop-dong-lao-dong': {
    title: 'Hợp đồng lao động',
    description: 'Tư vấn soạn thảo hợp đồng lao động, nội quy lao động, thỏa ước lao động tập thể.',
    keywords: ['hợp đồng lao động', 'nội quy lao động', 'thỏa ước lao động', 'tư vấn HĐLĐ'],
    subtitle: 'Tư vấn hợp đồng và nội quy lao động',
  },
  'labor:tranh-chap-lao-dong': {
    title: 'Tranh chấp lao động',
    description: 'Giải quyết tranh chấp lao động, đại diện người lao động và người sử dụng lao động tại tòa.',
    keywords: ['tranh chấp lao động', 'giải quyết tranh chấp', 'sa thải', 'đơn phương chấm dứt'],
    subtitle: 'Giải quyết tranh chấp lao động hiệu quả',
  },
  'labor:ky-luat-lao-dong': {
    title: 'Kỷ luật lao động',
    description: 'Tư vấn xử lý kỷ luật lao động, sa thải, đơn phương chấm dứt hợp đồng lao động đúng pháp luật.',
    keywords: ['kỷ luật lao động', 'sa thải', 'xử lý vi phạm', 'kỷ luật nhân viên'],
    subtitle: 'Tư vấn xử lý kỷ luật lao động đúng pháp luật',
  },
  'labor:bao-hiem-xa-hoi': {
    title: 'Bảo hiểm xã hội',
    description: 'Tư vấn về bảo hiểm xã hội, BHYT, BHTN, quyền lợi bảo hiểm cho người lao động.',
    keywords: ['bảo hiểm xã hội', 'BHXH', 'BHYT', 'BHTN', 'quyền lợi bảo hiểm'],
    subtitle: 'Tư vấn về bảo hiểm xã hội và quyền lợi người lao động',
  },
  'labor:nguoi-lao-dong-nuoc-ngoai': {
    title: 'Người lao động nước ngoài',
    description: 'Tư vấn giấy phép lao động, work permit, visa lao động cho người nước ngoài làm việc tại Việt Nam.',
    keywords: ['giấy phép lao động', 'work permit', 'visa lao động', 'lao động nước ngoài'],
    subtitle: 'Tư vấn pháp lý cho người lao động nước ngoài',
  },

  // ========== FOREIGNER (Đầu tư nước ngoài) Categories ==========
  'foreigner:thanh-lap-cong-ty': {
    title: 'Thành lập công ty FDI',
    description: 'Tư vấn thành lập công ty 100% vốn nước ngoài, công ty liên doanh tại Việt Nam.',
    keywords: ['thành lập công ty FDI', 'công ty vốn nước ngoài', 'liên doanh', '100% vốn ngoại'],
    subtitle: 'Thành lập doanh nghiệp vốn đầu tư nước ngoài',
  },
  'foreigner:giay-phep-dau-tu': {
    title: 'Giấy phép đầu tư',
    description: 'Tư vấn xin cấp Giấy chứng nhận đăng ký đầu tư (IRC), đăng ký doanh nghiệp (ERC) cho nhà đầu tư ngoại.',
    keywords: ['IRC', 'ERC', 'giấy phép đầu tư', 'đăng ký đầu tư', 'investment certificate'],
    subtitle: 'Tư vấn cấp giấy phép đầu tư cho nhà đầu tư nước ngoài',
  },
  'foreigner:ma': {
    title: 'M&A',
    description: 'Tư vấn mua bán sáp nhập doanh nghiệp (M&A), góp vốn, chuyển nhượng vốn tại Việt Nam.',
    keywords: ['M&A', 'mua bán sáp nhập', 'góp vốn', 'chuyển nhượng vốn', 'acquisition'],
    subtitle: 'Tư vấn mua bán và sáp nhập doanh nghiệp',
  },
  'foreigner:bat-dong-san': {
    title: 'Bất động sản',
    description: 'Tư vấn pháp lý bất động sản cho nhà đầu tư nước ngoài, quyền sở hữu, thuê đất.',
    keywords: ['bất động sản', 'người nước ngoài mua nhà', 'quyền sở hữu', 'thuê đất'],
    subtitle: 'Tư vấn pháp lý bất động sản cho nhà đầu tư ngoại',
  },

  // ========== EVALUATION (Dịch vụ đánh giá) Categories ==========
  'evaluation:due-diligence': {
    title: 'Due Diligence',
    description: 'Dịch vụ thẩm định pháp lý (Due Diligence) cho các giao dịch M&A, đầu tư, góp vốn.',
    keywords: ['due diligence', 'thẩm định pháp lý', 'DD', 'legal due diligence'],
    subtitle: 'Dịch vụ thẩm định pháp lý chuyên nghiệp',
  },
  'evaluation:audit-lao-dong': {
    title: 'Audit lao động',
    description: 'Dịch vụ kiểm tra, đánh giá tuân thủ pháp luật lao động cho doanh nghiệp.',
    keywords: ['audit lao động', 'kiểm tra lao động', 'đánh giá tuân thủ', 'labor audit'],
    subtitle: 'Dịch vụ audit và đánh giá tuân thủ lao động',
  },
  'evaluation:esg': {
    title: 'ESG',
    description: 'Đánh giá ESG (Môi trường, Xã hội, Quản trị), đánh giá nhân quyền, đạo đức kinh doanh.',
    keywords: ['ESG', 'đánh giá ESG', 'nhân quyền', 'đạo đức kinh doanh', 'sustainability'],
    subtitle: 'Dịch vụ đánh giá ESG và phát triển bền vững',
  },
  'evaluation:compliance': {
    title: 'Đánh giá tuân thủ',
    description: 'Dịch vụ đánh giá tuân thủ pháp luật tổng thể, rà soát compliance cho doanh nghiệp.',
    keywords: ['compliance', 'tuân thủ pháp luật', 'đánh giá compliance', 'legal compliance'],
    subtitle: 'Dịch vụ đánh giá và tư vấn tuân thủ pháp luật',
  },
};

/**
 * Get SEO metadata for a blog type
 */
export function getBlogTypeSEO(type: string): BlogTypeSEO {
  return BLOG_TYPE_SEO[type] || BLOG_TYPE_SEO['post'];
}

/**
 * Get SEO metadata for a category within a blog type
 */
export function getCategorySEO(type: string, categorySlug: string): CategorySEO | undefined {
  const key = `${type}:${categorySlug}`;
  return CATEGORY_SEO[key];
}

/**
 * Generate meta description for a blog list page
 */
export function getBlogListDescription(type: string, pageNumber: number = 1): string {
  const seo = getBlogTypeSEO(type);
  if (pageNumber === 1) {
    return seo.description;
  }
  return `${seo.description} Trang ${pageNumber}.`;
}

/**
 * Generate meta description for a category page
 */
export function getCategoryDescription(type: string, categorySlug: string, categoryTitle: string, pageNumber: number = 1): string {
  const categorySEO = getCategorySEO(type, categorySlug);
  if (categorySEO) {
    if (pageNumber === 1) {
      return categorySEO.description;
    }
    return `${categorySEO.description} Trang ${pageNumber}.`;
  }
  
  // Fallback to generic description
  const blogSEO = getBlogTypeSEO(type);
  return `Tất cả bài viết trong danh mục ${categoryTitle} - ${blogSEO.title}. Trang ${pageNumber > 1 ? pageNumber : ''}.`.trim();
}

/**
 * Generate keywords string for meta tag
 */
export function getKeywordsString(keywords: string[]): string {
  return keywords.join(', ');
}

/**
 * Map category slug to i18n key for translations
 * Returns the i18n key for the category title (without "Title" suffix for base key)
 */
export function getCategoryI18nKey(categorySlug: string): string | null {
  const slugToI18nMap: Record<string, string> = {
    // ========== POST (Tin tức) Categories ==========
    'tin-moi': 'blog.tinMoiTitle',
    'su-kien': 'blog.suKienTitle',
    'su-kien-noi-bo': 'blog.suKienNoiBoTitle',
    'ban-tin-phap-ly': 'blog.banTinPhapLyTitle',
    'binh-luan-phap-ly': 'blog.binhLuanPhapLyTitle',
    'cac-vu-viec-noi-bat': 'blog.cacVuViecNoiBatTitle',
    'hoi-thao-phap-ly': 'blog.hoiThaoPhapLyTitle',
    'tin-tuc-phap-ly': 'blog.tinTucPhapLyTitle',
    'van-ban-phap-ly': 'blog.vanBanPhapLyTitle',
    'thong-tin-tuyen-dung': 'blog.thongTinTuyenDungTitle',
    
    // ========== LEGAL (Pháp lý) Categories ==========
    'doanh-nghiep': 'blog.doanhNghiepTitle',
    'hop-dong': 'blog.hopDongTitle',
    'tranh-chap': 'blog.tranhChapTitle',
    'so-huu-tri-tue': 'blog.soHuuTriTueTitle',
    'kinh-doanh-thuong-mai': 'blog.kinhDoanhThuongMaiTitle',
    'dat-dai': 'blog.datDaiTitle',
    'hon-nhan-va-gia-dinh': 'blog.honNhanVaGiaDinhTitle',
    'giay-phep-con': 'blog.giayPhepConTitle',
    'dan-su': 'blog.danSuTitle',
    'hinh-su': 'blog.hinhSuTitle',
    'phap-ly-khac': 'blog.phapLyKhacTitle',
    'cac-loi-thuong-gap-cua-doanh-nghiep': 'blog.cacLoiThuongGapTitle',
    
    // ========== CONSULTATION (Tư vấn thường xuyên) Categories ==========
    'phap-che-thue-ngoai': 'blog.phapCheThueNgoaiTitle',
    'tu-van-thuong-xuyen': 'blog.tuVanThuongXuyenTitle',
    'luat-su-rieng': 'blog.luatSuRiengTitle',
    'dich-vu-luat-su-rieng': 'blog.dichVuLuatSuRiengTitle',
    'khai-niem-tu-van-thuong-xuyen': 'blog.khaiNiemTuVanThuongXuyenTitle',
    'vi-sao-doanh-nghiep-can-tu-van-thuong-xuyen': 'blog.viSaoCanTuVanTitle',
    'tu-van-phap-luat-thuong-xuyen-cho-doanh-nghiep': 'blog.tuVanPhapLuatThuongXuyenTitle',
    'phi-dich-vu-tu-van': 'blog.phiDichVuTuVanTitle',
    'quy-trinh-tu-van': 'blog.quyTrinhTuVanTitle',
    'mau-hop-dong-dich-vu': 'blog.mauHopDongDichVuTitle',
    'diem-manh-cua-youth-and-partners': 'blog.diemManhYPTitle',
    'phap-ly-tu-van-thuong-xuyen-khac': 'blog.phapLyTuVanKhacTitle',
    // Lawyer by language
    'luat-su-tu-van-tieng-anh': 'blog.luatSuTiengAnhTitle',
    'luat-su-tu-van-tieng-nhat': 'blog.luatSuTiengNhatTitle',
    'luat-su-tu-van-tieng-trung-quoc': 'blog.luatSuTiengTrungTitle',
    
    // ========== LABOR (Lao động) Categories ==========
    'hop-dong-lao-dong': 'blog.hopDongLaoDongTitle',
    'hop-dong-lao-dong-dao-tao': 'blog.hopDongLaoDongDaoTaoTitle',
    'tranh-chap-lao-dong': 'blog.tranhChapLaoDongTitle',
    'ky-luat-lao-dong': 'blog.kyLuatLaoDongTitle',
    'xu-ly-ky-luat': 'blog.xuLyKyLuatTitle',
    'bao-hiem-xa-hoi': 'blog.baoHiemXaHoiTitle',
    'nguoi-lao-dong-nuoc-ngoai': 'blog.nguoiLaoDongNuocNgoaiTitle',
    'thoi-gio-lam-viec': 'blog.thoiGioLamViecTitle',
    'lao-dong': 'blog.laoDongTitle',
    'luong-va-phuc-loi': 'blog.luongVaPhucLoiTitle',
    'noi-quy-thoa-uoc': 'blog.noiQuyThoaUocTitle',
    'cham-dut-hop-dong': 'blog.chamDutHopDongTitle',
    'quay-roi-tinh-duc': 'blog.quayRoiTinhDucTitle',
    'giay-phep-lao-dong': 'blog.giayPhepLaoDongTitle',
    'phap-ly-lao-dong-khac': 'blog.phapLyLaoDongKhacTitle',
    
    // ========== FOREIGNER (Đầu tư nước ngoài) Categories ==========
    'thanh-lap-cong-ty': 'blog.thanhLapCongTyTitle',
    'thanh-lap-moi-du-an': 'blog.thanhLapMoiDuAnTitle',
    'giay-phep-dau-tu': 'blog.giayPhepDauTuTitle',
    'ma': 'blog.maTitle',
    'bat-dong-san': 'blog.batDongSanTitle',
    'doanh-nghiep-va-dau-tu-nuoc-ngoai': 'blog.doanhNghiepVaDauTuTitle',
    'hien-dien-thuong-mai': 'blog.hienDienThuongMaiTitle',
    'dieu-chinh-du-an-dau-tu': 'blog.dieuChinhDuAnTitle',
    'chuyen-nhuong-du-an': 'blog.chuyenNhuongDuAnTitle',
    'phap-ly-nguoi-nuoc-ngoai': 'blog.phapLyNguoiNuocNgoaiTitle',
    
    // ========== EVALUATION (Dịch vụ đánh giá) Categories ==========
    'due-diligence': 'blog.dueDiligenceTitle',
    'audit-lao-dong': 'blog.auditLaoDongTitle',
    'esg': 'blog.esgTitle',
    'compliance': 'blog.complianceTitle',
    'khai-niem-danh-gia': 'blog.khaiNiemDanhGiaTitle',
    'loi-ich-cua-viec-danh-gia': 'blog.loiIchDanhGiaTitle',
    'quy-trinh-danh-gia': 'blog.quyTrinhDanhGiaTitle',
    'phi-dich-vu-danh-gia': 'blog.phiDichVuDanhGiaTitle',
    'dich-vu-danh-gia-cho-doanh-nghiep': 'blog.dichVuDanhGiaDoanhNghiepTitle',
    'dich-vu-danh-gia-tien-tram': 'blog.dichVuDanhGiaTienTramTitle',
    'cac-bo-tieu-chuan-tnxh': 'blog.cacBoTieuChuanTNXHTitle',
    'tieu-chuan-rba': 'blog.tieuChuanRBATitle',
  };
  return slugToI18nMap[categorySlug] || null;
}

/**
 * Get both title and subtitle i18n keys for a category
 */
export function getCategoryI18nKeys(categorySlug: string): { title: string; subtitle: string } | null {
  const titleKey = getCategoryI18nKey(categorySlug);
  if (!titleKey) return null;
  // Replace 'Title' with 'Subtitle' to get subtitle key
  const subtitleKey = titleKey.replace('Title', 'Subtitle');
  return { title: titleKey, subtitle: subtitleKey };
}
