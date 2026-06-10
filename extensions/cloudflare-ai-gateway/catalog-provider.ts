<<<<<<< HEAD
import {
  coerceSecretRef,
  ensureAuthProfileStore,
  resolveNonEnvSecretRefApiKeyMarker,
} from "openclaw/plugin-sdk/provider-auth";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
=======
/**
 * Builds runtime model catalog entries from stored Cloudflare AI Gateway auth
 * profiles.
 */
import {
  coerceSecretRef,
  resolveNonEnvSecretRefApiKeyMarker,
} from "openclaw/plugin-sdk/provider-auth";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import {
  buildCloudflareAiGatewayModelDefinition,
  resolveCloudflareAiGatewayBaseUrl,
} from "./models.js";

<<<<<<< HEAD
export type CloudflareAiGatewayCredential =
  | ReturnType<typeof ensureAuthProfileStore>["profiles"][string]
  | undefined;

export function resolveCloudflareAiGatewayApiKey(
  cred: CloudflareAiGatewayCredential,
): string | undefined {
=======
type CloudflareAiGatewayCredential =
  | {
      type?: string;
      keyRef?: unknown;
      key?: unknown;
      metadata?: {
        accountId?: unknown;
        gatewayId?: unknown;
      };
    }
  | undefined;

function resolveCloudflareAiGatewayApiKey(cred: CloudflareAiGatewayCredential): string | undefined {
>>>>>>> upstream/main
  if (!cred || cred.type !== "api_key") {
    return undefined;
  }

  const keyRef = coerceSecretRef(cred.keyRef);
<<<<<<< HEAD
  if (keyRef && keyRef.id.trim()) {
    return keyRef.source === "env"
      ? keyRef.id.trim()
      : resolveNonEnvSecretRefApiKeyMarker(keyRef.source);
  }
  return cred.key?.trim() || undefined;
}

export function resolveCloudflareAiGatewayMetadata(cred: CloudflareAiGatewayCredential): {
=======
  const keyRefId = normalizeOptionalString(keyRef?.id);
  if (keyRef && keyRefId) {
    return keyRef.source === "env" ? keyRefId : resolveNonEnvSecretRefApiKeyMarker(keyRef.source);
  }
  return normalizeOptionalString(cred.key);
}

function resolveCloudflareAiGatewayMetadata(cred: CloudflareAiGatewayCredential): {
>>>>>>> upstream/main
  accountId?: string;
  gatewayId?: string;
} {
  if (!cred || cred.type !== "api_key") {
    return {};
  }
  return {
<<<<<<< HEAD
    accountId: cred.metadata?.accountId?.trim() || undefined,
    gatewayId: cred.metadata?.gatewayId?.trim() || undefined,
  };
}

export function buildCloudflareAiGatewayCatalogProvider(params: {
  credential: CloudflareAiGatewayCredential;
  envApiKey?: string;
}): ModelProviderConfig | null {
  const apiKey = params.envApiKey?.trim() || resolveCloudflareAiGatewayApiKey(params.credential);
=======
    accountId: normalizeOptionalString(cred.metadata?.accountId),
    gatewayId: normalizeOptionalString(cred.metadata?.gatewayId),
  };
}

/**
 * Returns a provider catalog entry when credentials and Gateway metadata are
 * complete enough to construct an Anthropic-compatible base URL.
 */
export function buildCloudflareAiGatewayCatalogProvider(params: {
  credential: CloudflareAiGatewayCredential;
  envApiKey?: string;
}) {
  const apiKey =
    normalizeOptionalString(params.envApiKey) ??
    resolveCloudflareAiGatewayApiKey(params.credential);
>>>>>>> upstream/main
  if (!apiKey) {
    return null;
  }
  const { accountId, gatewayId } = resolveCloudflareAiGatewayMetadata(params.credential);
  if (!accountId || !gatewayId) {
    return null;
  }
  const baseUrl = resolveCloudflareAiGatewayBaseUrl({ accountId, gatewayId });
  if (!baseUrl) {
    return null;
  }
  return {
    baseUrl,
<<<<<<< HEAD
    api: "anthropic-messages",
=======
    api: "anthropic-messages" as const,
>>>>>>> upstream/main
    apiKey,
    models: [buildCloudflareAiGatewayModelDefinition()],
  };
}
