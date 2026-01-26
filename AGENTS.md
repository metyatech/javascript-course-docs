<!-- markdownlint-disable MD025 -->
# Tool Rules (compose-agentsmd)
- Before starting any work, run `compose-agentsmd` from the project root.
- To update shared rules, run `compose-agentsmd edit-rules`, edit the workspace rules, then run `compose-agentsmd apply-rules`.
- Do not edit `AGENTS.md` directly; update the source rules and regenerate.
- When updating rules, include a detailed summary of what changed (added/removed/modified items) in the final response.

# AGENTS ルール運用（合成）

## 対象範囲

- この `AGENTS.md` は単独で完結する前提とする。
- 親子ディレクトリの `AGENTS.md` に依存しない（継承/優先の概念は使わない）。
- ルールは共通ルールとして一元管理し、各プロジェクトから参照して合成する（例: 共通ルールリポジトリの `rules/` を参照）。
- プロジェクト固有ルールが必要な場合は、プロジェクト側にローカルルール（例: `agent-rules-local/`）を配置し、ルールセット定義から参照して合成する。

## 更新方針

- ルール変更は共通ルール、プロジェクト固有ルール、ルールセット定義（例: `agent-ruleset.json` や ruleset bundle）に対して行い、合成ツールで `AGENTS.md` を再生成する。
- 生成済みの `AGENTS.md` は直接編集しない（編集が必要なら元ルールへ反映する）。
- `AGENTS.md` は生成物だが例外として `.gitignore` に追加せず、再生成してコミットする。
- ユーザーから「ルールを更新して」と依頼された場合、特段の指示がない限り「適切なルールモジュールとルールセットを更新し、再生成する」ことを意味する。
- ユーザーが「常にこうして下さい」など恒常運用の指示を明示した場合は、その指示自体をルールとして適切なモジュールに追記する。
- ユーザーが「必ず」「つねに」などの強い必須指定を含む指示を出した場合は、その指示がグローバルかプロジェクト固有かを判断し、適切なモジュールに追記して再生成する。

## ルール修正時の注意点

- MECE（相互排他的かつ全体網羅的）に分類し、重複と漏れを作らない。
- 冗長な説明や同じ内容の繰り返しを避ける（必要十分）。
- 手順や指示は、何をすれば良いかが一読で分かる端的な表現で書く。
- 手順以外の列挙に番号を振らない（追加/削除で保守が崩れるため）。
- 各セクションの役割を明確にし、「どこに書くべきか」が一目で分かる構成にする。

## AGENTS.md の配置

- 各プロジェクトのルートに `AGENTS.md` を置く。
- サブツリーに別プロジェクトがある場合のみ、そのルートに `AGENTS.md` を置く（同一プロジェクト内で重複配置しない）。

# CLI behavior standards

- Provide `--help`/`-h` with clear usage, options, and examples.
- Provide --version so automation can pin or verify installed versions.
- Use -V for version and reserve -v for --verbose.
- When the CLI reads or writes data, support stdin/stdout piping and allow output to be redirected (e.g., `--output` when files are created).
- Offer a machine-readable output mode (e.g., `--json`) when the CLI emits structured data.
- For actions that modify or delete data, provide a safe preview (`--dry-run`) and an explicit confirmation bypass (`--yes`/`--force`).
- Provide controllable logging (`--quiet`, `--verbose`, or `--trace`) so users can diagnose failures without changing code.
- Use deterministic exit codes (0 success, non-zero failure) and avoid silent fallbacks.

## コマンド実行

- ユーザーが明示しない限り、コマンドにラッパーやパイプを付加しない。
- ビルド/テスト/実行は、各リポジトリの標準スクリプト/手順（`package.json`、README等）を優先する。
- When running git commands that could open an editor, avoid interactive prompts by using `--no-edit` where applicable or setting `GIT_EDITOR=true` for that command.

# 配布と公開

- 公開物には最低限 `LICENSE` を含める。
- 配布物に不要なファイル（例: 生成物、テスト生成物、ローカル設定）を含めない。
- 利用側がクリーン環境から README に書かれた手順だけで利用できる状態を担保する。
- 公開内容が変わる場合は、バージョン情報があるなら更新し、変更点を追跡可能にする。

## GitHub リポジトリの公開情報

