/**
 * Text to Translation Key Map
 * Maps Vietnamese text to i18n translation keys
 * This is a large lookup table, kept separate for better code splitting
 */

export const textToKeyMap: Record<string, string> = {
  // Company info
  'Công ty Luật TNHH Youth & Partners': 'company.legalName',
  'Công ty Luật TNHH': 'company.legalPrefix',
  'Youth & Partners': 'company.name',
  'Luật sư Nguyễn Văn Thành': 'company.directorName',
  'Giám đốc, người đại diện theo pháp luật:': 'company.director',
  'Hotline': 'company.hotline',
  'Trụ sở': 'company.headquarters',
  'Hà Nội: P219, Tháp Đông, Chung cư Học viện Quốc Phòng, phường Nghĩa Đô, thành phố Hà Nội.': 'company.addressHanoi',
  'Bắc Ninh: Số 26 Đoàn Trần Nghiệp, phường Kinh Bắc, tỉnh Bắc Ninh.': 'company.addressBacNinh',
  'Phú Thọ: Số 170, đường Nguyễn Văn Linh, phường Vĩnh Phúc, tỉnh Phú Thọ.': 'company.addressPhuTho',
  
  // Navigation main
  'Trang chủ': 'nav.home',
  'Giới thiệu': 'nav.about',
  'Dịch vụ': 'nav.services',
  'Tin tức': 'nav.news',
  'Liên hệ': 'nav.contact',
  'Tìm kiếm': 'nav.search',
  'Pháp lý': 'nav.legal',
  'Tư vấn thường xuyên': 'nav.consultation',
  'Lao động': 'nav.labor',
  'Đầu tư nước ngoài': 'nav.investment',
  'Dịch vụ đánh giá': 'nav.evaluation',
  
  // About section
  'Lịch sử thành lập': 'about.history',
  'Luật sư và cộng sự': 'about.lawyers',
  'Luật sư và Cộng sự': 'about.lawyers',
  'Giải thưởng pháp lý': 'about.awards',
  'Cảm nhận khách hàng': 'about.testimonials',
  'Tôn chỉ hoạt động': 'about.principles',
  'Hồ sơ năng lực': 'about.capabilities',
  'Tầm nhìn - sứ mệnh': 'about.vision',
  'Tầm nhìn và sứ mệnh': 'about.visionAndMission',
  'Sự kiện nội bộ': 'about.internalEvents',
  'Bảo vệ dữ liệu cá nhân': 'about.dataProtection',
  'Về chúng tôi': 'about.aboutUs',
  
  // Common UI elements
  'Đọc thêm': 'common.readMore',
  'Xem thêm': 'common.readMore',
  'Tìm hiểu thêm': 'common.learnMore',
  'Liên hệ chúng tôi': 'common.contactUs',
  'Nhận báo giá': 'common.getQuote',
  'Gửi': 'common.submit',
  'Hủy': 'common.cancel',
  'Đóng': 'common.close',
  'Đang tải...': 'common.loading',
  'Lỗi': 'common.error',
  'Thành công': 'common.success',
  'Cảnh báo': 'common.warning',
  'Thông tin': 'common.info',
  'Tìm kiếm...': 'common.search',
  'Không tìm thấy kết quả': 'common.noResults',
  'Về đầu trang': 'common.backToTop',
  'Chia sẻ': 'common.share',
  'Share:': 'common.share',
  'In': 'common.print',
  'Tải xuống': 'common.download',
  'Xem tất cả': 'common.viewAll',
  'Trở về chuyên trang': 'common.backToPage',
  'Bài viết liên quan': 'common.relatedPosts',
  'Bài mới hơn': 'common.newerPosts',
  'Bài cũ hơn': 'common.olderPosts',
  'Mục lục': 'common.tableOfContents',
  'Gửi thông tin': 'common.sendInfo',
  'Liên hệ để được tư vấn': 'common.contactForConsult',
  'Tổng cộng': 'common.totalPosts',
  'bài viết': 'common.posts',
  'Nổi bật': 'common.featured',
  'Luật sư nổi bật': 'common.featuredLawyer',
  
  // Legal services
  'Pháp lý thành lập Doanh nghiệp': 'legal.enterprise',
  'Doanh nghiệp': 'legal.enterprise',
  'Kinh doanh thương mại': 'legal.commercial',
  'Hợp đồng dân sự, thương mại': 'legal.contract',
  'Đất đai': 'legal.land',
  'Hôn nhân gia đình': 'legal.marriage',
  'Hôn nhân và gia đình': 'legal.marriage',
  'Thừa kế, di chúc': 'legal.inheritance',
  'Sở hữu trí tuệ': 'legal.intellectual',
  'Giấy phép kinh doanh': 'legal.license',
  'Giấy phép con': 'legal.subLicense',
  'Dân sự': 'legal.civil',
  'Hình sự': 'legal.criminal',
  'Tranh tụng, tố tụng': 'legal.litigation',
  'Pháp lý khác': 'legal.other',
  
  // Footer sections
  'Điều khoản chung': 'footer.terms',
  'Chính sách Bảo vệ dữ liệu': 'footer.privacy',
  'Chính sách bảo mật': 'footer.privacy',
  'Điều khoản sử dụng': 'footer.terms',
  'Dịch vụ của Y&P': 'footer.servicesYP',
  'Đầu tư và Người nước ngoài': 'footer.investmentForeign',
};

// Create normalized map for partial matching (lazy loaded)
let _normalizedTextMap: Map<string, string> | null = null;

export function getNormalizedTextMap(): Map<string, string> {
  if (!_normalizedTextMap) {
    _normalizedTextMap = new Map();
    Object.entries(textToKeyMap).forEach(([text, key]) => {
      _normalizedTextMap!.set(text.replace(/\s+/g, ' ').trim(), key);
    });
  }
  return _normalizedTextMap;
}
