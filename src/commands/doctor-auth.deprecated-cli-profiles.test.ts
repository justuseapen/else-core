// Doctor deprecated CLI profile tests cover legacy auth profile migration and warnings.
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/config.js";
import type { ProviderPlugin } from "../plugins/types.js";
<<<<<<< HEAD
import { captureEnv } from "../test-utils/env.js";
import {
  maybeRemoveDeprecatedCliAuthProfiles,
  maybeRepairLegacyOAuthProfileIds,
} from "./doctor-auth.js";
=======
import { maybeRepairLegacyOAuthProfileIds } from "./doctor-auth-legacy-oauth.js";
>>>>>>> upstream/main
import type { DoctorPrompter } from "./doctor-prompter.js";
import type { DoctorRepairMode } from "./doctor-repair-mode.js";

const resolvePluginProvidersMock = vi.fn<() => ProviderPlugin[]>(() => []);
<<<<<<< HEAD
=======
const authProfileStoreMock = vi.hoisted(() => ({
  store: { version: 1, profiles: {} } as AuthProfileStore,
}));
const repairMocks = vi.hoisted(() => ({
  repairOAuthProfileIdMismatch: vi.fn(),
}));
>>>>>>> upstream/main

vi.mock("../plugins/providers.runtime.js", () => ({
  resolvePluginProviders: () => resolvePluginProvidersMock(),
}));

<<<<<<< HEAD
let envSnapshot: ReturnType<typeof captureEnv>;
let tempAgentDir: string | undefined;
=======
vi.mock("../agents/auth-profiles/repair.js", () => ({
  repairOAuthProfileIdMismatch: repairMocks.repairOAuthProfileIdMismatch,
}));

vi.mock("../agents/auth-profiles/store.js", () => ({
  ensureAuthProfileStore: () => authProfileStoreMock.store,
}));

vi.mock("../../packages/terminal-core/src/note.js", () => ({
  note: vi.fn(),
}));
>>>>>>> upstream/main

function makePrompter(confirmValue: boolean): DoctorPrompter {
  const repairMode: DoctorRepairMode = {
    shouldRepair: confirmValue,
    shouldForce: false,
    nonInteractive: false,
    canPrompt: true,
    updateInProgress: false,
  };
  return {
    confirm: vi.fn().mockResolvedValue(confirmValue),
    confirmAutoFix: vi.fn().mockResolvedValue(confirmValue),
    confirmAggressiveAutoFix: vi.fn().mockResolvedValue(confirmValue),
    confirmRuntimeRepair: vi.fn().mockResolvedValue(confirmValue),
    select: vi.fn().mockResolvedValue(""),
    shouldRepair: repairMode.shouldRepair,
    shouldForce: repairMode.shouldForce,
    repairMode,
  };
}

<<<<<<< HEAD
beforeEach(() => {
  envSnapshot = captureEnv(["OPENCLAW_AGENT_DIR", "PI_CODING_AGENT_DIR"]);
  tempAgentDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-auth-"));
  process.env.OPENCLAW_AGENT_DIR = tempAgentDir;
  process.env.PI_CODING_AGENT_DIR = tempAgentDir;
  resolvePluginProvidersMock.mockReset();
  resolvePluginProvidersMock.mockReturnValue([]);
});

