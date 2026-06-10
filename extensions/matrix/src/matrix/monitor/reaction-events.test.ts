<<<<<<< HEAD
=======
// Matrix tests cover reaction events plugin behavior.
>>>>>>> upstream/main
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearMatrixApprovalReactionTargetsForTest,
  registerMatrixApprovalReactionTarget,
  resolveMatrixApprovalReactionTarget,
} from "../../approval-reactions.js";
import type { CoreConfig } from "../../types.js";
import { handleInboundMatrixReaction } from "./reaction-events.js";

<<<<<<< HEAD
const resolveMatrixExecApproval = vi.fn();
=======
const resolveMatrixApproval = vi.fn();
type MatrixReactionParams = Parameters<typeof handleInboundMatrixReaction>[0];
type MatrixReactionClient = MatrixReactionParams["client"];
type MatrixReactionCore = MatrixReactionParams["core"];
type MatrixReactionEvent = MatrixReactionParams["event"];
>>>>>>> upstream/main

vi.mock("../../exec-approval-resolver.js", () => ({
  isApprovalNotFoundError: (err: unknown) =>
    err instanceof Error && /unknown or expired approval id/i.test(err.message),
<<<<<<< HEAD
  resolveMatrixExecApproval: (...args: unknown[]) => resolveMatrixExecApproval(...args),
}));

beforeEach(() => {
  resolveMatrixExecApproval.mockReset();
=======
  resolveMatrixApproval: (...args: unknown[]) => resolveMatrixApproval(...args),
}));

beforeEach(() => {
  resolveMatrixApproval.mockReset();
>>>>>>> upstream/main
  clearMatrixApprovalReactionTargetsForTest();
});

function buildConfig(): CoreConfig {
  return {
    channels: {
      matrix: {
        homeserver: "https://matrix.example.org",
        userId: "@bot:example.org",
        accessToken: "tok",
        reactionNotifications: "own",
        execApprovals: {
          enabled: true,
          approvers: ["@owner:example.org"],
          target: "channel",
        },
      },
    },
  } as CoreConfig;
}

function buildCore() {
  return {
    channel: {
      routing: {
        resolveAgentRoute: vi.fn().mockReturnValue({
          sessionKey: "agent:main:matrix:channel:!ops:example.org",
          mainSessionKey: "agent:main:matrix:channel:!ops:example.org",
          agentId: "main",
          matchedBy: "peer",
        }),
      },
    },
    system: {
      enqueueSystemEvent: vi.fn(),
    },
  } as unknown as Parameters<typeof handleInboundMatrixReaction>[0]["core"];
}

