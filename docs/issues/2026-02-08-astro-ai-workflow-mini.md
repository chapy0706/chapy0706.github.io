<!-- docs/issues/2026-02-08-astro-ai-workflow-mini.md -->
# Issue: Astro repo に「#70 mini」AI開発運用を導入する（Spec駆動 + 品質ゲート + エビデンス）

## 背景 / なぜやるか（Why）

czz 側で運用している「Claude Code / Codex を最大限活用する」方針（Issue #70）を、Astro のポートフォリオ兼ブログにも移植したい。  
狙いは、実装速度だけでなく、以下を崩さずに継続できる仕組みを作ること。

- 仕様（Spec）を真実（Single Source of Truth）にする
- ルール違反（秘密情報・危険コマンド）を機械的に防ぐ
- 変更の品質ゲートを固定し、結果（エビデンス）を残す

## 目的（Goal）

- リポジトリ内に「AI運用の憲法」を置き、迷わず回せる状態にする
- AIが触る範囲・触ってはいけない範囲を明示し、事故確率を下げる
- `verify` / `ci` に相当するコマンドで、常に同じ検証を通す運用にする
- 重要な検証ログを `out/evidence/` に保存できるようにする（手動でもCIでも）

## スコープ（In scope）

- 運用ドキュメント（テンプレ含む）の追加
- 最小限の品質ゲートの標準化（既存 `scripts/verify.sh` / `scripts/ci.sh` を基点にする）
- エビデンス出力の型（ログの置き方、命名規則、最低限の項目）を定める

## 非スコープ（Out of scope）

- 本格的なAIツール設定の最適化（まずは最低限の安全運用）
- CIの全面設計変更（既存のActionsに最小追加で済ませる）
- 記事コンテンツの大量リライト（運用基盤を先に固める）

## 変更対象（作業項目）

### A. ドキュメントの導入（憲法 + テンプレ）

- `docs/ai/AGENTS.md`（役割分担・原則・禁則）を追加
- `docs/ai/CLAUDE.md`（Claude Code 用の運用ルール）を追加
- `docs/specs/SPEC_TEMPLATE.md`（Specテンプレ）を追加
- `docs/issues/ISSUE_TEMPLATE_AI_MINI.md`（Issueテンプレ）を追加
- `docs/ai/EVIDENCE.md`（エビデンスの方針）を追加

※今回はまずテンプレを `docs/templates/ai/` に置き、運用が固まったら実体を `docs/ai/` 等へ移す。

### B. 品質ゲートの固定（verify / ci）

- 既存 `scripts/verify.sh` を運用上の「真のverify」と定義する
- 既存 `scripts/ci.sh` を運用上の「真のci」と定義する
- README か docs に「どの場面でどれを叩くか」を明記する

### C. エビデンス出力（ログ保存）

- `out/evidence/` を出力先として採用する
- ファイル名: `YYYYMMDD-HHMMSS_<shortsha>_<command>.log`
- 最低限のログ項目（先頭にメタ情報）を記録する:
  - repo / branch / sha / timestamp / node / pnpm / astro / command / exit code

※CIでのログ保存は、最初は「手動で生成してコミットしない」運用でもよい。必要になったらArtifacts化する。

## 受け入れ条件（Definition of Done）

- `docs/templates/ai/` にテンプレ一式が存在し、内容が矛盾していない
- AI運用の原則（SSoT / 禁則 / 検証）がドキュメントで説明できる
- ローカルで `./scripts/ci.sh` が実行でき、失敗時に原因が追える
- エビデンス出力のルールが文書化され、テンプレで実際にログが残せる

## リスク / 注意点

- 秘密情報（SSH鍵・トークン・`.env*`）が混ざると一発アウト。AIに渡す情報を最小化する。
- Spec を増やしすぎると「読むのが面倒」で形骸化する。最初は薄く、効くところだけ厚くする。
- 検証を重くしすぎると運用が破綻する。`verify` は速く、`ci` は確実、の思想で分ける。

## 参考

- czz Issue #70: Claude Code / Codex 最大活用の運用設計
