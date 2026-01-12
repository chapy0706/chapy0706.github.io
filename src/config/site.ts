// Site configuration
export const SITE = {
  title: 'ちゃぴぃのほんわか日記',
  description: '今までの道のりで体感した経験を呟いたりします',
  url: 'https://yourdomain.com',
  author: 'ちゃぴぃ',
} as const;

export const NAVIGATION = [
  { name: 'TOP', href: '/' },
  { name: 'ブログ', href: '/posts' },
  { name: 'Use Cases', href: '/use-cases' },
  { name: 'Facilities', href: '/facilities' },
  { name: 'Request Quote', href: '/rfq' },
  { name: 'Documentation', href: '/documentation' },
] as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/chapy0706',
  linkedin: 'https://linkedin.com/company/yourcompany',
  twitter: 'https://twitter.com/yourcompany',
  facebook: 'https://facebook.com/yourcompany',
} as const;

