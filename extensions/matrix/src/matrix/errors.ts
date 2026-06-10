<<<<<<< HEAD
=======
// Matrix plugin module implements errors behavior.
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";

export function formatMatrixErrorMessage(err: unknown): string {
  return formatErrorMessage(err);
}

export function formatMatrixErrorReason(err: unknown): string {
  return normalizeLowercaseStringOrEmpty(formatMatrixErrorMessage(err));
}

>>>>>>> upstream/main
export function isMatrixNotFoundError(err: unknown): boolean {
  const errObj = err as { statusCode?: number; body?: { errcode?: string } };
  if (errObj?.statusCode === 404 || errObj?.body?.errcode === "M_NOT_FOUND") {
    return true;
  }
<<<<<<< HEAD
  const message = (err instanceof Error ? err.message : String(err)).toLowerCase();
=======
  const message = formatMatrixErrorReason(err);
>>>>>>> upstream/main
  return (
    message.includes("m_not_found") || message.includes("[404]") || message.includes("not found")
  );
}
