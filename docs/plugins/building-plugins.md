---
summary: "Create your first OpenClaw plugin in minutes"
title: "Building plugins"
sidebarTitle: "Getting Started"
doc-schema-version: 1
read_when:
  - You want to create a new OpenClaw plugin
  - You need a quick-start for plugin development
  - You are choosing between channel, provider, CLI backend, tool, or hook docs
---

Plugins extend OpenClaw without changing core. A plugin can add a messaging
channel, model provider, local CLI backend, agent tool, hook, media provider,
or another plugin-owned capability.

<<<<<<< HEAD
Plugins extend OpenClaw with new capabilities: channels, model providers,
speech, realtime transcription, realtime voice, media understanding, image
generation, video generation, web fetch, web search, agent tools, or any
combination.
=======
You do not need to add an external plugin to the OpenClaw repository. Publish
the package to [ClawHub](/clawhub) and users install it with:
>>>>>>> upstream/main

```bash
openclaw plugins install clawhub:<package-name>
```

Bare package specs still install from npm during the launch cutover. Use the
`clawhub:` prefix when you want ClawHub resolution.

## Requirements

- Use Node 22.19 or newer and a package manager such as `npm` or `pnpm`.
- Be familiar with TypeScript ESM modules.
- For in-repo bundled plugin work, clone the repository and run `pnpm install`.
  Source-checkout plugin development is pnpm-only because OpenClaw loads bundled
  plugins from `extensions/*` workspace packages.

## Choose the plugin shape

<CardGroup cols={2}>
  <Card title="Channel plugin" icon="messages-square" href="/plugins/sdk-channel-plugins">
    Connect OpenClaw to a messaging platform.
  </Card>
  <Card title="Provider plugin" icon="cpu" href="/plugins/sdk-provider-plugins">
    Add a model, media, search, fetch, speech, or realtime provider.
  </Card>
  <Card title="CLI backend plugin" icon="terminal" href="/plugins/cli-backend-plugins">
    Run a local AI CLI through OpenClaw model fallback.
  </Card>
  <Card title="Tool plugin" icon="wrench" href="/plugins/tool-plugins">
    Register agent tools.
  </Card>
</CardGroup>

<<<<<<< HEAD
If a channel plugin is optional and may not be installed when onboarding/setup
runs, use `createOptionalChannelSetupSurface(...)` from
`openclaw/plugin-sdk/channel-setup`. It produces a setup adapter + wizard pair
that advertises the install requirement and fails closed on real config writes
until the plugin is installed.

## Quick start: tool plugin
=======
## Quickstart
>>>>>>> upstream/main

Build a minimal tool plugin by registering one required agent tool. This is the
shortest useful plugin shape and shows the package, manifest, entry point, and
local proof.

<Steps>
  <Step title="Create package metadata">
    <CodeGroup>
<<<<<<< HEAD
    ```json package.json
    {
      "name": "@myorg/openclaw-my-plugin",
      "version": "1.0.0",
      "type": "module",
      "openclaw": {
        "extensions": ["./index.ts"],
        "compat": {
          "pluginApi": ">=2026.3.24-beta.2",
          "minGatewayVersion": "2026.3.24-beta.2"
        },
        "build": {
          "openclawVersion": "2026.3.24-beta.2",
          "pluginSdkVersion": "2026.3.24-beta.2"
        }
      }
    }
    ```
=======
>>>>>>> upstream/main

```json package.json
{
  "name": "@myorg/openclaw-my-plugin",
  "version": "1.0.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"],
    "compat": {
      "pluginApi": ">=2026.3.24-beta.2",
      "minGatewayVersion": "2026.3.24-beta.2"
    },
    "build": {
      "openclawVersion": "2026.3.24-beta.2",
      "pluginSdkVersion": "2026.3.24-beta.2"
    }
  }
}
```

```json openclaw.plugin.json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "description": "Adds a custom tool to OpenClaw",
  "contracts": {
    "tools": ["my_tool"]
  },
  "activation": {
    "onStartup": true
  },
  "configSchema": {
    "type": "object",
    "additionalProperties": false
  }
}
```

    </CodeGroup>

<<<<<<< HEAD
    Every plugin needs a manifest, even with no config. See
    [Manifest](/plugins/manifest) for the full schema. The canonical ClawHub
    publish snippets live in `docs/snippets/plugin-publish/`.
