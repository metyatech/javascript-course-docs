# javascript-course-docs

Course site built with [Nextra](https://nextra.site/) (Next.js + MDX).

## Requirements

- Node.js: see `engines.node` in `package.json` (currently `>=20`)
- Package manager: npm

## Setup

```bash
npm install
```

## Development commands

### Local development

```bash
npm run dev
```

### Build (static export)

```bash
npm run build
```

This generates a static export into `out/` and also creates the Pagefind search
index under `out/_pagefind/` via the `postbuild` script.

### Start production server

```bash
npm run start
```

### Typecheck

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

### E2E (Playwright)

```bash
npm run test:e2e
```

If Playwright browsers are missing, install Chromium:

```bash
npx playwright install chromium
```

## Deploy (Vercel)

Deploy via GitHub Actions (`.github/workflows/deploy-vercel.yml`).

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

## Overview

This repository contains the javascript-course-docs project.
