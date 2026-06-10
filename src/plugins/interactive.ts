<<<<<<< HEAD
import { createDedupeCache, resolveGlobalDedupeCache } from "../infra/dedupe.js";
import { resolveGlobalSingleton } from "../shared/global-singleton.js";
import type { PluginInteractiveHandlerRegistration } from "./types.js";
=======
// Resolves interactive plugin entries from registry metadata.
import { resolvePluginInteractiveNamespaceMatch } from "./interactive-registry.js";
import {
  claimPluginInteractiveCallbackDedupe,
  commitPluginInteractiveCallbackDedupe,
  releasePluginInteractiveCallbackDedupe,
  type RegisteredInteractiveHandler,
} from "./interactive-state.js";
>>>>>>> upstream/main

type InteractiveDispatchResult<TResult = unknown> =
  | { matched: false; handled: false; duplicate: false }
  | { matched: true; handled: boolean; duplicate: boolean; result?: TResult };

type PluginInteractiveDispatchRegistration = {
  channel: string;
  namespace: string;
<<<<<<< HEAD
};

export type PluginInteractiveMatch<TRegistration extends PluginInteractiveDispatchRegistration> = {
  registration: RegisteredInteractiveHandler & TRegistration;
  namespace: string;
  payload: string;
};

type InteractiveState = {
  interactiveHandlers: Map<string, RegisteredInteractiveHandler>;
  callbackDedupe: ReturnType<typeof createDedupeCache>;
=======
>>>>>>> upstream/main
};

/** Resolved interactive handler match passed to plugin callback dispatch. */
export type PluginInteractiveMatch<TRegistration extends PluginInteractiveDispatchRegistration> = {
  registration: RegisteredInteractiveHandler & TRegistration;
  namespace: string;
  payload: string;
};

export {
  clearPluginInteractiveHandlers,
  clearPluginInteractiveHandlersForPlugin,
  registerPluginInteractiveHandler,
} from "./interactive-registry.js";
export type { InteractiveRegistrationResult } from "./interactive-registry.js";

<<<<<<< HEAD
const getInteractiveHandlers = () => getState().interactiveHandlers;
const getCallbackDedupe = () => getState().callbackDedupe;

function toRegistryKey(channel: string, namespace: string): string {
  return `${channel.trim().toLowerCase()}:${namespace.trim()}`;
}

function normalizeNamespace(namespace: string): string {
  return namespace.trim();
}

function validateNamespace(namespace: string): string | null {
  if (!namespace.trim()) {
    return "Interactive handler namespace cannot be empty";
  }
  if (!/^[A-Za-z0-9._-]+$/.test(namespace.trim())) {
    return "Interactive handler namespace must contain only letters, numbers, dots, underscores, and hyphens";
  }
  return null;
}

function resolveNamespaceMatch(
  channel: string,
  data: string,
): { registration: RegisteredInteractiveHandler; namespace: string; payload: string } | null {
  const interactiveHandlers = getInteractiveHandlers();
  const trimmedData = data.trim();
  if (!trimmedData) {
    return null;
  }

  const separatorIndex = trimmedData.indexOf(":");
  const namespace =
    separatorIndex >= 0 ? trimmedData.slice(0, separatorIndex) : normalizeNamespace(trimmedData);
  const registration = interactiveHandlers.get(toRegistryKey(channel, namespace));
  if (!registration) {
    return null;
  }

  return {
    registration,
    namespace,
    payload: separatorIndex >= 0 ? trimmedData.slice(separatorIndex + 1) : "",
  };
}

