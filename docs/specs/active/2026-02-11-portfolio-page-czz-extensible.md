<!-- docs/specs/active/2026-02-11-portfolio-page-czz-extensible.md -->
# Spec: ポートフォリオページを「既存構成を活かしつつ」拡張可能に整える（czz の実例を追加）

## 1. Spec の要約
ポートフォリオページの全体構成は大きく変えずに、czz アプリの情報（リンク・構成・技術・見どころ）を追加する。  
今後の増築に備えて、Projects のデータ構造を用意し、データ追加でカードを増やせるようにする。  
最後に verify/evidence を必ず回し、証拠を残す。

## 2. Context（現状と当たり）
リポジトリ構成上、ページは `src/pages/*.astro` にある。  
ポートフォリオページの実体は、まずヘッダー/ナビのリンク先で特定する。

推定の当たり（実際に確認して確定）:
- `src/pages/about.astro`（自己紹介ページとしてポートフォリオ要素が入っている可能性）
- `src/pages/use-cases.astro`（テーマ由来の “Use cases” が実質ポートフォリオの可能性）
- `src/pages/capabilities.astro`（実績/強みページとしての可能性）
- `src/components/Header.astro` と `src/config/site.ts`（ナビの定義があり得る）

## 3. Goals / Non-goals
### Goals
- 既存のページ構成と雰囲気を維持（見出し階層・セクション順の大崩れを避ける）
- czz を 1 プロジェクトとして「説明できる」状態にする  
  - リンク（Repo / 本番 / Docs）
  - 構成（monorepo、packages、DSL、clean architecture 等の短い説明）
  - 技術スタック（Next.js/TS/pnpm/Drizzle/PostgreSQL など）
  - 見どころ（境界、Zod、Repository interface、TDD、運用コマンド 等）
- 将来増える前提で、プロジェクト一覧を“データ駆動”にする（追加が簡単）
- `make verify` / `make evidence` を必須化

### Non-goals
- ポートフォリオページの全面刷新（構成を作り直す）
- 他ページの大幅改修
- React コンポーネントの追加による hydration 増（必要最小限）

## 4. Design（設計方針）
### 4.1 表示の基本方針
- 既存ページのセクション構成は基本そのまま。
- 「Projects（制作物）」セクションを追加、もしくは既存の“それっぽい”セクションに差し込む。
- czz は最初の 1 件として固定で入れる。
- 画像は必須にしない（将来スクショを足せる枠だけ用意）。

### 4.2 データの置き場所（Projects）
安全性・変更容易性を優先して、最小の新規ファイルで管理する。

推奨（Option A）:
- `src/config/projects.ts` を追加し、`Project` 型と `projects` 配列を置く  
  - czz 1 件を最初から定義  
  - URL は未確定でもプレースホルダのまま可（`TODO` コメント）
- 表示側は `src/components/ProjectCard.astro` / `src/components/ProjectGrid.astro` のように小さく分離

代替（Option B）:
- Content Collections に `projects` を追加（schema/運用変更が入るため今回は避ける）

### 4.3 czz プロジェクトの内容（ページに出す情報）
ページには長文は載せず、短い要点に絞る。詳細はリンクへ逃がす。

- Links
  - Repository: `https://github.com/chapy0706/czz`
  - Production: `https://<czz-prod-url>`（未確定なら placeholder）
  - Docs: `https://<czz-docs-url>`（未確定なら placeholder。Repo の `docs/` でも可）
- Architecture / Structure（短く）
  - monorepo: `apps/user`, `apps/admin`, `packages/domain`, `packages/dsl-core`, `infra/*`
  - clean architecture: Domain → Application → Infra の依存方向
  - Zod 境界、Repository interface、TDD
- Tech stack
  - Next.js(App Router) / TypeScript / pnpm
  - Tailwind / shadcn/ui / Zustand / SWR
  - Drizzle ORM + PostgreSQL
  - Vitest / Playwright
- Highlights（見どころ）
  - DSL で課題を解くゲーム（指示構築）
  - 検証コマンドと evidence ログ運用
  - 安全性/変更容易性/性能/運用の4軸で判断

## 5. Safety/Quality（4軸）
- 安全性: `.env*` や secrets は扱わない。外部送信禁止。URL は設定値で管理。
- 変更容易性: 変更範囲を「ポートフォリオページ + projects.ts + 小コンポーネント」に限定。
- 性能: 静的レンダ中心。JS は増やさない。
- 運用: verify/evidence と引継ぎ4点を必須化。

## 6. Touch 範囲（Codex 制約）
許可（必要最小限）:
- ポートフォリオページ本体（確定後の `src/pages/*.astro` 1 ファイル）
- `src/components/**`（Projects 表示のための新規コンポーネントのみ）
- `src/config/projects.ts`（新規）
- `src/styles/**`（必要最小限）
- `docs/**`（この Spec/Issue/記録）

禁止:
- `dist/**`（生成物）
- `src/content/config.ts`（schema 変更）
- `astro.config.mjs`（今回触らない）
- `scripts/**`（今回触らない）

## 7. Implementation Plan（最小ステップ）
1) ナビ定義から「ポートフォリオページ」の実体ファイルを特定（Header/site.ts 等）  
2) 既存構成を保ったまま、Projects セクションを差し込む位置を決める  
3) `src/config/projects.ts` を追加し、`projects` に czz を定義（URL は placeholder 可）  
4) Projects 表示の小コンポーネント（Card/Grid）を追加  
5) ポートフォリオページに Projects セクションを追加（czz が表示される）  
6) `make verify`  
7) `make evidence`  
8) 引継ぎ4点を記録  

## 8. Acceptance Criteria
- ポートフォリオページの主要構成が維持されている（大崩れしない）
- Projects セクションが追加され、czz が 1 件表示される
- czz にはリンク枠（Repo/Prod/Docs）がある（未確定は placeholder でも良い）
- 将来、`projects.ts` に 1 件追加すると表示が増える
- `make verify` が通る
- `make evidence` が通り、ログが `out/evidence/` に保存される
- 引継ぎ4点（spec/差分/sha/log）が揃う

## 9. Verification
- `make verify`
- `make evidence`
- 目視: ポートフォリオページで czz が表示され、構成が崩れていない

## 10. 引継ぎ4点（必須）
```
spec: docs/specs/active/2026-02-11-portfolio-page-czz-extensible.md
files:
- <git diff --name-only>
sha: <git rev-parse --short HEAD>
evidence: out/evidence/<latest>.log
```
