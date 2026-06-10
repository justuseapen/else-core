<<<<<<< HEAD
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ensureAuthProfileStore } from "../agents/auth-profiles.js";
import { loadConfig, writeConfigFile } from "../config/config.js";
import { withTempHome } from "../config/home-env.test-harness.js";
import { withEnvAsync } from "../test-utils/env.js";
import {
  asConfig,
  beginSecretsRuntimeIsolationForTest,
  createOpenAIFileRuntimeConfig,
  createOpenAIFileRuntimeFixture,
  EMPTY_LOADABLE_PLUGIN_ORIGINS,
  endSecretsRuntimeIsolationForTest,
  expectResolvedOpenAIRuntime,
  loadAuthStoreWithProfiles,
  OPENAI_ENV_KEY_REF,
  OPENAI_FILE_KEY_REF,
=======
/** Integration tests for auth-profile secret runtime preparation. */
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthProfileStore } from "../agents/auth-profiles.js";
import { withTempHome } from "../config/home-env.test-harness.js";
import {
  asConfig,
  beginSecretsRuntimeIsolationForTest,
  EMPTY_LOADABLE_PLUGIN_ORIGINS,
  endSecretsRuntimeIsolationForTest,
  OPENAI_ENV_KEY_REF,
>>>>>>> upstream/main
  type SecretsRuntimeEnvSnapshot,
} from "./runtime-auth.integration.test-helpers.js";
import {
  activateSecretsRuntimeSnapshot,
  getActiveSecretsRuntimeSnapshot,
  prepareSecretsRuntimeSnapshot,
} from "./runtime.js";

vi.unmock("../version.js");

<<<<<<< HEAD
=======
vi.mock("./runtime-prepare.runtime.js", () => ({
  createResolverContext: ({
    sourceConfig,
    env,
  }: {
    sourceConfig: unknown;
    env: NodeJS.ProcessEnv;
  }) => ({
    sourceConfig,
    env,
    cache: {},
    warnings: [],
    warningKeys: new Set<string>(),
    assignments: [],
  }),
  collectConfigAssignments: () => {},
  collectAuthStoreAssignments: ({
    store,
    context,
  }: {
    store: AuthProfileStore;
    context: { env: NodeJS.ProcessEnv };
  }) => {
    for (const profile of Object.values(store.profiles)) {
      if (
        profile?.type === "api_key" &&
        profile.keyRef?.source === "env" &&
        typeof profile.keyRef.id === "string"
      ) {
        const key = context.env[profile.keyRef.id];
        if (typeof key === "string" && key.length > 0) {
          profile.key = key;
        }
      }
    }
  },
  resolveSecretRefValues: async () => new Map(),
  applyResolvedAssignments: () => {},
  resolveRuntimeWebTools: async () => ({
    search: { providerSource: "none", diagnostics: [] },
    fetch: { providerSource: "none", diagnostics: [] },
    diagnostics: [],
  }),
}));

function loadAuthStoreFromTestFile(agentDir?: string): AuthProfileStore {
  if (!agentDir) {
    return { version: 1, profiles: {} };
  }
  try {
    const raw = readFileSync(path.join(agentDir, "auth-profiles.json"), "utf8");
    return JSON.parse(raw) as AuthProfileStore;
  } catch {
    return { version: 1, profiles: {} };
  }
}

