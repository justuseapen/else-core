<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { describe, expect, it } from "vitest";
import { resolveWhatsAppReactionLevel } from "./reaction-level.js";

type ReactionResolution = ReturnType<typeof resolveWhatsAppReactionLevel>;

describe("resolveWhatsAppReactionLevel", () => {
  const expectReactionFlags = (
    result: ReactionResolution,
    expected: {
      level: "off" | "ack" | "minimal" | "extensive";
      ackEnabled: boolean;
      agentReactionsEnabled: boolean;
      agentReactionGuidance?: "minimal" | "extensive";
    },
  ) => {
    expect(result.level).toBe(expected.level);
    expect(result.ackEnabled).toBe(expected.ackEnabled);
    expect(result.agentReactionsEnabled).toBe(expected.agentReactionsEnabled);
    expect(result.agentReactionGuidance).toBe(expected.agentReactionGuidance);
  };

=======
// Whatsapp tests cover reaction level plugin behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { describe, expect, it } from "vitest";
import { resolveWhatsAppReactionLevel } from "./reaction-level.js";

describe("resolveWhatsAppReactionLevel", () => {
>>>>>>> upstream/main
  it("defaults to minimal level when reactionLevel is not set", () => {
    const cfg: OpenClawConfig = {
      channels: { whatsapp: {} },
    };

    const result = resolveWhatsAppReactionLevel({ cfg });
<<<<<<< HEAD
    expectReactionFlags(result, {
=======
    expect(result).toEqual({
>>>>>>> upstream/main
      level: "minimal",
      ackEnabled: false,
      agentReactionsEnabled: true,
      agentReactionGuidance: "minimal",
    });
  });

  it("returns off level with no reactions enabled", () => {
    const cfg: OpenClawConfig = {
      channels: { whatsapp: { reactionLevel: "off" } },
    };

    const result = resolveWhatsAppReactionLevel({ cfg });
<<<<<<< HEAD
    expectReactionFlags(result, {
=======
    expect(result).toEqual({
>>>>>>> upstream/main
      level: "off",
      ackEnabled: false,
      agentReactionsEnabled: false,
    });
  });

  it("returns ack level with only ackEnabled", () => {
    const cfg: OpenClawConfig = {
      channels: { whatsapp: { reactionLevel: "ack" } },
    };

    const result = resolveWhatsAppReactionLevel({ cfg });
<<<<<<< HEAD
    expectReactionFlags(result, {
=======
    expect(result).toEqual({
>>>>>>> upstream/main
      level: "ack",
      ackEnabled: true,
      agentReactionsEnabled: false,
    });
  });

  it("returns minimal level with agent reactions enabled and minimal guidance", () => {
    const cfg: OpenClawConfig = {
      channels: { whatsapp: { reactionLevel: "minimal" } },
    };

    const result = resolveWhatsAppReactionLevel({ cfg });
<<<<<<< HEAD
    expectReactionFlags(result, {
=======
    expect(result).toEqual({
>>>>>>> upstream/main
      level: "minimal",
      ackEnabled: false,
      agentReactionsEnabled: true,
      agentReactionGuidance: "minimal",
    });
  });

  it("returns extensive level with agent reactions enabled and extensive guidance", () => {
    const cfg: OpenClawConfig = {
      channels: { whatsapp: { reactionLevel: "extensive" } },
    };

    const result = resolveWhatsAppReactionLevel({ cfg });
<<<<<<< HEAD
    expectReactionFlags(result, {
=======
    expect(result).toEqual({
>>>>>>> upstream/main
      level: "extensive",
      ackEnabled: false,
      agentReactionsEnabled: true,
      agentReactionGuidance: "extensive",
    });
  });

  it("resolves reaction level from a specific account", () => {
    const cfg: OpenClawConfig = {
      channels: {
        whatsapp: {
          reactionLevel: "minimal",
          accounts: {
            work: { reactionLevel: "extensive" },
          },
        },
      },
    };

    const result = resolveWhatsAppReactionLevel({ cfg, accountId: "work" });
<<<<<<< HEAD
    expectReactionFlags(result, {
=======
    expect(result).toEqual({
>>>>>>> upstream/main
      level: "extensive",
      ackEnabled: false,
      agentReactionsEnabled: true,
      agentReactionGuidance: "extensive",
    });
  });
});
