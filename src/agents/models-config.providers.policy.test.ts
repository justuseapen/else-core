<<<<<<< HEAD
import { describe, expect, it, vi } from "vitest";
import {
  normalizeProviderSpecificConfig,
  resolveProviderConfigApiKeyResolver,
} from "./models-config.providers.policy.js";

const GOOGLE_BASE_URL = "https://generativelanguage.googleapis.com";
=======
// Verifies provider policy hooks without loading real provider plugins.
import { describe, expect, it, vi } from "vitest";
>>>>>>> upstream/main

vi.mock("../plugins/provider-runtime.js", () => ({
  applyProviderNativeStreamingUsageCompatWithPlugin: () => undefined,
  normalizeProviderConfigWithPlugin: (params: {
    provider: string;
    context: { providerConfig?: { baseUrl?: string } };
  }) => {
<<<<<<< HEAD
=======
    // Google URL normalization is representative of plugin-owned policy hooks.
>>>>>>> upstream/main
    if (params.provider !== "google") {
      return undefined;
    }
    const baseUrl = params.context.providerConfig?.baseUrl?.trim();
    if (!baseUrl || baseUrl.endsWith("/v1beta")) {
      return undefined;
    }
    return {
      ...params.context.providerConfig,
      baseUrl:
        baseUrl === GOOGLE_BASE_URL
          ? `${GOOGLE_BASE_URL}/v1beta`
          : params.context.providerConfig?.baseUrl,
    };
  },
  resolveProviderConfigApiKeyWithPlugin: (params: {
    provider: string;
    context: { env: NodeJS.ProcessEnv };
  }) => {
<<<<<<< HEAD
=======
    // API key markers can come from provider-specific non-key auth state.
>>>>>>> upstream/main
    if (params.provider === "amazon-bedrock") {
      return params.context.env.AWS_PROFILE?.trim() ? "AWS_PROFILE" : undefined;
    }
    if (params.provider === "anthropic-vertex") {
      return params.context.env.ANTHROPIC_VERTEX_USE_GCP_METADATA === "true"
        ? "gcp-vertex-credentials"
        : undefined;
    }
    return undefined;
  },
}));

<<<<<<< HEAD
describe("models-config.providers.policy", () => {
  it("resolves config apiKey markers through provider plugin hooks", async () => {
=======
import {
  normalizeProviderSpecificConfig,
  resolveProviderConfigApiKeyResolver,
} from "./models-config.providers.policy.js";

const GOOGLE_BASE_URL = "https://generativelanguage.googleapis.com";

describe("models-config.providers.policy", () => {
  it("resolves config apiKey markers through provider plugin hooks", () => {
>>>>>>> upstream/main
    const env = {
      AWS_PROFILE: "default",
    } as NodeJS.ProcessEnv;
    const resolver = resolveProviderConfigApiKeyResolver("amazon-bedrock");

    expect(resolver).toBeTypeOf("function");
    expect(resolver?.(env)).toBe("AWS_PROFILE");
  });

<<<<<<< HEAD
  it("resolves anthropic-vertex ADC markers through provider plugin hooks", async () => {
=======
  it("resolves anthropic-vertex ADC markers through provider plugin hooks", () => {
>>>>>>> upstream/main
    const resolver = resolveProviderConfigApiKeyResolver("anthropic-vertex");

    expect(resolver).toBeTypeOf("function");
    expect(
      resolver?.({
        ANTHROPIC_VERTEX_USE_GCP_METADATA: "true",
      } as NodeJS.ProcessEnv),
    ).toBe("gcp-vertex-credentials");
  });

<<<<<<< HEAD
  it("normalizes Google provider config through provider plugin hooks", async () => {
=======
  it("normalizes Google provider config through provider plugin hooks", () => {
>>>>>>> upstream/main
    expect(
      normalizeProviderSpecificConfig("google", {
        api: "google-generative-ai",
        baseUrl: "https://generativelanguage.googleapis.com",
        models: [],
      }),
<<<<<<< HEAD
    ).toMatchObject({
      api: "google-generative-ai",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
=======
    ).toEqual({
      api: "google-generative-ai",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      models: [],
>>>>>>> upstream/main
    });
  });

  it("does not treat generic transport APIs as provider plugin ids", () => {
<<<<<<< HEAD
=======
    // Transport ids like openai-completions are not provider-policy namespaces.
>>>>>>> upstream/main
    const provider = {
      api: "openai-completions" as const,
      baseUrl: "https://example.invalid/v1",
      apiKey: "EXAMPLE_KEY",
      models: [],
    };

    const resolver = resolveProviderConfigApiKeyResolver("dashscope-vision", provider);
    expect(resolver).toBeTypeOf("function");
    expect(resolver?.({} as NodeJS.ProcessEnv)).toBeUndefined();
    expect(normalizeProviderSpecificConfig("dashscope-vision", provider)).toBe(provider);
  });
});
