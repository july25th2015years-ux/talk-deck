# TalkDeck（トークデッキ）💬

> **気まずい沈黙をゼロにする。雑談ネタ＆深掘り質問アシスタント Web アプリ**

TalkDeck は、シチュエーション（職場・初対面・友人・デート・もしも）や相手との親密度（Lv.1〜Lv.3）に合わせて最適な雑談の話題を提供し、さらに会話を途切れさせない「深掘り質問のヒント」や「広げ方のアドバイス」を表示するスタイリッシュなカードめくり型Webアプリケーションです。

Google Gemini API と連携することで、シチュエーションに合わせたオーダーメイド話題の生成や、相手の反応に応じたリアルタイム切り返し提案も可能です（APIキー未設定でも全プリセット話題集は完全無料で動作します）。

---

## 🚀 主な機能

1. **3Dカードフリップ＆ドロー体験**
   - カード表面: カテゴリ、親密度レベル、話題の問いかけ
   - カード裏面: 会話を弾ませる「3つの深掘り質問のヒント」「広げ方のコツ」「地雷回避の注意点」
   - カードタップまたは `Enter` キーで裏返し、`Space` キーで次のカードを引くサクサク操作

2. **主要5カテゴリ × 親密度別（Lv.1〜Lv.3）フィルター**
   - 🌱 **初対面・アイスブレイク**: 食、休日、エンタメ、出身地など無難かつ盛り上がる鉄板ネタ
   - 💼 **職場・ビジネス**: 便利ツール、集中リフレッシュ法、仕事観、失敗談とリカバリー
   - ☕ **プライベート・友人**: 買ってよかったモノ、行ってみたい場所、学生時代の思い出
   - 🥂 **デート・恋愛**: 理想の休日の過ごし方、お店選び、居心地の良いポイント
   - 🔮 **もしも・深掘り**: 1億円の使い方、タイムマシン、人生の映画タイトルなど深い心理トーク
   - **親密度フィルター**: Lv.1（安心・安全）〜 Lv.3（親密・ディープ）

3. **Google Gemini AI 連携（オプショナル）**
   - 設定モーダルから Gemini API キー（無料枠あり）を登録可能
   - **AIオーダーメイド話題生成**: シチュエーション・関係性・場の雰囲気を指定して唯一無二の話題を生成
   - **AI深掘り切り返しアシスト**: 相手の反応を入力すると、次の質問3つとアドバイスを提案
   - APIキーはお使いのブラウザ内（LocalStorage）にのみ安全に保管されます

4. **お気に入り・履歴機能**
   - 気に入った話題をワンタップでブックマーク保存
   - 直前に引いた話題への「戻る」操作対応

---

## 💻 ローカルでの実行方法

```bash
# プロジェクトディレクトリへ移動
cd talk-deck

# 依存パッケージのインストール（初回のみ）
npm install

# 開発サーバーの起動
npm run dev
```

起動後、ブラウザで `http://localhost:5173` にアクセスしてください。

---

## 🌐 GitHub へのアップロードと GitHub Pages 公開手順

TalkDeck は GitHub Pages へのデプロイに完全対応しています（ビルド設定は相対パス `./` に設定済み）。

### 1. GitHub 上で新しいリポジトリを作成
1. [GitHub](https://github.com/) にログインし、右上の「＋」から **「New repository」** をクリックします。
2. Repository name（例: `talk-deck`）を入力し、**Public**（または Private）を選択して **「Create repository」** をクリックします。

### 2. ローカルからコードをプッシュ
ターミナルまたはPowerShellで以下を実行します：

```bash
cd talk-deck

# Gitの初期化（まだの場合）
git init
git add .
git commit -m "Initial commit of TalkDeck"

# mainブランチを設定
git branch -M main

# リモートリポジトリのURLを設定（YOUR_USERNAMEとYOUR_REPOSITORYはご自身のアカウントに合わせて変更）
git remote add origin https://github.com/YOUR_USERNAME/talk-deck.git

# プッシュ
git push -u origin main
```

### 3. GitHub Pages の設定（自動デプロイ）
本リポジトリには `.github/workflows/deploy.yml`（GitHub Actions自動デプロイワークフロー）が同梱されています。

1. GitHubのリポジトリページで **「Settings」** タブを開きます。
2. 左メニューの **「Pages」** をクリックします。
3. **「Build and deployment」** の **「Source」** を **「GitHub Actions」** に変更します。
4. `main` ブランチにプッシュされると自動でビルド＆デプロイが走り、数分後に専用の公開URL（`https://YOUR_USERNAME.github.io/talk-deck/`）が発行されます！

---

## 🛠 使用技術
- **Frontend**: React 18 / TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: CSS 3D Transforms, Canvas Confetti
- **AI**: Google Gemini REST API (gemini-1.5-flash / gemini-2.0-flash)
- **CI/CD**: GitHub Actions (GitHub Pages deployment)

---

## 📄 ライセンス
MIT License
