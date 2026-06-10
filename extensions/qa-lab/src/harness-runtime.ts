<<<<<<< HEAD
import type { PluginRuntime } from "openclaw/plugin-sdk/core";
=======
// Qa Lab plugin module implements harness runtime behavior.
import {
  buildMentionRegexes,
  implicitMentionKindWhen,
  matchesMentionPatterns,
  matchesMentionWithExplicit,
  resolveInboundMentionDecision,
} from "openclaw/plugin-sdk/channel-inbound";
import type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
>>>>>>> upstream/main

type SessionRecord = {
  sessionKey: string;
  body: string;
};

export function createQaRunnerRuntime(): PluginRuntime {
  const sessions = new Map<string, SessionRecord>();
  return {
    channel: {
      routing: {
        resolveAgentRoute({
          accountId,
          peer,
        }: {
          accountId?: string | null;
          peer?: { kind?: string; id?: string } | null;
        }) {
          return {
            agentId: "qa-agent",
            accountId: accountId ?? "default",
            sessionKey: `qa-agent:${peer?.kind ?? "direct"}:${peer?.id ?? "default"}`,
            mainSessionKey: "qa-agent:main",
            lastRoutePolicy: "session",
            matchedBy: "default",
            channel: "qa-channel",
          };
        },
      },
      session: {
        resolveStorePath(_store: string | undefined, { agentId }: { agentId: string }) {
          return agentId;
        },
        readSessionUpdatedAt({ sessionKey }: { sessionKey: string }) {
          return sessions.has(sessionKey) ? Date.now() : undefined;
        },
        recordInboundSession({
          sessionKey,
          ctx,
        }: {
          sessionKey: string;
          ctx: { BodyForAgent?: string; Body?: string };
        }) {
          sessions.set(sessionKey, {
            sessionKey,
<<<<<<< HEAD
            body: String(ctx.BodyForAgent ?? ctx.Body ?? ""),
          });
        },
      },
=======
            body: ctx.BodyForAgent ?? ctx.Body ?? "",
          });
        },
      },
      mentions: {
        buildMentionRegexes,
        matchesMentionPatterns,
        matchesMentionWithExplicit,
        implicitMentionKindWhen,
        resolveInboundMentionDecision,
      },
>>>>>>> upstream/main
      reply: {
        resolveEnvelopeFormatOptions() {
          return {};
        },
        formatAgentEnvelope({ body }: { body: string }) {
          return body;
        },
        finalizeInboundContext(ctx: Record<string, unknown>) {
          return ctx as typeof ctx & { CommandAuthorized: boolean };
        },
        async dispatchReplyWithBufferedBlockDispatcher({
          ctx,
          dispatcherOptions,
        }: {
          ctx: { BodyForAgent?: string; Body?: string };
          dispatcherOptions: { deliver: (payload: { text: string }) => Promise<void> };
        }) {
          await dispatcherOptions.deliver({
<<<<<<< HEAD
            text: `qa-echo: ${String(ctx.BodyForAgent ?? ctx.Body ?? "")}`,
          });
        },
      },
=======
            text: `qa-echo: ${ctx.BodyForAgent ?? ctx.Body ?? ""}`,
          });
        },
      },
      inbound: {
        async dispatchReply(
          params: Parameters<PluginRuntime["channel"]["inbound"]["dispatchReply"]>[0],
        ) {
          const sessionKey =
            typeof params.ctxPayload.SessionKey === "string"
              ? params.ctxPayload.SessionKey
              : params.routeSessionKey;
          await params.recordInboundSession({
            storePath: params.storePath,
            sessionKey,
            ctx: params.ctxPayload,
            onRecordError: params.record?.onRecordError ?? (() => undefined),
          });
          const dispatchResult = await params.dispatchReplyWithBufferedBlockDispatcher({
            ctx: params.ctxPayload,
            cfg: params.cfg,
            dispatcherOptions: {
              ...params.dispatcherOptions,
              deliver: async (payload, info) => {
                await params.delivery.deliver(payload, info);
              },
              onError: params.delivery.onError,
            },
            replyOptions: params.replyOptions,
            replyResolver: params.replyResolver,
          });
          return {
            admission: params.admission ?? { kind: "dispatch" },
            dispatched: true,
            ctxPayload: params.ctxPayload,
            routeSessionKey: params.routeSessionKey,
            dispatchResult,
          };
        },
      },
>>>>>>> upstream/main
    },
  } as unknown as PluginRuntime;
}
