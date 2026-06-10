// Matrix plugin module implements credentials write behavior.
import type {
  saveBackfilledMatrixDeviceId as saveBackfilledMatrixDeviceIdType,
  saveMatrixCredentials as saveMatrixCredentialsType,
  touchMatrixCredentials as touchMatrixCredentialsType,
} from "./credentials.js";

type MatrixCredentialsRuntime = typeof import("./credentials.js");

let matrixCredentialsRuntimePromise: Promise<MatrixCredentialsRuntime> | undefined;

function loadMatrixCredentialsRuntime(): Promise<MatrixCredentialsRuntime> {
  matrixCredentialsRuntimePromise ??= import("./credentials.js");
  return matrixCredentialsRuntimePromise;
}

export async function saveMatrixCredentials(
  ...args: Parameters<typeof saveMatrixCredentialsType>
): ReturnType<typeof saveMatrixCredentialsType> {
  const runtime = await loadMatrixCredentialsRuntime();
  return runtime.saveMatrixCredentials(...args);
}

export async function saveBackfilledMatrixDeviceId(
  ...args: Parameters<typeof saveBackfilledMatrixDeviceIdType>
): ReturnType<typeof saveBackfilledMatrixDeviceIdType> {
<<<<<<< HEAD
  const runtime = await import("./credentials.js");
=======
  const runtime = await loadMatrixCredentialsRuntime();
>>>>>>> upstream/main
  return runtime.saveBackfilledMatrixDeviceId(...args);
}

export async function touchMatrixCredentials(
  ...args: Parameters<typeof touchMatrixCredentialsType>
): ReturnType<typeof touchMatrixCredentialsType> {
  const runtime = await loadMatrixCredentialsRuntime();
  return runtime.touchMatrixCredentials(...args);
}
