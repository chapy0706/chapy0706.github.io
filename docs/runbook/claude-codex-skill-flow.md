<!-- docs/runbook/claude-codex-skill-flow.md -->
# Runbook: Spec → /codex → /claude-codex-workflow → Codex（実装）運用フロー（Astro）

このドキュメントは、このリポジトリ内で Claude Code と Codex を安全に協奏させる共通手順を固定するためのもの。
「毎回説明しなくても、同じ品質で動く」状態を目指す。

## このフローで達成したいこと
- 仕様の単一の真実（SSoT）を `docs/specs/active/*.md` に置き、手戻り（ズレ）を減らす
- 実装担当（Codex）が推測しないように、入力（spec）を揃える
- 最後に `make verify` と `make evidence` を必ず回し、証拠ログを残す
- 「Plan → Approve → Implement → Verify」を型として固定する

## 前提（守るルール）
- 真実は `docs/specs/active/<spec>.md`（Issue本文は入口。古くなる前提）
- `.env / keys / tokens / secrets` は読まない・出さない・コミットしない
- 破壊的コマンド禁止（`rm -rf` / `git reset --hard` / force push など）
- 外部ネットワークアクセスは原則しない（必要なら人間判断）
- 読む前に絞る（rg/grep、範囲指定。全体読みをしない）

参照:
- `docs/ai/AGENTS.md`
- `docs/ai/CLAUDE.md`
- `.claude/skills/*`（/codex, /claude-codex-workflow）

## ディレクトリ配置
- Spec（真実）: `docs/specs/active/<YYYY-MM-DD-...>.md`
- Issue（入口）: `docs/issues/<YYYY-MM-DD-...>.md`
- Runbook: `docs/runbook/*`
- Skills（コマンド化）:
  - `.claude/skills/codex/SKILL.md`
  - `.claude/skills/claude-codex-workflow/SKILL.md`

## 運用フロー（最短）
### Step 0: Spec を書く
- Goal / Non-goals
- Acceptance Criteria
- 調査の当たり（候補ファイル）
- Implementation Plan（最小ステップ）
- Test Plan（`make verify` / `make evidence`）

### Step 1: /codex（Plan: read-only）
入力例:
- `/codex spec=docs/specs/active/<spec>.md`

期待する出力:
1. Spec要約
2. 変更対象の当たり（候補ファイル・責務）
3. リスク（安全/変更容易性/性能/運用）
4. 実行計画（verify/evidence まで）
5. Codex プロンプト（最小）

### Step 2: Approve（人間）
- AC と一致しているか
- touch 範囲が狭いか
- 禁止事項に触れていないか

### Step 3: /claude-codex-workflow（Codexプロンプト生成）
入力例:
- `/claude-codex-workflow spec=docs/specs/active/<spec>.md mode=poc`

出力（最低限）:
- do / dont / touch / must（verify/evidence + 引継ぎ4点）/ output

### Step 4: Codex（Implement）
- touch を狭く（勝手に広げさせない）
- `git push` しない（最終は人間）

### Step 5: Verify（品質ゲート）
- `make verify`
- `make evidence`
- 引継ぎ4点（spec/差分/sha/log）を揃える

## 引継ぎ4点テンプレ
```
spec: docs/specs/active/<spec>.md
files:
- <git diff --name-only>
sha: <git rev-parse --short HEAD>
evidence: out/evidence/<latest>.log
```

## よくある落とし穴
- 曖昧表現だけで spec を書く → 具体化（DOM非生成/幅/余白/対象ページ）
- CSSで隠すだけ → 非表示要件なら DOM非生成 を明記
- touch が広い → `src/` の狙った範囲に閉じる
- verify/evidence を忘れる → 儀式として固定
