<<<<<<< HEAD
import {
=======
// Maintains interactive plugin registry entries discovered from manifests.
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import {
  normalizePluginInteractiveNamespace,
  resolvePluginInteractiveMatch,
  toPluginInteractiveRegistryKey,
  validatePluginInteractiveNamespace,
} from "./interactive-shared.js";
import {
  clearPluginInteractiveHandlerRegistrationsState,
>>>>>>> upstream/main
  clearPluginInteractiveHandlersState,
  getPluginInteractiveHandlersState,
  type RegisteredInteractiveHandler,
} from "./interactive-state.js";
import type { PluginInteractiveHandlerRegistration } from "./types.js";

<<<<<<< HEAD
=======
/** Registration result for plugin interactive namespace handlers. */
>>>>>>> upstream/main
export type InteractiveRegistrationResult = {
  ok: boolean;
  error?: string;
};

<<<<<<< HEAD
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

=======
/** Resolves a channel payload to a registered plugin interactive namespace handler. */
>>>>>>> upstream/main
export function resolvePluginInteractiveNamespaceMatch(
  channel: string,
  data: string,
): { registration: RegisteredInteractiveHandler; namespace: string; payload: string } | null {
<<<<<<< HEAD
  const interactiveHandlers = getPluginInteractiveHandlersState();
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

=======
  return resolvePluginInteractiveMatch({
    interactiveHandlers: getPluginInteractiveHandlersState(),
    channel,
    data,
  });
}

/** Registers one plugin interactive namespace for a channel. */
>>>>>>> upstream/main
export function registerPluginInteractiveHandler(
  pluginId: string,
  registration: PluginInteractiveHandlerRegistration,
  opts?: { pluginName?: string; pluginRoot?: string },
): InteractiveRegistrationResult {
  const interactiveHandlers = getPluginInteractiveHandlersState();
<<<<<<< HEAD
  const namespace = normalizeNamespace(registration.namespace);
  const validationError = validateNamespace(namespace);
  if (validationError) {
    return { ok: false, error: validationError };
  }
  const key = toRegistryKey(registration.channel, namespace);
=======
  const namespace = normalizePluginInteractiveNamespace(registration.namespace);
  const validationError = validatePluginInteractiveNamespace(namespace);
  if (validationError) {
    return { ok: false, error: validationError };
  }
  const key = toPluginInteractiveRegistryKey(registration.channel, namespace);
>>>>>>> upstream/main
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
<<<<<<< HEAD
    channel: registration.channel.trim().toLowerCase(),
=======
    channel: normalizeOptionalLowercaseString(registration.channel) ?? "",
>>>>>>> upstream/main
    pluginId,
    pluginName: opts?.pluginName,
    pluginRoot: opts?.pluginRoot,
  });
  return { ok: true };
}

<<<<<<< HEAD
=======
/** Clears all active plugin interactive handlers. */
>>>>>>> upstream/main
export function clearPluginInteractiveHandlers(): void {
  clearPluginInteractiveHandlersState();
}

<<<<<<< HEAD
=======
/** Clears stored plugin interactive handler registrations. */
export function clearPluginInteractiveHandlerRegistrations(): void {
  clearPluginInteractiveHandlerRegistrationsState();
}

/** Clears active interactive handlers owned by one plugin. */
>>>>>>> upstream/main
export function clearPluginInteractiveHandlersForPlugin(pluginId: string): void {
  const interactiveHandlers = getPluginInteractiveHandlersState();
  for (const [key, value] of interactiveHandlers.entries()) {
    if (value.pluginId === pluginId) {
      interactiveHandlers.delete(key);
    }
  }
}
<<<<<<< HEAD
=======

/** Lists active plugin interactive handlers. */
export function listPluginInteractiveHandlers(): RegisteredInteractiveHandler[] {
  return Array.from(getPluginInteractiveHandlersState().values());
}

/** Restores active plugin interactive handlers from a saved registry snapshot. */
export function restorePluginInteractiveHandlers(
  registrations: readonly RegisteredInteractiveHandler[],
): void {
  clearPluginInteractiveHandlerRegistrations();
  const interactiveHandlers = getPluginInteractiveHandlersState();
  for (const registration of registrations) {
    const namespace = normalizePluginInteractiveNamespace(registration.namespace);
    if (!namespace) {
      continue;
    }
    interactiveHandlers.set(toPluginInteractiveRegistryKey(registration.channel, namespace), {
      ...registration,
      namespace,
      channel: normalizeOptionalLowercaseString(registration.channel) ?? "",
    });
  }
}
>>>>>>> upstream/main
