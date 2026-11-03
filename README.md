# React Starter

Template repository for React projects using:
- React + TypeScript
- Vite
- Styled Components
- Biome
- i18next + i18next-cli

## Requirements

- Node.js 26 LTS (exact version in `.node-version`, also used by GitHub Actions)
- npm `>=10`

## Project Structure

- Root: monorepo workspace orchestration
- App package: `packages/react-app`

## Install

Use the `Root` terminal:

```bash
npm install
```

## Run the App

Use the `React app` terminal (`cwd: packages/react-app`):

```bash
npm run dev
```

App runs on `http://localhost:8080`.

## Build

Use the `Root` terminal:

```bash
npm run build:react-app
```

Build output: `packages/react-app/dist`.

## Formatting

Use the `Root` terminal:

```bash
npm run format
```

## i18n Extraction

Use the `i18n - React app` terminal (`cwd: packages/react-app`):

```bash
npm run i18n:generate
```

This runs `i18next-cli` with `packages/react-app/i18next.config.ts`.

## Tests

Use the `React app` terminal (`cwd: packages/react-app`):

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```
