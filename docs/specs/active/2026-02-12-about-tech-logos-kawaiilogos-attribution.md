<!-- docs/specs/active/2026-02-12-about-tech-logos-kawaiilogos-attribution.md -->
# Spec: Aboutページの技術スタックにロゴを表示し、KawaiiLogosのクレジットを明記する

## 1. Spec の要約
Aboutページの技術スタック付近に、`public/logos/` にあるロゴ画像をグリッド表示する。  
ロゴはデータ定義（配列）から生成して、追加しやすくする。  
併せて `SAWARATSUKI/KawaiiLogos` のクレジット（リンク）を明記する。  
最後に `make verify` / `make evidence` を必ず実行する。

## 2. 対象ファイル（Touch）
### 変更
- `src/pages/about.astro`（技術スタックセクションに差し込み）

### 追加（推奨）
- `src/config/tech-logos.ts`（ロゴ一覧のデータ定義）
- `src/components/tech/TechLogoGrid.astro`（表示コンポーネント）

### 触らない
- `dist/**`
- `astro.config.mjs`
- `src/content/config.ts`（schema変更は今回しない）
- `scripts/**`（既存運用を維持）

## 3. UI/UX 要件
- 1行に並べすぎず、レスポンシブで折り返す（grid + auto-fit など）
- ロゴは「均一なサイズ」で並ぶ（縦横比は壊さない）
- 画像には必ず alt を付ける
- クリックできる場合はリンクにする（例: GitHub, React, Next.js など）
- 画像の読み込みは `loading="lazy"` と `decoding="async"` を基本にする
- CLS（レイアウトずれ）を減らすため、可能なら width/height を付与する

## 4. データ設計（拡張性）
`src/config/tech-logos.ts` に `TechLogo` 型 + 配列 `techLogos` を置く。  
将来、`public/logos` に画像を足したら、配列に1件追加するだけで表示が増える。

最小プロパティ案:
- `id`: string
- `label`: 表示名
- `file`: `/logos/...` のパス（スペースがある場合は `%20` を使用）
- `href`: 公式/関連URL（任意）

初期投入（現時点の public/logos を前提）:
- Next.js.png
- React.png
- TypeScript.png
- Tailwindcss.png
- GitHub.png
- 404 NotFound.png（ファイル名にスペースがあるため、URLは `%20` で扱う）

## 5. クレジット表記
Aboutページの技術スタック付近に、以下のようなクレジットを小さく表示する:

- “Tech logos inspired by KawaiiLogos by SAWARATSUKI”
- リンク: `https://github.com/SAWARATSUKI/KawaiiLogos`

注:
- KawaiiLogos の説明では「明記は必須ではないが、明記すると作者のモチベーションになる」旨がある。
- 規約にある「AI用途への利用不可」等は、サイト本文に強制的に書く必要はないが、運用メモとしては把握しておく。

## 6. 実装手順（最小ステップ）
1) `src/pages/about.astro` の技術スタックセクション位置を確定する  
2) `src/config/tech-logos.ts` を追加して一覧データを定義  
3) `src/components/tech/TechLogoGrid.astro` を追加してグリッド表示を実装  
4) Aboutページにコンポーネントを差し込み、クレジット文言＋リンクを表示  
5) `make verify`  
6) `make evidence`  
7) 引継ぎ4点を記録  

## 7. Acceptance Criteria
- Aboutページにロゴが表示され、スマホでも崩れない
- ロゴは alt を持つ
- 主要ロゴはリンクできる（href があるもの）
- クレジット文言が表示され、リンクが機能する
- `make verify` が通る
- `make evidence` が通り、ログが `out/evidence/` に保存される

## 8. Verification
- `make verify`
- `make evidence`
- 目視: Aboutページ（/about）でロゴ表示とクレジットを確認

## 9. 引継ぎ4点（必須）
spec: docs/specs/active/2026-02-12-about-tech-logos-kawaiilogos-attribution.md
files:
- <git diff --name-only>
sha: <git rev-parse --short HEAD>
evidence: out/evidence/<latest>.log
