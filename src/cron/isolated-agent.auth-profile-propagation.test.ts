// Auth profile propagation tests cover isolated agent auth profile forwarding.
import { describe, expect, it } from "vitest";
import {
  makeIsolatedAgentTurnJob,
  makeIsolatedAgentTurnParams,
  setupRunCronIsolatedAgentTurnSuite,
} from "./isolated-agent/run.suite-helpers.js";
import {
  loadRunCronIsolatedAgentTurn,
  mockRunCronFallbackPassthrough,
  resolveConfiguredModelRefMock,
  resolveSessionAuthProfileOverrideMock,
  runEmbeddedAgentMock,
} from "./isolated-agent/run.test-harness.js";

const runCronIsolatedAgentTurn = await loadRunCronIsolatedAgentTurn();

function getEmbeddedAgentParams(): { authProfileId?: string; authProfileIdSource?: string } {
  const params = runEmbeddedAgentMock.mock.calls[0]?.[0];
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    throw new Error("Expected embedded OpenClaw agent params to be an object");
  }
  return params;
}

describe("runCronIsolatedAgentTurn auth profile propagation (#20624)", () => {
  setupRunCronIsolatedAgentTurnSuite();

  it("passes authProfileId to runEmbeddedAgent when auth profiles exist", async () => {
    resolveConfiguredModelRefMock.mockReturnValue({
      provider: "openrouter",
      model: "moonshotai/kimi-k2.5",
    });
    resolveSessionAuthProfileOverrideMock.mockResolvedValue("openrouter:default");
    mockRunCronFallbackPassthrough();

    const result = await runCronIsolatedAgentTurn(
      makeIsolatedAgentTurnParams({
        cfg: {
          auth: {
            profiles: {
              "openrouter:default": {
                provider: "openrouter",
                mode: "api_key",
              },
            },
            order: { openrouter: ["openrouter:default"] },
          },
        },
        job: makeIsolatedAgentTurnJob({
          delivery: { mode: "none" },
          payload: {
            kind: "agentTurn",
            message: "check status",
          },
        }),
<<<<<<< HEAD
        "utf-8",
      );

      // 3. Mock runEmbeddedPiAgent to return ok
      vi.mocked(runEmbeddedPiAgent).mockResolvedValue({
        payloads: [{ text: "done" }],
        meta: {
          durationMs: 5,
          agentMeta: { sessionId: "s", provider: "openrouter", model: "kimi-k2.5" },
        },
      });

      // 4. Run cron isolated agent turn with openrouter model
      const cfg = makeCfg(home, storePath, {
        agents: {
          defaults: {
            model: { primary: "openrouter/moonshotai/kimi-k2.5" },
            workspace: path.join(home, "openclaw"),
          },
        },
      });

      const res = await runCronIsolatedAgentTurn({
        cfg,
        deps: createCliDeps(),
        job: {
          ...makeJob({ kind: "agentTurn", message: "check status" }),
          delivery: { mode: "none" },
        },
=======
>>>>>>> upstream/main
        message: "check status",
        sessionKey: "cron:job-1",
        lane: "cron",
      }),
    );

    expect(result.status).toBe("ok");
    expect(runEmbeddedAgentMock).toHaveBeenCalledOnce();
    expect(getEmbeddedAgentParams()).toMatchObject({
      authProfileId: "openrouter:default",
    });
  });
});
