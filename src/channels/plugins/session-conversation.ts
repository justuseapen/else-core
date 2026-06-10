<<<<<<< HEAD
=======
/**
 * Session conversation key helpers.
 *
 * Resolves threaded channel session keys through plugin hooks and generic parsing.
 */
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { normalizeUniqueSingleOrTrimmedStringList } from "@openclaw/normalization-core/string-normalization";
import { getRuntimeConfigSnapshot } from "../../config/runtime-snapshot.js";
>>>>>>> upstream/main
import { tryLoadActivatedBundledPluginPublicSurfaceModuleSync } from "../../plugin-sdk/facade-runtime.js";
import {
  parseRawSessionConversationRef,
  parseThreadSessionSuffix,
  type ParsedThreadSessionSuffix,
  type RawSessionConversationRef,
} from "../../sessions/session-key-utils.js";
import { normalizeChannelId as normalizeChatChannelId } from "../registry.js";
<<<<<<< HEAD
import { getChannelPlugin, normalizeChannelId as normalizeAnyChannelId } from "./registry.js";

=======
import { getLoadedChannelPlugin, normalizeChannelId as normalizeAnyChannelId } from "./registry.js";

/**
 * Normalized conversation id details for one channel raw id.
 */
>>>>>>> upstream/main
export type ResolvedSessionConversation = {
  id: string;
  threadId: string | undefined;
  baseConversationId: string;
  parentConversationCandidates: string[];
};

<<<<<<< HEAD
=======
/**
 * Parsed session-key conversation reference with parent/thread metadata.
 */
>>>>>>> upstream/main
export type ResolvedSessionConversationRef = {
  channel: string;
  kind: "group" | "channel";
  rawId: string;
  id: string;
  threadId: string | undefined;
  baseSessionKey: string;
  baseConversationId: string;
  parentConversationCandidates: string[];
};

type SessionConversationHookResult = {
  id: string;
  threadId?: string | null;
  baseConversationId?: string | null;
  parentConversationCandidates?: string[];
};

type SessionConversationResolverParams = {
  kind: "group" | "channel";
  rawId: string;
};

type BundledSessionKeyModule = {
  resolveSessionConversation?: (
    params: SessionConversationResolverParams,
  ) => SessionConversationHookResult | null;
};

const SESSION_KEY_API_ARTIFACT_BASENAME = "session-key-api.js";
<<<<<<< HEAD
=======
type SessionConversationResolutionOptions = {
  bundledFallback?: boolean;
};
>>>>>>> upstream/main

type NormalizedSessionConversationResolution = ResolvedSessionConversation & {
  hasExplicitParentConversationCandidates: boolean;
};

function normalizeResolvedChannel(channel: string): string {
  return (
    normalizeAnyChannelId(channel) ??
    normalizeChatChannelId(channel) ??
<<<<<<< HEAD
    channel.trim().toLowerCase()
=======
    normalizeOptionalLowercaseString(channel) ??
    ""
>>>>>>> upstream/main
  );
}

function getMessagingAdapter(channel: string) {
  const normalizedChannel = normalizeResolvedChannel(channel);
  try {
<<<<<<< HEAD
    return getChannelPlugin(normalizedChannel)?.messaging;
=======
    return getLoadedChannelPlugin(normalizedChannel)?.messaging;
>>>>>>> upstream/main
  } catch {
    return undefined;
  }
}

function dedupeConversationIds(values: Array<string | undefined | null>): string[] {
<<<<<<< HEAD
  const seen = new Set<string>();
  const resolved: string[] = [];
  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    resolved.push(trimmed);
  }
  return resolved;
=======
  return normalizeUniqueSingleOrTrimmedStringList(values);
>>>>>>> upstream/main
}

function buildGenericConversationResolution(rawId: string): ResolvedSessionConversation | null {
  const trimmed = rawId.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = parseThreadSessionSuffix(trimmed);
<<<<<<< HEAD
=======
  // Generic parsing treats `:thread:*` suffixes as child thread metadata while
  // preserving the base conversation id for parent lookups.
>>>>>>> upstream/main
  const id = (parsed.baseSessionKey ?? trimmed).trim();
  if (!id) {
    return null;
  }

  return {
    id,
    threadId: parsed.threadId,
    baseConversationId: id,
    parentConversationCandidates: dedupeConversationIds(
      parsed.threadId ? [parsed.baseSessionKey] : [],
    ),
  };
}