=======
    Published external plugins should point runtime entries at built JavaScript
    files. See [SDK entry points](/plugins/sdk-entrypoints) for the full entry
    point contract.

    Every plugin needs a manifest, even when it has no config. Runtime tools
    must appear in `contracts.tools` so OpenClaw can discover ownership without
    eagerly loading every plugin runtime. Set `activation.onStartup`
    intentionally. This example starts on Gateway startup.

    Host-trusted plugin surfaces are also manifest-gated and require explicit
    enablement for installed plugins. If an installed plugin registers
    `api.registerAgentToolResultMiddleware(...)`, declare each target runtime in
    `contracts.agentToolResultMiddleware`. If it registers
    `api.registerTrustedToolPolicy(...)`, declare each policy id in
    `contracts.trustedToolPolicies`. These declarations keep install-time
    inspection and runtime registration aligned.

    For every manifest field, see [Plugin manifest](/plugins/manifest).
>>>>>>> upstream/main

  </Step>

  <Step title="Register the tool">
    ```typescript index.ts
    import { Type } from "typebox";
    import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

    export default definePluginEntry({
      id: "my-plugin",
      name: "My Plugin",
      description: "Adds a custom tool to OpenClaw",
      register(api) {
        api.registerTool({
          name: "my_tool",
          description: "Echo one input value",
          parameters: Type.Object({ input: Type.String() }),
          async execute(_id, params) {
            return {
              content: [{ type: "text", text: `Got: ${params.input}` }],
            };
          },
        });
      },
    });
    ```

    Use `definePluginEntry` for non-channel plugins. Channel plugins use
    `defineChannelPluginEntry`.

  </Step>

