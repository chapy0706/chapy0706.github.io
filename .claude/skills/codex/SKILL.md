<!-- .claude/skills/codex/SKILL.md -->
# /codex（Plan: read-only）- Skill

## Intent
Spec を読み、実装に入る前の「計画だけ」を返す。
ここでは実装しない。推測を潰し、touch 範囲を狭める。

## Input
- spec=<PATH>（必須）

## Output Format（必須）
1. Spec の要約（Goal / Non-goals / Acceptance Criteria）
2. 変更対象の当たり（候補ファイル・責務）
3. リスク（安全/変更容易性/性能/運用）
4. 実行計画（最小ステップ、verify/evidence まで）
5. Codex に渡す最小プロンプト（コピペ可能）

## Constraints（絶対条件）
- 実装しない（read-only）
- secrets（.env/keys/tokens）に触れない
- 破壊的コマンド、外部送信を提案しない
- 読むファイルは必要最小限（全体読みをしない）