- 外部公開リポジトリでは、GitHub 側の Description / Topics / Homepage を必ず設定する。
- GitHub 上での運用に必要なファイルをリポジトリ内に用意する。
- `.github/workflows/ci.yml`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/pull_request_template.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- CI は、当該リポジトリの標準コマンド（例: `npm run lint`, `npm test`）を実行する構成にする。

## Release 運用

- 公開リポジトリでは `CHANGELOG.md` を用意し、公開内容の変更を追跡可能にする。
- 公開（npm 等）を行ったら、対応する Git タグ（例: `v1.2.3`）を作成して push する。
- GitHub Releases を作成し、本文は `CHANGELOG.md` の該当バージョンを基準に記述する。
- バージョンは `package.json`（等の管理対象）と Git タグの間で不整合を起こさない。
- When bumping a version, always create the GitHub Release and publish the package (e.g., npm) as part of the same update.
- For npm publishing, ask the user to run `npm publish` instead of executing it directly.
- Before publishing, run any required prep commands (e.g., `npm install`, `npm test`, `npm pack --dry-run`) and only attempt `npm publish` once the environment is ready. If authentication errors occur, ask the user to complete the publish step.

## 実装・技術選定

- JavaScript ではなく TypeScript を標準とする（`.ts`/`.tsx`）。
- JavaScript は、ツール都合で必要な設定ファイル等に限定する。
- 既存の言語/フレームワーク/依存関係の範囲で完結させる。新規依存追加は必要最小限にする。
- 対象ツール/フレームワークに公式チュートリアルや推奨される標準手法がある場合は、それを第一優先で採用する（明確な理由がある場合を除く）。
- 「既存に合わせる」よりも「理想的な状態（読みやすさ・保守性・一貫性・安全性）」を優先する。
- ただし、目的と釣り合わない大改修や無関係な改善はしない。
- 不明点や判断が分かれる点は、独断で進めず確認する。
- 推測だけで判断して進めない。根拠が不足している場合は確認する。
- 原因・根拠を未確認のまま「可能性が高い」などの推測で実装・修正しない。まず事実確認し、確認できない場合はユーザーに確認する。
- Externalize long embedded strings/templates/rules into separate files when possible to keep code readable and maintainable.

### 意思決定の優先順位

保守性 ＞ テスト容易性 ＞ 拡張性 ＞ 可読性

## 設計・実装の原則（共通）

- 責務を小さく保ち、関心を分離する（単一責任）。
- 依存関係の方向を意識し、差し替えが必要な箇所は境界を分離する（抽象化/インターフェース等）。
- 継承より合成を優先し、差分を局所化する（過度な階層化を避ける）。
- グローバルな共有可変状態を増やさない（所有者と寿命が明確な場所へ閉じ込める）。
- 深いネストを避け、ガード節/関数分割で見通しを保つ。
- 意図が分かる命名にする（曖昧な省略や「Utils」的な雑多化を避ける）。
- ハードコードを避け、設定/定数/データへ寄せられるものは寄せる（変更点を1箇所に集約する）。
- 変更により不要になったコード/ヘルパー/分岐/コメント/暫定対応は、指示がなくても削除する（残すか迷う場合は確認する）。
- 未使用の関数/型/定数/ファイルは残さず削除する（意図的に残す場合は理由を明記する）。

## コーディング規約

- まずは各リポジトリの既存コード・設定（formatter/linter）に合わせる。
- 明示的な規約がない場合は、対象言語/フレームワークの一般的なベストプラクティスに合わせる。

## ドキュメント

- 仕様・挙動・入出力・制約・既定値・順序・命名・生成条件・上書き有無など、仕様に関わる内容は詳細かつ網羅的に記述する（要約だけにしない）。
- 実装を変更して仕様に影響がある場合は、同一変更セットで仕様書（例: `docs/`）も更新する。仕様書の更新が不要な場合でも、最終返答でその理由を明記する。
- Markdown ドキュメントの例は、テストケースのファイルで十分に示せる場合はテストケースを参照する。十分でない場合は、その例をテストケース化できるか検討し、可能ならテスト化して参照する。どちらも不適切な場合のみドキュメント内に例を記載する。

# JSON schema validation

- When defining or changing a JSON configuration specification, always create or update a JSON Schema for it.
- Validate JSON configuration files against the schema as part of the tool's normal execution.

