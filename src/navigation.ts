import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Trang chủ',
      href: '/',
    },
    {
      text: 'Giới thiệu',
      links: [
        {
          text: 'Lịch sử thành lập',
          href: getPermalink('/about'),
        },
        {
          text: 'Luật sư & Cộng sự',
          href: getPermalink('/#features'),
        },
        {
          text: 'Giải thưởng pháp lý',
          href: getPermalink('/services'),
        },
        {
          text: 'Cảm nhận khách hàng',
          href: getPermalink('/pricing'),
        },
        {
          text: 'Tôn chỉ hoạt động',
          href: getPermalink('/terms'),
        },
        {
          text: 'Hồ sơ năng lực',
          href: getPermalink('/terms'),
        },
        {
          text: 'Tầm nhìn - sứ mệnh',
          href: getPermalink('/terms'),
        },
        {
          text: 'Sự kiện nội bộ',
          href: getPermalink('/terms'),
        },
        {
          text: 'Bảo vệ dữ liệu cá nhân',
          href: getPermalink('/privacy'),
        },
      ],
    },
    {
      text: 'Pháp lý',
      href: getBlogPermalink(),
      links: [
        {
          text: 'Doanh nghiệp',
          href: getPermalink('doanh-nghiep', 'category'),
        },
        {
          text: 'Kinh doanh thương mại',
          href: getPermalink('kinh-doanh-thuong-mai', 'category'),
        },
        {
          text: 'Sở hữu trí tuệ',
          href: getPermalink('so-huu-tri-tue', 'category'),
        },
        {
          text: 'Đất đai',
          href: getPermalink('dat-dai', 'category'),
        },
        {
          text: 'Hôn nhân và gia đình',
          href: getPermalink('hon-nhan-va-gia-dinh', 'category'),
        },
        {
          text: 'Giấy phép con',
          href: getPermalink('giay-phep-con', 'category'),
        },
        {
          text: 'Dân sự',
          href: getPermalink('dan-su', 'category'),
        },
        {
          text: 'Hình sự',
          href: getPermalink('hinh-su', 'category'),
        },
        {
          text: 'Pháp lý khác',
          href: getPermalink('doanh-nghiep-va-dau-tu-nuoc-ngoai', 'category'),
        },
      ],
    },
    {
      text: 'Tư vấn thường xuyên',
      links: [
        {
          text: 'Doanh nghiệp',
          href: getPermalink('doanh-nghiep', 'consultation'),
        },
        {
          text: 'Cá nhân',
          href: getPermalink('ca-nhan', 'consultation'),
        },
        {
          text: 'Khái niệm Tư vấn thường xuyên',
          href: getPermalink('/landing/click-through'),
        },
        {
          text: 'Vì sao doanh nghiệp cần tư vấn thường xuyên',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Mẫu hợp đồng dịch vụ',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Phí dịch vụ tư vấn',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Quy trình tư vấn',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Điểm mạnh của Youth & Partners',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Danh sách khách hàng',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },
    {
      text: 'Lao động',
      links: [
        {
          text: 'Nội quy - Thỏa ước',
          href: getPermalink('doanh-nghiep', 'consultation'),
        },
        {
          text: 'Thời giờ làm việc',
          href: getPermalink('ca-nhan', 'consultation'),
        },
        {
          text: 'Lương & Phúc lợi',
          href: getPermalink('/landing/click-through'),
        },
        {
          text: 'Hợp đồng lao động, đào tạo',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Chấm dứt hợp đồng',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Xử lý kỷ luật',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Quấy rối tình dục',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'NDA & NCA',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Tranh chấp lao động',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },
    {
      text: 'Đầu tư & Người nước ngoài',
      links: [
        {
          text: 'Thành lập mới dự án',
          href: getPermalink('doanh-nghiep', 'consultation'),
        },
        {
          text: 'Điều chỉnh dự án đầu tư',
          href: getPermalink('ca-nhan', 'consultation'),
        },
        {
          text: 'Chuyển nhượng dự án',
          href: getPermalink('/landing/click-through'),
        },
        {
          text: 'Hiện diện thương mại',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Luật sư tư vấn tiếng Anh',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Luật sư tư vấn tiếng Nhật',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Luật sư tư vấn tiếng Trung Quốc',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Giấy phép lao động',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Pháp lý người nước ngoài',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },
    {
      text: 'Đánh giá doanh nghiệp',
      links: [
        {
          text: 'Khái niệm đánh giá',
          href: getPermalink('doanh-nghiep', 'consultation'),
        },
        {
          text: 'Lợi ích của việc đánh giá',
          href: getPermalink('ca-nhan', 'consultation'),
        },
        {
          text: 'Phí dịch vụ đánh giá',
          href: getPermalink('/landing/click-through'),
        },
        {
          text: 'Quy trình đánh giá',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Dịch vụ Đánh giá cho Doanh nghiệp',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Dịch vụ đánh giá tiền trạm',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Các bộ tiêu chuẩn TNXH',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Tiêu chuẩn RBA',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Các lỗi thường gặp của doanh nghiệp',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },
    {
      text: 'Tin tức',
      links: [
        {
          text: 'Tin tức pháp lý',
          href: getPermalink('doanh-nghiep', 'consultation'),
        },
        {
          text: 'Bình luận pháp lý',
          href: getPermalink('ca-nhan', 'consultation'),
        },
        {
          text: 'Các vụ việc nổi bật',
          href: getPermalink('/landing/click-through'),
        },
        {
          text: 'Hội thảo pháp lý',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Pháp chế doanh nghiệp',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Văn bản pháp lý',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },    
    {
      text: 'Liên hệ',
      href: getPermalink('/contact'),
      links: [
        {
          text: 'Liên hệ tư vấn',
          href: getPermalink('/contact'),
        },
        {
          text: 'Thông tin tuyển dụng',
          href: "#",
        },
        {
          text: 'Kênh truyền thông khác',
          href: "#",
        },
      ],
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Dịch vụ pháp lý',
      links: [
        { text: 'Hỗ trợ doanh nghiệp', href: '#' },
        { text: 'Tư vấn đầu tư trong nước và nước ngoài', href: '#' },
        { text: 'Hôn nhân và gia đình', href: '#' },
        { text: 'Tranh tụng và đại diện ngoài tố tụng', href: '#' },
        { text: 'Dịch vụ đất đai', href: '#' },
        { text: 'Pháp luật dân sự và thừa kế', href: '#' },
        { text: 'Lao động', href: '#' },
        { text: 'Giấy phép', href: '#' },
      ],
    },
    {
      title: 'Kiến thức pháp lý',
      links: [
        { text: 'Dân sự', href: '#' },
        { text: 'Hình sự', href: '#' },
        { text: 'Đất đai', href: '#' },
        { text: 'Doanh nghiệp và Đầu tư nước ngoài', href: '#' },
        { text: 'Hôn nhân và gia đình', href: '#' },
        { text: 'Lao động', href: '#' },
        { text: 'Sở hữu trí tuệ', href: '#' },
        { text: 'Hỏi đáp luật sư', href: '#' },
      ],
    },
    {
      title: 'Công ty',
      links: [
        { text: 'Về chúng tôi', href: '#' },
        { text: 'Trách nhiệm xã hội', href: '#' },
        { text: 'Đội ngũ', href: '#' },
        { text: 'Liên hệ', href: '#' },
        { text: 'Điều khoản sử dụng', href: '#' },
        { text: 'Chính sách bảo mật', href: '#' },
      ],
    },
    {
      title: 'Thông tin chi nhánh',
      links: [
        {
          text: 'Địa chỉ: Số nhà 222, đường Trần Hưng Đạo, phường Tiền An, thành phố Bắc Ninh, tỉnh Bắc Ninh',
          href: '#',
        },
        { text: 'Địa chỉ: Khu 2, xã Vân Xuân, huyện Vĩnh Tường, tỉnh Vĩnh Phúc', href: '#' },
        { text: 'Cầu Các, xã Quất Lưu, huyện Bình Xuyên, tỉnh Vĩnh Phúc', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/vinhphuclawyers' },
    { ariaLabel: 'Youtube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/c/YPLawFirmOfficial' },
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/vinhphuclawyers' },
    {
      ariaLabel: 'Linkedin',
      icon: 'tabler:brand-linkedin',
      href: 'https://www.linkedin.com/company/vinh-phuc-lawyers',
    },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    Copyright © <a class="text-blue-600 underline dark:text-muted" href="https://yplawfirm.vn/"> Y&P Law Firm</a> · All rights reserved.
  `,
};
