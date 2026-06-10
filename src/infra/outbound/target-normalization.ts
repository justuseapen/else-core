<<<<<<< HEAD
import { getChannelPlugin, normalizeChannelId } from "../../channels/plugins/index.js";
import type { ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
=======
// Outbound target normalization trims user input, applies plugin normalizers,
// and optionally resolves directory-backed destinations.
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { getChannelPlugin } from "../../channels/plugins/index.js";
import { getLoadedChannelPluginForRead } from "../../channels/plugins/registry-loaded-read.js";
import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
>>>>>>> upstream/main
import { getActivePluginChannelRegistryVersion } from "../../plugins/runtime.js";

/**
 * Normalizes raw user/channel target input before provider-specific parsing.
 */
export function normalizeChannelTargetInput(raw: string): string {
  return raw.trim();
}

type TargetNormalizer = ((raw: string) => string | undefined) | undefined;
type TargetNormalizerCacheEntry = {
  version: number;
  normalizer: TargetNormalizer;
};

const targetNormalizerCacheByChannelId = new Map<string, TargetNormalizerCacheEntry>();

<<<<<<< HEAD
=======
function resolveChannelPluginForTargetRead(channelId: ChannelId): ChannelPlugin | undefined {
  return getLoadedChannelPluginForRead(channelId) ?? getChannelPlugin(channelId);
}

>>>>>>> upstream/main
function resetTargetNormalizerCacheForTests(): void {
  targetNormalizerCacheByChannelId.clear();
}

<<<<<<< HEAD
export const __testing = {
=======
export const testing = {
>>>>>>> upstream/main
  resetTargetNormalizerCacheForTests,
} as const;

function resolveTargetNormalizer(channelId: ChannelId): TargetNormalizer {
  const version = getActivePluginChannelRegistryVersion();
  const cached = targetNormalizerCacheByChannelId.get(channelId);
  if (cached && cached.version === version) {
    return cached.normalizer;
  }
  // Plugin channel metadata is process-stable between registry version bumps.
  const plugin = resolveChannelPluginForTargetRead(channelId);
  const normalizer = plugin?.messaging?.normalizeTarget;
  targetNormalizerCacheByChannelId.set(channelId, {
    version,
    normalizer,
  });
  return normalizer;
}

/**
 * Applies a channel plugin normalizer and falls back to trimmed input.
 */
export function normalizeTargetForProvider(provider: string, raw?: string): string | undefined {
  if (!raw) {
    return undefined;
  }
  const fallback = normalizeOptionalString(raw);
  if (!fallback) {
    return undefined;
  }
  const providerId = normalizeOptionalLowercaseString(provider);
  const normalizer = providerId ? resolveTargetNormalizer(providerId) : undefined;
  return normalizeOptionalString(normalizer?.(raw) ?? fallback);
}

<<<<<<< HEAD
export type TargetResolveKindLike = ChannelDirectoryEntryKind | "channel";

=======
/**
 * Directory target kinds accepted by plugin-backed target resolution.
 */
export type TargetResolveKindLike = ChannelDirectoryEntryKind | "channel";

/**
 * Resolved outbound target returned by a channel plugin target resolver.
 */
>>>>>>> upstream/main
export type ResolvedPluginMessagingTarget = {
  to: string;
  kind: TargetResolveKindLike;
  display?: string;
  source: "normalized" | "directory";
<<<<<<< HEAD
};

=======
  resolutionSource: "plugin";
};

/**
 * Produces raw and provider-normalized forms of a nonblank target input.
 */
>>>>>>> upstream/main
export function resolveNormalizedTargetInput(
  provider: string,
  raw?: string,
): { raw: string; normalized: string } | undefined {
  const trimmed = normalizeChannelTargetInput(raw ?? "");
  if (!trimmed) {
    return undefined;
  }
  return {
    raw: trimmed,
    normalized: normalizeTargetForProvider(provider, trimmed) ?? trimmed,
  };
}

<<<<<<< HEAD
=======
/**
 * Detects whether input is specific enough to invoke plugin target resolution.
 */
>>>>>>> upstream/main
export function looksLikeTargetId(params: {
  channel: ChannelId;
  raw: string;
  normalized?: string;
}): boolean {
  const normalizedInput =
    params.normalized ?? normalizeTargetForProvider(params.channel, params.raw);
<<<<<<< HEAD
  const lookup = getChannelPlugin(params.channel)?.messaging?.targetResolver?.looksLikeId;
  if (lookup) {
=======
  const lookup = resolveChannelPluginForTargetRead(params.channel)?.messaging?.targetResolver
    ?.looksLikeId;
  if (lookup) {
    // Plugin heuristics win so provider-specific ids do not fall through to
    // generic phone/mention checks.
>>>>>>> upstream/main
    return lookup(params.raw, normalizedInput ?? params.raw);
  }
  if (/^(channel|group|user):/i.test(params.raw)) {
    return true;
  }
  if (/^[@#]/.test(params.raw)) {
    return true;
  }
  if (/^\+?\d{6,}$/.test(params.raw)) {
    return true;
  }
  if (params.raw.includes("@thread")) {
    return true;
  }
  return /^(conversation|user):/i.test(params.raw);
}

<<<<<<< HEAD
=======
/**
 * Resolves a normalized target through the channel plugin when a resolver is available.
 */
>>>>>>> upstream/main
export async function maybeResolvePluginMessagingTarget(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  input: string;
  accountId?: string | null;
  preferredKind?: TargetResolveKindLike;
  requireIdLike?: boolean;
}): Promise<ResolvedPluginMessagingTarget | undefined> {
  const normalizedInput = resolveNormalizedTargetInput(params.channel, params.input);
  if (!normalizedInput) {
    return undefined;
  }
<<<<<<< HEAD
  const resolver = getChannelPlugin(params.channel)?.messaging?.targetResolver;
=======
  const resolver = resolveChannelPluginForTargetRead(params.channel)?.messaging?.targetResolver;
>>>>>>> upstream/main
  if (!resolver?.resolveTarget) {
    return undefined;
  }
  if (
    params.requireIdLike &&
    !looksLikeTargetId({
      channel: params.channel,
      raw: normalizedInput.raw,
      normalized: normalizedInput.normalized,
    })
  ) {
    return undefined;
  }
  const resolved = await resolver.resolveTarget({
    cfg: params.cfg,
    accountId: params.accountId,
    input: normalizedInput.raw,
    normalized: normalizedInput.normalized,
    preferredKind: params.preferredKind,
  });
  if (!resolved) {
    return undefined;
  }
  return {
    to: resolved.to,
    kind: resolved.kind,
    display: resolved.display,
    source: resolved.source ?? "normalized",
<<<<<<< HEAD
  };
}

=======
    resolutionSource: "plugin",
  };
}

/**
 * Builds a cache signature for target-resolution behavior exposed by a channel plugin.
 */
>>>>>>> upstream/main
export function buildTargetResolverSignature(channel: ChannelId): string {
  const plugin = resolveChannelPluginForTargetRead(channel);
  const resolver = plugin?.messaging?.targetResolver;
  const hint = resolver?.hint ?? "";
  const looksLike = resolver?.looksLikeId;
  // Function source is only a cheap invalidation hint; resolver behavior still belongs to the plugin.
  const source = looksLike ? looksLike.toString() : "";
  return hashSignature(`${hint}|${source}`);
}

function hashSignature(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
export { testing as __testing };
