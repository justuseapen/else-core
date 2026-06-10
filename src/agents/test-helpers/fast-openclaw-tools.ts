<<<<<<< HEAD
=======
/**
 * Fast OpenClaw tool-bundle mock.
 *
 * Provides lightweight built-in tool stubs for inventory-heavy tests.
 */
>>>>>>> upstream/main
import { vi } from "vitest";
import { stubTool } from "./fast-tool-stubs.js";

function stubActionTool(name: string, actions: string[]) {
  return {
    ...stubTool(name),
    parameters: {
      type: "object" as const,
      properties: {
        action: {
          type: "string" as const,
          enum: actions,
        },
      },
      required: ["action"],
    },
  };
}

const coreTools = [
  stubActionTool("canvas", ["create", "read"]),
  stubActionTool("nodes", ["list", "invoke"]),
  stubActionTool("cron", ["schedule", "cancel"]),
  stubActionTool("message", ["send", "reply"]),
<<<<<<< HEAD
  stubActionTool("gateway", ["status"]),
=======
  stubTool("heartbeat_respond"),
  stubActionTool("gateway", [
    "restart",
    "config.get",
    "config.schema.lookup",
    "config.apply",
    "config.patch",
    "update.run",
  ]),
>>>>>>> upstream/main
  stubActionTool("agents_list", ["list", "show"]),
  stubActionTool("sessions_list", ["list", "show"]),
  stubActionTool("sessions_history", ["read", "tail"]),
  stubActionTool("sessions_send", ["send", "reply"]),
  stubActionTool("sessions_spawn", ["spawn", "handoff"]),
  stubActionTool("subagents", ["list", "show"]),
  stubActionTool("session_status", ["get", "show"]),
<<<<<<< HEAD
=======
  stubTool("skill_workshop"),
  stubActionTool("browser", ["status", "snapshot"]),
>>>>>>> upstream/main
  stubTool("tts"),
  stubTool("image_generate"),
  stubTool("video_generate"),
  stubTool("web_fetch"),
  stubTool("image"),
  stubTool("pdf"),
];

<<<<<<< HEAD
vi.mock("../openclaw-tools.js", () => ({
  createOpenClawTools: () => coreTools.map((tool) => ({ ...tool })),
  __testing: {
=======
const createOpenClawToolsMock = vi.fn(
  (options?: { enableHeartbeatTool?: boolean; recordToolPrepStage?: (name: string) => void }) => {
    options?.recordToolPrepStage?.("openclaw-tools:test-helper");
    return coreTools
      .filter((tool) => tool.name !== "heartbeat_respond" || options?.enableHeartbeatTool === true)
      .map((tool) => Object.assign({}, tool));
  },
);

// Preserve action enums for tools whose tests assert schema/inventory behavior without paying the
// cost of constructing the real tool bundle.
vi.mock("../openclaw-tools.js", () => ({
  createOpenClawTools: createOpenClawToolsMock,
  testing: {
>>>>>>> upstream/main
    setDepsForTest: () => {},
  },
}));
