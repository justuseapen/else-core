<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import type { AuthProfileStore } from "../agents/auth-profiles.js";
import type { OpenClawConfig } from "../config/config.js";
import { prepareSecretsRuntimeSnapshot } from "./runtime.js";

function withAuthProfileMode(mode: "api_key" | "oauth" | "token"): OpenClawConfig {
=======
/** Tests OAuth policy handling while collecting auth-profile secrets. */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
  loadAuthStoreWithProfiles,
  setupSecretsRuntimeSnapshotTestHooks,
} from "./runtime.test-support.ts";

const { prepareSecretsRuntimeSnapshot } = setupSecretsRuntimeSnapshotTestHooks();

function withAuthProfileMode(mode: "api_key" | "aws-sdk" | "oauth" | "token"): OpenClawConfig {
>>>>>>> upstream/main
  return {
    auth: {
      profiles: {
        "anthropic:default": {
          provider: "anthropic",
          mode,
        },
      },
    },
    secrets: {
      providers: {
        default: { source: "env" },
      },
    },
  } as OpenClawConfig;
}

describe("secrets runtime oauth auth-profile SecretRef policy", () => {
  it("fails startup snapshot when oauth mode profile uses token SecretRef", async () => {
<<<<<<< HEAD
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        "anthropic:default": {
          type: "token",
          provider: "anthropic",
          tokenRef: { source: "env", provider: "default", id: "ANTHROPIC_TOKEN" },
        },
      },
    };
=======
    const store = loadAuthStoreWithProfiles({
      "anthropic:default": {
        type: "token",
        provider: "anthropic",
        tokenRef: { source: "env", provider: "default", id: "ANTHROPIC_TOKEN" },
      },
    });
>>>>>>> upstream/main

    await expect(
      prepareSecretsRuntimeSnapshot({
        config: withAuthProfileMode("oauth"),
        env: { ANTHROPIC_TOKEN: "token-value" } as NodeJS.ProcessEnv,
        loadAuthStore: () => store,
        loadablePluginOrigins: new Map(),
        agentDirs: ["/tmp/openclaw-secrets-runtime-main"],
      }),
    ).rejects.toThrow(/OAuth \+ SecretRef is not supported/i);
  });

  it("keeps token SecretRef support when the profile mode is token", async () => {
<<<<<<< HEAD
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        "anthropic:default": {
          type: "token",
          provider: "anthropic",
          tokenRef: { source: "env", provider: "default", id: "ANTHROPIC_TOKEN" },
        },
      },
    };
=======
    const store = loadAuthStoreWithProfiles({
      "anthropic:default": {
        type: "token",
        provider: "anthropic",
        tokenRef: { source: "env", provider: "default", id: "ANTHROPIC_TOKEN" },
      },
    });
>>>>>>> upstream/main

    const snapshot = await prepareSecretsRuntimeSnapshot({
      config: withAuthProfileMode("token"),
      env: { ANTHROPIC_TOKEN: "token-value" } as NodeJS.ProcessEnv,
      loadAuthStore: () => store,
      loadablePluginOrigins: new Map(),
      agentDirs: ["/tmp/openclaw-secrets-runtime-main"],
    });

    const resolved = snapshot.authStores[0]?.store.profiles["anthropic:default"];
<<<<<<< HEAD
    expect(resolved).toMatchObject({
      type: "token",
      token: "token-value",
    });
=======
    expect(resolved?.type).toBe("token");
    if (resolved?.type !== "token") {
      throw new Error("expected token auth profile");
    }
    expect(resolved?.token).toBe("token-value");
>>>>>>> upstream/main
  });
});
