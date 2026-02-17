---
title: "開発秘話②: 指示厨ゲーム"
description: "czz開発でAI大暴走による大量破壊行為の記録。"
pubDate: "2026-02-08T00:00:00+09:00"
updatedDate: "2026-02-17T00:00:00+09:00"
tags: ["czz", "開発日記"]
draft: false
------------

## 開発秘話②: 指示厨ゲーム

czz（指示厨ゲーム）の開発で、**「make evidence をCIでも通して、安心して発表に突入する」**——そのはずだった。

現実は、Biome（formatter/linter）・pnpm（workspace/lockfile）・TypeScript（型）・Next.js（生成物）・Drizzle（依存関係）が**順番に手を取り合って私を殴る**展開になった。

> [!NOTE]
> ローカルでは「通った」ものが、CIでは落ちる。
> そして落ち方が毎回違う。
> この手の事故は「何を直せば終わるのか」が見えにくいのが一番つらい。

---

## 当日の状況（ざっくり年表）

* ローカルで `make evidence` を回して、少しずつエラーを減らしていた
* `pnpm -w check`（Biome）と `pnpm -w typecheck` が、実行環境によって成功/失敗が揺れる
* なんとかローカルで `OK: verify passed` まで到達
* しかし GitHub Actions では別の地雷が爆発（lockfile / Biome schema / 型）

---

## 起きたこと：つらさの種類が多い

### 1) pnpm: frozen-lockfile と overrides 不整合

Actions でまず落ちたのがこれ。

```sh
Run pnpm install --frozen-lockfile
ERR_PNPM_LOCKFILE_CONFIG_MISMATCH Cannot proceed with the frozen installation.
The current "overrides" configuration doesn't match the value found in the lockfile
```

> [!NOTE]
> CI は `--frozen-lockfile` で「lockfileに書いてある通りにしか入れない」運用が多い。
> だから **package.json（overrides含む）を変えたら、lockfileも必ず更新してコミット**が原則。

---

### 2) @types/react-dom の存在しないバージョンを指定していた

ローカルで直そうとして `pnpm -w install --no-frozen-lockfile` をやったら、今度はこれ。

```sh
ERR_PNPM_NO_MATCHING_VERSION No matching version found for @types/react-dom@19.2.8
The latest release of @types/react-dom is "19.2.3".
```

> [!WARNING]
> 「存在しないバージョン」は、CIだと問答無用で止まる。
> この手のズレは **workspace のどこか（今回だと packages/ui）にハードコードされてる**ことが多い。

---

### 3) TypeScript: `Link` / `Switch` が JSX として使えない（ReactNodeの二重世界）

Actions 側の typecheck で、こういうのが大量に出た。

* `'Link' cannot be used as a JSX component.`
* `'Switch' cannot be used as a JSX component.`
* `import(".../@types/react/index").ReactNode is not assignable to type React.ReactNode`

> [!NOTE]
> この症状は「Reactの型定義が複数入って、違う世界線のReactNodeが混在してる」時によく出る。
> workspace だと **依存の置き方（依存の持ち方）で簡単に分裂する**。

---

### 4) Next.js 生成物 `.next/types` を typecheck して壊れたTSを踏む

途中で `apps/user/.next/types/validator.ts` がパース不能で落ちたこともあった。

```txt
apps/user/.next/types/validator.ts:135:2 - error TS1005: '{' expected.
```

> [!TIP]
> `.next` は生成物。壊れていたらまず `rm -rf apps/user/.next`（or clean）で切り分ける。
> そして typecheck の対象から外す（include/exclude の確認）と精神が保たれる。

---

### 5) Biome: CIのCLIと biome.json のスキーマが噛み合わない

終盤の極めつけ。

CIで `biome ci .` が走った結果、こう言われた。

* `The configuration schema version does not match the CLI version 2.3.14`
* `Found an unknown key ignore`
* `Found an unknown key include`
* （ローカルでは `organizeImports` が unknown と言われるケースも）

> [!WARNING]
> 「ローカルでは動くのに、CIで設定が読めない」は本当にしんどい。
> 原因はだいたいこれ：
>
> * CIが使ってる Biome のバージョン
> * ルートとサブpackageで Biome の設定や導線が分裂している
> * `biome.json` が新旧どちらの書き方になっているか

---

## その場で取った対処（結果として効いたやつ）

> [!NOTE]
> ここは “私の現場判断” であって、唯一の正解ではない。
> ただ、当日「終わらせる」ためには、理想よりも **収束** が優先だった。

### A) 依存の整合（存在しないバージョンをやめる）

* `@types/react-dom` を実在するバージョンへ揃える（例: 19.2.3）
* workspace 内の複数箇所に同じ型が入らないように集約（可能なら root へ寄せる）

### B) overrides は root に置く

`packages/ui` の `pnpm.overrides` は警告通り効かない。

> [!TIP]
> workspace の overrides は **ルートの package.json** に置いて、lockfile に反映させてコミット。

### C) コマンドの実行コンテキストを揃える

`vitest` が `command not found` でも、`pnpm -w exec vitest run` なら動いた。

```sh
pnpm -w exec vitest run
```

> [!NOTE]
> “グローバルに入ってない” のは正常。
> workspace のbinを使うには `pnpm exec` / `pnpm -w exec` で呼ぶのが安全。

---

## 学び（つらいけど、次に効くやつ）

### 1) 「ローカルで通る」は半分しか意味がない

CIは別OS・別Node・別キャッシュ・別インストール戦略。
**「CIで通る」だけが勝ち**、という悲しい真理がある。

### 2) workspace は便利だけど、依存が分裂しやすい

React型が二重に入ると、UIコンポーネント全部が死ぬ。
特に `@types/*` は、雑に増えるとすぐ世界線が割れる。

### 3) formatter/linter は “同じバージョン” を全員に強制する

Biome のCLIと設定スキーマがズレたら、コード以前に土台が崩れる。
だから **Biome自体のバージョン固定**（とCI側の導線固定）が重要。

---

## 次の一手（発表に間に合わせるための現実案）

> [!TIP]
> 発表までの優先度は「新機能」じゃなくて「再現性」
> つまり “いつでも同じ結果が出る” を先に作る。

* Node / pnpm / Biome / TypeScript の **バージョンを固定**（CIも同じ）
* workspace で React の型定義が増殖しない構造にする（root 集約）
* `make evidence` の中で呼ぶコマンドは `pnpm -w exec ...` に寄せる（実行経路の統一）
* `.next` の扱い（cleanとexclude）を決めて、型チェック対象を安定させる

---

## おわりに

今日は、進捗よりも「事故対応」に時間を吸われた。
でも、こういう日があると「仕組みが回った時のありがたさ」が骨に染みる。

> [!NOTE]
> CIは敵じゃない。
> ただ、敵みたいな顔で殴ってくることがある。

次は、殴られた痕跡をドキュメントにして、未来の私のHPを守る。
