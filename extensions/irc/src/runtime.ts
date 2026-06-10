// Irc plugin module implements runtime behavior.
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import type { PluginRuntime } from "./runtime-api.js";

const {
  setRuntime: setIrcRuntime,
  clearRuntime: clearStoredIrcRuntime,
  getRuntime: getIrcRuntime,
} = createPluginRuntimeStore<PluginRuntime>({
  pluginId: "irc",
  errorMessage: "IRC runtime not initialized",
});
export { getIrcRuntime, setIrcRuntime };
export function clearIrcRuntime() {
<<<<<<< HEAD
  setIrcRuntime(undefined as unknown as PluginRuntime);
=======
  clearStoredIrcRuntime();
>>>>>>> upstream/main
}
