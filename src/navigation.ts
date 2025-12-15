import { getPermalink, getAsset } from './utils/blog-permalinks';

export const headerData = {
  links: [
    {
      text: 'Giới thiệu',
      links: [
        { text: 'Lịch sử thành lập', href: getPermalink('/gioi-thieu#lich-su-thanh-lap') },
        { text: 'Luật sư và cộng sự', href: '/luat-su-va-cong-su' },
        { text: 'Giải thưởng pháp lý', href: '/gioi-thieu#giai-thuong-phap-ly' },
        { text: 'Cảm nhận khách hàng', href: '/gioi-thieu#cam-nhan-khach-hang' },
        { text: 'Tôn chỉ hoạt động', href: '/gioi-thieu#ton-chi-hoat-dong' },
        { text: 'Hồ sơ năng lực', href: '/gioi-thieu#ho-so-nang-luc' },
        { text: 'Tầm nhìn - sứ mệnh', href: '/gioi-thieu#tam-nhin-su-menh' },
        { text: 'Sự kiện nội bộ', href: '/tin-tuc/su-kien-noi-bo' },
        { text: 'Bảo vệ dữ liệu cá nhân', href: '/privacy' },
      ],
    },
    {
      text: 'Pháp lý',
      links: [
        {
          text: 'Doanh nghiệp',
          href: '/phap-ly/doanh-nghiep',
        },
        {
          text: 'Kinh doanh thương mại',
          href: '/phap-ly/kinh-doanh-thuong-mai',
        },
        {
          text: 'Sở hữu trí tuệ',
          href: '/phap-ly/so-huu-tri-tue',
        },
        {
          text: 'Đất đai',
          href: '/phap-ly/dat-dai',
        },
        {
          text: 'Hôn nhân và gia đình',
          href: '/phap-ly/hon-nhan-va-gia-dinh',
        },
        {
          text: 'Giấy phép con',
          href: '/phap-ly/giay-phep-con',
        },
        {
          text: 'Dân sự',
          href: '/phap-ly/dan-su',
        },
        {
          text: 'Hình sự',
          href: '/phap-ly/hinh-su',
        },
        {
          text: 'Pháp lý khác',
          href: '/phap-ly/phap-ly-khac',
        },
      ],
    },
    {
      text: 'Tư vấn thường xuyên',
      links: [
        {
          text: 'Tư vấn pháp luật thường xuyên',
          href: '/tu-van-thuong-xuyen/tu-van-phap-luat-thuong-xuyen-cho-doanh-nghiep',
        },
        {
          text: 'Dịch vụ luật sư riêng',
          href: '/tu-van-thuong-xuyen/dich-vu-luat-su-rieng',
        },
        {
          text: 'Khái niệm Tư vấn thường xuyên',
          href: '/tu-van-thuong-xuyen/khai-niem-tu-van-thuong-xuyen',
        },
        {
          text: 'Vì sao doanh nghiệp cần tư vấn thường xuyên',
          href: '/tu-van-thuong-xuyen/vi-sao-doanh-nghiep-can-tu-van-thuong-xuyen',
        },
        {
          text: 'Mẫu hợp đồng dịch vụ',
          href: '/tu-van-thuong-xuyen/mau-hop-dong-dich-vu',
        },
        {
          text: 'Phí dịch vụ tư vấn',
          href: '/tu-van-thuong-xuyen/phi-dich-vu-tu-van',
        },
        {
          text: 'Quy trình tư vấn',
          href: '/tu-van-thuong-xuyen/quy-trinh-tu-van',
        },
        {
          text: 'Điểm mạnh của Youth & Partners',
          href: '/tu-van-thuong-xuyen/diem-manh-cua-youth-and-partners',
        },
        {
          text: ' Pháp lý tư vấn thường xuyên khác',
          href: '/tu-van-thuong-xuyen/phap-ly-tu-van-thuong-xuyen-khac',
        },
      ],
    },
    {
      text: 'Lao động',
      links: [
        {
          text: 'Nội quy - Thỏa ước',
          href: '/lao-dong/noi-quy-thoa-uoc',
        },
        {
          text: 'Thời giờ làm việc',
          href: '/lao-dong/thoi-gio-lam-viec',
        },
        {
          text: 'Lương & Phúc lợi',
          href: '/lao-dong/luong-va-phuc-loi',
        },
        {
          text: 'Hợp đồng lao động, đào tạo',
          href: '/lao-dong/hop-dong-lao-dong-dao-tao',
        },
        {
          text: 'Chấm dứt hợp đồng',
          href: '/lao-dong/cham-dut-hop-dong',
        },
        {
          text: 'Xử lý kỷ luật',
          href: '/lao-dong/xu-ly-ky-luat',
        },
        {
          text: 'Quấy rối tình dục',
          href: '/lao-dong/quay-roi-tinh-duc',
        },       
        {
          text: 'Tranh chấp lao động',
          href: '/lao-dong/tranh-chap-lao-dong',
        },
        {
          text: 'Pháp lý lao động khác',
          href: '/lao-dong/phap-ly-lao-dong-khac',
        },
      ],
    },
    {
      text: 'Đầu tư & Nước ngoài',
      links: [
        {
          text: 'Thành lập mới dự án',
          href: '/dau-tu-nuoc-ngoai/thanh-lap-moi-du-an',
        },
        {
          text: 'Điều chỉnh dự án đầu tư',
          href: '/dau-tu-nuoc-ngoai/dieu-chinh-du-an-dau-tu',
        },
        {
          text: 'Chuyển nhượng dự án',
          href: '/dau-tu-nuoc-ngoai/chuyen-nhuong-du-an',
        },
        {
          text: 'Hiện diện thương mại',
          href: '/dau-tu-nuoc-ngoai/hien-dien-thuong-mai',
        },
        {
          text: 'Luật sư tư vấn tiếng Anh',
          href: '/dau-tu-nuoc-ngoai/luat-su-tu-van-tieng-anh',
        },
        {
          text: 'Luật sư tư vấn tiếng Nhật',
          href: '/dau-tu-nuoc-ngoai/luat-su-tu-van-tieng-nhat',
        },
        {
          text: 'Luật sư tư vấn tiếng Trung Quốc',
          href: '/dau-tu-nuoc-ngoai/luat-su-tu-van-tieng-trung-quoc',
        },
        {
          text: 'Giấy phép lao động',
          href: '/dau-tu-nuoc-ngoai/giay-phep-lao-dong',
        },
        {
          text: 'Pháp lý người nước ngoài',
          href: '/dau-tu-nuoc-ngoai/phap-ly-nguoi-nuoc-ngoai',
        },
      ],
    },
    {
      text: 'Dịch vụ đánh giá',
      links: [
        {
          text: 'Khái niệm đánh giá',
          href: '/dich-vu-danh-gia/khai-niem-danh-gia',
        },
        {
          text: 'Lợi ích của việc đánh giá',
          href: '/dich-vu-danh-gia/loi-ich-cua-viec-danh-gia',
        },
        {
          text: 'Phí dịch vụ đánh giá',
          href: '/dich-vu-danh-gia/phi-dich-vu-danh-gia',
        },
        {
          text: 'Quy trình đánh giá',
          href: '/dich-vu-danh-gia/quy-trinh-danh-gia',
        },
        {
          text: 'Dịch vụ Đánh giá cho Doanh nghiệp',
          href: '/dich-vu-danh-gia/dich-vu-danh-gia-cho-doanh-nghiep',
        },
        {
          text: 'Dịch vụ đánh giá tiền trạm',
          href: '/dich-vu-danh-gia/dich-vu-danh-gia-tien-tram',
        },
        {
          text: 'Các bộ tiêu chuẩn TNXH',
          href: '/dich-vu-danh-gia/cac-bo-tieu-chuan-tnxh',
        },
        {
          text: 'Tiêu chuẩn RBA',
          href: '/dich-vu-danh-gia/tieu-chuan-rba',
        },
        {
          text: 'Các lỗi thường gặp của doanh nghiệp',
          href: '/dich-vu-danh-gia/cac-loi-thuong-gap-cua-doanh-nghiep',
        },
      ],
    },
    {
      text: 'Tin tức - Liên hệ',
      links: [
        {
          text: 'Tin tức pháp lý',
          href: getPermalink('tin-tuc-phap-ly', 'category'),
        },
        {
          text: 'Bình luận pháp lý',
          href: getPermalink('binh-luan-phap-ly', 'category'),
        },
        {
          text: 'Các vụ việc nổi bật',
          href: getPermalink('cac-vu-viec-noi-bat', 'category'),
        },
        {
          text: 'Hội thảo pháp lý',
          href: getPermalink('hoi-thao-phap-ly', 'category'),
        },
        {
          text: 'Văn bản pháp lý',
          href: getPermalink('van-ban-phap-ly', 'category'),
        },
        {
          text: 'Liên hệ tư vấn',
          href: getPermalink('/lien-he'),
        },
        {
          text: 'Luật sư Hà Nội',
          href: getPermalink('luat-su-ha-noi', 'category'),
        },
        {
          text: 'Luật sư Phú Thọ',
          href: getPermalink('luat-su-phu-tho', 'category'),
        },
        {
          text: 'Luật sư Bắc Ninh',
          href: getPermalink('luat-su-bac-ninh', 'category'),
        },
        {
          text: 'Luật sư Bắc Giang',
          href: getPermalink('luat-su-bac-giang', 'category'),
        },
        {
          text: 'Luật sư Hải Phòng',
          href: getPermalink('luat-su-hai-phong', 'category'),
        },
        {
          text: 'Luật sư Hưng Yên',
          href: getPermalink('luat-su-hung-yen', 'category'),
        },
        {
          text: 'Luật sư Ninh Bình',
          href: getPermalink('luat-su-ninh-binh', 'category'),
        },
        {
          text: 'Luật sư Tuyên Quang',
          href: getPermalink('luat-su-tuyen-quang', 'category'),
        },
        {
          text: 'Luật sư Thái Nguyên',
          href: getPermalink('luat-su-thai-nguyen', 'category'),
        },
        {
          text: 'Thông tin tuyển dụng',
          href: getPermalink('thong-tin-tuyen-dung', 'category'),
        },
      ],
    },    
  ],
};

