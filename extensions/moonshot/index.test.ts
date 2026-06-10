<<<<<<< HEAD
import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { Context, Model } from "@mariozechner/pi-ai";
import { describe, expect, it } from "vitest";
import { registerSingleProviderPlugin } from "../../test/helpers/plugins/plugin-registration.js";
import plugin from "./index.js";

describe("moonshot provider plugin", () => {
  it("owns replay policy for OpenAI-compatible Moonshot transports", async () => {
    const provider = await registerSingleProviderPlugin(plugin);

    expect(
      provider.buildReplayPolicy?.({
        provider: "moonshot",
        modelApi: "openai-completions",
        modelId: "kimi-k2.5",
      } as never),
    ).toMatchObject({
      sanitizeToolCallIds: true,
      toolCallIdMode: "strict",
=======
// Moonshot tests cover index plugin behavior.
import fs from "node:fs";
import type { Context, Model } from "openclaw/plugin-sdk/llm";
import { registerSingleProviderPlugin } from "openclaw/plugin-sdk/plugin-test-runtime";
import { createCapturedThinkingConfigStream } from "openclaw/plugin-sdk/provider-test-contracts";
import { describe, expect, it } from "vitest";
import plugin from "./index.js";
import { createKimiWebSearchProvider } from "./src/kimi-web-search-provider.js";

type MoonshotManifest = {
  providerAuthAliases?: Record<string, string>;
  setup?: {
    providers?: Array<{
      id?: string;
      envVars?: string[];
    }>;
  };
};

function readManifest(): MoonshotManifest {
  return JSON.parse(
    fs.readFileSync(new URL("./openclaw.plugin.json", import.meta.url), "utf8"),
  ) as MoonshotManifest;
}

describe("moonshot provider plugin", () => {
  it("mirrors Kimi web-search env credentials in manifest metadata", () => {
    const manifestEnvVars =
      readManifest().setup?.providers?.find((provider) => provider.id === "moonshot")?.envVars ??
      [];

    expect([...manifestEnvVars].toSorted()).toStrictEqual(
      [...createKimiWebSearchProvider().envVars].toSorted(),
    );
  });

  it("declares shipped Moonshot provider aliases in runtime and manifest metadata", async () => {
    const provider = await registerSingleProviderPlugin(plugin);

    expect(provider.aliases).toEqual(["moonshotai", "moonshot-ai"]);
    expect(readManifest().providerAuthAliases).toEqual({
      moonshotai: "moonshot",
      "moonshot-ai": "moonshot",
    });
  });

  it("owns replay policy for OpenAI-compatible Moonshot transports without mangling native Kimi tool_call IDs", async () => {
    const provider = await registerSingleProviderPlugin(plugin);

    const policy = provider.buildReplayPolicy?.({
      provider: "moonshot",
      modelApi: "openai-completions",
      modelId: "kimi-k2.6",
    } as never);

    expect(policy).toEqual({
>>>>>>> upstream/main
      applyAssistantFirstOrderingFix: true,
      validateGeminiTurns: true,
      validateAnthropicTurns: true,
    });
<<<<<<< HEAD
=======
    expect(policy).not.toHaveProperty("dropReasoningFromHistory");
    expect(policy).not.toHaveProperty("sanitizeToolCallIds");
    expect(policy).not.toHaveProperty("toolCallIdMode");
>>>>>>> upstream/main
  });

  it("wires moonshot-thinking stream hooks", async () => {
    const provider = await registerSingleProviderPlugin(plugin);
<<<<<<< HEAD
    let capturedPayload: Record<string, unknown> | undefined;
    const baseStreamFn: StreamFn = (model, _context, options) => {
      const payload = { config: { thinkingConfig: { thinkingBudget: -1 } } } as Record<
        string,
        unknown
      >;
      options?.onPayload?.(payload as never, model as never);
      capturedPayload = payload;
      return {} as never;
    };

    const wrapped = provider.wrapStreamFn?.({
      provider: "moonshot",
      modelId: "kimi-k2.5",
      thinkingLevel: "off",
      streamFn: baseStreamFn,
=======
    const capturedStream = createCapturedThinkingConfigStream();

    const wrapped = provider.wrapStreamFn?.({
      provider: "moonshot",
      modelId: "kimi-k2.6",
      thinkingLevel: "off",
      streamFn: capturedStream.streamFn,
>>>>>>> upstream/main
    } as never);

    void wrapped?.(
      {
        api: "openai-completions",
        provider: "moonshot",
<<<<<<< HEAD
        id: "kimi-k2.5",
=======
        id: "kimi-k2.6",
>>>>>>> upstream/main
      } as Model<"openai-completions">,
      { messages: [] } as Context,
      {},
    );

<<<<<<< HEAD
    expect(capturedPayload).toMatchObject({
=======
    expect(capturedStream.getCapturedPayload()).toEqual({
>>>>>>> upstream/main
      config: { thinkingConfig: { thinkingBudget: -1 } },
      thinking: { type: "disabled" },
    });
  });
});
