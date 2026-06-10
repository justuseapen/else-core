// Control UI bootstrap contract served by the gateway and consumed by the
// browser app before it knows runtime branding, media roots, or embed policy.
/** HTTP path for the Control UI bootstrap config payload. */
export const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/__openclaw/control-ui-config.json";

<<<<<<< HEAD
export const CONTROL_UI_PROFILES = ["openclaw", "americanclaw", "elsehelp"] as const;

export type ControlUiProfile = (typeof CONTROL_UI_PROFILES)[number];

export const DEFAULT_CONTROL_UI_PROFILE: ControlUiProfile = "americanclaw";

export function isControlUiProfile(value: unknown): value is ControlUiProfile {
  return typeof value === "string" && (CONTROL_UI_PROFILES as readonly string[]).includes(value);
}

=======
/** Sandbox policy for assistant-provided embed surfaces inside Control UI. */
export type ControlUiEmbedSandboxMode = "strict" | "scripts" | "trusted";

/** Runtime config consumed by the browser Control UI during bootstrap. */
>>>>>>> upstream/main
export type ControlUiBootstrapConfig = {
  basePath: string;
  profile: ControlUiProfile;
  assistantName: string;
  assistantAvatar: string;
<<<<<<< HEAD
=======
  assistantAvatarSource?: string | null;
  assistantAvatarStatus?: "none" | "local" | "remote" | "data" | null;
  assistantAvatarReason?: string | null;
  assistantAgentId: string;
  serverVersion?: string;
  localMediaPreviewRoots?: string[];
  embedSandbox?: ControlUiEmbedSandboxMode;
  allowExternalEmbedUrls?: boolean;
  chatMessageMaxWidth?: string;
>>>>>>> upstream/main
};
