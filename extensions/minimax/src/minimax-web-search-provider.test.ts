<<<<<<< HEAD
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { __testing } from "./minimax-web-search-provider.js";
=======
// Minimax tests cover minimax web search provider plugin behavior.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { minimaxWebSearchTesting } from "../test-api.js";
>>>>>>> upstream/main

const {
  MINIMAX_SEARCH_ENDPOINT_GLOBAL,
  MINIMAX_SEARCH_ENDPOINT_CN,
  resolveMiniMaxApiKey,
  resolveMiniMaxEndpoint,
  resolveMiniMaxRegion,
<<<<<<< HEAD
} = __testing;
=======
  readMiniMaxSearchJsonResponse,
} = minimaxWebSearchTesting;

function restoreEnvValue(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
>>>>>>> upstream/main

describe("minimax web search provider", () => {
  const originalApiHost = process.env.MINIMAX_API_HOST;
  const originalCodePlanKey = process.env.MINIMAX_CODE_PLAN_KEY;
  const originalCodingApiKey = process.env.MINIMAX_CODING_API_KEY;
<<<<<<< HEAD
=======
  const originalOauthToken = process.env.MINIMAX_OAUTH_TOKEN;
>>>>>>> upstream/main
  const originalApiKey = process.env.MINIMAX_API_KEY;

  beforeEach(() => {
    delete process.env.MINIMAX_API_HOST;
    delete process.env.MINIMAX_CODE_PLAN_KEY;
    delete process.env.MINIMAX_CODING_API_KEY;
<<<<<<< HEAD
=======
    delete process.env.MINIMAX_OAUTH_TOKEN;
>>>>>>> upstream/main
    delete process.env.MINIMAX_API_KEY;
  });

  afterEach(() => {
<<<<<<< HEAD
    process.env.MINIMAX_API_HOST = originalApiHost;
    process.env.MINIMAX_CODE_PLAN_KEY = originalCodePlanKey;
    process.env.MINIMAX_CODING_API_KEY = originalCodingApiKey;
    process.env.MINIMAX_API_KEY = originalApiKey;
=======
    restoreEnvValue("MINIMAX_API_HOST", originalApiHost);
    restoreEnvValue("MINIMAX_CODE_PLAN_KEY", originalCodePlanKey);
    restoreEnvValue("MINIMAX_CODING_API_KEY", originalCodingApiKey);
    restoreEnvValue("MINIMAX_OAUTH_TOKEN", originalOauthToken);
    restoreEnvValue("MINIMAX_API_KEY", originalApiKey);
>>>>>>> upstream/main
  });

  describe("resolveMiniMaxRegion", () => {
    it("returns global by default", () => {
      expect(resolveMiniMaxRegion()).toBe("global");
      expect(resolveMiniMaxRegion({})).toBe("global");
    });

    it("returns cn when explicit region is cn", () => {
      expect(resolveMiniMaxRegion({ minimax: { region: "cn" } })).toBe("cn");
    });

    it("returns global when explicit region is not cn", () => {
      expect(resolveMiniMaxRegion({ minimax: { region: "global" } })).toBe("global");
      expect(resolveMiniMaxRegion({ minimax: { region: "us" } })).toBe("global");
    });

    it("infers cn from MINIMAX_API_HOST", () => {
      process.env.MINIMAX_API_HOST = "https://api.minimaxi.com/anthropic";
      expect(resolveMiniMaxRegion()).toBe("cn");
    });

    it("infers cn from model provider base URL", () => {
      const cnConfig = {
        models: {
          providers: {
            minimax: { baseUrl: "https://api.minimaxi.com/anthropic" },
          },
        },
      };
      expect(resolveMiniMaxRegion({}, cnConfig)).toBe("cn");
    });

    it("infers cn from minimax-portal base URL (OAuth CN path)", () => {
      const cnPortalConfig = {
        models: {
          providers: {
            "minimax-portal": { baseUrl: "https://api.minimaxi.com/anthropic" },
          },
        },
      };
      expect(resolveMiniMaxRegion({}, cnPortalConfig)).toBe("cn");
    });

    it("returns global when model provider base URL is global", () => {
      const globalConfig = {
        models: {
          providers: {
            minimax: { baseUrl: "https://api.minimax.io/anthropic" },
          },
        },
      };
      expect(resolveMiniMaxRegion({}, globalConfig)).toBe("global");
    });

    it("explicit search config region takes priority over base URL", () => {
      const cnConfig = {
        models: {
          providers: {
            minimax: { baseUrl: "https://api.minimaxi.com/anthropic" },
          },
        },
      };
      // Explicit global region overrides CN base URL
      expect(resolveMiniMaxRegion({ minimax: { region: "global" } }, cnConfig)).toBe("global");
    });

    it("handles non-object minimax search config gracefully", () => {
      expect(resolveMiniMaxRegion({ minimax: "invalid" })).toBe("global");
      expect(resolveMiniMaxRegion({ minimax: null })).toBe("global");
      expect(resolveMiniMaxRegion({ minimax: [1, 2] })).toBe("global");
    });
  });

  describe("resolveMiniMaxEndpoint", () => {
    it("returns global endpoint by default", () => {
      expect(resolveMiniMaxEndpoint()).toBe(MINIMAX_SEARCH_ENDPOINT_GLOBAL);
    });

    it("returns CN endpoint when region is cn", () => {
      expect(resolveMiniMaxEndpoint({ minimax: { region: "cn" } })).toBe(
        MINIMAX_SEARCH_ENDPOINT_CN,
      );
    });

    it("returns CN endpoint when inferred from model provider base URL", () => {
      const cnConfig = {
        models: {
          providers: {
            minimax: { baseUrl: "https://api.minimaxi.com/anthropic" },
          },
        },
      };
      expect(resolveMiniMaxEndpoint({}, cnConfig)).toBe(MINIMAX_SEARCH_ENDPOINT_CN);
    });
  });

  describe("resolveMiniMaxApiKey", () => {
    it("prefers configured apiKey over env vars", () => {
      process.env.MINIMAX_CODE_PLAN_KEY = "env-key";
      expect(resolveMiniMaxApiKey({ apiKey: "configured-key" })).toBe("configured-key");
    });

<<<<<<< HEAD
    it("accepts MINIMAX_CODING_API_KEY as a coding-plan alias", () => {
=======
    it("accepts MINIMAX_CODING_API_KEY as a token-plan alias", () => {
>>>>>>> upstream/main
      process.env.MINIMAX_CODING_API_KEY = "coding-key";
      expect(resolveMiniMaxApiKey()).toBe("coding-key");
    });

    it("falls back to MINIMAX_API_KEY last", () => {
      process.env.MINIMAX_API_KEY = "plain-key";
      expect(resolveMiniMaxApiKey()).toBe("plain-key");
    });
<<<<<<< HEAD
=======

    it("accepts MINIMAX_OAUTH_TOKEN before the legacy API-key fallback", () => {
      process.env.MINIMAX_OAUTH_TOKEN = "oauth-token";
      process.env.MINIMAX_API_KEY = "plain-key";
      expect(resolveMiniMaxApiKey()).toBe("oauth-token");
    });
>>>>>>> upstream/main
  });

  describe("endpoint constants", () => {
    it("uses correct global endpoint", () => {
      expect(MINIMAX_SEARCH_ENDPOINT_GLOBAL).toBe("https://api.minimax.io/v1/coding_plan/search");
    });

    it("uses correct CN endpoint", () => {
      expect(MINIMAX_SEARCH_ENDPOINT_CN).toBe("https://api.minimaxi.com/v1/coding_plan/search");
    });
  });
<<<<<<< HEAD
=======

  it("reports malformed Search API JSON with a stable provider error", async () => {
    await expect(
      readMiniMaxSearchJsonResponse(new Response("{ nope"), "MiniMax Search API error"),
    ).rejects.toThrow("MiniMax Search API error: malformed JSON response");
  });
>>>>>>> upstream/main
});
