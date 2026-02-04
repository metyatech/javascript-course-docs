# javascript-course-docs

JavaScriptコースの **教材コンテンツ専用** リポジトリです。

このリポジトリ自体は Next.js アプリではありません（サイト実行基盤は別リポジトリ `metyatech/course-docs-site` で共有します）。

## Local preview

`course-docs-site` を使ってプレビューします。

```sh
git clone https://github.com/metyatech/course-docs-site.git
cd course-docs-site
npm install
COURSE_CONTENT_REPO=metyatech/javascript-course-docs npm run dev
```

## Deploy (Vercel)

このリポジトリへの push をトリガに、Vercel の Deploy Hook を叩きます（`.github/workflows/deploy-vercel.yml`）。

必要な GitHub Actions secrets:

- `VERCEL_DEPLOY_HOOK_URL`

## AGENTS.md

This project uses `agent-rules`, `agent-rules-tools`, and `agent-rules-private` as git submodules.
After cloning, initialize submodules:

```bash
git submodule update --init --recursive
```

Update `agent-ruleset.json` as needed and regenerate with:

```bash
compose-agentsmd
```

## Overview

This repository contains the `javascript-course-docs` course content.
