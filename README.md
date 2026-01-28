# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Setup

```bash
npm install
```

## Development Commands

### Local Development

```bash
npm run start
```

This starts the Docusaurus dev server and `@metyatech/workspace-launch-server` (as an npm dependency) in parallel. A browser opens automatically and backend endpoints (e.g. `/manifest`) are available on port `8787`.

Need only the docs UI? Run `npm run start:docusaurus`. Need only the API? Run `npm run server` (internally executes the `workspace-launch-server` binary).

If port 3000 is busy, pass a different port:

```bash
npm run start -- --port 3001
```

You can also set `PORT`:

```bash
# macOS/Linux
PORT=3001 npm run start

# Windows PowerShell
$env:PORT=3001; npm run start
```

If the requested port is busy, the start script automatically selects the next available port.

### Build

```bash
npm run build
```

This generates static content into the `build` directory.

### Lint

```bash
npm run lint
```

### E2E Tests (Playwright)

First-time setup (download browsers):

```bash
npx playwright install chromium
```

Run the tests:

```bash
npm run test
```

### Deploy

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<your GitHub username> npm run deploy
```

For GitHub Pages hosting, this builds the website and pushes to the `gh-pages` branch.

### Typecheck

```bash
npm run typecheck
```

## AGENTS.md

This project uses `agent-rules`, `agent-rules-tools`, and `agent-rules-private` as git submodules.
After cloning, initialize submodules:

```bash
git submodule update --init --recursive
```

Update `agent-ruleset.json` as needed and regenerate:

```bash
node agent-rules-tools/tools/compose-agents.cjs
```

## Environment Variables/Settings (Microsoft Teams Sign-in)

This site requires sign-in with Microsoft Teams / Microsoft 365 accounts via `@metyatech/docusaurus-microsoft-auth`.

1. In Azure portal, create a new Entra ID app registration and add `http://localhost:3000` (or your dev URL) as a Web redirect URI.
2. Copy the Application (client) ID and Directory (tenant) ID.
3. Copy `.env.example` to `.env` and update common values. Add local-only values to `.env.development.local` and production-only values to `.env.production.local` (you can also use `.env.local`). `docusaurus.config.ts` loads these files in order and later files override earlier values.

Example `.env` values:

```bash
DOCUSAURUS_MICROSOFT_CLIENT_ID=<Application (client) ID>
DOCUSAURUS_MICROSOFT_TENANT_ID=<Directory (tenant) ID>
DOCUSAURUS_MICROSOFT_AUTHORITY_HOST=https://login.microsoftonline.com
DOCUSAURUS_MICROSOFT_REDIRECT_URI=http://localhost:3000
DOCUSAURUS_MICROSOFT_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
DOCUSAURUS_MICROSOFT_SCOPES=User.Read
```

- If `AUTHORITY_HOST` is omitted, `https://login.microsoftonline.com` is used.
- If `REDIRECT_URI` and `POST_LOGOUT_REDIRECT_URI` are omitted, the current site URL is used (GitHub Pages: `https://<your-account>.github.io/javascript-course-docs/`).
- For additional Graph API permissions, set comma-separated scopes in `DOCUSAURUS_MICROSOFT_SCOPES`.
- For production, create `.env.production.local` and override redirect URIs/scopes as needed.