export function registerPluginInteractiveHandler(
  pluginId: string,
  registration: PluginInteractiveHandlerRegistration,
  opts?: { pluginName?: string; pluginRoot?: string },
): InteractiveRegistrationResult {
  const interactiveHandlers = getInteractiveHandlers();
  const namespace = normalizeNamespace(registration.namespace);
  const validationError = validateNamespace(namespace);
  if (validationError) {
    return { ok: false, error: validationError };
  }
  const key = toRegistryKey(registration.channel, namespace);
  const existing = interactiveHandlers.get(key);
  if (existing) {
    return {
      ok: false,
      error: `Interactive handler namespace "${namespace}" already registered by plugin "${existing.pluginId}"`,
    };
  }
  interactiveHandlers.set(key, {
    ...registration,
    namespace,
    pluginId,
    pluginName: opts?.pluginName,
    pluginRoot: opts?.pluginRoot,
  });
  return { ok: true };
}

export function clearPluginInteractiveHandlers(): void {
  const interactiveHandlers = getInteractiveHandlers();
  const callbackDedupe = getCallbackDedupe();
  interactiveHandlers.clear();
  callbackDedupe.clear();
}

export function clearPluginInteractiveHandlersForPlugin(pluginId: string): void {
  const interactiveHandlers = getInteractiveHandlers();
  for (const [key, value] of interactiveHandlers.entries()) {
    if (value.pluginId === pluginId) {
      interactiveHandlers.delete(key);
    }
  }
}

export async function dispatchPluginInteractiveHandler<
  TRegistration extends PluginInteractiveDispatchRegistration,
=======
/** Dispatches one interactive callback payload to a matching plugin handler. */
export async function dispatchPluginInteractiveHandler<
  TRegistration extends PluginInteractiveDispatchRegistration,
  TResult extends { handled?: boolean } | void = { handled?: boolean } | void,
>>>>>>> upstream/main
>(params: {
  channel: TRegistration["channel"];
  data: string;
  dedupeId?: string;
  onMatched?: () => Promise<void> | void;
<<<<<<< HEAD
  invoke: (
    match: PluginInteractiveMatch<TRegistration>,
  ) => Promise<{ handled?: boolean } | void> | { handled?: boolean } | void;
}): Promise<InteractiveDispatchResult> {
  const callbackDedupe = getCallbackDedupe();
  const match = resolveNamespaceMatch(params.channel, params.data);
=======
  invoke: (match: PluginInteractiveMatch<TRegistration>) => Promise<TResult> | TResult;
}): Promise<InteractiveDispatchResult<TResult>> {
  const match = resolvePluginInteractiveNamespaceMatch(params.channel, params.data);
>>>>>>> upstream/main
  if (!match) {
    return { matched: false, handled: false, duplicate: false };
  }

  const dedupeKey = params.dedupeId?.trim();
<<<<<<< HEAD
  if (dedupeKey && callbackDedupe.peek(dedupeKey)) {
=======
  if (dedupeKey && !claimPluginInteractiveCallbackDedupe(dedupeKey)) {
>>>>>>> upstream/main
    return { matched: true, handled: true, duplicate: true };
  }

  try {
    await params.onMatched?.();
    const resolved = await params.invoke(match as PluginInteractiveMatch<TRegistration>);
    if (dedupeKey) {
      commitPluginInteractiveCallbackDedupe(dedupeKey);
    }
    const shouldExposeResult =
      Boolean(resolved) &&
      typeof resolved === "object" &&
      Object.keys(resolved as Record<string, unknown>).some((key) => key !== "handled");

<<<<<<< HEAD
  const resolved = await params.invoke(match as PluginInteractiveMatch<TRegistration>);
  if (dedupeKey) {
    callbackDedupe.check(dedupeKey);
  }

  return {
    matched: true,
    handled: resolved?.handled ?? true,
    duplicate: false,
  };
=======
    return {
      matched: true,
      handled: resolved?.handled ?? true,
      duplicate: false,
      ...(shouldExposeResult ? { result: resolved } : {}),
    };
  } catch (error) {
    if (dedupeKey) {
      releasePluginInteractiveCallbackDedupe(dedupeKey);
    }
    throw error;
  }
>>>>>>> upstream/main
}
