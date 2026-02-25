# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Also read `AGENTS.md` for additional operational guidelines (publish workflows, VM ops, release processes).

## Build, Test, and Lint Commands

```bash
pnpm install              # Install dependencies
pnpm build                # Full build: a2ui bundle + tsdown + plugin-sdk DTS + post-build scripts
pnpm check                # Lint + format check (runs: format:check, tsgo, lint)
pnpm test                 # Unit tests (vitest, parallel forks)
pnpm test:fast            # Unit tests only (excludes gateway/extension tests)
pnpm test:coverage        # Unit tests with V8 coverage (70% threshold)
pnpm test:e2e             # End-to-end tests
pnpm test:live            # Live tests (requires API keys: CLAWDBOT_LIVE_TEST=1)
pnpm test:watch           # Watch mode
pnpm dev                  # Run CLI in dev mode (via tsx)
pnpm dev gateway          # Run gateway in dev mode
pnpm lint                 # Oxlint with type-aware rules
pnpm lint:fix             # Auto-fix lint + format
pnpm format               # Oxfmt format check
pnpm format --write       # Oxfmt auto-fix (note: script `format` runs check; use `oxfmt --write`)
```

### Running a Single Test

```bash
# Run a specific test file
npx vitest run src/some-module/feature.test.ts

# Run tests matching a pattern
npx vitest run -t "test name pattern"

# Watch a specific file
npx vitest src/some-module/feature.test.ts
```

### TypeScript

```bash
pnpm tsgo                 # Type-check via tsgo (native TS checker)
pnpm tsgo:test            # Type-check test config
pnpm build:plugin-sdk:dts # Generate plugin SDK .d.ts files
```

### Native Apps

```bash
pnpm ios:open             # Generate Xcode project and open it
pnpm ios:build            # Build iOS app for simulator
pnpm mac:package          # Package macOS app (scripts/package-mac-app.sh)
pnpm android:run          # Build + install + launch Android app
pnpm android:test         # Android unit tests
```

### UI (Control UI - Lit/Web Components)

```bash
pnpm ui:install           # Install UI dependencies
pnpm ui:dev               # Dev server for control UI
pnpm ui:build             # Production build
pnpm test:ui              # UI tests
```

## Architecture

OpenClaw is a multi-channel AI gateway: a CLI + native apps that connect messaging channels (Telegram, Discord, Slack, Signal, iMessage, WhatsApp, etc.) to LLM providers through a local gateway server.

### Core Runtime Flow

```
CLI entry (src/entry.ts) → profile/env setup → src/cli/run-main.ts → Commander program (src/cli/program.ts)
                                                                           ↓
                                                              gateway / agent / tui / commands
```

- **`src/entry.ts`**: CLI bootstrap; handles Node respawn for experimental warning suppression
- **`src/index.ts`**: Library entry point; exports public API + builds Commander program
- **`src/cli/program.ts`**: Commander command tree; delegates to `src/commands/` and `src/cli/` subcommands

### Key Directories

