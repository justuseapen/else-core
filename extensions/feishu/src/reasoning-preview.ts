<<<<<<< HEAD
import { loadSessionStore, resolveSessionStoreEntry } from "./bot-runtime-api.js";

export function resolveFeishuReasoningPreviewEnabled(params: {
  storePath: string;
  sessionKey?: string;
}): boolean {
  if (!params.sessionKey) {
    return false;
=======
// Feishu plugin module implements reasoning preview behavior.
import { resolveFeishuConfigReasoningDefault } from "./agent-config.js";
import { loadSessionStore, resolveSessionStoreEntry } from "./bot-runtime-api.js";
import type { ClawdbotConfig } from "./bot-runtime-api.js";

export function resolveFeishuReasoningPreviewEnabled(params: {
  cfg: ClawdbotConfig;
  agentId: string;
  storePath: string;
  sessionKey?: string;
}): boolean {
  const configDefault = resolveFeishuConfigReasoningDefault(params.cfg, params.agentId);

  if (!params.sessionKey) {
    return configDefault === "stream";
>>>>>>> upstream/main
  }

  try {
    const store = loadSessionStore(params.storePath, { skipCache: true });
<<<<<<< HEAD
    return (
      resolveSessionStoreEntry({ store, sessionKey: params.sessionKey }).existing
        ?.reasoningLevel === "stream"
    );
  } catch {
    return false;
  }
=======
    const level = resolveSessionStoreEntry({ store, sessionKey: params.sessionKey }).existing
      ?.reasoningLevel;
    if (level === "on" || level === "stream" || level === "off") {
      return level === "stream";
    }
  } catch {
    return false;
  }
  return configDefault === "stream";
>>>>>>> upstream/main
}
