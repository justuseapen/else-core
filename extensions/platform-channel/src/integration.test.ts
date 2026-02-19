import type { PluginRuntime } from "openclaw/plugin-sdk";
import { describe, expect, it, beforeEach } from "vitest";
import { platformChannelPlugin } from "./channel.js";
import { setPlatformChannelRuntime } from "./runtime.js";

// Mock runtime for testing - typed properly
const mockRuntime: PluginRuntime = {
  version: "test",
  config: {
    loadConfig: async () => ({}),
    writeConfigFile: async () => {},
  },
  system: {
    enqueueSystemEvent: () => {},
    runCommandWithTimeout: async () => ({
      pid: undefined,
      stdout: "",
      stderr: "",
      code: 0,
      signal: null,
      killed: false,
      termination: "exit" as const,
    }),
    formatNativeDependencyHint: () => "",
  },
  media: {
    loadWebMedia: async () => ({ ok: false }),
    detectMime: async () => "application/octet-stream",
    mediaKindFromMime: () => "file",
    isVoiceCompatibleAudio: () => false,
    getImageMetadata: async () => ({}),
    resizeToJpeg: async () => Buffer.from([]),
  },
  tts: {
    textToSpeechTelephony: async () => ({ ok: false }),
  },
  tools: {
    createMemoryGetTool: () => ({}),
    createMemorySearchTool: () => ({}),
    registerMemoryCli: () => {},
  },
  channel: {
    text: {
      chunkByNewline: () => [],
      chunkMarkdownText: () => [],
      chunkMarkdownTextWithMode: () => [],
      chunkText: () => [],
      chunkTextWithMode: () => [],
      resolveChunkMode: () => "split",
      resolveTextChunkLimit: () => 4000,
      hasControlCommand: () => false,
      resolveMarkdownTableMode: () => "preserve",
      convertMarkdownTables: (t: string) => t,
    },
    reply: {
      dispatchReplyWithBufferedBlockDispatcher: async () => ({ ok: true }),
      createReplyDispatcherWithTyping: () => ({}),
      resolveEffectiveMessagesConfig: () => ({}),
      resolveHumanDelayConfig: () => ({}),
      dispatchReplyFromConfig: async () => ({ ok: true }),
      finalizeInboundContext: <T extends Record<string, unknown>>(ctx: T) => ctx,
      formatAgentEnvelope: () => "",
      formatInboundEnvelope: () => "",
      resolveEnvelopeFormatOptions: () => ({}),
    },
    routing: {
      resolveAgentRoute: () => ({ agentId: "default", sessionKey: "test", accountId: "default" }),
    },
    pairing: {
      buildPairingReply: () => "",
      readAllowFromStore: async () => [],
      upsertPairingRequest: async () => ({ code: "", created: false }),
    },
    media: {
      fetchRemoteMedia: async () => ({ ok: false }),
      saveMediaBuffer: async () => "",
    },
    activity: {
      record: () => {},
      get: () => ({}),
    },
    session: {
      resolveStorePath: () => "/tmp/test-store",
      readSessionUpdatedAt: () => undefined,
      recordSessionMetaFromInbound: async () => {},
      recordInboundSession: async () => {},
      updateLastRoute: async () => {},
    },
    mentions: {
      buildMentionRegexes: () => [],
      matchesMentionPatterns: () => false,
      matchesMentionWithExplicit: () => ({ matched: false }),
    },
    reactions: {
      shouldAckReaction: () => false,
      removeAckReactionAfterReply: () => {},
    },
    groups: {
      resolveGroupPolicy: () => "allowlist",
      resolveRequireMention: () => false,
    },
    debounce: {
      createInboundDebouncer: () => ({ enqueue: async () => {} }),
      resolveInboundDebounceMs: () => 0,
    },
    commands: {
      resolveCommandAuthorizedFromAuthorizers: () => ({ authorized: false }),
      isControlCommandMessage: () => false,
      shouldComputeCommandAuthorized: () => false,
      shouldHandleTextCommands: () => false,
    },
    discord: {},
    slack: {},
    telegram: {},
    signal: {},
    imessage: {},
    whatsapp: {},
    line: {},
  },
  logging: {
    shouldLogVerbose: () => false,
    getChildLogger: () => ({
      info: () => {},
      warn: () => {},
      error: () => {},
    }),
  },
  state: {
    resolveStateDir: () => "/tmp/test-state",
  },
} as unknown as PluginRuntime;

describe("platform-channel integration", () => {
  beforeEach(() => {
    // Initialize runtime before each test
    setPlatformChannelRuntime(mockRuntime);
  });

  it("should resolve account configuration", () => {
    const mockConfig = {
      channels: {
        "platform-channel": {},
      },
    };

    const accountIds = platformChannelPlugin.config.listAccountIds(mockConfig);
    expect(accountIds).toContain("default");

    const account = platformChannelPlugin.config.resolveAccount(mockConfig, "default");
    expect(account.accountId).toBe("default");
  });

  it("should have correct plugin metadata", () => {
    expect(platformChannelPlugin.id).toBe("platform-channel");
    expect(platformChannelPlugin.meta.label).toBe("Platform Channel");
    expect(platformChannelPlugin.capabilities.chatTypes).toContain("direct");
  });

  it("should configure outbound delivery mode", () => {
    expect(platformChannelPlugin.outbound?.deliveryMode).toBe("gateway");
    expect(platformChannelPlugin.outbound?.sendText).toBeDefined();
  });

  it("should handle missing webhook URL gracefully", async () => {
    const originalUrl = process.env.ELSE_PLATFORM_WEBHOOK_URL;
    delete process.env.ELSE_PLATFORM_WEBHOOK_URL;

    await expect(
      platformChannelPlugin.outbound?.sendText?.({
        cfg: {},
        to: "test-user",
        text: "test message",
      }),
    ).rejects.toThrow("ELSE_PLATFORM_WEBHOOK_URL not configured");

    // Restore
    if (originalUrl) {
      process.env.ELSE_PLATFORM_WEBHOOK_URL = originalUrl;
    }
  });

  it("should start account with gateway adapter", async () => {
    const mockContext = {
      cfg: {},
      accountId: "default",
      account: { accountId: "default" },
      runtime: { log: () => {}, error: () => {}, exit: () => {} },
      abortSignal: new AbortController().signal,
      log: {
        info: () => {},
        warn: () => {},
        error: () => {},
      },
      getStatus: () => ({
        accountId: "default",
        configured: true,
        enabled: true,
      }),
      setStatus: () => {},
    };

    const result = await platformChannelPlugin.gateway?.startAccount?.(mockContext);
    expect(result).toBeDefined();
    const resultRecord = result as Record<string, unknown>;
    expect(resultRecord.status).toBe("running");
  });
});
