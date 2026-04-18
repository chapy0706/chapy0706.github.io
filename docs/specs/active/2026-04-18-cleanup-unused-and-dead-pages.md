# [Cleanup] 未参照ファイル削除 + 到達不能ページ（疑い）整理 + 画像アセット棚卸し

## 概要
未参照ファイルの削除と、ナビゲーション上「到達不能」に見えるページ／コンポーネントの整理（必要ならページごと削除）を行い、リポジトリの保守性とデプロイ成果物の無駄を減らす。

今回の目的は「安全に消す」こと。誤削除を避けるため、削除は段階的に進め、各段階でビルドとリンク整合を確認する。

---

## 背景（調査結果）
未参照ファイル（どのソースファイルからも import / 参照なし）として、以下がピックアップされた。

### 削除候補（import/参照なし）
- `public/chapy.jpg`
- `src/assets/photo-1518770660439-4636190af475.jpg`
- `src/assets/photo-1607082349566-187342175e2f.jpg`
- `src/assets/photo-1542838132-92c53300491e.jpg`
- `src/assets/photo-1559839734-2b71ea197ec2.jpg`
- `src/assets/photo-1587854692152-cbe660dbde88.jpg`

### 対象外（スキップ）
- `public/.DS_Store`
- `public/images/czz/.DS_Store`
理由: macOS システムファイル。git 管理下にあるなら、削除だけでなく `.gitignore` 対応が先。

### 補足（参照はあるが到達不能の疑い）
`src/assets/` の他の画像群は、`facilities.astro / capabilities.astro / documentation.astro` などのページや、`home/` 配下コンポーネント（`ImageGrid`, `Testimonials`, `ProcessWorkflow` 等）から import されている。ただし、これらのページ／コンポーネントがナビゲーション上どこまで到達可能かは別問題。

---

## 進め方（段階的）

### Phase 0: 削除前の安全確認
目的: 「実は参照されていた」を潰す。

- 参照確認（src だけでなく、全体も確認）
  - `rg -n "chapy\.jpg|photo-1518770660439|photo-1607082349566|photo-1542838132|photo-1559839734|photo-1587854692152" .`
  - `grep -R "chapy\.jpg" -n .`
  - `grep -R "photo-1518770660439" -n .` （以下同様）
- Markdown/コンテンツ経由の参照も想定し、`src/content` や `public` 直下の HTML/MD も含めて検索する。
- 参照が見つかった場合は「削除候補から除外」して、このIssueでは削除しない。

### Phase 1: 未参照ファイル（6件）を削除
目的: 影響が小さい確実な削除。

- `git rm public/chapy.jpg`
- `git rm src/assets/photo-1518770660439-4636190af475.jpg`
- `git rm src/assets/photo-1607082349566-187342175e2f.jpg`
- `git rm src/assets/photo-1542838132-92c53300491e.jpg`
- `git rm src/assets/photo-1559839734-2b71ea197ec2.jpg`
- `git rm src/assets/photo-1587854692152-cbe660dbde88.jpg`

確認:
- `pnpm run build` が通る
- 主要ページ表示（ローカル `pnpm dev`）で 404/画像欠けが無い

### Phase 2: .DS_Store 対策（再発防止）
目的: リポジトリに紛れ込むノイズを遮断。

- ルートの `.gitignore` に追加（既にあれば確認のみ）
  - `.DS_Store`
  - `**/.DS_Store`

- もし既に追跡されている場合
  - `git rm --cached -r public/.DS_Store public/images/czz/.DS_Store`（存在する場合のみ）
  - その後コミット

確認:
- `git status` で .DS_Store が追跡対象にならない
- 再度生成されても差分に出ない

### Phase 3: 到達不能ページ（疑い）の実態調査 → ページごと削除（必要なら）
目的: 「参照はあるが、もう使っていない」構造を整理し、画像アセットも追随して削る。

#### 3-1. ルート一覧の棚卸し（Astroのpagesルーティング）
- `src/pages` を走査し、生成されるURLを列挙する（index, blog, tags, about, projects 等）
- 動的ルート（`[...slug].astro` 等）は対象外/別枠で整理

