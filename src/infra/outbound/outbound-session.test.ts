<<<<<<< HEAD
=======
// Covers outbound session-route resolution through plugin hooks and fallback
// target parsing, plus best-effort session metadata persistence.
>>>>>>> upstream/main
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import { ensureOutboundSessionEntry, resolveOutboundSessionRoute } from "./outbound-session.js";
import { setMinimalOutboundSessionPluginRegistryForTests } from "./outbound-session.test-helpers.js";

<<<<<<< HEAD
const mocks = vi.hoisted(() => ({
  recordSessionMetaFromInbound: vi.fn(async () => ({ ok: true })),
=======
type InboundMetadataParams = {
  sessionKey?: string;
  storePath?: string;
};

const mocks = vi.hoisted(() => ({
  recordSessionMetaFromInbound: vi.fn(async (_params: InboundMetadataParams) => ({ ok: true })),
>>>>>>> upstream/main
  resolveStorePath: vi.fn(
    (_store: unknown, params?: { agentId?: string }) => `/stores/${params?.agentId ?? "main"}.json`,
  ),
}));

<<<<<<< HEAD
=======
function firstMockArg(
  mock: { mock: { calls: readonly unknown[][] } },
  label: string,
): Record<string, unknown> {
  const [call] = mock.mock.calls;
  if (!call) {
    throw new Error(`expected ${label} call`);
  }
  const [arg] = call;
  if (typeof arg !== "object" || arg === null || Array.isArray(arg)) {
    throw new Error(`expected ${label} params to be an object`);
  }
  return arg as Record<string, unknown>;
}

>>>>>>> upstream/main
vi.mock("../../config/sessions/inbound.runtime.js", () => ({
  recordSessionMetaFromInbound: mocks.recordSessionMetaFromInbound,
  resolveStorePath: mocks.resolveStorePath,
}));

describe("resolveOutboundSessionRoute", () => {
  beforeEach(() => {
    mocks.recordSessionMetaFromInbound.mockClear();
    mocks.resolveStorePath.mockClear();
    setMinimalOutboundSessionPluginRegistryForTests();
  });

  const baseConfig = {} as OpenClawConfig;
  const perChannelPeerCfg = { session: { dmScope: "per-channel-peer" } } as OpenClawConfig;
  const identityLinksCfg = {
    session: {
      dmScope: "per-peer",
      identityLinks: {
<<<<<<< HEAD
        alice: ["discord:123"],
      },
    },
  } as OpenClawConfig;
  const slackMpimCfg = {
    channels: {
      slack: {
=======
        alice: ["guildchat:123"],
      },
    },
  } as OpenClawConfig;
  const workspaceMpimCfg = {
    channels: {
      workspace: {
>>>>>>> upstream/main
        dm: {
          groupChannels: ["G123"],
        },
      },
    },
  } as OpenClawConfig;

  async function expectResolvedRoute(params: {
    cfg: OpenClawConfig;
    channel: string;
    target: string;
    replyToId?: string;
    threadId?: string;
    expected: {
      sessionKey: string;
      from?: string;
      to?: string;
      threadId?: string | number;
      chatType?: "channel" | "direct" | "group";
    };
  }) {
    const route = await resolveOutboundSessionRoute({
      cfg: params.cfg,
      channel: params.channel,
      agentId: "main",
      target: params.target,
      replyToId: params.replyToId,
      threadId: params.threadId,
    });
    expect(route?.sessionKey).toBe(params.expected.sessionKey);
    if (params.expected.from !== undefined) {
      expect(route?.from).toBe(params.expected.from);
    }
    if (params.expected.to !== undefined) {
      expect(route?.to).toBe(params.expected.to);
    }
    if (params.expected.threadId !== undefined) {
      expect(route?.threadId).toBe(params.expected.threadId);
    }
    if (params.expected.chatType !== undefined) {
      expect(route?.chatType).toBe(params.expected.chatType);
    }
  }

  type RouteCase = Parameters<typeof expectResolvedRoute>[0];
  type NamedRouteCase = RouteCase & { name: string };

  const perChannelPeerSessionCfg = { session: { dmScope: "per-channel-peer" } } as OpenClawConfig;

  it.each([
    {
<<<<<<< HEAD
      name: "WhatsApp group jid",
      cfg: baseConfig,
      channel: "whatsapp",
      target: "120363040000000000@g.us",
      expected: {
        sessionKey: "agent:main:whatsapp:group:120363040000000000@g.us",
=======
      name: "MobileChat group jid",
      cfg: baseConfig,
      channel: "mobilechat",
      target: "120363040000000000@g.us",
      expected: {
        sessionKey: "agent:main:mobilechat:group:120363040000000000@g.us",
>>>>>>> upstream/main
        from: "120363040000000000@g.us",
        to: "120363040000000000@g.us",
        chatType: "group",
      },
    },
    {
      name: "Matrix room target",
      cfg: baseConfig,
      channel: "matrix",
      target: "room:!ops:matrix.example",
      expected: {
        sessionKey: "agent:main:matrix:channel:!ops:matrix.example",
        from: "matrix:channel:!ops:matrix.example",
        to: "room:!ops:matrix.example",
        chatType: "channel",
      },
    },
    {
<<<<<<< HEAD
      name: "MSTeams conversation target",
      cfg: baseConfig,
      channel: "msteams",
      target: "conversation:19:meeting_abc@thread.tacv2",
      expected: {
        sessionKey: "agent:main:msteams:channel:19:meeting_abc@thread.tacv2",
        from: "msteams:channel:19:meeting_abc@thread.tacv2",
=======
      name: "MeetingChat conversation target",
      cfg: baseConfig,
      channel: "meetingchat",
      target: "conversation:19:meeting_abc@thread.tacv2",
      expected: {
        sessionKey: "agent:main:meetingchat:channel:19:meeting_abc@thread.tacv2",
        from: "meetingchat:channel:19:meeting_abc@thread.tacv2",
>>>>>>> upstream/main
        to: "conversation:19:meeting_abc@thread.tacv2",
        chatType: "channel",
      },
    },
    {
<<<<<<< HEAD
      name: "Slack thread",
      cfg: baseConfig,
      channel: "slack",
      target: "channel:C123",
      replyToId: "456",
      expected: {
        sessionKey: "agent:main:slack:channel:c123:thread:456",
        from: "slack:channel:C123",
=======
      name: "Workspace thread",
      cfg: baseConfig,
      channel: "workspace",
      target: "channel:C123",
      replyToId: "456",
      expected: {
        sessionKey: "agent:main:workspace:channel:c123:thread:456",
        from: "workspace:channel:C123",
>>>>>>> upstream/main
        to: "channel:C123",
        threadId: "456",
      },
    },
    {
<<<<<<< HEAD
      name: "Telegram topic group",
      cfg: baseConfig,
      channel: "telegram",
      target: "-100123456:topic:42",
      expected: {
        sessionKey: "agent:main:telegram:group:-100123456:topic:42",
        from: "telegram:group:-100123456:topic:42",
        to: "telegram:-100123456",
=======
      name: "Forum topic group",
      cfg: baseConfig,
      channel: "forum",
      target: "-100123456:topic:42",
      expected: {
        sessionKey: "agent:main:forum:group:-100123456:topic:42",
        from: "forum:group:-100123456:topic:42",
        to: "forum:-100123456",
>>>>>>> upstream/main
        threadId: 42,
      },
    },
    {
<<<<<<< HEAD
      name: "Telegram DM with topic",
      cfg: perChannelPeerCfg,
      channel: "telegram",
      target: "123456789:topic:99",
      expected: {
        sessionKey: "agent:main:telegram:direct:123456789:thread:99",
        from: "telegram:123456789:topic:99",
        to: "telegram:123456789",
=======
      name: "Forum DM with topic",
      cfg: perChannelPeerCfg,
      channel: "forum",
      target: "123456789:topic:99",
      expected: {
        sessionKey: "agent:main:forum:direct:123456789:thread:99",
        from: "forum:123456789:topic:99",
        to: "forum:123456789",
>>>>>>> upstream/main
        threadId: 99,
        chatType: "direct",
      },
    },
    {
<<<<<<< HEAD
      name: "Telegram unresolved username DM",
      cfg: perChannelPeerCfg,
      channel: "telegram",
      target: "@alice",
      expected: {
        sessionKey: "agent:main:telegram:direct:@alice",
=======
      name: "Forum unresolved username DM",
      cfg: perChannelPeerCfg,
      channel: "forum",
      target: "@alice",
      expected: {
        sessionKey: "agent:main:forum:direct:@alice",
>>>>>>> upstream/main
        chatType: "direct",
      },
    },
    {
<<<<<<< HEAD
      name: "Telegram DM scoped threadId fallback",
      cfg: perChannelPeerCfg,
      channel: "telegram",
      target: "12345",
      threadId: "12345:99",
      expected: {
        sessionKey: "agent:main:telegram:direct:12345:thread:99",
        from: "telegram:12345:topic:99",
        to: "telegram:12345",
=======
      name: "Forum DM scoped threadId fallback",
      cfg: perChannelPeerCfg,
      channel: "forum",
      target: "12345",
      threadId: "12345:99",
      expected: {
        sessionKey: "agent:main:forum:direct:12345:thread:99",
        from: "forum:12345:topic:99",
        to: "forum:12345",
>>>>>>> upstream/main
        threadId: 99,
        chatType: "direct",
      },
    },
    {
      name: "identity-links per-peer",
      cfg: identityLinksCfg,
<<<<<<< HEAD
      channel: "discord",
=======
      channel: "guildchat",
>>>>>>> upstream/main
      target: "user:123",
      expected: {
        sessionKey: "agent:main:direct:alice",
      },
    },
    {
      name: "Nextcloud Talk room target",
      cfg: baseConfig,
      channel: "nextcloud-talk",
      target: "room:opsroom42",
      expected: {
        sessionKey: "agent:main:nextcloud-talk:group:opsroom42",
        from: "nextcloud-talk:room:opsroom42",
        to: "nextcloud-talk:opsroom42",
        chatType: "group",
      },
    },
    {
<<<<<<< HEAD
      name: "BlueBubbles chat_* prefix stripping",
      cfg: baseConfig,
      channel: "bluebubbles",
      target: "chat_guid:ABC123",
      expected: {
        sessionKey: "agent:main:bluebubbles:group:abc123",
=======
      name: "LocalChat chat_* prefix stripping",
      cfg: baseConfig,
      channel: "localchat",
      target: "chat_guid:ABC123",
      expected: {
        sessionKey: "agent:main:localchat:group:abc123",
>>>>>>> upstream/main
        from: "group:ABC123",
      },
    },
    {
      name: "Zalo direct target",
      cfg: perChannelPeerCfg,
      channel: "zalo",
      target: "zl:123456",
      expected: {
        sessionKey: "agent:main:zalo:direct:123456",
        from: "zalo:123456",
        to: "zalo:123456",
        chatType: "direct",
      },
    },
    {
      name: "Zalo Personal DM target",
      cfg: perChannelPeerCfg,
      channel: "zalouser",
      target: "123456",
      expected: {
        sessionKey: "agent:main:zalouser:direct:123456",
        chatType: "direct",
      },
    },
    {
      name: "Nostr prefixed target",
      cfg: perChannelPeerCfg,
      channel: "nostr",
      target: "nostr:npub1example",
      expected: {
        sessionKey: "agent:main:nostr:direct:npub1example",
        from: "nostr:npub1example",
        to: "nostr:npub1example",
        chatType: "direct",
      },
    },
    {
      name: "Tlon group target",
      cfg: baseConfig,
      channel: "tlon",
      target: "group:~zod/main",
      expected: {
        sessionKey: "agent:main:tlon:group:chat/~zod/main",
        from: "tlon:group:chat/~zod/main",
        to: "tlon:chat/~zod/main",
        chatType: "group",
      },
    },
    {
<<<<<<< HEAD
      name: "Slack mpim allowlist -> group key",
      cfg: slackMpimCfg,
      channel: "slack",
      target: "channel:G123",
      expected: {
        sessionKey: "agent:main:slack:group:g123",
        from: "slack:group:G123",
      },
    },
    {
      name: "Feishu explicit group prefix keeps group routing",
      cfg: baseConfig,
      channel: "feishu",
      target: "group:oc_group_chat",
      expected: {
        sessionKey: "agent:main:feishu:group:oc_group_chat",
        from: "feishu:group:oc_group_chat",
=======
      name: "Workspace group allowlist -> group key",
      cfg: workspaceMpimCfg,
      channel: "workspace",
      target: "channel:G123",
      expected: {
        sessionKey: "agent:main:workspace:group:g123",
        from: "workspace:group:G123",
      },
    },
    {
      name: "CollabChat explicit group prefix keeps group routing",
      cfg: baseConfig,
      channel: "collabchat",
      target: "group:oc_group_chat",
      expected: {
        sessionKey: "agent:main:collabchat:group:oc_group_chat",
        from: "collabchat:group:oc_group_chat",
>>>>>>> upstream/main
        to: "oc_group_chat",
        chatType: "group",
      },
    },
    {
<<<<<<< HEAD
      name: "Feishu explicit dm prefix keeps direct routing",
      cfg: perChannelPeerCfg,
      channel: "feishu",
      target: "dm:oc_dm_chat",
      expected: {
        sessionKey: "agent:main:feishu:direct:oc_dm_chat",
        from: "feishu:oc_dm_chat",
=======
      name: "CollabChat explicit dm prefix keeps direct routing",
      cfg: perChannelPeerCfg,
      channel: "collabchat",
      target: "dm:oc_dm_chat",
      expected: {
        sessionKey: "agent:main:collabchat:direct:oc_dm_chat",
        from: "collabchat:oc_dm_chat",
>>>>>>> upstream/main
        to: "oc_dm_chat",
        chatType: "direct",
      },
    },
    {
<<<<<<< HEAD
      name: "Feishu bare oc_ target defaults to direct routing",
      cfg: perChannelPeerCfg,
      channel: "feishu",
      target: "oc_ambiguous_chat",
      expected: {
        sessionKey: "agent:main:feishu:direct:oc_ambiguous_chat",
        from: "feishu:oc_ambiguous_chat",
=======
      name: "CollabChat bare oc_ target defaults to direct routing",
      cfg: perChannelPeerCfg,
      channel: "collabchat",
      target: "oc_ambiguous_chat",
      expected: {
        sessionKey: "agent:main:collabchat:direct:oc_ambiguous_chat",
        from: "collabchat:oc_ambiguous_chat",
>>>>>>> upstream/main
        to: "oc_ambiguous_chat",
        chatType: "direct",
      },
    },
    {
<<<<<<< HEAD
      name: "Slack user DM target",
      cfg: perChannelPeerCfg,
      channel: "slack",
      target: "user:U12345ABC",
      expected: {
        sessionKey: "agent:main:slack:direct:u12345abc",
        from: "slack:U12345ABC",
=======
      name: "Workspace user DM target",
      cfg: perChannelPeerCfg,
      channel: "workspace",
      target: "user:U12345ABC",
      expected: {
        sessionKey: "agent:main:workspace:direct:u12345abc",
        from: "workspace:U12345ABC",
>>>>>>> upstream/main
        to: "user:U12345ABC",
        chatType: "direct",
      },
    },
    {
<<<<<<< HEAD
      name: "Slack channel target without thread",
      cfg: baseConfig,
      channel: "slack",
      target: "channel:C999XYZ",
      expected: {
        sessionKey: "agent:main:slack:channel:c999xyz",
        from: "slack:channel:C999XYZ",
=======
      name: "Workspace channel target without thread",
      cfg: baseConfig,
      channel: "workspace",
      target: "channel:C999XYZ",
      expected: {
        sessionKey: "agent:main:workspace:channel:c999xyz",
        from: "workspace:channel:C999XYZ",
>>>>>>> upstream/main
        to: "channel:C999XYZ",
        chatType: "channel",
      },
    },
<<<<<<< HEAD
=======
    {
      name: "FallbackChat explicit group prefix",
      cfg: baseConfig,
      channel: "fallbackchat",
      target: "group:ops",
      expected: {
        sessionKey: "agent:main:fallbackchat:group:ops",
        from: "fallbackchat:group:ops",
        to: "channel:ops",
        chatType: "group",
      },
    },
    {
      name: "FallbackChat plugin parser classifies space-style target",
      cfg: baseConfig,
      channel: "fallbackchat",
      target: "spaces/AAA",
      expected: {
        sessionKey: "agent:main:fallbackchat:group:spaces/aaa",
        from: "fallbackchat:group:spaces/AAA",
        to: "channel:spaces/AAA",
        chatType: "group",
      },
    },
    {
      name: "FallbackChat explicit user prefix",
      cfg: perChannelPeerCfg,
      channel: "fallbackchat",
      target: "user:U123",
      expected: {
        sessionKey: "agent:main:fallbackchat:direct:u123",
        from: "fallbackchat:U123",
        to: "user:U123",
        chatType: "direct",
      },
    },
    {
      name: "FallbackChat explicit thread prefix",
      cfg: baseConfig,
      channel: "fallbackchat",
      target: "thread:abc",
      expected: {
        sessionKey: "agent:main:fallbackchat:channel:abc",
        from: "fallbackchat:channel:abc",
        to: "channel:abc",
        chatType: "channel",
      },
    },
    {
      name: "Legacy parser-only plugin chat type fallback",
      cfg: baseConfig,
      channel: "legacyparser",
      target: "team-ops",
      expected: {
        sessionKey: "agent:main:legacyparser:group:team-ops",
        from: "legacyparser:group:team-ops",
        to: "channel:team-ops",
        chatType: "group",
      },
    },
>>>>>>> upstream/main
  ] satisfies NamedRouteCase[])("$name", async ({ name: _name, ...params }) => {
    await expectResolvedRoute(params);
  });

  it.each([
    {
<<<<<<< HEAD
      name: "uses resolved Discord user targets to route bare numeric ids as DMs",
=======
      name: "uses resolved GuildChat user targets to route bare numeric ids as DMs",
>>>>>>> upstream/main
      target: "123",
      resolvedTarget: {
        to: "user:123",
        kind: "user" as const,
        source: "directory" as const,
<<<<<<< HEAD
      },
      expected: {
        sessionKey: "agent:main:discord:direct:123",
        from: "discord:123",
=======
        resolutionSource: "directory" as const,
      },
      expected: {
        sessionKey: "agent:main:guildchat:direct:123",
        from: "guildchat:123",
>>>>>>> upstream/main
        to: "user:123",
        chatType: "direct",
      },
    },
    {
<<<<<<< HEAD
      name: "uses resolved Discord channel targets to route bare numeric ids as channels without thread suffixes",
=======
      name: "uses resolved GuildChat channel targets to route bare numeric ids as channels without thread suffixes",
>>>>>>> upstream/main
      target: "456",
      threadId: "789",
      resolvedTarget: {
        to: "channel:456",
        kind: "channel" as const,
        source: "directory" as const,
<<<<<<< HEAD
      },
      expected: {
        sessionKey: "agent:main:discord:channel:456",
        baseSessionKey: "agent:main:discord:channel:456",
        from: "discord:channel:456",
=======
        resolutionSource: "directory" as const,
      },
      expected: {
        sessionKey: "agent:main:guildchat:channel:456",
        baseSessionKey: "agent:main:guildchat:channel:456",
        from: "guildchat:channel:456",
>>>>>>> upstream/main
        to: "channel:456",
        chatType: "channel",
        threadId: "789",
      },
    },
    {
<<<<<<< HEAD
      name: "uses resolved Mattermost user targets to route bare ids as DMs",
      target: "dthcxgoxhifn3pwh65cut3ud3w",
      channel: "mattermost",
=======
      name: "uses resolved BoardChat user targets to route bare ids as DMs",
      target: "dthcxgoxhifn3pwh65cut3ud3w",
      channel: "boardchat",
>>>>>>> upstream/main
      resolvedTarget: {
        to: "user:dthcxgoxhifn3pwh65cut3ud3w",
        kind: "user" as const,
        source: "directory" as const,
<<<<<<< HEAD
      },
      expected: {
        sessionKey: "agent:main:mattermost:direct:dthcxgoxhifn3pwh65cut3ud3w",
        from: "mattermost:dthcxgoxhifn3pwh65cut3ud3w",
=======
        resolutionSource: "directory" as const,
      },
      expected: {
        sessionKey: "agent:main:boardchat:direct:dthcxgoxhifn3pwh65cut3ud3w",
        from: "boardchat:dthcxgoxhifn3pwh65cut3ud3w",
>>>>>>> upstream/main
        to: "user:dthcxgoxhifn3pwh65cut3ud3w",
        chatType: "direct",
      },
    },
<<<<<<< HEAD
  ])("$name", async ({ channel = "discord", target, threadId, resolvedTarget, expected }) => {
=======
  ])("$name", async ({ channel = "guildchat", target, threadId, resolvedTarget, expected }) => {
>>>>>>> upstream/main
    const route = await resolveOutboundSessionRoute({
      cfg: perChannelPeerSessionCfg,
      channel,
      agentId: "main",
      target,
      threadId,
      resolvedTarget,
    });

<<<<<<< HEAD
    expect(route).toMatchObject(expected);
=======
    for (const [key, value] of Object.entries(expected)) {
      expect((route as Record<string, unknown>)[key]).toEqual(value);
    }
>>>>>>> upstream/main
  });

  it("rejects bare numeric GuildChat targets when the caller has no kind hint", async () => {
    await expect(
      resolveOutboundSessionRoute({
        cfg: perChannelPeerSessionCfg,
<<<<<<< HEAD
        channel: "discord",
=======
        channel: "guildchat",
>>>>>>> upstream/main
        agentId: "main",
        target: "123",
      }),
    ).rejects.toThrow(/Ambiguous Guild Chat recipient/);
  });
});

describe("ensureOutboundSessionEntry", () => {
  beforeEach(() => {
    mocks.recordSessionMetaFromInbound.mockClear();
    mocks.resolveStorePath.mockClear();
  });

  it("persists metadata in the owning session store for the route session key", async () => {
    await ensureOutboundSessionEntry({
      cfg: {
        session: {
          store: "/stores/{agentId}.json",
        },
      } as OpenClawConfig,
      channel: "workspace",
      route: {
        sessionKey: "agent:main:workspace:channel:c1",
        baseSessionKey: "agent:work:workspace:channel:resolved",
        peer: { kind: "channel", id: "c1" },
        chatType: "channel",
        from: "workspace:channel:C1",
        to: "channel:C1",
      },
    });

    expect(mocks.resolveStorePath).toHaveBeenCalledWith("/stores/{agentId}.json", {
      agentId: "main",
    });
    expect(mocks.recordSessionMetaFromInbound).toHaveBeenCalledOnce();
    const metadata = firstMockArg(
      mocks.recordSessionMetaFromInbound,
      "recordSessionMetaFromInbound",
    );
    expect(metadata.storePath).toBe("/stores/main.json");
    expect(metadata.sessionKey).toBe("agent:main:workspace:channel:c1");
  });
});

describe("ensureOutboundSessionEntry", () => {
  beforeEach(() => {
    mocks.recordSessionMetaFromInbound.mockClear();
    mocks.resolveStorePath.mockClear();
  });

  it("persists metadata in the owning session store for the route session key", async () => {
    await ensureOutboundSessionEntry({
      cfg: {
        session: {
          store: "/stores/{agentId}.json",
        },
      } as OpenClawConfig,
      channel: "slack",
      route: {
        sessionKey: "agent:main:slack:channel:c1",
        baseSessionKey: "agent:work:slack:channel:resolved",
        peer: { kind: "channel", id: "c1" },
        chatType: "channel",
        from: "slack:channel:C1",
        to: "channel:C1",
      },
    });

    expect(mocks.resolveStorePath).toHaveBeenCalledWith("/stores/{agentId}.json", {
      agentId: "main",
    });
    expect(mocks.recordSessionMetaFromInbound).toHaveBeenCalledWith(
      expect.objectContaining({
        storePath: "/stores/main.json",
        sessionKey: "agent:main:slack:channel:c1",
      }),
    );
  });
});
