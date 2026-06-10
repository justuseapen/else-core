<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { auditConfigHonorInventory, listSchemaLeafKeysForPrefixes } from "./config-honor-audit.js";
import {
  HEARTBEAT_CONFIG_HONOR_INVENTORY,
  HEARTBEAT_CONFIG_PREFIXES,
} from "./heartbeat-config-honor.inventory.js";
=======
// Audits heartbeat config coverage across inventory entries.
import { describe, expect, it } from "vitest";
import {
  auditConfigHonorInventory,
  listSchemaLeafKeysForPrefixes,
} from "../../test/helpers/config/config-honor-audit.js";
import {
  HEARTBEAT_CONFIG_HONOR_INVENTORY,
  HEARTBEAT_CONFIG_PREFIXES,
} from "../../test/helpers/config/heartbeat-config-honor.inventory.js";
>>>>>>> upstream/main

const EXPECTED_HEARTBEAT_KEYS = [
  "every",
  "model",
  "prompt",
<<<<<<< HEAD
  "ackMaxChars",
  "suppressToolErrorWarnings",
=======
  "includeSystemPromptSection",
  "ackMaxChars",
  "suppressToolErrorWarnings",
  "timeoutSeconds",
>>>>>>> upstream/main
  "lightContext",
  "isolatedSession",
  "target",
  "to",
  "accountId",
  "directPolicy",
  "includeReasoning",
] as const;

describe("heartbeat config-honor inventory", () => {
  it("keeps the planned heartbeat audit slice aligned with schema leaf keys", () => {
    const schemaKeys = listSchemaLeafKeysForPrefixes([...HEARTBEAT_CONFIG_PREFIXES]);
    for (const key of EXPECTED_HEARTBEAT_KEYS) {
      expect(schemaKeys).toContain(key);
    }
  });

  it("covers the planned heartbeat keys with runtime, reload, and test proofs", () => {
    const audit = auditConfigHonorInventory({
      prefixes: [...HEARTBEAT_CONFIG_PREFIXES],
      expectedKeys: [...EXPECTED_HEARTBEAT_KEYS],
      rows: HEARTBEAT_CONFIG_HONOR_INVENTORY,
    });

<<<<<<< HEAD
    expect(audit.missingKeys).toEqual([]);
    expect(audit.extraKeys).toEqual([]);
    expect(audit.missingSchemaPaths).toEqual([]);
    expect(audit.missingFiles).toEqual([]);
    expect(audit.missingProofs).toEqual([]);
=======
    expect(audit.missingKeys).toStrictEqual([]);
    expect(audit.extraKeys).toStrictEqual([]);
    expect(audit.missingSchemaPaths).toStrictEqual([]);
    expect(audit.missingFiles).toStrictEqual([]);
    expect(audit.missingProofs).toStrictEqual([]);
>>>>>>> upstream/main
  });
});
