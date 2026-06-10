<<<<<<< HEAD
export * from "./runtime-api.js";
=======
// Nostr API module exposes the plugin public contract.
export {
  getPluginRuntimeGatewayRequestScope,
  type OpenClawConfig,
  type PluginRuntime,
} from "./runtime-api.js";
>>>>>>> upstream/main
export { nostrPlugin } from "./src/channel.js";
export { createNostrProfileHttpHandler } from "./src/nostr-profile-http.js";
export { getNostrRuntime, setNostrRuntime } from "./src/runtime.js";
export { resolveNostrAccount } from "./src/types.js";
<<<<<<< HEAD
=======
export type { ResolvedNostrAccount } from "./src/types.js";
>>>>>>> upstream/main
