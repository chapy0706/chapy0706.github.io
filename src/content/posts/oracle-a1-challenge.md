---
title: "Oracle Cloud A1インスタンス取得"
pubDate: 2026-06-02
updatedDate: 2026-06-03
description: "Out of Host Capacityと戦い続けた記録"
tags: ["Oracle Cloud", "OCI", "A1", "インフラ", "クラウド"]
---

# Oracle Cloud A1インスタンス取得

## 結論から先に（忙しい人へ）

| 項目                   | 内容                                                 |
| ---------------------- | ---------------------------------------------------- |
| 手動での取得           | ほぼ不可能。自動リトライ一択                         |
| リトライ手段           | OCI CLIのスクリプトをE2.Microのcronで実行            |
| リトライ間隔           | 素数に近い間隔でレートリミット回避                   |
| 取得までの試行回数     | 1000回以上                                           |
| PAYGへのアップグレード | 取得難易度を下げる効果あり。ガードレール設定後に推奨 |

---

## Out of Host Capacityとの戦い

アカウント作成に成功した直後、次の壁が待っていた。

A1インスタンス（VM.Standard.A1.Flex）の作成ボタンを押すと、ほぼ確実にこのエラーが返ってくる。

```
可用性ドメインVM.Standard.A1.FlexのシェイプAD-1の容量が不足しています。
```

シングルADのリージョンはADが1つしかないため、逃げ場がない。

> [!NOTE]
> 最初は「少し待てば取れるだろう」と思っていた。その考えが甘かった。闇

---

## なぜ容量不足が起きるのか

OracleのデータセンターにはARMの物理サーバーが一定数あり、その上に仮想マシンを詰め込む構造になっている。

- 有料ユーザーが優先的にスロットを割り当てられる
- 無料枠ユーザーへの割り当ては隙間が生まれた瞬間だけ
- 世界中のユーザーが同じ隙間を狙っている

つまり「恒久的に無理」ではなく「有料ユーザーの隙間を奪い合う」戦いだ。

---

## 手動リトライの限界

最初はコンソールから手動で試し続けた。その結果わかったこと。

- シングルADのリージョンはADが1つしかないため可用性ドメインを変えられない
- 連打するとレートリミット（429エラー）が発生する
- 人間が試行できる回数は1日せいぜい数十回

これでは話にならない。

> [!NOTE]
> ブラウザの前で何十回もボタンを押し続けた時間を返してほしい。サンタさんにお願いしておく

---

## OCI CLI + 自動リトライ作戦

### OCI CLIのセットアップ

MacにOCI CLIをインストールする。

```bash
brew update && brew install oci-cli
```

インストール後に初期設定。

```bash
oci setup config
```

以下の情報を用意しておく。

- User OCID（コンソール右上 → プロフィール → ユーザー名をクリック）
- Tenancy OCID（コンソール右上 → プロフィール → テナンシ）
- リージョン: `<REGION>`

設定完了後、生成された公開鍵をコンソールのAPIキーに登録する。

### 必要なOCIDの取得

```bash
# サブネットOCID
oci network subnet list --compartment-id <テナンシOCID>

# イメージOCID（Ubuntu 22.04 aarch64）
oci compute image list --compartment-id <テナンシOCID> \
  --operating-system "Canonical Ubuntu" | grep -E '"id"|"display-name"'

# 可用性ドメイン名
oci iam availability-domain list --compartment-id <テナンシOCID>
```

### 自動リトライスクリプト（Mac版）

成功するまでループし続けるスクリプト。成功時はmacOSのサウンドで通知する。

```bash
#!/bin/bash

COMPARTMENT_ID="<テナンシOCID>"
SUBNET_ID="<サブネットOCID>"
IMAGE_ID="<イメージOCID>"
SSH_PUBLIC_KEY="ssh-ed25519 AAAA..."
AVAILABILITY_DOMAIN="<AVAILABILITY_DOMAIN>"

INSTANCE_NAME="app-instance"
SHAPE="VM.Standard.A1.Flex"
OCPU=4
MEMORY_GB=24
BOOT_VOLUME_GB=<ストレージ容量>
RETRY_INTERVAL=<試行回数>

LOG_FILE="$HOME/Downloads/a1_retry.log"
ATTEMPT=0

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE"
}

while true; do
  ATTEMPT=$((ATTEMPT + 1))
  log "試行 #${ATTEMPT} 開始..."

  RESULT=$(oci compute instance launch \
    --availability-domain "$AVAILABILITY_DOMAIN" \
    --compartment-id "$COMPARTMENT_ID" \
    --display-name "$INSTANCE_NAME" \
    --shape "$SHAPE" \
    --shape-config "{\"ocpus\": ${OCPU}, \"memoryInGBs\": ${MEMORY_GB}}" \
    --subnet-id "$SUBNET_ID" \
    --image-id "$IMAGE_ID" \
    --boot-volume-size-in-gbs "$BOOT_VOLUME_GB" \
    --metadata "{\"ssh_authorized_keys\": \"${SSH_PUBLIC_KEY}\"}" \
    --assign-public-ip true 2>&1)

  if echo "$RESULT" | grep -q '"lifecycle-state": "PROVISIONING"'; then
    log "===== 成功！ ====="
    afplay /System/Library/Sounds/Glass.aiff -v 0.3
    exit 0
  elif echo "$RESULT" | grep -qi "capacity"; then
    log "容量不足。${RETRY_INTERVAL}秒後に再試行..."
  elif echo "$RESULT" | grep -q "429"; then
    log "レートリミット。${RETRY_INTERVAL}秒後に再試行..."
  else
    log "エラー: $RESULT"
  fi

  sleep "$RETRY_INTERVAL"
done
```

