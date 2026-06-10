<<<<<<< HEAD
=======
// Voice Call tests cover tts provider voice plugin behavior.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import { resolvePreferredTtsVoice } from "./tts-provider-voice.js";

describe("resolvePreferredTtsVoice", () => {
<<<<<<< HEAD
  it("returns provider voice when present", () => {
=======
  it("returns provider speakerVoice when present", () => {
>>>>>>> upstream/main
    expect(
      resolvePreferredTtsVoice({
        tts: {
          provider: "openai",
          providers: {
            openai: {
<<<<<<< HEAD
              voice: "coral",
=======
              speakerVoice: "coral",
>>>>>>> upstream/main
            },
          },
        },
      }),
    ).toBe("coral");
  });

<<<<<<< HEAD
  it("falls back to voiceId for providers that use that field", () => {
=======
  it("returns provider speakerVoiceId when present", () => {
>>>>>>> upstream/main
    expect(
      resolvePreferredTtsVoice({
        tts: {
          provider: "elevenlabs",
          providers: {
            elevenlabs: {
<<<<<<< HEAD
              voiceId: "voice-123",
=======
              speakerVoiceId: "voice-123",
>>>>>>> upstream/main
            },
          },
        },
      }),
    ).toBe("voice-123");
  });
<<<<<<< HEAD
=======

  it("keeps legacy voice and voiceId fallback compatibility", () => {
    expect(
      resolvePreferredTtsVoice({
        tts: {
          provider: "openai",
          providers: {
            openai: {
              voice: "legacy-voice",
              voiceId: "legacy-id",
            },
          },
        },
      }),
    ).toBe("legacy-voice");
  });
>>>>>>> upstream/main
});
