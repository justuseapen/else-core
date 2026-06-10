<<<<<<< HEAD
=======
// Openshell tests cover config plugin behavior.
>>>>>>> upstream/main
import fsSync from "node:fs";
import { describe, expect, it } from "vitest";
import { createOpenShellPluginConfigSchema, resolveOpenShellPluginConfig } from "./config.js";

describe("openshell plugin config", () => {
  it("applies defaults", () => {
    expect(resolveOpenShellPluginConfig(undefined)).toEqual({
      mode: "mirror",
      command: "openshell",
      gateway: undefined,
      gatewayEndpoint: undefined,
      from: "openclaw",
      policy: undefined,
      providers: [],
      gpu: false,
      autoProviders: true,
      remoteWorkspaceDir: "/sandbox",
      remoteAgentWorkspaceDir: "/agent",
      timeoutMs: 120_000,
    });
  });

  it("accepts remote mode", () => {
    expect(resolveOpenShellPluginConfig({ mode: "remote" }).mode).toBe("remote");
  });

  it("rejects relative remote paths", () => {
    expect(() =>
      resolveOpenShellPluginConfig({
        remoteWorkspaceDir: "sandbox",
      }),
    ).toThrow("OpenShell remoteWorkspaceDir must be absolute");
  });

  it("rejects remote paths outside managed sandbox roots", () => {
    expect(() =>
      resolveOpenShellPluginConfig({
        remoteWorkspaceDir: "/tmp/victim",
      }),
    ).toThrow("OpenShell remoteWorkspaceDir must stay under /sandbox or /agent");
  });

  it("normalizes managed sandbox subpaths", () => {
    expect(
      resolveOpenShellPluginConfig({
        remoteWorkspaceDir: "/sandbox/../sandbox/project",
        remoteAgentWorkspaceDir: "/agent/./session",
      }),
<<<<<<< HEAD
    ).toEqual(
      expect.objectContaining({
        remoteWorkspaceDir: "/sandbox/project",
        remoteAgentWorkspaceDir: "/agent/session",
      }),
    );
=======
    ).toEqual({
      mode: "mirror",
      command: "openshell",
      gateway: undefined,
      gatewayEndpoint: undefined,
      from: "openclaw",
      policy: undefined,
      providers: [],
      gpu: false,
      autoProviders: true,
      remoteWorkspaceDir: "/sandbox/project",
      remoteAgentWorkspaceDir: "/agent/session",
      timeoutMs: 120_000,
    });
>>>>>>> upstream/main
  });

  it("rejects unknown mode", () => {
    expect(() =>
      resolveOpenShellPluginConfig({
        mode: "bogus",
      }),
    ).toThrow("mode must be one of mirror, remote");
  });

<<<<<<< HEAD
=======
  it("rejects timeouts beyond Node's safe timer range", () => {
    expect(() =>
      resolveOpenShellPluginConfig({
        timeoutSeconds: 2_147_001,
      }),
    ).toThrow("timeoutSeconds must be a number <= 2147000");
  });

>>>>>>> upstream/main
  it("keeps the runtime json schema in sync with the manifest config schema", () => {
    const manifest = JSON.parse(
      fsSync.readFileSync(new URL("../openclaw.plugin.json", import.meta.url), "utf8"),
    ) as { configSchema?: unknown };

    expect(createOpenShellPluginConfigSchema().jsonSchema).toEqual(manifest.configSchema);
  });
});
