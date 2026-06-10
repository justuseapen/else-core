---
summary: "Matrix support status, setup, and configuration examples"
read_when:
  - Setting up Matrix in OpenClaw
  - Configuring Matrix E2EE and verification
title: "Matrix"
---

<<<<<<< HEAD
# Matrix

Matrix is the Matrix bundled channel plugin for OpenClaw.
It uses the official `matrix-js-sdk` and supports DMs, rooms, threads, media, reactions, polls, location, and E2EE.

## Bundled plugin

Matrix ships as a bundled plugin in current OpenClaw releases, so normal
packaged builds do not need a separate install.

If you are on an older build or a custom install that excludes Matrix, install
it manually:

Install from npm:
=======
Matrix is a downloadable channel plugin for OpenClaw.
It uses the official `matrix-js-sdk` and supports DMs, rooms, threads, media, reactions, polls, location, and E2EE.

## Install

Install Matrix from ClawHub before configuring the channel:
>>>>>>> upstream/main

```bash
openclaw plugins install @openclaw/matrix
```

Bare plugin specs try ClawHub first, then npm fallback. To force the registry source, use `openclaw plugins install clawhub:@openclaw/matrix` or `openclaw plugins install npm:@openclaw/matrix`.

From a local checkout:

```bash
openclaw plugins install ./path/to/local/matrix-plugin
```

`plugins install` registers and enables the plugin, so no separate `openclaw plugins enable matrix` step is needed. The plugin still does nothing until you configure the channel below. See [Plugins](/tools/plugin) for general plugin behavior and install rules.

## Setup

<<<<<<< HEAD
1. Ensure the Matrix plugin is available.
   - Current packaged OpenClaw releases already bundle it.
   - Older/custom installs can add it manually with the commands above.
2. Create a Matrix account on your homeserver.
3. Configure `channels.matrix` with either:
   - `homeserver` + `accessToken`, or
   - `homeserver` + `userId` + `password`.
4. Restart the gateway.
5. Start a DM with the bot or invite it to a room.
=======
1. Create a Matrix account on your homeserver.
2. Configure `channels.matrix` with either `homeserver` + `accessToken`, or `homeserver` + `userId` + `password`.
3. Restart the gateway.
4. Start a DM with the bot, or invite it to a room (see [auto-join](#auto-join) - fresh invites only land when `autoJoin` allows them).
>>>>>>> upstream/main

### Interactive setup

```bash
openclaw channels add
openclaw configure --section channels
```

The wizard asks for: homeserver URL, auth method (access token or password), user ID (password auth only), optional device name, whether to enable E2EE, and whether to configure room access and auto-join.

If matching `MATRIX_*` env vars already exist and the selected account has no saved auth, the wizard offers an env-var shortcut. To resolve room names before saving an allowlist, run `openclaw channels resolve --channel matrix "Project Room"`. When E2EE is enabled, the wizard writes the config and runs the same bootstrap as [`openclaw matrix encryption setup`](#encryption-and-verification).

### Minimal config

Token-based:

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_xxx",
      dm: { policy: "pairing" },
    },
  },
}
```

Password-based (the token is cached after first login):

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      userId: "@bot:example.org",
      password: "replace-me", // pragma: allowlist secret
      deviceName: "OpenClaw Gateway",
    },
  },
}
```

<<<<<<< HEAD
Matrix stores cached credentials in `~/.openclaw/credentials/matrix/`.
The default account uses `credentials.json`; named accounts use `credentials-<account>.json`.
When cached credentials exist there, OpenClaw treats Matrix as configured for setup, doctor, and channel-status discovery even if current auth is not set directly in config.
=======
### Auto-join
>>>>>>> upstream/main

`channels.matrix.autoJoin` defaults to `off`. With the default, the bot will not appear in new rooms or DMs from fresh invites until you join manually.

OpenClaw cannot tell at invite time whether an invited room is a DM or a group, so all invites - including DM-style invites - go through `autoJoin` first. `dm.policy` only applies later, after the bot has joined and the room has been classified.

<Warning>
Set `autoJoin: "allowlist"` plus `autoJoinAllowlist` to restrict which invites the bot accepts, or `autoJoin: "always"` to accept every invite.

`autoJoinAllowlist` only accepts stable targets: `!roomId:server`, `#alias:server`, or `*`. Plain room names are rejected; alias entries are resolved against the homeserver, not against state claimed by the invited room.
</Warning>

```json5
{
  channels: {
    matrix: {
      autoJoin: "allowlist",
      autoJoinAllowlist: ["!ops:example.org", "#support:example.org"],
      groups: {
        "!ops:example.org": { requireMention: true },
      },
    },
  },
}
```

To accept every invite, use `autoJoin: "always"`.

### Allowlist target formats

<<<<<<< HEAD
- `MATRIX_OPS_X2D_BOT_HOMESERVER`
- `MATRIX_OPS_X2D_BOT_ACCESS_TOKEN`

Matrix escapes punctuation in account IDs to keep scoped env vars collision-free.
For example, `-` becomes `_X2D_`, so `ops-prod` maps to `MATRIX_OPS_X2D_PROD_*`.
=======
DM and room allowlists are best populated with stable IDs:
>>>>>>> upstream/main

- DMs (`dm.allowFrom`, `groupAllowFrom`, `groups.<room>.users`): use `@user:server`. Display names are ignored by default because they are mutable; set `dangerouslyAllowNameMatching: true` only when you explicitly need compatibility with display-name entries.
- Room allowlist keys (`groups`, legacy `rooms`): use `!room:server` or `#alias:server`. Plain room names are ignored by default; set `dangerouslyAllowNameMatching: true` only when you explicitly need compatibility with joined-room name lookup.
- Invite allowlists (`autoJoinAllowlist`): use `!room:server`, `#alias:server`, or `*`. Plain room names are rejected.

### Account ID normalization

The wizard converts a friendly name into a normalized account ID. For example, `Ops Bot` becomes `ops-bot`. Punctuation is escaped in scoped env-var names so that two accounts cannot collide: `-` → `_X2D_`, so `ops-prod` maps to `MATRIX_OPS_X2D_PROD_*`.

### Cached credentials

Matrix stores cached credentials under `~/.openclaw/credentials/matrix/`:

- default account: `credentials.json`
- named accounts: `credentials-<account>.json`

When cached credentials exist there, OpenClaw treats Matrix as configured even if the access token is not in the config file - that covers setup, `openclaw doctor`, and channel-status probes.

### Environment variables

Used when the equivalent config key is not set. The default account uses unprefixed names; named accounts use the account ID inserted before the suffix.

| Default account       | Named account (`<ID>` is the normalized account ID) |
| --------------------- | --------------------------------------------------- |
| `MATRIX_HOMESERVER`   | `MATRIX_<ID>_HOMESERVER`                            |
| `MATRIX_ACCESS_TOKEN` | `MATRIX_<ID>_ACCESS_TOKEN`                          |
| `MATRIX_USER_ID`      | `MATRIX_<ID>_USER_ID`                               |
| `MATRIX_PASSWORD`     | `MATRIX_<ID>_PASSWORD`                              |
| `MATRIX_DEVICE_ID`    | `MATRIX_<ID>_DEVICE_ID`                             |
| `MATRIX_DEVICE_NAME`  | `MATRIX_<ID>_DEVICE_NAME`                           |
| `MATRIX_RECOVERY_KEY` | `MATRIX_<ID>_RECOVERY_KEY`                          |

For account `ops`, the names become `MATRIX_OPS_HOMESERVER`, `MATRIX_OPS_ACCESS_TOKEN`, and so on. The recovery-key env vars are read by recovery-aware CLI flows (`verify backup restore`, `verify device`, `verify bootstrap`) when you pipe the key in via `--recovery-key-stdin`.

`MATRIX_HOMESERVER` cannot be set from a workspace `.env`; see [Workspace `.env` files](/gateway/security).

## Configuration example

