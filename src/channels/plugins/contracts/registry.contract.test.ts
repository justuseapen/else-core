<<<<<<< HEAD
=======
// Registry contract tests cover shared channel plugin registry contract behavior.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import { sessionBindingContractChannelIds } from "./test-helpers/manifest.js";

const discordSessionBindingAdapterChannels = ["discord"] as const;

describe("channel contract registry", () => {
  function expectSessionBindingCoverage(expectedChannelIds: readonly string[]) {
<<<<<<< HEAD
    expect([...sessionBindingContractChannelIds]).toEqual(
      expect.arrayContaining([...expectedChannelIds]),
    );
=======
    const registeredIds = new Set<string>(sessionBindingContractChannelIds);
    for (const expectedChannelId of expectedChannelIds) {
      expect(registeredIds.has(expectedChannelId)).toBe(true);
    }
>>>>>>> upstream/main
  }

  it.each([
    {
      name: "keeps core session binding coverage aligned with built-in adapters",
      expectedChannelIds: [...discordSessionBindingAdapterChannels, "telegram"],
    },
  ] as const)("$name", ({ expectedChannelIds }) => {
    expectSessionBindingCoverage(expectedChannelIds);
  });
});
