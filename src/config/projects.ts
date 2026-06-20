export type ProjectLink = {
  label: string;
  href?: string;
};

export type ProjectScreenshot = {
  src: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  /** URLやアンカーに使う一意なスラッグ */
  slug: string;
  name: string;
  /** 一言キャッチコピー */
  tagline: string;
  /** 開発状況など（任意）。例: '開発中' */
  status?: string;
  /** どういうアプリか（数文の説明） */
  description: string;
  /** 実際の画面キャプチャ。width/height はレイアウト崩れ防止のため実寸を指定 */
  screenshots: ProjectScreenshot[];
  structure: string[];
  techStack: string[];
  highlights: string[];
  /** ラベル付きリンク。href 未設定は「準備中」として表示 */
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: 'czz',
    name: 'czz（指示厨ゲーム）',
    tagline: 'AI駆動で作る、Linuxコマンド構築ゲーム',
    status: '開発中',
    description:
      'Linux コマンドをゲーム感覚で学べる学習アプリ。課題に応じてコマンド列を組み立て、実行結果とテストケースで即フィードバックを受けながら理解を深められます。簡易DDDとミニTDDを軸に、Claude Code / Codex を活用したAI駆動開発でフル実装中です。',
    screenshots: [
      {
        src: '/images/czz/TOP.png',
        caption: 'TOP',
        alt: 'czz のTOPページ画面',
        width: 386,
        height: 836,
      },
      {
        src: '/images/czz/Tasks.png',
        caption: '課題一覧',
        alt: 'czz の課題一覧画面',
        width: 388,
        height: 842,
      },
      {
        src: '/images/czz/Results.png',
        caption: '実行結果',
        alt: 'czz の実行結果画面',
        width: 386,
        height: 846,
      },
    ],
    structure: [
      'monorepo: apps/user, apps/admin, packages/domain, packages/dsl-core, infra/*',
      'clean architecture: Domain → Application → Infra',
      'Zod境界 / Repository interface / TDD',
    ],
    techStack: [
      'Next.js(App Router) / TypeScript / pnpm',
      'Tailwind / shadcn/ui / Zustand / SWR',
      'Drizzle ORM + PostgreSQL',
      'Vitest / Playwright',
    ],
    highlights: [
      'DSLで課題を解くゲーム（指示構築）',
      '検証コマンドとevidenceログ運用',
      '安全性 / 変更容易性 / 性能 / 運用の4軸で判断',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/chapy0706/czz' },
      // TODO: デモ公開後に href を設定
      { label: 'デモ' },
      // TODO: 記事公開後に href を設定
      { label: '記事' },
    ],
  },
];
