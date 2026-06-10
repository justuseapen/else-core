<<<<<<< HEAD
=======
// Internal event discriminants shared by runtime event producers and prompt
// formatters. Keep values stable because they cross agent runtime boundaries.
>>>>>>> upstream/main
export const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion" as const;

export const AGENT_INTERNAL_EVENT_SOURCES = [
  "subagent",
  "cron",
<<<<<<< HEAD
=======
  "image_generation",
>>>>>>> upstream/main
  "video_generation",
  "music_generation",
] as const;

export const AGENT_INTERNAL_EVENT_STATUSES = ["ok", "timeout", "error", "unknown"] as const;

<<<<<<< HEAD
export type AgentInternalEventType = typeof AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION;
=======
>>>>>>> upstream/main
export type AgentInternalEventSource = (typeof AGENT_INTERNAL_EVENT_SOURCES)[number];
export type AgentInternalEventStatus = (typeof AGENT_INTERNAL_EVENT_STATUSES)[number];
