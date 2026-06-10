<<<<<<< HEAD
import { resolveManifestProviderApiKeyChoice } from "../plugins/provider-auth-choices.js";
import { normalizeTokenProviderInput } from "./auth-choice.apply-helpers.js";
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import type { AuthChoice } from "./onboard-types.js";

=======
// Token-provider normalization hooks for provider-backed auth choices.
import { resolveProviderMatch } from "../plugins/provider-auth-choice-helpers.js";
import { resolvePluginProviders } from "../plugins/provider-auth-choice.runtime.js";
import type { ProviderAuthKind } from "../plugins/types.js";
import { normalizeTokenProviderInput } from "./auth-choice.apply-helpers.js";
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.types.js";
import type { AuthChoice } from "./onboard-types.js";

function resolveProviderAuthChoiceByKind(params: {
  providerId: string;
  kind: ProviderAuthKind;
  config?: ApplyAuthChoiceParams["config"];
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): AuthChoice | undefined {
  const provider = resolveProviderMatch(
    resolvePluginProviders({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      mode: "setup",
    }),
    params.providerId,
  );
  const choiceId = provider?.auth.find((method) => method.kind === params.kind)?.wizard?.choiceId;
  return choiceId as AuthChoice | undefined;
}

/** Translate generic api-key/token choices to provider-specific auth choices when possible. */
>>>>>>> upstream/main
export function normalizeApiKeyTokenProviderAuthChoice(params: {
  authChoice: AuthChoice;
  tokenProvider?: string;
  config?: ApplyAuthChoiceParams["config"];
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): AuthChoice {
  if (!params.tokenProvider) {
    return params.authChoice;
  }
  const normalizedTokenProvider = normalizeTokenProviderInput(params.tokenProvider);
  if (!normalizedTokenProvider) {
    return params.authChoice;
  }
<<<<<<< HEAD
  if (
    (params.authChoice === "token" || params.authChoice === "setup-token") &&
    normalizedTokenProvider === "anthropic"
  ) {
    return "setup-token";
=======
  if (params.authChoice === "token" || params.authChoice === "setup-token") {
    return (
      resolveProviderAuthChoiceByKind({
        providerId: normalizedTokenProvider,
        kind: "token",
        config: params.config,
        workspaceDir: params.workspaceDir,
        env: params.env,
      }) ?? params.authChoice
    );
>>>>>>> upstream/main
  }
  if (params.authChoice !== "apiKey") {
    return params.authChoice;
  }
  return (
    resolveProviderAuthChoiceByKind({
      providerId: normalizedTokenProvider,
      kind: "api_key",
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
<<<<<<< HEAD
    })?.choiceId as AuthChoice | undefined) ?? params.authChoice
=======
    }) ?? params.authChoice
>>>>>>> upstream/main
  );
}

/** Reserved extension point for historical api-provider auth application flows. */
export async function applyAuthChoiceApiProviders(
  _params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  return null;
}
