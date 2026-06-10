---
<<<<<<< HEAD
title: "QA Channel"
summary: "Synthetic Slack-class channel plugin for deterministic OpenClaw QA scenarios"
=======
summary: "Synthetic Slack-class channel plugin for deterministic OpenClaw QA scenarios"
title: "QA channel"
>>>>>>> upstream/main
read_when:
  - You are wiring the synthetic QA transport into a local or CI test run
  - You need the bundled qa-channel config surface
  - You are iterating on end-to-end QA automation
---

<<<<<<< HEAD
# QA Channel

`qa-channel` is a bundled synthetic message transport for automated OpenClaw QA.

It is not a production channel. It exists to exercise the same channel plugin
boundary used by real transports while keeping state deterministic and fully
inspectable.

## What it does today
=======
`qa-channel` is a bundled synthetic message transport for automated OpenClaw QA. It is not a production channel - it exists to exercise the same channel plugin boundary used by real transports while keeping state deterministic and fully inspectable.

## What it does
>>>>>>> upstream/main

- Slack-class target grammar:
  - `dm:<user>`
  - `channel:<room>`
<<<<<<< HEAD
  - `thread:<room>/<thread>`
- HTTP-backed synthetic bus for:
  - inbound message injection
  - outbound transcript capture
  - thread creation
  - reactions
  - edits
  - deletes
  - search and read actions
- Bundled host-side self-check runner that writes a Markdown report
=======
  - `group:<room>`
  - `thread:<room>/<thread>`
- Shared `channel:` and `group:` conversations are surfaced to agents as group/channel room turns, so they exercise the same visible-reply and message-tool routing policy used by Discord, Slack, Telegram, and similar transports.
- HTTP-backed synthetic bus for inbound message injection, outbound transcript capture, thread creation, reactions, edits, deletes, and search/read actions.
- Host-side self-check runner that writes a Markdown report to `.artifacts/qa-e2e/`.
>>>>>>> upstream/main

## Config

```json
{
  "channels": {
    "qa-channel": {
      "baseUrl": "http://127.0.0.1:43123",
      "botUserId": "openclaw",
      "botDisplayName": "OpenClaw QA",
      "allowFrom": ["*"],
      "pollTimeoutMs": 1000
    }
  }
}
```

<<<<<<< HEAD
Supported account keys:

- `baseUrl`
- `botUserId`
- `botDisplayName`
- `pollTimeoutMs`
- `allowFrom`
- `defaultTo`
- `actions.messages`
- `actions.reactions`
- `actions.search`
- `actions.threads`

## Runner

Current vertical slice:
=======
Account keys:

- `enabled` - master toggle for this account.
- `name` - optional display label.
- `baseUrl` - synthetic bus URL.
- `botUserId` - Matrix-style bot user id used in target grammar.
- `botDisplayName` - display name for outbound messages.
- `pollTimeoutMs` - long-poll wait window. Integer between 100 and 30000.
- `allowFrom` - sender allowlist (user ids or `"*"`). Direct messages and
  allowlisted group policy both use these synthetic sender ids.
- `groupPolicy` - shared-room policy: `"open"` (default), `"allowlist"`, or
  `"disabled"`.
- `groupAllowFrom` - optional shared-room sender allowlist. When omitted under
  `"allowlist"`, QA Channel falls back to `allowFrom`.
- `groups.<room>.requireMention` - require a bot mention before replying in a
  specific group/channel room. `groups."*"` sets the default.
- `defaultTo` - fallback target when none is supplied.
- `actions.messages` / `actions.reactions` / `actions.search` / `actions.threads` - per-action tool gating.

Multi-account keys at the top level:

- `accounts` - record of named per-account overrides keyed by account id.
- `defaultAccount` - preferred account id when multiple are configured.

## Runners

Host-side self-check (writes a Markdown report under `.artifacts/qa-e2e/`):
>>>>>>> upstream/main

```bash
pnpm qa:e2e
```

<<<<<<< HEAD
This now routes through the bundled `qa-lab` extension. It starts the in-repo
QA bus, boots the bundled `qa-channel` runtime slice, runs a deterministic
self-check, and writes a Markdown report under `.artifacts/qa-e2e/`.

Private debugger UI:

```bash
pnpm qa:lab:build
pnpm openclaw qa ui
```

Full repo-backed QA suite:
=======
This routes through `qa-lab`, starts the in-repo QA bus, boots the bundled `qa-channel` runtime slice, and runs a deterministic self-check.

Full repo-backed scenario suite:
>>>>>>> upstream/main

```bash
pnpm openclaw qa suite
```

<<<<<<< HEAD
That launches the private QA debugger at a local URL, separate from the
shipped Control UI bundle.

## Scope

Current scope is intentionally narrow:

- bus + plugin transport
- threaded routing grammar
- channel-owned message actions
- Markdown reporting

Follow-up work will add:

- Dockerized OpenClaw orchestration
- provider/model matrix execution
- richer scenario discovery
- OpenClaw-native orchestration later
=======
Runs scenarios in parallel against the QA gateway lane. See [QA overview](/concepts/qa-e2e-automation) for scenarios, profiles, and provider modes.

Docker-backed QA site (gateway + QA Lab debugger UI in one stack):

```bash
pnpm qa:lab:up
```

Builds the QA site, starts the Docker-backed gateway + QA Lab stack, and prints the QA Lab URL. From there you can pick scenarios, choose the model lane, launch individual runs, and watch results live. The QA Lab debugger is separate from the shipped Control UI bundle.

## Related

- [QA overview](/concepts/qa-e2e-automation) - overall stack, transport adapters, scenario authoring
- [Matrix QA](/concepts/qa-matrix) - example live-transport runner that drives a real channel
- [Pairing](/channels/pairing)
- [Groups](/channels/groups)
- [Channels overview](/channels)
>>>>>>> upstream/main
