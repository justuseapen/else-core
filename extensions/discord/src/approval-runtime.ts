<<<<<<< HEAD
=======
// Discord plugin module implements approval runtime behavior.
>>>>>>> upstream/main
export {
  isChannelExecApprovalClientEnabledFromConfig,
  matchesApprovalRequestFilters,
  getExecApprovalReplyMetadata,
} from "openclaw/plugin-sdk/approval-client-runtime";
export { resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
export {
  createApproverRestrictedNativeApprovalCapability,
  splitChannelApprovalCapability,
} from "openclaw/plugin-sdk/approval-delivery-runtime";
export {
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
<<<<<<< HEAD
  doesApprovalRequestMatchChannelAccount,
=======
>>>>>>> upstream/main
} from "openclaw/plugin-sdk/approval-native-runtime";
