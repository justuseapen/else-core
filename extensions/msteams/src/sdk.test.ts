// Msteams tests cover sdk plugin behavior.
import * as fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
<<<<<<< HEAD
import {
  createBotFrameworkJwtValidator,
  createMSTeamsAdapter,
  createMSTeamsApp,
  type MSTeamsTeamsSdk,
} from "./sdk.js";
import type { MSTeamsCredentials } from "./token.js";

const jwtValidatorState = vi.hoisted(() => ({
  instances: [] as Array<{ config: Record<string, unknown> }>,
  behaviorByJwks: new Map<string, "success" | "null" | "throw">(),
  calls: [] as Array<{ jwksUri: string; token: string; overrideOptions?: unknown }>,
}));

const clientConstructorState = vi.hoisted(() => ({
  calls: [] as Array<{ serviceUrl: string; options: unknown }>,
}));

vi.mock("@microsoft/teams.apps/dist/middleware/auth/jwt-validator.js", () => ({
  JwtValidator: class JwtValidator {
    private readonly config: Record<string, unknown>;

    constructor(config: Record<string, unknown>) {
      this.config = config;
      jwtValidatorState.instances.push({ config });
    }

    async validateAccessToken(token: string, overrideOptions?: unknown): Promise<object | null> {
      const jwksUri = String((this.config.jwksUriOptions as { uri?: string })?.uri ?? "");
      jwtValidatorState.calls.push({ jwksUri, token, overrideOptions });
      const behavior = jwtValidatorState.behaviorByJwks.get(jwksUri) ?? "null";
      if (behavior === "throw") {
        throw new Error("validator error");
      }
      return behavior === "success" ? { sub: "ok" } : null;
    }
  },
}));

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  clientConstructorState.calls.length = 0;
  jwtValidatorState.instances.length = 0;
  jwtValidatorState.calls.length = 0;
  jwtValidatorState.behaviorByJwks.clear();
  vi.restoreAllMocks();
});

function createSdkStub(): MSTeamsTeamsSdk {
  class AppStub {
    async getBotToken() {
      return {
        toString() {
          return "bot-token";
        },
      };
    }
  }

  class ClientStub {
    constructor(serviceUrl: string, options: unknown) {
      clientConstructorState.calls.push({ serviceUrl, options });
    }

    conversations = {
      activities: (_conversationId: string) => ({
        create: async (_activity: unknown) => ({ id: "created" }),
      }),
=======
import { createMSTeamsApp, createMSTeamsTokenProvider } from "./sdk.js";
import type { MSTeamsCredentials, MSTeamsFederatedCredentials } from "./token.js";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    readFileSync: vi.fn(
      () => "-----BEGIN RSA PRIVATE KEY-----\nfake-key\n-----END RSA PRIVATE KEY-----",
    ),
  };
});

const { mockGetToken } = vi.hoisted(() => {
  const mockGetTokenLocal = vi.fn().mockResolvedValue({ token: "mock-managed-token" });
  return { mockGetToken: mockGetTokenLocal };
});
vi.mock("@azure/identity", () => {
  class ManagedIdentityCredential {
    getToken = mockGetToken;
  }
  class DefaultAzureCredential {
    getToken = mockGetToken;
  }
  class ClientCertificateCredential {
    getToken = mockGetToken;
  }
  return { ManagedIdentityCredential, DefaultAzureCredential, ClientCertificateCredential };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createMSTeamsApp", () => {
  it("does not crash with express 5 path-to-regexp (#55161)", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
>>>>>>> upstream/main
    };

    const app = await createMSTeamsApp(creds);
    expect(app).toBeDefined();
    expect(app.tokenManager).toBeDefined();
  });

<<<<<<< HEAD
describe("createMSTeamsApp", () => {
  it("does not crash with express 5 path-to-regexp (#55161)", async () => {
    // Regression test for: https://github.com/openclaw/openclaw/issues/55161
    // createMSTeamsApp passes a no-op httpServerAdapter to prevent the SDK from
    // creating its default HttpPlugin (which registers `/api*` — invalid in Express 5).
    const { App } = await import("@microsoft/teams.apps");
    const { Client } = await import("@microsoft/teams.api");
    const sdk: MSTeamsTeamsSdk = { App, Client };
    const creds: MSTeamsCredentials = {
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };

    // This would throw "Missing parameter name at index 5: /api*" without the fix
    const app = await createMSTeamsApp(creds, sdk);
    expect(app).toBeDefined();
    // Verify token methods are available (the reason we use the App class)
    expect(typeof (app as unknown as Record<string, unknown>).getBotToken).toBe("function");
  });
});