# Languages and writing

## Response language

Write final responses to the user in Japanese unless the user requests otherwise.

## Writing language

- Unless specified otherwise, write developer-facing documentation (e.g., `README.md`), code comments, and commit messages in English.
- Write rule modules in English.

# Markdown Linking Rules

## Link format
- When a Markdown document references another local file, the link must use a
  relative path from the Markdown file.

# Multi-repo workflow

## マルチリポジトリ運用

- リポジトリは基本的に独立しており、変更は「影響のあるリポジトリ」に限定して行う。
- 共通モジュール/共有ライブラリを更新した場合は、利用側リポジトリでも参照（サブモジュール/依存関係/バージョン）を更新し、必要な検証まで同じ変更セットで行う。

## ブランチ/PR 運用

- ブランチの指定がない場合は、現在のブランチで作業してよい。
- `main`/`master` への直接コミット/プッシュを許可する。

## 変更の局所化

- 変更対象（影響範囲）を明確にし、無関係な別リポジトリへ不用意に波及させない。

## 検証

- 変更したリポジトリ内の手元検証を優先する（例: `npm run build`, `npm test`）。
- 共通モジュール側の変更が利用側に影響しうる場合は、少なくとも1つの利用側リポジトリで動作確認（ビルド等）を行う。

# Publication standards

- Define a SemVer policy and document what counts as a breaking change.
- Ensure release notes call out breaking changes and provide a migration path when needed.
- Populate public package metadata (name, description, repository, issues, homepage, engines) for published artifacts.
- Validate executable entrypoints and any required shebangs so published commands run after install.
- Run dependency security checks appropriate to the ecosystem before release and address critical issues.

# 品質（テスト・検証・エラーハンドリング）

## 方針

- 品質（正確性・安全性・堅牢性・検証容易性）を最優先とする。納期/速度/簡便さより品質を優先する。

## 検証（ビルド/テスト/静的解析）

- 変更に関連する最小範囲のビルド/テスト/静的解析を実行する。
- 実行方法は各リポジトリが用意しているスクリプト/コマンドを優先する（例: `npm run build`, `npm test`）。
- 静的解析（lint / 型チェック / 静的検証）は必須とし、対象リポジトリに未整備なら同一変更セット内で追加する（必須）。
- 追加時はまず依存追加なしの最小構成を優先する（例: TypeScript は `tsc --noEmit`）。新規依存が必要な場合は候補と影響範囲を提示し、ユーザー確認後に追加する。
- 実行できない場合は、その理由と、ユーザーが実行するコマンドを明記する。

## テスト

- 進め方: 原則として、実装や修正より先にテストを追加し、先に失敗を確認してから本実装を行う（test-first）。
- 常に多様な入力パターンを想定したテストを作成する（必須）。
- 最小のテストだけにせず、期待される挙動の全範囲（成功/失敗、境界値、無効入力、代表的な状態遷移）を網羅する。
- 原則: 挙動が変わる変更（仕様追加/変更/バグ修正/リファクタ等）には、同一変更セット内で自動テスト（ユニット/統合/スナップショット等）を追加/更新する（必須）。
- 仕様追加/変更時は、既存仕様の挙動が維持されていることを保証する回帰テストを追加/更新する（必須）。
- 出力ファイルの仕様を定義している場合、決定的な内容については全文一致のテスト（ゴールデン/スナップショット等）で検証する（必須）。
- 網羅性: 変更箇所の分岐・状態遷移・入力パターンについて、結果が変わり得るすべてのパターンを自動テストで網羅する（必須）。少なくとも「成功/失敗」「境界値」「無効入力」「代表的な状態遷移（例: 直前状態の影響、切り替え、解除/復帰）」を含める。
- 失敗系: 期待されるエラー/例外/不正入力の失敗ケースも必ずテストする（必須）。
- テスト未整備: 対象リポジトリにテストが存在しない場合は、まず実用的に運用できるテスト基盤を同一変更セット内で追加し、変更範囲の全挙動を確認できる十分なテストを追加する。新規依存追加が必要な場合は、候補と影響範囲を提示してユーザーに確認してから進める。
- 例外: テスト追加や網羅が困難/不適切な場合は、理由と不足しているパターン（カバレッジギャップ）を明記し、代替検証（手動確認手順・実行コマンド等）を提示してユーザーの明示許可を得る（独断で省略しない）。
- テストは決定的にする（時刻/乱数/外部I/O/グローバル状態への依存を最小化し、必要なら差し替え可能にする）。
- Playwright のテストが動作しない場合は、`playwright/.cache` を削除してから再実行する（例: `npm run test-ct:clean`）。

