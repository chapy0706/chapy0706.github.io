<!-- docs/ai/EVIDENCE.md -->
# EVIDENCE（検証ログ保存の方針）

## 目的
必要なときだけ「検証ログを保存」して、原因の当たりを早くする。

## 保存先と命名
- 保存先: `out/evidence/`
- 命名: `YYYYMMDD-HHMMSS_<shortsha>_<command>.log`

## どうやって作る？
- `make evidence`（ci を実行して保存）
- `make evidence-verify`（verify を実行して保存）

## ログはコミットしない
ログはサイズ増と混入事故のリスクがあるため、原則コミットしない。
