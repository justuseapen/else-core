#!/usr/bin/env node

// Blocks new raw fetch callsites in channel and plugin runtime sources.
import ts from "typescript";
import { bundledPluginCallsite } from "./lib/bundled-plugin-paths.mjs";
import { runCallsiteGuard } from "./lib/callsite-guard.mjs";
import {
  collectCallExpressionLines,
  runAsScript,
  unwrapExpression,
} from "./lib/ts-guard-utils.mjs";

const sourceRoots = ["src/channels", "src/routing", "src/line", "extensions"];

// Temporary allowlist for legacy callsites. New raw fetch callsites in channel/plugin runtime
// code should be rejected and migrated to fetchWithSsrFGuard/shared channel helpers.
const allowedRawFetchCallsites = new Set([
<<<<<<< HEAD
  bundledPluginCallsite("bluebubbles", "src/types.ts", 133),
  bundledPluginCallsite("feishu", "src/streaming-card.ts", 31),
  bundledPluginCallsite("feishu", "src/streaming-card.ts", 101),
  bundledPluginCallsite("feishu", "src/streaming-card.ts", 143),
  bundledPluginCallsite("feishu", "src/streaming-card.ts", 199),
  bundledPluginCallsite("googlechat", "src/api.ts", 22),
  bundledPluginCallsite("googlechat", "src/api.ts", 43),
  bundledPluginCallsite("googlechat", "src/api.ts", 63),
  bundledPluginCallsite("googlechat", "src/api.ts", 188),
  bundledPluginCallsite("googlechat", "src/auth.ts", 82),
  bundledPluginCallsite("matrix", "src/directory-live.ts", 41),
  bundledPluginCallsite("matrix", "src/matrix/client/config.ts", 171),
  bundledPluginCallsite("mattermost", "src/mattermost/client.ts", 211),
  bundledPluginCallsite("mattermost", "src/mattermost/monitor.ts", 230),
  bundledPluginCallsite("mattermost", "src/mattermost/probe.ts", 27),
  bundledPluginCallsite("minimax", "oauth.ts", 62),
  bundledPluginCallsite("minimax", "oauth.ts", 93),
  bundledPluginCallsite("msteams", "src/graph.ts", 39),
  bundledPluginCallsite("nextcloud-talk", "src/room-info.ts", 92),
  bundledPluginCallsite("nextcloud-talk", "src/send.ts", 107),
  bundledPluginCallsite("nextcloud-talk", "src/send.ts", 198),
  bundledPluginCallsite("talk-voice", "index.ts", 27),
  bundledPluginCallsite("thread-ownership", "index.ts", 105),
  bundledPluginCallsite("voice-call", "src/providers/plivo.ts", 95),
  bundledPluginCallsite("voice-call", "src/providers/telnyx.ts", 61),
  bundledPluginCallsite("voice-call", "src/providers/tts-openai.ts", 111),
  bundledPluginCallsite("voice-call", "src/providers/twilio/api.ts", 23),
  bundledPluginCallsite("telegram", "src/api-fetch.ts", 8),
  bundledPluginCallsite("discord", "src/send.outbound.ts", 363),
  bundledPluginCallsite("discord", "src/voice-message.ts", 268),
  bundledPluginCallsite("discord", "src/voice-message.ts", 312),
  bundledPluginCallsite("slack", "src/monitor/media.ts", 55),
  bundledPluginCallsite("slack", "src/monitor/media.ts", 59),
  bundledPluginCallsite("slack", "src/monitor/media.ts", 73),
  bundledPluginCallsite("slack", "src/monitor/media.ts", 99),
=======
  bundledPluginCallsite("browser", "src/browser/cdp.helpers.ts", 268),
  bundledPluginCallsite("browser", "src/browser/client-fetch.ts", 192),
  bundledPluginCallsite("chutes", "models.ts", 536),
  bundledPluginCallsite("chutes", "models.ts", 543),
  bundledPluginCallsite("discord", "src/monitor/gateway-plugin.ts", 417),
  bundledPluginCallsite("discord", "src/monitor/gateway-plugin.ts", 483),
  bundledPluginCallsite("discord", "src/voice-message.ts", 298),
  bundledPluginCallsite("discord", "src/voice-message.ts", 333),
  bundledPluginCallsite("elevenlabs", "speech-provider.ts", 295),
  bundledPluginCallsite("elevenlabs", "tts.ts", 74),
  bundledPluginCallsite("feishu", "src/monitor.webhook.test-helpers.ts", 25),
  bundledPluginCallsite("github-copilot", "login.ts", 80),
  bundledPluginCallsite("github-copilot", "login.ts", 112),
  bundledPluginCallsite("googlechat", "src/auth.ts", 83),
  bundledPluginCallsite("huggingface", "models.ts", 143),
  bundledPluginCallsite("kilocode", "provider-models.ts", 130),
  bundledPluginCallsite("matrix", "src/matrix/sdk/transport.ts", 112),
  bundledPluginCallsite("microsoft-foundry", "onboard.ts", 479),
  bundledPluginCallsite("microsoft", "speech-provider.ts", 140),
  bundledPluginCallsite("minimax", "oauth.ts", 82),
  bundledPluginCallsite("minimax", "oauth.ts", 123),
  bundledPluginCallsite("minimax", "tts.ts", 52),
  bundledPluginCallsite("msteams", "src/graph.ts", 47),
  bundledPluginCallsite("msteams", "src/sdk.ts", 400),
  bundledPluginCallsite("msteams", "src/sdk.ts", 441),
  bundledPluginCallsite("ollama", "src/stream.ts", 649),
  bundledPluginCallsite("openai", "tts.ts", 149),
  bundledPluginCallsite("qa-channel", "src/bus-client.ts", 41),
  bundledPluginCallsite("qa-channel", "src/bus-client.ts", 221),
  bundledPluginCallsite("qa-lab", "src/docker-up.runtime.ts", 274),
  bundledPluginCallsite("qa-lab", "src/gateway-child.ts", 489),
  bundledPluginCallsite("qa-lab", "src/suite.ts", 330),
  bundledPluginCallsite("qa-lab", "src/suite.ts", 341),
  bundledPluginCallsite("qa-lab", "web/src/app.ts", 22),
  bundledPluginCallsite("qa-lab", "web/src/app.ts", 30),
  bundledPluginCallsite("qa-lab", "web/src/app.ts", 38),
  bundledPluginCallsite("qqbot", "src/engine/api/api-client.ts", 124),
  bundledPluginCallsite("qqbot", "src/engine/api/media-chunked.ts", 554),
  bundledPluginCallsite("qqbot", "src/engine/api/token.ts", 211),
  bundledPluginCallsite("qqbot", "src/engine/tools/channel-api.ts", 178),
  bundledPluginCallsite("qqbot", "src/engine/utils/stt.ts", 87),
  bundledPluginCallsite("signal", "src/install-signal-cli.ts", 224),
  bundledPluginCallsite("slack", "src/monitor/media.ts", 106),
  bundledPluginCallsite("slack", "src/monitor/media.ts", 125),
  bundledPluginCallsite("slack", "src/monitor/media.ts", 130),
  bundledPluginCallsite("venice", "models.ts", 552),
  bundledPluginCallsite("vercel-ai-gateway", "models.ts", 181),
  bundledPluginCallsite("voice-call", "src/providers/twilio/api.ts", 23),
>>>>>>> upstream/main
]);

