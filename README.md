# kintsuba / works

公開中の個人制作をまとめる、GitHub Pages向けのシンプルなポートフォリオです。

## ローカルで確認する

```sh
npm install
npm run dev
```

## 作品を追加する

`src/content/projects/` にMarkdownファイルを追加します。

```md
---
title: 作品名
url: https://example.com/
order: 3
---
```

`main` ブランチへpushすると、GitHub Actionsが自動でビルドしてGitHub Pagesへ公開します。初回のみ、GitHubリポジトリの **Settings → Pages → Source** で **GitHub Actions** を選択してください。
