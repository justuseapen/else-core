<<<<<<< HEAD
import type { GatewayRequestHandlerOptions } from "openclaw/plugin-sdk/core";
=======
// Matrix plugin module implements plugin entry behavior.
import type { GatewayRequestHandlerOptions } from "openclaw/plugin-sdk/gateway-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatMatrixErrorMessage } from "./matrix/errors.js";
>>>>>>> upstream/main

type MatrixVerificationRuntime = typeof import("./matrix/actions/verification.js");

let matrixVerificationRuntimePromise: Promise<MatrixVerificationRuntime> | undefined;

function loadMatrixVerificationRuntime(): Promise<MatrixVerificationRuntime> {
  matrixVerificationRuntimePromise ??= import("./matrix/actions/verification.js");
  return matrixVerificationRuntimePromise;
}

<<<<<<< HEAD
export async function ensureMatrixCryptoRuntime(
  ...args: Parameters<typeof import("./matrix/deps.js").ensureMatrixCryptoRuntime>
): Promise<void> {
  const { ensureMatrixCryptoRuntime: ensureRuntime } = await import("./matrix/deps.js");
  await ensureRuntime(...args);
=======
function sendError(respond: (ok: boolean, payload?: unknown) => void, err: unknown) {
  respond(false, { error: formatMatrixErrorMessage(err) });
>>>>>>> upstream/main
}

export async function handleVerifyRecoveryKey({
  params,
  respond,
}: GatewayRequestHandlerOptions): Promise<void> {
  try {
<<<<<<< HEAD
    const { verifyMatrixRecoveryKey } = await import("./matrix/actions/verification.js");
    const key = typeof params?.key === "string" ? params.key : "";
    if (!key.trim()) {
=======
    const { verifyMatrixRecoveryKey } = await loadMatrixVerificationRuntime();
    const key = normalizeOptionalString(params?.key);
    if (!key) {
>>>>>>> upstream/main
      respond(false, { error: "key required" });
      return;
    }
    const accountId = normalizeOptionalString(params?.accountId);
    const result = await verifyMatrixRecoveryKey(key, { accountId });
    respond(result.success, result);
  } catch (err) {
    sendError(respond, err);
  }
}

export async function handleVerificationBootstrap({
  params,
  respond,
}: GatewayRequestHandlerOptions): Promise<void> {
  try {
<<<<<<< HEAD
    const { bootstrapMatrixVerification } = await import("./matrix/actions/verification.js");
    const accountId =
      typeof params?.accountId === "string" ? params.accountId.trim() || undefined : undefined;
=======
    const { bootstrapMatrixVerification } = await loadMatrixVerificationRuntime();
    const accountId = normalizeOptionalString(params?.accountId);
>>>>>>> upstream/main
    const recoveryKey = typeof params?.recoveryKey === "string" ? params.recoveryKey : undefined;
    const forceResetCrossSigning = params?.forceResetCrossSigning === true;
    const result = await bootstrapMatrixVerification({
      accountId,
      recoveryKey,
      forceResetCrossSigning,
    });
    respond(result.success, result);
  } catch (err) {
    sendError(respond, err);
  }
}

export async function handleVerificationStatus({
  params,
  respond,
}: GatewayRequestHandlerOptions): Promise<void> {
  try {
<<<<<<< HEAD
    const { getMatrixVerificationStatus } = await import("./matrix/actions/verification.js");
    const accountId =
      typeof params?.accountId === "string" ? params.accountId.trim() || undefined : undefined;
=======
    const { getMatrixVerificationStatus } = await loadMatrixVerificationRuntime();
    const accountId = normalizeOptionalString(params?.accountId);
>>>>>>> upstream/main
    const includeRecoveryKey = params?.includeRecoveryKey === true;
    const status = await getMatrixVerificationStatus({ accountId, includeRecoveryKey });
    respond(true, status);
  } catch (err) {
    sendError(respond, err);
  }
}
