<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { expect, type MockInstance } from "vitest";
=======
// Whatsapp plugin module implements outbound test support behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main

export function createWhatsAppPollFixture() {
  const cfg = { marker: "resolved-cfg" } as OpenClawConfig;
  const poll = {
    question: "Lunch?",
    options: ["Pizza", "Sushi"],
    maxSelections: 1,
  };
  return {
    cfg,
    poll,
    to: "+1555",
    accountId: "work",
  };
}
<<<<<<< HEAD

export function expectWhatsAppPollSent(
  sendPollWhatsApp: MockInstance,
  params: {
    cfg: OpenClawConfig;
    poll: { question: string; options: string[]; maxSelections: number };
    to?: string;
    accountId?: string;
  },
) {
  expect(sendPollWhatsApp).toHaveBeenCalledWith(params.to ?? "+1555", params.poll, {
    verbose: false,
    accountId: params.accountId ?? "work",
    cfg: params.cfg,
  });
}
=======
>>>>>>> upstream/main
