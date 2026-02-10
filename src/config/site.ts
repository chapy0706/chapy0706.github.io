// Site configuration
export const SITE = {
  title: 'ちゃぴぃのまったりダイアリー',
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

export const PORTFOLIO_ITEMS = [
  {
    title: '学習ログサイトの再設計',
    description: '静的サイト構成を見直して、ブログの導線と読みやすさを改善。',
    image: '/diagrams/skill-map.svg',
    tags: ['設計', '導線', '読みやすさ'],
    href: '/posts',
  },
  {
    title: 'テスト設計メモの体系化',
    description: '業務知見を体系化したドキュメントとチェックリストを整備。',
    image: '/diagrams/skill-map.svg',
    tags: ['テスト', '設計', 'ドキュメント'],
    href: '/about',
  },
  {
    title: '学習の見える化',
    description: 'スキルマップと学習履歴をまとめ、次の学びを計画しやすく。',
    image: '/diagrams/skill-map.svg',
    tags: ['可視化', '計画', '学習'],
    href: '/about',
  },
] as const;