A practical baseline with DM pairing, room allowlist, and E2EE:

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_xxx",
      encryption: true,

      dm: {
        policy: "pairing",
        sessionScope: "per-room",
        threadReplies: "off",
      },

      groupPolicy: "allowlist",
      groupAllowFrom: ["@admin:example.org"],
      groups: {
        "!roomid:example.org": { requireMention: true },
      },

      autoJoin: "allowlist",
      autoJoinAllowlist: ["!roomid:example.org"],
      threadReplies: "inbound",
      replyToMode: "off",
      streaming: "partial",
    },
  },
}
```

<<<<<<< HEAD
`autoJoin` applies to Matrix invites in general, not only room/group invites.
That includes fresh DM-style invites. At invite time, OpenClaw does not reliably know whether the
invited room will end up being treated as a DM or a group, so all invites go through the same
`autoJoin` decision first. `dm.policy` still applies after the bot has joined and the room is
classified as a DM, so `autoJoin` controls join behavior while `dm.policy` controls reply/access
behavior.

## Streaming previews

Matrix reply streaming is opt-in.

Set `channels.matrix.streaming` to `"partial"` when you want OpenClaw to send a single live preview
reply, edit that preview in place while the model is generating text, and then finalize it when the
reply is done:
=======
## Streaming previews

Matrix reply streaming is opt-in. `streaming` controls how OpenClaw delivers the in-flight assistant reply; `blockStreaming` controls whether each completed block is preserved as its own Matrix message.
>>>>>>> upstream/main

```json5
{
  channels: {
    matrix: {
      streaming: "partial",
    },
  },
}
```

<<<<<<< HEAD
- `streaming: "off"` is the default. OpenClaw waits for the final reply and sends it once.
- `streaming: "partial"` creates one editable preview message for the current assistant block using normal Matrix text messages. This preserves Matrix's legacy preview-first notification behavior, so stock clients may notify on the first streamed preview text instead of the finished block.
- `streaming: "quiet"` creates one editable quiet preview notice for the current assistant block. Use this only when you also configure recipient push rules for finalized preview edits.
- `blockStreaming: true` enables separate Matrix progress messages. With preview streaming enabled, Matrix keeps the live draft for the current block and preserves completed blocks as separate messages.
- When preview streaming is on and `blockStreaming` is off, Matrix edits the live draft in place and finalizes that same event when the block or turn finishes.
- If the preview no longer fits in one Matrix event, OpenClaw stops preview streaming and falls back to normal final delivery.
- Media replies still send attachments normally. If a stale preview can no longer be reused safely, OpenClaw redacts it before sending the final media reply.
- Preview edits cost extra Matrix API calls. Leave streaming off if you want the most conservative rate-limit behavior.

`blockStreaming` does not enable draft previews by itself.
Use `streaming: "partial"` or `streaming: "quiet"` for preview edits; then add `blockStreaming: true` only if you also want completed assistant blocks to remain visible as separate progress messages.

If you need stock Matrix notifications without custom push rules, use `streaming: "partial"` for preview-first behavior or leave `streaming` off for final-only delivery. With `streaming: "off"`:

- `blockStreaming: true` sends each finished block as a normal notifying Matrix message.
- `blockStreaming: false` sends only the final completed reply as a normal notifying Matrix message.

### Self-hosted push rules for quiet finalized previews

If you run your own Matrix infrastructure and want quiet previews to notify only when a block or
final reply is done, set `streaming: "quiet"` and add a per-user push rule for finalized preview edits.

This is usually a recipient-user setup, not a homeserver-global config change:

Quick map before you start:

- recipient user = the person who should receive the notification
- bot user = the OpenClaw Matrix account that sends the reply
- use the recipient user's access token for the API calls below
- match `sender` in the push rule against the bot user's full MXID

1. Configure OpenClaw to use quiet previews:
=======
To keep live answer previews but hide interim tool/progress lines, use object
form:
>>>>>>> upstream/main

```json5
{
  channels: {
    matrix: {
<<<<<<< HEAD
      streaming: "quiet",
=======
      streaming: {
        mode: "partial",
        preview: {
          toolProgress: false,
        },
      },
>>>>>>> upstream/main
    },
  },
}
```

<<<<<<< HEAD
2. Make sure the recipient account already receives normal Matrix push notifications. Quiet preview
   rules only work if that user already has working pushers/devices.

3. Get the recipient user's access token.
   - Use the receiving user's token, not the bot's token.
   - Reusing an existing client session token is usually easiest.
   - If you need to mint a fresh token, you can log in through the standard Matrix Client-Server API:

```bash
curl -sS -X POST \
  "https://matrix.example.org/_matrix/client/v3/login" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "m.login.password",
    "identifier": {
      "type": "m.id.user",
      "user": "@alice:example.org"
    },
    "password": "REDACTED"
  }'
```

4. Verify the recipient account already has pushers:

```bash
curl -sS \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN" \
  "https://matrix.example.org/_matrix/client/v3/pushers"
```

If this returns no active pushers/devices, fix normal Matrix notifications first before adding the
OpenClaw rule below.

OpenClaw marks finalized text-only preview edits with:

```json
{
  "com.openclaw.finalized_preview": true
}
```

5. Create an override push rule for each recipient account which should receive these notifications:

```bash
curl -sS -X PUT \
  "https://matrix.example.org/_matrix/client/v3/pushrules/global/override/openclaw-finalized-preview-botname" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "conditions": [
      { "kind": "event_match", "key": "type", "pattern": "m.room.message" },
      {
        "kind": "event_property_is",
        "key": "content.m\\.relates_to.rel_type",
        "value": "m.replace"
      },
      {
        "kind": "event_property_is",
        "key": "content.com\\.openclaw\\.finalized_preview",
        "value": true
      },
      { "kind": "event_match", "key": "sender", "pattern": "@bot:example.org" }
    ],
    "actions": [
      "notify",
      { "set_tweak": "sound", "value": "default" },
      { "set_tweak": "highlight", "value": false }
    ]
  }'
```

Replace these values before you run the command:

- `https://matrix.example.org`: your homeserver base URL
- `$USER_ACCESS_TOKEN`: the receiving user's access token
- `openclaw-finalized-preview-botname`: a rule ID unique to this bot for this receiving user
- `@bot:example.org`: your OpenClaw Matrix bot MXID, not the receiving user's MXID

Important for multi-bot setups:

- Push rules are keyed by `ruleId`. Re-running `PUT` against the same rule ID updates that one rule.
- If one receiving user should notify for multiple OpenClaw Matrix bot accounts, create one rule per bot with a unique rule ID for each sender match.
- A simple pattern is `openclaw-finalized-preview-<botname>`, such as `openclaw-finalized-preview-ops` or `openclaw-finalized-preview-support`.

The rule is evaluated against the event sender:

- authenticate with the receiving user's token
- match `sender` against the OpenClaw bot MXID

6. Verify the rule exists:

```bash
curl -sS \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN" \
  "https://matrix.example.org/_matrix/client/v3/pushrules/global/override/openclaw-finalized-preview-botname"
```

7. Test a streamed reply. In quiet mode, the room should show a quiet draft preview and the final
   in-place edit should notify once the block or turn finishes.

If you need to remove the rule later, delete that same rule ID with the receiving user's token:

```bash
curl -sS -X DELETE \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN" \
  "https://matrix.example.org/_matrix/client/v3/pushrules/global/override/openclaw-finalized-preview-botname"
```

Notes:

- Create the rule with the receiving user's access token, not the bot's.
- New user-defined `override` rules are inserted ahead of default suppress rules, so no extra ordering parameter is needed.
- This only affects text-only preview edits that OpenClaw can safely finalize in place. Media fallbacks and stale-preview fallbacks still use normal Matrix delivery.
- If `GET /_matrix/client/v3/pushers` shows no pushers, the user does not yet have working Matrix push delivery for this account/device.

#### Synapse

For Synapse, the setup above is usually enough by itself:

- No special `homeserver.yaml` change is required for finalized OpenClaw preview notifications.
- If your Synapse deployment already sends normal Matrix push notifications, the user token + `pushrules` call above is the main setup step.
- If you run Synapse behind a reverse proxy or workers, make sure `/_matrix/client/.../pushrules/` reaches Synapse correctly.
- If you run Synapse workers, make sure pushers are healthy. Push delivery is handled by the main process or `synapse.app.pusher` / configured pusher workers.

#### Tuwunel

For Tuwunel, use the same setup flow and push-rule API call shown above:

- No Tuwunel-specific config is required for the finalized preview marker itself.
- If normal Matrix notifications already work for that user, the user token + `pushrules` call above is the main setup step.
- If notifications seem to disappear while the user is active on another device, check whether `suppress_push_when_active` is enabled. Tuwunel added this option in Tuwunel 1.4.2 on September 12, 2025, and it can intentionally suppress pushes to other devices while one device is active.

## Encryption and verification

In encrypted (E2EE) rooms, outbound image events use `thumbnail_file` so image previews are encrypted alongside the full attachment. Unencrypted rooms still use plain `thumbnail_url`. No configuration is needed — the plugin detects E2EE state automatically.

