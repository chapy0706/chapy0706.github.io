<!-- docs/specs/active/2026-02-10-home-redesign-portfolio-blog-preview.md -->
# Spec: TOP をポートフォリオ中心に再設計（Portfolio/Blog プレビュー）

## 1. Spec の要約
TOP を「ポートフォリオ＋ブログ中心」に寄せる。テーマ由来の英語や物流系画像を TOP から外し、将来増えるスクショと記事を自然に見せる。変更は最小差分で、安全に verify/evidence まで回す。

## 2. Context
現状の TOP はテーマ由来の英語コピー、物流系の画像・セクションが目立つ。
サイトの目的（ポートフォリオ + ブログ）と一致させたい。

リポジトリ上の当たり:
- TOP: `src/pages/index.astro`
- HOME コンポーネント群: `src/components/home/*`
  - 物流テーマっぽい中心: `PremiumHero.astro` や `ImageGrid.astro`、`IndustriesServed.astro` 等
- 既存ブログ: `src/content/posts/*` と `src/pages/posts/*`
- 既存画像: `src/assets/photo-*.jpg`（多い） / `public/chapy.jpg` / `public/diagrams/skill-map.svg`

## 3. Goals / Non-goals
### Goals
- TOP を見た瞬間に「Portfolio / Blog / Profile」が分かる
- 英語コピーを TOP から排除（必要なら他ページへ隔離）
- 物流系/不要画像を TOP から排除（将来のスクショに置き換え前提）
- Blog は最新3件を TOP でプレビュー
- Portfolio は将来差し替えやすいデータ構造でプレビュー（いまはプレースホルダ可）
- `make verify` / `make evidence` を必ず通し、証拠を残す

### Non-goals
- 既存ページ URL を壊す（capabilities/facilities/rfq/use-cases 等）
- テーマ全面置換、サイト全体の大規模リファクタ
- 重いクライアント JS の追加（React hydration 前提の派手演出）

## 4. Design（方針）

### 4.1 TOP の情報設計（提案）
1) Hero（日本語）
- 1行で「何のサイトか」
- 2行で「何が置いてあるか」
- CTA: 「ポートフォリオを見る」「ブログを読む」「自己紹介」

2) Portfolio Preview（グリッド 3〜6）
- 作品タイトル / ひとこと / 技術タグ / 画像（スクショ）
- 画像は `public/portfolio/*` を参照する方針（将来差し替えが容易）
- いまは `public/diagrams/skill-map.svg` 等のプレースホルダでもよい

3) Blog Preview（最新3件）
- `getCollection('posts')` から pubDate で降順
- タイトル / description / pubDate / tag（あるなら）
- `src/pages/posts/index.astro` の UI と似せる（再利用できるなら再利用）

4) About Snippet（短い自己紹介）
- `about` への導線を明確化

### 4.2 データの置き場所（Portfolio）
実装の安全性と変更容易性を優先し、まずは 設定ファイル or JSON のどちらかに寄せる。
- Option A（最小差分）: `src/config/site.ts` に `portfolioItems` を追加（配列）
- Option B（将来拡張）: `src/content/portfolio/projects.json` を追加（Content として管理）

PoC は A を推奨（ファイル数が少なく、壊れにくい）。
後から B に移すのは容易。

### 4.3 不要セクションの扱い
削除ではなく、TOP の composition から外す。
- `src/pages/index.astro` で import/use している HOME セクションを整理し、必要なものだけ残す
- 既存ページは残す（URL維持）

## 5. Safety/Quality（4軸）
- 安全性: `.env*` や secrets に触れない。外部送信禁止。画像はローカル参照。
- 変更容易性: TOP の変更範囲を `src/pages/index.astro` と `src/components/home/*` に閉じる。データは一箇所に寄せる。
- 性能: TOP で hydration 前提の React コンポーネントを増やさない。静的レンダ中心。
- 運用: verify/evidence を必須化。引継ぎ4点を残す。

## 6. Touch 範囲（Codex に渡す制約）
許可:
- `src/pages/index.astro`
- `src/components/home/**`（必要最小限）
- `src/config/site.ts`（Option A を選ぶ場合）
- `public/portfolio/**`（プレースホルダ追加する場合のみ。既存破壊禁止）
- `src/styles/**`（必要最小限）
- `docs/**`（この Spec/Issue/記録のみ）

禁止:
- `astro.config.mjs`（今回触らない）
- `src/content/config.ts` / schema（今回触らない）
- `dist/**`（生成物。触らない）
- `scripts/**`（今回触らない）

## 7. Implementation Plan（最小ステップ）
1) 現状 TOP の import/use を確認し、表示セクションを列挙（ファイル名と責務）
2) Hero を日本語化し、物流テーマ感の強いコピー/画像を外す
3) Portfolio Preview を追加（データは Option A 推奨）
4) Blog Preview を追加（最新3件）
5) 不要な HOME セクションは TOP から除外（削除しない）
6) `make verify`
7) `make evidence`
8) 引継ぎ4点を `docs/runbook/` か該当 issue コメントに記録

## 8. Acceptance Criteria
- TOP に英語の見出し/CTA/スタッツが残らない（目視）
- TOP に `src/assets/photo-*.jpg` 由来の画像が表示されない（目視）
- TOP に「Portfolio Preview」「Blog Preview（最新3件）」が表示される
- Blog Preview は `pubDate` 降順で最新3件
- 既存のビルドが壊れない（`make verify` が通る）
- `make evidence` でログが `out/evidence/` に保存される
- 引継ぎ4点が揃う

## 9. Verification
- `make verify`
- `make evidence`
- 目視: TOP の Hero/Portfolio/Blog が意図通りで、英語・不要画像が消えている

## 10. 引継ぎ4点（必須）
```
spec: docs/specs/active/2026-02-10-home-redesign-portfolio-blog-preview.md
files:
- <git diff --name-only>
sha: <git rev-parse --short HEAD>
evidence: out/evidence/<latest>.log
```
