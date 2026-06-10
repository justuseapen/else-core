// Commander registration for device pairing and auth-token commands.
import type { Command } from "commander";
import { applyParentDefaultHelpAction } from "./program/parent-default-help.js";

type DevicesRpcOpts = {
  url?: string;
  token?: string;
  password?: string;
  timeout?: string;
  json?: boolean;
  latest?: boolean;
  yes?: boolean;
  pending?: boolean;
  device?: string;
  role?: string;
  scope?: string[];
};

const DEFAULT_DEVICES_TIMEOUT_MS = 10_000;

type DevicesRuntimeModule = typeof import("./devices-cli.runtime.js");

let devicesRuntimePromise: Promise<DevicesRuntimeModule> | undefined;

function loadDevicesRuntime(): Promise<DevicesRuntimeModule> {
  // Keep device-pairing crypto/table dependencies out of root help startup.
  return (devicesRuntimePromise ??= import("./devices-cli.runtime.js"));
}

const devicesCallOpts = (cmd: Command, defaults?: { timeoutMs?: number }) =>
  cmd
    .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
    .option("--token <token>", "Gateway token (if required)")
    .option("--password <password>", "Gateway password (password auth)")
    .option(
      "--timeout <ms>",
      "Timeout in ms",
      String(defaults?.timeoutMs ?? DEFAULT_DEVICES_TIMEOUT_MS),
    )
    .option("--json", "Output JSON", false);

<<<<<<< HEAD
const callGatewayCli = async (method: string, opts: DevicesRpcOpts, params?: unknown) =>
  withProgress(
    {
      label: `Devices ${method}`,
      indeterminate: true,
      enabled: opts.json !== true,
    },
    async () =>
      await callGateway({
        url: opts.url,
        token: opts.token,
        password: opts.password,
        method,
        params,
        timeoutMs: Number(opts.timeout ?? 10_000),
        clientName: GATEWAY_CLIENT_NAMES.CLI,
        mode: GATEWAY_CLIENT_MODES.CLI,
      }),
  );

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function shouldUseLocalPairingFallback(opts: DevicesRpcOpts, error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();
  if (!message.includes("pairing required")) {
    return false;
  }
  if (typeof opts.url === "string" && opts.url.trim().length > 0) {
    // Explicit --url might point at a remote/tunneled gateway; never silently
    // switch to local pairing files in that case.
    return false;
  }
  const connection = buildGatewayConnectionDetails();
  if (connection.urlSource !== "local loopback") {
    return false;
  }
  try {
    return isLoopbackHost(new URL(connection.url).hostname);
  } catch {
    return false;
  }
}

function redactLocalPairedDevice(device: InfraPairedDevice): PairedDevice {
  const { tokens, ...rest } = device;
  return {
    ...(rest as unknown as PairedDevice),
    tokens: summarizeDeviceTokens(tokens) as DeviceTokenSummary[] | undefined,
  };
}

async function listPairingWithFallback(opts: DevicesRpcOpts): Promise<DevicePairingList> {
  try {
    return parseDevicePairingList(await callGatewayCli("device.pair.list", opts, {}));
  } catch (error) {
    if (!shouldUseLocalPairingFallback(opts, error)) {
      throw error;
    }
    if (opts.json !== true) {
      defaultRuntime.log(theme.warn(FALLBACK_NOTICE));
    }
    const local = await listDevicePairing();
    return {
      pending: local.pending as PendingDevice[],
      paired: local.paired.map((device) => redactLocalPairedDevice(device)),
    };
  }
}

async function approvePairingWithFallback(
  opts: DevicesRpcOpts,
  requestId: string,
): Promise<Record<string, unknown> | null> {
  try {
    return await callGatewayCli("device.pair.approve", opts, { requestId });
  } catch (error) {
    if (!shouldUseLocalPairingFallback(opts, error)) {
      throw error;
    }
    if (opts.json !== true) {
      defaultRuntime.log(theme.warn(FALLBACK_NOTICE));
    }
    const approved = await approveDevicePairing(requestId, {
      // Local CLI fallback already assumes direct machine access; treat it as an
      // explicit admin approval path instead of relying on missing caller scopes.
      callerScopes: ["operator.admin"],
    });
    if (!approved) {
      return null;
    }
    if (approved.status === "forbidden") {
      throw new Error(`missing scope: ${approved.missingScope}`, { cause: error });
    }
    return {
      requestId,
      device: redactLocalPairedDevice(approved.device),
    };
  }
}

function parseDevicePairingList(value: unknown): DevicePairingList {
  const obj = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  return {
    pending: Array.isArray(obj.pending) ? (obj.pending as PendingDevice[]) : [],
    paired: Array.isArray(obj.paired) ? (obj.paired as PairedDevice[]) : [],
  };
}

