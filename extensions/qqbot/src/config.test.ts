<<<<<<< HEAD
import fs from "node:fs";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { describe, expect, it } from "vitest";
import { validateJsonSchemaValue } from "../../../src/plugins/schema-validator.js";
import { qqbotPlugin } from "./channel.js";
import { qqbotSetupPlugin } from "./channel.setup.js";
import { QQBotConfigSchema } from "./config-schema.js";
import { DEFAULT_ACCOUNT_ID, resolveDefaultQQBotAccountId, resolveQQBotAccount } from "./config.js";
=======
// Qqbot tests cover config plugin behavior.
import fs from "node:fs";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  type JsonSchemaObject,
  validateJsonSchemaValue,
} from "openclaw/plugin-sdk/json-schema-runtime";
import { describe, expect, it } from "vitest";
import { qqbotSetupAdapterShared } from "./bridge/config-shared.js";
import {
  DEFAULT_ACCOUNT_ID,
  resolveDefaultQQBotAccountId,
  resolveQQBotAccount,
} from "./bridge/config.js";
import { qqbotSetupPlugin } from "./channel.setup.js";
import { QQBotConfigSchema } from "./config-schema.js";
import { makeQqbotDefaultAccountConfig, makeQqbotSecretRefConfig } from "./qqbot-test-support.js";

function requireQQBotSetup() {
  if (!qqbotSetupPlugin.setup) {
    throw new Error("QQBot setup missing");
  }
  return qqbotSetupPlugin.setup;
}
>>>>>>> upstream/main

describe("qqbot config", () => {
  it("accepts top-level speech overrides in the manifest schema", () => {
    const manifest = JSON.parse(
      fs.readFileSync(new URL("../openclaw.plugin.json", import.meta.url), "utf-8"),
<<<<<<< HEAD
    ) as { configSchema: Record<string, unknown> };
=======
    ) as { configSchema: JsonSchemaObject };
>>>>>>> upstream/main

    const result = validateJsonSchemaValue({
      schema: manifest.configSchema,
      cacheKey: "qqbot.manifest.speech-overrides",
      value: {
<<<<<<< HEAD
        tts: {
          provider: "openai",
          baseUrl: "https://example.com/v1",
          apiKey: "tts-key",
          model: "gpt-4o-mini-tts",
          voice: "alloy",
          authStyle: "api-key",
          queryParams: {
            format: "wav",
          },
          speed: 1.1,
        },
=======
>>>>>>> upstream/main
        stt: {
          provider: "openai",
          baseUrl: "https://example.com/v1",
          apiKey: "stt-key",
          model: "whisper-1",
        },
      },
    });

    expect(result.ok).toBe(true);
  });

  it("accepts defaultAccount in the manifest schema", () => {
    const manifest = JSON.parse(
      fs.readFileSync(new URL("../openclaw.plugin.json", import.meta.url), "utf-8"),
<<<<<<< HEAD
    ) as { configSchema: Record<string, unknown> };
=======
    ) as { configSchema: JsonSchemaObject };
>>>>>>> upstream/main

    const result = validateJsonSchemaValue({
      schema: manifest.configSchema,
      cacheKey: "qqbot.manifest.default-account",
      value: {
        defaultAccount: "bot2",
        accounts: {
          bot2: {
            appId: "654321",
          },
        },
      },
    });

    expect(result.ok).toBe(true);
  });

  it("honors configured defaultAccount when resolving the default QQ Bot account id", () => {
    const cfg = {
      channels: {
        qqbot: {
          defaultAccount: "bot2",
          accounts: {
            bot2: {
              appId: "654321",
            },
          },
        },
      },
    } as OpenClawConfig;

    expect(resolveDefaultQQBotAccountId(cfg)).toBe("bot2");
  });

  it("accepts SecretRef-backed credentials in the runtime schema", () => {
    const parsed = QQBotConfigSchema.safeParse({
      defaultAccount: "bot2",
      appId: "123456",
      clientSecret: {
        source: "env",
        provider: "default",
        id: "QQBOT_CLIENT_SECRET",
      },
      allowFrom: ["*"],
      audioFormatPolicy: {
        sttDirectFormats: [".wav"],
        uploadDirectFormats: [".mp3"],
        transcodeEnabled: false,
      },
      urlDirectUpload: false,
      upgradeUrl: "https://docs.openclaw.ai/channels/qqbot",
      upgradeMode: "doc",
      accounts: {
        bot2: {
          appId: "654321",
          clientSecret: {
            source: "env",
            provider: "default",
            id: "QQBOT_CLIENT_SECRET_BOT2",
          },
          allowFrom: ["user-1"],
        },
      },
    });

    expect(parsed.success).toBe(true);
  });

