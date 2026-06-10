<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { resolvePluginCapabilityProviders } from "../plugins/capability-provider-runtime.js";
import type { RealtimeTranscriptionProviderPlugin } from "../plugins/types.js";
import type { RealtimeTranscriptionProviderId } from "./provider-types.js";

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : undefined;
}

export function normalizeRealtimeTranscriptionProviderId(
  providerId: string | undefined,
): RealtimeTranscriptionProviderId | undefined {
  return trimToUndefined(providerId);
=======
// Realtime transcription provider registry stores transcription provider factories.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  resolvePluginCapabilityProvider,
  resolvePluginCapabilityProviders,
} from "../plugins/capability-provider-runtime.js";
import {
  buildCapabilityProviderMaps,
  normalizeCapabilityProviderId,
} from "../plugins/provider-registry-shared.js";
import type { RealtimeTranscriptionProviderPlugin } from "../plugins/types.js";
import type { RealtimeTranscriptionProviderId } from "./provider-types.js";

// Provider registry helpers for realtime transcription. Plugin ids and aliases
// share the generic capability-provider registry machinery.
export function normalizeRealtimeTranscriptionProviderId(
  providerId: string | undefined,
): RealtimeTranscriptionProviderId | undefined {
  return normalizeCapabilityProviderId(providerId);
>>>>>>> upstream/main
}

function resolveRealtimeTranscriptionProviderEntries(
  cfg?: OpenClawConfig,
): RealtimeTranscriptionProviderPlugin[] {
  return resolvePluginCapabilityProviders({
    key: "realtimeTranscriptionProviders",
    cfg,
  });
}

function buildProviderMaps(cfg?: OpenClawConfig): {
  canonical: Map<string, RealtimeTranscriptionProviderPlugin>;
  aliases: Map<string, RealtimeTranscriptionProviderPlugin>;
} {
<<<<<<< HEAD
  const canonical = new Map<string, RealtimeTranscriptionProviderPlugin>();
  const aliases = new Map<string, RealtimeTranscriptionProviderPlugin>();
  const register = (provider: RealtimeTranscriptionProviderPlugin) => {
    const id = normalizeRealtimeTranscriptionProviderId(provider.id);
    if (!id) {
      return;
    }
    canonical.set(id, provider);
    aliases.set(id, provider);
    for (const alias of provider.aliases ?? []) {
      const normalizedAlias = normalizeRealtimeTranscriptionProviderId(alias);
      if (normalizedAlias) {
        aliases.set(normalizedAlias, provider);
      }
    }
  };

  for (const provider of resolveRealtimeTranscriptionProviderEntries(cfg)) {
    register(provider);
  }

  return { canonical, aliases };
}

=======
  return buildCapabilityProviderMaps(resolveRealtimeTranscriptionProviderEntries(cfg));
}

/** Lists canonical realtime transcription providers for the active config. */
>>>>>>> upstream/main
export function listRealtimeTranscriptionProviders(
  cfg?: OpenClawConfig,
): RealtimeTranscriptionProviderPlugin[] {
  return [...buildProviderMaps(cfg).canonical.values()];
}

<<<<<<< HEAD
=======
/** Resolves a realtime transcription provider by id or alias. */
>>>>>>> upstream/main
export function getRealtimeTranscriptionProvider(
  providerId: string | undefined,
  cfg?: OpenClawConfig,
): RealtimeTranscriptionProviderPlugin | undefined {
  const normalized = normalizeRealtimeTranscriptionProviderId(providerId);
  if (!normalized) {
    return undefined;
  }
<<<<<<< HEAD
  return buildProviderMaps(cfg).aliases.get(normalized);
}

=======
  const directProvider = resolvePluginCapabilityProvider({
    key: "realtimeTranscriptionProviders",
    providerId: normalized,
    cfg,
  });
  if (directProvider) {
    return directProvider;
  }
  return buildProviderMaps(cfg).aliases.get(normalized);
}

/** Canonicalizes a configured provider id while preserving unknown ids. */
>>>>>>> upstream/main
export function canonicalizeRealtimeTranscriptionProviderId(
  providerId: string | undefined,
  cfg?: OpenClawConfig,
): RealtimeTranscriptionProviderId | undefined {
  const normalized = normalizeRealtimeTranscriptionProviderId(providerId);
  if (!normalized) {
    return undefined;
  }
  return getRealtimeTranscriptionProvider(normalized, cfg)?.id ?? normalized;
}
