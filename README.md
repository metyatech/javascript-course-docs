# javascript-course-docs

Course content repository for the JavaScript course.

This repo is **content-only** (not a Next.js app). The shared site runtime lives in `metyatech/course-docs-site`.

## Local preview

```sh
git clone https://github.com/metyatech/course-docs-site.git
cd course-docs-site
npm install
```

Then point `course-docs-site` at this repository through `.env.course.local`:

```sh
# In course-docs-site/.env.course.local
COURSE_CONTENT_SOURCE=../path-to-javascript-course-docs
```

Use any local path that is valid from the `course-docs-site` checkout. If the two repositories are siblings, that can be `../javascript-course-docs`.

## Verify

Run the canonical verification command from this repository:

```sh
node scripts/verify.mjs
```

What it does:

- runs `markdownlint` for this repository
- locates a local `course-docs-site` checkout automatically when the repos live in the same workspace
- runs `course-docs-site` lint and `build:verified` with `COURSE_CONTENT_SOURCE` set to this repository

If `course-docs-site` is not in the same workspace, set `COURSE_DOCS_SITE_DIR` in your shell or terminal session to that checkout before running `node scripts/verify.mjs`.

Automatic discovery looks for a local checkout named `course-docs-site` while walking up parent directories from this repository.

This repository follows the same local-checkout flow used by the GitHub Actions deploy workflow.
`course-docs-site` always reads this repo from a checked-out local path rather than `github:owner/repo#ref`.

## Deploy (Vercel)

Deployment is done via GitHub Actions using the Vercel CLI (no Vercel GitHub integration).
See `.github/workflows/deploy-vercel.yml`.
The workflow checks out this repository into `course-content` and points
`COURSE_CONTENT_SOURCE` at `../course-content`.

Required GitHub Actions secrets:

- `VERCEL_TOKEN` (a Vercel access token with access to the target project/team)
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Project files

- `content/`: course pages (MDX)
- `scripts/verify.mjs`: canonical verification entrypoint for local delivery checks
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
