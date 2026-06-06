---
title: "Oracle Cloud E2.MicroとA1のセキュリティ対策"
pubDate: 2026-06-03
updatedDate: 2026-06-03
description: "E2.MicroにMFA・改ざん検知を導入し、A1をパブリックIPなし・Cloudflare Tunnel経由"
tags: ["Oracle Cloud", "OCI", "セキュリティ", "Cloudflare", "インフラ"]
---

# Oracle Cloud E2.MicroとA1のセキュリティ対策：踏み台構成とCloudflare Tunnel

## この日やろうとしたこと

A1インスタンスをようやく手に入れた翌日。
せっかく取れたのに、セキュリティが甘いままでは意味がない。

今日のゴールはこの構成を完成させることだ。

```
インターネット
    ↓
Cloudflare Tunnel（Webアクセス）

SSH
    ↓
Mac
    ↓
E2.Micro（MFA・踏み台）SSH_PORT
    ↓
A1（パブリックIPなし・プライベートIPのみ）SSH_PORT
```

A1はパブリックIPを持たず、E2.Micro経由のSSHとCloudflare Tunnel経由のWebアクセスのみを受け付ける。外から直接触れないサーバーにする。

> [!NOTE]
> 本記事では、実際のSSHポート番号やドメイン名などの環境固有値はすべてプレースホルダ（`SSH_PORT` など）に置き換えている。

> [!NOTE]
> 無料枠でここまでやる必要があるのかと思う人もいるかもしれない。でも学習も兼ねて妥協せずやってみた。

---

## E2.Microのセキュリティ強化

### SSHポートの変更

デフォルトの22番ポートは攻撃の標的になりやすい。予測困難な番号に変更する。本記事ではこの番号を `SSH_PORT` と表記する。

**先にOCIのセキュリティリストで新しいポートを開ける。この順番を守らないと閉め出される。**

`ネットワーキング` → `仮想クラウド・ネットワーク` → セキュリティリスト → イングレス・ルールの追加

- ソースCIDR: `0.0.0.0/0`
- プロトコル: TCP
- 宛先ポート: `SSH_PORT`（予測困難な任意の番号）

sshd_configを編集する。

```bash
sudo vim /etc/ssh/sshd_config
```

```
Port SSH_PORT
PermitRootLogin no
PasswordAuthentication no
```

iptablesにも新しいポートを追加する。

```bash
sudo iptables -I INPUT 5 -p tcp --dport SSH_PORT -j ACCEPT
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
```

古い22番を削除する。

```bash
sudo iptables -D INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT
sudo netfilter-persistent save
```

**別のターミナルで新しいポートへの接続を確認してからsshdを再起動すること。**

```bash
sudo systemctl restart sshd
```

> [!NOTE]
> ポートを変えてsshd再起動した後、別ターミナルで繋がるかを確認する。これ大事。

### Google Authenticator MFAの導入

秘密鍵だけでは鍵が漏れた場合にリスクがある。ワンタイムパスワードを追加する。

```bash
sudo apt install libpam-google-authenticator -y
google-authenticator
```

設定時の選択肢はすべてyで問題ない（時刻ズレの許容範囲はnを推奨）。

QRコードが表示されたらスマホの認証アプリでスキャンする。

PAMの設定を編集する。

```bash
sudo vim /etc/pam.d/sshd
```

先頭に追加する。

```
auth required pam_google_authenticator.so
```

`@include common-auth` をコメントアウトする（パスワード入力を求めないようにするため）。

```
#@include common-auth
```

sshd_configに以下を追加する。

```bash
sudo vim /etc/ssh/sshd_config
```

```
ChallengeResponseAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
```

sshdを再起動する。

```bash
sudo systemctl restart sshd
```

> [!NOTE]
> MFAは入れて少し安心できるが、毎回のログインが苦痛

### AIDE（ファイル改ざん検知）の導入

