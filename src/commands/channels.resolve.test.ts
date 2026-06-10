// Channels resolve tests cover channel/account selection and command output for message routing.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { channelsResolveCommand } from "./channels/resolve.js";

const mocks = vi.hoisted(() => ({
  resolveCommandSecretRefsViaGateway: vi.fn(),
  getChannelsCommandSecretTargetIds: vi.fn(() => []),
  loadConfig: vi.fn(),
  readConfigFileSnapshot: vi.fn(),
  applyPluginAutoEnable: vi.fn(),
  replaceConfigFile: vi.fn(),
<<<<<<< HEAD
=======
  refreshPluginRegistryAfterConfigMutation: vi.fn(async () => undefined),
>>>>>>> upstream/main
  resolveMessageChannelSelection: vi.fn(),
  resolveInstallableChannelPlugin: vi.fn(),
  getChannelPlugin: vi.fn(),
}));

vi.mock("../cli/command-secret-gateway.js", () => ({
  resolveCommandSecretRefsViaGateway: mocks.resolveCommandSecretRefsViaGateway,
}));

vi.mock("../cli/command-secret-targets.js", () => ({
  getChannelsCommandSecretTargetIds: mocks.getChannelsCommandSecretTargetIds,
}));

vi.mock("../config/config.js", () => ({
  getRuntimeConfig: mocks.loadConfig,
  loadConfig: mocks.loadConfig,
  readConfigFileSnapshot: mocks.readConfigFileSnapshot,
  replaceConfigFile: mocks.replaceConfigFile,
}));

<<<<<<< HEAD
=======
vi.mock("../cli/plugins-registry-refresh.js", () => ({
  refreshPluginRegistryAfterConfigMutation: mocks.refreshPluginRegistryAfterConfigMutation,
}));

>>>>>>> upstream/main
vi.mock("../config/plugin-auto-enable.js", () => ({
  applyPluginAutoEnable: mocks.applyPluginAutoEnable,
}));

vi.mock("../infra/outbound/channel-selection.js", () => ({
  resolveMessageChannelSelection: mocks.resolveMessageChannelSelection,
}));

vi.mock("./channel-setup/channel-plugin-resolution.js", () => ({
  resolveInstallableChannelPlugin: mocks.resolveInstallableChannelPlugin,
}));

vi.mock("../channels/plugins/index.js", () => ({
  getChannelPlugin: mocks.getChannelPlugin,
}));

<<<<<<< HEAD
=======
function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`expected ${label}`);
  }
  return value as Record<string, unknown>;
}

function requireFirstMockArg(
  mock: { mock: { calls: unknown[][] } },
  label: string,
): Record<string, unknown> {
  const [call] = mock.mock.calls;
  if (!call) {
    throw new Error(`expected ${label} call`);
  }
  return requireRecord(call[0], `${label} request`);
}

