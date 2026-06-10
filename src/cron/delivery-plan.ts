<<<<<<< HEAD
import type { CronFailureDestinationConfig } from "../config/types.cron.js";
import type { CronDelivery, CronDeliveryMode, CronJob, CronMessageChannel } from "./types.js";

=======
/** Resolves cron delivery and failure-notification routing from job config. */
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
  normalizeOptionalThreadValue,
} from "@openclaw/normalization-core/string-coerce";
import type { CronFailureDestinationConfig } from "../config/types.cron.js";
import { resolveTargetPrefixedChannel } from "../infra/outbound/channel-target-prefix.js";
import type { CronDelivery, CronDeliveryMode, CronJob, CronMessageChannel } from "./types.js";

/** Normalized routing plan for a cron job's primary delivery behavior. */
>>>>>>> upstream/main
export type CronDeliveryPlan = {
  mode: CronDeliveryMode;
  channel?: CronMessageChannel;
  to?: string;
  threadId?: string | number;
  /** Explicit channel account id from the delivery config, if set. */
  accountId?: string;
  source: "delivery";
  requested: boolean;
};

<<<<<<< HEAD
function normalizeChannel(value: unknown): CronMessageChannel | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim().toLowerCase();
=======
/** Returns whether a delivery plan names a concrete channel, recipient, thread, or account. */
export function hasExplicitCronDeliveryTarget(plan: CronDeliveryPlan): boolean {
  return Boolean(
    (plan.channel && plan.channel !== "last") || plan.to || plan.threadId != null || plan.accountId,
  );
}

function normalizeChannel(value: unknown): CronMessageChannel | undefined {
  const trimmed = normalizeOptionalLowercaseString(value);
>>>>>>> upstream/main
  if (!trimmed) {
    return undefined;
  }
  return trimmed as CronMessageChannel;
}

