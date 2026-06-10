---
summary: "Find and publish community-maintained OpenClaw plugins"
read_when:
  - You want to find third-party OpenClaw plugins
  - You want to publish or list your own plugin on ClawHub
title: "Community plugins"
doc-schema-version: 1
---

Community plugins are third-party packages that extend OpenClaw with channels,
tools, providers, hooks, or other capabilities. Use [ClawHub](/clawhub) as the
primary discovery surface for public community plugins.

## Find plugins

Search ClawHub from the CLI:

ClawHub is the canonical discovery surface for community plugins. Do not open
docs-only PRs just to add your plugin here for discoverability; publish it on
ClawHub instead.

```bash
openclaw plugins search "calendar"
```

Install a ClawHub plugin with an explicit source prefix:

```bash
openclaw plugins install clawhub:<package-name>
```

npm remains a supported direct-install path during the launch cutover:

```bash
openclaw plugins install npm:<package-name>
```

Use [Manage plugins](/plugins/manage-plugins) for common install, update,
inspect, and uninstall examples. Use [`openclaw plugins`](/cli/plugins) for the
full command reference and source-selection rules.

## Publish plugins

Publish public community plugins on ClawHub when you want OpenClaw users to
discover and install them. ClawHub owns the live package listing, release
history, scan status, and install hints; the docs do not maintain a static
third-party plugin catalog.

```bash
clawhub package publish your-org/your-plugin --dry-run
clawhub package publish your-org/your-plugin
```

Before publishing, make sure the plugin has package metadata, a plugin manifest,
setup docs, and a clear maintenance owner. ClawHub validates owner scope,
package name, version, file limits, and source metadata before it creates a
release, then keeps new releases hidden from normal install and download
surfaces until review and verification finish.

Use this checklist before you publish:

| Requirement          | Why                                                 |
| -------------------- | --------------------------------------------------- |
| Published on ClawHub | Users need `openclaw plugins install` hints to work |
| Public GitHub repo   | Source review, issue tracking, transparency         |
| Setup and usage docs | Users need to know how to configure it              |
| Active maintenance   | Recent updates or responsive issue handling         |

Use these pages for the full publishing contract:

<<<<<<< HEAD
### QQbot

Connect OpenClaw to QQ via the QQ Bot API. Supports private chats, group
mentions, channel messages, and rich media including voice, images, videos,
and files.

- **npm:** `@tencent-connect/openclaw-qqbot`
- **repo:** [github.com/tencent-connect/openclaw-qqbot](https://github.com/tencent-connect/openclaw-qqbot)

```bash
openclaw plugins install @tencent-connect/openclaw-qqbot
```

### wecom

WeCom channel plugin for OpenClaw by the Tencent WeCom team. Powered by
WeCom Bot WebSocket persistent connections, it supports direct messages & group
chats, streaming replies, proactive messaging, image/file processing, Markdown
formatting, built-in access control, and document/meeting/messaging skills.

- **npm:** `@wecom/wecom-openclaw-plugin`
- **repo:** [github.com/WecomTeam/wecom-openclaw-plugin](https://github.com/WecomTeam/wecom-openclaw-plugin)

```bash
openclaw plugins install @wecom/wecom-openclaw-plugin
```

## Submit your plugin

We welcome community plugins that are useful, documented, and safe to operate.

<Steps>
  <Step title="Publish to ClawHub or npm">
    Your plugin must be installable via `openclaw plugins install \<package-name\>`.
    Publish to [ClawHub](/tools/clawhub) (preferred) or npm.
    See [Building Plugins](/plugins/building-plugins) for the full guide.

  </Step>

  <Step title="Host on GitHub">
    Source code must be in a public repository with setup docs and an issue
    tracker.

  </Step>

  <Step title="Use docs PRs only for source-doc changes">
    You do not need a docs PR just to make your plugin discoverable. Publish it
    on ClawHub instead.

    Open a docs PR only when OpenClaw's source docs need an actual content
    change, such as correcting install guidance or adding cross-repo
    documentation that belongs in the main docs set.

  </Step>
</Steps>

## Quality bar

| Requirement                 | Why                                           |
| --------------------------- | --------------------------------------------- |
| Published on ClawHub or npm | Users need `openclaw plugins install` to work |
| Public GitHub repo          | Source review, issue tracking, transparency   |
| Setup and usage docs        | Users need to know how to configure it        |
| Active maintenance          | Recent updates or responsive issue handling   |

Low-effort wrappers, unclear ownership, or unmaintained packages may be declined.
=======
- [ClawHub publishing](/clawhub/publishing) explains owners, scopes, releases,
  review, package validation, and package transfer.
- [Building plugins](/plugins/building-plugins) shows the plugin package shape
  and first publish workflow.
- [Plugin manifest](/plugins/manifest) defines native plugin manifest fields.
>>>>>>> upstream/main

## Related

- [Plugins](/tools/plugin) - install, configure, restart, and troubleshoot
- [Manage plugins](/plugins/manage-plugins) - command examples
- [ClawHub publishing](/clawhub/publishing) - publish and release rules
