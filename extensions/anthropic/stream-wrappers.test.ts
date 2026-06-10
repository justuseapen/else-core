<<<<<<< HEAD
import type { StreamFn } from "@mariozechner/pi-agent-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  __testing,
  createAnthropicBetaHeadersWrapper,
  createAnthropicFastModeWrapper,
  createAnthropicServiceTierWrapper,
=======
// Anthropic tests cover stream wrappers plugin behavior.
import type { StreamFn } from "openclaw/plugin-sdk/agent-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  testing,
  createAnthropicBetaHeadersWrapper,
  createAnthropicFastModeWrapper,
  createAnthropicServiceTierWrapper,
  createAnthropicThinkingPrefillWrapper,
  resolveAnthropicBetas,
>>>>>>> upstream/main
  wrapAnthropicProviderStream,
} from "./stream-wrappers.js";

const CONTEXT_1M_BETA = "context-1m-2025-08-07";
const OAUTH_BETA = "oauth-2025-04-20";
<<<<<<< HEAD
=======
const DEFAULT_BETA_HEADER =
  "fine-grained-tool-streaming-2025-05-14,interleaved-thinking-2025-05-14";
const OAUTH_BETA_HEADER = `claude-code-20250219,${OAUTH_BETA},${DEFAULT_BETA_HEADER}`;
>>>>>>> upstream/main

