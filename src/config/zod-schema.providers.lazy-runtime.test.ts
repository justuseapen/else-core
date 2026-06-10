<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import { importFreshModule } from "../../test/helpers/import-fresh.ts";
import type { BundledPluginMetadata } from "../plugins/bundled-plugin-metadata.js";

const listBundledPluginMetadataMock = vi.hoisted(() =>
  vi.fn<(options?: unknown) => readonly BundledPluginMetadata[]>(() => []),
);

describe("ChannelsSchema bundled runtime loading", () => {
  beforeEach(() => {
    listBundledPluginMetadataMock.mockClear();
    vi.doMock("../plugins/bundled-plugin-metadata.js", () => ({
      listBundledPluginMetadata: (options?: unknown) => listBundledPluginMetadataMock(options),
=======
// Verifies provider schema lazy-runtime loading stays side-effect bounded.
import { importFreshModule } from "openclaw/plugin-sdk/test-fixtures";
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadPluginMetadataSnapshotMock = vi.hoisted(() => vi.fn());
const collectBundledChannelConfigsMock = vi.hoisted(() => vi.fn());

describe("ChannelsSchema bundled runtime loading", () => {
  beforeEach(() => {
    loadPluginMetadataSnapshotMock.mockClear();
    collectBundledChannelConfigsMock.mockClear();
    vi.doMock("../plugins/plugin-metadata-snapshot.js", () => ({
      loadPluginMetadataSnapshot: loadPluginMetadataSnapshotMock,
    }));
    vi.doMock("../plugins/bundled-channel-config-metadata.js", () => ({
      collectBundledChannelConfigs: collectBundledChannelConfigsMock,
>>>>>>> upstream/main
    }));
  });

  it("skips bundled channel runtime discovery when only core channel keys are present", async () => {
<<<<<<< HEAD
    const runtime = await importFreshModule<typeof import("./zod-schema.providers.js")>(
      import.meta.url,
      "./zod-schema.providers.js?scope=channels-core-only",
=======
    const runtime = await importFreshModule<typeof import("./zod-schema.channels-config.js")>(
      import.meta.url,
      "./zod-schema.channels-config.js?scope=channels-core-only",
>>>>>>> upstream/main
    );

    const parsed = runtime.ChannelsSchema.parse({
      defaults: {
        groupPolicy: "open",
<<<<<<< HEAD
=======
        botLoopProtection: {
          maxEventsPerWindow: 4,
          windowSeconds: 90,
          cooldownSeconds: 30,
        },
>>>>>>> upstream/main
      },
      modelByChannel: {
        telegram: {
          primary: "gpt-5.4",
        },
      },
    });

    expect(parsed?.defaults?.groupPolicy).toBe("open");
<<<<<<< HEAD
    expect(listBundledPluginMetadataMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        includeChannelConfigs: true,
      }),
    );
  });

  it("loads bundled channel runtime discovery only when plugin-owned channel config is present", async () => {
    listBundledPluginMetadataMock.mockReturnValueOnce([
      {
        manifest: {
          channelConfigs: {
            discord: {
              runtime: {
                safeParse: (value: unknown) => ({ success: true, data: value }),
              },
            },
          },
        },
      } as unknown as BundledPluginMetadata,
    ]);

    const runtime = await importFreshModule<typeof import("./zod-schema.providers.js")>(
      import.meta.url,
      "./zod-schema.providers.js?scope=channels-plugin-owned",
=======
    expect(parsed?.defaults?.botLoopProtection?.maxEventsPerWindow).toBe(4);
    expect(loadPluginMetadataSnapshotMock).not.toHaveBeenCalled();
    expect(collectBundledChannelConfigsMock).not.toHaveBeenCalled();
  });

  it("does not discover bundled channel runtime metadata during raw schema parsing", async () => {
    const runtime = await importFreshModule<typeof import("./zod-schema.channels-config.js")>(
      import.meta.url,
      "./zod-schema.channels-config.js?scope=channels-plugin-owned",
>>>>>>> upstream/main
    );

    runtime.ChannelsSchema.parse({
      discord: {},
    });

<<<<<<< HEAD
    expect(listBundledPluginMetadataMock.mock.calls).toContainEqual([
      expect.objectContaining({
        includeChannelConfigs: true,
        includeSyntheticChannelConfigs: true,
      }),
    ]);
=======
    expect(loadPluginMetadataSnapshotMock).not.toHaveBeenCalled();
    expect(collectBundledChannelConfigsMock).not.toHaveBeenCalled();
>>>>>>> upstream/main
  });
});