| Directory                                                                                 | Purpose                                                                                          |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/gateway/`                                                                            | WebSocket + HTTP gateway server (Express); manages channels, agents, sessions, hooks, control UI |
| `src/cli/`                                                                                | CLI commands and options (Commander-based); each `*-cli.ts` registers subcommands                |
| `src/agents/`                                                                             | LLM agent orchestration, tool definitions, Pi agent integration                                  |
| `src/providers/`                                                                          | LLM provider adapters (OpenAI, Anthropic, Gemini, etc.)                                          |
| `src/channels/`                                                                           | Shared channel routing logic                                                                     |
| `src/telegram/`, `src/discord/`, `src/slack/`, `src/signal/`, `src/imessage/`, `src/web/` | Per-channel implementations                                                                      |
| `src/infra/`                                                                              | Infrastructure utilities (env, ports, binaries, dotenv, errors, state migrations)                |
| `src/config/`                                                                             | Config loading/sessions (`openclaw.json`, `~/.openclaw/`)                                        |
| `src/media/`                                                                              | Media processing pipeline                                                                        |
| `src/memory/`                                                                             | Conversation memory/compaction                                                                   |
| `src/plugin-sdk/`                                                                         | Plugin SDK exported as `openclaw/plugin-sdk`                                                     |
| `src/hooks/`                                                                              | Gateway hooks (bundled handlers in `src/hooks/bundled/*/handler.ts`)                             |
| `src/tui/`                                                                                | Terminal UI (Lit-based TUI)                                                                      |
| `extensions/`                                                                             | Workspace packages for optional channel plugins and features                                     |
| `ui/`                                                                                     | Control UI web app (Lit/Vite) served by the gateway                                              |
| `apps/`                                                                                   | Native apps: `macos/` (Swift), `ios/` (Swift), `android/` (Kotlin), `shared/` (OpenClawKit)      |
| `skills/`                                                                                 | User-facing OpenClaw skills                                                                      |

### Plugin/Extension System

- Extensions live in `extensions/` as pnpm workspace packages
- Plugin-only deps go in the extension's `package.json`, not root
- Avoid `workspace:*` in `dependencies` (breaks `npm install`); use `devDependencies` or `peerDependencies` for `openclaw`
- Plugin SDK: `openclaw/plugin-sdk` (resolved via jiti alias at runtime)
- Plugin install runs `npm install --omit=dev` in the plugin dir; runtime deps must be in `dependencies`

### Dependency Injection

The `createDefaultDeps()` pattern (`src/cli/deps.ts`) provides lazy-loaded channel senders for testability. Each sender uses dynamic `import()` so channels are only loaded when needed.

### Control UI

Built with **Lit** web components using **legacy decorators** (`experimentalDecorators: true`, `useDefineForClassFields: false`). Use `@state()` and `@property()` decorator syntax. Do not switch to standard decorators without updating the build tooling.

### Build Pipeline

- **tsdown** (Rolldown-based): bundles entry points (`src/entry.ts`, `src/index.ts`, `src/plugin-sdk/*`, hooks)
- **tsgo**: native TypeScript type checker (used instead of `tsc` for speed)
- **oxlint + oxfmt**: linting and formatting (not ESLint/Prettier)

## Coding Conventions

- **TypeScript ESM** (`"type": "module"`). Strict typing; `no-explicit-any` is enforced via oxlint.
- **Node 22+** required. Keep both Node and Bun execution paths working.
- **Tests**: colocated `*.test.ts` files. Framework: Vitest with `pool: "forks"`. E2E tests use `*.e2e.test.ts`.
- **Naming**: product = **OpenClaw**; CLI/package/binary/paths/config keys = `openclaw`.
- **Commits**: use `scripts/committer "<msg>" <file...>` to keep staging scoped. Conventional commit style (e.g., `CLI: add verbose flag`).
- **File size**: aim for < 500 LOC; split when it improves clarity.
- **CLI progress**: use `src/cli/progress.ts` (osc-progress + @clack/prompts spinner).
- **Terminal tables**: use `src/terminal/table.ts` with ANSI-safe wrapping.
- **Colors**: use shared palette in `src/terminal/palette.ts` (no hardcoded ANSI colors).
- **Tool schemas**: avoid `Type.Union` in tool input schemas; use `stringEnum`/`optionalStringEnum` for string lists. No `anyOf`/`oneOf`/`allOf`. Avoid raw `format` property names.
- **Never update** the Carbon dependency.
- **Patched deps** (`pnpm.patchedDependencies`) must use exact versions (no `^`/`~`).
- **Patching** dependencies requires explicit approval.

## Multi-Agent Safety

When working alongside other agents:

- Do not create/apply/drop `git stash` unless explicitly requested
- Do not switch branches unless explicitly requested
- Do not modify git worktrees unless explicitly requested
- Scope commits to your changes only
- If you see unrecognized files, keep going; commit only your changes

## Messaging Channels

When modifying shared channel logic (routing, allowlists, pairing, command gating, onboarding), consider **all** channels:

- **Core**: Telegram, Discord, Slack, Signal, iMessage, WhatsApp
- **Extensions**: Matrix, MS Teams, Zalo, IRC, Twitch, Nostr, Feishu, LINE, Google Chat, Mattermost, Nextcloud Talk, BlueBubbles, voice-call, and others in `extensions/`

## Version Locations

Version must be updated in all of these when bumping:

- `package.json` (CLI)
- `apps/android/app/build.gradle.kts` (versionName/versionCode)
- `apps/ios/Sources/Info.plist` + `apps/ios/Tests/Info.plist`
- `apps/macos/Sources/OpenClaw/Resources/Info.plist`
- `docs/install/updating.md` (pinned npm version)

Exception: `appcast.xml` is only touched when cutting a macOS Sparkle release.
