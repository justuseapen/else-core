// Config presence tests cover channel config detection and missing-config diagnostics.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
  hasMeaningfulChannelConfig,
  hasPotentialConfiguredChannels,
  listExplicitlyDisabledChannelIdsForConfig,
  listPotentialConfiguredChannelPresenceSignals,
  listPotentialConfiguredChannelIds,
} from "./config-presence.js";

const tempDirs: string[] = [];

const matrixPresenceOptions = {
  channelIds: ["matrix"],
  persistedAuthStateProbe: {
    listChannelIds: () => ["matrix"],
    hasState: ({ channelId, env }: { channelId: string; env?: NodeJS.ProcessEnv }) =>
      channelId === "matrix" && Boolean(env?.OPENCLAW_STATE_DIR?.includes("persisted-matrix")),
  },
};

function makeTempStateDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-channel-config-presence-"));
  tempDirs.push(dir);
  return dir;
}

function expectPotentialConfiguredChannelCase(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  expectedIds: string[];
  expectedConfigured: boolean;
<<<<<<< HEAD
}) {
  expect(listPotentialConfiguredChannelIds(params.cfg, params.env)).toEqual(params.expectedIds);
  expect(hasPotentialConfiguredChannels(params.cfg, params.env)).toBe(params.expectedConfigured);
=======
  options?: Parameters<typeof listPotentialConfiguredChannelIds>[2];
}) {
  const options = params.options ?? matrixPresenceOptions;
  expect(listPotentialConfiguredChannelIds(params.cfg, params.env, options)).toEqual(
    params.expectedIds,
  );
  expect(hasPotentialConfiguredChannels(params.cfg, params.env, options)).toBe(
    params.expectedConfigured,
  );
>>>>>>> upstream/main
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("config presence", () => {
  it("treats enabled-only channel sections as not meaningfully configured", () => {
    expect(hasMeaningfulChannelConfig({ enabled: false })).toBe(false);
    expect(hasMeaningfulChannelConfig({ enabled: true })).toBe(false);
    expect(hasMeaningfulChannelConfig({})).toBe(false);
    expect(hasMeaningfulChannelConfig({ homeserver: "https://matrix.example.org" })).toBe(true);
  });

  it("ignores enabled-only matrix config when listing configured channels", () => {
    const env = {} as NodeJS.ProcessEnv;
    const cfg = { channels: { matrix: { enabled: false } } };

    expectPotentialConfiguredChannelCase({
      cfg,
      env,
      expectedIds: [],
      expectedConfigured: false,
<<<<<<< HEAD
    });
  });

  it("detects env-only channel config", () => {
    const stateDir = makeTempStateDir();
    const env = {
      OPENCLAW_STATE_DIR: stateDir,
=======
      options: { includePersistedAuthState: false },
    });
  });

  it("lists explicitly disabled channel ids case-insensitively", () => {
    const cfg = {
      channels: {
        Matrix: { enabled: false },
        telegram: { enabled: true },
        slack: { botToken: "token" },
        discord: false,
      },
    } as unknown as OpenClawConfig;

    expect(listExplicitlyDisabledChannelIdsForConfig(cfg)).toEqual(["matrix"]);
  });

  it("detects env-only channel config", () => {
    const env = {
>>>>>>> upstream/main
      MATRIX_ACCESS_TOKEN: "token",
    } as NodeJS.ProcessEnv;

    expectPotentialConfiguredChannelCase({
      cfg: {},
      env,
      expectedIds: ["matrix"],
      expectedConfigured: true,
<<<<<<< HEAD
    });
  });

  it("detects persisted Matrix credentials without config or env", () => {
    const stateDir = makeTempStateDir();
    fs.mkdirSync(path.join(stateDir, "credentials", "matrix"), { recursive: true });
    fs.writeFileSync(
      path.join(stateDir, "credentials", "matrix", "credentials.json"),
      JSON.stringify({
        homeserver: "https://matrix.example.org",
        userId: "@bot:example.org",
        accessToken: "token",
      }),
      "utf8",
    );
=======
      options: { includePersistedAuthState: false },
    });
    expect(
      listPotentialConfiguredChannelPresenceSignals({}, env, {
        includePersistedAuthState: false,
      }),
    ).toEqual([{ channelId: "matrix", source: "env" }]);
  });

  it("detects persisted Matrix credentials without config or env", () => {
    const stateDir = makeTempStateDir().replace(
      "openclaw-channel-config-presence-",
      "persisted-matrix-",
    );
    fs.mkdirSync(stateDir, { recursive: true });
    tempDirs.push(stateDir);
>>>>>>> upstream/main
    const env = { OPENCLAW_STATE_DIR: stateDir } as NodeJS.ProcessEnv;

    expectPotentialConfiguredChannelCase({
      cfg: {},
      env,
      expectedIds: ["matrix"],
      expectedConfigured: true,
<<<<<<< HEAD
=======
      options: {
        persistedAuthStateProbe: {
          listChannelIds: () => ["matrix"],
          hasState: () => true,
        },
      },
>>>>>>> upstream/main
    });
  });
});
