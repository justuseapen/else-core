<<<<<<< HEAD
=======
// Discord plugin module implements session contract behavior.
>>>>>>> upstream/main
export function deriveLegacySessionChatType(sessionKey: string): "channel" | undefined {
  return /^discord:(?:[^:]+:)?guild-[^:]+:channel-[^:]+$/.test(sessionKey) ? "channel" : undefined;
}
