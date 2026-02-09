<!-- docs/specs/active/README.md -->
# docs/specs/active について

ここは Spec（仕様）の「真実（Single Source of Truth）」を置く場所。
Issue本文は入口で、時間が経つと古くなる前提。

## 置くもの
- いま動かす spec（実装・修正の根拠になるもの）

## 置かないもの
- メモ的な議事録
- 実装ログの全文（evidence に置く）

## 運用
- Spec は「推測しなくて済む」粒度で書く
- `make verify` / `make evidence` を最後に必ず回す
- 引継ぎ4点（spec/差分/sha/log）を残す
