<<<<<<< HEAD
import { completeSimple, type TextContent } from "@mariozechner/pi-ai";
import { getApiKeyForModel, requireApiKey } from "../../agents/model-auth.js";
import { resolveDefaultModelForAgent } from "../../agents/model-selection.js";
import { resolveModelAsync } from "../../agents/pi-embedded-runner/model.js";
import { prepareModelForSimpleCompletion } from "../../agents/simple-completion-transport.js";
import type { OpenClawConfig } from "../../config/config.js";
import { logVerbose } from "../../globals.js";
=======
// Generates short labels for sessions from conversation context.
import { resolveModelAsync } from "../../agents/embedded-agent-runner/model.js";
import { requireApiKey } from "../../agents/model-auth.js";
import { resolveDefaultModelForAgent } from "../../agents/model-selection.js";
import { prepareModelForSimpleCompletion } from "../../agents/simple-completion-transport.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { logVerbose } from "../../globals.js";
import { completeSimple } from "../../llm/stream.js";
import type { TextContent } from "../../llm/types.js";
import { getRuntimeAuthForModel } from "../../plugins/runtime/runtime-model-auth.runtime.js";
>>>>>>> upstream/main

const DEFAULT_MAX_LABEL_LENGTH = 128;
const TIMEOUT_MS = 15_000;

<<<<<<< HEAD
=======
/** Inputs for generating a short conversation label from the active model. */
>>>>>>> upstream/main
export type ConversationLabelParams = {
  userMessage: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  maxLength?: number;
};

function isTextContentBlock(block: { type: string }): block is TextContent {
  return block.type === "text";
}

<<<<<<< HEAD
=======
function isCodexSimpleCompletionModel(model: { api?: string; provider?: string }): boolean {
  return model.api === "openai-chatgpt-responses";
}

function extractSimpleCompletionError(result: {
  stopReason?: string;
  errorMessage?: string;
}): string | null {
  if (result.stopReason !== "error") {
    return null;
  }
  return result.errorMessage?.trim() || "unknown error";
}

/** Generates a bounded human-readable label for a session, or null on failure. */
>>>>>>> upstream/main
export async function generateConversationLabel(
  params: ConversationLabelParams,
): Promise<string | null> {
  const { userMessage, prompt, cfg, agentId, agentDir } = params;
  const maxLength =
    typeof params.maxLength === "number" &&
    Number.isFinite(params.maxLength) &&
    params.maxLength > 0
      ? Math.floor(params.maxLength)
      : DEFAULT_MAX_LABEL_LENGTH;
  const modelRef = resolveDefaultModelForAgent({ cfg, agentId });
  const resolved = await resolveModelAsync(modelRef.provider, modelRef.model, agentDir, cfg);
  if (!resolved.model) {
    logVerbose(
      `conversation-label-generator: failed to resolve model ${modelRef.provider}/${modelRef.model}`,
    );
    return null;
  }
  const completionModel = prepareModelForSimpleCompletion({ model: resolved.model, cfg });

  const apiKey = requireApiKey(
<<<<<<< HEAD
    await getApiKeyForModel({ model: completionModel, cfg, agentDir }),
=======
    await getRuntimeAuthForModel({
      model: completionModel,
      cfg,
      workspaceDir: agentDir,
    }),
>>>>>>> upstream/main
    modelRef.provider,
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
<<<<<<< HEAD
    const result = await completeSimple(
      completionModel,
      {
        messages: [
          {
            role: "user",
            content: `${prompt}\n\n${userMessage}`,
=======
    // Label generation should never block normal reply handling for long.
    const result = await completeSimple(
      completionModel,
      {
        systemPrompt: prompt,
        messages: [
          {
            role: "user",
            content: userMessage,
>>>>>>> upstream/main
            timestamp: Date.now(),
          },
        ],
      },
      {
        apiKey,
        maxTokens: 100,
<<<<<<< HEAD
        temperature: 0.3,
        signal: controller.signal,
      },
    );
=======
        ...(isCodexSimpleCompletionModel(completionModel) ? {} : { temperature: 0.3 }),
        signal: controller.signal,
      },
    );
    const errorMessage = extractSimpleCompletionError(result);
    if (errorMessage) {
      logVerbose(`conversation-label-generator: completion failed: ${errorMessage}`);
      return null;
    }
>>>>>>> upstream/main

    const text = result.content
      .filter(isTextContentBlock)
      .map((block) => block.text)
      .join("")
      .trim();

    if (!text) {
      return null;
    }

    return text.slice(0, maxLength);
  } finally {
    clearTimeout(timeout);
  }
}
