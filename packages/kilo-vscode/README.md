# Kilo Code

Kilo Code is a VS Code extension that runs an AI coding assistant with a local CLI backend and a Solid.js webview UI.

## Features

- Sidebar chat view and editor-tab chat panel.
- Session history with resume/rename/delete actions.
- Tool execution rendering (commands, file ops, diffs, status).
- Provider and model controls, including startup defaults.
- MCP server management and tool allow/deny controls.
- Connection-state UI for connecting/reconnecting/error flows.

## Requirements

- VS Code `^1.109.0`.
- A supported runtime for local development (`node`, `bun`).

## Extension Settings

The extension contributes settings under `kilo-code.new.*`, including:

- `kilo-code.new.language`
- `kilo-code.new.model.providerID`
- `kilo-code.new.model.modelID`
- `kilo-code.new.autocomplete.enableAutoTrigger`
- `kilo-code.new.autocomplete.enableSmartInlineTaskKeybinding`
- `kilo-code.new.autocomplete.enableChatAutocomplete`
- `kilo-code.new.browserAutomation.enabled`
- `kilo-code.new.browserAutomation.useSystemChrome`
- `kilo-code.new.browserAutomation.headless`
- `kilo-code.new.notifications.agent`
- `kilo-code.new.notifications.permissions`
- `kilo-code.new.notifications.errors`
- `kilo-code.new.sounds.agent`
- `kilo-code.new.sounds.permissions`
- `kilo-code.new.sounds.errors`

## Development

From this folder (`packages/kilo-vscode`):

```bash
node scripts/prepare-cli-binary.mjs
node esbuild.js --production
```

For interactive development, open this folder in VS Code and run `F5` with `Run Extension`.

## Packaging

```bash
npm run vscode:prepublish
npx @vscode/vsce package --no-dependencies
```

This generates a `.vsix` package for manual install/testing.
