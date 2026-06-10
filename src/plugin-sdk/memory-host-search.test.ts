<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
=======
/**
 * Tests memory host search manager lifecycle helpers.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
  closeActiveMemorySearchManager,
>>>>>>> upstream/main
  closeActiveMemorySearchManagers,
  getActiveMemorySearchManager,
} from "./memory-host-search.js";

<<<<<<< HEAD
const { closeActiveMemorySearchManagersMock, getActiveMemorySearchManagerMock } = vi.hoisted(
  () => ({
    closeActiveMemorySearchManagersMock: vi.fn(),
    getActiveMemorySearchManagerMock: vi.fn(),
  }),
);

vi.mock("./memory-host-search.runtime.js", () => ({
=======
const {
  closeActiveMemorySearchManagerMock,
  closeActiveMemorySearchManagersMock,
  getActiveMemorySearchManagerMock,
} = vi.hoisted(() => ({
  closeActiveMemorySearchManagerMock: vi.fn(),
  closeActiveMemorySearchManagersMock: vi.fn(),
  getActiveMemorySearchManagerMock: vi.fn(),
}));

vi.mock("./memory-host-search.runtime.js", () => ({
  closeActiveMemorySearchManager: closeActiveMemorySearchManagerMock,
>>>>>>> upstream/main
  closeActiveMemorySearchManagers: closeActiveMemorySearchManagersMock,
  getActiveMemorySearchManager: getActiveMemorySearchManagerMock,
}));

describe("memory-host-search facade", () => {
  beforeEach(() => {
<<<<<<< HEAD
=======
    closeActiveMemorySearchManagerMock.mockReset();
>>>>>>> upstream/main
    closeActiveMemorySearchManagersMock.mockReset();
    getActiveMemorySearchManagerMock.mockReset();
  });

  it("delegates active manager lookup to the lazy runtime module", async () => {
    const cfg = { agents: { list: [{ id: "main", default: true }] } } as OpenClawConfig;
    const expected = { manager: null, error: "unavailable" };
    getActiveMemorySearchManagerMock.mockResolvedValue(expected);

    await expect(getActiveMemorySearchManager({ cfg, agentId: "main" })).resolves.toEqual(expected);
    expect(getActiveMemorySearchManagerMock).toHaveBeenCalledWith({ cfg, agentId: "main" });
  });

  it("delegates runtime cleanup to the lazy runtime module", async () => {
    const cfg = { agents: { list: [{ id: "main", default: true }] } } as OpenClawConfig;

    await closeActiveMemorySearchManagers(cfg);

    expect(closeActiveMemorySearchManagersMock).toHaveBeenCalledWith(cfg);
  });
<<<<<<< HEAD
=======

  it("delegates scoped runtime cleanup to the lazy runtime module", async () => {
    const cfg = { agents: { list: [{ id: "main", default: true }] } } as OpenClawConfig;

    await closeActiveMemorySearchManager({ cfg, agentId: "main" });

    expect(closeActiveMemorySearchManagerMock).toHaveBeenCalledWith({ cfg, agentId: "main" });
  });
>>>>>>> upstream/main
});
