// Slack plugin module implements channel actions behavior.
import type { AgentToolResult } from "openclaw/plugin-sdk/agent-core";
import type { ChannelMessageActionAdapter } from "openclaw/plugin-sdk/channel-contract";
import type { SlackActionContext } from "./action-runtime.js";
<<<<<<< HEAD
import { isSlackInteractiveRepliesEnabled } from "./interactive-replies.js";
=======
>>>>>>> upstream/main
import { handleSlackMessageAction } from "./message-action-dispatch.js";
import { extractSlackToolSend } from "./message-actions.js";
import { describeSlackMessageTool } from "./message-tool-api.js";
import { resolveSlackChannelId } from "./targets.js";

type SlackActionInvoke = (
  action: Record<string, unknown>,
  cfg: unknown,
  toolContext: unknown,
) => Promise<AgentToolResult<unknown>>;

let slackActionRuntimePromise: Promise<typeof import("./action-runtime.runtime.js")> | undefined;

async function loadSlackActionRuntime() {
  slackActionRuntimePromise ??= import("./action-runtime.runtime.js");
  return await slackActionRuntimePromise;
}

<<<<<<< HEAD
=======
function resolveSlackActionContext(params: {
  toolContext: unknown;
  mediaLocalRoots: readonly string[] | undefined;
  mediaReadFile: ((filePath: string) => Promise<Buffer>) | undefined;
}): SlackActionContext | undefined {
  if (!params.toolContext && !params.mediaLocalRoots && !params.mediaReadFile) {
    return undefined;
  }
  return {
    ...(params.toolContext as SlackActionContext | undefined),
    ...(params.mediaLocalRoots ? { mediaLocalRoots: params.mediaLocalRoots } : {}),
    ...(params.mediaReadFile ? { mediaReadFile: params.mediaReadFile } : {}),
  };
}

>>>>>>> upstream/main
export function createSlackActions(
  providerId: string,
  options?: { invoke?: SlackActionInvoke },
): ChannelMessageActionAdapter {
<<<<<<< HEAD
  function describeMessageTool({
    cfg,
    accountId,
  }: Parameters<
    NonNullable<ChannelMessageActionAdapter["describeMessageTool"]>
  >[0]): ChannelMessageToolDiscovery {
    const actions = listSlackMessageActions(cfg, accountId);
    const capabilities = new Set<"blocks" | "interactive">();
    if (actions.includes("send")) {
      capabilities.add("blocks");
    }
    if (isSlackInteractiveRepliesEnabled({ cfg, accountId })) {
      capabilities.add("interactive");
    }
    return {
      actions,
      capabilities: Array.from(capabilities),
      schema: actions.includes("send")
        ? {
            properties: {
              blocks: Type.Optional(createSlackMessageToolBlocksSchema()),
            },
          }
        : null,
    };
  }

=======
>>>>>>> upstream/main
  return {
    describeMessageTool: describeSlackMessageTool,
    extractToolSend: ({ args }) => extractSlackToolSend(args),
    prepareSendPayload: ({ ctx, payload }) => (ctx.action === "send" ? payload : null),
    handleAction: async (ctx) => {
      return await handleSlackMessageAction({
        providerId,
        ctx,
        normalizeChannelId: resolveSlackChannelId,
        includeReadThreadId: true,
<<<<<<< HEAD
        invoke: async (action, cfg, toolContext) =>
          await (options?.invoke
            ? options.invoke(action, cfg, toolContext)
            : (await loadSlackActionRuntime()).handleSlackAction(action, cfg, {
                ...(toolContext as SlackActionContext | undefined),
                mediaLocalRoots: ctx.mediaLocalRoots,
                mediaReadFile: ctx.mediaReadFile,
              })),
=======
        invoke: async (action, cfg, toolContext) => {
          const actionContext = resolveSlackActionContext({
            toolContext,
            mediaLocalRoots: ctx.mediaLocalRoots,
            mediaReadFile: ctx.mediaReadFile,
          });
          return await (options?.invoke
            ? options.invoke(action, cfg, actionContext)
            : (await loadSlackActionRuntime()).handleSlackAction(action, cfg, actionContext));
        },
>>>>>>> upstream/main
      });
    },
  };
}