>>>>>>> upstream/main
describe("secrets runtime snapshot auth integration", () => {
  let envSnapshot: SecretsRuntimeEnvSnapshot;

  beforeEach(() => {
    envSnapshot = beginSecretsRuntimeIsolationForTest();
  });

  afterEach(() => {
    endSecretsRuntimeIsolationForTest(envSnapshot);
  });

<<<<<<< HEAD
  it("activates runtime snapshots for loadConfig and ensureAuthProfileStore", async () => {
    await withEnvAsync(
      {
        OPENCLAW_BUNDLED_PLUGINS_DIR: undefined,
        OPENCLAW_DISABLE_PLUGIN_DISCOVERY_CACHE: "1",
        OPENCLAW_VERSION: undefined,
      },
      async () => {
        const prepared = await prepareSecretsRuntimeSnapshot({
          config: asConfig({
            models: {
              providers: {
                openai: {
                  baseUrl: "https://api.openai.com/v1",
                  apiKey: OPENAI_ENV_KEY_REF,
                  models: [],
                },
              },
            },
          }),
          env: { OPENAI_API_KEY: "sk-runtime" },
          agentDirs: ["/tmp/openclaw-agent-main"],
          loadablePluginOrigins: EMPTY_LOADABLE_PLUGIN_ORIGINS,
          loadAuthStore: () =>
            loadAuthStoreWithProfiles({
              "openai:default": {
                type: "api_key",
                provider: "openai",
                keyRef: OPENAI_ENV_KEY_REF,
              },
            }),
        });

        activateSecretsRuntimeSnapshot(prepared);

        expect(loadConfig().models?.providers?.openai?.apiKey).toBe("sk-runtime");
        expect(
          ensureAuthProfileStore("/tmp/openclaw-agent-main").profiles["openai:default"],
        ).toMatchObject({
          type: "api_key",
          key: "sk-runtime",
        });
      },
    );
  });

  it("keeps active secrets runtime snapshots resolved after config writes", async () => {
    if (os.platform() === "win32") {
      return;
    }
    await withTempHome("openclaw-secrets-runtime-write-", async (home) => {
      const { secretFile, agentDir } = await createOpenAIFileRuntimeFixture(home);

      const prepared = await prepareSecretsRuntimeSnapshot({
        config: createOpenAIFileRuntimeConfig(secretFile),
        agentDirs: [agentDir],
        loadablePluginOrigins: EMPTY_LOADABLE_PLUGIN_ORIGINS,
      });

      activateSecretsRuntimeSnapshot(prepared);

      expectResolvedOpenAIRuntime(agentDir);

      await writeConfigFile({
        ...loadConfig(),
        gateway: { auth: { mode: "token" } },
      });

      expect(loadConfig().gateway?.auth).toEqual({ mode: "token" });
      expectResolvedOpenAIRuntime(agentDir);
    });
  });

  it("keeps last-known-good runtime snapshot active when refresh fails after a write", async () => {
    if (os.platform() === "win32") {
      return;
    }
    await withTempHome("openclaw-secrets-runtime-refresh-fail-", async (home) => {
      const { secretFile, agentDir } = await createOpenAIFileRuntimeFixture(home);

      let loadAuthStoreCalls = 0;
      const loadAuthStore = () => {
        loadAuthStoreCalls += 1;
        if (loadAuthStoreCalls > 1) {
          throw new Error("simulated secrets runtime refresh failure");
        }
        return loadAuthStoreWithProfiles({
          "openai:default": {
            type: "api_key",
            provider: "openai",
            keyRef: OPENAI_FILE_KEY_REF,
          },
        });
      };

      const prepared = await prepareSecretsRuntimeSnapshot({
        config: createOpenAIFileRuntimeConfig(secretFile),
        agentDirs: [agentDir],
        loadablePluginOrigins: EMPTY_LOADABLE_PLUGIN_ORIGINS,
        loadAuthStore,
      });

      activateSecretsRuntimeSnapshot(prepared);

      await expect(
        writeConfigFile({
          ...loadConfig(),
          gateway: { auth: { mode: "token" } },
        }),
      ).rejects.toThrow(
        /runtime snapshot refresh failed: simulated secrets runtime refresh failure/i,
      );

      const activeAfterFailure = getActiveSecretsRuntimeSnapshot();
      expect(activeAfterFailure).not.toBeNull();
      expect(loadConfig().gateway?.auth).toBeUndefined();
      expectResolvedOpenAIRuntime(agentDir);
      expect(activeAfterFailure?.sourceConfig.models?.providers?.openai?.apiKey).toEqual(
        OPENAI_FILE_KEY_REF,
      );
    });
  });

=======
>>>>>>> upstream/main
  it("recomputes config-derived agent dirs when refreshing active secrets runtime snapshots", async () => {
    await withTempHome("openclaw-secrets-runtime-agent-dirs-", async (home) => {
      const mainAgentDir = path.join(home, ".openclaw", "agents", "main", "agent");
      const opsAgentDir = path.join(home, ".openclaw", "agents", "ops", "agent");
      await fs.mkdir(mainAgentDir, { recursive: true });
      await fs.mkdir(opsAgentDir, { recursive: true });
      await fs.writeFile(
        path.join(mainAgentDir, "auth-profiles.json"),
        `${JSON.stringify(
          {
            version: 1,
            profiles: {
              "openai:default": {
                type: "api_key",
                provider: "openai",
                keyRef: OPENAI_ENV_KEY_REF,
              },
            },
          },
          null,
          2,
        )}\n`,
        { encoding: "utf8", mode: 0o600 },
      );
      await fs.writeFile(
        path.join(opsAgentDir, "auth-profiles.json"),
        `${JSON.stringify(
          {
            version: 1,
            profiles: {
              "anthropic:ops": {
                type: "api_key",
                provider: "anthropic",
                keyRef: { source: "env", provider: "default", id: "ANTHROPIC_API_KEY" },
              },
            },
          },
          null,
          2,
        )}\n`,
        { encoding: "utf8", mode: 0o600 },
      );

      const prepared = await prepareSecretsRuntimeSnapshot({
        config: asConfig({}),
        env: {
          OPENAI_API_KEY: "sk-main-runtime",
          ANTHROPIC_API_KEY: "sk-ops-runtime",
        },
<<<<<<< HEAD
=======
        loadAuthStore: loadAuthStoreFromTestFile,
>>>>>>> upstream/main
        loadablePluginOrigins: EMPTY_LOADABLE_PLUGIN_ORIGINS,
      });

      activateSecretsRuntimeSnapshot(prepared);
<<<<<<< HEAD
      expect(ensureAuthProfileStore(opsAgentDir).profiles["anthropic:ops"]).toBeUndefined();

      await writeConfigFile({
        agents: {
          list: [{ id: "ops", agentDir: opsAgentDir }],
        },
      });

      expect(ensureAuthProfileStore(opsAgentDir).profiles["anthropic:ops"]).toMatchObject({
        type: "api_key",
        key: "sk-ops-runtime",
        keyRef: { source: "env", provider: "default", id: "ANTHROPIC_API_KEY" },
=======
      expect(
        getActiveSecretsRuntimeSnapshot()?.authStores.find(
          (entry) => entry.agentDir === opsAgentDir,
        ),
      ).toBeUndefined();

      const refreshed = await prepareSecretsRuntimeSnapshot({
        config: asConfig({
          agents: {
            list: [{ id: "ops", agentDir: opsAgentDir }],
          },
        }),
        env: {
          OPENAI_API_KEY: "sk-main-runtime",
          ANTHROPIC_API_KEY: "sk-ops-runtime",
        },
        loadAuthStore: loadAuthStoreFromTestFile,
        loadablePluginOrigins: EMPTY_LOADABLE_PLUGIN_ORIGINS,
      });
      activateSecretsRuntimeSnapshot(refreshed);

      const profile = getActiveSecretsRuntimeSnapshot()?.authStores.find(
        (entry) => entry.agentDir === opsAgentDir,
      )?.store.profiles["anthropic:ops"];
      expect(profile?.type).toBe("api_key");
      if (profile?.type !== "api_key") {
        throw new Error("Expected anthropic ops API key profile");
      }
      expect(profile.key).toBe("sk-ops-runtime");
      expect(profile.keyRef).toEqual({
        source: "env",
        provider: "default",
        id: "ANTHROPIC_API_KEY",
>>>>>>> upstream/main
      });
    });
  });
});
