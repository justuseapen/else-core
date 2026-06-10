<<<<<<< HEAD
export { createIMessageTestPlugin } from "./src/test-plugin.js";
export {
  resolveIMessageAttachmentRoots as resolveInboundAttachmentRoots,
  resolveIMessageRemoteAttachmentRoots as resolveRemoteInboundAttachmentRoots,
} from "./src/media-contract.js";
export {
  DEFAULT_IMESSAGE_ATTACHMENT_ROOTS,
  resolveIMessageAttachmentRoots,
  resolveIMessageRemoteAttachmentRoots,
} from "./src/media-contract.js";
=======
// Imessage API module exposes the plugin public contract.
export {
  DEFAULT_IMESSAGE_ATTACHMENT_ROOTS,
  resolveIMessageAttachmentRoots as resolveInboundAttachmentRoots,
  resolveIMessageAttachmentRoots,
  resolveIMessageRemoteAttachmentRoots as resolveRemoteInboundAttachmentRoots,
  resolveIMessageRemoteAttachmentRoots,
} from "./media-contract-api.js";
>>>>>>> upstream/main