```bash
sudo apt install aide -y
sudo aideinit
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

初期化にかなり時間がかかる。待つしかない。

cronで毎日チェックを実行する。

```bash
crontab -e
# 以下を追加
0 3 * * * sudo aide --check >> ~/aide_check.log 2>&1
```

### lynis（セキュリティ監査）の導入

```bash
sudo apt install lynis -y
```

cronで毎月1日に監査を実行する。

```bash
crontab -e
# 以下を追加
0 4 1 * * sudo lynis audit system >> ~/lynis_audit.log 2>&1
```

### タイムゾーンをJSTに変更

```bash
sudo timedatectl set-timezone Asia/Tokyo
timedatectl
```

cronのスケジュールが日本時間で動くようになる。設定後に確認を忘れずに。

### IPアドレスの固定化

パブリックIPが変わるとAutonomous DatabaseのIP制限が機能しなくなる。予約済みIPに変換する。

`コンピュート` → `インスタンス` → E2をクリック → `アタッチされたVNIC` → `IP管理` → エフェメラルIPの`・・・`メニュー → `予約済みパブリックIPに変換`

> [!NOTE]
> OCIではインスタンスにアタッチされている間は予約済みIPも無料だ。これはOCIの数少ない太っ腹なポイントだと思う。

---

## A1のセキュリティ強化

### E2.Microを踏み台とした鍵ペアの設定

A1専用の鍵ペアをE2上で生成する。これによりA1の秘密鍵はE2の中にのみ存在する状態になる。

```bash
# E2上で実行
ssh-keygen -t ed25519 -f ~/.ssh/a1_key -N ""
cat ~/.ssh/a1_key.pub
```

表示された公開鍵をA1の`authorized_keys`に追加する。

```bash
# A1上で実行
echo "E2の公開鍵" >> ~/.ssh/authorized_keys
```

E2から接続できることを確認する。

```bash
# E2上で実行
ssh -i ~/.ssh/a1_key -p SSH_PORT ubuntu@<A1のプライベートIP>
```

E2の`~/.bashrc`にエイリアスを追加しておくと便利だ。A1のプライベートIPと接続情報をE2側に閉じ込めることで、Mac側にはA1への直接的な到達情報を一切残さない。

```bash
echo 'alias ssh-a1="ssh -i ~/.ssh/a1_key -p SSH_PORT ubuntu@<A1のプライベートIP>"' >> ~/.bashrc
source ~/.bashrc
```

> [!NOTE]
> 少し過剰かもしれないが、こういう設計の積み重ねが大事だと思っている。そしていつか漏洩

### SSHポートの変更

E2と同様にデフォルトから変更する。

OCIのセキュリティリストはE2と共通のため追加不要だ。iptablesに追加する。

```bash
sudo iptables -I INPUT 5 -p tcp --dport SSH_PORT -j ACCEPT
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
```

### iptablesでE2のIPのみSSH許可

```bash
sudo iptables -A INPUT -p tcp --dport SSH_PORT -s <E2のIP> -j ACCEPT
sudo iptables -A INPUT -p tcp --dport SSH_PORT -j DROP
sudo netfilter-persistent save
```

これでA1へのSSHはE2のIPからのみアクセス可能になる。

### Cloudflare Tunnelの設定

A1のパブリックIPを削除する前にTunnelを設定する。**順序を間違えると入れなくなる。**

cloudflaredをインストールする。A1はARMアーキテクチャのためarm64版を使う。

```bash
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared.deb
```

Cloudflareにログインする。

```bash
cloudflared tunnel login
```

表示されたURLをブラウザで開いてドメインを選択する。

Tunnelを作成する。

```bash
cloudflared tunnel create my-tunnel
```

設定ファイルを作成する。

```bash
mkdir -p ~/.cloudflared
vim ~/.cloudflared/config.yml
```

```yaml
tunnel: <TunnelのID>
credentials-file: /home/ubuntu/.cloudflared/<TunnelのID>.json

ingress:
  - hostname: app.example.com
    service: http://localhost:80
  - service: http_status:404
```

DNSレコードを追加する。

```bash
cloudflared tunnel route dns my-tunnel app.example.com
```

サービスとして登録して常駐させる。

```bash
sudo cloudflared --config /home/ubuntu/.cloudflared/config.yml service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

`Active: active (running)` になれば成功だ。

### A1のパブリックIPを削除

Cloudflare Tunnelが正常に動作していることを確認してから削除する。

`コンピュート` → `インスタンス` → A1をクリック → `アタッチされたVNIC` → `IP管理` → パブリックIPの削除

> [!NOTE]
> パブリックIPを削除した瞬間、A1との接続が切れた。オワタ

---

## ネットワーク・セキュリティ・グループ（NSG）について

E2とA1が同じVCN・サブネットにいる場合、セキュリティリストは共有される。
NSGを使えばインスタンスごとに異なるルールを適用できるが、同一サブネット内では期待通りに動作しないケースがある。

細かいIP制限はNSGではなく**iptablesで行う方が確実**だ。

> [!NOTE]
> NSGを設定してセキュリティリストからSSHポートを削除したら、E2にもA1にも入れなくなった。セッションが生きていたから復旧できたが、正直かなり焦った

---

## OCI Vaultで機密情報を管理する

スクリプトに平文でOCIDやパスワードを書くのはリスクがある。OCI Vaultを使って暗号化して管理する。

`アイデンティティとセキュリティ` → `ボールト` → `ボールトの作成`

- タイプ: デフォルト（仮想プライベートは有料）

マスター暗号化キーを作成する。

- アルゴリズム: AES
- キー長: 256
- 保護モード: HSM

シークレットにJSON形式で機密情報をまとめて登録する。

```json
{
  "compartment_id": "<コンパートメントOCID>",
  "subnet_id": "<サブネットOCID>",
  "image_id": "<イメージOCID>",
  "availability_domain": "<AVAILABILITY_DOMAIN>",
  "ssh_public_key": "ssh-ed25519 AAAA..."
}
```

> [!NOTE]
> Always Free枠でマスター暗号化キーは20個まで無料。JSONで複数の値をまとめれば1シークレットで複数の情報を管理もいける

---

## この日を終えて

```
インターネット
    ↓
Cloudflare Tunnel
    ↓
A1（パブリックIPなし・プライベートサブネット）
├── Nginx（80番・リバースプロキシ）
├── PostgreSQL
├── AIDE（毎日改ざん検知）
├── lynis（毎月セキュリティ監査）
└── cloudflared（常駐サービス）

SSH
    ↓
Mac → E2.Micro（MFA）→ A1（プライベートIPのみ）
```

全部設定し終えた後、ブラウザでサブドメインにアクセスしてNginxのデフォルトページが表示された時、初めてこの構成が「本物」になった気がした。

> [!NOTE]
> 無料枠でここまでできるとは正直思っていなかった。OracleはA1を取るまでが異常に大変だが、取れた後の自由度は高い。

---

## 参考リンク

- [Oracle Cloud Always Free 公式ドキュメント](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
- [Cloudflare Tunnel 公式ドキュメント](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