function runWrapper(apiKey: string | undefined): Record<string, string> | undefined {
  const captured: { headers?: Record<string, string> } = {};
  const base: StreamFn = (_model, _context, options) => {
    captured.headers = options?.headers;
    return {} as never;
  };
  const wrapper = createAnthropicBetaHeadersWrapper(base, [CONTEXT_1M_BETA]);
<<<<<<< HEAD
  wrapper(
=======
  void wrapper(
>>>>>>> upstream/main
    { provider: "anthropic", id: "claude-opus-4-6" } as never,
    {} as never,
    { apiKey } as never,
  );
  return captured.headers;
}

<<<<<<< HEAD
=======
function createPayloadCapturingBaseStream(captured: {
  headers?: Record<string, string>;
  payload?: Record<string, unknown>;
}): StreamFn {
  return (model, _context, options) => {
    captured.headers = options?.headers;
    const payload = {} as Record<string, unknown>;
    options?.onPayload?.(payload as never, model as never);
    captured.payload = payload;
    return {} as never;
  };
}

function runComposedAnthropicProviderStream(apiKey: string) {
  const captured: { headers?: Record<string, string>; payload?: Record<string, unknown> } = {};
  const wrapped = wrapAnthropicProviderStream({
    streamFn: createPayloadCapturingBaseStream(captured),
    modelId: "claude-sonnet-4-6",
    extraParams: { context1m: true, serviceTier: "auto" },
  } as never);

  void wrapped?.(
    { provider: "anthropic", api: "anthropic-messages", id: "claude-sonnet-4-6" } as never,
    {} as never,
    { apiKey } as never,
  );
  return captured;
}

function runPayloadWrapper(
  params: {
    apiKey?: string;
    provider?: string;
    api?: string;
    baseUrl?: string;
  },
  createWrapper: (base: StreamFn) => StreamFn,
): Record<string, unknown> | undefined {
  const captured: { payload?: Record<string, unknown> } = {};
  const wrapper = createWrapper(createPayloadCapturingBaseStream(captured));
  void wrapper(
    {
      provider: params.provider ?? "anthropic",
      api: params.api ?? "anthropic-messages",
      baseUrl: params.baseUrl,
      id: "claude-sonnet-4-6",
    } as never,
    {} as never,
    { apiKey: params.apiKey } as never,
  );
  return captured.payload;
}

>>>>>>> upstream/main
describe("anthropic stream wrappers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

<<<<<<< HEAD
  it("strips context-1m for Claude CLI or legacy token auth and warns", () => {
    const warn = vi.spyOn(__testing.log, "warn").mockImplementation(() => undefined);
=======
  it("strips legacy context-1m betas for Claude CLI or legacy token auth", () => {
    const warn = vi.spyOn(testing.log, "warn").mockImplementation(() => undefined);
>>>>>>> upstream/main
    const headers = runWrapper("sk-ant-oat01-123");
    expect(headers?.["anthropic-beta"]).toBeDefined();
    expect(headers?.["anthropic-beta"]).toContain(OAUTH_BETA);
    expect(headers?.["anthropic-beta"]).not.toContain(CONTEXT_1M_BETA);
<<<<<<< HEAD
    expect(warn).toHaveBeenCalledOnce();
  });

  it("keeps context-1m for API key auth", () => {
    const warn = vi.spyOn(__testing.log, "warn").mockImplementation(() => undefined);
    const headers = runWrapper("sk-ant-api-123");
    expect(headers?.["anthropic-beta"]).toBeDefined();
    expect(headers?.["anthropic-beta"]).toContain(CONTEXT_1M_BETA);
=======
    expect(warn).not.toHaveBeenCalled();
  });

  it("strips legacy context-1m betas for API key auth", () => {
    const warn = vi.spyOn(testing.log, "warn").mockImplementation(() => undefined);
    const headers = runWrapper("sk-ant-api-123");
    expect(headers?.["anthropic-beta"]).toBeDefined();
    expect(headers?.["anthropic-beta"]).not.toContain(CONTEXT_1M_BETA);
>>>>>>> upstream/main
    expect(warn).not.toHaveBeenCalled();
  });

  it("skips service_tier for OAuth token in composed stream chain", () => {
<<<<<<< HEAD
    const captured: { headers?: Record<string, string>; payload?: Record<string, unknown> } = {};
    const base: StreamFn = (model, _context, options) => {
      captured.headers = options?.headers;
      const payload = {} as Record<string, unknown>;
      options?.onPayload?.(payload as never, model as never);
      captured.payload = payload;
      return {} as never;
    };

    const wrapped = wrapAnthropicProviderStream({
      streamFn: base,
      modelId: "claude-sonnet-4-6",
      extraParams: { context1m: true, serviceTier: "auto" },
    } as never);

    wrapped?.(
=======
    const captured = runComposedAnthropicProviderStream("sk-ant-oat01-oauth-token");
    expect(captured.headers?.["anthropic-beta"]).toBe(OAUTH_BETA_HEADER);
    expect(captured.payload?.service_tier).toBeUndefined();
  });

  it("composes the anthropic provider stream chain from extra params", () => {
    const captured = runComposedAnthropicProviderStream("sk-ant-api-123");
    expect(captured.headers?.["anthropic-beta"]).not.toContain(CONTEXT_1M_BETA);
    expect(captured.payload).toMatchObject({ service_tier: "auto" });
  });

  it("does not emit the legacy context-1m beta from context1m or explicit config", () => {
    expect(
      resolveAnthropicBetas(
        { context1m: true, anthropicBeta: [CONTEXT_1M_BETA, "files-api-2025-04-14"] },
        "claude-sonnet-4-6",
      ),
    ).toEqual(["files-api-2025-04-14"]);
  });

  it("strips legacy context-1m beta from comma-separated string config", () => {
    expect(
      resolveAnthropicBetas(
        { anthropicBeta: `${CONTEXT_1M_BETA},files-api-2025-04-14` },
        "claude-sonnet-4-6",
      ),
    ).toEqual(["files-api-2025-04-14"]);
  });

  it("preserves OAuth-required betas when context1m is the only configured beta trigger", () => {
    const captured: { headers?: Record<string, string> } = {};
    const wrapped = wrapAnthropicProviderStream({
      streamFn: createPayloadCapturingBaseStream(captured),
      modelId: "claude-sonnet-4-6",
      extraParams: { context1m: true },
    } as never);

    void wrapped?.(
>>>>>>> upstream/main
      { provider: "anthropic", api: "anthropic-messages", id: "claude-sonnet-4-6" } as never,
      {} as never,
      { apiKey: "sk-ant-oat01-oauth-token" } as never,
    );

    expect(captured.headers?.["anthropic-beta"]).toContain(OAUTH_BETA);
    expect(captured.headers?.["anthropic-beta"]).not.toContain(CONTEXT_1M_BETA);
<<<<<<< HEAD
    expect(captured.payload?.service_tier).toBeUndefined();
  });

  it("composes the anthropic provider stream chain from extra params", () => {
    const captured: { headers?: Record<string, string>; payload?: Record<string, unknown> } = {};
    const base: StreamFn = (model, _context, options) => {
      captured.headers = options?.headers;
      const payload = {} as Record<string, unknown>;
      options?.onPayload?.(payload as never, model as never);
      captured.payload = payload;
      return {} as never;
    };

    const wrapped = wrapAnthropicProviderStream({
      streamFn: base,
      modelId: "claude-sonnet-4-6",
      extraParams: { context1m: true, serviceTier: "auto" },
    } as never);

    wrapped?.(
      { provider: "anthropic", api: "anthropic-messages", id: "claude-sonnet-4-6" } as never,
      {} as never,
      { apiKey: "sk-ant-api-123" } as never,
    );

    expect(captured.headers?.["anthropic-beta"]).toContain(CONTEXT_1M_BETA);
    expect(captured.payload).toMatchObject({ service_tier: "auto" });
  });
});

describe("createAnthropicFastModeWrapper", () => {
  function runFastModeWrapper(params: {
    apiKey?: string;
    provider?: string;
    api?: string;
    baseUrl?: string;
    enabled?: boolean;
  }): Record<string, unknown> | undefined {
    const captured: { payload?: Record<string, unknown> } = {};
    const base: StreamFn = (_model, _context, options) => {
      if (options?.onPayload) {
        const payload: Record<string, unknown> = {};
        options.onPayload(payload, _model);
        captured.payload = payload;
      }
      return {} as never;
    };

    const wrapper = createAnthropicFastModeWrapper(base, params.enabled ?? true);
    wrapper(
      {
        provider: params.provider ?? "anthropic",
        api: params.api ?? "anthropic-messages",
        baseUrl: params.baseUrl,
        id: "claude-sonnet-4-6",
      } as never,
      {} as never,
      { apiKey: params.apiKey } as never,
    );
    return captured.payload;
  }

  it("does not inject service_tier for OAuth token", () => {
    const payload = runFastModeWrapper({ apiKey: "sk-ant-oat01-test-token" });
    expect(payload?.service_tier).toBeUndefined();
  });

  it("injects service_tier for regular API keys", () => {
    const payload = runFastModeWrapper({ apiKey: "sk-ant-api03-test-key" });
    expect(payload?.service_tier).toBe("auto");
  });

  it("injects service_tier=standard_only when disabled for API keys", () => {
    const payload = runFastModeWrapper({ apiKey: "sk-ant-api03-test-key", enabled: false });
    expect(payload?.service_tier).toBe("standard_only");
  });

  it("does not inject service_tier for non-anthropic provider", () => {
    const payload = runFastModeWrapper({
      apiKey: "sk-ant-api03-test-key",
      provider: "openai",
      api: "openai-completions",
    });
    expect(payload?.service_tier).toBeUndefined();
  });
});

describe("createAnthropicServiceTierWrapper", () => {
  function runServiceTierWrapper(params: {
    apiKey?: string;
    provider?: string;
    api?: string;
    serviceTier?: "auto" | "standard_only";
  }): Record<string, unknown> | undefined {
    const captured: { payload?: Record<string, unknown> } = {};
    const base: StreamFn = (_model, _context, options) => {
      if (options?.onPayload) {
        const payload: Record<string, unknown> = {};
        options.onPayload(payload, _model);
        captured.payload = payload;
      }
      return {} as never;
    };

    const wrapper = createAnthropicServiceTierWrapper(base, params.serviceTier ?? "auto");
    wrapper(
      {
        provider: params.provider ?? "anthropic",
        api: params.api ?? "anthropic-messages",
        id: "claude-sonnet-4-6",
      } as never,
      {} as never,
      { apiKey: params.apiKey } as never,
    );
    return captured.payload;
  }

  it("does not inject service_tier for OAuth token", () => {
    const payload = runServiceTierWrapper({ apiKey: "sk-ant-oat01-test-token" });
    expect(payload?.service_tier).toBeUndefined();
  });

  it("injects service_tier for regular API keys", () => {
    const payload = runServiceTierWrapper({ apiKey: "sk-ant-api03-test-key" });
    expect(payload?.service_tier).toBe("auto");
  });

  it("injects service_tier=standard_only for regular API keys", () => {
    const payload = runServiceTierWrapper({
=======
  });

  it("preserves OAuth-required betas when legacy context-1m is the only configured beta", () => {
    const captured: { headers?: Record<string, string> } = {};
    const wrapped = wrapAnthropicProviderStream({
      streamFn: createPayloadCapturingBaseStream(captured),
      modelId: "claude-sonnet-4-6",
      extraParams: { anthropicBeta: [CONTEXT_1M_BETA] },
    } as never);

    void wrapped?.(
      { provider: "anthropic", api: "anthropic-messages", id: "claude-sonnet-4-6" } as never,
      {} as never,
      { apiKey: "sk-ant-oat01-oauth-token" } as never,
    );

    expect(captured.headers?.["anthropic-beta"]).toContain(OAUTH_BETA);
    expect(captured.headers?.["anthropic-beta"]).not.toContain(CONTEXT_1M_BETA);
  });
});

describe("createAnthropicThinkingPrefillWrapper", () => {
  function runThinkingPrefillWrapper(payload: Record<string, unknown>): Record<string, unknown> {
    const wrapper = createAnthropicThinkingPrefillWrapper(((_model, _context, options) => {
      options?.onPayload?.(payload as never, {} as never);
      return {} as never;
    }) as StreamFn);
    void wrapper({ provider: "anthropic", api: "anthropic-messages" } as never, {} as never, {});
    return payload;
  }

  it("removes trailing assistant prefill when extended thinking is enabled", () => {
    const warn = vi.spyOn(testing.log, "warn").mockImplementation(() => undefined);
    const payload = runThinkingPrefillWrapper({
      thinking: { type: "enabled", budget_tokens: 1024 },
      messages: [
        { role: "user", content: "Return JSON." },
        { role: "assistant", content: "{" },
      ],
    });

    expect(payload.messages).toEqual([{ role: "user", content: "Return JSON." }]);
    expect(warn).toHaveBeenCalledOnce();
  });

  it("keeps assistant prefill when thinking is disabled", () => {
    const payload = runThinkingPrefillWrapper({
      thinking: { type: "disabled" },
      messages: [
        { role: "user", content: "Return JSON." },
        { role: "assistant", content: "{" },
      ],
    });

    expect(payload.messages).toHaveLength(2);
  });

  it("keeps trailing assistant tool use turns", () => {
    const payload = runThinkingPrefillWrapper({
      thinking: { type: "adaptive" },
      messages: [
        { role: "user", content: "Read a file." },
        { role: "assistant", content: [{ type: "tool_use", id: "toolu_1", name: "Read" }] },
      ],
    });

    expect(payload.messages).toHaveLength(2);
  });
});

type ServiceTierWrapperParams = {
  apiKey?: string;
  provider?: string;
  api?: string;
  enabled?: boolean;
  serviceTier?: "auto" | "standard_only";
};

const serviceTierWrapperCases: Array<{
  name: string;
  run: (params: ServiceTierWrapperParams) => Record<string, unknown> | undefined;
}> = [
  {
    name: "fast mode",
    run: (params) =>
      runPayloadWrapper(params, (base) =>
        createAnthropicFastModeWrapper(base, params.enabled ?? true),
      ),
  },
  {
    name: "explicit service tier",
    run: (params) =>
      runPayloadWrapper(params, (base) =>
        createAnthropicServiceTierWrapper(base, params.serviceTier ?? "auto"),
      ),
  },
];

describe("Anthropic service_tier payload wrappers", () => {
  it.each(serviceTierWrapperCases)("$name skips service_tier for OAuth token", ({ run }) => {
    const payload = run({ apiKey: "sk-ant-oat01-test-token" });
    expect(payload?.service_tier).toBeUndefined();
  });

  it.each(serviceTierWrapperCases)("$name injects service_tier for regular API keys", ({ run }) => {
    const payload = run({ apiKey: "sk-ant-api03-test-key" });
    expect(payload?.service_tier).toBe("auto");
  });

  it.each(serviceTierWrapperCases)(
    "$name does not inject service_tier for non-anthropic provider",
    ({ run }) => {
      const payload = run({
        apiKey: "sk-ant-api03-test-key",
        provider: "openai",
        api: "openai-completions",
      });
      expect(payload?.service_tier).toBeUndefined();
    },
  );

  it("fast mode injects service_tier=standard_only when disabled for API keys", () => {
    const payload = serviceTierWrapperCases[0].run({
      apiKey: "sk-ant-api03-test-key",
      enabled: false,
    });
    expect(payload?.service_tier).toBe("standard_only");
  });

  it("explicit service tier injects service_tier=standard_only for regular API keys", () => {
    const payload = serviceTierWrapperCases[1].run({
>>>>>>> upstream/main
      apiKey: "sk-ant-api03-test-key",
      serviceTier: "standard_only",
    });
    expect(payload?.service_tier).toBe("standard_only");
  });
<<<<<<< HEAD

  it("does not inject service_tier for non-anthropic provider", () => {
    const payload = runServiceTierWrapper({
      apiKey: "sk-ant-api03-test-key",
      provider: "openai",
      api: "openai-completions",
    });
    expect(payload?.service_tier).toBeUndefined();
  });
=======
>>>>>>> upstream/main
});
