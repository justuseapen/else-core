<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { expectOpenDmPolicyConfigIssue } from "../../../test/helpers/plugins/status-issues.js";
=======
// Zalo tests cover status issues plugin behavior.
import { expectOpenDmPolicyConfigIssue } from "openclaw/plugin-sdk/channel-test-helpers";
import { describe, it } from "vitest";
>>>>>>> upstream/main
import { collectZaloStatusIssues } from "./status-issues.js";

describe("collectZaloStatusIssues", () => {
  it("warns when dmPolicy is open", () => {
    expectOpenDmPolicyConfigIssue({
      collectIssues: collectZaloStatusIssues,
      account: {
        accountId: "default",
        enabled: true,
        configured: true,
        dmPolicy: "open",
      },
    });
  });
});
