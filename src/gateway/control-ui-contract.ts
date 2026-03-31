export const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/__openclaw/control-ui-config.json";

export const CONTROL_UI_PROFILES = ["openclaw", "americanclaw", "elsehelp"] as const;

export type ControlUiProfile = (typeof CONTROL_UI_PROFILES)[number];

export const DEFAULT_CONTROL_UI_PROFILE: ControlUiProfile = "americanclaw";

export function isControlUiProfile(value: unknown): value is ControlUiProfile {
  return typeof value === "string" && (CONTROL_UI_PROFILES as readonly string[]).includes(value);
}

export type ControlUiBootstrapConfig = {
  basePath: string;
  profile: ControlUiProfile;
  assistantName: string;
  assistantAvatar: string;
};
