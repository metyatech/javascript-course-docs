# javascript-course-docs

Course content repository for the JavaScript course.

This repo is **content-only** (not a Next.js app). The shared site runtime lives in `metyatech/course-docs-site`.

## Local preview

Use `course-docs-site` and point it at this content repo:

```sh
git clone https://github.com/metyatech/course-docs-site.git
cd course-docs-site
npm install
COURSE_CONTENT_SOURCE="github:metyatech/javascript-course-docs#master" npm run dev
```

## Supported environments

- Node.js 20 or later
- Browser: Modern browsers (Chrome, Firefox, Safari, Edge)

## Dev commands

- `compose-agentsmd`: Regenerate `AGENTS.md` after editing rules or ruleset.

## Deploy (Vercel)

Deployment is done via GitHub Actions using the Vercel CLI (no Vercel GitHub integration).
See `.github/workflows/deploy-vercel.yml`.

Required GitHub Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Project files

- `content/`: course pages (MDX)
- `public/`: static files (e.g. `public/img/**`)
- `site.config.ts`: per-course site configuration consumed by `course-docs-site`

## Agent rules

This repo includes `agent-rules-private` as a git submodule. Initialize it after cloning:

```bash
git submodule update --init --recursive
```

Regenerate `AGENTS.md` after editing `agent-ruleset.json`:

```bash
compose-agentsmd
```

## License

[MIT LICENSE](./LICENSE) (c) 2026 metyatech