## 再発防止

- 仕様追加/変更に起因する不具合が発生した場合は、再発防止のために回帰テストを追加し、必要に応じてルール/プロセスも更新する（必須）。
- ユーザーが問題点を指摘した場合は、種別（バグ/仕様/運用/手順）に関わらず、再発防止のためにルール/プロセス/テストの更新を行う（必須）。

## バグ修正（手順）

バグ修正は原則として、次の順で行う:

1. バグを再現する自動テストを追加/更新し、テストが失敗することを確認する。
2. バグ修正を行う。
3. 関連するテストを実行し、修正によってテストが通ることを確認する。

上記の自動テスト追加が困難な場合は、理由と代替検証手順を明記し、ユーザーに確認してから省略する。

## エラーハンドリング

- 失敗を握りつぶさない（空の catch / 黙殺 / サイレントフォールバックを避ける）。
- 回復可能なら早期 return + 明示的なエラー通知、回復不能なら明確に停止/失敗させる。
- エラーメッセージは実際の原因を簡潔に示し、必要な場合は対象の入力名と値（例: パス）を含める。

## 設定検証

- 設定値や外部入力（環境変数/設定ファイル/CLIオプション等）は、起動時または入力境界で検証する。
- 誤った設定はサイレントに補正せず、「何を直せばよいか」が分かる明示的なエラーで停止する。

## ログ

- ログは冗長にしないが、原因特定に必要なコンテキスト（識別子や入力条件）を含める。
- 秘密情報/個人情報をログに出さない（必要ならマスク/分離する）。

## Documentation (README)

- Every repository (module) must include a `README.md`.
- At minimum, the README must cover overview/purpose, setup, development commands (e.g., build/test/lint), required environment variables/config, and release/deploy steps (if applicable).
- For any source code change, always check whether the README is affected. If it is, update the README at the same time as the code changes (do not defer it to a later step).
  - Impact examples: usage/API/behavior, setup steps, dev commands, environment variables, configuration, release/deploy steps, supported versions, breaking changes.
  - Even when a README update is not needed, explain why in the final response (do not skip silently).

# 生成物

- 生成物（例: `build/`, `dist/`, `node_modules/`）は原則コミットしない（各リポジトリの `.gitignore` に従う）。

# Naming alignment

- 機能/内容とファイル名・フォルダ名が一致しない場合は、適切な名称にリネームして整合させる。

# Naming consistency

- 命名規則（大文字小文字、略語、区切り方）をリポジトリ内で一貫させ、混在があれば整合するようにリネームする。

## Module system (ESM)

- Always set `"type": "module"` in `package.json`.
- Prefer ESM with `.js` extensions for JavaScript config and scripts (e.g. `next.config.js` as ESM).

## Node packages

### 公開（GitHub / npm）

- スコープ付きパッケージを npm 公開する場合は `publishConfig.access: "public"` を設定する。
- npm 公開時は `files` を設定し、配布物を意図どおりに限定する。
- クリーン環境の `npm install` だけで使えない場合は、`prepare` 等で必要なビルドを行う。

### 検証

- 配布物の想定がある場合は `npm pack --dry-run` で内容を確認する。
- テストがある場合は `npm test` を実行する。

## 教材サイト（本文・演習）作成ルール

本ファイルには、教材サイトに共通して適用する「安定したルール」を中心に記載する。
個別事例・暫定判断・可変仕様・特定リポジトリ固有設定は、原則としてこのファイルに書かない。

### 意思決定の優先順位

教材では「学習効果（分かりやすさ・段階性・再現性）」を最優先する。

## 本文・サンプル

