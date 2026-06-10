<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import { importFreshModule } from "../../test/helpers/import-fresh.ts";
=======
// Verifies bundled channel config runtime loading stays lazy and bounded.
import { importFreshModule } from "openclaw/plugin-sdk/test-fixtures";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../plugins/bundled-plugin-metadata.js", () => ({
  listBundledPluginMetadata: () => [
    {
      manifest: {
        channelConfigs: {
          msteams: {
            schema: { type: "object" },
            runtime: { configWrites: true },
          },
          whatsapp: {
            schema: { type: "object" },
          },
        },
      },
    },
  ],
}));
>>>>>>> upstream/main

describe("bundled channel config runtime", () => {
  beforeEach(() => {
    vi.doUnmock("../channels/plugins/bundled.js");
<<<<<<< HEAD
  });

  it("tolerates an unavailable bundled channel list during import", async () => {
=======
    vi.doUnmock("../plugins/bundled-plugin-metadata.js");
  });

  function mockBundledPluginMetadata() {
    vi.doMock("../plugins/bundled-plugin-metadata.js", () => ({
      listBundledPluginMetadata: () => [
        {
          manifest: {
            channelConfigs: {
              msteams: { schema: { type: "object" }, runtime: {} },
              whatsapp: { schema: { type: "object" } },
            },
          },
        },
      ],
    }));
  }

  it("tolerates an unavailable bundled channel list during import", async () => {
    mockBundledPluginMetadata();
>>>>>>> upstream/main
    vi.doMock("../channels/plugins/bundled.js", () => ({
      listBundledChannelPlugins: () => undefined,
    }));

    const runtimeModule = await importFreshModule<
<<<<<<< HEAD
      typeof import("./bundled-channel-config-runtime.js")
    >(import.meta.url, "./bundled-channel-config-runtime.js?scope=missing-bundled-list");

    expect(runtimeModule.getBundledChannelConfigSchemaMap().get("msteams")).toBeDefined();
    expect(runtimeModule.getBundledChannelRuntimeMap().get("msteams")).toBeDefined();
  });

  it("falls back to static channel schemas when bundled plugin access hits a TDZ-style ReferenceError", async () => {
=======
      typeof import("../../test/helpers/config/bundled-channel-config-runtime.js")
    >(
      import.meta.url,
      "../../test/helpers/config/bundled-channel-config-runtime.js?scope=missing-bundled-list",
    );

    const schemaEntry = runtimeModule.getBundledChannelConfigSchemaMap().get("msteams");
    expect(schemaEntry?.schema).toEqual({ type: "object" });
    expect(schemaEntry?.runtime).toEqual({});
    expect(runtimeModule.getBundledChannelRuntimeMap().get("msteams")).toStrictEqual({});
  });

  it("falls back to static channel schemas when bundled plugin access hits a TDZ-style ReferenceError", async () => {
    mockBundledPluginMetadata();
>>>>>>> upstream/main
    vi.doMock("../channels/plugins/bundled.js", () => {
      return {
        listBundledChannelPlugins() {
          throw new ReferenceError("Cannot access 'bundledChannelPlugins' before initialization.");
        },
      };
    });

<<<<<<< HEAD
    const runtime = await importFreshModule<typeof import("./bundled-channel-config-runtime.js")>(
      import.meta.url,
      "./bundled-channel-config-runtime.js?scope=tdz-reference-error",
=======
    const runtime = await importFreshModule<
      typeof import("../../test/helpers/config/bundled-channel-config-runtime.js")
    >(
      import.meta.url,
      "../../test/helpers/config/bundled-channel-config-runtime.js?scope=tdz-reference-error",
>>>>>>> upstream/main
    );
    const configSchemaMap = runtime.getBundledChannelConfigSchemaMap();

    expect(configSchemaMap.has("msteams")).toBe(true);
    expect(configSchemaMap.has("whatsapp")).toBe(true);
  });
});