afterEach(() => {
  envSnapshot.restore();
  if (tempAgentDir) {
    fs.rmSync(tempAgentDir, { recursive: true, force: true });
    tempAgentDir = undefined;
=======
function requireAuthConfig(config: OpenClawConfig): NonNullable<OpenClawConfig["auth"]> {
  if (!config.auth) {
    throw new Error("expected repaired auth config");
>>>>>>> upstream/main
  }
  return config.auth;
}

function requireFirstMockArg<T>(mock: { mock: { calls: T[][] } }, label: string): T {
  const call = mock.mock.calls[0];
  if (!call) {
    throw new Error(`expected ${label} call`);
  }
  const [arg] = call;
  return arg;
}

beforeEach(() => {
  resolvePluginProvidersMock.mockReset();
  resolvePluginProvidersMock.mockReturnValue([]);
  authProfileStoreMock.store = { version: 1, profiles: {} };
  repairMocks.repairOAuthProfileIdMismatch.mockReset();
  repairMocks.repairOAuthProfileIdMismatch.mockReturnValue({
    config: {},
    changes: [],
    migrated: false,
  });
});

<<<<<<< HEAD
describe("maybeRemoveDeprecatedCliAuthProfiles", () => {
  it("removes deprecated CLI auth profiles from store + config", async () => {
    if (!tempAgentDir) {
      throw new Error("Missing temp agent dir");
    }
    const authPath = path.join(tempAgentDir, "auth-profiles.json");
    fs.writeFileSync(
      authPath,
      `${JSON.stringify(
        {
          version: 1,
          profiles: {
            "anthropic:removed-cli": {
              type: "oauth",
              provider: "anthropic",
              access: "token-a",
              refresh: "token-r",
              expires: Date.now() + 60_000,
            },
            "openai-codex:codex-cli": {
              type: "oauth",
              provider: "openai-codex",
              access: "token-b",
              refresh: "token-r2",
              expires: Date.now() + 60_000,
            },
            "openai-codex:default": {
              type: "oauth",
              provider: "openai-codex",
              access: "token-c",
              refresh: "token-r3",
              expires: Date.now() + 60_000,
            },
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    resolvePluginProvidersMock.mockReturnValue([
      {
        id: "anthropic",
        label: "Anthropic",
        auth: [],
        deprecatedProfileIds: ["anthropic:removed-cli"],
      },
      {
        id: "openai-codex",
        label: "OpenAI Codex",
        auth: [],
        deprecatedProfileIds: ["openai-codex:codex-cli"],
      },
    ]);

    const cfg = {
      auth: {
        profiles: {
          "anthropic:removed-cli": { provider: "anthropic", mode: "oauth" },
          "openai-codex:codex-cli": { provider: "openai-codex", mode: "oauth" },
          "openai-codex:default": { provider: "openai-codex", mode: "oauth" },
        },
        order: {
          anthropic: ["anthropic:removed-cli"],
          "openai-codex": ["openai-codex:codex-cli", "openai-codex:default"],
=======
describe("maybeRepairLegacyOAuthProfileIds", () => {
  it("skips provider loading when config has no legacy OAuth profiles", async () => {
    const cfg = { channels: { telegram: { enabled: true } } } as OpenClawConfig;

    const next = await maybeRepairLegacyOAuthProfileIds(cfg, makePrompter(true));

    expect(next).toBe(cfg);
    expect(resolvePluginProvidersMock).not.toHaveBeenCalled();
    expect(repairMocks.repairOAuthProfileIdMismatch).not.toHaveBeenCalled();
  });

  it("repairs provider-owned legacy OAuth profile ids", async () => {
    authProfileStoreMock.store = {
      version: 1,
      profiles: {
        "anthropic:user@example.com": {
          type: "oauth",
          provider: "anthropic",
          access: "token-a",
          refresh: "token-r",
          expires: Date.now() + 60_000,
          email: "user@example.com",
>>>>>>> upstream/main
        },
      },
      lastGood: {
        anthropic: "anthropic:user@example.com",
      },
    };

    resolvePluginProvidersMock.mockReturnValue([
      {
        id: "anthropic",
        label: "Anthropic",
        auth: [],
        oauthProfileIdRepairs: [{ legacyProfileId: "anthropic:default" }],
      },
    ]);
    repairMocks.repairOAuthProfileIdMismatch.mockReturnValue({
      migrated: true,
      changes: ["Auth: migrate anthropic:default → anthropic:user@example.com"],
      config: {
        auth: {
          profiles: {
            "anthropic:user@example.com": {
              provider: "anthropic",
              mode: "oauth",
              email: "user@example.com",
            },
          },
          order: {
            anthropic: ["anthropic:user@example.com"],
          },
        },
      },
    });

    const next = await maybeRepairLegacyOAuthProfileIds(
      {
        auth: {
          profiles: {
            "anthropic:default": { provider: "anthropic", mode: "oauth" },
          },
          order: {
            anthropic: ["anthropic:default"],
          },
        },
      } as OpenClawConfig,
      makePrompter(true),
    );

    expect(repairMocks.repairOAuthProfileIdMismatch).toHaveBeenCalledOnce();
    const repairCall = requireFirstMockArg(
      repairMocks.repairOAuthProfileIdMismatch,
      "OAuth profile repair",
    ) as {
      cfg?: OpenClawConfig;
      store?: AuthProfileStore;
      provider?: unknown;
      legacyProfileId?: unknown;
    };
<<<<<<< HEAD
    expect(raw.profiles?.["anthropic:removed-cli"]).toBeUndefined();
    expect(raw.profiles?.["openai-codex:codex-cli"]).toBeUndefined();
    expect(raw.profiles?.["openai-codex:default"]).toBeDefined();

    expect(next.auth?.profiles?.["anthropic:removed-cli"]).toBeUndefined();
    expect(next.auth?.profiles?.["openai-codex:codex-cli"]).toBeUndefined();
    expect(next.auth?.profiles?.["openai-codex:default"]).toBeDefined();
    expect(next.auth?.order?.anthropic).toBeUndefined();
    expect(next.auth?.order?.["openai-codex"]).toEqual(["openai-codex:default"]);
=======
    expect(repairCall.cfg?.auth?.profiles?.["anthropic:default"]).toEqual({
      provider: "anthropic",
      mode: "oauth",
    });
    expect(repairCall.store).toBe(authProfileStoreMock.store);
    expect(repairCall.provider).toBe("anthropic");
    expect(repairCall.legacyProfileId).toBe("anthropic:default");
    const auth = requireAuthConfig(next);
    expect(auth.profiles?.["anthropic:default"]).toBeUndefined();
    const repairedProfile = auth.profiles?.["anthropic:user@example.com"];
    expect(repairedProfile?.provider).toBe("anthropic");
    expect(repairedProfile?.mode).toBe("oauth");
    expect(repairedProfile?.email).toBe("user@example.com");
    expect(auth.order?.anthropic).toEqual(["anthropic:user@example.com"]);
  });

  it("strips provider-controlled terminal escapes from repair prompts", async () => {
    authProfileStoreMock.store = {
      version: 1,
      profiles: {
        "anthropic:user@example.com": {
          type: "oauth",
          provider: "anthropic",
          access: "token-a",
          refresh: "token-r",
          expires: Date.now() + 60_000,
          email: "user@example.com",
        },
      },
    };

    resolvePluginProvidersMock.mockReturnValue([
      {
        id: "anthropic",
        label: "\u001b[31mAnthropic\u001b[0m",
        auth: [],
        oauthProfileIdRepairs: [
          { legacyProfileId: "anthropic:default", promptLabel: "\u001b[2JBad\u0007 Label" },
        ],
      },
    ]);
    repairMocks.repairOAuthProfileIdMismatch.mockReturnValue({
      migrated: true,
      changes: ["Auth: migrate anthropic:default to anthropic:user@example.com"],
      config: { auth: { profiles: {} } },
    });

    const prompter = makePrompter(true);
    await maybeRepairLegacyOAuthProfileIds(
      {
        auth: {
          profiles: {
            "anthropic:default": { provider: "anthropic", mode: "oauth" },
          },
        },
      } as OpenClawConfig,
      prompter,
    );

    expect(prompter.confirm).toHaveBeenCalledWith({
      message: "Update Bad Label OAuth profile id in config now?",
      initialValue: true,
    });
>>>>>>> upstream/main
  });
});

describe("maybeRepairLegacyOAuthProfileIds", () => {
  it("repairs provider-owned legacy OAuth profile ids", async () => {
    if (!tempAgentDir) {
      throw new Error("Missing temp agent dir");
    }
    const authPath = path.join(tempAgentDir, "auth-profiles.json");
    fs.writeFileSync(
      authPath,
      `${JSON.stringify(
        {
          version: 1,
          profiles: {
            "anthropic:user@example.com": {
              type: "oauth",
              provider: "anthropic",
              access: "token-a",
              refresh: "token-r",
              expires: Date.now() + 60_000,
              email: "user@example.com",
            },
          },
          lastGood: {
            anthropic: "anthropic:user@example.com",
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    resolvePluginProvidersMock.mockReturnValue([
      {
        id: "anthropic",
        label: "Anthropic",
        auth: [],
        oauthProfileIdRepairs: [{ legacyProfileId: "anthropic:default" }],
      },
    ]);

    const next = await maybeRepairLegacyOAuthProfileIds(
      {
        auth: {
          profiles: {
            "anthropic:default": { provider: "anthropic", mode: "oauth" },
          },
          order: {
            anthropic: ["anthropic:default"],
          },
        },
      } as OpenClawConfig,
      makePrompter(true),
    );

    expect(next.auth?.profiles?.["anthropic:default"]).toBeUndefined();
    expect(next.auth?.profiles?.["anthropic:user@example.com"]).toMatchObject({
      provider: "anthropic",
      mode: "oauth",
      email: "user@example.com",
    });
    expect(next.auth?.order?.anthropic).toEqual(["anthropic:user@example.com"]);
  });
});
