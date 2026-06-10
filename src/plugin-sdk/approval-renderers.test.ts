<<<<<<< HEAD
=======
/**
 * Tests approval renderer payload and text formatting.
 */
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import {
  buildApprovalPendingReplyPayload,
  buildApprovalResolvedReplyPayload,
  buildPluginApprovalPendingReplyPayload,
  buildPluginApprovalResolvedReplyPayload,
} from "./approval-renderers.js";

describe("plugin-sdk/approval-renderers", () => {
  it.each([
    {
<<<<<<< HEAD
      name: "builds shared approval payloads with generic interactive commands",
=======
      name: "builds shared approval payloads with generic presentation commands",
>>>>>>> upstream/main
      payload: buildApprovalPendingReplyPayload({
        approvalId: "plugin:approval-123",
        approvalSlug: "plugin:a",
        text: "Approval required @everyone",
      }),
      textExpected: (text: string) => expect(text).toContain("@everyone"),
<<<<<<< HEAD
      interactiveExpected: {
=======
      presentationExpected: {
>>>>>>> upstream/main
        blocks: [
          {
            type: "buttons",
            buttons: [
              {
                label: "Allow Once",
<<<<<<< HEAD
=======
                action: {
                  type: "command",
                  command: "/approve plugin:approval-123 allow-once",
                },
>>>>>>> upstream/main
                value: "/approve plugin:approval-123 allow-once",
                style: "success",
              },
              {
                label: "Allow Always",
<<<<<<< HEAD
=======
                action: {
                  type: "command",
                  command: "/approve plugin:approval-123 allow-always",
                },
>>>>>>> upstream/main
                value: "/approve plugin:approval-123 allow-always",
                style: "primary",
              },
              {
                label: "Deny",
<<<<<<< HEAD
=======
                action: {
                  type: "command",
                  command: "/approve plugin:approval-123 deny",
                },
>>>>>>> upstream/main
                value: "/approve plugin:approval-123 deny",
                style: "danger",
              },
            ],
          },
        ],
      },
      channelDataExpected: undefined,
    },
    {
      name: "builds plugin pending payloads with approval metadata and extra channel data",
      payload: buildPluginApprovalPendingReplyPayload({
        request: {
          id: "plugin-approval-123",
          request: {
            title: "Sensitive action",
            description: "Needs approval",
          },
          createdAtMs: 1_000,
          expiresAtMs: 61_000,
        },
        nowMs: 1_000,
        approvalSlug: "custom-slug",
        channelData: {
          telegram: {
            quoteText: "quoted",
          },
        },
      }),
      textExpected: (text: string) => expect(text).toContain("Plugin approval required"),
<<<<<<< HEAD
      interactiveExpected: {
=======
      presentationExpected: {
>>>>>>> upstream/main
        blocks: [
          {
            type: "buttons",
            buttons: [
              {
                label: "Allow Once",
<<<<<<< HEAD
=======
                action: {
                  type: "command",
                  command: "/approve plugin-approval-123 allow-once",
                },
>>>>>>> upstream/main
                value: "/approve plugin-approval-123 allow-once",
                style: "success",
              },
              {
                label: "Allow Always",
<<<<<<< HEAD
=======
                action: {
                  type: "command",
                  command: "/approve plugin-approval-123 allow-always",
                },
>>>>>>> upstream/main
                value: "/approve plugin-approval-123 allow-always",
                style: "primary",
              },
              {
                label: "Deny",
<<<<<<< HEAD
=======
                action: {
                  type: "command",
                  command: "/approve plugin-approval-123 deny",
                },
>>>>>>> upstream/main
                value: "/approve plugin-approval-123 deny",
                style: "danger",
              },
            ],
          },
        ],
      },
      channelDataExpected: {
        execApproval: {
          agentId: undefined,
          approvalId: "plugin-approval-123",
          approvalKind: "plugin",
          approvalSlug: "custom-slug",
          allowedDecisions: ["allow-once", "allow-always", "deny"],
          sessionKey: undefined,
          state: "pending",
        },
        telegram: {
          quoteText: "quoted",
        },
      },
    },
    {
<<<<<<< HEAD
=======
      name: "builds plugin pending payloads with request-scoped decisions",
      payload: buildPluginApprovalPendingReplyPayload({
        request: {
          id: "plugin-approval-123",
          request: {
            title: "Sensitive action",
            description: "Needs approval",
            allowedDecisions: ["allow-once", "deny"],
          },
          createdAtMs: 1_000,
          expiresAtMs: 61_000,
        },
        nowMs: 1_000,
      }),
      textExpected: (text: string) =>
        expect(text).toContain("Reply with: /approve plugin-approval-123 allow-once|deny"),
      presentationExpected: {
        blocks: [
          {
            type: "buttons",
            buttons: [
              {
                label: "Allow Once",
                action: {
                  type: "command",
                  command: "/approve plugin-approval-123 allow-once",
                },
                value: "/approve plugin-approval-123 allow-once",
                style: "success",
              },
              {
                label: "Deny",
                action: {
                  type: "command",
                  command: "/approve plugin-approval-123 deny",
                },
                value: "/approve plugin-approval-123 deny",
                style: "danger",
              },
            ],
          },
        ],
      },
      channelDataExpected: {
        execApproval: {
          agentId: undefined,
          approvalId: "plugin-approval-123",
          approvalKind: "plugin",
          approvalSlug: "plugin-a",
          allowedDecisions: ["allow-once", "deny"],
          sessionKey: undefined,
          state: "pending",
        },
      },
    },
    {
>>>>>>> upstream/main
      name: "builds generic resolved payloads with approval metadata",
      payload: buildApprovalResolvedReplyPayload({
        approvalId: "req-123",
        approvalSlug: "req-123",
        text: "resolved @everyone",
      }),
      textExpected: (text: string) => expect(text).toBe("resolved @everyone"),
<<<<<<< HEAD
      interactiveExpected: undefined,
=======
      presentationExpected: undefined,
>>>>>>> upstream/main
      channelDataExpected: {
        execApproval: {
          approvalId: "req-123",
          approvalSlug: "req-123",
          state: "resolved",
        },
      },
    },
    {
      name: "builds plugin resolved payloads with optional channel data",
      payload: buildPluginApprovalResolvedReplyPayload({
        resolved: {
          id: "plugin-approval-123",
          decision: "allow-once",
          resolvedBy: "discord:user:1",
          ts: 2_000,
        },
        channelData: {
          discord: {
            components: [{ type: "container" }],
          },
        },
      }),
      textExpected: (text: string) => expect(text).toContain("Plugin approval allowed once"),
<<<<<<< HEAD
      interactiveExpected: undefined,
=======
      presentationExpected: undefined,
>>>>>>> upstream/main
      channelDataExpected: {
        execApproval: {
          approvalId: "plugin-approval-123",
          approvalSlug: "plugin-a",
          state: "resolved",
        },
        discord: {
          components: [{ type: "container" }],
        },
      },
    },
<<<<<<< HEAD
  ])("$name", ({ payload, textExpected, interactiveExpected, channelDataExpected }) => {
    expect(payload.text).toBeDefined();
    if (payload.text !== undefined) {
      textExpected(payload.text);
    }
    if (interactiveExpected) {
      expect(payload.interactive).toEqual(interactiveExpected);
=======
  ])("$name", ({ payload, textExpected, presentationExpected, channelDataExpected }) => {
    if (payload.text === undefined) {
      throw new Error("expected rendered approval text");
    }
    textExpected(payload.text);
    if (presentationExpected) {
      expect(payload.presentation).toEqual(presentationExpected);
      expect(payload.interactive).toBeUndefined();
>>>>>>> upstream/main
    }
    if (channelDataExpected) {
      expect(payload.channelData).toEqual(channelDataExpected);
    }
  });
});
