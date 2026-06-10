// Public ACP runtime helpers for plugins that integrate with ACP control/session state.

<<<<<<< HEAD
import { __testing as managerTesting, getAcpSessionManager } from "../acp/control-plane/manager.js";
import { __testing as registryTesting } from "../acp/runtime/registry.js";
import type {
  PluginHookReplyDispatchContext,
  PluginHookReplyDispatchEvent,
  PluginHookReplyDispatchResult,
} from "../plugins/types.js";
=======
import { testing as managerTesting, getAcpSessionManager } from "../acp/control-plane/manager.js";
import { testing as registryTesting } from "../acp/runtime/registry.js";
>>>>>>> upstream/main

export { getAcpSessionManager };
export { AcpRuntimeError, isAcpRuntimeError } from "../acp/runtime/errors.js";
export type { AcpRuntimeErrorCode } from "../acp/runtime/errors.js";
export {
  getAcpRuntimeBackend,
  registerAcpRuntimeBackend,
  requireAcpRuntimeBackend,
  unregisterAcpRuntimeBackend,
} from "../acp/runtime/registry.js";
export type {
  AcpRuntime,
  AcpRuntimeCapabilities,
  AcpRuntimeDoctorReport,
  AcpRuntimeEnsureInput,
  AcpRuntimeEvent,
  AcpRuntimeHandle,
  AcpRuntimeStatus,
<<<<<<< HEAD
=======
  AcpRuntimeTurn,
>>>>>>> upstream/main
  AcpRuntimeTurnAttachment,
  AcpRuntimeTurnInput,
  AcpRuntimeTurnResult,
  AcpRuntimeTurnResultError,
  AcpSessionUpdateTag,
} from "@openclaw/acp-core/runtime/types";
export { readAcpSessionEntry } from "../acp/runtime/session-meta.js";
export type { AcpSessionStoreEntry } from "../acp/runtime/session-meta.js";
<<<<<<< HEAD

let dispatchAcpRuntimePromise: Promise<
  typeof import("../auto-reply/reply/dispatch-acp.runtime.js")
> | null = null;

function loadDispatchAcpRuntime() {
  dispatchAcpRuntimePromise ??= import("../auto-reply/reply/dispatch-acp.runtime.js");
  return dispatchAcpRuntimePromise;
}

function hasExplicitCommandCandidate(ctx: PluginHookReplyDispatchEvent["ctx"]): boolean {
  const commandBody = ctx.CommandBody;
  if (typeof commandBody === "string" && commandBody.trim().length > 0) {
    return true;
  }

  const bodyForCommands = ctx.BodyForCommands;
  if (typeof bodyForCommands !== "string") {
    return false;
  }

  const normalized = bodyForCommands.trim();
  if (!normalized) {
    return false;
  }

  return normalized.startsWith("!") || normalized.startsWith("/");
}

export async function tryDispatchAcpReplyHook(
  event: PluginHookReplyDispatchEvent,
  ctx: PluginHookReplyDispatchContext,
): Promise<PluginHookReplyDispatchResult | void> {
  if (event.sendPolicy === "deny" && !hasExplicitCommandCandidate(event.ctx)) {
    return;
  }
  const runtime = await loadDispatchAcpRuntime();
  const bypassForCommand = await runtime.shouldBypassAcpDispatchForCommand(event.ctx, ctx.cfg);

  if (event.sendPolicy === "deny" && !bypassForCommand) {
    return;
  }

  const result = await runtime.tryDispatchAcpReply({
    ctx: event.ctx,
    cfg: ctx.cfg,
    dispatcher: ctx.dispatcher,
    runId: event.runId,
    sessionKey: event.sessionKey,
    abortSignal: ctx.abortSignal,
    inboundAudio: event.inboundAudio,
    sessionTtsAuto: event.sessionTtsAuto,
    ttsChannel: event.ttsChannel,
    suppressUserDelivery: event.suppressUserDelivery,
    shouldRouteToOriginating: event.shouldRouteToOriginating,
    originatingChannel: event.originatingChannel,
    originatingTo: event.originatingTo,
    shouldSendToolSummaries: event.shouldSendToolSummaries,
    bypassForCommand,
    onReplyStart: ctx.onReplyStart,
    recordProcessed: ctx.recordProcessed,
    markIdle: ctx.markIdle,
  });

  if (!result) {
    return;
  }

  return {
    handled: true,
    queuedFinal: result.queuedFinal,
    counts: result.counts,
  };
}
=======
export { tryDispatchAcpReplyHook } from "./acp-runtime-backend.js";
>>>>>>> upstream/main

// Keep test helpers off the hot init path. Eagerly merging them here can
// create a back-edge through the bundled ACP runtime chunk before the imported
// testing bindings finish initialization.
<<<<<<< HEAD
export const __testing = new Proxy({} as typeof managerTesting & typeof registryTesting, {
=======
/** Lazy ACP test helper facade combining control-plane and runtime registry helpers. */
export const testing = new Proxy({} as typeof managerTesting & typeof registryTesting, {
>>>>>>> upstream/main
  get(_target, prop, receiver) {
    if (Reflect.has(managerTesting, prop)) {
      return Reflect.get(managerTesting, prop, receiver);
    }
    return Reflect.get(registryTesting, prop, receiver);
  },
  has(_target, prop) {
    return Reflect.has(managerTesting, prop) || Reflect.has(registryTesting, prop);
  },
  ownKeys() {
    return Array.from(
      new Set([...Reflect.ownKeys(managerTesting), ...Reflect.ownKeys(registryTesting)]),
    );
  },
  getOwnPropertyDescriptor(_target, prop) {
    if (Reflect.has(managerTesting, prop) || Reflect.has(registryTesting, prop)) {
      return {
        configurable: true,
        enumerable: true,
      };
    }
    return undefined;
  },
});
<<<<<<< HEAD
=======

/** @deprecated Use `testing`. */
export { testing as __testing };
>>>>>>> upstream/main
