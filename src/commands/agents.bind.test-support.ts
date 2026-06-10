<<<<<<< HEAD
import type { Mock } from "vitest";
import { vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { mergeMockedModule } from "../test-utils/vitest-module-mocks.js";
=======
// Agent binding test support centralizes mocked channel plugin registries and lazy imports.
import type { Mock } from "vitest";
import { vi } from "vitest";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { createLazyImportLoader } from "../shared/lazy-promise.js";
>>>>>>> upstream/main
import { createTestRuntime } from "./test-runtime-config-helpers.js";

type ReplaceConfigFileResult = Awaited<
  ReturnType<(typeof import("../config/config.js"))["replaceConfigFile"]>
>;

export const readConfigFileSnapshotMock: Mock<(...args: unknown[]) => Promise<unknown>> = vi.fn();
export const writeConfigFileMock: Mock<(...args: unknown[]) => Promise<unknown>> = vi
  .fn()
  .mockResolvedValue(undefined);
<<<<<<< HEAD
export const replaceConfigFileMock: Mock<(...args: unknown[]) => Promise<unknown>> = vi.fn(
=======
const replaceConfigFileMock: Mock<(...args: unknown[]) => Promise<unknown>> = vi.fn(
>>>>>>> upstream/main
  async (params: { nextConfig: OpenClawConfig }): Promise<ReplaceConfigFileResult> => {
    await writeConfigFileMock(params.nextConfig);
    return {
      path: "/tmp/openclaw.json",
      previousHash: null,
      snapshot: {} as never,
      nextConfig: params.nextConfig,
<<<<<<< HEAD
=======
      persistedHash: "test-config-hash",
      afterWrite: { mode: "auto" },
      followUp: { mode: "auto", requiresRestart: false },
>>>>>>> upstream/main
    };
  },
) as Mock<(...args: unknown[]) => Promise<unknown>>;

<<<<<<< HEAD
vi.mock("../config/config.js", async () => {
  const actual = await vi.importActual<typeof import("../config/config.js")>("../config/config.js");
  return await mergeMockedModule(actual, () => ({
    readConfigFileSnapshot: (...args: Parameters<typeof actual.readConfigFileSnapshot>) =>
      readConfigFileSnapshotMock(...args) as ReturnType<typeof actual.readConfigFileSnapshot>,
    writeConfigFile: (...args: Parameters<typeof actual.writeConfigFile>) =>
      writeConfigFileMock(...args) as ReturnType<typeof actual.writeConfigFile>,
    replaceConfigFile: (...args: Parameters<typeof actual.replaceConfigFile>) =>
      replaceConfigFileMock(...args) as ReturnType<typeof actual.replaceConfigFile>,
  }));
});

export const runtime = createTestRuntime();

let agentsCommandModulePromise: Promise<typeof import("./agents.js")> | undefined;

export async function loadFreshAgentsCommandModuleForTest() {
  agentsCommandModulePromise ??= import("./agents.js");
  return await agentsCommandModulePromise;
=======
vi.mock("../config/config.js", () => ({
  readConfigFileSnapshot: (...args: unknown[]) => readConfigFileSnapshotMock(...args),
  writeConfigFile: (...args: unknown[]) => writeConfigFileMock(...args),
  replaceConfigFile: (...args: unknown[]) => replaceConfigFileMock(...args),
}));

vi.mock("./agents.command-shared.js", () => ({
  createQuietRuntime: <T>(runtime: T) => runtime,
  requireValidConfig: async () => {
    const snapshot = (await readConfigFileSnapshotMock()) as
      | { config?: OpenClawConfig; sourceConfig?: OpenClawConfig }
      | undefined;
    return snapshot?.sourceConfig ?? snapshot?.config ?? null;
  },
  requireValidConfigFileSnapshot: async () => readConfigFileSnapshotMock(),
}));

export const runtime = createTestRuntime();

const agentsBindCommandModuleLoader = createLazyImportLoader(
  () => import("./agents.commands.bind.js"),
);

export async function loadFreshAgentsBindCommandModuleForTest() {
  return await agentsBindCommandModuleLoader.load();
>>>>>>> upstream/main
}

export function resetAgentsBindTestHarness(): void {
  readConfigFileSnapshotMock.mockClear();
  writeConfigFileMock.mockClear();
  replaceConfigFileMock.mockClear();
  runtime.log.mockClear();
  runtime.error.mockClear();
  runtime.exit.mockClear();
}