<<<<<<< HEAD
  <Step title="Test and publish">

    **External plugins:** validate and publish with ClawHub, then install:

    ```bash
    clawhub package publish your-org/your-plugin --dry-run
    clawhub package publish your-org/your-plugin
    openclaw plugins install clawhub:@myorg/openclaw-my-plugin
    ```

    OpenClaw also checks ClawHub before npm for bare package specs like
    `@myorg/openclaw-my-plugin`.

    **In-repo plugins:** place under the bundled plugin workspace tree — automatically discovered.

    ```bash
    pnpm test -- <bundled-plugin-root>/my-plugin/
=======
  <Step title="Test the runtime">
    For an installed or external plugin, inspect the loaded runtime:

    ```bash
    openclaw plugins inspect my-plugin --runtime --json
    ```

    If the plugin registers a CLI command, run that command too. For example,
    a demo command should have an execution proof such as
    `openclaw demo-plugin ping`.

    For a bundled plugin in this repository, OpenClaw discovers source-checkout
    plugin packages from the `extensions/*` workspace. Run the closest targeted
    test:

    ```bash
    pnpm test -- extensions/my-plugin/
    pnpm check
    ```

  </Step>

  <Step title="Publish">
    Validate the package before publishing:

    ```bash
    clawhub package publish your-org/your-plugin --dry-run
    clawhub package publish your-org/your-plugin
    ```

    The canonical ClawHub snippets live in `docs/snippets/plugin-publish/`.

  </Step>

  <Step title="Install">
    Install the published package through ClawHub:

    ```bash
    openclaw plugins install clawhub:your-org/your-plugin
>>>>>>> upstream/main
    ```

  </Step>
</Steps>

<a id="registering-agent-tools"></a>

## Registering tools

<<<<<<< HEAD
| Capability             | Registration method                              | Detailed guide                                                                  |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Text inference (LLM)   | `api.registerProvider(...)`                      | [Provider Plugins](/plugins/sdk-provider-plugins)                               |
| Channel / messaging    | `api.registerChannel(...)`                       | [Channel Plugins](/plugins/sdk-channel-plugins)                                 |
| Speech (TTS/STT)       | `api.registerSpeechProvider(...)`                | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Realtime transcription | `api.registerRealtimeTranscriptionProvider(...)` | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Realtime voice         | `api.registerRealtimeVoiceProvider(...)`         | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Media understanding    | `api.registerMediaUnderstandingProvider(...)`    | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Image generation       | `api.registerImageGenerationProvider(...)`       | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Music generation       | `api.registerMusicGenerationProvider(...)`       | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Video generation       | `api.registerVideoGenerationProvider(...)`       | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Web fetch              | `api.registerWebFetchProvider(...)`              | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Web search             | `api.registerWebSearchProvider(...)`             | [Provider Plugins](/plugins/sdk-provider-plugins#step-5-add-extra-capabilities) |
| Agent tools            | `api.registerTool(...)`                          | Below                                                                           |
| Custom commands        | `api.registerCommand(...)`                       | [Entry Points](/plugins/sdk-entrypoints)                                        |
| Event hooks            | `api.registerHook(...)`                          | [Entry Points](/plugins/sdk-entrypoints)                                        |
| HTTP routes            | `api.registerHttpRoute(...)`                     | [Internals](/plugins/architecture#gateway-http-routes)                          |
| CLI subcommands        | `api.registerCli(...)`                           | [Entry Points](/plugins/sdk-entrypoints)                                        |

For the full registration API, see [SDK Overview](/plugins/sdk-overview#registration-api).

If your plugin registers custom gateway RPC methods, keep them on a
plugin-specific prefix. Core admin namespaces (`config.*`,
`exec.approvals.*`, `wizard.*`, `update.*`) stay reserved and always resolve to
`operator.admin`, even if a plugin asks for a narrower scope.

Hook guard semantics to keep in mind:

- `before_tool_call`: `{ block: true }` is terminal and stops lower-priority handlers.
- `before_tool_call`: `{ block: false }` is treated as no decision.
- `before_tool_call`: `{ requireApproval: true }` pauses agent execution and prompts the user for approval via the exec approval overlay, Telegram buttons, Discord interactions, or the `/approve` command on any channel.
- `before_install`: `{ block: true }` is terminal and stops lower-priority handlers.
- `before_install`: `{ block: false }` is treated as no decision.
- `message_sending`: `{ cancel: true }` is terminal and stops lower-priority handlers.
- `message_sending`: `{ cancel: false }` is treated as no decision.

The `/approve` command handles both exec and plugin approvals with bounded fallback: when an exec approval id is not found, OpenClaw retries the same id through plugin approvals. Plugin approval forwarding can be configured independently via `approvals.plugin` in config.

If custom approval plumbing needs to detect that same bounded fallback case,
prefer `isApprovalNotFoundError` from `openclaw/plugin-sdk/error-runtime`
instead of matching approval-expiry strings manually.

See [SDK Overview hook decision semantics](/plugins/sdk-overview#hook-decision-semantics) for details.

## Registering agent tools

Tools are typed functions the LLM can call. They can be required (always
available) or optional (user opt-in):
=======
Tools can be required or optional. Required tools are always available when the
plugin is enabled. Optional tools require user opt-in.
>>>>>>> upstream/main

```typescript
register(api) {
  api.registerTool(
    {
      name: "workflow_tool",
      description: "Run a workflow",
      parameters: Type.Object({ pipeline: Type.String() }),
      async execute(_id, params) {
        return { content: [{ type: "text", text: params.pipeline }] };
      },
    },
    { optional: true },
  );
}
```

Every tool registered with `api.registerTool(...)` must also be declared in the
plugin manifest:

```json
{
  "contracts": {
    "tools": ["workflow_tool"]
  },
  "toolMetadata": {
    "workflow_tool": {
      "optional": true
    }
  }
}
```

Users opt in with `tools.allow`:

```json5
{
  tools: { allow: ["workflow_tool"] }, // or ["my-plugin"] for all tools from one plugin
}
```

Optional tools control whether a tool is exposed to the model. Use
[plugin permission requests](/plugins/plugin-permission-requests) when a tool
or hook should ask for approval after the model selects it and before the
action runs.

Use optional tools for side effects, unusual binaries, or capabilities that
should not be exposed by default. Tool names must not conflict with core tools;
conflicts are skipped and reported in plugin diagnostics. Malformed
registrations, including tool descriptors without `parameters`, are skipped and
reported the same way. Registered tools are typed functions the model can call
after policy and allowlist checks pass.

Tool factories receive a runtime-supplied context object. Use `ctx.activeModel`
when a tool needs to log, display, or adapt to the active model for the current
turn. The object can include `provider`, `modelId`, and `modelRef`. Treat it as
informational runtime metadata, not as a security boundary against the local
operator, installed plugin code, or a modified OpenClaw runtime. Sensitive local
tools should still require an explicit plugin or operator opt-in and fail closed
when active-model metadata is missing or unsuitable.

The manifest declares ownership and discovery; execution still calls the live
registered tool implementation. Keep `toolMetadata.<tool>.optional: true`
aligned with `api.registerTool(..., { optional: true })` so OpenClaw can avoid
loading that plugin runtime until the tool is explicitly allowlisted.

## Import conventions

Import from focused SDK subpaths:

```typescript
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
```

Do not import from the deprecated root barrel:

```typescript
import { definePluginEntry } from "openclaw/plugin-sdk";
```

Within your plugin package, use local barrel files such as `api.ts` and
`runtime-api.ts` for internal imports. Do not import your own plugin through an
SDK path. Provider-specific helpers should stay in the provider package unless
the seam is truly generic.

Custom Gateway RPC methods are an advanced entry point. Keep them on a
plugin-specific prefix; core admin namespaces such as `config.*`,
`exec.approvals.*`, `operator.admin.*`, `wizard.*`, and `update.*` stay reserved
and resolve to `operator.admin`. The
`openclaw/plugin-sdk/gateway-method-runtime` bridge is reserved for plugin HTTP
routes that declare `contracts.gatewayMethodDispatch: ["authenticated-request"]`.

For the full import map, see [Plugin SDK overview](/plugins/sdk-overview).

For provider plugins, keep provider-specific helpers in those package-root
barrels unless the seam is truly generic. Current bundled examples:

- Anthropic: Claude stream wrappers and `service_tier` / beta helpers
- OpenAI: provider builders, default-model helpers, realtime providers
- OpenRouter: provider builder plus onboarding/config helpers

If a helper is only useful inside one bundled provider package, keep it on that
package-root seam instead of promoting it into `openclaw/plugin-sdk/*`.

Some generated `openclaw/plugin-sdk/<bundled-id>` helper seams still exist for
bundled-plugin maintenance and compatibility, for example
`plugin-sdk/feishu-setup` or `plugin-sdk/zalo-setup`. Treat those as reserved
surfaces, not as the default pattern for new third-party plugins.

## Pre-submission checklist

<Check>**package.json** has correct `openclaw` metadata</Check>
<Check>**openclaw.plugin.json** manifest is present and valid</Check>
<Check>Entry point uses `defineChannelPluginEntry` or `definePluginEntry`</Check>
<Check>All imports use focused `plugin-sdk/<subpath>` paths</Check>
<Check>Internal imports use local modules, not SDK self-imports</Check>
<Check>Tests pass (`pnpm test -- <bundled-plugin-root>/my-plugin/`)</Check>
<Check>`pnpm check` passes (in-repo plugins)</Check>

## Test against beta releases

1. Watch for GitHub release tags on [openclaw/openclaw](https://github.com/openclaw/openclaw/releases) and subscribe via `Watch` > `Releases`. Beta tags look like `v2026.3.N-beta.1`. You can also turn on notifications for the official OpenClaw X account [@openclaw](https://x.com/openclaw) for release announcements.
2. Test your plugin against the beta tag as soon as it appears. The window before stable is typically only a few hours.
3. Post in your plugin's thread in the `plugin-forum` Discord channel after testing with either `all good` or what broke. If you do not have a thread yet, create one.
4. If something breaks, open or update an issue titled `Beta blocker: <plugin-name> - <summary>` and apply the `beta-blocker` label. Put the issue link in your thread.
5. Open a PR to `main` titled `fix(<plugin-id>): beta blocker - <summary>` and link the issue in both the PR and your Discord thread. Contributors cannot label PRs, so the title is the PR-side signal for maintainers and automation. Blockers with a PR get merged; blockers without one might ship anyway. Maintainers watch these threads during beta testing.
6. Silence means green. If you miss the window, your fix likely lands in the next cycle.

## Next steps

<CardGroup cols={2}>
  <Card title="Channel Plugins" icon="messages-square" href="/plugins/sdk-channel-plugins">
    Build a messaging channel plugin
  </Card>
  <Card title="Provider Plugins" icon="cpu" href="/plugins/sdk-provider-plugins">
    Build a model provider plugin
  </Card>
  <Card title="CLI Backend Plugins" icon="terminal" href="/plugins/cli-backend-plugins">
    Register a local AI CLI backend
  </Card>
  <Card title="SDK Overview" icon="book-open" href="/plugins/sdk-overview">
    Import map and registration API reference
  </Card>
  <Card title="Runtime Helpers" icon="settings" href="/plugins/sdk-runtime">
    TTS, search, subagent via api.runtime
  </Card>
  <Card title="Testing" icon="test-tubes" href="/plugins/sdk-testing">
    Test utilities and patterns
  </Card>
  <Card title="Plugin Manifest" icon="file-json" href="/plugins/manifest">
    Full manifest schema reference
  </Card>
</CardGroup>

## Related

<<<<<<< HEAD
- [Plugin Architecture](/plugins/architecture) — internal architecture deep dive
- [SDK Overview](/plugins/sdk-overview) — Plugin SDK reference
- [Manifest](/plugins/manifest) — plugin manifest format
- [Channel Plugins](/plugins/sdk-channel-plugins) — building channel plugins
- [Provider Plugins](/plugins/sdk-provider-plugins) — building provider plugins
=======
- [Plugin hooks](/plugins/hooks)
- [Plugin architecture](/plugins/architecture)
>>>>>>> upstream/main
