<!-- docs/issues/2026-02-12-about-tech-logos-kawaiilogos-attribution.md -->
# Issue: Aboutページの技術スタックにロゴを表示し、KawaiiLogosのクレジットを明記する

## 背景 / 現状
- `public/logos/` に技術スタック用のロゴ画像を追加した。
- これらは「SAWARATSUKI/KawaiiLogos（通称 KawaiiLogos）」由来の素材なので、クレジットを明記して敬意を示したい。
- Aboutページ（自己紹介）に技術スタックの視覚情報があると、初見の理解が速い。

## 目的（Why）
- Aboutページの「技術スタック」セクションに、`public/logos/` の画像を並べて表示する。
- 併せて `SAWARATSUKI/KawaiiLogos` へのクレジット（リンク）を明記する。
- 将来ロゴが増えたとき、データ追加で増やせる形に寄せる（拡張性）。
- verify/evidence を回して変更の安全性を担保する。

## スコープ（Do / Don’t）
### Do
- Aboutページに「Tech Logos」表示を追加（レスポンシブなグリッド）
- `src/config/tech-logos.ts` 等の小さなデータ定義を用意（追加が容易）
- クレジット表示（リンク）を技術スタック付近に追加
- 画像はローカル参照（`/logos/...`）のみ、外部取得しない
- `make verify` と `make evidence` を必須

### Don’t
- 既存ページの構造を大きく作り直す
- 重いクライアントJSを増やす（可能な限り Astro の静的で）
- `dist/**` の生成物を触る
- `.env*` / secrets 取り扱い

## 注意（ライセンス観点）
- KawaiiLogos 側の説明では「個人の利用に限り自由に使用可能」「商用利用は原則不可（例外条件あり）」などの条件がある。
- このサイト運用が「商用」に該当するか不明な場合は、KawaiiLogos の規約と各ロゴの条件を確認すること。
- 本Issueでは “クレジット明記” までを必須とする（規約上は必須でない場合もあるが、明記すると作者のモチベーションになる旨が示されている）。

参照:
- https://github.com/SAWARATSUKI/KawaiiLogos

## 成果物
- Spec: `docs/specs/active/2026-02-12-about-tech-logos-kawaiilogos-attribution.md`
- Codex プロンプト: `docs/prompts/codex/2026-02-12-about-tech-logos-kawaiilogos-attribution.md`

## Evidence（必須）
- `make verify`
- `make evidence`（`out/evidence/` にログ保存）

## DoD（Definition of Done）
- Aboutページに技術ロゴが表示される（スマホでも崩れない）
- 画像には alt があり、クリックで公式サイト/関連URLへ飛べる（可能なら）
- クレジットが技術スタック付近に表示される（リンク付き）
- `make verify` が通る
- `make evidence` が通り、ログが `out/evidence/` に保存される
