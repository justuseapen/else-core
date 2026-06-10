<<<<<<< HEAD
export * from "./src/active-listener.js";
export * from "./src/action-runtime.js";
export * from "./src/agent-tools-login.js";
export * from "./src/auth-store.js";
export * from "./src/auto-reply.js";
export * from "./src/inbound.js";
export * from "./src/login.js";
export * from "./src/media.js";
export * from "./src/send.js";
export * from "./src/session.js";
export { setWhatsAppRuntime } from "./src/runtime.js";

type StartWebLoginWithQr = typeof import("./src/login-qr.js").startWebLoginWithQr;
type WaitForWebLogin = typeof import("./src/login-qr.js").waitForWebLogin;

let loginQrModulePromise: Promise<typeof import("./src/login-qr.js")> | null = null;

function loadLoginQrModule() {
  loginQrModulePromise ??= import("./src/login-qr.js");
  return loginQrModulePromise;
}

export async function startWebLoginWithQr(
  ...args: Parameters<StartWebLoginWithQr>
): ReturnType<StartWebLoginWithQr> {
  const { startWebLoginWithQr } = await loadLoginQrModule();
  return await startWebLoginWithQr(...args);
}

export async function waitForWebLogin(
  ...args: Parameters<WaitForWebLogin>
): ReturnType<WaitForWebLogin> {
  const { waitForWebLogin } = await loadLoginQrModule();
  return await waitForWebLogin(...args);
}
=======
// Whatsapp API module exposes the plugin public contract.
export {
  getActiveWebListener,
  resolveWebAccountId,
  type ActiveWebListener,
  type ActiveWebSendOptions,
} from "./src/active-listener.js";
export { handleWhatsAppAction, whatsAppActionRuntime } from "./src/action-runtime.js";
export { createWhatsAppLoginTool } from "./src/agent-tools-login.js";
export {
  formatWhatsAppWebAuthStatusState,
  getWebAuthAgeMs,
  hasWebCredsSync,
  logWebSelfId,
  logoutWeb,
  pickWebChannel,
  readCredsJsonRaw,
  readWebAuthExistsBestEffort,
  readWebAuthExistsForDecision,
  readWebAuthSnapshot,
  readWebAuthSnapshotBestEffort,
  readWebAuthState,
  readWebSelfId,
  readWebSelfIdentity,
  readWebSelfIdentityForDecision,
  resolveDefaultWebAuthDir,
  resolveWebCredsBackupPath,
  resolveWebCredsPath,
  restoreCredsFromBackupIfNeeded,
  webAuthExists,
  WA_WEB_AUTH_DIR,
  WHATSAPP_AUTH_UNSTABLE_CODE,
  WhatsAppAuthUnstableError,
  type WhatsAppWebAuthState,
} from "./src/auth-store.js";
export {
  DEFAULT_WEB_MEDIA_BYTES,
  HEARTBEAT_PROMPT,
  HEARTBEAT_TOKEN,
  monitorWebChannel,
  SILENT_REPLY_TOKEN,
  stripHeartbeatToken,
  type WebChannelStatus,
  type WebMonitorTuning,
} from "./src/auto-reply.js";
export {
  extractContactContext,
  extractLocationData,
  extractMediaPlaceholder,
  extractText,
  monitorWebInbox,
  resetWebInboundDedupe,
  type WebInboundMessage,
  type WebListenerCloseReason,
} from "./src/inbound.js";
export { loginWeb } from "./src/login.js";
export {
  getDefaultLocalRoots,
  loadWebMedia,
  loadWebMediaRaw,
  LocalMediaAccessError,
  optimizeImageToJpeg,
  optimizeImageToPng,
  type LocalMediaAccessErrorCode,
  type WebMediaResult,
} from "./src/media.js";
export {
  sendMessageWhatsApp,
  sendPollWhatsApp,
  sendReactionWhatsApp,
  sendTypingWhatsApp,
} from "./src/send.js";
export {
  createWaSocket,
  formatError,
  getStatusCode,
  newConnectionId,
  waitForCredsSaveQueue,
  waitForCredsSaveQueueWithTimeout,
  waitForWaConnection,
  writeCredsJsonAtomically,
  type CredsQueueWaitResult,
} from "./src/session.js";
export { setWhatsAppRuntime } from "./src/runtime.js";
export { startWebLoginWithQr, waitForWebLogin } from "./login-qr-runtime.js";
>>>>>>> upstream/main
