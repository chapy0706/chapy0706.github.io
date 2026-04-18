# [Portfolio] 「指示厨ゲーム（czz）」紹介セクションを追加

## 概要
Astro + GitHub Pages で運用しているポートフォリオ兼ブログサイトに、作品「指示厨ゲーム（czz）」の紹介セクション（または専用ページ）を追加する。  
TOP → 課題一覧 → 実行結果の3枚スクリーンショットで、アプリ体験の流れが一目で分かる状態を作る。

## 背景 / ねらい
- 文章だけだと「何をするアプリか」が伝わりにくい
- スクショを並べることで、非エンジニアでも理解できる導線になる
- まずは“見た目で伝わる”を優先し、依存追加や凝ったギャラリー機能は後回しにする

## ゴール
- ポートフォリオ内に「指示厨ゲーム（czz）」紹介ブロックを追加
- スクリーンショット3枚（TOP / 課題一覧 / 実行結果）を掲載し、モバイルでは横スワイプで見られる
- 画像は遅延読み込み + サイズ指定でレイアウト崩れ（CLS）を抑える
- 作品リンク（GitHub / デモ / 記事など）を置ける枠を用意（URLは後から差し替え可能）

## 非ゴール（今回やらない）
- 画像拡大モーダル、スライダーライブラリ導入、凝ったアニメーション
- Astro Image 等の最適化パイプライン追加（依存を増やさない）
- 多言語化

---

## 追加アセット（画像）
添付スクリーンショット3枚を、以下に配置して参照できるようにする。

- `public/images/czz/TOP.png`（元: TOP.png / 386x836）
- `public/images/czz/Tasks.png`（元: Tasks.png / 388x842）
- `public/images/czz/Results.png`（元: Results.png / 386x846）
---

## 実装方針

### 方針A（推奨）: 既存ポートフォリオ/Projects セクションに「czz」を追加
1. 既存の「Projects / Works / Portfolio」表示箇所を探す。src/pages/use-cases.astro辺りが対象の可能性大
2. 必要に応じてコンポーネントを作り、そこへ差し込む

### 方針B: 専用ページを作り、ポートフォリオからリンクする
- `src/pages/projects/czz.astro` のようなページを追加し、一覧側にはカードだけ追加

※どちらにするかは既存構造に合わせる。まずは「既にある作品一覧」の中に自然に入る方を優先。

---

## UI 要件

### レイアウト
- モバイル: スクショは横スクロール（scroll-snap）で 1枚ずつ気持ちよく切り替わる
- デスクトップ: 3枚をグリッド表示（3カラム、または2+1）  
- テキスト（説明/特徴/技術）→ スクショ → CTA の順で視線誘導

### 見た目（スクショ）
- 角丸（例: 24〜32px）
- 薄い枠線（例: 1px、透明度あり）
- 影（控えめ）
- 背景はサイトのトーンに合わせる（テーマに逆らわない）

### a11y / パフォーマンス
- 画像に alt を付ける（具体的に）
- `loading="lazy"` `decoding="async"` を付ける
- `width` `height` を指定して CLS を抑える
- 必要なら `sizes` / `srcset` は将来拡張でOK（今回は必須にしない）

---

## 追加する場合のコンポーネント（例）
新規:
- `src/components/portfolio/CzzShowcase.astro`

内容（目安）:
- 見出し: `指示厨ゲーム（czz）`
- 説明: 2〜3行（「コマンドを組み立てて課題を解く」等）
- 特徴: 3点（例: 初心者モード / 課題形式 / 実行結果とテストケース）
- スクショ3枚（TOP/課題一覧/実行結果）
- CTA: GitHub / デモ / 記事（URLは仮でOK、コメントで差し替え指示）

スタイル:
- Tailwind が入っているなら既存流儀に合わせて utility を使う
- Tailwind が無い/不明なら、コンポーネント内の `<style>`（scoped）で完結させる  
  （依存を増やさず、安全で壊しにくい）

---

## 差し込み先の探索手順（Claude Code）
以下を順に探索して、最も自然な場所へ挿入する。

1. `src/pages/index.astro`
2. `src/pages/use-cases.astro` / `src/pages/projects.astro` / `src/pages/about.astro`
3. `src/components/` 配下の `Projects` `Works` `Portfolio` 相当
4. レイアウト: `src/layouts/*`（BaseLayout 等）から辿って確認

挿入ルール:
- 作品一覧があるなら、その中に「czz」を1枠として追加
- 一覧が無いなら、トップの自己紹介直後〜ブログ一覧前あたりに新規セクションとして追加

---

## 受け入れ条件（AC）
- AC1: 画像3枚が `public/images/czz/` に追加され、ページで表示できる
- AC2: 「指示厨ゲーム（czz）」紹介セクションが表示される
- AC3: モバイル幅でスクショが横スワイプでき、見切れず確認できる
- AC4: `pnpm run build` が成功する
- AC5: 画像 alt が具体的で、最低限のアクセシビリティが担保される

---

## 手動テスト
- iPhone 13 相当（幅 390px 前後）で横スワイプが自然に動くこと
- デスクトップでグリッド崩れがないこと
- 画像ロード時にガタつかないこと（幅/高指定が効いている）

---

## セキュリティ / 運用
- 外部スクリプト追加はしない
- 画像は `public/` 配下で完結させる（余計なビルド依存を増やさない）
- もしリンク（デモURL等）を追加する場合も、外部リンクは `rel="noopener noreferrer"` を付ける（target=_blank の場合）

---

## Claude Code に渡す実装プロンプト（貼り付け用）

あなたは Astro + GitHub Pages のポートフォリオサイトを更新します。  
目的は「指示厨ゲーム（czz）」紹介セクションを追加し、スクリーンショット3枚で体験の流れ（TOP→課題一覧→実行結果）を伝えることです。

要件:
- 画像3枚を `public/images/czz/` に追加する（`czz-top.png`, `czz-tasks.png`, `czz-results.png`）
- 新規コンポーネント `src/components/portfolio/CzzShowcase.astro` を作成する
- 既存のポートフォリオ/Projects 相当ページを探索し、適切な位置に `CzzShowcase` を挿入する
- モバイルは横スクロール（CSS scroll-snap 推奨）、デスクトップはグリッド表示
- 画像には `alt`, `loading="lazy"`, `decoding="async"`, `width`, `height` を付ける
- 依存追加は行わない（Astro標準と既存プロジェクト内の仕組みで完結）
- `pnpm run build` が通る状態にする

画像サイズ:
- top: 386x836
- tasks: 388x842
- results: 386x846

進め方:
1) `src/pages` と `src/components` を検索して、作品一覧/ポートフォリオ表示の挿入箇所を特定
2) `CzzShowcase.astro` を実装（Tailwindが無い場合は `<style>` scoped でCSSを同梱）
3) 画像を `public/images/czz/` に配置し、`/images/czz/...` で参照
4) `pnpm run build` を実行して成功を確認

出力:
- 変更したファイル一覧
- どこに挿入したか（理由）
- 動作確認コマンド
