<!-- docs/specs/active/2026-02-09-astro-claude-code-skills-codex-orchestration.md -->
# Spec: Claude Code Skills で Codex 連携をワークフロー化（Astro repo）

## 概要（One-liner）
Claude Code Skills に `/codex` と `/claude-codex-workflow` を追加し、Spec 駆動の PoC を 1 往復回せる状態にする。

## 背景（Context）
- AI 協奏は速いが、手順が散ると「推測」「ついで修正」「事故」が増える。
- Issue 本文は入口、Spec を真実にして、ワークフローを Skills と runbook に固定したい。

## 目的（Goals）
- Plan → Approve → Implement → Verify を、毎回同じ導線で回せる
- Spec（SSoT）を崩さず、verify/evidence を儀式として固定する
- 引継ぎ4点（spec/差分/sha/log）が必ず揃う

## 非目的（Non-goals）
- Skills の自動承認（人間の Approve を省略する）
- 既存 CI の大幅改修
- 大規模なサイト改修

## 仕様（Specification）

### 1) ディレクトリ配置（SSoT の固定）
- Spec（真実）: `docs/specs/active/*.md`
- Issue（入口）: `docs/issues/*.md`
- Runbook（運用手順）: `docs/runbook/*.md`
- Skills（コマンド化）:
  - `.claude/skills/codex/SKILL.md`
  - `.claude/skills/claude-codex-workflow/SKILL.md`

### 2) Skills の仕様

#### `/codex`（Plan: read-only）
入力:
- `spec=<PATH>`（必須）

出力（最低限）:
1. Spec 要約（Goal / Non-goals / Acceptance Criteria）
2. 変更対象の当たり（候補ファイル・責務）
3. リスク（安全/変更容易性/性能/運用）
4. 実行計画（最小ステップ、verify/evidence まで）
5. Codex に渡す最小プロンプト（テンプレ）

制約:
- 実装はしない（read-only の計画のみ）

#### `/claude-codex-workflow`（Codex プロンプト生成）
入力:
- `spec=<PATH>`（必須）
- `mode=<poc|normal>`（任意、デフォルト `poc`）

出力（最低限含める）:
- spec: <PATH>
- mode: <poc|normal>
- do: 3〜10行（やること）
- dont: 禁止事項（secrets/破壊的コマンド/外部アクセス）
- touch: 触って良い領域（重要）
- must: verify/evidence、引継ぎ4点
- output: 変更ファイル一覧 / sha / evidenceログ名

### 3) PoC の内容（最小1往復）
PoC は「小さな修正 1 つ」でよい。例:
- 文言修正（1ファイル）
- CSS 微調整（1ファイル）
- 画像表示の微調整（1ファイル）

重要:
- touch 範囲を絞る（関係ないファイルに触れない）
- verify/evidence を最後に必ず回す

### 4) Evidence（証拠ログ）
必須:
- `make verify`
- `make evidence`

出力:
- `out/evidence/YYYYMMDD-HHMMSS_<shortsha>_<command>.log`

### 5) 引継ぎ4点（必須）
```
spec: docs/specs/active/2026-02-09-astro-claude-code-skills-codex-orchestration.md
files:
- <git diff --name-only の結果>
sha: <git rev-parse --short HEAD>
evidence: out/evidence/<latest>.log
```

## 受け入れ条件（Acceptance Criteria）
- `.claude/skills/` に 2 スキルが存在し、内容がこの Spec と矛盾しない
- runbook に手順が整理され、PoC を 1 往復回せる
- PoC を実際に 1 回成功させられる（実装 → verify → evidence）
- 引継ぎ4点が揃う
- secrets（`.env* / tokens / keys`）が repo に含まれない

## テスト/検証手順（Verification）
1. `/codex spec=docs/specs/active/2026-02-09-astro-claude-code-skills-codex-orchestration.md` を実行し、Plan を得る
2. 人間が Approve（touch 範囲と禁止事項が守れているか）
3. `/claude-codex-workflow spec=... mode=poc` で Codex プロンプト生成
4. Codex 実装
5. `make verify`
6. `make evidence`
7. 引継ぎ4点を記録

## ロールバック（Rollback）
- PoC の変更は最小なので、対象ファイルを元に戻して `make verify` で確認する
- もしくは PoC のコミットを revert する
