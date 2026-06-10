// Regresses allowlist config requiring explicit allowFrom entries.
import { describe, expect, it } from "vitest";
import {
  DiscordConfigSchema,
  IMessageConfigSchema,
  IrcConfigSchema,
  SignalConfigSchema,
  SlackConfigSchema,
  TelegramConfigSchema,
} from "./zod-schema.providers-core.js";
import { WhatsAppConfigSchema } from "./zod-schema.providers-whatsapp.js";

function expectSchemaAllowlistIssue(
  schema: {
    safeParse: (
      value: unknown,
    ) =>
      | { success: true; data: unknown }
      | { success: false; error: { issues: Array<{ path: PropertyKey[] }> } };
  },
  config: unknown,
  path: string | readonly string[],
) {
  const result = schema.safeParse(config);
  expect(result.success).toBe(false);
  if (!result.success) {
    const pathParts = Array.isArray(path) ? path : [path];
    expect(
      result.error.issues.some((issue) => pathParts.every((part) => issue.path.includes(part))),
    ).toBe(true);
  }
}

function expectChannelAllowlistIssue(
  result: ReturnType<typeof validateConfigObject>,
  path: string | readonly string[],
) {
  expect(result.ok).toBe(false);
  if (!result.ok) {
    const pathParts = Array.isArray(path) ? path : [path];
    expect(
      result.issues.some((issue) => pathParts.every((part) => issue.path.includes(part))),
    ).toBe(true);
  }
}

describe('dmPolicy="allowlist" requires non-empty effective allowFrom', () => {
  it.each([
    {
      name: "telegram",
<<<<<<< HEAD
      config: { telegram: { dmPolicy: "allowlist", botToken: "fake" } },
      issuePath: "channels.telegram.allowFrom",
    },
    {
      name: "signal",
      config: { signal: { dmPolicy: "allowlist" } },
      issuePath: "channels.signal.allowFrom",
    },
    {
      name: "discord",
      config: { discord: { dmPolicy: "allowlist" } },
      issuePath: ["channels.discord", "allowFrom"],
    },
    {
      name: "whatsapp",
      config: { whatsapp: { dmPolicy: "allowlist" } },
      issuePath: "channels.whatsapp.allowFrom",
    },
  ] as const)('rejects $name dmPolicy="allowlist" without allowFrom', ({ config, issuePath }) => {
    expectChannelAllowlistIssue(validateConfigObject({ channels: config }), issuePath);
  });
=======
      schema: TelegramConfigSchema,
      config: { dmPolicy: "allowlist", botToken: "fake" },
      issuePath: "allowFrom",
    },
    {
      name: "signal",
      schema: SignalConfigSchema,
      config: { dmPolicy: "allowlist" },
      issuePath: "allowFrom",
    },
    {
      name: "discord",
      schema: DiscordConfigSchema,
      config: { dmPolicy: "allowlist" },
      issuePath: "allowFrom",
    },
    {
      name: "whatsapp",
      schema: WhatsAppConfigSchema,
      config: { dmPolicy: "allowlist" },
      issuePath: "allowFrom",
    },
  ] as const)(
    'rejects $name dmPolicy="allowlist" without allowFrom',
    ({ schema, config, issuePath }) => {
      expectSchemaAllowlistIssue(schema, config, issuePath);
    },
  );
>>>>>>> upstream/main

  it('accepts dmPolicy="pairing" without allowFrom', () => {
    const res = TelegramConfigSchema.safeParse({ dmPolicy: "pairing", botToken: "fake" });
    expect(res.success).toBe(true);
  });
});