- 教材ページ（`docs/` 配下）の本文・ラベル・出力文は日本語で、学習者が理解できる語彙で書く。
- 本文は冗長にしない。長い説明が必要な場合は、短い段落・箇条書き・小見出しで分割し、段階的に進める。
- 編集者向けメモや方針（例: 「ここでは扱わない」「編集メモ: ...」）やメタ的内容（例: 「AIが考える...」）は本文に入れない。
- 用語・見出し構成・説明の粒度は既存ページのパターンに合わせ、学習者が迷わない一貫性を優先する。
- サンプルは「1サンプル=1トピック」を守り、短く単純にする（長くなる場合は分割/段階化）。
- 識別子（変数名・クラス名・`id` 等）は意図が推測できる短い名前にする。1文字変数は原則避ける（例外: `i`, `j`）。
- 出力があるコードは期待値を併記する（例: `console.log(x); // 出力: ...`）。
- サンプルコード内のコメント（`// ...` / `/* ... */`）は原則日本語で書く（学習者向けのため）。
- コードブロックは言語指定を付ける（例: `js`, `ts`, `html`, `css`）。
- 章の冒頭では「どこで使うか」を1～2文で示して動機付けを行う。
- 実在サイト例を出す場合は、個人情報が表示されるページや認証が必要なページへリンクしない。

## 既習事項の扱い

- 既習/未習の判定は `sidebars.ts` の並び順を基準にする（既習=前のページ + 当該ページ内で説明済み）。
- 未習の API / 構文が必要になる場合は、前提説明を先に追加するか、出題/解説の設計を変更する。

## 主要ディレクトリとページ追加

- 主要: `docs/`（教材）, `sidebars.ts`（並び順）, `docusaurus.config.ts`（設定）, `static/`（サイト全体の静的ファイル）。
- 新規ページは「フォルダ化ページ」に統一し、`docs/<chapter>/<slug>/index.mdx`（コンポーネントを全く使わない場合は `index.md`）に作成する。
  - 先頭に frontmatter（`title`）を設定する。
  - 必要なコンポーネントは frontmatter の直後で import する（MDX）。
- ページを追加/分割した場合は `sidebars.ts` も更新し、既習事項（上記「既習事項の扱い」）と矛盾しない並びにする（迷う場合は末尾追加を基本とする）。

## ページ資材（assets）

- 画像・配布物などページに紐づく資材は、**用途でフォルダを分けず**に「ページ単位」で管理する。
- 各ページは `docs/<chapter>/<slug>/index.mdx` とし、資材は `docs/<chapter>/<slug>/assets/...` に置く。
  - ページ内表示の画像: `![...](./assets/example.png)` のように相対パスで参照する。
  - 配布（ダウンロード）: `<a href={require("./assets/<name>")} download="<name>">...</a>` を使う。
    - `download` を指定しないとハッシュ名になるため、原則として付ける。
    - この教材サイトの構成では、`require("./assets/<name>")` はURL文字列を返す前提（`.default` を付けない）。
- 「同一章内で複数ページ共通」「サイト全体で共通」などの共有置き場は作らない。
  - 複数ページで同じ資材を使い回す場合でも、各ページの `assets/` にコピーして持つ（依存関係を作らない）。

## 付属ファイルのビルド前提（@metyatech/docusaurus-download-assets）

- `docs/**/assets/` 配下の任意拡張子ファイルを `require/import` で扱えるようにするため、教材サイトは `@metyatech/docusaurus-download-assets` を有効化している前提で運用する。
- 付属ファイルを追加したのにビルドで「loader がない / Module parse failed」等が出た場合は、まず当該教材サイトの `package.json` 依存と `docusaurus.config.ts` のプラグイン有効化を確認する。

## CodePreview（@metyatech/code-preview）

- **実行できるサンプルは CodePreview を優先**（単純な構文説明、非実行コードなどは通常のコードブロックでも可）。
- CodePreview のスタイルはコンポーネント側で注入される前提のため、ページ側で `@metyatech/code-preview/styles.css` を import しない。
- 初期コードは、**`<CodePreview>...</CodePreview>` の中（開始タグと終了タグの間）** にフェンスコードブロックで書く。
  - 言語ラベルは `html` / `css` / `js` / `javascript` を使う（省略しない）。
  - `html` ブロックは、原則 **`<body>` の中に置く内容だけ**を書く（`<!DOCTYPE html>` / `<html>` / `<head>` / `<body>` は書かない）。
  - CSS/JS は、原則、それぞれ `css` / `js`（または `javascript`）の **別ブロック**に分ける（HTML に `<style>` / `<script>` を埋め込まない）。
  - CSSは `{}` の前後を改行し、プロパティは `color: red;` のように `:` の後にスペースを入れる。
