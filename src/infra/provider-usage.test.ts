// Tests provider usage aggregation and formatting.
import { beforeEach, describe, expect, it } from "vitest";
import { createProviderUsageFetch } from "../test-utils/provider-usage-fetch.js";
import {
  getProviderUsageSnapshotWithPluginMock,
  resetProviderUsageSnapshotWithPluginMock,
} from "./provider-usage-plugin-runtime.test-mocks.js";
import {
  formatUsageReportLines,
  formatUsageSummaryLine,
  loadProviderUsageSummary,
  type UsageSummary,
} from "./provider-usage.js";
import { loadUsageWithAuth } from "./provider-usage.test-support.js";
import type { ProviderUsageSnapshot } from "./provider-usage.types.js";

const resolveProviderUsageSnapshotWithPluginMock = getProviderUsageSnapshotWithPluginMock();

describe("provider usage formatting", () => {
  beforeEach(() => {
    resetProviderUsageSnapshotWithPluginMock();
  });

  it("returns null when no usage is available", () => {
    const summary: UsageSummary = { updatedAt: 0, providers: [] };
    expect(formatUsageSummaryLine(summary)).toBeNull();
  });

  it("picks the most-used window for summary line", () => {
    const summary: UsageSummary = {
      updatedAt: 0,
      providers: [
        {
          provider: "anthropic",
          displayName: "Claude",
          windows: [
            { label: "5h", usedPercent: 10 },
            { label: "Week", usedPercent: 60 },
          ],
        },
      ],
    };
    const line = formatUsageSummaryLine(summary, { now: 0 });
    expect(line).toContain("Claude");
    expect(line).toContain("40% left");
    expect(line).toContain("(Week");
  });

  it("prints provider errors in report output", () => {
    const summary: UsageSummary = {
      updatedAt: 0,
      providers: [
        {
          provider: "openai",
          displayName: "Codex",
          windows: [],
          error: "Token expired",
        },
      ],
    };
    const lines = formatUsageReportLines(summary);
    expect(lines.join("\n")).toContain("Codex: Token expired");
  });

  it("prints balance-only provider summary output", () => {
    const summary: UsageSummary = {
      updatedAt: 0,
      providers: [
        {
          provider: "deepseek",
          displayName: "DeepSeek",
          windows: [],
          summary: "Balance ¥42.50",
        },
      ],
    };

    expect(formatUsageSummaryLine(summary)).toBe("📊 Usage: DeepSeek Balance ¥42.50");
    expect(formatUsageReportLines(summary).join("\n")).toContain("DeepSeek: Balance ¥42.50");
  });

  it("includes reset countdowns in report lines", () => {
    const now = Date.UTC(2026, 0, 7, 0, 0, 0);
    const summary: UsageSummary = {
      updatedAt: now,
      providers: [
        {
          provider: "anthropic",
          displayName: "Claude",
          windows: [{ label: "5h", usedPercent: 20, resetAt: now + 60_000 }],
        },
      ],
    };
    const lines = formatUsageReportLines(summary, { now });
    expect(lines.join("\n")).toContain("resets 1m");
  });
});

