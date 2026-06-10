<<<<<<< HEAD
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { DEFAULT_ACCOUNT_ID, type OpenClawConfig } from "openclaw/plugin-sdk/setup";
import { beforeEach, describe, expect, it, vi } from "vitest";
=======
// Whatsapp tests cover setup surface plugin behavior.
>>>>>>> upstream/main
import {
  createPluginSetupWizardStatus,
  createQueuedWizardPrompter,
  runSetupWizardFinalize,
<<<<<<< HEAD
} from "../../../test/helpers/plugins/setup-wizard.js";
import { whatsappSetupPlugin } from "./channel.setup.js";
import { whatsappSetupWizard } from "./setup-surface.js";
=======
} from "openclaw/plugin-sdk/plugin-test-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { DEFAULT_ACCOUNT_ID, type OpenClawConfig } from "openclaw/plugin-sdk/setup";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { whatsappSetupWizard } from "./setup-surface.js";
import {
  createWhatsAppAllowlistModeInput,
  createWhatsAppLinkingHarness,
  createWhatsAppOwnerAllowlistHarness,
  createWhatsAppPersonalPhoneHarness,
  createWhatsAppRootAllowFromConfig,
  createWhatsAppWorkAccountConfig,
  expectNoWhatsAppLoginFollowup,
  expectWhatsAppAllowlistModeSetup,
  expectWhatsAppLoginFollowup,
  expectWhatsAppOpenPolicySetup,
  expectWhatsAppOwnerAllowlistSetup,
  expectWhatsAppPersonalPhoneSetup,
  expectWhatsAppSeparatePhoneDisabledSetup,
  expectWhatsAppWorkAccountAccessNote,
  expectWhatsAppWorkAccountOpenAccess,
} from "./setup-test-helpers.js";
>>>>>>> upstream/main