- CodePreview 内で参照する画像は `images` マップで仮想パス→実パスを渡す（Markdown/MDX の相対パス参照とは別）。
- 複数プレビューで同じ初期コードを共有したい場合は `sourceId` を使う。
  - `sourceId` は衝突を避けるため、ページ内で一意になる短い文字列を推奨（ASCIIでなくても可）。
- 表示制御: `htmlVisible`, `cssVisible`, `jsVisible`, `previewVisible` で各パネルを切り替える。

## 演習（@metyatech/exercise）

- `@metyatech/exercise/client` の `<Exercise>` と `<Solution>` を使用する。
  - `<Solution>` は必ず同一 `<Exercise>` の末尾に配置する。
- タイトル採番: `演習N` / `演習-発展N` を基本とし、後ろに括弧で説明を付けてよい（例: `演習1（?）`、`演習-発展1（?）`）。ページ内で重複や飛び番を作らない。
- 問題文は曖昧さを避け、開始データ・手順・確認方法・完成イメージを明示する（短く書く）。
- 問題文にヒントを入れるのは可。ただし解答に直結するコード/手順/値など「直接的な答え」は書かない（必要なら `<Solution>` 側へ移す）。
- 解答コードは `<Solution>` 内に置き、説明は初学者向けに短く具体的に書く。
- 見た目を作成する演習では、完成イメージを視覚的に提示する（プレビュー表示、提示コード内コメントなど、最も理解しやすい方法を選ぶ）。

### 演習・演習-発展の配置方針

- 各トピックごとに「演習」と「演習-発展」をこまめに配置し、学習直後に実践できるようにする（資料末尾にまとめて配置しない）。
- 「演習」は最低限知っておくべき内容までを目安にし、必要なら複数配置してよい。
- 「演習-発展」はより高いレベルの内容とし、全体を通して後半ほど難易度を上げる（複数配置してよい）。
- 本質的に同じ内容の演習を繰り返さず、多角的な出題にする。

### 演習問題の内容方針

- **演習**: 学習トピックの習得にのみフォーカスし、関係のない不要な要素を含めない。
- **演習-発展**: より実践的でもよいが、学習トピックを中心に習得できる問題にする。

### 演習作成時の既習事項確認と重複回避

演習・演習-発展を作成する際は、必ず以下の手順を踏むこと:

1. **既習事項の確認**: 上記「既習事項の扱い」に従い、未習の API / 構文を使わない設計になっていることを確認する。
2. **既出演習内容の確認**: 同一ページ内および過去ページで既に出題された演習内容を確認する。「表面的な違い」ではなく「本質的な違い（学習ポイント・解法パターン）」があるかで判断する。
3. **本質的重複の判定**: 同じイベント・同じ操作パターン・同じ学習ポイントの組み合わせは「本質的に同じ」とみなす。異なる観点（状態管理、複数イベント、条件分岐、累積変化、複数要素連動など）を持つ問題を作る。
4. **実現可能性確認**: 既習事項のみで解けることを確認する。未習事項が必要／冗長な繰り返しだけになる場合は再設計する。

## テスト・試験（評価問題）

- 設問は1つの解釈・1つの正解になるように、初期状態・操作回数・期待結果を明示する。
- 「切り替わる」など曖昧な語は、状態遷移（例: クリックのたびにトグル／1回目のみ変化）を文章で固定する。
- UI操作を問う設問は、動作イメージ（GIF/静止画）を問題文内に提示して期待動作を固定する（可能なら解答デモを再現してキャプチャ）。
- 穴埋め問題は、答えの形式（値/単位/セレクタ/プロパティ名など）と禁止事項を明示する。
- 外部システムと連携する穴埋めは `${答え}`（複数解は `${/正規表現/}`）の形式で示し、別形式（例: `【1】`）へ置換しない。
- 複数解を許容する場合は、許容範囲（例: `textContent`/`innerText` どちらでも可）を問題文に明記する。

### 自動採点に対応した試験問題（Markdown で作成すること）

以下の規約は「自動採点ツールがそのまま再利用できる最小限」に限定する。

