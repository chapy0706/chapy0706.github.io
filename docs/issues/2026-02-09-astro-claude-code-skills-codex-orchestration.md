<!-- docs/issues/2026-02-09-astro-claude-code-skills-codex-orchestration.md -->
# Issue: Astro repo でも Claude Code Skills で Codex 連携をワークフロー化する（#70/#73 準拠）

## Issue の要点
- Issue は入口（古くなる前提）
- Spec は真実（SSoT）: `docs/specs/active/`
- Skills を使って「Plan → Approve → Implement → Verify」をコマンド化する
- 仕上げは必ず `make verify` と `make evidence`

## Context（背景 / 現状）
- Astro 側でも AI 協奏（Claude Code / Codex）を定型化して、ズレと事故確率を下げたい。
- 手順のコピペ依存を減らし、毎回同じ品質で回るようにしたい。

## Goal（勝利条件）
- Claude Code Skills 経由で、Codex 実行（実装）までを一定の手順で再現できる
- Spec を SSoT のまま維持しつつ、verify/evidence までを必須化できる
- PoC で「実装 → verify → evidence → 引継ぎ4点」が揃う（成功ログが残る）

## Non-goals（やらないこと）
- Astro サイトの大規模リファクタ/UX刷新（Skills 導入検証に無関係なもの）
- MCP 等の別方式への全面移行（まずは Skills + CLI 連携の PoC）
- 認証/権限/Secrets まわりの大改修（このIssueでは触らない）

## Scope（Do / Don’t）
### Do（このIssueでやる）
- `.claude/skills/` に最低2つのスキルを追加
  - `/codex`（read-only: 実装方針 / 影響範囲 / リスク整理）
  - `/claude-codex-workflow`（Codex に渡すプロンプト生成 + verify/evidence の必須化）
- Skills が参照すべき真実の場所を固定
  - Spec パス、禁止事項、Evidence 手順
- PoC 用 Spec を 1 本作り、変更はその範囲だけに閉じる
- `out/evidence/` にログを残し、引継ぎ4点（spec/差分/sha/log）を出せる状態にする

### Don’t（このIssueではやらない）
- 人間の Approve を省略する設計（自動承認の高度化）
- 既存 runbook の全面書き換え（必要最小限の追記に留める）
- 破壊的な自動化（push/force/リポジトリ操作の暴走を許す形）

## Spec（Single Source of Truth）
- `docs/specs/active/2026-02-09-astro-claude-code-skills-codex-orchestration.md`

## Evidence（証拠）
- `make verify`
- `make evidence`（out/evidence にログ保存）
- （任意）PoC 前後で `git diff --name-only` を保存（取り違え検知）

## DoD（Definition of Done）
- Spec の Acceptance Criteria を満たす
- Skills を使った PoC が 1 回以上成功（実装 → verify → evidence）
- 引継ぎ4点（spec/差分/sha/log）が揃う
- 機密情報が repo に含まれない（`.env* / tokens / secrets` を扱わない）
- 失敗した場合でも「失敗ログ」「次に直す場所」が残っている

## Next（推奨手順）
1. Spec 作成（AC / ガード / 手順 / 期待ログ）
2. `.claude/skills/` に 2 コマンド追加（/codex と /claude-codex-workflow）
3. PoC（小さな修正 1 つ）で verify/evidence を回す
4. 成功後、運用ドキュメント（runbook / docs/ai）に反映
