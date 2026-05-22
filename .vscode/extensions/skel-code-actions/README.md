# Skel Code Actions

Workspace-local VS Code extension for formatting rules that Biome does not expose.

VS Code discovers this unpacked extension from `.vscode/extensions/skel-code-actions` and shows it in the Extensions view under Workspace Recommendations. Install it once for this workspace after trusting the repository.

The extension registers `source.fixAll.skelCodeActions`, which is enabled in `.vscode/settings.json` through `editor.codeActionsOnSave`.

Additional TSX-only rule: inside `styled-components` template literals (`styled.*\`...\`` and `styled(...)\`...\``), it reindents CSS blocks and sorts contiguous one-line CSS declarations alphabetically by property name.

`spacing.js` is the single source of truth for both the save-time code action and the root package formatting scripts. The extension JavaScript uses `// @ts-check`, JSDoc types, `@types/vscode`, and the local `tsconfig.json` to stay TypeScript-checked without adding a VS Code extension build step.
