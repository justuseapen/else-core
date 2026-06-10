<<<<<<< HEAD
export { resolveExecApprovalSessionTarget } from "./exec-approval-session-target.js";
export { deliverOutboundPayloads } from "./outbound/deliver.js";
=======
// Lazy runtime imports keep approval forwarding testable without eagerly loading
// channel delivery code.
export { resolveExecApprovalSessionTarget } from "./exec-approval-session-target.js";
export { sendDurableMessageBatch } from "../channels/message/runtime.js";
>>>>>>> upstream/main