describe("createMSTeamsAdapter", () => {
  it("provides deleteActivity in proactive continueConversation contexts", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
=======
  it("creates app with secret credentials", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
>>>>>>> upstream/main

      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };

    const app = await createMSTeamsApp(creds);
    expect(app).toBeDefined();
  });

  it("creates app with federated certificate credentials", async () => {
    const creds: MSTeamsFederatedCredentials = {
      type: "federated",
      appId: "test-app-id",
      tenantId: "test-tenant",
      certificatePath: "/path/to/cert.pem",
    };

    const app = await createMSTeamsApp(creds);
    expect(app).toBeDefined();
    expect(fs.readFileSync).toHaveBeenCalledWith("/path/to/cert.pem", "utf-8");
  });

  it("throws when certificate file is missing", async () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error("ENOENT: no such file");
    });

    const creds: MSTeamsFederatedCredentials = {
      type: "federated",
      appId: "test-app-id",
      tenantId: "test-tenant",
      certificatePath: "/bad/path.pem",
    };

    await expect(createMSTeamsApp(creds)).rejects.toThrow("Failed to read certificate file");
  });

  it("creates app with managed identity credentials", async () => {
    const creds: MSTeamsFederatedCredentials = {
      type: "federated",

      appId: "test-app-id",
      tenantId: "test-tenant",

      useManagedIdentity: true,
    };

    const app = await createMSTeamsApp(creds);
    expect(app).toBeDefined();
  });

  it("creates app with user-assigned managed identity", async () => {
    const creds: MSTeamsFederatedCredentials = {
      type: "federated",
      appId: "test-app-id",
      tenantId: "test-tenant",
      useManagedIdentity: true,
      managedIdentityClientId: "custom-mi-id",
    };

    const app = await createMSTeamsApp(creds);
    expect(app).toBeDefined();
  });

  it("throws when federated credentials lack certificate and managed identity", async () => {
    const creds: MSTeamsFederatedCredentials = {
      type: "federated",
      appId: "test-app-id",
      tenantId: "test-tenant",
    };

    await expect(createMSTeamsApp(creds)).rejects.toThrow(
      "Federated credentials require either a certificate path or managed identity",
    );
  });

  it("preserves both Teams SDK and OpenClaw User-Agent fragments", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };

    const app = await createMSTeamsApp(creds);
    const headers = (
      app as unknown as { client?: { options?: { headers?: Record<string, string> } } }
    ).client?.options?.headers;

    expect(headers?.["User-Agent"]).toMatch(/^teams\.ts\[apps\]\/\S+ OpenClaw\/\S+$/);
  });

  it("accepts custom messagingEndpoint", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };

    const app = await createMSTeamsApp(creds, {
      messagingEndpoint: "/custom/webhook",
    });
    expect(app).toBeDefined();
  });

  it("passes configured cloud and serviceUrl to the SDK App", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };

    const app = await createMSTeamsApp(creds, {
      cloud: "USGov",
      serviceUrl: "https://smba.infra.gov.teams.microsoft.us/teams/",
    });

    const internals = app as unknown as {
      api?: { serviceUrl?: string };
      cloud?: { botScope?: string; graphScope?: string };
    };
    expect(internals.api?.serviceUrl).toBe("https://smba.infra.gov.teams.microsoft.us/teams");
    expect(internals.cloud?.botScope).toBe("https://api.botframework.us/.default");
    expect(internals.cloud?.graphScope).toBe("https://graph.microsoft.us/.default");
  });

  it("passes China cloud to the SDK App without requiring a configured serviceUrl", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };

    const app = await createMSTeamsApp(creds, {
      cloud: "China",
    });

    const internals = app as unknown as {
      api?: { serviceUrl?: string };
      cloud?: { botScope?: string; graphScope?: string };
    };
    // @microsoft/teams.apps still gives app-level sends its public serviceUrl
    // default. OpenClaw proactive sends use stored reference serviceUrls instead.
    expect(internals.api?.serviceUrl).toBe("https://smba.trafficmanager.net/teams");
    expect(internals.cloud?.botScope).toBe("https://api.botframework.azure.cn/.default");
    expect(internals.cloud?.graphScope).toBe("https://microsoftgraph.chinacloudapi.cn/.default");
  });

  it("fails closed for Graph tokens when China cloud is configured", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };
    const app = await createMSTeamsApp(creds, { cloud: "China" });
    const tokenProvider = createMSTeamsTokenProvider(app);

    await expect(tokenProvider.getAccessToken("https://graph.microsoft.com")).rejects.toThrow(
      /Graph operations are not supported .*cloud=China/,
    );
  });

  it("rejects configured serviceUrls outside the Bot Framework allowlist", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };

    await expect(
      createMSTeamsApp(creds, {
        serviceUrl: "https://attacker.example.com/teams/",
      }),
    ).rejects.toThrow(/Blocked Microsoft Teams serviceUrl host: attacker\.example\.com/);
  });

  it("uses the configured cloud serviceUrl for proactive HTTP posts", async () => {
    const creds: MSTeamsCredentials = {
      type: "secret",
      appId: "test-app-id",
      appPassword: "test-secret",
      tenantId: "test-tenant",
    };
    const post = vi.fn(async () => ({ data: { id: "sent-1" } }));
    const httpClient = {
      request: vi.fn(),
      post,
      clone: vi.fn(() => httpClient),
    };

    const app = await createMSTeamsApp(creds, {
      cloud: "USGov",
      serviceUrl: "https://smba.infra.gov.teams.microsoft.us/teams",
      httpClient,
    });

    await app.send("19:conversation@thread.tacv2", { type: "message", text: "hello" });

    expect(post).toHaveBeenCalledWith(
      "https://smba.infra.gov.teams.microsoft.us/teams/v3/conversations/19:conversation@thread.tacv2/activities",
      expect.objectContaining({
        type: "message",
        text: "hello",
        conversation: { id: "19:conversation@thread.tacv2" },
      }),
    );
  });

  it("passes the OpenClaw User-Agent to the Bot Framework connector client", async () => {
    const creds = {
      appId: "app-id",
      appPassword: "secret",
      tenantId: "tenant-id",
    } satisfies MSTeamsCredentials;
    const sdk = createSdkStub();
    const app = new sdk.App({
      clientId: creds.appId,
      clientSecret: creds.appPassword,
      tenantId: creds.tenantId,
    });
    const adapter = createMSTeamsAdapter(app, sdk);

    await adapter.continueConversation(
      creds.appId,
      {
        serviceUrl: "https://service.example.com/",
        conversation: { id: "19:conversation@thread.tacv2" },
        channelId: "msteams",
      },
      async (ctx) => {
        await ctx.sendActivity("hello");
      },
    );

    expect(clientConstructorState.calls).toHaveLength(1);
    expect(clientConstructorState.calls[0]).toMatchObject({
      serviceUrl: "https://service.example.com/",
      options: {
        headers: {
          "User-Agent": expect.stringMatching(/^teams\.ts\[apps\]\/.+ OpenClaw\/.+$/),
        },
      },
    });
  });
});

