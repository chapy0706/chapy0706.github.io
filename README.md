<!-- /README.md -->

# chapy0706.github.io

ポートフォリオサイト兼ブログのソースコード。Astro で静的生成し、GitHub Pages にデプロイします。

## 概要

- ポートフォリオ（プロフィール、制作物、スキル等）
- ブログ（Markdown を Content Collections で管理）
- GitHub Actions で自動ビルド・自動デプロイ

## 技術スタック

- Astro
- TypeScript
- Markdown（Astro Content Collections）
- pnpm（Corepack 推奨）
- GitHub Actions / GitHub Pages

## ローカル開発

前提: Node.js（LTS 推奨）、pnpm（Corepack 経由推奨）

```bash
corepack enable
pnpm install
pnpm dev
```

- 開発サーバ: `http://localhost:4321`（デフォルト）

ビルドとプレビュー:

```bash
pnpm build
pnpm preview
```

## 記事の追加

記事は `src/content/` 配下のコレクションに Markdown を追加します。  
（例: `src/content/blog/` または `src/content/posts/`。このリポジトリの実際のコレクション名に合わせてください）

例（Frontmatter はプロジェクトの schema に合わせて調整）:

```md
---
title: "記事タイトル"
description: "短い説明"
pubDate: 2026-02-04
tags: ["tag1", "tag2"]
---

本文…
```

## デプロイ（GitHub Pages）

GitHub Actions でビルドして Pages にデプロイします。Astro 公式の GitHub Pages ガイドを参照してください。

運用メモ:
- `astro.config.*` の `site` / `base` は GitHub Pages の公開形態に合わせて設定します。
- Secret が必要な場合は GitHub Secrets を使用し、リポジトリに直書きしません。

## ドキュメント

詳細は `docs/` を参照（移行メモ、画像運用、トラブルシュート等）。
- `docs/` が未作成の場合は、既存のメモ類を順次移動して README からリンクします。

## ライセンス

- ソースコード: MIT License（詳細は LICENSE を参照）
- コンテンツ（記事・画像など）: 必要に応じて別ライセンスを適用してください  
  - 例: 記事は CC BY 4.0 / または All Rights Reserved など  
  - 第三者アセット（画像・BGM・フォント等）を含む場合は、その配布条件が優先されます

## Credits

- Base template: AstroFlow（MIT）
