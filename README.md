# javascript-course-docs

Course content repository for the JavaScript course.

This repo is **content-only** (not a Next.js app). The shared site runtime lives in [metyatech/course-docs-site](https://github.com/metyatech/course-docs-site).

## Supported environments

- Node.js 20.x or later (for the site runtime)
- Modern web browsers (Chrome, Edge, Safari, Firefox)

## Setup and local preview

1. Initialize the git submodule for agent rules:
   ```bash
   git submodule update --init --recursive
   ```

2. Use `course-docs-site` and point it at this content repo:
   ```sh
   git clone https://github.com/metyatech/course-docs-site.git
   cd course-docs-site
   npm install
   COURSE_CONTENT_REPO=metyatech/javascript-course-docs npm run dev
   ```

## Development commands

As this is a **content-only** repository, it does not contain a `package.json` or local development scripts. Linting and formatting are handled by the site runtime or by individual IDE configurations following the project's agent rules.

To regenerate `AGENTS.md` after editing `agent-ruleset.json`, use:
```bash
compose-agentsmd
```

## Deployment (Vercel)

Deployment is done via GitHub Actions using the Vercel CLI (no Vercel GitHub integration).
See [.github/workflows/deploy-vercel.yml](.github/workflows/deploy-vercel.yml).

Required GitHub Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Project structure

- `content/`: course pages (MDX) and `_meta.ts`
- `public/`: static files (e.g. `favicon.ico`)
- `site.config.ts`: per-course site configuration consumed by `course-docs-site`
- `agent-rules-private/`: shared project rules (submodule)

## Links

- [SECURITY.md](https://github.com/metyatech/.github/blob/main/SECURITY.md)
- [CONTRIBUTING.md](https://github.com/metyatech/.github/blob/main/CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](https://github.com/metyatech/.github/blob/main/CODE_OF_CONDUCT.md)
- [LICENSE](LICENSE) (if exists)

## License

Copyright (c) 2026 metyatech. All rights reserved.