#### 3-2. ナビゲーションから到達できるか判定
- ヘッダー/フッター/サイドバーのリンク定義元を特定して、そこから辿れるページを「到達可能」とする
  - 例: `BaseLayout.astro` や `Header.astro` `Footer.astro` 等
- 「リンクが無いがURL直打ちで見せたいページ」は残す（削除しない）
- 「リンクが無く、将来も使わない」ページは削除候補にする

削除候補になり得る例（調査結果に出ていたもの）:
- `src/pages/facilities.astro`
- `src/pages/capabilities.astro`
- `src/pages/documentation.astro`
- それらが参照する `src/components/home/*`（ImageGrid / Testimonials / ProcessWorkflow 等）と画像群

#### 3-3. 削除方針
- 削除は「ページ単位」で行う（到達不能を確認できたもののみ）
- ページ削除後に再度 unused scan を実施し、ページ専用の画像が未参照になったら削除する
- 影響範囲が大きい場合は、Phase 3 を別Issueに分割しても良い（ただし今回は一気通貫でやる）

### Phase 4: 画像アセット再スキャン → 追加削除
目的: ページ整理後に不要になった assets を回収。

- 未参照ファイル抽出を再実行（既存のスクリプト/コマンドを使用）
- 未参照になった `src/assets/*` を `git rm` で削除
- `pnpm run build` と主要ページ表示を再確認

---

## 受け入れ条件（AC）
- AC1: Phase 1 の6ファイルが削除され、`make verify`と`make evidence` が成功する
- AC2: `.DS_Store` が git 管理に入らない（`.gitignore` 追加済み、追跡されていればキャッシュから除外）
- AC3: Phase 3 を実施する場合、削除したページへのリンクがナビゲーション上に残っていない
- AC4: いずれの段階でもビルドが壊れない（CIがあるならCIも通る）
- AC5: 追加削除（Phase 4）後も同様にビルドと主要導線が健全

---

## 影響範囲 / リスク
- `public/chapy.jpg` は「import されていないが、OGPやHTML直書きで参照されている」可能性がある  
  → Phase 0 の全体検索で潰す
- `src/assets/*` は、到達不能ページの整理を始めると連鎖的に未参照が増える  
  → ページ削除 → 再スキャン → assets削除、の順で安全に進める
- ページは「リンクが無い＝不要」とは限らない（直URLで見せたい場合がある）  
  → 判定は「ナビゲーションの意図」と「今後の運用方針」で決める

---

## Claude Code に渡す実装プロンプト（貼り付け用）

あなたは Astro + GitHub Pages のリポジトリをクリーンアップします。目的は (1) 未参照ファイルの安全な削除、(2) .DS_Store 混入防止、(3) ナビゲーション上到達不能なページの実態調査と、不要ならページごと削除、(4) それに伴う assets の追加削除です。

必須:
- まず repo 全体で参照検索を行い、参照が無いことを確認してから削除する（srcだけでなく全体）
- Phase 1 の6ファイルを `git rm` で削除する（参照が無い場合のみ）
- `.gitignore` に `.DS_Store` 対策を入れ、追跡済みなら `git rm --cached` で除外する
- `pnpm run build` を各フェーズの区切りで実行し、壊れていないことを確認する

Phase 3（到達不能ページの整理）:
- `src/pages` を列挙し、ナビゲーション定義元（Header/Footer/BaseLayout等）からリンクされるページを抽出する
- リンクされていないページのうち、今後使わないものを削除候補として提示し、削除を実行する（実行前に理由を短く記載）
- 削除後に unused scan を再実行し、未参照になった `src/assets/*` を削除する

出力:
- 実施したフェーズ（Phase 1/2/3/4）と、削除したファイル一覧
- 到達不能ページの判定根拠（どこからリンクされていないか）
- 実行したコマンド（参照検索 / build / scan）
- 最終的に `pnpm run build` が成功したこと

対象の未参照ファイル（Phase 1）:
- public/chapy.jpg
- src/assets/photo-1518770660439-4636190af475.jpg
- src/assets/photo-1607082349566-187342175e2f.jpg
- src/assets/photo-1542838132-92c53300491e.jpg
- src/assets/photo-1559839734-2b71ea197ec2.jpg
- src/assets/photo-1587854692152-cbe660dbde88.jpg
