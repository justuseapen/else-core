// Tlon tests cover settings helpers plugin behavior.
import { describe, expect, it } from "vitest";
import type { TlonResolvedAccount } from "../types.js";
import {
  applyTlonSettingsOverrides,
  buildTlonSettingsMigrations,
  shouldMigrateTlonSetting,
} from "./settings-helpers.js";

const baseAccount: TlonResolvedAccount = {
  accountId: "default",
  name: "Tlon",
  enabled: true,
  configured: true,
  ship: "~sampel-palnet",
  url: "https://example.com",
  code: "lidlut-tabwed-pillex-ridrup",
  dangerouslyAllowPrivateNetwork: false,
  groupChannels: ["chat/~host/general"],
  dmAllowlist: ["~zod"],
  groupInviteAllowlist: ["~bus"],
  autoDiscoverChannels: true,
  showModelSignature: false,
  autoAcceptDmInvites: true,
  autoAcceptGroupInvites: true,
  defaultAuthorizedShips: ["~nec"],
  ownerShip: "~marzod",
};

<<<<<<< HEAD
describe("shouldMigrateTlonSetting", () => {
  it("does not rehydrate explicit empty-array revocations during startup migration", () => {
    const migrations = buildTlonSettingsMigrations(baseAccount, {
=======
function allowlistMigrationDecisions(currentSettings: Record<string, unknown>) {
  const allowlistKeys = new Set(["dmAllowlist", "groupInviteAllowlist", "defaultAuthorizedShips"]);
  return Object.fromEntries(
    buildTlonSettingsMigrations(baseAccount, currentSettings)
      .filter((migration) => allowlistKeys.has(migration.key))
      .map((migration) => [
        migration.key,
        shouldMigrateTlonSetting(migration.fileValue, migration.settingsValue),
      ]),
  );
}

describe("shouldMigrateTlonSetting", () => {
  it("does not rehydrate explicit empty-array revocations during startup migration", () => {
    const decisions = allowlistMigrationDecisions({
>>>>>>> upstream/main
      dmAllowlist: [],
      groupInviteAllowlist: [],
      defaultAuthorizedShips: [],
    });

<<<<<<< HEAD
    expect(
      Object.fromEntries(
        migrations
          .filter((migration) =>
            ["dmAllowlist", "groupInviteAllowlist", "defaultAuthorizedShips"].includes(
              migration.key,
            ),
          )
          .map((migration) => [
            migration.key,
            shouldMigrateTlonSetting(migration.fileValue, migration.settingsValue),
          ]),
      ),
    ).toEqual({
=======
    expect(decisions).toEqual({
>>>>>>> upstream/main
      dmAllowlist: false,
      groupInviteAllowlist: false,
      defaultAuthorizedShips: false,
    });
  });

  it("still seeds file-config allowlists on first run when settings are missing", () => {
<<<<<<< HEAD
    const migrations = buildTlonSettingsMigrations(baseAccount, {});

    expect(
      Object.fromEntries(
        migrations
          .filter((migration) =>
            ["dmAllowlist", "groupInviteAllowlist", "defaultAuthorizedShips"].includes(
              migration.key,
            ),
          )
          .map((migration) => [
            migration.key,
            shouldMigrateTlonSetting(migration.fileValue, migration.settingsValue),
          ]),
      ),
    ).toEqual({
=======
    const decisions = allowlistMigrationDecisions({});

    expect(decisions).toEqual({
>>>>>>> upstream/main
      dmAllowlist: true,
      groupInviteAllowlist: true,
      defaultAuthorizedShips: true,
    });
  });
});

describe("applyTlonSettingsOverrides", () => {
  it("treats explicit empty settings allowlists as authoritative deny-all", () => {
    const result = applyTlonSettingsOverrides({
      account: baseAccount,
      currentSettings: {
        dmAllowlist: [],
        groupInviteAllowlist: [],
      },
    });

    expect(result.effectiveDmAllowlist).toStrictEqual([]);
    expect(result.effectiveGroupInviteAllowlist).toStrictEqual([]);
  });

  it("falls back to file config when settings fields are removed", () => {
    const result = applyTlonSettingsOverrides({
      account: baseAccount,
      currentSettings: {},
    });

    expect(result.effectiveDmAllowlist).toEqual(baseAccount.dmAllowlist);
    expect(result.effectiveGroupInviteAllowlist).toEqual(baseAccount.groupInviteAllowlist);
    expect(result.effectiveAutoDiscoverChannels).toBe(baseAccount.autoDiscoverChannels);
    expect(result.effectiveOwnerShip).toBe(baseAccount.ownerShip);
  });

  it("keeps other explicit settings overrides authoritative", () => {
    const result = applyTlonSettingsOverrides({
      account: baseAccount,
      currentSettings: {
        autoDiscoverChannels: false,
        autoAcceptDmInvites: false,
        autoAcceptGroupInvites: false,
        showModelSig: true,
        ownerShip: "~nec",
        pendingApprovals: [],
      },
    });

    expect(result.effectiveAutoDiscoverChannels).toBe(false);
    expect(result.effectiveAutoAcceptDmInvites).toBe(false);
    expect(result.effectiveAutoAcceptGroupInvites).toBe(false);
    expect(result.effectiveShowModelSig).toBe(true);
    expect(result.effectiveOwnerShip).toBe("~nec");
    expect(result.pendingApprovals).toStrictEqual([]);
  });
});