describe('account dmPolicy="allowlist" uses inherited allowFrom', () => {
  it.each([
    {
      name: "telegram",
<<<<<<< HEAD
      config: {
        telegram: {
          allowFrom: ["12345"],
          accounts: { bot1: { dmPolicy: "allowlist", botToken: "fake" } },
=======
      schema: TelegramConfigSchema,
      config: {
        allowFrom: ["12345"],
        accounts: { bot1: { dmPolicy: "allowlist", botToken: "fake" } },
      },
    },
    {
      name: "signal",
      schema: SignalConfigSchema,
      config: { allowFrom: ["+15550001111"], accounts: { work: { dmPolicy: "allowlist" } } },
    },
    {
      name: "discord",
      schema: DiscordConfigSchema,
      config: { allowFrom: ["123456789"], accounts: { work: { dmPolicy: "allowlist" } } },
    },
    {
      name: "slack",
      schema: SlackConfigSchema,
      config: {
        allowFrom: ["U123"],
        botToken: "xoxb-top",
        appToken: "xapp-top",
        accounts: {
          work: { dmPolicy: "allowlist", botToken: "xoxb-work", appToken: "xapp-work" },
>>>>>>> upstream/main
        },
      },
    },
    {
<<<<<<< HEAD
      name: "signal",
      config: {
        signal: { allowFrom: ["+15550001111"], accounts: { work: { dmPolicy: "allowlist" } } },
      },
    },
    {
      name: "discord",
      config: {
        discord: { allowFrom: ["123456789"], accounts: { work: { dmPolicy: "allowlist" } } },
      },
    },
    {
      name: "slack",
      config: {
        slack: {
          allowFrom: ["U123"],
          botToken: "xoxb-top",
          appToken: "xapp-top",
          accounts: {
            work: { dmPolicy: "allowlist", botToken: "xoxb-work", appToken: "xapp-work" },
          },
        },
      },
    },
    {
      name: "whatsapp",
      config: {
        whatsapp: { allowFrom: ["+15550001111"], accounts: { work: { dmPolicy: "allowlist" } } },
      },
    },
    {
      name: "imessage",
      config: {
        imessage: { allowFrom: ["alice"], accounts: { work: { dmPolicy: "allowlist" } } },
      },
    },
    {
      name: "irc",
      config: {
        irc: { allowFrom: ["nick"], accounts: { work: { dmPolicy: "allowlist" } } },
      },
    },
    {
      name: "bluebubbles",
      config: {
        bluebubbles: { allowFrom: ["sender"], accounts: { work: { dmPolicy: "allowlist" } } },
      },
    },
  ] as const)("accepts $name account allowlist when parent allowFrom exists", ({ config }) => {
    expect(validateConfigObject({ channels: config }).ok).toBe(true);
  });

  it("rejects telegram account allowlist when neither account nor parent has allowFrom", () => {
    expectChannelAllowlistIssue(
      validateConfigObject({
        channels: {
          telegram: { accounts: { bot1: { dmPolicy: "allowlist", botToken: "fake" } } },
        },
      }),
      "channels.telegram.accounts.bot1.allowFrom",
    );
=======
      name: "whatsapp",
      schema: WhatsAppConfigSchema,
      config: { allowFrom: ["+15550001111"], accounts: { work: { dmPolicy: "allowlist" } } },
    },
    {
      name: "imessage",
      schema: IMessageConfigSchema,
      config: { allowFrom: ["alice"], accounts: { work: { dmPolicy: "allowlist" } } },
    },
    {
      name: "irc",
      schema: IrcConfigSchema,
      config: { allowFrom: ["nick"], accounts: { work: { dmPolicy: "allowlist" } } },
    },
  ] as const)(
    "accepts $name account allowlist when parent allowFrom exists",
    ({ schema, config }) => {
      expect(schema.safeParse(config).success).toBe(true);
    },
  );

  it("rejects telegram account allowlist when neither account nor parent has allowFrom", () => {
    expectSchemaAllowlistIssue(
      TelegramConfigSchema,
      { accounts: { bot1: { dmPolicy: "allowlist", botToken: "fake" } } },
      "allowFrom",
    );
  });
});

describe("Discord mentionAliases schema", () => {
  it("accepts stable outbound mention aliases on top-level and account config", () => {
    expect(
      DiscordConfigSchema.safeParse({
        mentionAliases: {
          opslead: "123456789012345678",
        },
        accounts: {
          work: {
            mentionAliases: {
              vladislava: "234567890123456789",
            },
          },
        },
      }).success,
    ).toBe(true);
  });

  it("rejects non-snowflake mention alias targets", () => {
    const result = DiscordConfigSchema.safeParse({
      mentionAliases: {
        opslead: "not-a-user-id",
      },
    });
    expect(result.success).toBe(false);
>>>>>>> upstream/main
  });
});
