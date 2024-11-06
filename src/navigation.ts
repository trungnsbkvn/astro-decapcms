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
          text: 'Về chúng tôi',
          href: getPermalink('/about'),
        },
        {
          text: 'Dịch vụ của chúng tôi',
          href: getPermalink('/#features'),
        },
        {
          text: 'Trách nhiệm xã hội',
          href: getPermalink('/services'),
        },
        {
          text: 'Đội ngũ',
          href: getPermalink('/pricing'),
        },
        {
          text: 'Điều khoản sử dụng',
          href: getPermalink('/terms'),
        },
        {
          text: 'Chính sách bảo mật',
          href: getPermalink('/privacy'),
        },
      ],
    },
    {
      text: 'Dịch vụ pháp lý',
      links: [
        {
          text: 'Hỗ trợ doanh nghiệp',
          href: getPermalink('/landing/lead-generation'),
        },
        {
          text: 'Tư vấn đầu tư trong nước và nước ngoài',
          href: getPermalink('/landing/sales'),
        },
        {
          text: 'Hôn nhân và gia đình',
          href: getPermalink('/landing/click-through'),
        },
        {
          text: 'Tranh tụng và đại diện ngoài tố tụng',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Dịch vụ đất đai',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Pháp luật dân sự và thừa kế',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Lao động',
          href: getPermalink('/landing/subscription'),
        },
        {
          text: 'Giấy phép',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },
    {
      text: 'Kiến thức pháp lý',
      links: [
        {
          text: 'Dân sự',
          href: getBlogPermalink(),
        },
        {
          text: 'Hình sự',
          href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
        },
        {
          text: 'Đất đai',
          href: getPermalink('markdown-elements-demo-post', 'post'),
        },
        {
          text: 'Doanh nghiệp và Đầu tư nước ngoài',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Hôn nhân và gia đình',
          href: getPermalink('astro', 'tag'),
        },
        {
          text: 'Lao động',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Sở hữu trí tuệ',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Hỏi đáp luật sư',
          href: getPermalink('tutorials', 'category'),
        },
      ],
    },
    {
      text: 'Liên hệ',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: 'Liên hệ ngay', href: 'tel:0889956888', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Customer stories', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Developer API', href: '#' },
        { text: 'Partners', href: '#' },
        { text: 'Atom', href: '#' },
        { text: 'Electron', href: '#' },
        { text: 'AstroWind Desktop', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
        { text: 'Inclusion', href: '#' },
        { text: 'Social Impact', href: '#' },
        { text: 'Shop', href: '#' },
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
    { ariaLabel: 'Linkedin', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/vinh-phuc-lawyers' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    Copyright © <a class="text-blue-600 underline dark:text-muted" href="https://yplawfirm.vn/"> Y&P Law Firm</a> · All rights reserved.
  `,
};
