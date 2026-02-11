<!-- docs/issues/2026-02-11-portfolio-page-czz-extensible.md -->
# Issue: ポートフォリオページを「既存構成を活かしつつ」拡張可能に整える（czz の実例を追加）

## 背景 / 現状
- ポートフォリオページは存在しているが、現状はテーマ由来の一般的な構成で、本人の制作物（czz 等）を十分に説明できていない。
- 今後、ポートフォリオ（スクショ/リンク/説明）が増える予定なので、追記しやすい“器”を先に用意しておきたい。

## 目的（Why）
- 既存のページ構成・雰囲気は大きく崩さずに活かす。
- czz アプリについて、最低限の「リンク」「構成」「技術」「見どころ」をページ上で説明できるようにする。
- 将来の増築（プロジェクト追加）を、データ追加で済む形に寄せる。
- AI協奏フロー（Spec → /codex → /claude-codex-workflow → Codex → verify/evidence）で安全に回す。

## スコープ（Do / Don’t）
### Do
- 「ポートフォリオページ」に czz セクションを追加  
  - リンク（Repo / 本番 / Docs）を置ける（URLは設定値化し、未確定ならプレースホルダ）
  - 構成（monorepo + clean architecture + DSL コア等）を短く説明
  - 技術スタックと見どころ（境界、Zod、Repository interface、TDD、運用コマンド 等）を箇条書きで出す
- 将来のプロジェクトを追記できる“枠”（Projects 配列 + 表示コンポーネント）を用意
- 表示はできるだけ静的（Astro）で、重いクライアント JS を増やさない
- verify/evidence を必須化

### Don’t
- ページ全体の情報設計を作り直す（構成は活かす）
- 既存 URL を壊す / 既存ページを削除する
- 破壊的リファクタ、テーマ全面置換
- 外部ネットワークアクセスで画像を引っ張ってくる（ローカル参照のみ）

## 成果物
- Spec: `docs/specs/active/2026-02-11-portfolio-page-czz-extensible.md`
- Codex プロンプト: `docs/prompts/codex/2026-02-11-portfolio-page-czz-extensible.md`
- PoC 1往復（実装 → verify → evidence）

## Evidence（必須）
- `make verify`
- `make evidence`（`out/evidence/` にログ保存）

## DoD（Definition of Done）
- ポートフォリオページの見た目・構成が大きく崩れていない（主要セクションが残る）
- czz セクションが追加されている（リンク枠/構成/技術/見どころ）
- 今後プロジェクトが増えた時、データ追加で1件増やせる形になっている
- `make verify` が通る
- `make evidence` が通り、ログが保存されている
- 引継ぎ4点（spec/差分/sha/log）が揃う

## 作業記録
- 2026-02-11: Projects データ構造と表示コンポーネントを追加。ポートフォリオページに czz を表示。
