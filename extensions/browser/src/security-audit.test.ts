<<<<<<< HEAD
=======
// Browser tests cover security audit plugin behavior.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import { collectBrowserSecurityAuditFindings } from "./security-audit.js";

function collectFindings(
  config: Parameters<typeof collectBrowserSecurityAuditFindings>[0]["config"],
) {
  return collectBrowserSecurityAuditFindings({
    config,
    sourceConfig: config,
    env: {} as NodeJS.ProcessEnv,
    stateDir: "/tmp/openclaw-state",
    configPath: "/tmp/openclaw.json",
  });
}

<<<<<<< HEAD
=======
function findingByCheckId(
  findings: ReturnType<typeof collectBrowserSecurityAuditFindings>,
  checkId: string,
) {
  const finding = findings.find((candidate) => candidate.checkId === checkId);
  if (!finding) {
    throw new Error(`expected browser security finding ${checkId}`);
  }
  return finding;
}

>>>>>>> upstream/main
describe("browser security audit collector", () => {
  it("flags browser control without auth", () => {
    const findings = collectFindings({
      gateway: {
        controlUi: { enabled: false },
        auth: {},
      },
      browser: {
        enabled: true,
      },
    });

<<<<<<< HEAD
    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkId: "browser.control_no_auth",
          severity: "critical",
        }),
      ]),
    );
=======
    const finding = findingByCheckId(findings, "browser.control_no_auth");
    expect(finding.severity).toBe("critical");
>>>>>>> upstream/main
  });

  it("warns on remote http CDP profiles", () => {
    const findings = collectFindings({
      browser: {
        profiles: {
          remote: {
            cdpUrl: "http://example.com:9222",
            color: "#0066CC",
          },
        },
      },
    });

<<<<<<< HEAD
    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkId: "browser.remote_cdp_http",
          severity: "warn",
        }),
      ]),
    );
=======
    const finding = findingByCheckId(findings, "browser.remote_cdp_http");
    expect(finding.severity).toBe("warn");
>>>>>>> upstream/main
  });

  it("redacts private-host CDP URLs in findings", () => {
    const findings = collectFindings({
      browser: {
        ssrfPolicy: {
          dangerouslyAllowPrivateNetwork: true,
        },
        profiles: {
          remote: {
            cdpUrl:
              "http://169.254.169.254:9222/json/version?token=supersecrettokenvalue1234567890",
            color: "#0066CC",
          },
        },
      },
    });

<<<<<<< HEAD
    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkId: "browser.remote_cdp_private_host",
          severity: "warn",
          detail: expect.stringContaining("token=supers…7890"),
        }),
      ]),
    );
=======
    const finding = findingByCheckId(findings, "browser.remote_cdp_private_host");
    expect(finding.severity).toBe("warn");
    expect(finding.detail).toContain("token=supers…7890");
>>>>>>> upstream/main
  });
});