describe("provider usage loading", () => {
  it("loads usage snapshots with injected auth", async () => {
    resolveProviderUsageSnapshotWithPluginMock.mockImplementation(
      async ({ provider }): Promise<ProviderUsageSnapshot | null> => {
        switch (provider) {
          case "anthropic":
            return {
              provider,
              displayName: "Claude",
              windows: [{ label: "5h", usedPercent: 20 }],
            };
          case "minimax":
            return {
              provider,
              displayName: "MiniMax",
              windows: [{ label: "5h", usedPercent: 75 }],
              plan: "Coding Plan",
            };
          case "deepseek":
            return {
              provider,
              displayName: "DeepSeek",
              windows: [],
              summary: "Balance ¥42.50",
            };
          case "zai":
            return {
              provider,
              displayName: "Z.ai",
              windows: [{ label: "3h", usedPercent: 25 }],
              plan: "Pro",
            };
          default:
            return null;
        }
      },
    );
    const mockFetch = createProviderUsageFetch(async () => {
      throw new Error("legacy fetch should not run");
    });

    const summary = await loadUsageWithAuth(
      loadProviderUsageSummary,
      [
        { provider: "anthropic", token: "token-1" },
        { provider: "deepseek", token: "token-1a" },
        { provider: "minimax", token: "token-1b" },
        { provider: "zai", token: "token-2" },
      ],
      mockFetch,
    );

    expect(summary.providers).toHaveLength(4);
    const claude = summary.providers.find((p) => p.provider === "anthropic");
    const deepseek = summary.providers.find((p) => p.provider === "deepseek");
    const minimax = summary.providers.find((p) => p.provider === "minimax");
    const zai = summary.providers.find((p) => p.provider === "zai");
    expect(claude?.windows[0]?.label).toBe("5h");
    expect(deepseek?.summary).toBe("Balance ¥42.50");
    expect(minimax?.windows[0]?.usedPercent).toBe(75);
    expect(zai?.plan).toBe("Pro");
<<<<<<< HEAD
    expect(mockFetch).toHaveBeenCalled();
  });

  it.each([
    {
      name: "handles nested MiniMax usage payloads",
      payload: {
        base_resp: { status_code: 0, status_msg: "ok" },
        data: {
          plan_name: "Coding Plan",
          usage: {
            prompt_limit: 200,
            prompt_remain: 50,
            next_reset_time: "2026-01-07T05:00:00Z",
          },
        },
      },
      expected: { usedPercent: 75, plan: "Coding Plan" },
    },
    {
      name: "prefers MiniMax count-based usage when percent looks inverted",
      payload: {
        base_resp: { status_code: 0, status_msg: "ok" },
        data: {
          prompt_limit: 200,
          prompt_remain: 150,
          usage_percent: 75,
          next_reset_time: "2026-01-07T05:00:00Z",
        },
      },
      expected: { usedPercent: 25 },
    },
    {
      name: "handles MiniMax model_remains usage payloads",
      payload: {
        base_resp: { status_code: 0, status_msg: "ok" },
        model_remains: [
          {
            start_time: 1736217600,
            end_time: 1736235600,
            remains_time: 600,
            current_interval_total_count: 120,
            // API field is remaining quota, not consumed (MiniMax-M2#99).
            current_interval_usage_count: 30,
            model_name: "MiniMax-M2.5",
          },
        ],
      },
      expected: { usedPercent: 75 },
    },
    {
      name: "keeps payload-level MiniMax plan metadata when the usage candidate is nested",
      payload: {
        base_resp: { status_code: 0, status_msg: "ok" },
        data: {
          plan_name: "Payload Plan",
          nested: {
            usage_ratio: "0.4",
            window_hours: 2,
            next_reset_time: "2026-01-07T05:00:00Z",
          },
        },
      },
      expected: { usedPercent: 40, plan: "Payload Plan", label: "2h" },
    },
  ])("$name", async ({ payload, expected }) => {
    await expectMinimaxUsage(payload, expected);
  });

  it("discovers Claude usage from token auth profiles", async () => {
    await withTempHome(
      async (tempHome) => {
        const agentDir = path.join(
          process.env.OPENCLAW_STATE_DIR ?? path.join(tempHome, ".openclaw"),
          "agents",
          "main",
          "agent",
        );
        fs.mkdirSync(agentDir, { recursive: true, mode: 0o700 });
        fs.writeFileSync(
          path.join(agentDir, "auth-profiles.json"),
          `${JSON.stringify(
            {
              version: 1,
              order: { anthropic: ["anthropic:default"] },
              profiles: {
                "anthropic:default": {
                  type: "token",
                  provider: "anthropic",
                  token: "token-1",
                  expires: Date.UTC(2100, 0, 1, 0, 0, 0),
                },
              },
            },
            null,
            2,
          )}\n`,
          "utf8",
        );
        const store = ensureAuthProfileStore(agentDir, {
          allowKeychainPrompt: false,
        });
        expect(listProfilesForProvider(store, "anthropic")).toContain("anthropic:default");

        const mockFetch = createProviderUsageFetch(async (url, init) => {
          if (url.includes("api.anthropic.com/api/oauth/usage")) {
            const headers = (init?.headers ?? {}) as Record<string, string>;
            expect(headers.Authorization).toBe("Bearer token-1");
            return makeResponse(200, {
              five_hour: {
                utilization: 20,
                resets_at: "2026-01-07T01:00:00Z",
              },
            });
          }
          return makeResponse(404, "not found");
        });

        const summary = await loadProviderUsageSummary({
          now: usageNow,
          providers: ["anthropic"],
          agentDir,
          fetch: mockFetch as unknown as typeof fetch,
          config: { plugins: { enabled: false } },
        });

        const claude = expectSingleAnthropicProvider(summary);
        expect(claude?.windows[0]?.label).toBe("5h");
        expect(mockFetch).toHaveBeenCalled();
      },
      {
        env: {
          OPENCLAW_STATE_DIR: (home) => path.join(home, ".openclaw"),
        },
        prefix: "openclaw-provider-usage-",
      },
    );
  });

  it("falls back to claude.ai web usage when OAuth scope is missing", async () => {
    await withEnvAsync({ CLAUDE_AI_SESSION_KEY: "sk-ant-web-1" }, async () => {
      const mockFetch = createProviderUsageFetch(async (url) => {
        if (url.includes("api.anthropic.com/api/oauth/usage")) {
          return makeResponse(403, {
            type: "error",
            error: {
              type: "permission_error",
              message: "OAuth token does not meet scope requirement user:profile",
            },
          });
        }
        if (url.includes("claude.ai/api/organizations/org-1/usage")) {
          return makeResponse(200, {
            five_hour: { utilization: 20, resets_at: "2026-01-07T01:00:00Z" },
            seven_day: { utilization: 40, resets_at: "2026-01-08T01:00:00Z" },
            seven_day_opus: { utilization: 5 },
          });
        }
        if (url.includes("claude.ai/api/organizations")) {
          return makeResponse(200, [{ uuid: "org-1", name: "Test" }]);
        }
        return makeResponse(404, "not found");
      });

      const summary = await loadUsageWithAuth(
        loadProviderUsageSummary,
        [{ provider: "anthropic", token: "sk-ant-oauth-1" }],
        mockFetch,
      );

      const claude = expectSingleAnthropicProvider(summary);
      expect(claude?.windows.some((w) => w.label === "5h")).toBe(true);
      expect(claude?.windows.some((w) => w.label === "Week")).toBe(true);
    });
=======
    expect(mockFetch).not.toHaveBeenCalled();
>>>>>>> upstream/main
  });
});
