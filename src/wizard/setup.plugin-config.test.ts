<<<<<<< HEAD
=======
// Setup plugin config tests cover plugin choices and generated config.
>>>>>>> upstream/main
import { describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import type { PluginConfigUiHint } from "../plugins/types.js";
import type { WizardPrompter } from "./prompts.js";
import {
  discoverConfigurablePlugins,
  discoverUnconfiguredPlugins,
  setupPluginConfig,
} from "./setup.plugin-config.js";

const loadPluginManifestRegistry = vi.fn();

vi.mock("../plugins/manifest-registry.js", () => ({
  loadPluginManifestRegistry,
}));

<<<<<<< HEAD
=======
vi.mock("../plugins/plugin-registry.js", () => ({
  loadPluginManifestRegistryForPluginRegistry: loadPluginManifestRegistry,
}));

vi.mock("../plugins/plugin-metadata-snapshot.js", () => ({
  loadPluginMetadataSnapshot: () => {
    const registry = loadPluginManifestRegistry();
    return {
      plugins: registry.plugins,
      manifestRegistry: registry,
    };
  },
}));

>>>>>>> upstream/main
function makeManifestPlugin(
  id: string,
  uiHints?: Record<string, PluginConfigUiHint>,
  configSchema?: Record<string, unknown>,
) {
  return {
    id,
    name: id,
    configUiHints: uiHints,
    configSchema,
    enabled: true,
    enabledByDefault: true,
  };
}

<<<<<<< HEAD
=======
function requireFirst<T>(values: T[], label: string): T {
  const value = values[0];
  if (value === undefined) {
    throw new Error(`expected first ${label}`);
  }
  return value;
}

>>>>>>> upstream/main
describe("discoverConfigurablePlugins", () => {
  it("returns plugins with non-advanced uiHints", () => {
    const plugins = [
      makeManifestPlugin("openshell", {
        mode: { label: "Mode", help: "Sandbox mode" },
        gateway: { label: "Gateway", help: "Gateway name" },
        gpu: { label: "GPU", advanced: true },
      }),
    ];
    const result = discoverConfigurablePlugins({ manifestPlugins: plugins });
    expect(result).toHaveLength(1);
<<<<<<< HEAD
    expect(result[0]).toBeDefined();
    expect(result[0].id).toBe("openshell");
    expect(Object.keys(result[0].uiHints)).toEqual(["mode", "gateway"]);
    // Advanced field excluded
    expect(result[0].uiHints.gpu).toBeUndefined();
=======
    const plugin = requireFirst(result, "configurable plugin");
    expect(plugin.id).toBe("openshell");
    expect(Object.keys(plugin.uiHints)).toEqual(["mode", "gateway"]);
    // Advanced field excluded
    expect(plugin.uiHints.gpu).toBeUndefined();
>>>>>>> upstream/main
  });

  it("excludes plugins with no uiHints", () => {
    const plugins = [makeManifestPlugin("bare-plugin")];
    const result = discoverConfigurablePlugins({ manifestPlugins: plugins });
    expect(result).toHaveLength(0);
  });

  it("excludes sensitive fields from promptable hints", () => {
    const plugins = [
      makeManifestPlugin("secret-plugin", {
        endpoint: { label: "Endpoint" },
        apiKey: { label: "API Key", sensitive: true },
      }),
    ];
    const result = discoverConfigurablePlugins({ manifestPlugins: plugins });
    expect(result).toHaveLength(1);
    // sensitive fields are still included in uiHints for discovery —
    // they are skipped at prompt time, not at discovery time
<<<<<<< HEAD
    expect(result[0].uiHints.endpoint).toBeDefined();
    expect(result[0].uiHints.apiKey).toBeDefined();
=======
    const plugin = requireFirst(result, "configurable plugin");
    expect(plugin.uiHints.endpoint?.label).toBe("Endpoint");
    expect(plugin.uiHints.apiKey?.label).toBe("API Key");
    expect(plugin.uiHints.apiKey?.sensitive).toBe(true);
>>>>>>> upstream/main
  });

  it("excludes plugins where all fields are advanced", () => {
    const plugins = [
      makeManifestPlugin("all-advanced", {
        gpu: { label: "GPU", advanced: true },
        timeout: { label: "Timeout", advanced: true },
      }),
    ];
    const result = discoverConfigurablePlugins({ manifestPlugins: plugins });
    expect(result).toHaveLength(0);
  });

  it("sorts results alphabetically by name", () => {
    const plugins = [
      makeManifestPlugin("zeta", { a: { label: "A" } }),
      makeManifestPlugin("alpha", { b: { label: "B" } }),
    ];
    const result = discoverConfigurablePlugins({ manifestPlugins: plugins });
    expect(result.map((p) => p.id)).toEqual(["alpha", "zeta"]);
  });
});

describe("discoverUnconfiguredPlugins", () => {
  it("returns plugins with at least one unconfigured field", () => {
    const plugins = [
      makeManifestPlugin("openshell", {
        mode: { label: "Mode" },
        gateway: { label: "Gateway" },
      }),
    ];
    const config: OpenClawConfig = {
      plugins: {
        entries: {
          openshell: {
            config: { mode: "mirror" },
          },
        },
      },
    };
    const result = discoverUnconfiguredPlugins({
      manifestPlugins: plugins,
      config,
    });
    // gateway is unconfigured
    expect(result).toHaveLength(1);
<<<<<<< HEAD
    expect(result[0]).toBeDefined();
    expect(result[0].id).toBe("openshell");
=======
    expect(requireFirst(result, "unconfigured plugin").id).toBe("openshell");
>>>>>>> upstream/main
  });

  it("excludes plugins where all fields are configured", () => {
    const plugins = [
      makeManifestPlugin("openshell", {
        mode: { label: "Mode" },
        gateway: { label: "Gateway" },
      }),
    ];
    const config: OpenClawConfig = {
      plugins: {
        entries: {
          openshell: {
            config: { mode: "mirror", gateway: "my-gw" },
          },
        },
      },
    };
    const result = discoverUnconfiguredPlugins({
      manifestPlugins: plugins,
      config,
    });
    expect(result).toHaveLength(0);
  });

  it("treats empty string as unconfigured", () => {
    const plugins = [
      makeManifestPlugin("test-plugin", {
        endpoint: { label: "Endpoint" },
      }),
    ];
    const config: OpenClawConfig = {
      plugins: {
        entries: {
          "test-plugin": {
            config: { endpoint: "" },
          },
        },
      },
    };
    const result = discoverUnconfiguredPlugins({
      manifestPlugins: plugins,
      config,
    });
    expect(result).toHaveLength(1);
  });

  it("returns empty when no plugins have uiHints", () => {
    const plugins = [makeManifestPlugin("bare")];
    const result = discoverUnconfiguredPlugins({
      manifestPlugins: plugins,
      config: {},
    });
    expect(result).toHaveLength(0);
  });

  it("treats dotted uiHint paths as configured when nested config exists", () => {
    const plugins = [
      makeManifestPlugin(
        "brave",
        {
          "webSearch.mode": { label: "Brave Search Mode" },
        },
        {
          type: "object",
          properties: {
            webSearch: {
              type: "object",
              properties: {
                mode: {
                  type: "string",
                  enum: ["web", "llm-context"],
                },
              },
            },
          },
        },
      ),
    ];
    const config: OpenClawConfig = {
      plugins: {
        entries: {
          brave: {
            config: {
              webSearch: {
                mode: "llm-context",
              },
            },
          },
        },
      },
    };
    const result = discoverUnconfiguredPlugins({
      manifestPlugins: plugins,
      config,
    });
    expect(result).toHaveLength(0);
  });
});

describe("setupPluginConfig", () => {
<<<<<<< HEAD
=======
  it("allows skipping plugin setup from the multiselect prompt", async () => {
    loadPluginManifestRegistry.mockReturnValue({
      plugins: [
        {
          ...makeManifestPlugin("device-pairing", {
            enabled: { label: "Enable pairing" },
          }),
          enabledByDefault: true,
        },
      ],
    });

    const note = vi.fn(async () => {});
    const select = vi.fn(async () => {
      throw new Error("select should not run when plugin setup is skipped");
    });
    const text = vi.fn(async () => {
      throw new Error("text should not run when plugin setup is skipped");
    });
    const confirm = vi.fn(async () => {
      throw new Error("confirm should not run when plugin setup is skipped");
    });

    const result = await setupPluginConfig({
      config: {
        plugins: {
          entries: {
            "device-pairing": {
              enabled: true,
            },
          },
        },
      },
      prompter: {
        intro: vi.fn(async () => {}),
        outro: vi.fn(async () => {}),
        note,
        select: select as unknown as WizardPrompter["select"],
        multiselect: vi.fn(async () => ["__skip__"]) as unknown as WizardPrompter["multiselect"],
        text,
        confirm,
        progress: vi.fn(() => ({ update: vi.fn(), stop: vi.fn() })),
      },
    });

    expect(result).toEqual({
      plugins: {
        entries: {
          "device-pairing": {
            enabled: true,
          },
        },
      },
    });
    expect(note).not.toHaveBeenCalled();
  });

>>>>>>> upstream/main
  it("writes dotted uiHint values into nested plugin config", async () => {
    loadPluginManifestRegistry.mockReturnValue({
      plugins: [
        {
          ...makeManifestPlugin(
            "brave",
            {
              "webSearch.mode": { label: "Brave Search Mode" },
            },
            {
              type: "object",
              additionalProperties: false,
              properties: {
                webSearch: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    mode: {
                      type: "string",
                      enum: ["web", "llm-context"],
                    },
                  },
                },
              },
            },
          ),
          enabledByDefault: true,
        },
      ],
    });

    const result = await setupPluginConfig({
      config: {
        plugins: {
          entries: {
            brave: {
              enabled: true,
            },
          },
        },
      },
      prompter: {
        intro: vi.fn(async () => {}),
        outro: vi.fn(async () => {}),
        note: vi.fn(async () => {}),
        select: vi.fn(async () => "llm-context") as unknown as WizardPrompter["select"],
        multiselect: vi.fn(async () => ["brave"]) as unknown as WizardPrompter["multiselect"],
        text: vi.fn(async () => ""),
        confirm: vi.fn(async () => true),
        progress: vi.fn(() => ({ update: vi.fn(), stop: vi.fn() })),
      },
    });

    expect(result.plugins?.entries?.brave?.config).toEqual({
      webSearch: {
        mode: "llm-context",
      },
    });
    expect(result.plugins?.entries?.brave?.config?.["webSearch.mode"]).toBeUndefined();
  });
<<<<<<< HEAD
=======

  it("coerces integer schema fields from text input", async () => {
    loadPluginManifestRegistry.mockReturnValue({
      plugins: [
        makeManifestPlugin(
          "retry-plugin",
          {
            retries: { label: "Retries" },
          },
          {
            type: "object",
            additionalProperties: false,
            properties: {
              retries: {
                type: "integer",
              },
            },
          },
        ),
      ],
    });

    const result = await setupPluginConfig({
      config: {
        plugins: {
          entries: {
            "retry-plugin": {
              enabled: true,
            },
          },
        },
      },
      prompter: {
        intro: vi.fn(async () => {}),
        outro: vi.fn(async () => {}),
        note: vi.fn(async () => {}),
        select: vi.fn(async () => "") as unknown as WizardPrompter["select"],
        multiselect: vi.fn(async () => [
          "retry-plugin",
        ]) as unknown as WizardPrompter["multiselect"],
        text: vi.fn(async () => "3") as unknown as WizardPrompter["text"],
        confirm: vi.fn(async () => true),
        progress: vi.fn(() => ({ update: vi.fn(), stop: vi.fn() })),
      },
    });

    expect(result.plugins?.entries?.["retry-plugin"]?.config).toEqual({
      retries: 3,
    });
  });
>>>>>>> upstream/main
});
