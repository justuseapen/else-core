<<<<<<< HEAD
import type { SecretInput } from "./types.secrets.js";

=======
/**
 * Config types for provider HTTP transport overrides.
 * Values that can carry credentials use SecretInput so redaction and secret refs stay consistent.
 */
import type { SecretInput } from "./types.secrets.js";

/** Authentication override applied to provider requests after model/provider defaults resolve. */
>>>>>>> upstream/main
export type ConfiguredProviderRequestAuth =
  | {
      mode: "provider-default";
    }
  | {
      mode: "authorization-bearer";
      token: SecretInput;
    }
  | {
      mode: "header";
      headerName: string;
      value: SecretInput;
      prefix?: string;
    };

<<<<<<< HEAD
=======
/** TLS material and verification knobs for provider or proxy connections. */
>>>>>>> upstream/main
export type ConfiguredProviderRequestTls = {
  ca?: SecretInput;
  cert?: SecretInput;
  key?: SecretInput;
  passphrase?: SecretInput;
  serverName?: string;
  insecureSkipVerify?: boolean;
};

<<<<<<< HEAD
=======
/** Proxy selection for provider requests, including optional TLS settings for proxy transport. */
>>>>>>> upstream/main
export type ConfiguredProviderRequestProxy =
  | {
      mode: "env-proxy";
      tls?: ConfiguredProviderRequestTls;
    }
  | {
      mode: "explicit-proxy";
      url: string;
      tls?: ConfiguredProviderRequestTls;
    };

<<<<<<< HEAD
=======
/** Shared provider request overrides used by model providers and media/tool providers. */
>>>>>>> upstream/main
export type ConfiguredProviderRequest = {
  headers?: Record<string, SecretInput>;
  auth?: ConfiguredProviderRequestAuth;
  proxy?: ConfiguredProviderRequestProxy;
  tls?: ConfiguredProviderRequestTls;
};

<<<<<<< HEAD
export type ConfiguredModelProviderRequest = ConfiguredProviderRequest;
=======
/** Model-provider request overrides plus the private-network opt-in used by model transports. */
export type ConfiguredModelProviderRequest = ConfiguredProviderRequest & {
  allowPrivateNetwork?: boolean;
};
>>>>>>> upstream/main
