<<<<<<< HEAD
import type { ReplyPayload } from "../auto-reply/types.js";
import {
  buildApprovalInteractiveReply,
=======
// Approval renderer helpers convert approval request data into channel-safe display text.
import { normalizeOptionalString } from "../../packages/normalization-core/src/string-coerce.js";
import {
  buildApprovalPresentation,
>>>>>>> upstream/main
  type ExecApprovalReplyDecision,
} from "../infra/exec-approval-reply.js";
import {
  buildPluginApprovalRequestMessage,
  buildPluginApprovalResolvedMessage,
<<<<<<< HEAD
  type PluginApprovalRequest,
  type PluginApprovalResolved,
} from "../infra/plugin-approvals.js";

const DEFAULT_ALLOWED_DECISIONS = ["allow-once", "allow-always", "deny"] as const;

export function buildApprovalPendingReplyPayload(params: {
  approvalKind?: "exec" | "plugin";
  approvalId: string;
  approvalSlug: string;
  text: string;
  agentId?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  sessionKey?: string | null;
  channelData?: Record<string, unknown>;
}): ReplyPayload {
  const allowedDecisions = params.allowedDecisions ?? DEFAULT_ALLOWED_DECISIONS;
  return {
    text: params.text,
    interactive: buildApprovalInteractiveReply({
=======
  resolvePluginApprovalRequestAllowedDecisions,
  type PluginApprovalRequest,
  type PluginApprovalResolved,
} from "../infra/plugin-approvals.js";
import type { ReplyPayload } from "./reply-payload.js";

const DEFAULT_ALLOWED_DECISIONS = ["allow-once", "allow-always", "deny"] as const;

/** Build a pending approval reply payload using the portable presentation API. */
export function buildApprovalPendingReplyPayload(params: {
  /** Approval surface recorded in channel metadata; defaults to exec approvals. */
  approvalKind?: "exec" | "plugin";
  /** Stable approval id used by `/approve` commands and metadata correlation. */
  approvalId: string;
  /** Short channel-facing approval slug for compact metadata displays. */
  approvalSlug: string;
  /** Visible approval request text sent to the channel. */
  text: string;
  /** Optional agent id associated with the approval request. */
  agentId?: string | null;
  /** Decisions rendered as buttons and accepted by the approval command. */
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  /** Optional session key associated with the approval request. */
  sessionKey?: string | null;
  /** Channel-specific metadata merged with the shared approval metadata. */
  channelData?: Record<string, unknown>;
}): ReplyPayload {
  // Keep defaults aligned with the generic approval command UI when callers do
  // not provide request-scoped decision restrictions.
  const allowedDecisions = params.allowedDecisions ?? DEFAULT_ALLOWED_DECISIONS;
  return {
    text: params.text,
    presentation: buildApprovalPresentation({
>>>>>>> upstream/main
      approvalId: params.approvalId,
      allowedDecisions,
    }),
    channelData: {
      execApproval: {
        approvalId: params.approvalId,
        approvalSlug: params.approvalSlug,
        approvalKind: params.approvalKind ?? "exec",
<<<<<<< HEAD
        agentId: params.agentId?.trim() || undefined,
        allowedDecisions,
        sessionKey: params.sessionKey?.trim() || undefined,
=======
        agentId: normalizeOptionalString(params.agentId),
        allowedDecisions,
        sessionKey: normalizeOptionalString(params.sessionKey),
>>>>>>> upstream/main
        state: "pending",
      },
      ...params.channelData,
    },
  };
}

<<<<<<< HEAD
export function buildApprovalResolvedReplyPayload(params: {
  approvalId: string;
  approvalSlug: string;
  text: string;
=======
/** Build a resolved approval reply payload with approval metadata but no controls. */
export function buildApprovalResolvedReplyPayload(params: {
  /** Stable approval id used by `/approve` commands and metadata correlation. */
  approvalId: string;
  /** Short channel-facing approval slug for compact metadata displays. */
  approvalSlug: string;
  /** Visible resolved-state text sent to the channel. */
  text: string;
  /** Channel-specific metadata merged with the shared approval metadata. */
>>>>>>> upstream/main
  channelData?: Record<string, unknown>;
}): ReplyPayload {
  return {
    text: params.text,
    channelData: {
      execApproval: {
        approvalId: params.approvalId,
        approvalSlug: params.approvalSlug,
        state: "resolved",
      },
      ...params.channelData,
    },
  };
}

<<<<<<< HEAD
export function buildPluginApprovalPendingReplyPayload(params: {
  request: PluginApprovalRequest;
  nowMs: number;
  text?: string;
  approvalSlug?: string;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
=======
/** Build pending plugin approval copy and metadata from a plugin approval request. */
export function buildPluginApprovalPendingReplyPayload(params: {
  /** Plugin approval request to render. */
  request: PluginApprovalRequest;
  /** Current time used for request expiry copy. */
  nowMs: number;
  /** Optional visible text override. */
  text?: string;
  /** Optional compact approval slug; defaults to the request id prefix. */
  approvalSlug?: string;
  /** Optional decision override; defaults to the request's allowed decisions. */
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  /** Channel-specific metadata merged with the shared approval metadata. */
>>>>>>> upstream/main
  channelData?: Record<string, unknown>;
}): ReplyPayload {
  return buildApprovalPendingReplyPayload({
    approvalKind: "plugin",
    approvalId: params.request.id,
    approvalSlug: params.approvalSlug ?? params.request.id.slice(0, 8),
    text: params.text ?? buildPluginApprovalRequestMessage(params.request, params.nowMs),
<<<<<<< HEAD
    allowedDecisions: params.allowedDecisions,
=======
    allowedDecisions:
      params.allowedDecisions ??
      resolvePluginApprovalRequestAllowedDecisions(params.request.request),
>>>>>>> upstream/main
    channelData: params.channelData,
  });
}

<<<<<<< HEAD
export function buildPluginApprovalResolvedReplyPayload(params: {
  resolved: PluginApprovalResolved;
  text?: string;
  approvalSlug?: string;
=======
/** Build resolved plugin approval copy and metadata from a plugin approval event. */
export function buildPluginApprovalResolvedReplyPayload(params: {
  /** Resolved plugin approval event to render. */
  resolved: PluginApprovalResolved;
  /** Optional visible text override. */
  text?: string;
  /** Optional compact approval slug; defaults to the resolved id prefix. */
  approvalSlug?: string;
  /** Channel-specific metadata merged with the shared approval metadata. */
>>>>>>> upstream/main
  channelData?: Record<string, unknown>;
}): ReplyPayload {
  return buildApprovalResolvedReplyPayload({
    approvalId: params.resolved.id,
    approvalSlug: params.approvalSlug ?? params.resolved.id.slice(0, 8),
    text: params.text ?? buildPluginApprovalResolvedMessage(params.resolved),
    channelData: params.channelData,
  });
}
