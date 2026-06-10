---
name: canvas
description: "Present HTML on connected OpenClaw node canvases, navigate/eval/snapshot, and debug canvas host URLs."
metadata: { "openclaw": { "emoji": "🖼️" } }
---

# Canvas

Use canvas to show HTML on connected Mac/iOS/Android nodes.

## Model

- Canvas host serves files from `plugins.entries.canvas.config.host.root`.
- Canvas routes live on the Gateway HTTP port (`gateway.port`, default `18789`).
- Node bridge sends canvas URLs to connected node apps.
- Node apps render URLs in a WebView.
- Host name follows `gateway.bind`: loopback local only, LAN IP for LAN, Tailscale host for tailnet, auto picks best route.
- Localhost URLs only work for a node on the same machine.
- Paired nodes normally receive node-scoped `pluginSurfaceUrls.canvas` capability URLs; prefer those when available.

## Config

<<<<<<< HEAD
### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Canvas Host    │────▶│   Node Bridge    │────▶│  Node App   │
│  (HTTP Server)  │     │  (TCP Server)    │     │ (Mac/iOS/   │
│  Port 18793     │     │  Port 18790      │     │  Android)   │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

1. **Canvas Host Server**: Serves static HTML/CSS/JS files from `canvasHost.root` directory
2. **Node Bridge**: Communicates canvas URLs to connected nodes
3. **Node Apps**: Render the content in a WebView

### Tailscale Integration

The canvas host server binds based on `gateway.bind` setting:

| Bind Mode  | Server Binds To     | Canvas URL Uses            |
| ---------- | ------------------- | -------------------------- |
| `loopback` | 127.0.0.1           | localhost (local only)     |
| `lan`      | LAN interface       | LAN IP address             |
| `tailnet`  | Tailscale interface | Tailscale hostname         |
| `auto`     | Best available      | Tailscale > LAN > loopback |

**Key insight:** The `canvasHostHostForBridge` is derived from `bridgeHost`. When bound to Tailscale, nodes receive URLs like:

```
http://<tailscale-hostname>:18793/__openclaw__/canvas/<file>.html
```

This is why localhost URLs don't work - the node receives the Tailscale hostname from the bridge!

## Actions

| Action     | Description                          |
| ---------- | ------------------------------------ |
| `present`  | Show canvas with optional target URL |
| `hide`     | Hide the canvas                      |
| `navigate` | Navigate to a new URL                |
| `eval`     | Execute JavaScript in the canvas     |
| `snapshot` | Capture screenshot of canvas         |

## Configuration

In the active OpenClaw config file (`$OPENCLAW_CONFIG_PATH`, default `~/.openclaw/openclaw.json`):
=======
Active config: `$OPENCLAW_CONFIG_PATH` or `~/.openclaw/openclaw.json`.
>>>>>>> upstream/main

```json
{
  "plugins": {
    "entries": {
      "canvas": {
        "config": {
          "host": {
            "enabled": true,
            "root": "~/.openclaw/canvas",
            "liveReload": true
          }
        }
      }
    }
  },
  "gateway": { "bind": "auto" }
}
```

## Actions

- `present`: show canvas, optional URL.
- `hide`: hide canvas.
- `navigate`: open new URL.
- `eval`: run JavaScript in current canvas.
- `snapshot`: capture screenshot.

## Workflow

1. Ensure Canvas plugin host is enabled.
2. Put HTML/CSS/JS under `plugins.entries.canvas.config.host.root` or the default state canvas dir.
3. Use a route reachable by the target node.
4. Present the hosted URL: `/__openclaw__/canvas/<file>.html`.
5. Use `snapshot` when the user needs proof.

## URL shape

```text
http://<gateway-host>:<gateway.port>/__openclaw__/canvas/index.html
http://<gateway-host>:<gateway.port>/__openclaw__/canvas/games/snake.html
```

Path mapping:

- `/__openclaw__/canvas/index.html` -> `<canvas host root>/index.html`
- `/__openclaw__/canvas/games/snake.html` -> `<canvas host root>/games/snake.html`

<<<<<<< HEAD
```bash
CONFIG_PATH="${OPENCLAW_CONFIG_PATH:-${OPENCLAW_STATE_DIR:-$HOME/.openclaw}/openclaw.json}"
cat "$CONFIG_PATH" | jq '.gateway.bind'
```

Then construct the URL:

- **loopback**: `http://127.0.0.1:18793/__openclaw__/canvas/<file>.html`
- **lan/tailnet/auto**: `http://<hostname>:18793/__openclaw__/canvas/<file>.html`

Find your Tailscale hostname:

```bash
tailscale status --json | jq -r '.Self.DNSName' | sed 's/\.$//'
```

### 3. Find connected nodes

```bash
openclaw nodes list
```

Look for Mac/iOS/Android nodes with canvas capability.

### 4. Present content

```
canvas action:present node:<node-id> target:<full-url>
```

**Example:**

```
canvas action:present node:mac-63599bc4-b54d-4392-9048-b97abd58343a target:http://peters-mac-studio-1.sheep-coho.ts.net:18793/__openclaw__/canvas/snake.html
```

### 5. Navigate, snapshot, or hide

```
canvas action:navigate node:<node-id> url:<new-url>
canvas action:snapshot node:<node-id>
canvas action:hide node:<node-id>
```

## Debugging

### White screen / content not loading

**Cause:** URL mismatch between server bind and node expectation.

**Debug steps:**

1. Check server bind: `CONFIG_PATH="${OPENCLAW_CONFIG_PATH:-${OPENCLAW_STATE_DIR:-$HOME/.openclaw}/openclaw.json}"; cat "$CONFIG_PATH" | jq '.gateway.bind'`
2. Check what port canvas is on: `lsof -i :18793`
3. Test URL directly: `curl http://<hostname>:18793/__openclaw__/canvas/<file>.html`

**Solution:** Use the full hostname matching your bind mode, not localhost.

### "node required" error

Always specify `node:<node-id>` parameter.

### "node not connected" error

Node is offline. Use `openclaw nodes list` to find online nodes.

### Content not updating

If live reload isn't working:

1. Check `liveReload: true` in config
2. Ensure file is in the canvas root directory
3. Check for watcher errors in logs

## URL Path Structure

The canvas host serves from `/__openclaw__/canvas/` prefix:

```
http://<host>:18793/__openclaw__/canvas/index.html  → ~/clawd/canvas/index.html
http://<host>:18793/__openclaw__/canvas/games/snake.html → ~/clawd/canvas/games/snake.html
```

The `/__openclaw__/canvas/` prefix is defined by `CANVAS_HOST_PATH` constant.

## Tips

- Keep HTML self-contained (inline CSS/JS) for best results
- Use the default index.html as a test page (has bridge diagnostics)
- The canvas persists until you `hide` it or navigate away
- Live reload makes development fast - just save and it updates!
- A2UI JSON push is WIP - use HTML files for now
=======
## Troubleshooting

- Node sees localhost but is remote: fix `gateway.bind` or public URL, regenerate URL.
- LAN node cannot load: verify same network, firewall, Gateway port, and auth/capability URL.
- Tailnet node cannot load: verify Tailscale status and advertised host.
- Blank page: open URL locally, check browser console, then snapshot node.
- Live reload missing: verify `liveReload` and file write under root.
>>>>>>> upstream/main
