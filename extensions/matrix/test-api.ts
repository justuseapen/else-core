<<<<<<< HEAD
export { matrixPlugin } from "./src/channel.js";
=======
// Matrix API module exposes the plugin public contract.
export { matrixPlugin } from "./src/channel.js";
export { MatrixClient } from "./src/matrix/sdk.js";
export type {
  EncryptedFile,
  MatrixDeviceVerificationStatus,
  MatrixOwnDeviceDeleteResult,
  MatrixOwnDeviceInfo,
  MatrixOwnDeviceVerificationStatus,
  MatrixRecoveryKeyVerificationResult,
  MatrixRawEvent,
  MatrixRoomKeyBackupResetResult,
  MatrixRoomKeyBackupRestoreResult,
  MatrixRoomKeyBackupStatus,
  MatrixVerificationBootstrapResult,
  MessageEventContent,
} from "./src/matrix/sdk.js";
export type {
  MatrixVerificationMethod,
  MatrixVerificationSummary,
} from "./src/matrix/sdk/verification-manager.js";
>>>>>>> upstream/main
export { setMatrixRuntime } from "./src/runtime.js";
