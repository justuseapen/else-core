<<<<<<< HEAD
import { describe, expect, it } from "vitest";
=======
// Covers Codex-native web search activation and payload projection.
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { writeSessionStoreForTest } from "../config/sessions/test-helpers.js";
>>>>>>> upstream/main
import {
  buildCodexNativeWebSearchTool,
  describeCodexNativeWebSearch,
  patchCodexNativeWebSearchPayload,
  resolveCodexNativeSearchActivation,
  resolveCodexNativeWebSearchConfig,
<<<<<<< HEAD
=======
  isCodexNativeWebSearchRelevant,
>>>>>>> upstream/main
  shouldSuppressManagedWebSearchTool,
} from "./codex-native-web-search.js";

const baseConfig = {
  tools: {
    web: {
      search: {
        enabled: true,
        openaiCodex: {
          enabled: true,
          mode: "cached",
        },
      },
    },
  },
} as const;

describe("resolveCodexNativeSearchActivation", () => {
  it("returns managed_only when native Codex search is disabled", () => {
    const result = resolveCodexNativeSearchActivation({
      config: { tools: { web: { search: { enabled: true } } } },
<<<<<<< HEAD
      modelProvider: "openai-codex",
      modelApi: "openai-codex-responses",
=======
      modelProvider: "openai",
      modelApi: "openai-chatgpt-responses",
>>>>>>> upstream/main
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("codex_not_enabled");
  });

  it("returns managed_only for non-eligible models", () => {
    const result = resolveCodexNativeSearchActivation({
      config: baseConfig,
      modelProvider: "openai",
      modelApi: "openai-responses",
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("model_not_eligible");
  });

<<<<<<< HEAD
  it("activates for direct openai-codex when auth exists", () => {
=======
  it("activates for direct openai when auth exists", () => {
    // Direct OpenAI needs bridgeable auth before OpenClaw can suppress the
    // managed web-search tool in favor of Codex native search.
>>>>>>> upstream/main
    const result = resolveCodexNativeSearchActivation({
      config: {
        ...baseConfig,
        auth: {
          profiles: {
<<<<<<< HEAD
            "openai-codex:default": {
              provider: "openai-codex",
=======
            "openai:default": {
              provider: "openai",
>>>>>>> upstream/main
              mode: "oauth",
            },
          },
        },
      },
<<<<<<< HEAD
      modelProvider: "openai-codex",
      modelApi: "openai-codex-responses",
=======
      modelProvider: "openai",
      modelApi: "openai-chatgpt-responses",
>>>>>>> upstream/main
    });

    expect(result.state).toBe("native_active");
    expect(result.codexMode).toBe("cached");
  });

<<<<<<< HEAD
  it("falls back to managed_only when direct openai-codex auth is missing", () => {
    const result = resolveCodexNativeSearchActivation({
      config: baseConfig,
      modelProvider: "openai-codex",
      modelApi: "openai-codex-responses",
=======
  it("falls back to managed_only when direct openai auth is missing", () => {
    const result = resolveCodexNativeSearchActivation({
      config: baseConfig,
      modelProvider: "openai",
      modelApi: "openai-chatgpt-responses",
>>>>>>> upstream/main
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("codex_auth_missing");
  });

<<<<<<< HEAD
  it("activates for api-compatible openai-codex-responses providers without separate Codex auth", () => {
    const result = resolveCodexNativeSearchActivation({
      config: baseConfig,
      modelProvider: "gateway",
      modelApi: "openai-codex-responses",
=======
  it("activates for api-compatible openai-chatgpt-responses providers without separate Codex auth", () => {
    // Gateway-style providers already execute through a compatible Responses
    // API, so native search can be enabled without a separate OpenAI profile.
    const result = resolveCodexNativeSearchActivation({
      config: baseConfig,
      modelProvider: "gateway",
      modelApi: "openai-chatgpt-responses",
>>>>>>> upstream/main
    });

    expect(result.state).toBe("native_active");
  });

  it("keeps all search disabled when global web search is disabled", () => {
    const result = resolveCodexNativeSearchActivation({
      config: {
        tools: {
          web: {
            search: {
              enabled: false,
              openaiCodex: { enabled: true, mode: "live" },
            },
          },
        },
      },
<<<<<<< HEAD
      modelProvider: "openai-codex",
      modelApi: "openai-codex-responses",
=======
      modelProvider: "openai",
      modelApi: "openai-chatgpt-responses",
>>>>>>> upstream/main
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("globally_disabled");
  });
<<<<<<< HEAD
=======

  it("keeps native search inactive when the agent denies web_search", () => {
    const result = resolveCodexNativeSearchActivation({
      config: {
        ...baseConfig,
        agents: {
          list: [
            {
              id: "main",
              tools: { deny: ["web_search"] },
            },
          ],
        },
      },
      agentId: "main",
      modelProvider: "gateway",
      modelApi: "openai-chatgpt-responses",
      modelId: "gpt-5.5",
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("tool_policy_denied");
  });

  it("keeps native search inactive when the agent denies group:web via session key", () => {
    const result = resolveCodexNativeSearchActivation({
      config: {
        ...baseConfig,
        agents: {
          list: [
            {
              id: "main",
              tools: { deny: ["group:web"] },
            },
          ],
        },
      },
      sessionKey: "agent:main:main",
      modelProvider: "gateway",
      modelApi: "openai-chatgpt-responses",
      modelId: "gpt-5.5",
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("tool_policy_denied");
  });

  it("keeps native search inactive when provider policy denies web_search", () => {
    const result = resolveCodexNativeSearchActivation({
      config: {
        ...baseConfig,
        tools: {
          ...baseConfig.tools,
          byProvider: {
            "gateway/gpt-5.5": { deny: ["web_search"] },
          },
        },
      },
      modelProvider: "gateway",
      modelApi: "openai-chatgpt-responses",
      modelId: "gpt-5.5",
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("tool_policy_denied");
  });

  it("keeps native search inactive when sender policy denies web_search", () => {
    const result = resolveCodexNativeSearchActivation({
      config: {
        ...baseConfig,
        tools: {
          ...baseConfig.tools,
          toolsBySender: {
            "channel:msteams:alice": { deny: ["web_search"] },
          },
        },
      },
      messageProvider: "teams",
      senderId: "alice",
      modelProvider: "gateway",
      modelApi: "openai-chatgpt-responses",
      modelId: "gpt-5.5",
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("tool_policy_denied");
  });

  it("keeps native search inactive when sandbox policy denies group:web", () => {
    const result = resolveCodexNativeSearchActivation({
      config: baseConfig,
      sandboxToolPolicy: { deny: ["group:web"] },
      modelProvider: "gateway",
      modelApi: "openai-chatgpt-responses",
      modelId: "gpt-5.5",
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("tool_policy_denied");
  });

  it("keeps native search inactive when inherited session policy denies web_search", () => {
    const agentId = `native-inherited-deny-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const sessionKey = `agent:${agentId}:subagent:limited`;
    const storePath = path.join(os.tmpdir(), `openclaw-native-inherited-deny-${agentId}.json`);
    writeSessionStoreForTest(storePath, {
      [sessionKey]: {
        sessionId: "limited-session",
        updatedAt: Date.now(),
        spawnDepth: 1,
        subagentRole: "orchestrator",
        subagentControlScope: "children",
        inheritedToolDeny: ["web_search"],
      },
    });

    const result = resolveCodexNativeSearchActivation({
      config: {
        ...baseConfig,
        session: {
          store: storePath,
        },
      },
      sessionKey,
      modelProvider: "gateway",
      modelApi: "openai-chatgpt-responses",
      modelId: "gpt-5.5",
    });

    expect(result.state).toBe("managed_only");
    expect(result.inactiveReason).toBe("tool_policy_denied");
  });
>>>>>>> upstream/main
});

describe("Codex native web-search payload helpers", () => {
  it("omits the summary when global web search is disabled", () => {
    expect(
      describeCodexNativeWebSearch({
        tools: {
          web: {
            search: {
              enabled: false,
              openaiCodex: {
                enabled: true,
                mode: "live",
              },
            },
          },
        },
      }),
    ).toBeUndefined();
  });

  it("normalizes optional config values", () => {
    const result = resolveCodexNativeWebSearchConfig({
      tools: {
        web: {
          search: {
            openaiCodex: {
              enabled: true,
              allowedDomains: [" example.com ", "example.com", ""],
              contextSize: "high",
              userLocation: {
                country: " US ",
                city: " New York ",
                timezone: "America/New_York",
              },
            },
          },
        },
      },
    });

<<<<<<< HEAD
    expect(result).toMatchObject({
      enabled: true,
      mode: "cached",
      allowedDomains: ["example.com"],
      contextSize: "high",
      userLocation: {
        country: "US",
        city: "New York",
        timezone: "America/New_York",
      },
    });
=======
    expect(result.enabled).toBe(true);
    expect(result.mode).toBe("cached");
    expect(result.allowedDomains).toEqual(["example.com"]);
    expect(result.contextSize).toBe("high");
    expect(result.userLocation?.country).toBe("US");
    expect(result.userLocation?.city).toBe("New York");
    expect(result.userLocation?.timezone).toBe("America/New_York");
>>>>>>> upstream/main
  });

  it("builds the native Responses web_search tool", () => {
    expect(
      buildCodexNativeWebSearchTool({
        tools: {
          web: {
            search: {
              openaiCodex: {
                enabled: true,
                mode: "live",
                allowedDomains: ["example.com"],
                contextSize: "medium",
                userLocation: { country: "US" },
              },
            },
          },
        },
      }),
    ).toEqual({
      type: "web_search",
      external_web_access: true,
      filters: { allowed_domains: ["example.com"] },
      search_context_size: "medium",
      user_location: {
        type: "approximate",
        country: "US",
      },
    });
  });

  it("injects native web_search into provider payloads", () => {
    const payload: Record<string, unknown> = { tools: [{ type: "function", name: "read" }] };
<<<<<<< HEAD
=======
    // Payload patching mutates the provider request in place because callers
    // already hold the request object that will be sent to the model runtime.
>>>>>>> upstream/main
    const result = patchCodexNativeWebSearchPayload({ payload, config: baseConfig });

    expect(result.status).toBe("injected");
    expect(payload.tools).toEqual([
      { type: "function", name: "read" },
      { type: "web_search", external_web_access: false },
    ]);
  });

  it("does not inject a duplicate native web_search tool", () => {
    const payload: Record<string, unknown> = { tools: [{ type: "web_search" }] };
    const result = patchCodexNativeWebSearchPayload({ payload, config: baseConfig });

    expect(result.status).toBe("native_tool_already_present");
    expect(payload.tools).toEqual([{ type: "web_search" }]);
  });
});

describe("shouldSuppressManagedWebSearchTool", () => {
  it("suppresses managed web_search only when native Codex search is active", () => {
    expect(
      shouldSuppressManagedWebSearchTool({
        config: baseConfig,
        modelProvider: "gateway",
<<<<<<< HEAD
        modelApi: "openai-codex-responses",
=======
        modelApi: "openai-chatgpt-responses",
>>>>>>> upstream/main
      }),
    ).toBe(true);

    expect(
      shouldSuppressManagedWebSearchTool({
        config: baseConfig,
        modelProvider: "openai",
        modelApi: "openai-responses",
      }),
    ).toBe(false);
  });
<<<<<<< HEAD
});

describe("isCodexNativeWebSearchRelevant", () => {
  it("treats a default model with model-level openai-codex-responses api as relevant", async () => {
    const { isCodexNativeWebSearchRelevant } = await import("./codex-native-web-search.js");

=======

  it("does not suppress managed web_search when native search is blocked by policy", () => {
    expect(
      shouldSuppressManagedWebSearchTool({
        config: {
          ...baseConfig,
          agents: {
            list: [
              {
                id: "main",
                tools: { deny: ["group:web"] },
              },
            ],
          },
        },
        agentId: "main",
        modelProvider: "gateway",
        modelApi: "openai-chatgpt-responses",
        modelId: "gpt-5.5",
      }),
    ).toBe(false);
  });
});

describe("isCodexNativeWebSearchRelevant", () => {
  it("treats a default model with model-level openai-chatgpt-responses api as relevant", () => {
    // Provider-level APIs can be generic while individual models opt into the
    // ChatGPT Responses shape that supports native web_search.
>>>>>>> upstream/main
    expect(
      isCodexNativeWebSearchRelevant({
        config: {
          agents: {
            defaults: {
              model: {
                primary: "gateway/gpt-5.4",
              },
            },
          },
          models: {
            providers: {
              gateway: {
                api: "openai-responses",
                baseUrl: "https://gateway.example/v1",
                models: [
                  {
                    id: "gpt-5.4",
                    name: "gpt-5.4",
<<<<<<< HEAD
                    api: "openai-codex-responses",
=======
                    api: "openai-chatgpt-responses",
>>>>>>> upstream/main
                    reasoning: false,
                    input: ["text"],
                    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                    contextWindow: 128_000,
                    maxTokens: 16_384,
                  },
                ],
              },
            },
          },
        },
      }),
    ).toBe(true);
  });
});