describe("createBotFrameworkJwtValidator", () => {
  const creds = {
    appId: "app-id",
    appPassword: "secret",
    tenantId: "tenant-id",
  } satisfies MSTeamsCredentials;

  it("validates with legacy Bot Framework JWKS and issuer first", async () => {
    jwtValidatorState.behaviorByJwks.set(
      "https://login.botframework.com/v1/.well-known/keys",
      "success",
    );

    const validator = await createBotFrameworkJwtValidator(creds);
    await expect(validator.validate("Bearer token-1", "https://service.example.com")).resolves.toBe(
      true,
    );

    expect(jwtValidatorState.instances).toHaveLength(2);
    expect(jwtValidatorState.calls).toHaveLength(1);
    expect(jwtValidatorState.calls[0]).toMatchObject({
      jwksUri: "https://login.botframework.com/v1/.well-known/keys",
      token: "token-1",
      overrideOptions: {
        validateServiceUrl: { expectedServiceUrl: "https://service.example.com" },
      },
    });
  });

  it("falls back to Entra JWKS when Bot Framework validation fails", async () => {
    jwtValidatorState.behaviorByJwks.set(
      "https://login.botframework.com/v1/.well-known/keys",
      "null",
    );
    jwtValidatorState.behaviorByJwks.set(
      "https://login.microsoftonline.com/common/discovery/v2.0/keys",
      "success",
    );

    const validator = await createBotFrameworkJwtValidator(creds);
    await expect(validator.validate("Bearer token-2")).resolves.toBe(true);

    expect(jwtValidatorState.calls).toHaveLength(2);
    expect(jwtValidatorState.calls[0]?.jwksUri).toBe(
      "https://login.botframework.com/v1/.well-known/keys",
    );
    expect(jwtValidatorState.calls[1]?.jwksUri).toBe(
      "https://login.microsoftonline.com/common/discovery/v2.0/keys",
    );

    const entraConfig = jwtValidatorState.instances
      .map((instance) => instance.config)
      .find(
        (config) =>
          String((config.jwksUriOptions as { uri?: string })?.uri) ===
          "https://login.microsoftonline.com/common/discovery/v2.0/keys",
      );
    expect(entraConfig).toBeDefined();
    expect(entraConfig?.validateIssuer).toEqual({ allowedTenantIds: ["tenant-id"] });
  });

  it("falls back to Entra JWKS when Bot Framework validation throws", async () => {
    jwtValidatorState.behaviorByJwks.set(
      "https://login.botframework.com/v1/.well-known/keys",
      "throw",
    );
    jwtValidatorState.behaviorByJwks.set(
      "https://login.microsoftonline.com/common/discovery/v2.0/keys",
      "success",
    );

    const validator = await createBotFrameworkJwtValidator(creds);
    await expect(
      validator.validate("Bearer token-throw", "https://service.example.com"),
    ).resolves.toBe(true);

    expect(jwtValidatorState.calls).toHaveLength(2);
    expect(jwtValidatorState.calls[0]).toMatchObject({
      jwksUri: "https://login.botframework.com/v1/.well-known/keys",
      token: "token-throw",
      overrideOptions: {
        validateServiceUrl: { expectedServiceUrl: "https://service.example.com" },
      },
    });
    expect(jwtValidatorState.calls[1]).toMatchObject({
      jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
      token: "token-throw",
      overrideOptions: {
        validateServiceUrl: { expectedServiceUrl: "https://service.example.com" },
      },
    });
  });

  it("returns false when all validator paths fail", async () => {
    jwtValidatorState.behaviorByJwks.set(
      "https://login.botframework.com/v1/.well-known/keys",
      "throw",
    );

    const validator = await createBotFrameworkJwtValidator(creds);
    await expect(validator.validate("Bearer token-3")).resolves.toBe(false);
    expect(jwtValidatorState.calls).toHaveLength(2);
  });

  it("returns false for empty bearer token", async () => {
    const validator = await createBotFrameworkJwtValidator(creds);
    await expect(validator.validate("Bearer ")).resolves.toBe(false);
    expect(jwtValidatorState.calls).toHaveLength(0);
  });
});

describe("createMSTeamsTokenProvider", () => {
  function createMockApp() {
    return {
      tokenManager: {
        getBotToken: async () => ({ toString: () => "bot-token" }),
        getGraphToken: async () => ({ toString: () => "graph-token" }),
      },
    } as unknown as import("./sdk.js").MSTeamsApp;
  }

  it("returns bot token for bot framework scope", async () => {
    const app = createMockApp();
    const provider = createMSTeamsTokenProvider(app);

    const token = await provider.getAccessToken("https://api.botframework.com");
    expect(token).toBe("bot-token");
  });

  it("returns graph token for graph scope", async () => {
    const app = createMockApp();
    const provider = createMSTeamsTokenProvider(app);

    const token = await provider.getAccessToken("https://graph.microsoft.com");
    expect(token).toBe("graph-token");
  });

  it("returns empty string when token is null", async () => {
    const app = {
      tokenManager: {
        getBotToken: async () => null,
        getGraphToken: async () => null,
      },
    } as unknown as import("./sdk.js").MSTeamsApp;
    const provider = createMSTeamsTokenProvider(app);

    expect(await provider.getAccessToken("https://api.botframework.com")).toBe("");
    expect(await provider.getAccessToken("https://graph.microsoft.com")).toBe("");
  });
});