<<<<<<< HEAD
  it("rejects account-level speech overrides that runtime does not consume", () => {
=======
  it("accepts account-level speech overrides as forward-compatible config", () => {
>>>>>>> upstream/main
    const parsed = QQBotConfigSchema.safeParse({
      accounts: {
        bot2: {
          appId: "654321",
<<<<<<< HEAD
          tts: {
=======
          stt: {
>>>>>>> upstream/main
            provider: "openai",
          },
        },
      },
    });

<<<<<<< HEAD
=======
    expect(parsed.success).toBe(true);
  });

  it("accepts canonical group tools config", () => {
    const parsed = QQBotConfigSchema.safeParse({
      groups: {
        G1: {
          requireMention: true,
          tools: { deny: ["*"] },
          toolsBySender: {
            "id:alice": { allow: ["read"] },
          },
        },
      },
      accounts: {
        bot2: {
          groups: {
            G1: { tools: { allow: [] } },
          },
        },
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects retired group toolPolicy config", () => {
    const parsed = QQBotConfigSchema.safeParse({
      groups: {
        G1: {
          toolPolicy: "none",
        },
      },
    });

>>>>>>> upstream/main
    expect(parsed.success).toBe(false);
  });

  it("preserves top-level media and upgrade config on the default account", () => {
    const cfg = {
      channels: {
        qqbot: {
          appId: "123456",
          clientSecret: "secret-value",
          audioFormatPolicy: {
            sttDirectFormats: [".wav"],
            uploadDirectFormats: [".mp3"],
            transcodeEnabled: false,
          },
          urlDirectUpload: false,
          upgradeUrl: "https://docs.openclaw.ai/channels/qqbot",
          upgradeMode: "hot-reload",
        },
      },
    } as OpenClawConfig;

    const resolved = resolveQQBotAccount(cfg, DEFAULT_ACCOUNT_ID);

    expect(resolved.clientSecret).toBe("secret-value");
    expect(resolved.config.audioFormatPolicy).toEqual({
      sttDirectFormats: [".wav"],
      uploadDirectFormats: [".mp3"],
      transcodeEnabled: false,
    });
    expect(resolved.config.urlDirectUpload).toBe(false);
    expect(resolved.config.upgradeUrl).toBe("https://docs.openclaw.ai/channels/qqbot");
    expect(resolved.config.upgradeMode).toBe("hot-reload");
  });

  it("uses configured defaultAccount when accountId is omitted", () => {
    const cfg = {
      channels: {
        qqbot: {
          defaultAccount: "bot2",
          accounts: {
            bot2: {
              appId: "654321",
              clientSecret: "secret-value",
              name: "Bot Two",
            },
          },
        },
      },
    } as OpenClawConfig;

    const resolved = resolveQQBotAccount(cfg);

    expect(resolved.accountId).toBe("bot2");
    expect(resolved.appId).toBe("654321");
    expect(resolved.clientSecret).toBe("secret-value");
    expect(resolved.name).toBe("Bot Two");
  });

<<<<<<< HEAD
  it("rejects unresolved SecretRefs on runtime resolution", () => {
=======
  it("resolves env SecretRefs on runtime resolution", () => {
    const cfg = makeQqbotSecretRefConfig();
    const previous = process.env.QQBOT_CLIENT_SECRET;

    process.env.QQBOT_CLIENT_SECRET = "resolved-secret";
    try {
      const resolved = resolveQQBotAccount(cfg, DEFAULT_ACCOUNT_ID);

      expect(resolved.clientSecret).toBe("resolved-secret");
      expect(resolved.secretSource).toBe("config");
    } finally {
      if (previous === undefined) {
        delete process.env.QQBOT_CLIENT_SECRET;
      } else {
        process.env.QQBOT_CLIENT_SECRET = previous;
      }
    }
  });

  it("rejects unresolved non-env SecretRefs on runtime resolution", () => {
>>>>>>> upstream/main
    const cfg = {
      channels: {
        qqbot: {
          appId: "123456",
          clientSecret: {
<<<<<<< HEAD
            source: "env",
            provider: "default",
            id: "QQBOT_CLIENT_SECRET",
=======
            source: "file",
            provider: "default",
            id: "/qqbot/clientSecret",
>>>>>>> upstream/main
          },
        },
      },
    } as OpenClawConfig;

    expect(() => resolveQQBotAccount(cfg, DEFAULT_ACCOUNT_ID)).toThrow(
<<<<<<< HEAD
      'channels.qqbot.clientSecret: unresolved SecretRef "env:default:QQBOT_CLIENT_SECRET"',
    );
  });

  it("allows unresolved SecretRefs for setup/status flows", () => {
=======
      'channels.qqbot.clientSecret: unresolved SecretRef "file:default:/qqbot/clientSecret"',
    );
  });

  it("rejects legacy SecretRef marker strings before QQ token exchange", () => {
>>>>>>> upstream/main
    const cfg = {
      channels: {
        qqbot: {
          appId: "123456",
<<<<<<< HEAD
          clientSecret: {
            source: "env",
            provider: "default",
            id: "QQBOT_CLIENT_SECRET",
          },
=======
          clientSecret: "secretref:/QQBOT_CLIENT_SECRET",
>>>>>>> upstream/main
        },
      },
    } as OpenClawConfig;

<<<<<<< HEAD
=======
    expect(() => resolveQQBotAccount(cfg, DEFAULT_ACCOUNT_ID)).toThrow(
      "channels.qqbot.clientSecret: legacy SecretRef marker strings are not valid QQ Bot clientSecret values; use a structured SecretRef object instead.",
    );
  });

  it("allows unresolved SecretRefs for setup/status flows", () => {
    const cfg = makeQqbotSecretRefConfig();

>>>>>>> upstream/main
    const resolved = resolveQQBotAccount(cfg, DEFAULT_ACCOUNT_ID, {
      allowUnresolvedSecretRef: true,
    });

    expect(resolved.clientSecret).toBe("");
    expect(resolved.secretSource).toBe("config");
    expect(qqbotSetupPlugin.config.isConfigured?.(resolved, cfg)).toBe(true);
    expect(qqbotSetupPlugin.config.describeAccount?.(resolved, cfg)?.configured).toBe(true);
  });

  it.each([
    {
      accountId: DEFAULT_ACCOUNT_ID,
      inputAccountId: DEFAULT_ACCOUNT_ID,
      expectedPath: ["channels", "qqbot"],
    },
    {
      accountId: "bot2",
      inputAccountId: "bot2",
      expectedPath: ["channels", "qqbot", "accounts", "bot2"],
    },
  ])("splits --token on the first colon for $accountId", ({ inputAccountId, expectedPath }) => {
<<<<<<< HEAD
    const setup = qqbotSetupPlugin.setup;
    expect(setup).toBeDefined();

    const next = setup!.applyAccountConfig?.({
=======
    const setup = requireQQBotSetup();

    const next = setup.applyAccountConfig?.({
>>>>>>> upstream/main
      cfg: {} as OpenClawConfig,
      accountId: inputAccountId,
      input: {
        token: "102905186:Oi2Mg1Mh2Ni3:Pl7TpBXuHe1OmAYwKi7W",
      },
    }) as Record<string, unknown>;

    const accountConfig = expectedPath.reduce<unknown>((value, key) => {
      if (!value || typeof value !== "object") {
        return undefined;
      }
      return (value as Record<string, unknown>)[key];
    }, next) as Record<string, unknown> | undefined;

<<<<<<< HEAD
    expect(accountConfig).toMatchObject({
      enabled: true,
      appId: "102905186",
      clientSecret: "Oi2Mg1Mh2Ni3:Pl7TpBXuHe1OmAYwKi7W",
=======
    expect(accountConfig).toStrictEqual({
      enabled: true,
      allowFrom: ["*"],
      appId: "102905186",
      clientSecret: "Oi2Mg1Mh2Ni3:Pl7TpBXuHe1OmAYwKi7W",
      clientSecretFile: undefined,
>>>>>>> upstream/main
    });
  });

  it("rejects malformed --token consistently across setup paths", () => {
<<<<<<< HEAD
    const runtimeSetup = qqbotPlugin.setup;
    const lightweightSetup = qqbotSetupPlugin.setup;
    expect(runtimeSetup).toBeDefined();
    expect(lightweightSetup).toBeDefined();
=======
    const runtimeSetup = qqbotSetupAdapterShared;
    const lightweightSetup = requireQQBotSetup();
>>>>>>> upstream/main

    const input = { token: "broken", name: "Bad" };

    expect(
<<<<<<< HEAD
      runtimeSetup!.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      }),
    ).toBe("QQBot --token must be in appId:clientSecret format");
    expect(
      lightweightSetup!.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      }),
    ).toBe("QQBot --token must be in appId:clientSecret format");
    expect(
      runtimeSetup!.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      }),
    ).toEqual({});
    expect(
      lightweightSetup!.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      }),
    ).toEqual({});
  });

  it("preserves the --use-env add flow across setup paths", () => {
    const runtimeSetup = qqbotPlugin.setup;
    const lightweightSetup = qqbotSetupPlugin.setup;
    expect(runtimeSetup).toBeDefined();
    expect(lightweightSetup).toBeDefined();
=======
      runtimeSetup.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      } as never),
    ).toBe("QQBot --token must be in appId:clientSecret format");
    expect(
      lightweightSetup.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      } as never),
    ).toBe("QQBot --token must be in appId:clientSecret format");
    expect(
      runtimeSetup.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      } as never),
    ).toStrictEqual({});
    expect(
      lightweightSetup.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      } as never),
    ).toStrictEqual({});
  });

  it("preserves the --use-env add flow across setup paths", () => {
    const runtimeSetup = qqbotSetupAdapterShared;
    const lightweightSetup = requireQQBotSetup();
>>>>>>> upstream/main

    const input = { useEnv: true, name: "Env Bot" };

    expect(
<<<<<<< HEAD
      runtimeSetup!.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      }),
    ).toMatchObject({
=======
      runtimeSetup.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      } as never),
    ).toStrictEqual({
>>>>>>> upstream/main
      channels: {
        qqbot: {
          enabled: true,
          allowFrom: ["*"],
          name: "Env Bot",
        },
      },
    });
    expect(
<<<<<<< HEAD
      lightweightSetup!.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      }),
    ).toMatchObject({
=======
      lightweightSetup.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: DEFAULT_ACCOUNT_ID,
        input,
      } as never),
    ).toStrictEqual({
>>>>>>> upstream/main
      channels: {
        qqbot: {
          enabled: true,
          allowFrom: ["*"],
          name: "Env Bot",
        },
      },
    });
  });

  it("uses configured defaultAccount when runtime setup accountId is omitted", () => {
<<<<<<< HEAD
    const runtimeSetup = qqbotPlugin.setup;
    expect(runtimeSetup).toBeDefined();

    expect(
      runtimeSetup!.resolveAccountId?.({
        cfg: {
          channels: {
            qqbot: {
              defaultAccount: "bot2",
              accounts: {
                bot2: { appId: "123456" },
              },
            },
          },
        } as OpenClawConfig,
=======
    const runtimeSetup = qqbotSetupAdapterShared;

    expect(
      runtimeSetup.resolveAccountId?.({
        cfg: makeQqbotDefaultAccountConfig(),
>>>>>>> upstream/main
        accountId: undefined,
      } as never),
    ).toBe("bot2");
  });

  it("rejects --use-env for named accounts across setup paths", () => {
<<<<<<< HEAD
    const runtimeSetup = qqbotPlugin.setup;
    const lightweightSetup = qqbotSetupPlugin.setup;
    expect(runtimeSetup).toBeDefined();
    expect(lightweightSetup).toBeDefined();
=======
    const runtimeSetup = qqbotSetupAdapterShared;
    const lightweightSetup = requireQQBotSetup();
>>>>>>> upstream/main

    const input = { useEnv: true, name: "Env Bot" };

    expect(
<<<<<<< HEAD
      runtimeSetup!.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      }),
    ).toBe("QQBot --use-env only supports the default account");
    expect(
      lightweightSetup!.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      }),
    ).toBe("QQBot --use-env only supports the default account");
    expect(
      runtimeSetup!.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      }),
    ).toEqual({});
    expect(
      lightweightSetup!.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      }),
    ).toEqual({});
=======
      runtimeSetup.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      } as never),
    ).toBe("QQBot --use-env only supports the default account");
    expect(
      lightweightSetup.validateInput?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      } as never),
    ).toBe("QQBot --use-env only supports the default account");
    expect(
      runtimeSetup.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      } as never),
    ).toStrictEqual({});
    expect(
      lightweightSetup.applyAccountConfig?.({
        cfg: {} as OpenClawConfig,
        accountId: "bot2",
        input,
      } as never),
    ).toStrictEqual({});
>>>>>>> upstream/main
  });
});