function isRawFetchCall(expression) {
  const callee = unwrapExpression(expression);
  if (ts.isIdentifier(callee)) {
    return callee.text === "fetch";
  }
  if (ts.isPropertyAccessExpression(callee)) {
    return (
      ts.isIdentifier(callee.expression) &&
      callee.expression.text === "globalThis" &&
      callee.name.text === "fetch"
    );
  }
  return false;
}

/**
 * Finds raw `fetch(...)` and `globalThis.fetch(...)` call lines.
 */
export function findRawFetchCallLines(content, fileName = "source.ts") {
  const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true);
  return collectCallExpressionLines(ts, sourceFile, (node) =>
    isRawFetchCall(node.expression) ? node.expression : null,
  );
}

/**
 * Runs the raw channel/plugin fetch guard.
 */
export async function main() {
  await runCallsiteGuard({
    importMetaUrl: import.meta.url,
    sourceRoots,
    extraTestSuffixes: [".browser.test.ts", ".node.test.ts"],
    findCallLines: findRawFetchCallLines,
    skipRelativePath: (relPath) => relPath.includes("/test-support/"),
    allowCallsite: (callsite) => allowedRawFetchCallsites.has(callsite),
    header: "Found raw fetch() usage in channel/plugin runtime sources outside allowlist:",
    footer: "Use fetchWithSsrFGuard() or existing channel/plugin SDK wrappers for network calls.",
  });
}

runAsScript(import.meta.url, main);