const hoisted = vi.hoisted(() => ({
  detectWhatsAppLinked: vi.fn<(cfg: OpenClawConfig, accountId: string) => Promise<boolean>>(
    async () => false,
  ),
<<<<<<< HEAD
  loginWeb: vi.fn(async () => {}),
  pathExists: vi.fn(async () => false),
  resolveWhatsAppAuthDir: vi.fn(() => ({
=======
  hasWebCredsSync: vi.fn(() => false),
  loginWeb: vi.fn(async () => {}),
  pathExists: vi.fn(async () => false),
  readWebAuthState: vi.fn<(authDir: string) => Promise<"linked" | "not-linked" | "unstable">>(
    async () => "not-linked",
  ),
  resolveWhatsAppAuthDir: vi.fn<
    (params: { cfg: OpenClawConfig; accountId: string }) => { authDir: string }
  >(() => ({
>>>>>>> upstream/main
    authDir: "/tmp/openclaw-whatsapp-test",
  })),
}));

vi.mock("./login.js", () => ({
  loginWeb: hoisted.loginWeb,
}));

vi.mock("./setup-finalize.js", async () => {
  const actual = await vi.importActual<typeof import("./setup-finalize.js")>("./setup-finalize.js");
  return {
    ...actual,
    detectWhatsAppLinked: hoisted.detectWhatsAppLinked,
  };
});

<<<<<<< HEAD
=======
vi.mock("./creds-files.js", async () => {
  const actual = await vi.importActual<typeof import("./creds-files.js")>("./creds-files.js");
  return {
    ...actual,
    hasWebCredsSync: hoisted.hasWebCredsSync,
  };
});

>>>>>>> upstream/main
vi.mock("openclaw/plugin-sdk/setup", async () => {
  const actual = await vi.importActual<typeof import("openclaw/plugin-sdk/setup")>(
    "openclaw/plugin-sdk/setup",
  );
  return {
    ...actual,
    pathExists: hoisted.pathExists,
  };
});

vi.mock("./accounts.js", async () => {
  const actual = await vi.importActual<typeof import("./accounts.js")>("./accounts.js");
<<<<<<< HEAD
  return {
    ...actual,
    resolveWhatsAppAuthDir: hoisted.resolveWhatsAppAuthDir,
  };
});

function createRuntime(): RuntimeEnv {
  return {
    error: vi.fn(),
  } as unknown as RuntimeEnv;
}

const whatsappGetStatus = createPluginSetupWizardStatus({
  ...whatsappSetupPlugin,
=======
  return Object.assign({}, actual, {
    resolveWhatsAppAuthDir: hoisted.resolveWhatsAppAuthDir,
  });
});

vi.mock("./auth-store.js", async () => {
  const actual = await vi.importActual<typeof import("./auth-store.js")>("./auth-store.js");
  return Object.assign({}, actual, {
    readWebAuthState: hoisted.readWebAuthState,
  });
});

const createRuntime = (): RuntimeEnv =>
  ({
    error: vi.fn(),
  }) as unknown as RuntimeEnv;

const whatsappGetStatus = createPluginSetupWizardStatus({
  id: "whatsapp",
  meta: {
    label: "WhatsApp",
  },
  setupWizard: whatsappSetupWizard,
>>>>>>> upstream/main
} as never);

async function runFinalizeWithHarness(params: {
  harness: ReturnType<typeof createQueuedWizardPrompter>;
  cfg?: Parameters<NonNullable<typeof whatsappSetupWizard.finalize>>[0]["cfg"];
  runtime?: RuntimeEnv;
  forceAllowFrom?: boolean;
  accountId?: string;
}) {
  return await runSetupWizardFinalize({
    finalize: whatsappSetupWizard.finalize,
    cfg: params.cfg ?? {},
    accountId: params.accountId ?? DEFAULT_ACCOUNT_ID,
    runtime: params.runtime ?? createRuntime(),
    prompter: params.harness.prompter,
    forceAllowFrom: params.forceAllowFrom ?? false,
  });
}

function createSeparatePhoneHarness(params: { selectValues: string[]; textValues?: string[] }) {
  return createQueuedWizardPrompter({
    confirmValues: [false],
    selectValues: params.selectValues,
    textValues: params.textValues,
  });
}

function expectFinalizeResult(result: Awaited<ReturnType<typeof runFinalizeWithHarness>>): {
  cfg: OpenClawConfig;
} {
<<<<<<< HEAD
  expect(result).toBeDefined();
=======
>>>>>>> upstream/main
  if (!result || typeof result !== "object" || !("cfg" in result) || !result.cfg) {
    throw new Error("Expected WhatsApp finalize result with cfg");
  }
  return result as { cfg: OpenClawConfig };
}

async function runSeparatePhoneFlow(params: { selectValues: string[]; textValues?: string[] }) {
  hoisted.pathExists.mockResolvedValue(true);
  const harness = createSeparatePhoneHarness({
    selectValues: params.selectValues,
    textValues: params.textValues,
  });
  const result = expectFinalizeResult(
    await runFinalizeWithHarness({
      harness,
    }),
  );
  return { harness, result };
}

describe("whatsapp setup wizard", () => {
  beforeEach(() => {
    hoisted.detectWhatsAppLinked.mockReset();
    hoisted.detectWhatsAppLinked.mockResolvedValue(false);
<<<<<<< HEAD
    hoisted.loginWeb.mockReset();
    hoisted.pathExists.mockReset();
    hoisted.pathExists.mockResolvedValue(false);
=======
    hoisted.hasWebCredsSync.mockReset();
    hoisted.hasWebCredsSync.mockReturnValue(false);
    hoisted.loginWeb.mockReset();
    hoisted.pathExists.mockReset();
    hoisted.pathExists.mockResolvedValue(false);
    hoisted.readWebAuthState.mockReset();
    hoisted.readWebAuthState.mockResolvedValue("not-linked");
>>>>>>> upstream/main
    hoisted.resolveWhatsAppAuthDir.mockReset();
    hoisted.resolveWhatsAppAuthDir.mockReturnValue({ authDir: "/tmp/openclaw-whatsapp-test" });
  });

  it("applies owner allowlist when forceAllowFrom is enabled", async () => {
<<<<<<< HEAD
    const harness = createQueuedWizardPrompter({
      confirmValues: [false],
      textValues: ["+1 (555) 555-0123"],
    });
=======
    const harness = createWhatsAppOwnerAllowlistHarness(createQueuedWizardPrompter);
>>>>>>> upstream/main

    const result = expectFinalizeResult(
      await runFinalizeWithHarness({
        harness,
        forceAllowFrom: true,
      }),
    );

    expect(hoisted.loginWeb).not.toHaveBeenCalled();
<<<<<<< HEAD
    expect(result.cfg.channels?.whatsapp?.selfChatMode).toBe(true);
    expect(result.cfg.channels?.whatsapp?.dmPolicy).toBe("allowlist");
    expect(result.cfg.channels?.whatsapp?.allowFrom).toEqual(["+15555550123"]);
    expect(harness.text).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Your personal WhatsApp number (the phone you will message from)",
      }),
    );
=======
    expectWhatsAppOwnerAllowlistSetup(result.cfg, harness);
>>>>>>> upstream/main
  });

  it("supports disabled DM policy for separate-phone setup", async () => {
    const { harness, result } = await runSeparatePhoneFlow({
      selectValues: ["separate", "disabled"],
    });

<<<<<<< HEAD
    expect(result.cfg.channels?.whatsapp?.selfChatMode).toBe(false);
    expect(result.cfg.channels?.whatsapp?.dmPolicy).toBe("disabled");
    expect(result.cfg.channels?.whatsapp?.allowFrom).toBeUndefined();
    expect(harness.text).not.toHaveBeenCalled();
=======
    expectWhatsAppSeparatePhoneDisabledSetup(result.cfg, harness);
>>>>>>> upstream/main
  });

  it("writes named-account DM policy and allowFrom instead of the channel root", async () => {
    hoisted.pathExists.mockResolvedValue(true);
    const harness = createSeparatePhoneHarness({
      selectValues: ["separate", "open"],
    });

    const named = expectFinalizeResult(
      await runFinalizeWithHarness({
        harness,
        accountId: "work",
<<<<<<< HEAD
        cfg: {
          channels: {
            whatsapp: {
              dmPolicy: "disabled",
              allowFrom: ["+15555550123"],
              accounts: {
                work: {
                  authDir: "/tmp/work",
                },
              },
            },
          },
        },
      }),
    );

    expect(named.cfg.channels?.whatsapp?.dmPolicy).toBe("disabled");
    expect(named.cfg.channels?.whatsapp?.allowFrom).toEqual(["+15555550123"]);
    expect(named.cfg.channels?.whatsapp?.accounts?.work?.dmPolicy).toBe("open");
    expect(named.cfg.channels?.whatsapp?.accounts?.work?.allowFrom).toEqual(["*", "+15555550123"]);
    expect(harness.note).toHaveBeenCalledWith(
      expect.stringContaining(
        "`channels.whatsapp.accounts.work.dmPolicy` + `channels.whatsapp.accounts.work.allowFrom`",
      ),
      "WhatsApp DM access",
    );
=======
        cfg: createWhatsAppWorkAccountConfig() as OpenClawConfig,
      }),
    );

    expectWhatsAppWorkAccountOpenAccess(named.cfg);
    expectWhatsAppWorkAccountAccessNote(harness);
>>>>>>> upstream/main
  });

  it("labels the selected named account in setup status even when not linked", async () => {
    const status = await whatsappGetStatus({
      cfg: {
        channels: {
          whatsapp: {
            accounts: {
              work: {
                authDir: "/tmp/work",
              },
            },
          },
        },
      } as OpenClawConfig,
      accountOverrides: {
        whatsapp: "work",
      },
    });

    expect(status.configured).toBe(false);
    expect(status.statusLines).toEqual(["WhatsApp (work): not linked"]);
  });

  it("uses configured defaultAccount for omitted-account setup status", async () => {
<<<<<<< HEAD
    hoisted.detectWhatsAppLinked.mockImplementation(
      async (_cfg: OpenClawConfig, accountId: string) => accountId === "work",
=======
    hoisted.resolveWhatsAppAuthDir.mockImplementation(({ accountId }: { accountId: string }) => ({
      authDir: accountId === "work" ? "/tmp/work" : "/tmp/default",
    }));
    hoisted.readWebAuthState.mockImplementation(async (authDir: string) =>
      authDir === "/tmp/work" ? "linked" : "not-linked",
>>>>>>> upstream/main
    );

    const status = await whatsappGetStatus({
      cfg: {
        channels: {
          whatsapp: {
            defaultAccount: "work",
            accounts: {
              default: {
                authDir: "/tmp/default",
              },
              work: {
                authDir: "/tmp/work",
              },
            },
          },
        },
      } as OpenClawConfig,
      accountOverrides: {},
    });

    expect(status.configured).toBe(true);
    expect(status.statusLines).toEqual(["WhatsApp (work): linked"]);
<<<<<<< HEAD
    expect(hoisted.detectWhatsAppLinked).toHaveBeenCalledWith(
      expect.any(Object),
      DEFAULT_ACCOUNT_ID,
    );
    expect(hoisted.detectWhatsAppLinked).toHaveBeenCalledWith(expect.any(Object), "work");
=======
    expect(hoisted.readWebAuthState).toHaveBeenCalledWith("/tmp/default");
    expect(hoisted.readWebAuthState).toHaveBeenCalledWith("/tmp/work");
  });

  it("shows auth stabilizing when auth reads time out", async () => {
    hoisted.resolveWhatsAppAuthDir.mockReturnValue({ authDir: "/tmp/work" });
    hoisted.readWebAuthState.mockResolvedValue("unstable");

    const status = await whatsappGetStatus({
      cfg: {
        channels: {
          whatsapp: {
            accounts: {
              work: {
                authDir: "/tmp/work",
              },
            },
          },
        },
      } as OpenClawConfig,
      accountOverrides: {
        whatsapp: "work",
      },
    });

    expect(status.configured).toBe(false);
    expect(status.statusLines).toEqual(["WhatsApp (work): auth stabilizing"]);
>>>>>>> upstream/main
  });

  it("uses configured defaultAccount for omitted-account finalize writes", async () => {
    hoisted.pathExists.mockResolvedValue(true);
    const harness = createSeparatePhoneHarness({
      selectValues: ["separate", "open"],
    });

    const result = expectFinalizeResult(
      await runFinalizeWithHarness({
        harness,
        accountId: "",
<<<<<<< HEAD
        cfg: {
          channels: {
            whatsapp: {
              defaultAccount: "work",
              dmPolicy: "disabled",
              allowFrom: ["+15555550123"],
              accounts: {
                work: {
                  authDir: "/tmp/work",
                },
              },
            },
          },
        },
      }),
    );

    expect(result.cfg.channels?.whatsapp?.dmPolicy).toBe("disabled");
    expect(result.cfg.channels?.whatsapp?.allowFrom).toEqual(["+15555550123"]);
    expect(result.cfg.channels?.whatsapp?.accounts?.work?.dmPolicy).toBe("open");
    expect(result.cfg.channels?.whatsapp?.accounts?.work?.allowFrom).toEqual(["*", "+15555550123"]);
    expect(harness.note).toHaveBeenCalledWith(
      expect.stringContaining(
        "`channels.whatsapp.accounts.work.dmPolicy` + `channels.whatsapp.accounts.work.allowFrom`",
      ),
      "WhatsApp DM access",
    );
  });

  it("normalizes allowFrom entries when list mode is selected", async () => {
    const { result } = await runSeparatePhoneFlow({
      selectValues: ["separate", "allowlist", "list"],
      textValues: ["+1 (555) 555-0123, +15555550123, *"],
    });

    expect(result.cfg.channels?.whatsapp?.selfChatMode).toBe(false);
    expect(result.cfg.channels?.whatsapp?.dmPolicy).toBe("allowlist");
    expect(result.cfg.channels?.whatsapp?.allowFrom).toEqual(["+15555550123", "*"]);
=======
        cfg: createWhatsAppWorkAccountConfig({ defaultAccount: "work" }) as OpenClawConfig,
      }),
    );

    expectWhatsAppWorkAccountOpenAccess(result.cfg);
    expectWhatsAppWorkAccountAccessNote(harness);
  });

  it("normalizes allowFrom entries when list mode is selected", async () => {
    const { result } = await runSeparatePhoneFlow(createWhatsAppAllowlistModeInput());

    expectWhatsAppAllowlistModeSetup(result.cfg);
>>>>>>> upstream/main
  });

  it("enables allowlist self-chat mode for personal-phone setup", async () => {
    hoisted.pathExists.mockResolvedValue(true);
<<<<<<< HEAD
    const harness = createQueuedWizardPrompter({
      confirmValues: [false],
      selectValues: ["personal"],
      textValues: ["+1 (555) 111-2222"],
    });
=======
    const harness = createWhatsAppPersonalPhoneHarness(createQueuedWizardPrompter);
>>>>>>> upstream/main

    const result = expectFinalizeResult(
      await runFinalizeWithHarness({
        harness,
      }),
    );

<<<<<<< HEAD
    expect(result.cfg.channels?.whatsapp?.selfChatMode).toBe(true);
    expect(result.cfg.channels?.whatsapp?.dmPolicy).toBe("allowlist");
    expect(result.cfg.channels?.whatsapp?.allowFrom).toEqual(["+15551112222"]);
=======
    expectWhatsAppPersonalPhoneSetup(result.cfg);
>>>>>>> upstream/main
  });

  it("forces wildcard allowFrom for open policy without allowFrom follow-up prompts", async () => {
    hoisted.pathExists.mockResolvedValue(true);
    const harness = createSeparatePhoneHarness({
      selectValues: ["separate", "open"],
    });

    const result = expectFinalizeResult(
      await runFinalizeWithHarness({
        harness,
<<<<<<< HEAD
        cfg: {
          channels: {
            whatsapp: {
              allowFrom: ["+15555550123"],
            },
          },
        },
      }),
    );

    expect(result.cfg.channels?.whatsapp?.selfChatMode).toBe(false);
    expect(result.cfg.channels?.whatsapp?.dmPolicy).toBe("open");
    expect(result.cfg.channels?.whatsapp?.allowFrom).toEqual(["*", "+15555550123"]);
    expect(harness.select).toHaveBeenCalledTimes(2);
    expect(harness.text).not.toHaveBeenCalled();
=======
        cfg: createWhatsAppRootAllowFromConfig() as OpenClawConfig,
      }),
    );

    expectWhatsAppOpenPolicySetup(result.cfg, harness);
