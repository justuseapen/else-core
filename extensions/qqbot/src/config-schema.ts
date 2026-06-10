<<<<<<< HEAD
import {
  AllowFromListSchema,
=======
// Qqbot helper module supports config schema behavior.
import {
  AllowFromListSchema,
  ToolPolicySchema,
>>>>>>> upstream/main
  buildChannelConfigSchema,
} from "openclaw/plugin-sdk/channel-config-schema";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { z } from "zod";

const AudioFormatPolicySchema = z
  .object({
    sttDirectFormats: z.array(z.string()).optional(),
    uploadDirectFormats: z.array(z.string()).optional(),
    transcodeEnabled: z.boolean().optional(),
  })
  .optional();

<<<<<<< HEAD
const QQBotSpeechQueryParamsSchema = z.record(z.string(), z.string()).optional();

const QQBotTtsSchema = z
  .object({
    enabled: z.boolean().optional(),
    provider: z.string().optional(),
    baseUrl: z.string().optional(),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    voice: z.string().optional(),
    authStyle: z.enum(["bearer", "api-key"]).optional(),
    queryParams: QQBotSpeechQueryParamsSchema,
    speed: z.number().optional(),
  })
  .strict()
  .optional();

=======
>>>>>>> upstream/main
const QQBotSttSchema = z
  .object({
    enabled: z.boolean().optional(),
    provider: z.string().optional(),
    baseUrl: z.string().optional(),
    apiKey: z.string().optional(),
    model: z.string().optional(),
  })
  .strict()
  .optional();

<<<<<<< HEAD
=======
/** When `true`, same as `mode: "partial"` and `c2cStreamApi: true` for C2C. Object form kept for legacy configs. */
const QQBotStreamingSchema = z
  .union([
    z.boolean(),
    z
      .object({
        /** "partial" (default) enables block streaming; "off" disables it. */
        mode: z.enum(["off", "partial"]).default("partial"),
        /** @deprecated Prefer `streaming: true`. */
        c2cStreamApi: z.boolean().optional(),
      })
      .passthrough(),
  ])
  .optional();

const QQBotExecApprovalsSchema = z
  .object({
    enabled: z.union([z.boolean(), z.literal("auto")]).optional(),
    approvers: z.array(z.string()).optional(),
    agentFilter: z.array(z.string()).optional(),
    sessionFilter: z.array(z.string()).optional(),
    target: z.enum(["dm", "channel", "both"]).optional(),
  })
  .strict()
  .optional();

const QQBotDmPolicySchema = z.enum(["open", "allowlist", "disabled"]).optional();
const QQBotGroupPolicySchema = z.enum(["open", "allowlist", "disabled"]).optional();

const QQBotGroupSchema = z
  .object({
    requireMention: z.boolean().optional(),
    ignoreOtherMentions: z.boolean().optional(),
    historyLimit: z.number().optional(),
    name: z.string().optional(),
    prompt: z.string().optional(),
    tools: ToolPolicySchema,
    toolsBySender: z.record(z.string(), ToolPolicySchema).optional(),
  })
  .strict();

const QQBotGroupsSchema = z.record(z.string(), QQBotGroupSchema).optional();

>>>>>>> upstream/main
const QQBotAccountSchema = z
  .object({
    enabled: z.boolean().optional(),
    name: z.string().optional(),
    appId: z.string().optional(),
    clientSecret: buildSecretInputSchema().optional(),
    clientSecretFile: z.string().optional(),
    allowFrom: AllowFromListSchema,
<<<<<<< HEAD
=======
    groupAllowFrom: AllowFromListSchema,
    dmPolicy: QQBotDmPolicySchema,
    groupPolicy: QQBotGroupPolicySchema,
>>>>>>> upstream/main
    systemPrompt: z.string().optional(),
    markdownSupport: z.boolean().optional(),
    voiceDirectUploadFormats: z.array(z.string()).optional(),
    audioFormatPolicy: AudioFormatPolicySchema,
    urlDirectUpload: z.boolean().optional(),
    upgradeUrl: z.string().optional(),
    upgradeMode: z.enum(["doc", "hot-reload"]).optional(),
<<<<<<< HEAD
  })
  .strict();

export const QQBotConfigSchema = QQBotAccountSchema.extend({
  tts: QQBotTtsSchema,
  stt: QQBotSttSchema,
  accounts: z.object({}).catchall(QQBotAccountSchema).optional(),
  defaultAccount: z.string().optional(),
});
=======
    streaming: QQBotStreamingSchema,
    execApprovals: QQBotExecApprovalsSchema,
    groups: QQBotGroupsSchema,
  })
  .passthrough();

export const QQBotConfigSchema = QQBotAccountSchema.extend({
  stt: QQBotSttSchema,
  accounts: z.object({}).catchall(QQBotAccountSchema.passthrough()).optional(),
  defaultAccount: z.string().optional(),
}).passthrough();
>>>>>>> upstream/main
export const qqbotChannelConfigSchema = buildChannelConfigSchema(QQBotConfigSchema);
