<!-- docs/issues/2026-02-10-home-redesign-portfolio-blog-preview.md -->
# Issue: TOP をポートフォリオ中心に再設計（英語/不要画像を整理し、Portfolio/Blog を前面に）

## 背景 / 現状
- TOP がテーマ由来の英語コピーや物流系の画像・セクションを多く含み、サイト目的（ポートフォリオ＋ブログ）と一致していない。
- 将来増える予定の「ポートフォリオのスクショ」「ブログ記事」を、TOP で自然に見せたい。
- 既に AI ワークフロー（Spec → /codex → /claude-codex-workflow → Codex → verify/evidence）を導入済みなので、これに乗せて安全に変更したい。

## 目的（Why）
- TOP を見た瞬間に「ここに何があるか」が分かる（Portfolio / Blog / Profile 導線）。
- 英語や無関係な画像を減らし、本人の文脈（制作物・記事・スキル）を前に出す。
- 変更を最小差分で安全に回し、verify/evidence まで証拠を残す。

## スコープ（Do / Don’t）
### Do
- TOP（`src/pages/index.astro`）の構成を「ポートフォリオ + ブログ中心」に組み替える
- 英語コピー・物流系/不要な画像・不要セクションを TOP から外す（ページ自体の削除はしない）
- 「Portfolio プレビュー（カード/グリッド）」と「最新 Blog プレビュー（最新3件）」を TOP に追加
- 画像は将来差し替えやすい形（`public/portfolio/*` など）に寄せ、いまはプレースホルダ運用も許容

### Don’t
- サイト全体の大規模リファクタ、テーマ全面置換
- 既存ページ（capabilities/facilities/rfq 等）を消す・URL を壊す
- 重いクライアント JS を増やす（React hydration 前提の演出増加は避ける）

## 成果物
- Spec: `docs/specs/active/2026-02-10-home-redesign-portfolio-blog-preview.md`
- PoC 1往復（実装 → verify → evidence）

## Evidence（必須）
- `make verify`
- `make evidence`（`out/evidence/` にログ）

## DoD（Definition of Done）
- TOP に英語の見出し/CTA/スタッツが残らない
- TOP から「物流テーマ感の強い画像（src/assets の photo-*.jpg 等）」が消える（少なくとも表示されない）
- TOP に以下のセクションが揃う
  - Hero（日本語・本人文脈）
  - Portfolio プレビュー（カード/グリッド。将来のスクショ差し替え前提）
  - Blog プレビュー（最新3件）
- 既存の `make verify` が通る
- `make evidence` が通り、ログが保存されている
- 引継ぎ4点（spec/差分/sha/log）が揃う
