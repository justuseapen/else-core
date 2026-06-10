<<<<<<< HEAD
import { afterEach, describe, expect, it, vi } from "vitest";
import { __testing, clearSessionQueues } from "./cleanup.js";
=======
// Tests queue cleanup behavior for expired state and dedupe records.
import { afterEach, describe, expect, it, vi } from "vitest";
import { testing, clearSessionQueues } from "./cleanup.js";
>>>>>>> upstream/main

const followupQueueMocks = vi.hoisted(() => ({
  clearFollowupDrainCallback: vi.fn(),
  clearFollowupQueue: vi.fn(() => 2),
}));

const commandQueueMocks = vi.hoisted(() => ({
  clearCommandLane: vi.fn(() => 3),
}));

vi.mock("./drain.js", () => ({
  clearFollowupDrainCallback: followupQueueMocks.clearFollowupDrainCallback,
}));

vi.mock("./state.js", () => ({
  clearFollowupQueue: followupQueueMocks.clearFollowupQueue,
}));

vi.mock("../../../process/command-queue.js", () => ({
  clearCommandLane: commandQueueMocks.clearCommandLane,
}));

<<<<<<< HEAD
vi.mock("../../../agents/pi-embedded-runner/lanes.js", () => ({
=======
vi.mock("../../../agents/embedded-agent-runner/lanes.js", () => ({
>>>>>>> upstream/main
  resolveEmbeddedSessionLane: (key: string) => `session:${key.trim() || "main"}`,
}));

describe("clearSessionQueues", () => {
  afterEach(() => {
<<<<<<< HEAD
    __testing.resetDepsForTests();
=======
    testing.resetDepsForTests();
>>>>>>> upstream/main
    followupQueueMocks.clearFollowupDrainCallback.mockReset();
    followupQueueMocks.clearFollowupQueue.mockReset().mockReturnValue(2);
    commandQueueMocks.clearCommandLane.mockReset().mockReturnValue(3);
  });

  it("falls back to default runtime deps when injected deps are invalid", () => {
<<<<<<< HEAD
    __testing.setDepsForTests({
=======
    testing.setDepsForTests({
>>>>>>> upstream/main
      resolveEmbeddedSessionLane: undefined,
      clearCommandLane: undefined,
    });

    const result = clearSessionQueues(["alpha"]);

    expect(result).toEqual({
      followupCleared: 2,
      laneCleared: 3,
      keys: ["alpha"],
    });
    expect(followupQueueMocks.clearFollowupQueue).toHaveBeenCalledWith("alpha");
    expect(followupQueueMocks.clearFollowupDrainCallback).toHaveBeenCalledWith("alpha");
    expect(commandQueueMocks.clearCommandLane).toHaveBeenCalledWith("session:alpha");
  });

  it("falls back at call time when a test mutates deps to non-functions", () => {
<<<<<<< HEAD
    __testing.setDepsForTests({
=======
    testing.setDepsForTests({
>>>>>>> upstream/main
      resolveEmbeddedSessionLane: ((key: string) => `custom:${key}`) as never,
      clearCommandLane: ((lane: string) => (lane === "custom:alpha" ? 7 : 0)) as never,
    });
    (
<<<<<<< HEAD
      __testing as {
=======
      testing as {
>>>>>>> upstream/main
        setDepsForTests: (deps: Partial<Record<string, unknown>> | undefined) => void;
      }
    ).setDepsForTests({
      resolveEmbeddedSessionLane: "broken",
      clearCommandLane: "broken",
    });

    const result = clearSessionQueues(["alpha"]);

    expect(result).toEqual({
      followupCleared: 2,
      laneCleared: 3,
      keys: ["alpha"],
    });
    expect(commandQueueMocks.clearCommandLane).toHaveBeenCalledWith("session:alpha");
  });
});