リトライ間隔は多めにした。他のユーザーとリクエストが重なりにくくなる効果を期待した。

> [!NOTE]
> Macはスリープするとプロセスが止まる。スリープ設定をオフにするか、後述のE2.Microに移行する必要がある。

---

## E2.MicroでのcronリトライがMac版より優れていた

Macでのリトライには以下の問題があった。

- スリープ問題（画面オフとスリープを分けて設定する必要がある）
- タイムアウトエラーが頻発（外部ネットワーク経由のため）

E2.Microを踏み台として立ち上げた後、リトライスクリプトをE2に移したところ

- OCI内部ネットワークからAPIを叩くためタイムアウトが減少した
- 24時間止まらずに動き続ける
- Macを閉じていても問題なし

という大きなメリットがあった。

### E2.Micro　cron用スクリプト（1回実行版）

```bash
#!/bin/bash

COMPARTMENT_ID="<テナンシOCID>"
SUBNET_ID="<サブネットOCID>"
IMAGE_ID="<イメージOCID>"
SSH_PUBLIC_KEY="ssh-ed25519 AAAA..."
AVAILABILITY_DOMAIN="<AVAILABILITY_DOMAIN>"

INSTANCE_NAME="app-instance"
SHAPE="VM.Standard.A1.Flex"
OCPU=4
MEMORY_GB=24
BOOT_VOLUME_GB=<ストレージ容量>

LOG_FILE="$HOME/a1_retry.log"
export PATH="$HOME/bin:$PATH"

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo "$msg" >> "$LOG_FILE"
}

if grep -q "成功" "$LOG_FILE" 2>/dev/null; then
  exit 0
fi

log "試行開始..."

RESULT=$(oci --config-file /home/ubuntu/.oci/config compute instance launch \
  --availability-domain "$AVAILABILITY_DOMAIN" \
  --compartment-id "$COMPARTMENT_ID" \
  --display-name "$INSTANCE_NAME" \
  --shape "$SHAPE" \
  --shape-config "{\"ocpus\": ${OCPU}, \"memoryInGBs\": ${MEMORY_GB}}" \
  --subnet-id "$SUBNET_ID" \
  --image-id "$IMAGE_ID" \
  --boot-volume-size-in-gbs "$BOOT_VOLUME_GB" \
  --metadata "{\"ssh_authorized_keys\": \"${SSH_PUBLIC_KEY}\"}" \
  --assign-public-ip true 2>&1)

if echo "$RESULT" | grep -q '"lifecycle-state": "PROVISIONING"'; then
  log "===== 成功！インスタンスが作成されました ====="
elif echo "$RESULT" | grep -qi "capacity"; then
  log "容量不足 - 次回リトライへ"
elif echo "$RESULT" | grep -q "429"; then
  log "レートリミット - 次回リトライへ"
else
  log "エラー: $RESULT"
fi
```

crontabに登録する。

```bash
crontab -e
# 以下を追加
*/3 * * * * /home/ubuntu/<作成したファイル名>.sh
```

---

## PAYGへのアップグレード

1000回のリトライを経てPAYGにアップグレードしたところ、アップグレード完了直後にA1の取得に成功した。

PAYGにするメリットとデメリットは以下の通りだ。

| メリット                     | デメリット             |
| ---------------------------- | ---------------------- |
| A1取得難易度が下がる         | ダウングレードできない |
| アイドル回収リスクがなくなる | 誤課金リスクが生まれる |
| サポート優先度が上がる       | 心理的な負担           |

ただし誤課金リスクはガードレールを設定することでほぼゼロにできる。

### ガードレール設定（先にやること）

**クォータポリシーの設定**

`ガバナンスと管理` → `割当て制限ポリシー` → `割り当てポリシーの作成`

```
Set compute-core quota standard-a1-core-count to 4 in compartment <コンパートメント名>
Set compute-core quota standard-e2-micro-core-count to 2 in compartment <コンパートメント名>
Set database quota atp-total-storage-tb to 0 in compartment <コンパートメント名>
Set database quota vm-block-storage-gb to 200 in compartment <コンパートメント名>
```

**予算アラートの設定**

`課金` → `予算` → `予算の作成`

- 予算額: 100円
- しきい値1: 1%（1円）で警告
- しきい値2: 100%（100円）でアラート

この2つを設定してからPAYGにアップグレードすると安全だ。

---

## 取得確率の目安

1日約480回（3分間隔）の試行として

| 日数   | 累積確率 |
| ------ | -------- |
| 1日目  | 約10%    |
| 3日目  | 約28%    |
| 7日目  | 約63%    |
| 14日目 | 約89%    |

2週間以内に取得できる確率は約90%だ。焦らずE2.Microのcronに任せておくのが最善だ。

> [!NOTE]
> ...とAIは言ってたけれど、正直期待しないほうがいい。まさしくギャンブルだ

---

## おわりに

1000回のリトライを経てA1を取得した瞬間、ログに「成功！」と記録されているのを見た時の感覚は忘れられない。

手動でボタンを押し続けた時間、OCI CLIのセットアップに費やした時間、E2.Microにcronを仕込んだ時間、全てが報われた瞬間だった。

同じ苦労をしている人が、この記事を読んで少しでも早く取得できれば嬉しい。

---

## 参考リンク

- [Oracle Cloud Always Free 公式ドキュメント](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
