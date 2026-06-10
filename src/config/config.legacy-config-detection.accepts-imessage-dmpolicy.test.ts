// Regresses accepted legacy iMessage dmPolicy config detection.
import { describe, expect, it } from "vitest";
import {
  expectSchemaConfigValue,
  expectSchemaValid,
} from "./legacy-config-detection.test-support.js";
import { AudioSchema, BindingsSchema } from "./zod-schema.agents.js";
import { OpenClawSchema } from "./zod-schema.js";

<<<<<<< HEAD
const { loadConfig, readConfigFileSnapshot, validateConfigObject } =
  await vi.importActual<typeof import("./config.js")>("./config.js");
import { withTempHome } from "./test-helpers.js";

async function expectLoadRejectionPreservesField(params: {
=======
function expectOpenClawSchemaInvalidPreservesField(params: {
>>>>>>> upstream/main
  config: unknown;
  readValue: (parsed: unknown) => unknown;
  expectedValue: unknown;
  expectedPath?: string;
  expectedMessageIncludes?: string;
}) {
  const before = JSON.stringify(params.config);
  const res = OpenClawSchema.safeParse(params.config);
  expect(res.success).toBe(false);
  if (!res.success) {
    if (params.expectedPath !== undefined) {
      expect(res.error.issues[0]?.path.join(".")).toBe(params.expectedPath);
    }
    if (params.expectedMessageIncludes !== undefined) {
      expect(res.error.issues[0]?.message).toContain(params.expectedMessageIncludes);
    }
  }
  expect(params.readValue(params.config)).toBe(params.expectedValue);
  expect(JSON.stringify(params.config)).toBe(before);
}

describe("legacy config detection", () => {
  it("accepts tools audio transcription without cli", () => {
    expectSchemaValid(AudioSchema, {
      transcription: { command: ["whisper", "--model", "base"] },
    });
  });
  it("rejects legacy agent.model string", () => {
    const res = OpenClawSchema.safeParse({
      agent: { model: "anthropic/claude-opus-4-6" },
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path.join(".")).toBe("");
      expect(res.error.issues[0]?.message).toContain('"agent"');
    }
  });
  it("rejects removed legacy provider sections", () => {
    expectOpenClawSchemaInvalidPreservesField({
      config: { whatsapp: { allowFrom: ["+1555"] } },
      readValue: (parsed) =>
        (parsed as { whatsapp?: { allowFrom?: string[] } }).whatsapp?.allowFrom?.[0],
      expectedValue: "+1555",
      expectedPath: "",
      expectedMessageIncludes: '"whatsapp"',
    });
  });
  it("preserves claude-cli auth profile mode during validation", () => {
    const config = {
      auth: {
        profiles: {
          "anthropic:claude-cli": { provider: "anthropic", mode: "token" },
        },
      },
<<<<<<< HEAD
    });
    expect(res.ok).toBe(true);
  });
  it.each([
    [
      'rejects discord.dm.policy="open" without allowFrom "*"',
      { channels: { discord: { dm: { policy: "open", allowFrom: ["123"] } } } },
      "channels.discord.dm.allowFrom",
    ],
    [
      'rejects discord.dmPolicy="open" without allowFrom "*"',
      { channels: { discord: { dmPolicy: "open", allowFrom: ["123"] } } },
      "channels.discord.allowFrom",
    ],
    [
      'rejects slack.dm.policy="open" without allowFrom "*"',
      { channels: { slack: { dm: { policy: "open", allowFrom: ["U123"] } } } },
      "channels.slack.dm.allowFrom",
    ],
    [
      'rejects slack.dmPolicy="open" without allowFrom "*"',
      { channels: { slack: { dmPolicy: "open", allowFrom: ["U123"] } } },
      "channels.slack.allowFrom",
    ],
  ])("rejects: %s", (_name, config, expectedPath) => {
    expectInvalidIssuePath(config, expectedPath);
  });

  it.each([
    {
      name: 'accepts discord dm.allowFrom="*" with top-level allowFrom alias',
      config: {
        channels: { discord: { dm: { policy: "open", allowFrom: ["123"] }, allowFrom: ["*"] } },
      },
    },
    {
      name: 'accepts slack dm.allowFrom="*" with top-level allowFrom alias',
      config: {
        channels: { slack: { dm: { policy: "open", allowFrom: ["U123"] }, allowFrom: ["*"] } },
      },
    },
  ])("$name", ({ config }) => {
    const res = validateConfigObject(config);
    expect(res.ok).toBe(true);
  });
  it("rejects legacy agent.model string", async () => {
    const res = validateConfigObject({
      agent: { model: "anthropic/claude-opus-4-6" },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues[0]?.path).toBe("");
      expect(res.issues[0]?.message).toContain('"agent"');
=======
    };
    const res = OpenClawSchema.safeParse(config);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.auth?.profiles?.["anthropic:claude-cli"]?.mode).toBe("token");
>>>>>>> upstream/main
    }
    expect(config.auth.profiles["anthropic:claude-cli"].mode).toBe("token");
  });
<<<<<<< HEAD
  it("flags channels.telegram.groupMentionsOnly as legacy in snapshot", async () => {
    await withSnapshotForConfig(
      { channels: { telegram: { groupMentionsOnly: true } } },
      async (ctx) => {
        expect(ctx.snapshot.valid).toBe(false);
        expect(
          ctx.snapshot.legacyIssues.some(
            (issue) => issue.path === "channels.telegram.groupMentionsOnly",
          ),
        ).toBe(true);
        const parsed = ctx.parsed as {
          channels?: { telegram?: { groupMentionsOnly?: boolean } };
        };
        expect(parsed.channels?.telegram?.groupMentionsOnly).toBe(true);
      },
    );
  });

  it("rejects removed routing.allowFrom in snapshot", async () => {
    await withSnapshotForConfig({ routing: { allowFrom: ["+15555550123"] } }, async (ctx) => {
      expectSnapshotInvalidRootKey(ctx, "routing");
    });
  });
  it("flags top-level memorySearch as legacy in snapshot", async () => {
    await withSnapshotForConfig(
      { memorySearch: { provider: "local", fallback: "none" } },
      async (ctx) => {
        expect(ctx.snapshot.valid).toBe(false);
        expect(ctx.snapshot.legacyIssues.some((issue) => issue.path === "memorySearch")).toBe(true);
      },
    );
  });
  it("flags top-level heartbeat as legacy in snapshot", async () => {
    await withSnapshotForConfig(
      { heartbeat: { model: "anthropic/claude-3-5-haiku-20241022", every: "30m" } },
      async (ctx) => {
        expect(ctx.snapshot.valid).toBe(false);
        expect(ctx.snapshot.legacyIssues.some((issue) => issue.path === "heartbeat")).toBe(true);
      },
    );
  });
  it("rejects removed legacy provider sections in snapshot", async () => {
    await withSnapshotForConfig({ whatsapp: { allowFrom: ["+1555"] } }, async (ctx) => {
      expectSnapshotInvalidRootKey(ctx, "whatsapp");
    });
  });
  it("does not auto-migrate removed cli auth profile modes on load", async () => {
    await withTempHome(async (home) => {
      const configPath = path.join(home, ".openclaw", "openclaw.json");
      await fs.mkdir(path.dirname(configPath), { recursive: true });
      await fs.writeFile(
        configPath,
        JSON.stringify(
          {
            auth: {
              profiles: {
                "anthropic:removed-cli": { provider: "anthropic", mode: "token" },
              },
            },
          },
          null,
          2,
        ),
        "utf-8",
      );

      const cfg = loadConfig();
      expect(cfg.auth?.profiles?.["anthropic:removed-cli"]?.mode).toBe("token");

      const raw = await fs.readFile(configPath, "utf-8");
      const parsed = JSON.parse(raw) as {
        auth?: { profiles?: Record<string, { mode?: string }> };
      };
      expect(parsed.auth?.profiles?.["anthropic:removed-cli"]?.mode).toBe("token");
    });
  });
  it("still flags memorySearch in snapshot under the shorter support window", async () => {
    await withSnapshotForConfig(
      { memorySearch: { provider: "local", fallback: "none" } },
      async (ctx) => {
        expect(ctx.snapshot.valid).toBe(false);
        expect(ctx.snapshot.legacyIssues.some((issue) => issue.path === "memorySearch")).toBe(true);
      },
    );
  });
  it("rejects removed routing.allowFrom in snapshot with other values", async () => {
    await withSnapshotForConfig({ routing: { allowFrom: ["+1666"] } }, async (ctx) => {
      expectSnapshotInvalidRootKey(ctx, "routing");
    });
  });
  it("rejects bindings[].match.provider on load", async () => {
    await expectLoadRejectionPreservesField({
=======
  it("rejects bindings[].match.provider without mutating the source", () => {
    expectOpenClawSchemaInvalidPreservesField({
>>>>>>> upstream/main
      config: {
        bindings: [{ agentId: "main", match: { provider: "slack" } }],
      },
      readValue: (parsed) =>
        (parsed as { bindings?: Array<{ match?: { provider?: string } }> }).bindings?.[0]?.match
          ?.provider,
      expectedValue: "slack",
    });
  });
  it("rejects bindings[].match.accountID without mutating the source", () => {
    expectOpenClawSchemaInvalidPreservesField({
      config: {
        bindings: [{ agentId: "main", match: { channel: "telegram", accountID: "work" } }],
      },
      readValue: (parsed) =>
        (parsed as { bindings?: Array<{ match?: { accountID?: string } }> }).bindings?.[0]?.match
          ?.accountID,
      expectedValue: "work",
    });
  });
  it("accepts bindings[].comment during validation", () => {
    expectSchemaConfigValue({
      schema: BindingsSchema,
      config: [{ agentId: "main", comment: "primary route", match: { channel: "telegram" } }],
      readValue: (config) => (config as Array<{ comment?: string }> | undefined)?.[0]?.comment,
      expectedValue: "primary route",
    });
  });
  it("rejects session.sendPolicy.rules[].match.provider without mutating the source", () => {
    expectOpenClawSchemaInvalidPreservesField({
      config: {
        session: {
          sendPolicy: {
            rules: [{ action: "deny", match: { provider: "telegram" } }],
          },
        },
      },
      readValue: (parsed) =>
        (
          parsed as {
            session?: { sendPolicy?: { rules?: Array<{ match?: { provider?: string } }> } };
          }
        ).session?.sendPolicy?.rules?.[0]?.match?.provider,
      expectedValue: "telegram",
    });
  });
  it("rejects messages.queue.byProvider without mutating the source", () => {
    expectOpenClawSchemaInvalidPreservesField({
      config: { messages: { queue: { byProvider: { whatsapp: "queue" } } } },
      readValue: (parsed) =>
        (
          parsed as {
            messages?: {
              queue?: {
                byProvider?: Record<string, unknown>;
              };
            };
          }
        ).messages?.queue?.byProvider?.whatsapp,
      expectedValue: "queue",
    });
  });
  it("rejects retired messages.queue.mode without mutating the source", () => {
    expectOpenClawSchemaInvalidPreservesField({
      config: { messages: { queue: { mode: "queue" } } },
      readValue: (parsed) =>
        (
          parsed as {
            messages?: {
              queue?: {
                mode?: unknown;
              };
            };
          }
        ).messages?.queue?.mode,
      expectedValue: "queue",
      expectedPath: "messages.queue.mode",
    });
  });
});
