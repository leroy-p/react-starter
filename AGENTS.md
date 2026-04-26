# AGENTS.md

This file provides the repository operational context for future tasks.

## Project Context

- React template repository.
- npm workspaces monorepo with a single package:
  - `packages/react-app`
- Main stack:
  - React 19
  - TypeScript 6
  - Vite 8
  - Styled Components
  - i18next + i18next-cli
  - Vitest + Testing Library
  - Biome

## Useful Structure

- App: `packages/react-app`
- App entrypoint: `packages/react-app/src/index.tsx`
- Config Vite: `packages/react-app/vite.config.ts`
- Test config: `packages/react-app/vitest.config.ts`
- i18n extraction config: `packages/react-app/i18next.config.ts`
- VS Code terminals config: `.vscode/terminals.json`

## Terminal Workflow (VS Code)

Based on `.vscode/terminals.json`:

- `Root`: install, build, format, git
- `React app` (`cwd: packages/react-app`): dev + tests
- `i18n - React app` (`cwd: packages/react-app`): translation extraction

## Reference Commands

From `Root`:

- `npm install`
- `npm run build:react-app`
- `npm run format`

From `React app`:

- `npm run dev`
- `npm run test`
- `npm run test:watch`

From `i18n - React app`:

- `npm run i18n:generate`

## i18n

- Extraction command:
  - `npm run i18n:generate`
- Translation files:
  - `src/locales/en/translation.json`
  - `src/locales/fr/translation.json`

## Pre-commit Checklist

- Build OK: `npm run build:react-app`
- Tests OK: `npm run test`
- Format OK: `npm run format`
- Update README if scripts/workflow change
