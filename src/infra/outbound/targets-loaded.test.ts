<<<<<<< HEAD
=======
// Verifies loaded-target resolution uses already-loaded plugins and does not
// trigger channel bootstrap discovery.
>>>>>>> upstream/main
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import { tryResolveLoadedOutboundTarget } from "./targets-loaded.js";

const mocks = vi.hoisted(() => ({
<<<<<<< HEAD
  getChannelPlugin: vi.fn(),
  getActivePluginRegistry: vi.fn(),
}));

vi.mock("../../channels/plugins/index.js", () => ({
  getChannelPlugin: mocks.getChannelPlugin,
}));

vi.mock("../../plugins/runtime.js", () => ({
  getActivePluginRegistry: mocks.getActivePluginRegistry,
=======
  getLoadedChannelPlugin: vi.fn(),
}));

vi.mock("../../channels/plugins/registry-loaded-read.js", () => ({
  getLoadedChannelPluginForRead: mocks.getLoadedChannelPlugin,
>>>>>>> upstream/main
}));

describe("tryResolveLoadedOutboundTarget", () => {
  beforeEach(() => {
<<<<<<< HEAD
    mocks.getChannelPlugin.mockReset();
    mocks.getActivePluginRegistry.mockReset();
  });

  it("returns undefined when no loaded plugin exists", () => {
    mocks.getChannelPlugin.mockReturnValue(undefined);
    mocks.getActivePluginRegistry.mockReturnValue(null);

    expect(tryResolveLoadedOutboundTarget({ channel: "telegram", to: "123" })).toBeUndefined();
=======
    mocks.getLoadedChannelPlugin.mockReset();
  });

  it("returns undefined when no loaded plugin exists", () => {
    mocks.getLoadedChannelPlugin.mockReturnValue(undefined);

    expect(tryResolveLoadedOutboundTarget({ channel: "alpha", to: "room-one" })).toBeUndefined();
>>>>>>> upstream/main
  });

  it("uses loaded plugin config defaultTo fallback", () => {
    const cfg: OpenClawConfig = {
<<<<<<< HEAD
      channels: { telegram: { defaultTo: "123456789" } },
    };
    mocks.getChannelPlugin.mockReturnValue({
      id: "telegram",
      meta: { label: "Telegram" },
      capabilities: {},
      config: {
        resolveDefaultTo: ({ cfg }: { cfg: OpenClawConfig }) => cfg.channels?.telegram?.defaultTo,
=======
      channels: { alpha: { defaultTo: "room-one" } },
    };
    mocks.getLoadedChannelPlugin.mockReturnValue({
      id: "alpha",
      meta: { label: "Alpha" },
      capabilities: {},
      config: {
        resolveDefaultTo: ({ cfg: cfgLocal }: { cfg: OpenClawConfig }) =>
          (cfgLocal.channels?.alpha as { defaultTo?: string } | undefined)?.defaultTo,
>>>>>>> upstream/main
      },
      outbound: {},
      messaging: {},
    });

    expect(
      tryResolveLoadedOutboundTarget({
<<<<<<< HEAD
        channel: "telegram",
=======
        channel: "alpha",
>>>>>>> upstream/main
        to: "",
        cfg,
        mode: "implicit",
      }),
<<<<<<< HEAD
    ).toEqual({ ok: true, to: "123456789" });
=======
    ).toEqual({ ok: true, to: "room-one" });
  });

  it("trims channel ids before reading the loaded registry", () => {
    tryResolveLoadedOutboundTarget({ channel: " alpha " as never, to: "room-one" });

    expect(mocks.getLoadedChannelPlugin).toHaveBeenCalledWith("alpha");
>>>>>>> upstream/main
  });
});