export const footerData = {
  links: [
    {
      title: 'Giới thiệu',
      links: [
        { text: 'Về chúng tôi', href: getPermalink('/gioi-thieu') },
        { text: 'Lịch sử thành lập', href: getPermalink('/gioi-thieu#lich-su-thanh-lap') },
        { text: 'Luật sư và cộng sự', href: '/gioi-thieu#luat-su-va-cong-su' },
        { text: 'Giải thưởng pháp lý', href: '/gioi-thieu#giai-thuong-phap-ly' },
        { text: 'Cảm nhận khách hàng', href: '/gioi-thieu#cam-nhan-khach-hang' },
        { text: 'Tôn chỉ hoạt động', href: '/gioi-thieu#ton-chi-hoat-dong' },
        { text: 'Hồ sơ năng lực', href: '/gioi-thieu#ho-so-nang-luc' },
        { text: 'Tầm nhìn - sứ mệnh', href: '/gioi-thieu#tam-nhin-su-menh' },
        { text: 'Sự kiện nội bộ', href: '/tin-tuc/su-kien-noi-bo' },
        { text: 'Bảo vệ dữ liệu cá nhân', href: '/privacy' },
      ],
    },
    {
      title: 'Dịch vụ',
      links: [
        { text: 'Dịch vụ của Y&P', href: '/dich-vu' },
        { text: 'Pháp lý', href: '/phap-ly' },
        { text: 'Tư vấn thường xuyên', href: '/tu-van-thuong-xuyen' },
        { text: 'Lao động', href: '/lao-dong' },
        { text: 'Đầu tư và Người nước ngoài', href: '/dau-tu-nuoc-ngoai' },
        { text: 'Dịch vụ đánh giá', href: '/dich-vu-danh-gia' },
      ],
    },
    {
      title: 'Tin tức',
      links: [
        {
          text: 'Tin tức pháp lý',
          href: getPermalink('tin-tuc-phap-ly', 'category'),
        },
        {
          text: 'Bình luận pháp lý',
          href: getPermalink('binh-luan-phap-ly', 'category'),
        },
        {
          text: 'Các vụ việc nổi bật',
          href: getPermalink('cac-vu-viec-noi-bat', 'category'),
        },
        {
          text: 'Hội thảo pháp lý',
          href: getPermalink('hoi-thao-phap-ly', 'category'),
        },
        {
          text: 'Văn bản pháp lý',
          href: getPermalink('van-ban-phap-ly', 'category'),
        },
      ],
    },    
    {
      title: 'Liên hệ',
      links: [
        {
          text: 'Liên hệ tư vấn',
          href: getPermalink('/lien-he'),
        },
        {
          text: 'Thông tin tuyển dụng',
          href: getPermalink('thong-tin-tuyen-dung', 'category'),
        },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Điều khoản chung', href: getPermalink('/terms') },
    { text: 'Chính sách Bảo vệ dữ liệu', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/yplawfirm' },
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
    Copyright © <a class="text-blue-600 underline dark:text-muted" href="https://yplawfirm.vn/"> Youth & Partners Law Firm</a> · All rights reserved.
  `,
};
