<<<<<<< HEAD
=======
// Qa Channel plugin module implements runtime behavior.
>>>>>>> upstream/main
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import type { PluginRuntime } from "./runtime-api.js";

const { setRuntime: setQaChannelRuntime, getRuntime: getQaChannelRuntime } =
<<<<<<< HEAD
  createPluginRuntimeStore<PluginRuntime>("QA channel runtime not initialized");
=======
  createPluginRuntimeStore<PluginRuntime>({
    pluginId: "qa-channel",
    errorMessage: "QA channel runtime not initialized",
  });
>>>>>>> upstream/main

export { getQaChannelRuntime, setQaChannelRuntime };
