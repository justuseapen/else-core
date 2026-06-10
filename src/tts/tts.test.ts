<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadBundledPluginPublicSurfaceModuleSync = vi.hoisted(() => vi.fn());
const loadActivatedBundledPluginPublicSurfaceModuleSync = vi.hoisted(() => vi.fn());

vi.mock("../plugin-sdk/facade-runtime.js", async () => {
  const actual = await vi.importActual<typeof import("../plugin-sdk/facade-runtime.js")>(
    "../plugin-sdk/facade-runtime.js",
  );
  return {
    ...actual,
    loadActivatedBundledPluginPublicSurfaceModuleSync,
    loadBundledPluginPublicSurfaceModuleSync,
  };
});

describe("tts runtime facade", () => {
  let ttsModulePromise: Promise<typeof import("./tts.js")> | undefined;

  beforeEach(() => {
    loadActivatedBundledPluginPublicSurfaceModuleSync.mockReset();
    loadBundledPluginPublicSurfaceModuleSync.mockReset();
  });

  function importTtsModule() {
    ttsModulePromise ??= import("./tts.js");
    return ttsModulePromise;
  }

  it("does not load speech-core on module import", async () => {
    await importTtsModule();

    expect(loadBundledPluginPublicSurfaceModuleSync).not.toHaveBeenCalled();
  });

  it("loads speech-core lazily on first runtime access", async () => {
    const buildTtsSystemPromptHint = vi.fn().mockReturnValue("hint");
    loadActivatedBundledPluginPublicSurfaceModuleSync.mockReturnValue({
      buildTtsSystemPromptHint,
    });

    const tts = await importTtsModule();

    expect(loadActivatedBundledPluginPublicSurfaceModuleSync).not.toHaveBeenCalled();
    expect(tts.buildTtsSystemPromptHint({} as never)).toBe("hint");
    expect(loadActivatedBundledPluginPublicSurfaceModuleSync).toHaveBeenCalledTimes(1);
    expect(buildTtsSystemPromptHint).toHaveBeenCalledTimes(1);
=======
// TTS integration tests cover text-to-speech command behavior.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

describe("tts runtime facade", () => {
  it("routes public TTS helpers through the core speech package", () => {
    const publicFacadeSource = readSource("./tts.ts");
    const runtimeFacadeSource = readSource("../plugin-sdk/tts-runtime.ts");

    expect(publicFacadeSource).toContain('} from "../plugin-sdk/tts-runtime.js";');
    expect(publicFacadeSource).not.toContain("speech-core");
    expect(runtimeFacadeSource).toContain('from "../../packages/speech-core/runtime-api.js";');
    expect(runtimeFacadeSource).not.toContain('dirName: "speech-core"');
>>>>>>> upstream/main
  });
});