### Bot to bot rooms
=======
| `streaming`       | Behavior                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"off"` (default) | Wait for the full reply, send once. `true` ↔ `"partial"`, `false` ↔ `"off"`.                                                                                        |
| `"partial"`       | Edit one normal text message in place as the model writes the current block. Stock Matrix clients may notify on the first preview, not the final edit.              |
| `"quiet"`         | Same as `"partial"` but the message is a non-notifying notice. Recipients only get a notification once a per-user push rule matches the finalized edit (see below). |

`blockStreaming` is independent of `streaming`:

| `streaming`             | `blockStreaming: true`                                              | `blockStreaming: false` (default)                    |
| ----------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| `"partial"` / `"quiet"` | Live draft for the current block, completed blocks kept as messages | Live draft for the current block, finalized in place |
| `"off"`                 | One notifying Matrix message per finished block                     | One notifying Matrix message for the full reply      |

Notes:

- If a preview grows past Matrix's per-event size limit, OpenClaw stops preview streaming and falls back to final-only delivery.
- Media replies always send attachments normally. If a stale preview can no longer be reused safely, OpenClaw redacts it before sending the final media reply.
- Tool-progress preview updates are enabled by default when Matrix preview streaming is active. Set `streaming.preview.toolProgress: false` to keep preview edits for answer text but leave tool progress on the normal delivery path.
- Preview edits cost extra Matrix API calls. Leave `streaming: "off"` if you want the most conservative rate-limit profile.

## Voice messages

Inbound Matrix voice notes are transcribed before the room mention gate. This lets a voice note that says the bot name trigger the agent in a `requireMention: true` room, and it gives the agent the transcript instead of only an audio attachment placeholder.

Matrix uses the shared audio media provider configured under `tools.media.audio`, such as OpenAI `gpt-4o-mini-transcribe`. See [Media tools overview](/tools/media-overview) for provider setup and limits.

Behavior details:

- `m.audio` events and `m.file` events with an `audio/*` MIME type are eligible.
- In encrypted rooms, OpenClaw decrypts the attachment through the existing Matrix media path before transcription.
- The transcript is marked as machine-generated and untrusted in the agent prompt.
- The attachment is marked as already transcribed so downstream media tools do not transcribe the same voice note again.
- Set `tools.media.audio.enabled: false` to disable audio transcription globally.

## Approval metadata

Matrix native approval prompts are normal `m.room.message` events with OpenClaw-specific custom event content under `com.openclaw.approval`. Matrix permits custom event-content keys, so stock clients still render the text body while OpenClaw-aware clients can read the structured approval id, kind, state, available decisions, and exec/plugin details.

When an approval prompt is too long for one Matrix event, OpenClaw chunks the visible text and attaches `com.openclaw.approval` to the first chunk only. Reactions for allow/deny decisions are bound to that first event, so long prompts keep the same approval target as single-event prompts.

### Self-hosted push rules for quiet finalized previews

`streaming: "quiet"` only notifies recipients once a block or turn is finalized - a per-user push rule has to match the finalized preview marker. See [Matrix push rules for quiet previews](/channels/matrix-push-rules) for the full recipe (recipient token, pusher check, rule install, per-homeserver notes).

## Bot-to-bot rooms
>>>>>>> upstream/main

By default, Matrix messages from other configured OpenClaw Matrix accounts are ignored.

Use `allowBots` when you intentionally want inter-agent Matrix traffic:

```json5
{
  channels: {
    matrix: {
      allowBots: "mentions", // true | "mentions"
      groups: {
        "!roomid:example.org": {
          requireMention: true,
        },
      },
    },
  },
}
```

- `allowBots: true` accepts messages from other configured Matrix bot accounts in allowed rooms and DMs.
- `allowBots: "mentions"` accepts those messages only when they visibly mention this bot in rooms. DMs are still allowed.
- `groups.<room>.allowBots` overrides the account-level setting for one room.
- Accepted configured-bot messages use shared [bot loop protection](/channels/bot-loop-protection). Configure `channels.defaults.botLoopProtection`, then override with `channels.matrix.botLoopProtection` or `channels.matrix.groups.<room>.botLoopProtection` when one room needs a different budget.
- OpenClaw still ignores messages from the same Matrix user ID to avoid self-reply loops.
- Matrix does not expose a native bot flag here; OpenClaw treats "bot-authored" as "sent by another configured Matrix account on this OpenClaw gateway".

Use strict room allowlists and mention requirements when enabling bot-to-bot traffic in shared rooms.

## Encryption and verification

In encrypted (E2EE) rooms, outbound image events use `thumbnail_file` so image previews are encrypted alongside the full attachment. Unencrypted rooms still use plain `thumbnail_url`. No configuration is needed - the plugin detects E2EE state automatically.

All `openclaw matrix` commands accept `--verbose` (full diagnostics), `--json` (machine-readable output), and `--account <id>` (multi-account setups). Output is concise by default with quiet internal SDK logging. The examples below show the canonical form; add the flags as needed.

### Enable encryption

```bash
openclaw matrix encryption setup
```

Bootstraps secret storage and cross-signing, creates a room-key backup if needed, then prints status and next steps. Useful flags:

- `--recovery-key <key>` apply a recovery key before bootstrapping (prefer the stdin form documented below)
- `--force-reset-cross-signing` discard the current cross-signing identity and create a new one (use only intentionally)

For a new account, enable E2EE at creation time:

```bash
openclaw matrix account add \
  --homeserver https://matrix.example.org \
  --access-token syt_xxx \
  --enable-e2ee
```

`--encryption` is an alias for `--enable-e2ee`.

Manual config equivalent:

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_xxx",
      encryption: true,
      dm: { policy: "pairing" },
    },
  },
}
```

### Status and trust signals

```bash
openclaw matrix verify status
openclaw matrix verify status --include-recovery-key --json
```

`verify status` reports three independent trust signals (`--verbose` shows all of them):

- `Locally trusted`: trusted by this client only
- `Cross-signing verified`: the SDK reports verification via cross-signing
- `Signed by owner`: signed by your own self-signing key (diagnostic only)

`Verified by owner` becomes `yes` only when `Cross-signing verified` is `yes`. Local trust or an owner signature alone is not enough.

`--allow-degraded-local-state` returns best-effort diagnostics without preparing the Matrix account first; useful for offline or partially-configured probes.

### Verify this device with a recovery key

The recovery key is sensitive - pipe it via stdin instead of passing it on the command line. Set `MATRIX_RECOVERY_KEY` (or `MATRIX_<ID>_RECOVERY_KEY` for a named account):

```bash
printf '%s\n' "$MATRIX_RECOVERY_KEY" | openclaw matrix verify device --recovery-key-stdin
```

The command reports three states:

- `Recovery key accepted`: Matrix accepted the key for secret storage or device trust.
- `Backup usable`: room-key backup can be loaded with the trusted recovery material.
- `Device verified by owner`: this device has full Matrix cross-signing identity trust.

It exits non-zero when full identity trust is incomplete, even if the recovery key unlocked backup material. In that case, finish self-verification from another Matrix client:

```bash
openclaw matrix verify self
```

`verify self` waits for `Cross-signing verified: yes` before it exits successfully. Use `--timeout-ms <ms>` to tune the wait.

The literal-key form `openclaw matrix verify device "<recovery-key>"` is also accepted, but the key ends up in your shell history.

### Bootstrap or repair cross-signing

```bash
openclaw matrix verify bootstrap
```

`verify bootstrap` is the repair and setup command for encrypted accounts. In order, it:

- bootstraps secret storage, reusing an existing recovery key when possible
- bootstraps cross-signing and uploads missing public keys
- marks and cross-signs the current device
- creates a server-side room-key backup if one does not already exist

If the homeserver requires UIA to upload cross-signing keys, OpenClaw tries no-auth first, then `m.login.dummy`, then `m.login.password` (requires `channels.matrix.password`).

Useful flags:

- `--recovery-key-stdin` (pair with `printf '%s\n' "$MATRIX_RECOVERY_KEY" | …`) or `--recovery-key <key>`
- `--force-reset-cross-signing` to discard the current cross-signing identity (intentional only)

### Room-key backup

```bash
openclaw matrix verify backup status
printf '%s\n' "$MATRIX_RECOVERY_KEY" | openclaw matrix verify backup restore --recovery-key-stdin
```

`backup status` shows whether a server-side backup exists and whether this device can decrypt it. `backup restore` imports backed-up room keys into the local crypto store; if the recovery key is already on disk you can omit `--recovery-key-stdin`.

<<<<<<< HEAD
```bash
openclaw matrix verify backup status --verbose
```

Restore room keys from server backup:

```bash
openclaw matrix verify backup restore
```

Verbose restore diagnostics:

```bash
openclaw matrix verify backup restore --verbose
```

Delete the current server backup and create a fresh backup baseline. If the stored
backup key cannot be loaded cleanly, this reset can also recreate secret storage so
future cold starts can load the new backup key:
=======
To replace a broken backup with a fresh baseline (accepts losing unrecoverable old history; can also recreate secret storage if the current backup secret is unloadable):
>>>>>>> upstream/main

```bash
openclaw matrix verify backup reset --yes
```

Add `--rotate-recovery-key` only when you intentionally want the previous recovery key to stop unlocking the fresh backup baseline.

### Listing, requesting, and responding to verifications

```bash
openclaw matrix verify list
```

<<<<<<< HEAD
When encryption is disabled or unavailable for a named account, Matrix warnings and verification errors point at that account's config key, for example `channels.matrix.accounts.assistant.encryption`.

### What "verified" means

OpenClaw treats this Matrix device as verified only when it is verified by your own cross-signing identity.
In practice, `openclaw matrix verify status --verbose` exposes three trust signals:

- `Locally trusted`: this device is trusted by the current client only
- `Cross-signing verified`: the SDK reports the device as verified through cross-signing
- `Signed by owner`: the device is signed by your own self-signing key

`Verified by owner` becomes `yes` only when cross-signing verification or owner-signing is present.
Local trust by itself is not enough for OpenClaw to treat the device as fully verified.

### What bootstrap does

`openclaw matrix verify bootstrap` is the repair and setup command for encrypted Matrix accounts.
It does all of the following in order:

- bootstraps secret storage, reusing an existing recovery key when possible
- bootstraps cross-signing and uploads missing public cross-signing keys
- attempts to mark and cross-sign the current device
- creates a new server-side room-key backup if one does not already exist

If the homeserver requires interactive auth to upload cross-signing keys, OpenClaw tries the upload without auth first, then with `m.login.dummy`, then with `m.login.password` when `channels.matrix.password` is configured.

Use `--force-reset-cross-signing` only when you intentionally want to discard the current cross-signing identity and create a new one.

If you intentionally want to discard the current room-key backup and start a new
backup baseline for future messages, use `openclaw matrix verify backup reset --yes`.
Do this only when you accept that unrecoverable old encrypted history will stay
unavailable and that OpenClaw may recreate secret storage if the current backup
secret cannot be loaded safely.

### Fresh backup baseline

If you want to keep future encrypted messages working and accept losing unrecoverable old history, run these commands in order:
=======
Lists pending verification requests for the selected account.
>>>>>>> upstream/main

```bash
openclaw matrix verify request --own-user
openclaw matrix verify request --user-id @ops:example.org --device-id ABCDEF
```

Sends a verification request from this OpenClaw account. `--own-user` requests self-verification (you accept the prompt in another Matrix client of the same user); `--user-id`/`--device-id`/`--room-id` target someone else. `--own-user` cannot be combined with the other targeting flags.

For lower-level lifecycle handling - typically while shadowing inbound requests from another client - these commands act on a specific request `<id>` (printed by `verify list` and `verify request`):

| Command                                    | Purpose                                                             |
| ------------------------------------------ | ------------------------------------------------------------------- |
| `openclaw matrix verify accept <id>`       | Accept an inbound request                                           |
| `openclaw matrix verify start <id>`        | Start the SAS flow                                                  |
| `openclaw matrix verify sas <id>`          | Print the SAS emoji or decimals                                     |
| `openclaw matrix verify confirm-sas <id>`  | Confirm that the SAS matches what the other client shows            |
| `openclaw matrix verify mismatch-sas <id>` | Reject the SAS when the emoji or decimals do not match              |
| `openclaw matrix verify cancel <id>`       | Cancel; takes optional `--reason <text>` and `--code <matrix-code>` |

`accept`, `start`, `sas`, `confirm-sas`, `mismatch-sas`, and `cancel` all accept `--user-id` and `--room-id` as DM follow-up hints when the verification is anchored to a specific direct-message room.

### Multi-account notes

Without `--account <id>`, Matrix CLI commands use the implicit default account. If you have multiple named accounts and have not set `channels.matrix.defaultAccount`, they will refuse to guess and ask you to choose. When E2EE is disabled or unavailable for a named account, errors point at that account's config key, for example `channels.matrix.accounts.assistant.encryption`.

<AccordionGroup>
  <Accordion title="Startup behavior">
    With `encryption: true`, `startupVerification` defaults to `"if-unverified"`. On startup an unverified device requests self-verification in another Matrix client, skipping duplicates and applying a cooldown (24 hours by default). Tune with `startupVerificationCooldownHours` or disable with `startupVerification: "off"`.

    Startup also runs a conservative crypto bootstrap pass that reuses the current secret storage and cross-signing identity. If bootstrap state is broken, OpenClaw attempts a guarded repair even without `channels.matrix.password`; if the homeserver requires password UIA, startup logs a warning and stays non-fatal. Already-owner-signed devices are preserved.

    See [Matrix migration](/channels/matrix-migration) for the full upgrade flow.

  </Accordion>

  <Accordion title="Verification notices">
    Matrix posts verification lifecycle notices into the strict DM verification room as `m.notice` messages: request, ready (with "Verify by emoji" guidance), start/completion, and SAS (emoji/decimal) details when available.

<<<<<<< HEAD
- using `fake-indexeddb` as the IndexedDB API shim expected by the SDK
- restoring the Rust crypto IndexedDB contents from `crypto-idb-snapshot.json` before `initRustCrypto`
- persisting the updated IndexedDB contents back to `crypto-idb-snapshot.json` after init and during runtime
- serializing snapshot restore and persist against `crypto-idb-snapshot.json` with an advisory file lock so gateway runtime persistence and CLI maintenance do not race on the same snapshot file
=======
    Incoming requests from another Matrix client are tracked and auto-accepted. For self-verification, OpenClaw starts the SAS flow automatically and confirms its own side once emoji verification is available - you still need to compare and confirm "They match" in your Matrix client.
>>>>>>> upstream/main

    Verification system notices are not forwarded to the agent chat pipeline.

  </Accordion>

  <Accordion title="Deleted or invalid Matrix device">
    If `verify status` says the current device is no longer listed on the homeserver, create a new OpenClaw Matrix device. For password login:

<<<<<<< HEAD
## Profile management

Update the Matrix self-profile for the selected account with:

```bash
openclaw matrix profile set --name "OpenClaw Assistant"
openclaw matrix profile set --avatar-url https://cdn.example.org/avatar.png
```

Add `--account <id>` when you want to target a named Matrix account explicitly.

Matrix accepts `mxc://` avatar URLs directly. When you pass an `http://` or `https://` avatar URL, OpenClaw uploads it to Matrix first and stores the resolved `mxc://` URL back into `channels.matrix.avatarUrl` (or the selected account override).

## Automatic verification notices
=======
```bash
openclaw matrix account add \
  --account assistant \
  --homeserver https://matrix.example.org \
  --user-id '@assistant:example.org' \
  --password '<password>' \
  --device-name OpenClaw-Gateway
```
>>>>>>> upstream/main

    For token auth, create a fresh access token in your Matrix client or admin UI, then update OpenClaw:

```bash
openclaw matrix account add \
  --account assistant \
  --homeserver https://matrix.example.org \
  --access-token '<token>'
```

    Replace `assistant` with the account ID from the failed command, or omit `--account` for the default account.

  </Accordion>

  <Accordion title="Device hygiene">
    Old OpenClaw-managed devices can accumulate. List and prune:

```bash
openclaw matrix devices list
openclaw matrix devices prune-stale
```

  </Accordion>

  <Accordion title="Crypto store">
    Matrix E2EE uses the official `matrix-js-sdk` Rust crypto path with `fake-indexeddb` as the IndexedDB shim. Crypto state persists to `crypto-idb-snapshot.json` (restrictive file permissions).

    Encrypted runtime state lives under `~/.openclaw/matrix/accounts/<account>/<homeserver>__<user>/<token-hash>/` and includes the sync store, crypto store, recovery key, IDB snapshot, thread bindings, and startup verification state. When the token changes but the account identity stays the same, OpenClaw reuses the best existing root so prior state remains visible.

  </Accordion>
</AccordionGroup>

## Profile management

Update the Matrix self-profile for the selected account:

```bash
openclaw matrix profile set --name "OpenClaw Assistant"
openclaw matrix profile set --avatar-url https://cdn.example.org/avatar.png
```

You can pass both options in one call. Matrix accepts `mxc://` avatar URLs directly; when you pass `http://` or `https://`, OpenClaw uploads the file first and stores the resolved `mxc://` URL into `channels.matrix.avatarUrl` (or the per-account override).

## Threads

Matrix supports native Matrix threads for both automatic replies and message-tool sends. Two independent knobs control behavior:

### Session routing (`sessionScope`)

`dm.sessionScope` decides how Matrix DM rooms map to OpenClaw sessions:

- `"per-user"` (default): all DM rooms with the same routed peer share one session.
- `"per-room"`: each Matrix DM room gets its own session key, even when the peer is the same.

Explicit conversation bindings always win over `sessionScope`, so bound rooms and threads keep their chosen target session.

### Reply threading (`threadReplies`)

`threadReplies` decides where the bot posts its reply:

- `"off"`: replies are top-level. Inbound threaded messages stay on the parent session.
- `"inbound"`: reply inside a thread only when the inbound message was already in that thread.
- `"always"`: reply inside a thread rooted at the triggering message; that conversation is routed through a matching thread-scoped session from the first trigger onward.

`dm.threadReplies` overrides this for DMs only - for example, keep room threads isolated while keeping DMs flat.

### Thread inheritance and slash commands

<<<<<<< HEAD
- `dm.sessionScope: "per-user"` (default) keeps Matrix DM routing sender-scoped, so multiple DM rooms can share one session when they resolve to the same peer.
- `dm.sessionScope: "per-room"` isolates each Matrix DM room into its own session key while still using normal DM auth and allowlist checks.
- Explicit Matrix conversation bindings still win over `dm.sessionScope`, so bound rooms and threads keep their chosen target session.
- `threadReplies: "off"` keeps replies top-level and keeps inbound threaded messages on the parent session.
- `threadReplies: "inbound"` replies inside a thread only when the inbound message was already in that thread.
- `threadReplies: "always"` keeps room replies in a thread rooted at the triggering message and routes that conversation through the matching thread-scoped session from the first triggering message.
- `dm.threadReplies` overrides the top-level setting for DMs only. For example, you can keep room threads isolated while keeping DMs flat.
- Inbound threaded messages include the thread root message as extra agent context.
- Message-tool sends now auto-inherit the current Matrix thread when the target is the same room, or the same DM user target, unless an explicit `threadId` is provided.
- Same-session DM user-target reuse only kicks in when the current session metadata proves the same DM peer on the same Matrix account; otherwise OpenClaw falls back to normal user-scoped routing.
- When OpenClaw sees a Matrix DM room collide with another DM room on the same shared Matrix DM session, it posts a one-time `m.notice` in that room with the `/focus` escape hatch when thread bindings are enabled and the `dm.sessionScope` hint.
- Runtime thread bindings are supported for Matrix. `/focus`, `/unfocus`, `/agents`, `/session idle`, `/session max-age`, and thread-bound `/acp spawn` now work in Matrix rooms and DMs.
- Top-level Matrix room/DM `/focus` creates a new Matrix thread and binds it to the target session when `threadBindings.spawnSubagentSessions=true`.
- Running `/focus` or `/acp spawn --thread here` inside an existing Matrix thread binds that current thread instead.

=======
- Inbound threaded messages include the thread root message as extra agent context.
- Message-tool sends auto-inherit the current Matrix thread when targeting the same room (or the same DM user target), unless an explicit `threadId` is provided.
- DM user-target reuse only kicks in when the current session metadata proves the same DM peer on the same Matrix account; otherwise OpenClaw falls back to normal user-scoped routing.
- `/focus`, `/unfocus`, `/agents`, `/session idle`, `/session max-age`, and thread-bound `/acp spawn` all work in Matrix rooms and DMs.
- Top-level `/focus` creates a new Matrix thread and binds it to the target session when `threadBindings.spawnSessions` is enabled.
- Running `/focus` or `/acp spawn --thread here` inside an existing Matrix thread binds that thread in place.

When OpenClaw detects a Matrix DM room colliding with another DM room on the same shared session, it posts a one-time `m.notice` in that room pointing to the `/focus` escape hatch and suggesting a `dm.sessionScope` change. The notice only appears when thread bindings are enabled.

>>>>>>> upstream/main
## ACP conversation bindings

Matrix rooms, DMs, and existing Matrix threads can be turned into durable ACP workspaces without changing the chat surface.

Fast operator flow:

- Run `/acp spawn codex --bind here` inside the Matrix DM, room, or existing thread you want to keep using.
- In a top-level Matrix DM or room, the current DM/room stays the chat surface and future messages route to the spawned ACP session.
- Inside an existing Matrix thread, `--bind here` binds that current thread in place.
- `/new` and `/reset` reset the same bound ACP session in place.
- `/acp close` closes the ACP session and removes the binding.

Notes:

- `--bind here` does not create a child Matrix thread.
<<<<<<< HEAD
- `threadBindings.spawnAcpSessions` is only required for `/acp spawn --thread auto|here`, where OpenClaw needs to create or bind a child Matrix thread.

### Thread Binding Config
=======
- `threadBindings.spawnSessions` gates `/acp spawn --thread auto|here`, where OpenClaw needs to create or bind a child Matrix thread.

### Thread binding config
>>>>>>> upstream/main

Matrix inherits global defaults from `session.threadBindings`, and also supports per-channel overrides:

- `threadBindings.enabled`
- `threadBindings.idleHours`
- `threadBindings.maxAgeHours`
- `threadBindings.spawnSessions`
- `threadBindings.defaultSpawnContext`

Matrix thread-bound session spawns default on:

- Set `threadBindings.spawnSessions: false` to block top-level `/focus` and `/acp spawn --thread auto|here` from creating/binding Matrix threads.
- Set `threadBindings.defaultSpawnContext: "isolated"` when native subagent thread spawns should not fork the parent transcript.

## Reactions

Matrix supports outbound reactions, inbound reaction notifications, and ack reactions.

Outbound reaction tooling is gated by `channels.matrix.actions.reactions`:

- `react` adds a reaction to a Matrix event.
- `reactions` lists the current reaction summary for a Matrix event.
- `emoji=""` removes the bot's own reactions on that event.
- `remove: true` removes only the specified emoji reaction from the bot.

**Resolution order** (first defined value wins):

| Setting                 | Order                                                                            |
| ----------------------- | -------------------------------------------------------------------------------- |
| `ackReaction`           | per-account → channel → `messages.ackReaction` → agent identity emoji fallback   |
| `ackReactionScope`      | per-account → channel → `messages.ackReactionScope` → default `"group-mentions"` |
| `reactionNotifications` | per-account → channel → default `"own"`                                          |

`reactionNotifications: "own"` forwards added `m.reaction` events when they target bot-authored Matrix messages; `"off"` disables reaction system events. Reaction removals are not synthesized into system events because Matrix surfaces those as redactions, not as standalone `m.reaction` removals.

## History context

- `channels.matrix.historyLimit` controls how many recent room messages are included as `InboundHistory` when a Matrix room message triggers the agent. Falls back to `messages.groupChat.historyLimit`; if both are unset, the effective default is `0`. Set `0` to disable.
- Matrix room history is room-only. DMs keep using normal session history.
- Matrix room history is pending-only: OpenClaw buffers room messages that did not trigger a reply yet, then snapshots that window when a mention or other trigger arrives.
- The current trigger message is not included in `InboundHistory`; it stays in the main inbound body for that turn.
- Retries of the same Matrix event reuse the original history snapshot instead of drifting forward to newer room messages.

## Context visibility

Matrix supports the shared `contextVisibility` control for supplemental room context such as fetched reply text, thread roots, and pending history.

<<<<<<< HEAD
## History context

- `channels.matrix.historyLimit` controls how many recent room messages are included as `InboundHistory` when a Matrix room message triggers the agent.
- It falls back to `messages.groupChat.historyLimit`. If both are unset, the effective default is `0`, so mention-gated room messages are not buffered. Set `0` to disable.
- Matrix room history is room-only. DMs keep using normal session history.
- Matrix room history is pending-only: OpenClaw buffers room messages that did not trigger a reply yet, then snapshots that window when a mention or other trigger arrives.
- The current trigger message is not included in `InboundHistory`; it stays in the main inbound body for that turn.
- Retries of the same Matrix event reuse the original history snapshot instead of drifting forward to newer room messages.

## Context visibility

Matrix supports the shared `contextVisibility` control for supplemental room context such as fetched reply text, thread roots, and pending history.

=======
>>>>>>> upstream/main
- `contextVisibility: "all"` is the default. Supplemental context is kept as received.
- `contextVisibility: "allowlist"` filters supplemental context to senders allowed by the active room/user allowlist checks.
- `contextVisibility: "allowlist_quote"` behaves like `allowlist`, but still keeps one explicit quoted reply.

This setting affects supplemental context visibility, not whether the inbound message itself can trigger a reply.
Trigger authorization still comes from `groupPolicy`, `groups`, `groupAllowFrom`, and DM policy settings.

<<<<<<< HEAD
## DM and room policy example
=======
## DM and room policy
>>>>>>> upstream/main

```json5
{
  channels: {
    matrix: {
      dm: {
        policy: "allowlist",
        allowFrom: ["@admin:example.org"],
        threadReplies: "off",
      },
      groupPolicy: "allowlist",
      groupAllowFrom: ["@admin:example.org"],
      groups: {
        "!roomid:example.org": { requireMention: true },
      },
    },
  },
}
```

To silence DMs entirely while keeping rooms working, set `dm.enabled: false`:

```json5
{
  channels: {
    matrix: {
      dm: { enabled: false },
      groupPolicy: "allowlist",
      groupAllowFrom: ["@admin:example.org"],
    },
  },
}
```

See [Groups](/channels/groups) for mention-gating and allowlist behavior.

Pairing example for Matrix DMs:

```bash
openclaw pairing list matrix
openclaw pairing approve matrix <CODE>
```

If an unapproved Matrix user keeps messaging you before approval, OpenClaw reuses the same pending pairing code and may send a reminder reply after a short cooldown instead of minting a new code.

See [Pairing](/channels/pairing) for the shared DM pairing flow and storage layout.

<<<<<<< HEAD
## Exec approvals

Matrix can act as an exec approval client for a Matrix account.

- `channels.matrix.execApprovals.enabled`
- `channels.matrix.execApprovals.approvers` (optional; falls back to `channels.matrix.dm.allowFrom`)
- `channels.matrix.execApprovals.target` (`dm` | `channel` | `both`, default: `dm`)
- `channels.matrix.execApprovals.agentFilter`
- `channels.matrix.execApprovals.sessionFilter`

Approvers must be Matrix user IDs such as `@owner:example.org`. Matrix auto-enables native exec approvals when `enabled` is unset or `"auto"` and at least one approver can be resolved, either from `execApprovals.approvers` or from `channels.matrix.dm.allowFrom`. Set `enabled: false` to disable Matrix as a native approval client explicitly. Approval requests otherwise fall back to other configured approval routes or the exec approval fallback policy.

Native Matrix routing is exec-only today:

- `channels.matrix.execApprovals.*` controls native DM/channel routing for exec approvals only.
- Plugin approvals still use shared same-chat `/approve` plus any configured `approvals.plugin` forwarding.
- Matrix can still reuse `channels.matrix.dm.allowFrom` for plugin-approval authorization when it can infer approvers safely, but it does not expose a separate native plugin-approval DM/channel fanout path.

Delivery rules:

- `target: "dm"` sends approval prompts to approver DMs
- `target: "channel"` sends the prompt back to the originating Matrix room or DM
- `target: "both"` sends to approver DMs and the originating Matrix room or DM

Matrix approval prompts seed reaction shortcuts on the primary approval message:

- `✅` = allow once
- `❌` = deny
- `♾️` = allow always when that decision is allowed by the effective exec policy

Approvers can react on that message or use the fallback slash commands: `/approve <id> allow-once`, `/approve <id> allow-always`, or `/approve <id> deny`.

Only resolved approvers can approve or deny. Channel delivery includes the command text, so only enable `channel` or `both` in trusted rooms.

Matrix approval prompts reuse the shared core approval planner. The Matrix-specific native surface is transport only for exec approvals: room/DM routing and message send/update/delete behavior.

Per-account override:

- `channels.matrix.accounts.<account>.execApprovals`

Related docs: [Exec approvals](/tools/exec-approvals)

## Multi-account example
=======
## Direct room repair

If direct-message state drifts out of sync, OpenClaw can end up with stale `m.direct` mappings that point at old solo rooms instead of the live DM. Inspect the current mapping for a peer:

```bash
openclaw matrix direct inspect --user-id @alice:example.org
```

Repair it:

```bash
openclaw matrix direct repair --user-id @alice:example.org
```

Both commands accept `--account <id>` for multi-account setups. The repair flow:

- prefers a strict 1:1 DM that is already mapped in `m.direct`
- falls back to any currently joined strict 1:1 DM with that user
- creates a fresh direct room and rewrites `m.direct` if no healthy DM exists

It does not delete old rooms automatically. It picks the healthy DM and updates the mapping so future Matrix sends, verification notices, and other direct-message flows target the right room.

## Exec approvals

Matrix can act as a native approval client. Configure under `channels.matrix.execApprovals` (or `channels.matrix.accounts.<account>.execApprovals` for a per-account override):

- `enabled`: deliver approvals through Matrix-native prompts. When unset or `"auto"`, Matrix auto-enables once at least one approver can be resolved. Set `false` to disable explicitly.
- `approvers`: Matrix user IDs (`@owner:example.org`) allowed to approve exec requests. Optional - falls back to `channels.matrix.dm.allowFrom`.
- `target`: where prompts go. `"dm"` (default) sends to approver DMs; `"channel"` sends to the originating Matrix room or DM; `"both"` sends to both.
- `agentFilter` / `sessionFilter`: optional allowlists for which agents/sessions trigger Matrix delivery.

Authorization differs slightly between approval kinds:

- **Exec approvals** use `execApprovals.approvers`, falling back to `dm.allowFrom`.
- **Plugin approvals** authorize through `dm.allowFrom` only.

Both kinds share Matrix reaction shortcuts and message updates. Approvers see reaction shortcuts on the primary approval message:

- `✅` allow once
- `❌` deny
- `♾️` allow always (when the effective exec policy allows it)

Fallback slash commands: `/approve <id> allow-once`, `/approve <id> allow-always`, `/approve <id> deny`.

Only resolved approvers can approve or deny. Channel delivery for exec approvals includes the command text - only enable `channel` or `both` in trusted rooms.

Related: [Exec approvals](/tools/exec-approvals).

## Slash commands

Slash commands (`/new`, `/reset`, `/model`, `/focus`, `/unfocus`, `/agents`, `/session`, `/acp`, `/approve`, etc.) work directly in DMs. In rooms, OpenClaw also recognizes commands that are prefixed with the bot's own Matrix mention, so `@bot:server /new` triggers the command path without a custom mention regex. This keeps the bot responsive to the room-style `@mention /command` posts that Element and similar clients emit when a user tab-completes the bot before typing the command.

Authorization rules still apply: command senders must satisfy the same DM or room allowlist/owner policies as plain messages.

## Multi-account
>>>>>>> upstream/main

```json5
{
  channels: {
    matrix: {
      enabled: true,
      defaultAccount: "assistant",
      dm: { policy: "pairing" },
      accounts: {
        assistant: {
          homeserver: "https://matrix.example.org",
          accessToken: "syt_assistant_xxx",
          encryption: true,
        },
        alerts: {
          homeserver: "https://matrix.example.org",
          accessToken: "syt_alerts_xxx",
          dm: {
            policy: "allowlist",
            allowFrom: ["@ops:example.org"],
            threadReplies: "off",
          },
        },
      },
    },
  },
}
```

<<<<<<< HEAD
Top-level `channels.matrix` values act as defaults for named accounts unless an account overrides them.
You can scope inherited room entries to one Matrix account with `groups.<room>.account` (or legacy `rooms.<room>.account`).
Entries without `account` stay shared across all Matrix accounts, and entries with `account: "default"` still work when the default account is configured directly on top-level `channels.matrix.*`.
Partial shared auth defaults do not create a separate implicit default account by themselves. OpenClaw only synthesizes the top-level `default` account when that default has fresh auth (`homeserver` plus `accessToken`, or `homeserver` plus `userId` and `password`); named accounts can still stay discoverable from `homeserver` plus `userId` when cached credentials satisfy auth later.
If Matrix already has exactly one named account, or `defaultAccount` points at an existing named account key, single-account-to-multi-account repair/setup promotion preserves that account instead of creating a fresh `accounts.default` entry. Only Matrix auth/bootstrap keys move into that promoted account; shared delivery-policy keys stay at the top level.
Set `defaultAccount` when you want OpenClaw to prefer one named Matrix account for implicit routing, probing, and CLI operations.
If you configure multiple named accounts, set `defaultAccount` or pass `--account <id>` for CLI commands that rely on implicit account selection.
Pass `--account <id>` to `openclaw matrix verify ...` and `openclaw matrix devices ...` when you want to override that implicit selection for one command.
=======
**Inheritance:**

- Top-level `channels.matrix` values act as defaults for named accounts unless an account overrides them.
- Scope an inherited room entry to a specific account with `groups.<room>.account`. Entries without `account` are shared across accounts; `account: "default"` still works when the default account is configured at the top level.

**Default account selection:**

- Set `defaultAccount` to pick the named account that implicit routing, probing, and CLI commands prefer.
- If you have multiple accounts and one is literally named `default`, OpenClaw uses it implicitly even when `defaultAccount` is unset.
- If you have multiple named accounts and no default is selected, CLI commands refuse to guess - set `defaultAccount` or pass `--account <id>`.
- The top-level `channels.matrix.*` block is only treated as the implicit `default` account when its auth is complete (`homeserver` + `accessToken`, or `homeserver` + `userId` + `password`). Named accounts remain discoverable from `homeserver` + `userId` once cached credentials cover auth.

**Promotion:**

- When OpenClaw promotes a single-account config to multi-account during repair or setup, it preserves the existing named account if one exists or `defaultAccount` already points at one. Only Matrix auth/bootstrap keys move into the promoted account; shared delivery-policy keys stay at the top level.

See [Configuration reference](/gateway/config-channels#multi-account-all-channels) for the shared multi-account pattern.
>>>>>>> upstream/main

## Private/LAN homeservers

By default, OpenClaw blocks private/internal Matrix homeservers for SSRF protection unless you
explicitly opt in per account.

If your homeserver runs on localhost, a LAN/Tailscale IP, or an internal hostname, enable
`network.dangerouslyAllowPrivateNetwork` for that Matrix account:

```json5
{
  channels: {
    matrix: {
      homeserver: "http://matrix-synapse:8008",
      network: {
        dangerouslyAllowPrivateNetwork: true,
      },
      accessToken: "syt_internal_xxx",
    },
  },
}
```

CLI setup example:

```bash
openclaw matrix account add \
  --account ops \
  --homeserver http://matrix-synapse:8008 \
  --allow-private-network \
  --access-token syt_ops_xxx
```

This opt-in only allows trusted private/internal targets. Public cleartext homeservers such as
`http://matrix.example.org:8008` remain blocked. Prefer `https://` whenever possible.

## Proxying Matrix traffic

If your Matrix deployment needs an explicit outbound HTTP(S) proxy, set `channels.matrix.proxy`:

```json5
{
  channels: {
    matrix: {
      homeserver: "https://matrix.example.org",
      accessToken: "syt_bot_xxx",
      proxy: "http://127.0.0.1:7890",
    },
  },
}
```

Named accounts can override the top-level default with `channels.matrix.accounts.<id>.proxy`.
OpenClaw uses the same proxy setting for runtime Matrix traffic and account status probes.

## Target resolution

Matrix accepts these target forms anywhere OpenClaw asks you for a room or user target:

- Users: `@user:server`, `user:@user:server`, or `matrix:user:@user:server`
- Rooms: `!room:server`, `room:!room:server`, or `matrix:room:!room:server`
- Aliases: `#alias:server`, `channel:#alias:server`, or `matrix:channel:#alias:server`

Matrix room IDs are case-sensitive. Use the exact room ID casing from Matrix
when configuring explicit delivery targets, cron jobs, bindings, or allowlists.
OpenClaw keeps internal session keys canonical for storage, so those lowercase
keys are not a reliable source for Matrix delivery IDs.

Live directory lookup uses the logged-in Matrix account:

- User lookups query the Matrix user directory on that homeserver.
- Room lookups accept explicit room IDs and aliases directly. Joined-room name lookup is best-effort and only applies to runtime room allowlists when `dangerouslyAllowNameMatching: true` is set.
- If a room name cannot be resolved to an ID or alias, it is ignored by runtime allowlist resolution.

## Configuration reference

Allowlist-style user fields (`groupAllowFrom`, `dm.allowFrom`, `groups.<room>.users`) accept full Matrix user IDs (safest). Non-ID user entries are ignored by default. If you set `dangerouslyAllowNameMatching: true`, exact Matrix directory display-name matches are resolved at startup and whenever the allowlist changes while the monitor is running; entries that cannot be resolved are ignored at runtime.

Room allowlist keys (`groups`, legacy `rooms`) should be room IDs or aliases. Plain room-name keys are ignored by default; `dangerouslyAllowNameMatching: true` restores best-effort lookup against joined room names.

### Account and connection

- `enabled`: enable or disable the channel.
- `name`: optional display label for the account.
- `defaultAccount`: preferred account ID when multiple Matrix accounts are configured.
- `accounts`: named per-account overrides. Top-level `channels.matrix` values are inherited as defaults.
- `homeserver`: homeserver URL, for example `https://matrix.example.org`.
<<<<<<< HEAD
- `allowPrivateNetwork`: allow this Matrix account to connect to private/internal homeservers. Enable this when the homeserver resolves to `localhost`, a LAN/Tailscale IP, or an internal host such as `matrix-synapse`.
- `proxy`: optional HTTP(S) proxy URL for Matrix traffic. Named accounts can override the top-level default with their own `proxy`.
- `userId`: full Matrix user ID, for example `@bot:example.org`.
- `accessToken`: access token for token-based auth. Plaintext values and SecretRef values are supported for `channels.matrix.accessToken` and `channels.matrix.accounts.<id>.accessToken` across env/file/exec providers. See [Secrets Management](/gateway/secrets).
- `password`: password for password-based login. Plaintext values and SecretRef values are supported.
- `deviceId`: explicit Matrix device ID.
- `deviceName`: device display name for password login.
- `avatarUrl`: stored self-avatar URL for profile sync and `set-profile` updates.
- `initialSyncLimit`: startup sync event limit.
- `encryption`: enable E2EE.
- `allowlistOnly`: force allowlist-only behavior for DMs and rooms.
- `allowBots`: allow messages from other configured OpenClaw Matrix accounts (`true` or `"mentions"`).
- `groupPolicy`: `open`, `allowlist`, or `disabled`.
- `contextVisibility`: supplemental room-context visibility mode (`all`, `allowlist`, `allowlist_quote`).
- `groupAllowFrom`: allowlist of user IDs for room traffic.
- `groupAllowFrom` entries should be full Matrix user IDs. Unresolved names are ignored at runtime.
- `historyLimit`: max room messages to include as group history context. Falls back to `messages.groupChat.historyLimit`; if both are unset, the effective default is `0`. Set `0` to disable.
- `replyToMode`: `off`, `first`, or `all`.
- `markdown`: optional Markdown rendering configuration for outbound Matrix text.
- `streaming`: `off` (default), `partial`, `quiet`, `true`, or `false`. `partial` and `true` enable preview-first draft updates with normal Matrix text messages. `quiet` uses non-notifying preview notices for self-hosted push-rule setups.
- `blockStreaming`: `true` enables separate progress messages for completed assistant blocks while draft preview streaming is active.
- `threadReplies`: `off`, `inbound`, or `always`.
- `threadBindings`: per-channel overrides for thread-bound session routing and lifecycle.
- `startupVerification`: automatic self-verification request mode on startup (`if-unverified`, `off`).
- `startupVerificationCooldownHours`: cooldown before retrying automatic startup verification requests.
- `textChunkLimit`: outbound message chunk size.
- `chunkMode`: `length` or `newline`.
- `responsePrefix`: optional message prefix for outbound replies.
- `ackReaction`: optional ack reaction override for this channel/account.
- `ackReactionScope`: optional ack reaction scope override (`group-mentions`, `group-all`, `direct`, `all`, `none`, `off`).
- `reactionNotifications`: inbound reaction notification mode (`own`, `off`).
- `mediaMaxMb`: media size cap in MB for Matrix media handling. It applies to outbound sends and inbound media processing.
- `autoJoin`: invite auto-join policy (`always`, `allowlist`, `off`). Default: `off`. This applies to Matrix invites in general, including DM-style invites, not only room/group invites. OpenClaw makes this decision at invite time, before it can reliably classify the joined room as a DM or a group.
- `autoJoinAllowlist`: rooms/aliases allowed when `autoJoin` is `allowlist`. Alias entries are resolved to room IDs during invite handling; OpenClaw does not trust alias state claimed by the invited room.
- `dm`: DM policy block (`enabled`, `policy`, `allowFrom`, `sessionScope`, `threadReplies`).
- `dm.policy`: controls DM access after OpenClaw has joined the room and classified it as a DM. It does not change whether an invite is auto-joined.
- `dm.allowFrom` entries should be full Matrix user IDs unless you already resolved them through live directory lookup.
- `dm.sessionScope`: `per-user` (default) or `per-room`. Use `per-room` when you want each Matrix DM room to keep separate context even if the peer is the same.
- `dm.threadReplies`: DM-only thread policy override (`off`, `inbound`, `always`). It overrides the top-level `threadReplies` setting for both reply placement and session isolation in DMs.
- `execApprovals`: Matrix-native exec approval delivery (`enabled`, `approvers`, `target`, `agentFilter`, `sessionFilter`).
- `execApprovals.approvers`: Matrix user IDs allowed to approve exec requests. Optional when `dm.allowFrom` already identifies the approvers.
- `execApprovals.target`: `dm | channel | both` (default: `dm`).
- `accounts`: named per-account overrides. Top-level `channels.matrix` values act as defaults for these entries.
- `groups`: per-room policy map. Prefer room IDs or aliases; unresolved room names are ignored at runtime. Session/group identity uses the stable room ID after resolution, while human-readable labels still come from room names.
- `groups.<room>.account`: restrict one inherited room entry to a specific Matrix account in multi-account setups.
- `groups.<room>.allowBots`: room-level override for configured-bot senders (`true` or `"mentions"`).
- `groups.<room>.users`: per-room sender allowlist.
- `groups.<room>.tools`: per-room tool allow/deny overrides.
- `groups.<room>.autoReply`: room-level mention-gating override. `true` disables mention requirements for that room; `false` forces them back on.
- `groups.<room>.skills`: optional room-level skill filter.
- `groups.<room>.systemPrompt`: optional room-level system prompt snippet.
- `rooms`: legacy alias for `groups`.
- `actions`: per-action tool gating (`messages`, `reactions`, `pins`, `profile`, `memberInfo`, `channelInfo`, `verification`).

## Related

- [Channels Overview](/channels) — all supported channels
- [Pairing](/channels/pairing) — DM authentication and pairing flow
- [Groups](/channels/groups) — group chat behavior and mention gating
- [Channel Routing](/channels/channel-routing) — session routing for messages
- [Security](/gateway/security) — access model and hardening
=======
- `network.dangerouslyAllowPrivateNetwork`: allow this account to connect to `localhost`, LAN/Tailscale IPs, or internal hostnames.
- `proxy`: optional HTTP(S) proxy URL for Matrix traffic. Per-account override supported.
- `userId`: full Matrix user ID (`@bot:example.org`).
- `accessToken`: access token for token-based auth. Plaintext and SecretRef values supported across env/file/exec providers ([Secrets Management](/gateway/secrets)).
- `password`: password for password-based login. Plaintext and SecretRef values supported.
- `deviceId`: explicit Matrix device ID.
- `deviceName`: device display name used at password-login time.
- `avatarUrl`: stored self-avatar URL for profile sync and `profile set` updates.
- `initialSyncLimit`: maximum number of events fetched during startup sync.

### Encryption

- `encryption`: enable E2EE. Default: `false`.
- `startupVerification`: `"if-unverified"` (default when E2EE is on) or `"off"`. Auto-requests self-verification on startup when this device is unverified.
- `startupVerificationCooldownHours`: cooldown before the next automatic startup request. Default: `24`.

### Access and policy

- `groupPolicy`: `"open"`, `"allowlist"`, or `"disabled"`. Default: `"allowlist"`.
- `groupAllowFrom`: allowlist of user IDs for room traffic.
- `dm.enabled`: when `false`, ignore all DMs. Default: `true`.
- `dm.policy`: `"pairing"` (default), `"allowlist"`, `"open"`, or `"disabled"`. Applies after the bot has joined and classified the room as a DM; it does not affect invite handling.
- `dm.allowFrom`: allowlist of user IDs for DM traffic.
- `dm.sessionScope`: `"per-user"` (default) or `"per-room"`.
- `dm.threadReplies`: DM-only override for reply threading (`"off"`, `"inbound"`, `"always"`).
- `allowBots`: accept messages from other configured Matrix bot accounts (`true` or `"mentions"`).
- `allowlistOnly`: when `true`, forces all active DM policies (except `"disabled"`) and `"open"` group policies to `"allowlist"`. Does not change `"disabled"` policies.
- `dangerouslyAllowNameMatching`: when `true`, allows Matrix display-name directory lookup for user allowlist entries and joined-room name lookup for room allowlist keys. Prefer full `@user:server` IDs and room IDs or aliases.
- `autoJoin`: `"always"`, `"allowlist"`, or `"off"`. Default: `"off"`. Applies to every Matrix invite, including DM-style invites.
- `autoJoinAllowlist`: rooms/aliases allowed when `autoJoin` is `"allowlist"`. Alias entries are resolved against the homeserver, not against state claimed by the invited room.
- `contextVisibility`: supplemental context visibility (`"all"` default, `"allowlist"`, `"allowlist_quote"`).

### Reply behavior

- `replyToMode`: `"off"`, `"first"`, `"all"`, or `"batched"`.
- `threadReplies`: `"off"`, `"inbound"`, or `"always"`.
- `threadBindings`: per-channel overrides for thread-bound session routing and lifecycle.
- `streaming`: `"off"` (default), `"partial"`, `"quiet"`, or object form `{ mode, preview: { toolProgress } }`. `true` ↔ `"partial"`, `false` ↔ `"off"`.
- `blockStreaming`: when `true`, completed assistant blocks are kept as separate progress messages.
- `markdown`: optional Markdown rendering config for outbound text.
- `responsePrefix`: optional string prepended to outbound replies.
- `textChunkLimit`: outbound chunk size in characters when `chunkMode: "length"`. Default: `4000`.
- `chunkMode`: `"length"` (default, splits by character count) or `"newline"` (splits at line boundaries).
- `historyLimit`: number of recent room messages included as `InboundHistory` when a room message triggers the agent. Falls back to `messages.groupChat.historyLimit`; effective default `0` (disabled).
- `mediaMaxMb`: media size cap in MB for outbound sends and inbound processing.

### Reaction settings

- `ackReaction`: ack reaction override for this channel/account.
- `ackReactionScope`: scope override (`"group-mentions"` default, `"group-all"`, `"direct"`, `"all"`, `"none"`, `"off"`).
- `reactionNotifications`: inbound reaction notification mode (`"own"` default, `"off"`).

### Tooling and per-room overrides

- `actions`: per-action tool gating (`messages`, `reactions`, `pins`, `profile`, `memberInfo`, `channelInfo`, `verification`).
- `groups`: per-room policy map. Session identity uses the stable room ID after resolution. (`rooms` is a legacy alias.)
  - `groups.<room>.account`: restrict one inherited room entry to a specific account.
  - `groups.<room>.allowBots`: per-room override of the channel-level setting (`true` or `"mentions"`).
  - `groups.<room>.users`: per-room sender allowlist.
  - `groups.<room>.tools`: per-room tool allow/deny overrides.
  - `groups.<room>.autoReply`: per-room mention-gating override. `true` disables mention requirements for that room; `false` forces them back on.
  - `groups.<room>.skills`: per-room skill filter.
  - `groups.<room>.systemPrompt`: per-room system prompt snippet.

### Exec approval settings

- `execApprovals.enabled`: deliver exec approvals through Matrix-native prompts.
- `execApprovals.approvers`: Matrix user IDs allowed to approve. Falls back to `dm.allowFrom`.
- `execApprovals.target`: `"dm"` (default), `"channel"`, or `"both"`.
- `execApprovals.agentFilter` / `execApprovals.sessionFilter`: optional agent/session allowlists for delivery.

## Related

- [Channels Overview](/channels) - all supported channels
- [Pairing](/channels/pairing) - DM authentication and pairing flow
- [Groups](/channels/groups) - group chat behavior and mention gating
- [Channel Routing](/channels/channel-routing) - session routing for messages
- [Security](/gateway/security) - access model and hardening
>>>>>>> upstream/main
