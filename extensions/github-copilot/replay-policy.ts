<<<<<<< HEAD
export function buildGithubCopilotReplayPolicy(modelId?: string) {
  return (modelId?.toLowerCase() ?? "").includes("claude")
=======
// Github Copilot plugin module implements replay policy behavior.
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";

export function buildGithubCopilotReplayPolicy(modelId?: string) {
  return normalizeLowercaseStringOrEmpty(modelId).includes("claude")
>>>>>>> upstream/main
    ? {
        dropThinkingBlocks: true,
      }
    : {};
}
