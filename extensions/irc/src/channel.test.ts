<<<<<<< HEAD
import { afterEach, describe, expect, it } from "vitest";
import { ircPlugin } from "./channel.js";
=======
// Irc tests cover channel plugin behavior.
import { afterEach, describe, expect, it } from "vitest";
import { ircOutboundBaseAdapter } from "./outbound-base.js";
>>>>>>> upstream/main
import { clearIrcRuntime } from "./runtime.js";

describe("irc outbound chunking", () => {
  afterEach(() => {
    clearIrcRuntime();
  });

  it("chunks outbound text without requiring IRC runtime initialization", () => {
<<<<<<< HEAD
    const chunker = ircPlugin.outbound?.chunker;
    if (!chunker) {
      throw new Error("irc outbound.chunker unavailable");
    }

    expect(chunker("alpha beta", 5)).toEqual(["alpha", "beta"]);
=======
    expect(ircOutboundBaseAdapter.chunker("alpha beta", 5)).toEqual(["alpha", "beta"]);
    expect(ircOutboundBaseAdapter.deliveryMode).toBe("direct");
    expect(ircOutboundBaseAdapter.chunkerMode).toBe("markdown");
    expect(ircOutboundBaseAdapter.textChunkLimit).toBe(350);
>>>>>>> upstream/main
  });
});