#### 1) 試験メタ（ファイル先頭の frontmatter）

- 必須キー: `examId`, `schemaVersion`, `timeLimitMinutes`, `totalPoints`, `questionCount`
- `examId` は年度や学期を含む一意なID（例: `js2-2026-2-final-regular`）
- `schemaVersion` は `exam-md@1` など固定文字列

#### 2) 設問の見出し

- 各設問は `## 問N` で始める（Nは1始まりの連番）
- CSVの `qN/answer` との対応は、この `N` を使って自動対応する（個別IDは付与しない）

#### 3) 採点基準は必ず「表」で記載

Rubric表は必須。列名は以下に固定する。

- `criterionId`（設問内で一意）
- `points`（数値）
- `description`（学生向けの達成条件）
- `gradingMode`（採点モード）

`gradingMode` の許容値:

- `manual`（手動採点。未採点として扱う）
- `fill`（穴埋め自動採点。設問内の `${...}` から期待値を取得してOK/NG判定）

このリポジトリの自動採点ツールは、言語依存の静的解析を前提にしない。
そのため、**自動採点できるのは `fill` のみ** とし、`manual` は **未採点（要レビュー）** とする。

`fill` の自動採点は、設問本文のどこかにある `${...}` を期待値として扱う（CSSに限らない）。
`${/正規表現/}`（例: `${/transform|all/}`）の形式は正規表現一致、それ以外は文字列一致。
Rubric表の `fill` 行の順序（1行目、2行目…）と、`${...}` の出現順（1個目、2個目…）を対応付ける。
`fill` 行数と `${...}` 個数が一致しない場合はエラーとし、試験Markdownを修正する。

#### 3-1) 禁止事項

- `gradingMode` の許容値は `manual` / `fill` のみ（それ以外はエラー）。
- 自動採点は `fill` のみ。`manual` を自動採点対象にしない。

#### 3-2) 自動採点フロー（運用）

- 自動採点は `fill` のみをOK/NG判定する。
- `manual` および `fill` のNGはAIレビュー対象として抽出する。
- AIレビュー結果は `decisions.csv` に保存し、人間が最終確認する。
- 点数はRubricの `points` を唯一の参照元とし、`finalStatus` のみで確定する。

#### 4) Rubric表の位置

- 各設問内の「採点基準・配点」節にRubric表を置く（箇条書きは使わない）
- 解答と解説は必須（学生に配布するため）

#### 5) 書式例（テンプレート）

以下の例を基準にする（最小構成）。

```markdown
---
examId: js2-YYYY-2-final-regular
schemaVersion: exam-md@1
timeLimitMinutes: 80
totalPoints: 80
questionCount: 4
---

## 問1

問題文。

HTML:

```html
<!-- ここにHTML -->
```

CSS:

```css
/* ここにCSS */
```

**要件：**

- 要件を箇条書きで明確にする

### 採点基準・配点

| criterionId    | points | description                          | gradingMode |
| -------------- | ------ | ------------------------------------ | ----------- |
| q1.button.get  | 3      | ボタン要素を取得できている           | manual      |
| q1.text.get    | 3      | テキスト要素を取得できている         | manual      |
| q1.event.click | 5      | クリックイベントを設定する記述がある | manual      |
| q1.text.update | 3      | テキストを変更する記述がある         | manual      |
| q1.requirement | 2      | 要件通り動作する                     | manual      |

### 解答

```js
// 解答例
```

### 解説

解説本文。

---

## 問2

問題文。

### 採点基準・配点

| criterionId     | points | description                          | gradingMode |
| --------------- | ------ | ------------------------------------ | ----------- |
| q2.title.get    | 3      | タイトル要素を取得できている         | manual      |
| q2.content.get  | 3      | コンテンツ要素を取得できている       | manual      |
| q2.event.click  | 5      | クリックイベントを設定する記述がある | manual      |
| q2.class.toggle | 5      | クラスを付け外しする記述がある       | manual      |
| q2.requirement  | 2      | 要件通り動作する                     | manual      |

### 解答

```js
// 解答例
```

### 解説

解説本文。

#### 6) 例外

- ルールにない独自フォーマットを導入しない（解析不能になる）
- ルール変更が必要な場合は、先に本ルールへ追記してから問題を作る