function normalizeSessionConversationResolution(
  resolved: SessionConversationHookResult | null | undefined,
): NormalizedSessionConversationResolution | null {
  if (!resolved?.id?.trim()) {
    return null;
  }

  return {
    id: resolved.id.trim(),
<<<<<<< HEAD
    threadId: resolved.threadId?.trim() || undefined,
    baseConversationId:
      resolved.baseConversationId?.trim() ||
      dedupeConversationIds(resolved.parentConversationCandidates ?? []).at(-1) ||
=======
    threadId: normalizeOptionalString(resolved.threadId),
    // When plugins omit an explicit base id, prefer the last declared parent
    // candidate so nested topic/thread routes still collapse to their parent.
    baseConversationId:
      normalizeOptionalString(resolved.baseConversationId) ??
      dedupeConversationIds(resolved.parentConversationCandidates ?? []).at(-1) ??
>>>>>>> upstream/main
      resolved.id.trim(),
    parentConversationCandidates: dedupeConversationIds(
      resolved.parentConversationCandidates ?? [],
    ),
    hasExplicitParentConversationCandidates: Object.hasOwn(
      resolved,
      "parentConversationCandidates",
    ),
  };
}

function resolveBundledSessionConversationFallback(params: {
  channel: string;
  kind: "group" | "channel";
  rawId: string;
}): NormalizedSessionConversationResolution | null {
<<<<<<< HEAD
  const dirName = normalizeResolvedChannel(params.channel);
  let resolveSessionConversation: BundledSessionKeyModule["resolveSessionConversation"];
  try {
    resolveSessionConversation =
      tryLoadActivatedBundledPluginPublicSurfaceModuleSync<BundledSessionKeyModule>({
        dirName,
        artifactBasename: SESSION_KEY_API_ARTIFACT_BASENAME,
      })?.resolveSessionConversation;
  } catch {
    return null;
  }
  if (typeof resolveSessionConversation !== "function") {
=======
  if (isBundledSessionConversationFallbackDisabled(params.channel)) {
    return null;
  }
  const dirName = normalizeResolvedChannel(params.channel);
  let loaded: BundledSessionKeyModule | null;
  try {
    loaded = tryLoadActivatedBundledPluginPublicSurfaceModuleSync<BundledSessionKeyModule>({
      dirName,
      artifactBasename: SESSION_KEY_API_ARTIFACT_BASENAME,
    });
  } catch {
    // Missing or inactive bundled artifacts are optional; callers still have
    // plugin hooks and generic `:thread:` parsing as fallbacks.
    return null;
  }
  const resolveSessionConversationLocal = loaded?.resolveSessionConversation;
  if (typeof resolveSessionConversationLocal !== "function") {
>>>>>>> upstream/main
    return null;
  }

  return normalizeSessionConversationResolution(
<<<<<<< HEAD
    resolveSessionConversation({
=======
    resolveSessionConversationLocal({
>>>>>>> upstream/main
      kind: params.kind,
      rawId: params.rawId,
    }),
  );
}

<<<<<<< HEAD
=======
function isBundledSessionConversationFallbackDisabled(channel: string): boolean {
  const snapshot = getRuntimeConfigSnapshot();
  if (!snapshot?.plugins) {
    return false;
  }
  if (snapshot.plugins.enabled === false) {
    return true;
  }
  const entry = snapshot.plugins.entries?.[normalizeResolvedChannel(channel)];
  return Boolean(entry) && typeof entry === "object" && entry.enabled === false;
}

function shouldProbeBundledSessionConversationFallback(rawId: string): boolean {
  return rawId.includes(":");
}

>>>>>>> upstream/main
function resolveSessionConversationResolution(params: {
  channel: string;
  kind: "group" | "channel";
  rawId: string;
<<<<<<< HEAD
=======
  bundledFallback?: boolean;
>>>>>>> upstream/main
}): ResolvedSessionConversation | null {
  const rawId = params.rawId.trim();
  if (!rawId) {
    return null;
  }

  const messaging = getMessagingAdapter(params.channel);
  const pluginResolved = normalizeSessionConversationResolution(
    messaging?.resolveSessionConversation?.({
      kind: params.kind,
      rawId,
    }),
  );
<<<<<<< HEAD
  const resolved =
    pluginResolved ??
    resolveBundledSessionConversationFallback({
      channel: params.channel,
      kind: params.kind,
      rawId,
    }) ??
=======
  const shouldTryBundledFallback =
    params.bundledFallback !== false &&
    !messaging &&
    shouldProbeBundledSessionConversationFallback(rawId);
  // Prefer loaded plugin messaging hooks. Bundled public artifacts are only a
  // lightweight fallback before registry bootstrap; generic parsing is last.
  const resolved =
    pluginResolved ??
    (shouldTryBundledFallback
      ? resolveBundledSessionConversationFallback({
          channel: params.channel,
          kind: params.kind,
          rawId,
        })
      : null) ??
>>>>>>> upstream/main
    buildGenericConversationResolution(rawId);
  if (!resolved) {
    return null;
  }

  const parentConversationCandidates = dedupeConversationIds(
    pluginResolved?.hasExplicitParentConversationCandidates
      ? resolved.parentConversationCandidates
      : (messaging?.resolveParentConversationCandidates?.({
          kind: params.kind,
          rawId,
        }) ?? resolved.parentConversationCandidates),
  );
  const baseConversationId =
    parentConversationCandidates.at(-1) ?? resolved.baseConversationId ?? resolved.id;

  return {
    ...resolved,
    baseConversationId,
    parentConversationCandidates,
  };
}

<<<<<<< HEAD
=======
/**
 * Resolves one raw channel conversation id into base/thread conversation metadata.
 */
>>>>>>> upstream/main
export function resolveSessionConversation(params: {
  channel: string;
  kind: "group" | "channel";
  rawId: string;
<<<<<<< HEAD
=======
  bundledFallback?: boolean;
>>>>>>> upstream/main
}): ResolvedSessionConversation | null {
  return resolveSessionConversationResolution(params);
}

function buildBaseSessionKey(raw: RawSessionConversationRef, id: string): string {
  return `${raw.prefix}:${id}`;
}

export function resolveSessionConversationRef(
  sessionKey: string | undefined | null,
<<<<<<< HEAD
=======
  opts: SessionConversationResolutionOptions = {},
>>>>>>> upstream/main
): ResolvedSessionConversationRef | null {
  const raw = parseRawSessionConversationRef(sessionKey);
  if (!raw) {
    return null;
  }

<<<<<<< HEAD
  const resolved = resolveSessionConversation(raw);
=======
  const resolved = resolveSessionConversation({
    ...raw,
    bundledFallback: opts.bundledFallback,
  });
>>>>>>> upstream/main
  if (!resolved) {
    return null;
  }

  return {
    channel: normalizeResolvedChannel(raw.channel),
    kind: raw.kind,
    rawId: raw.rawId,
    id: resolved.id,
    threadId: resolved.threadId,
    baseSessionKey: buildBaseSessionKey(raw, resolved.id),
    baseConversationId: resolved.baseConversationId,
    parentConversationCandidates: resolved.parentConversationCandidates,
  };
}

<<<<<<< HEAD
export function resolveSessionThreadInfo(
  sessionKey: string | undefined | null,
): ParsedThreadSessionSuffix {
  const resolved = resolveSessionConversationRef(sessionKey);
=======
/**
 * Resolves thread suffix metadata from a session key, using channel hooks when available.
 */
export function resolveSessionThreadInfo(
  sessionKey: string | undefined | null,
  opts: SessionConversationResolutionOptions = {},
): ParsedThreadSessionSuffix {
  const resolved = resolveSessionConversationRef(sessionKey, opts);
>>>>>>> upstream/main
  if (!resolved) {
    return parseThreadSessionSuffix(sessionKey);
  }

  return {
<<<<<<< HEAD
    baseSessionKey: resolved.threadId ? resolved.baseSessionKey : sessionKey?.trim() || undefined,
=======
    baseSessionKey: resolved.threadId
      ? resolved.baseSessionKey
      : normalizeOptionalString(sessionKey),
>>>>>>> upstream/main
    threadId: resolved.threadId,
  };
}

<<<<<<< HEAD
=======
/**
 * Resolves the parent session key for a threaded child session.
 */
>>>>>>> upstream/main
export function resolveSessionParentSessionKey(
  sessionKey: string | undefined | null,
): string | null {
  const { baseSessionKey, threadId } = resolveSessionThreadInfo(sessionKey);
  if (!threadId) {
    return null;
  }
  return baseSessionKey ?? null;
}
