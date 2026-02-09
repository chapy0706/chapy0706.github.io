<!-- .claude/skills/claude-codex-workflow/SKILL.md -->
# /claude-codex-workflow（Codex Prompt Generator）- Skill

## Intent
Spec を元に、Codex CLI に渡す「実装プロンプト」を生成する。
Plan → Approve の後に使う。verify/evidence を必須化する。

## Input
- spec=<PATH>（必須）
- mode=<poc|normal>（任意、デフォルト poc）

## Output Format（必須）
次のブロックをコピペできる形で返す。

- spec: <PATH>
- mode: <poc|normal>
- do: 3〜10行（最小差分）
- dont: secrets/破壊的コマンド/外部アクセス/勝手な範囲拡大
- touch: 触って良い領域（必ず狭く）
  - 例: src/components/**, src/pages/**, src/styles/**, src/content/**, astro.config.mjs, docs/**, scripts/**
- must:
  - make verify
  - make evidence
  - 引継ぎ4点（spec/差分/sha/log）
- output:
  - 変更ファイル一覧（git diff --name-only）
  - sha（git rev-parse --short HEAD）
  - evidenceログ名（out/evidence/*.log）

## Constraints（絶対条件）
- push/force/履歴改変を含めない
- `.env*` を読ませない / 出させない
- 関係ないファイルへの「ついで修正」を禁止する
