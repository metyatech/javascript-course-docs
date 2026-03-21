# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `package.json` for managing dev dependencies (Prettier, Markdownlint) and standard dev commands.
- `.github/dependabot.yml` for automated dependency updates (GitHub Actions and npm).

### Changed

- Updated CI workflow to use `npm run verify` for unified verification.
- Updated `pre-commit` hook to use `npm run verify`.

## [0.1.0] - 2026-03-21
