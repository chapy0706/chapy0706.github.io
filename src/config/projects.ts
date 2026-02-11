export type Project = {
  name: string;
  summary: string;
  links: {
    repo: string;
    production?: string;
    docs?: string;
  };
  structure: string[];
  techStack: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    name: 'czz',
    summary: 'AI駆動のLinux学習向けコマンド構築ゲーム。簡易DDDとミニTDDで進行中。',
    links: {
      repo: 'https://github.com/chapy0706/czz',
      // TODO: set production URL when ready
      production: undefined,
      // TODO: set docs URL when ready
      docs: undefined
    },
    structure: [
      'monorepo: apps/user, apps/admin, packages/domain, packages/dsl-core, infra/*',
      'clean architecture: Domain → Application → Infra',
      'Zod境界 / Repository interface / TDD'
    ],
    techStack: [
      'Next.js(App Router) / TypeScript / pnpm',
      'Tailwind / shadcn/ui / Zustand / SWR',
      'Drizzle ORM + PostgreSQL',
      'Vitest / Playwright'
    ],
    highlights: [
      'DSLで課題を解くゲーム（指示構築）',
      '検証コマンドとevidenceログ運用',
      '安全性 / 変更容易性 / 性能 / 運用の4軸で判断'
    ]
  }
];
