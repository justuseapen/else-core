<<<<<<< HEAD
=======
// Opencode Go setup module handles plugin onboarding behavior.
>>>>>>> upstream/main
import {
  applyAgentDefaultModelPrimary,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";

<<<<<<< HEAD
export const OPENCODE_GO_DEFAULT_MODEL_REF = "opencode-go/kimi-k2.5";

const OPENCODE_GO_ALIAS_DEFAULTS: Record<string, string> = {
  "opencode-go/kimi-k2.5": "Kimi",
  "opencode-go/glm-5": "GLM",
  "opencode-go/minimax-m2.5": "MiniMax",
};
=======
export const OPENCODE_GO_DEFAULT_MODEL_REF = "opencode-go/kimi-k2.6";
>>>>>>> upstream/main

export function applyOpencodeGoProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return cfg;
}

export function applyOpencodeGoConfig(cfg: OpenClawConfig): OpenClawConfig {
  return applyAgentDefaultModelPrimary(
    applyOpencodeGoProviderConfig(cfg),
    OPENCODE_GO_DEFAULT_MODEL_REF,
  );
}