>>>>>>> upstream/main
describe("channelsResolveCommand", () => {
  const runtime = {
    log: vi.fn(),
    error: vi.fn(),
    exit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.loadConfig.mockReturnValue({ channels: {} });
    mocks.readConfigFileSnapshot.mockResolvedValue({ hash: "config-1" });
<<<<<<< HEAD
=======
    mocks.refreshPluginRegistryAfterConfigMutation.mockResolvedValue(undefined);
>>>>>>> upstream/main
    mocks.applyPluginAutoEnable.mockImplementation(({ config }) => ({ config, changes: [] }));
    mocks.replaceConfigFile.mockResolvedValue(undefined);
    mocks.resolveCommandSecretRefsViaGateway.mockResolvedValue({
      resolvedConfig: { channels: {} },
      diagnostics: [],
    });
    mocks.resolveMessageChannelSelection.mockResolvedValue({
      channel: "telegram",
      configured: ["telegram"],
      source: "explicit",
    });
  });

  it("uses installed channel plugins for explicit target resolution without installing", async () => {
    const resolveTargets = vi.fn().mockResolvedValue([
      {
        input: "friends",
        resolved: true,
        id: "120363000000@g.us",
        name: "Friends",
      },
    ]);
    mocks.resolveInstallableChannelPlugin.mockResolvedValue({
      cfg: { channels: {} },
      channelId: "whatsapp",
      configChanged: false,
      pluginInstalled: false,
      plugin: {
        id: "whatsapp",
        resolver: { resolveTargets },
      },
    });

    await channelsResolveCommand(
      {
        channel: "whatsapp",
        entries: ["friends"],
      },
      runtime,
    );

<<<<<<< HEAD
    expect(mocks.resolveInstallableChannelPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        rawChannel: "whatsapp",
        allowInstall: true,
      }),
    );
    expect(mocks.replaceConfigFile).toHaveBeenCalledWith({
      nextConfig: installedCfg,
      baseHash: "config-1",
    });
    expect(resolveTargets).toHaveBeenCalledWith(
      expect.objectContaining({
        cfg: installedCfg,
        inputs: ["friends"],
        kind: "group",
      }),
=======
    expect(mocks.resolveInstallableChannelPlugin).toHaveBeenCalledTimes(1);
    const pluginResolutionRequest = requireFirstMockArg(
      mocks.resolveInstallableChannelPlugin,
      "installable channel resolution",
>>>>>>> upstream/main
    );
    expect(pluginResolutionRequest.rawChannel).toBe("whatsapp");
    expect(pluginResolutionRequest.allowInstall).toBe(false);
    expect(mocks.replaceConfigFile).not.toHaveBeenCalled();
    expect(mocks.refreshPluginRegistryAfterConfigMutation).not.toHaveBeenCalled();
    expect(resolveTargets).toHaveBeenCalledTimes(1);
    const resolveRequest = requireFirstMockArg(resolveTargets, "target resolution");
    expect(resolveRequest.cfg).toStrictEqual({ channels: {} });
    expect(resolveRequest.inputs).toStrictEqual(["friends"]);
    expect(resolveRequest.kind).toBe("group");
    expect(runtime.log).toHaveBeenCalledWith("friends -> 120363000000@g.us (Friends)");
  });

<<<<<<< HEAD
=======
  it("tells users to add an explicit catalog channel before resolving", async () => {
    mocks.resolveInstallableChannelPlugin.mockResolvedValue({
      cfg: { channels: {} },
      channelId: "external-chat",
      catalogEntry: { id: "external-chat" },
      configChanged: false,
      pluginInstalled: false,
    });

    await expect(
      channelsResolveCommand(
        {
          channel: "external-chat",
          entries: ["friends"],
        },
        runtime,
      ),
    ).rejects.toThrow(
      /Channel plugin "external-chat" is not installed\. Run .*channels add --channel external-chat.* first\./,
    );
  });

>>>>>>> upstream/main
  it("uses the auto-enabled config snapshot for omitted channel resolution", async () => {
    const autoEnabledConfig = {
      channels: { whatsapp: {} },
      plugins: { allow: ["whatsapp"] },
    };
    const resolveTargets = vi.fn().mockResolvedValue([
      {
        input: "friends",
        resolved: true,
        id: "120363000000@g.us",
        name: "Friends",
      },
    ]);
    mocks.resolveCommandSecretRefsViaGateway.mockResolvedValue({
      resolvedConfig: { channels: {} },
      diagnostics: [],
    });
    mocks.applyPluginAutoEnable.mockReturnValue({ config: autoEnabledConfig, changes: [] });
    mocks.resolveMessageChannelSelection.mockResolvedValue({
      channel: "whatsapp",
      configured: ["whatsapp"],
      source: "single-configured",
    });
    mocks.getChannelPlugin.mockReturnValue({
      id: "whatsapp",
      resolver: { resolveTargets },
    });

    await channelsResolveCommand(
      {
        entries: ["friends"],
      },
      runtime,
    );

    expect(mocks.applyPluginAutoEnable).toHaveBeenCalledWith({
      config: { channels: {} },
      env: process.env,
    });
    expect(mocks.resolveMessageChannelSelection).toHaveBeenCalledWith({
      cfg: autoEnabledConfig,
      channel: null,
    });
<<<<<<< HEAD
    expect(resolveTargets).toHaveBeenCalledWith(
      expect.objectContaining({
        cfg: autoEnabledConfig,
        inputs: ["friends"],
        kind: "group",
      }),
    );
=======
    expect(resolveTargets).toHaveBeenCalledTimes(1);
    const resolveRequest = requireFirstMockArg(resolveTargets, "target resolution");
    expect(resolveRequest.cfg).toBe(autoEnabledConfig);
    expect(resolveRequest.inputs).toStrictEqual(["friends"]);
    expect(resolveRequest.kind).toBe("group");
>>>>>>> upstream/main
  });
});
