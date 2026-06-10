<<<<<<< HEAD
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { CoreConfig } from "./types.js";

vi.mock("../../../src/config/bundled-channel-config-runtime.js", () => ({
  getBundledChannelRuntimeMap: () => new Map(),
  getBundledChannelConfigSchemaMap: () => new Map(),
}));

vi.mock("../../../src/channels/plugins/bundled.js", () => ({
  bundledChannelPlugins: [],
  bundledChannelSetupPlugins: [],
}));

let nextcloudTalkPlugin: typeof import("./channel.js").nextcloudTalkPlugin;
let NextcloudTalkConfigSchema: typeof import("./config-schema.js").NextcloudTalkConfigSchema;

beforeAll(async () => {
  ({ nextcloudTalkPlugin } = await import("./channel.js"));
  ({ NextcloudTalkConfigSchema } = await import("./config-schema.js"));
});

=======
// Nextcloud Talk tests cover channel.core plugin behavior.
import { describe, expect, it } from "vitest";
import {
  nextcloudTalkConfigAdapter,
  nextcloudTalkPairingTextAdapter,
  nextcloudTalkSecurityAdapter,
} from "./channel.adapters.js";
import { NextcloudTalkConfigSchema } from "./config-schema.js";
import type { CoreConfig } from "./types.js";

>>>>>>> upstream/main
describe("nextcloud talk channel core", () => {
  it("accepts SecretRef botSecret and apiPassword at top-level", () => {
    const result = NextcloudTalkConfigSchema.safeParse({
      baseUrl: "https://cloud.example.com",
      botSecret: { source: "env", provider: "default", id: "NEXTCLOUD_TALK_BOT_SECRET" },
      apiUser: "bot",
      apiPassword: { source: "env", provider: "default", id: "NEXTCLOUD_TALK_API_PASSWORD" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts SecretRef botSecret and apiPassword on account", () => {
    const result = NextcloudTalkConfigSchema.safeParse({
      accounts: {
        main: {
          baseUrl: "https://cloud.example.com",
          botSecret: {
            source: "env",
            provider: "default",
            id: "NEXTCLOUD_TALK_MAIN_BOT_SECRET",
          },
          apiUser: "bot",
          apiPassword: {
            source: "env",
            provider: "default",
            id: "NEXTCLOUD_TALK_MAIN_API_PASSWORD",
          },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it("normalizes trimmed DM allowlist prefixes to lowercase ids", () => {
<<<<<<< HEAD
    const resolveDmPolicy = nextcloudTalkPlugin.security?.resolveDmPolicy;
=======
    const resolveDmPolicy = nextcloudTalkSecurityAdapter.resolveDmPolicy;
>>>>>>> upstream/main
    if (!resolveDmPolicy) {
      throw new Error("resolveDmPolicy unavailable");
    }

    const cfg = {
      channels: {
        "nextcloud-talk": {
          baseUrl: "https://cloud.example.com",
          botSecret: "secret",
          dmPolicy: "allowlist",
          allowFrom: ["  nc:User-Id  "],
        },
      },
    } as CoreConfig;

    const result = resolveDmPolicy({
      cfg,
<<<<<<< HEAD
      account: nextcloudTalkPlugin.config.resolveAccount(cfg, "default"),
=======
      account: nextcloudTalkConfigAdapter.resolveAccount(cfg, "default"),
>>>>>>> upstream/main
    });
    if (!result) {
      throw new Error("nextcloud-talk resolveDmPolicy returned null");
    }

    expect(result.policy).toBe("allowlist");
    expect(result.allowFrom).toEqual(["  nc:User-Id  "]);
    expect(result.normalizeEntry?.("  nc:User-Id  ")).toBe("user-id");
<<<<<<< HEAD
    expect(nextcloudTalkPlugin.pairing?.normalizeAllowEntry?.("  nextcloud-talk:User-Id  ")).toBe(
=======
    expect(nextcloudTalkPairingTextAdapter.normalizeAllowEntry("  nextcloud-talk:User-Id  ")).toBe(
>>>>>>> upstream/main
      "user-id",
    );
  });
});