function selectLatestPendingRequest(pending: PendingDevice[] | undefined) {
  if (!pending?.length) {
    return null;
  }
  return pending.reduce((latest, current) => {
    const latestTs = typeof latest.ts === "number" ? latest.ts : 0;
    const currentTs = typeof current.ts === "number" ? current.ts : 0;
    return currentTs > latestTs ? current : latest;
  });
}

function formatTokenSummary(tokens: DeviceTokenSummary[] | undefined) {
  if (!tokens || tokens.length === 0) {
    return "none";
  }
  const parts = tokens
    .map((t) => `${t.role}${t.revokedAtMs ? " (revoked)" : ""}`)
    .toSorted((a, b) => a.localeCompare(b));
  return parts.join(", ");
}

function formatPendingRoles(request: PendingDevice): string {
  const role = typeof request.role === "string" ? request.role.trim() : "";
  if (role) {
    return role;
  }
  const roles = Array.isArray(request.roles)
    ? request.roles.map((item) => item.trim()).filter((item) => item.length > 0)
    : [];
  if (roles.length === 0) {
    return "";
  }
  return roles.join(", ");
}

function formatPendingScopes(request: PendingDevice): string {
  const scopes = Array.isArray(request.scopes)
    ? request.scopes.map((item) => item.trim()).filter((item) => item.length > 0)
    : [];
  if (scopes.length === 0) {
    return "";
  }
  return scopes.join(", ");
}

function resolveRequiredDeviceRole(
  opts: DevicesRpcOpts,
): { deviceId: string; role: string } | null {
  const deviceId = String(opts.device ?? "").trim();
  const role = String(opts.role ?? "").trim();
  if (deviceId && role) {
    return { deviceId, role };
  }
  defaultRuntime.error("--device and --role required");
  defaultRuntime.exit(1);
  return null;
}

=======
>>>>>>> upstream/main
export function registerDevicesCli(program: Command) {
  const devices = program.command("devices").description("Device pairing and auth tokens");

  devicesCallOpts(
    devices
      .command("list")
      .description("List pending and paired devices")
      .action(async (opts: DevicesRpcOpts) => {
        const { runDevicesListCommand } = await loadDevicesRuntime();
        await runDevicesListCommand(opts);
      }),
  );

  devicesCallOpts(
    devices
      .command("remove")
      .description("Remove a paired device entry")
      .argument("<deviceId>", "Paired device id")
      .action(async (deviceId: string, opts: DevicesRpcOpts) => {
        const { runDevicesRemoveCommand } = await loadDevicesRuntime();
        await runDevicesRemoveCommand(deviceId, opts);
      }),
  );

  devicesCallOpts(
    devices
      .command("clear")
      .description("Clear paired devices from the gateway table")
      .option("--pending", "Also reject all pending pairing requests", false)
      .option("--yes", "Confirm destructive clear", false)
      .action(async (opts: DevicesRpcOpts) => {
        const { runDevicesClearCommand } = await loadDevicesRuntime();
        await runDevicesClearCommand(opts);
      }),
  );

  devicesCallOpts(
    devices
      .command("approve")
      .description("Approve a pending device pairing request")
      .argument("[requestId]", "Pending request id")
      .option("--latest", "Show the most recent pending request to approve explicitly", false)
      .action(async (requestId: string | undefined, opts: DevicesRpcOpts) => {
        const { runDevicesApproveCommand } = await loadDevicesRuntime();
        await runDevicesApproveCommand(requestId, opts);
      }),
  );

  devicesCallOpts(
    devices
      .command("reject")
      .description("Reject a pending device pairing request")
      .argument("<requestId>", "Pending request id")
      .action(async (requestId: string, opts: DevicesRpcOpts) => {
        const { runDevicesRejectCommand } = await loadDevicesRuntime();
        await runDevicesRejectCommand(requestId, opts);
      }),
  );

  devicesCallOpts(
    devices
      .command("rotate")
      .description("Rotate a device token for a role")
      .requiredOption("--device <id>", "Device id")
      .requiredOption("--role <role>", "Role name")
      .option("--scope <scope...>", "Scopes to attach to the token (repeatable)")
      .action(async (opts: DevicesRpcOpts) => {
        const { runDevicesRotateCommand } = await loadDevicesRuntime();
        await runDevicesRotateCommand(opts);
      }),
  );

  devicesCallOpts(
    devices
      .command("revoke")
      .description("Revoke a device token for a role")
      .requiredOption("--device <id>", "Device id")
      .requiredOption("--role <role>", "Role name")
      .action(async (opts: DevicesRpcOpts) => {
        const { runDevicesRevokeCommand } = await loadDevicesRuntime();
        await runDevicesRevokeCommand(opts);
      }),
  );

  applyParentDefaultHelpAction(devices);
}