<<<<<<< HEAD
describe("matrix approval reactions", () => {
  it("resolves approval reactions instead of enqueueing a generic reaction event", async () => {
    const core = buildCore();
=======
function createReactionClient(
  getEvent: ReturnType<typeof vi.fn> = vi.fn(),
): MatrixReactionClient & { getEvent: ReturnType<typeof vi.fn> } {
  return { getEvent } as unknown as MatrixReactionClient & {
    getEvent: ReturnType<typeof vi.fn>;
  };
}

function createReactionEvent(
  params: {
    eventId?: string;
    targetEventId?: string;
    reactionKey?: string;
  } = {},
): MatrixReactionEvent {
  return {
    event_id: params.eventId ?? "$reaction-1",
    sender: "@owner:example.org",
    type: "m.reaction",
    origin_server_ts: 123,
    content: {
      "m.relates_to": {
        rel_type: "m.annotation",
        event_id: params.targetEventId ?? "$approval-msg",
        key: params.reactionKey ?? "✅",
      },
    },
  } as MatrixReactionEvent;
}

async function handleReaction(params: {
  client: MatrixReactionClient;
  core: MatrixReactionCore;
  cfg?: CoreConfig;
  targetEventId?: string;
  reactionKey?: string;
}): Promise<void> {
  await handleInboundMatrixReaction({
    client: params.client,
    core: params.core,
    cfg: params.cfg ?? buildConfig(),
    accountId: "default",
    roomId: "!ops:example.org",
    event: createReactionEvent({
      targetEventId: params.targetEventId,
      reactionKey: params.reactionKey,
    }),
    senderId: "@owner:example.org",
    senderLabel: "Owner",
    selfUserId: "@bot:example.org",
    isDirectMessage: false,
    logVerboseMessage: vi.fn(),
  });
}

describe("matrix approval reactions", () => {
  it("resolves approval reactions instead of enqueueing a generic reaction event", async () => {
    const core = buildCore();
    const cfg = buildConfig();
>>>>>>> upstream/main
    registerMatrixApprovalReactionTarget({
      roomId: "!ops:example.org",
      eventId: "$approval-msg",
      approvalId: "req-123",
      allowedDecisions: ["allow-once", "allow-always", "deny"],
    });
<<<<<<< HEAD
    const client = {
      getEvent: vi.fn().mockResolvedValue({
=======
    const client = createReactionClient(
      vi.fn().mockResolvedValue({
>>>>>>> upstream/main
        event_id: "$approval-msg",
        sender: "@bot:example.org",
        content: { body: "approval prompt" },
      }),
<<<<<<< HEAD
    } as unknown as Parameters<typeof handleInboundMatrixReaction>[0]["client"];

    await handleInboundMatrixReaction({
      client,
      core,
      cfg: buildConfig(),
      accountId: "default",
      roomId: "!ops:example.org",
      event: {
        event_id: "$reaction-1",
        origin_server_ts: 123,
        content: {
          "m.relates_to": {
            rel_type: "m.annotation",
            event_id: "$approval-msg",
            key: "✅",
          },
        },
      } as never,
      senderId: "@owner:example.org",
      senderLabel: "Owner",
      selfUserId: "@bot:example.org",
      isDirectMessage: false,
      logVerboseMessage: vi.fn(),
    });

    expect(resolveMatrixExecApproval).toHaveBeenCalledWith({
      cfg: buildConfig(),
=======
    );

    await handleReaction({
      client,
      core,
      cfg,
    });

    expect(resolveMatrixApproval).toHaveBeenCalledWith({
      cfg,
>>>>>>> upstream/main
      approvalId: "req-123",
      decision: "allow-once",
      senderId: "@owner:example.org",
    });
    expect(core.system.enqueueSystemEvent).not.toHaveBeenCalled();
  });

  it("keeps ordinary reactions on bot messages as generic reaction events", async () => {
    const core = buildCore();
<<<<<<< HEAD
    const client = {
      getEvent: vi.fn().mockResolvedValue({
=======
    const client = createReactionClient(
      vi.fn().mockResolvedValue({
>>>>>>> upstream/main
        event_id: "$msg-1",
        sender: "@bot:example.org",
        content: {
          body: "normal bot message",
        },
      }),
<<<<<<< HEAD
    } as unknown as Parameters<typeof handleInboundMatrixReaction>[0]["client"];

    await handleInboundMatrixReaction({
      client,
      core,
      cfg: buildConfig(),
      accountId: "default",
      roomId: "!ops:example.org",
      event: {
        event_id: "$reaction-1",
        origin_server_ts: 123,
        content: {
          "m.relates_to": {
            rel_type: "m.annotation",
            event_id: "$msg-1",
            key: "👍",
          },
        },
      } as never,
      senderId: "@owner:example.org",
      senderLabel: "Owner",
      selfUserId: "@bot:example.org",
      isDirectMessage: false,
      logVerboseMessage: vi.fn(),
    });

    expect(resolveMatrixExecApproval).not.toHaveBeenCalled();
    expect(core.system.enqueueSystemEvent).toHaveBeenCalledWith(
      "Matrix reaction added: 👍 by Owner on msg $msg-1",
      expect.objectContaining({
        contextKey: "matrix:reaction:add:!ops:example.org:$msg-1:@owner:example.org:👍",
      }),
=======
    );

    await handleReaction({
      client,
      core,
      targetEventId: "$msg-1",
      reactionKey: "👍",
    });

    expect(resolveMatrixApproval).not.toHaveBeenCalled();
    expect(core.system.enqueueSystemEvent).toHaveBeenCalledWith(
      "Matrix reaction added: 👍 by Owner on msg $msg-1",
      {
        sessionKey: "agent:main:matrix:channel:!ops:example.org",
        contextKey: "matrix:reaction:add:!ops:example.org:$msg-1:@owner:example.org:👍",
      },
>>>>>>> upstream/main
    );
  });

  it("still resolves approval reactions when generic reaction notifications are off", async () => {
    const core = buildCore();
    const cfg = buildConfig();
    const matrixCfg = cfg.channels?.matrix;
    if (!matrixCfg) {
      throw new Error("matrix config missing");
    }
    matrixCfg.reactionNotifications = "off";
    registerMatrixApprovalReactionTarget({
      roomId: "!ops:example.org",
      eventId: "$approval-msg",
      approvalId: "req-123",
      allowedDecisions: ["deny"],
    });
<<<<<<< HEAD
    const client = {
      getEvent: vi.fn().mockResolvedValue({
=======
    const client = createReactionClient(
      vi.fn().mockResolvedValue({
>>>>>>> upstream/main
        event_id: "$approval-msg",
        sender: "@bot:example.org",
        content: { body: "approval prompt" },
      }),
<<<<<<< HEAD
    } as unknown as Parameters<typeof handleInboundMatrixReaction>[0]["client"];

    await handleInboundMatrixReaction({
      client,
      core,
      cfg,
      accountId: "default",
      roomId: "!ops:example.org",
      event: {
        event_id: "$reaction-1",
        origin_server_ts: 123,
        content: {
          "m.relates_to": {
            rel_type: "m.annotation",
            event_id: "$approval-msg",
            key: "❌",
          },
        },
      } as never,
      senderId: "@owner:example.org",
      senderLabel: "Owner",
      selfUserId: "@bot:example.org",
      isDirectMessage: false,
      logVerboseMessage: vi.fn(),
    });

    expect(resolveMatrixExecApproval).toHaveBeenCalledWith({
=======
    );

    await handleReaction({
      client,
      core,
      cfg,
      reactionKey: "❌",
    });

    expect(resolveMatrixApproval).toHaveBeenCalledWith({
>>>>>>> upstream/main
      cfg,
      approvalId: "req-123",
      decision: "deny",
      senderId: "@owner:example.org",
    });
    expect(core.system.enqueueSystemEvent).not.toHaveBeenCalled();
  });

  it("resolves registered approval reactions without fetching the target event", async () => {
    const core = buildCore();
    registerMatrixApprovalReactionTarget({
      roomId: "!ops:example.org",
      eventId: "$approval-msg",
      approvalId: "req-123",
      allowedDecisions: ["allow-once"],
    });
<<<<<<< HEAD
    const client = {
      getEvent: vi.fn().mockRejectedValue(new Error("boom")),
    } as unknown as Parameters<typeof handleInboundMatrixReaction>[0]["client"];

    await handleInboundMatrixReaction({
      client,
      core,
      cfg: buildConfig(),
      accountId: "default",
      roomId: "!ops:example.org",
      event: {
        event_id: "$reaction-1",
        origin_server_ts: 123,
        content: {
          "m.relates_to": {
            rel_type: "m.annotation",
            event_id: "$approval-msg",
            key: "✅",
          },
        },
      } as never,
      senderId: "@owner:example.org",
      senderLabel: "Owner",
      selfUserId: "@bot:example.org",
      isDirectMessage: false,
      logVerboseMessage: vi.fn(),
    });

    expect(client.getEvent).not.toHaveBeenCalled();
    expect(resolveMatrixExecApproval).toHaveBeenCalledWith({
=======
    const client = createReactionClient(vi.fn().mockRejectedValue(new Error("boom")));

    await handleReaction({
      client,
      core,
    });

    expect(client.getEvent).not.toHaveBeenCalled();
    expect(resolveMatrixApproval).toHaveBeenCalledWith({
>>>>>>> upstream/main
      cfg: buildConfig(),
      approvalId: "req-123",
      decision: "allow-once",
      senderId: "@owner:example.org",
    });
    expect(core.system.enqueueSystemEvent).not.toHaveBeenCalled();
  });

<<<<<<< HEAD
  it("unregisters stale approval anchors after not-found resolution", async () => {
    const core = buildCore();
    resolveMatrixExecApproval.mockRejectedValueOnce(
=======
  it("resolves plugin approval reactions through the same Matrix reaction path", async () => {
    const core = buildCore();
    const cfg = buildConfig();
    const matrixCfg = cfg.channels?.matrix;
    if (!matrixCfg) {
      throw new Error("matrix config missing");
    }
    matrixCfg.dm = { allowFrom: ["@owner:example.org"] };
    registerMatrixApprovalReactionTarget({
      roomId: "!ops:example.org",
      eventId: "$plugin-approval-msg",
      approvalId: "plugin:req-123",
      allowedDecisions: ["allow-once", "deny"],
    });
    const client = createReactionClient();

    await handleReaction({
      client,
      core,
      cfg,
      targetEventId: "$plugin-approval-msg",
    });

    expect(client.getEvent).not.toHaveBeenCalled();
    expect(resolveMatrixApproval).toHaveBeenCalledWith({
      cfg,
      approvalId: "plugin:req-123",
      decision: "allow-once",
      senderId: "@owner:example.org",
    });
    expect(core.system.enqueueSystemEvent).not.toHaveBeenCalled();
  });

  it("unregisters stale approval anchors after not-found resolution", async () => {
    const core = buildCore();
    resolveMatrixApproval.mockRejectedValueOnce(
>>>>>>> upstream/main
      new Error("unknown or expired approval id req-123"),
    );
    registerMatrixApprovalReactionTarget({
      roomId: "!ops:example.org",
      eventId: "$approval-msg",
      approvalId: "req-123",
      allowedDecisions: ["deny"],
    });
<<<<<<< HEAD
    const client = {
      getEvent: vi.fn(),
    } as unknown as Parameters<typeof handleInboundMatrixReaction>[0]["client"];

    await handleInboundMatrixReaction({
      client,
      core,
      cfg: buildConfig(),
      accountId: "default",
      roomId: "!ops:example.org",
      event: {
        event_id: "$reaction-1",
        origin_server_ts: 123,
        content: {
          "m.relates_to": {
            rel_type: "m.annotation",
            event_id: "$approval-msg",
            key: "❌",
          },
        },
      } as never,
      senderId: "@owner:example.org",
      senderLabel: "Owner",
      selfUserId: "@bot:example.org",
      isDirectMessage: false,
      logVerboseMessage: vi.fn(),
=======
    const client = createReactionClient();

    await handleReaction({
      client,
      core,
      reactionKey: "❌",
>>>>>>> upstream/main
    });

    expect(client.getEvent).not.toHaveBeenCalled();
    expect(
      resolveMatrixApprovalReactionTarget({
        roomId: "!ops:example.org",
        eventId: "$approval-msg",
        reactionKey: "❌",
      }),
    ).toBeNull();
  });

  it("skips target fetches for ordinary reactions when notifications are off", async () => {
    const core = buildCore();
    const cfg = buildConfig();
    const matrixCfg = cfg.channels?.matrix;
    if (!matrixCfg) {
      throw new Error("matrix config missing");
    }
    matrixCfg.reactionNotifications = "off";
<<<<<<< HEAD
    const client = {
      getEvent: vi.fn(),
    } as unknown as Parameters<typeof handleInboundMatrixReaction>[0]["client"];

    await handleInboundMatrixReaction({
      client,
      core,
      cfg,
      accountId: "default",
      roomId: "!ops:example.org",
      event: {
        event_id: "$reaction-1",
        origin_server_ts: 123,
        content: {
          "m.relates_to": {
            rel_type: "m.annotation",
            event_id: "$msg-1",
            key: "👍",
          },
        },
      } as never,
      senderId: "@owner:example.org",
      senderLabel: "Owner",
      selfUserId: "@bot:example.org",
      isDirectMessage: false,
      logVerboseMessage: vi.fn(),
    });

    expect(client.getEvent).not.toHaveBeenCalled();
    expect(resolveMatrixExecApproval).not.toHaveBeenCalled();
=======
    const client = createReactionClient();

    await handleReaction({
      client,
      core,
      cfg,
      targetEventId: "$msg-1",
      reactionKey: "👍",
    });

    expect(client.getEvent).not.toHaveBeenCalled();
    expect(resolveMatrixApproval).not.toHaveBeenCalled();
>>>>>>> upstream/main
    expect(core.system.enqueueSystemEvent).not.toHaveBeenCalled();
  });
});
