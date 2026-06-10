<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { zalouserDoctor } from "./doctor.js";

describe("zalouser doctor", () => {
  it("normalizes legacy group allow aliases to enabled", () => {
    const normalize = zalouserDoctor.normalizeCompatibilityConfig;
    expect(normalize).toBeDefined();
    if (!normalize) {
      return;
    }
=======
// Zalouser tests cover doctor plugin behavior.
import { describe, expect, it } from "vitest";
import { zalouserDoctor } from "./doctor.js";

function getZaloUserCompatibilityNormalizer(): NonNullable<
  typeof zalouserDoctor.normalizeCompatibilityConfig
> {
  const normalize = zalouserDoctor.normalizeCompatibilityConfig;
  if (!normalize) {
    throw new Error("Expected zalouser doctor to expose normalizeCompatibilityConfig");
  }
  return normalize;
}

describe("zalouser doctor", () => {
  it("warns when mutable group names rely on disabled name matching", async () => {
    const warnings = await Promise.resolve(
      zalouserDoctor.collectMutableAllowlistWarnings?.({
        cfg: {
          channels: {
            zalouser: {
              groups: {
                "group:trusted": {
                  enabled: true,
                },
              },
            },
          },
        } as never,
      }) ?? [],
    );

    expect(
      warnings.some((warning: string) =>
        warning.includes("mutable allowlist entry across zalouser"),
      ),
    ).toBe(true);
    expect(
      warnings.some((warning: string) =>
        warning.includes("channels.zalouser.groups: group:trusted"),
      ),
    ).toBe(true);
  });

  it("normalizes legacy group allow aliases to enabled", () => {
    const normalize = getZaloUserCompatibilityNormalizer();
>>>>>>> upstream/main

    const result = normalize({
      cfg: {
        channels: {
          zalouser: {
            groups: {
              "group:trusted": {
                allow: true,
              },
            },
            accounts: {
              work: {
                groups: {
                  "group:legacy": {
                    allow: false,
                  },
                },
              },
            },
          },
        },
      } as never,
    });

    expect(result.config.channels?.zalouser?.groups?.["group:trusted"]).toEqual({
      enabled: true,
    });
<<<<<<< HEAD
    expect(result.config.channels?.zalouser?.accounts?.work?.groups?.["group:legacy"]).toEqual({
      enabled: false,
    });
    expect(result.changes).toEqual(
      expect.arrayContaining([
        "Moved channels.zalouser.groups.group:trusted.allow → channels.zalouser.groups.group:trusted.enabled (true).",
        "Moved channels.zalouser.accounts.work.groups.group:legacy.allow → channels.zalouser.accounts.work.groups.group:legacy.enabled (false).",
      ]),
    );
=======
    expect(
      (
        result.config.channels?.zalouser?.accounts?.work as
          | { groups?: Record<string, unknown> }
          | undefined
      )?.groups?.["group:legacy"],
    ).toEqual({
      enabled: false,
    });
    expect(result.changes).toEqual([
      "Moved channels.zalouser.groups.group:trusted.allow → channels.zalouser.groups.group:trusted.enabled (true).",
      "Moved channels.zalouser.accounts.work.groups.group:legacy.allow → channels.zalouser.accounts.work.groups.group:legacy.enabled (false).",
    ]);
>>>>>>> upstream/main
  });
});