<<<<<<< HEAD
function normalizeTo(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeAccountId(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeThreadId(value: unknown): string | number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

=======
function resolveAnnounceChannel(params: {
  channel?: CronMessageChannel;
  to?: string;
}): CronMessageChannel {
  if (params.channel && params.channel !== "last") {
    return params.channel;
  }
  // A prefixed recipient like "slack:C123" is enough to infer the channel when
  // the cron config intentionally leaves channel at "last" or unset.
  return (
    (resolveTargetPrefixedChannel(params.to) as CronMessageChannel | undefined) ??
    params.channel ??
    "last"
  );
}

/** Resolves primary delivery config into the runtime mode/channel/target plan. */
>>>>>>> upstream/main
export function resolveCronDeliveryPlan(job: CronJob): CronDeliveryPlan {
  const delivery = job.delivery;
  const hasDelivery = delivery && typeof delivery === "object";
  const rawMode = hasDelivery ? (delivery as { mode?: unknown }).mode : undefined;
<<<<<<< HEAD
  const normalizedMode = typeof rawMode === "string" ? rawMode.trim().toLowerCase() : rawMode;
=======
  const normalizedMode =
    typeof rawMode === "string" ? normalizeLowercaseStringOrEmpty(rawMode) : rawMode;
>>>>>>> upstream/main
  const mode =
    normalizedMode === "announce"
      ? "announce"
      : normalizedMode === "webhook"
        ? "webhook"
        : normalizedMode === "none"
          ? "none"
          : normalizedMode === "deliver"
            ? "announce"
            : undefined;

  const deliveryChannel = normalizeChannel(
    (delivery as { channel?: unknown } | undefined)?.channel,
  );
<<<<<<< HEAD
  const deliveryTo = normalizeTo((delivery as { to?: unknown } | undefined)?.to);
  const deliveryThreadId = normalizeThreadId(
    (delivery as { threadId?: unknown } | undefined)?.threadId,
  );
  const channel = deliveryChannel ?? "last";
  const to = deliveryTo;
  const deliveryAccountId = normalizeAccountId(
=======
  const deliveryTo = normalizeOptionalString((delivery as { to?: unknown } | undefined)?.to);
  const deliveryThreadId = normalizeOptionalThreadValue(
    (delivery as { threadId?: unknown } | undefined)?.threadId,
  );
  const to = deliveryTo;
  const deliveryAccountId = normalizeOptionalString(
>>>>>>> upstream/main
    (delivery as { accountId?: unknown } | undefined)?.accountId,
  );
  if (hasDelivery) {
    const resolvedMode = mode ?? "announce";
<<<<<<< HEAD
    return {
      mode: resolvedMode,
      channel: resolvedMode === "announce" ? channel : undefined,
      to,
      threadId: resolvedMode === "announce" ? deliveryThreadId : undefined,
=======
    const channel =
      resolvedMode === "announce"
        ? resolveAnnounceChannel({ channel: deliveryChannel, to })
        : deliveryChannel;
    return {
      mode: resolvedMode,
      channel: resolvedMode === "webhook" ? undefined : channel,
      to,
      threadId: resolvedMode === "webhook" ? undefined : deliveryThreadId,
>>>>>>> upstream/main
      accountId: deliveryAccountId,
      source: "delivery",
      requested: resolvedMode === "announce",
    };
  }

<<<<<<< HEAD
  const isIsolatedAgentTurn =
    job.payload.kind === "agentTurn" &&
    (job.sessionTarget === "isolated" ||
      job.sessionTarget === "current" ||
      job.sessionTarget.startsWith("session:"));
  const resolvedMode = isIsolatedAgentTurn ? "announce" : "none";
=======
  const isDetachedOutputJob =
    (job.payload.kind === "agentTurn" || job.payload.kind === "command") &&
    typeof job.sessionTarget === "string" &&
    (job.sessionTarget === "isolated" ||
      job.sessionTarget === "current" ||
      job.sessionTarget.startsWith("session:"));
  // Isolated/current/session output jobs default to announce delivery so their
  // result reaches the initiating session unless the job opts out.
  const resolvedMode = isDetachedOutputJob ? "announce" : "none";
>>>>>>> upstream/main

  return {
    mode: resolvedMode,
    channel: resolvedMode === "announce" ? "last" : undefined,
    to: undefined,
    threadId: undefined,
    source: "delivery",
    requested: resolvedMode === "announce",
  };
}

<<<<<<< HEAD
=======
/** Normalized destination for notifying about cron execution failures. */
>>>>>>> upstream/main
export type CronFailureDeliveryPlan = {
  mode: "announce" | "webhook";
  channel?: CronMessageChannel;
  to?: string;
  accountId?: string;
};

<<<<<<< HEAD
=======
/** Job-level failure destination override fields before global defaults are merged. */
>>>>>>> upstream/main
export type CronFailureDestinationInput = {
  channel?: CronMessageChannel;
  to?: string;
  accountId?: string;
  mode?: "announce" | "webhook";
};

function normalizeFailureMode(value: unknown): "announce" | "webhook" | undefined {
<<<<<<< HEAD
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim().toLowerCase();
=======
  const trimmed = normalizeOptionalLowercaseString(value);
>>>>>>> upstream/main
  if (trimmed === "announce" || trimmed === "webhook") {
    return trimmed;
  }
  return undefined;
}

<<<<<<< HEAD
=======
/** Resolves job-level failure notification routing layered over global defaults. */
>>>>>>> upstream/main
export function resolveFailureDestination(
  job: CronJob,
  globalConfig?: CronFailureDestinationConfig,
): CronFailureDeliveryPlan | null {
  const delivery = job.delivery;
  const jobFailureDest = delivery?.failureDestination as CronFailureDestinationInput | undefined;
  const hasJobFailureDest = jobFailureDest && typeof jobFailureDest === "object";

  let channel: CronMessageChannel | undefined;
  let to: string | undefined;
  let accountId: string | undefined;
  let mode: "announce" | "webhook" | undefined;

  if (globalConfig) {
    channel = normalizeChannel(globalConfig.channel);
<<<<<<< HEAD
    to = normalizeTo(globalConfig.to);
    accountId = normalizeAccountId(globalConfig.accountId);
=======
    to = normalizeOptionalString(globalConfig.to);
    accountId = normalizeOptionalString(globalConfig.accountId);
>>>>>>> upstream/main
    mode = normalizeFailureMode(globalConfig.mode);
  }

  if (hasJobFailureDest) {
    const jobChannel = normalizeChannel(jobFailureDest.channel);
<<<<<<< HEAD
    const jobTo = normalizeTo(jobFailureDest.to);
    const jobAccountId = normalizeAccountId(jobFailureDest.accountId);
=======
    const jobTo = normalizeOptionalString(jobFailureDest.to);
    const jobAccountId = normalizeOptionalString(jobFailureDest.accountId);
>>>>>>> upstream/main
    const jobMode = normalizeFailureMode(jobFailureDest.mode);
    const hasJobChannelField = "channel" in jobFailureDest;
    const hasJobToField = "to" in jobFailureDest;
    const hasJobAccountIdField = "accountId" in jobFailureDest;
<<<<<<< HEAD
=======
    const hasJobModeField = "mode" in jobFailureDest;
>>>>>>> upstream/main

    const jobToExplicitValue = hasJobToField && jobTo !== undefined;

    if (hasJobChannelField) {
      channel = jobChannel;
    }
    if (hasJobToField) {
      to = jobTo;
    }
    if (hasJobAccountIdField) {
      accountId = jobAccountId;
    }
<<<<<<< HEAD
    if (jobMode !== undefined) {
      const globalMode = globalConfig?.mode ?? "announce";
      if (!jobToExplicitValue && globalMode !== jobMode) {
=======
    if (hasJobModeField) {
      const globalMode = globalConfig?.mode ?? "announce";
      const resolvedJobMode = jobMode ?? "announce";
      if (!jobToExplicitValue && globalMode !== resolvedJobMode) {
        // Do not carry an inherited target across modes; an announce chat is not a webhook URL.
>>>>>>> upstream/main
        to = undefined;
      }
      mode = jobMode;
    }
  }

  if (!channel && !to && !accountId && !mode) {
    return null;
  }

  const resolvedMode = mode ?? "announce";
  if (resolvedMode === "webhook" && !to) {
<<<<<<< HEAD
=======
    // Webhook failure destinations are only useful with a concrete URL/target.
>>>>>>> upstream/main
    return null;
  }

  const result: CronFailureDeliveryPlan = {
    mode: resolvedMode,
<<<<<<< HEAD
    channel: resolvedMode === "announce" ? (channel ?? "last") : undefined,
=======
    channel: resolvedMode === "announce" ? resolveAnnounceChannel({ channel, to }) : undefined,
>>>>>>> upstream/main
    to,
    accountId,
  };

  if (delivery && isSameDeliveryTarget(delivery, result)) {
<<<<<<< HEAD
=======
    // Avoid sending the same failure text through the primary delivery route twice.
>>>>>>> upstream/main
    return null;
  }

  return result;
}

function isSameDeliveryTarget(
  delivery: CronDelivery,
  failurePlan: CronFailureDeliveryPlan,
): boolean {
  const primaryMode = delivery.mode ?? "announce";
  if (primaryMode === "none") {
    return false;
  }

<<<<<<< HEAD
  const primaryChannel = delivery.channel;
  const primaryTo = delivery.to;
  const primaryAccountId = delivery.accountId;
=======
  const primaryTo = normalizeOptionalString(delivery.to);
  const primaryAccountId = normalizeOptionalString(delivery.accountId);
>>>>>>> upstream/main

  if (failurePlan.mode === "webhook") {
    return primaryMode === "webhook" && primaryTo === failurePlan.to;
  }

<<<<<<< HEAD
  const primaryChannelNormalized = primaryChannel ?? "last";
=======
  const primaryChannelNormalized = resolveAnnounceChannel({
    channel: normalizeChannel(delivery.channel),
    to: primaryTo,
  });
>>>>>>> upstream/main
  const failureChannelNormalized = failurePlan.channel ?? "last";

  return (
    failureChannelNormalized === primaryChannelNormalized &&
    failurePlan.to === primaryTo &&
    failurePlan.accountId === primaryAccountId
  );
}