>>>>>>> upstream/main
  });

  it("runs WhatsApp login when not linked and user confirms linking", async () => {
    hoisted.pathExists.mockResolvedValue(false);
<<<<<<< HEAD
    const harness = createQueuedWizardPrompter({
      confirmValues: [true],
      selectValues: ["separate", "disabled"],
    });
=======
    const harness = createWhatsAppLinkingHarness(createQueuedWizardPrompter);
>>>>>>> upstream/main
    const runtime = createRuntime();

    await runFinalizeWithHarness({
      harness,
      runtime,
    });

    expect(hoisted.loginWeb).toHaveBeenCalledWith(false, undefined, runtime, DEFAULT_ACCOUNT_ID);
  });

  it("skips relink note when already linked and relink is declined", async () => {
<<<<<<< HEAD
    hoisted.pathExists.mockResolvedValue(true);
=======
    hoisted.hasWebCredsSync.mockReturnValue(true);
>>>>>>> upstream/main
    const harness = createSeparatePhoneHarness({
      selectValues: ["separate", "disabled"],
    });

    await runFinalizeWithHarness({
      harness,
    });

    expect(hoisted.loginWeb).not.toHaveBeenCalled();
<<<<<<< HEAD
    expect(harness.note).not.toHaveBeenCalledWith(
      expect.stringContaining("openclaw channels login"),
      "WhatsApp",
    );
=======
    expectNoWhatsAppLoginFollowup(harness);
>>>>>>> upstream/main
  });

  it("shows follow-up login command note when not linked and linking is skipped", async () => {
    hoisted.pathExists.mockResolvedValue(false);
    const harness = createSeparatePhoneHarness({
      selectValues: ["separate", "disabled"],
    });

    await runFinalizeWithHarness({
      harness,
    });

<<<<<<< HEAD
    expect(harness.note).toHaveBeenCalledWith(
      expect.stringContaining("openclaw channels login"),
      "WhatsApp",
    );
=======
    expectWhatsAppLoginFollowup(harness);
>>>>>>> upstream/main
  });
});
