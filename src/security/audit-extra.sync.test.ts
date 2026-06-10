// Covers synchronous extra security audit aggregation.
import { describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
  collectAttackSurfaceSummaryFindings,
  collectSmallModelRiskFindings,
<<<<<<< HEAD
} from "./audit-extra.sync.js";
=======
} from "./audit-extra.summary.js";
>>>>>>> upstream/main
import { safeEqualSecret } from "./secret-equal.js";

vi.mock("../plugins/web-search-credential-presence.js", () => ({
  hasConfiguredWebSearchCredential: () => false,
}));

function requireFirstFinding<T>(findings: readonly T[], label: string): T {
  const [finding] = findings;
  if (!finding) {
    throw new Error(`Expected ${label} finding`);
  }
  return finding;
}

describe("collectAttackSurfaceSummaryFindings", () => {
  it.each([
    {
      name: "distinguishes external webhooks from internal hooks when only internal hooks are enabled",
      cfg: {
        hooks: { internal: { enabled: true } },
      } satisfies OpenClawConfig,
      expectedDetail: ["hooks.webhooks: disabled", "hooks.internal: enabled"],
    },
    {
      name: "reports both hook systems as enabled when both are configured",
      cfg: {
        hooks: { enabled: true, internal: { enabled: true } },
      } satisfies OpenClawConfig,
      expectedDetail: ["hooks.webhooks: enabled", "hooks.internal: enabled"],
    },
    {
<<<<<<< HEAD
      name: "reports internal hooks as enabled by default and webhooks as disabled when neither is configured",
      cfg: {} satisfies OpenClawConfig,
      expectedDetail: ["hooks.webhooks: disabled", "hooks.internal: enabled"],
=======
      name: "reports internal hooks as disabled until configured",
      cfg: {} satisfies OpenClawConfig,
      expectedDetail: ["hooks.webhooks: disabled", "hooks.internal: disabled"],
>>>>>>> upstream/main
    },
    {
      name: "reports internal hooks as disabled when explicitly set to false",
      cfg: {
        hooks: { internal: { enabled: false } },
      } satisfies OpenClawConfig,
      expectedDetail: ["hooks.internal: disabled"],
    },
  ])("$name", ({ cfg, expectedDetail }) => {
<<<<<<< HEAD
    const [finding] = collectAttackSurfaceSummaryFindings(cfg);
=======
    const finding = requireFirstFinding(
      collectAttackSurfaceSummaryFindings(cfg),
      "attack surface summary",
    );
>>>>>>> upstream/main
    expect(finding.checkId).toBe("summary.attack_surface");
    for (const snippet of expectedDetail) {
      expect(finding.detail).toContain(snippet);
    }
  });
});

describe("safeEqualSecret", () => {
  it.each([
    ["secret-token", "secret-token", true],
    ["secret-token", "secret-tokEn", false],
    ["short", "much-longer", false],
<<<<<<< HEAD
=======
    ["", "", true],
    ["", "secret", false],
>>>>>>> upstream/main
    [undefined, "secret", false],
    ["secret", undefined, false],
    [null, "secret", false],
  ] as const)("compares %o and %o", (left, right, expected) => {
    expect(safeEqualSecret(left, right)).toBe(expected);
  });
});

describe("collectSmallModelRiskFindings", () => {
  const browserOffCfg = {
    agents: { defaults: { model: { primary: "ollama/mistral-8b" } } },
    browser: { enabled: false },
    tools: { web: { fetch: { enabled: false } } },
  } satisfies OpenClawConfig;
  const browserDefaultCfg = {
    agents: { defaults: { model: { primary: "ollama/mistral-8b" } } },
    tools: { web: { fetch: { enabled: false } } },
  } satisfies OpenClawConfig;

  it.each([
    {
<<<<<<< HEAD
      name: "small model without sandbox all stays critical even when browser/web tools are off",
      cfg: browserOffCfg,
      env: {},
=======
      name: "small model without web/browser tools is informational even without sandbox all",
      cfg: browserOffCfg,
      env: {},
      expectedSeverity: "info",
>>>>>>> upstream/main
      detailIncludes: ["web=[off]", "No web/browser tools detected"],
      detailExcludes: ["web=[browser]"],
    },
    {
      name: "treats browser as enabled by default when browser config is omitted",
      cfg: browserDefaultCfg,
      env: {},
<<<<<<< HEAD
      detailIncludes: ["web=[browser]"],
      detailExcludes: ["No web/browser tools detected"],
    },
  ])("$name", ({ cfg, env, detailIncludes, detailExcludes }) => {
    const [finding] = collectSmallModelRiskFindings({
      cfg,
      env,
    });

    expect(finding?.checkId).toBe("models.small_params");
    expect(finding?.severity).toBe("critical");
    expect(finding?.detail).toContain("ollama/mistral-8b");
    for (const snippet of detailIncludes) {
      expect(finding?.detail).toContain(snippet);
    }
    for (const snippet of detailExcludes) {
      expect(finding?.detail).not.toContain(snippet);
=======
      expectedSeverity: "critical",
      detailIncludes: ["web=[browser]"],
      detailExcludes: ["No web/browser tools detected"],
    },
  ])("$name", ({ cfg, env, expectedSeverity, detailIncludes, detailExcludes }) => {
    const finding = requireFirstFinding(
      collectSmallModelRiskFindings({
        cfg,
        env,
      }),
      "small model risk",
    );

    expect(finding.checkId).toBe("models.small_params");
    expect(finding.severity).toBe(expectedSeverity);
    expect(finding.detail).toContain("ollama/mistral-8b");
    for (const snippet of detailIncludes) {
      expect(finding.detail).toContain(snippet);
    }
    for (const snippet of detailExcludes) {
      expect(finding.detail).not.toContain(snippet);
>>>>>>> upstream/main
    }
  });
});
