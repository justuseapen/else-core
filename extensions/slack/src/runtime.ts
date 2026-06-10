<<<<<<< HEAD
=======
// Slack plugin module implements runtime behavior.
>>>>>>> upstream/main
import type { PluginRuntime } from "openclaw/plugin-sdk/channel-core";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";

type SlackChannelRuntime = {
  handleSlackAction?: typeof import("./action-runtime.js").handleSlackAction;
};

<<<<<<< HEAD
export type SlackRuntime = PluginRuntime & {
=======
type SlackRuntime = PluginRuntime & {
>>>>>>> upstream/main
  channel: PluginRuntime["channel"] & {
    slack?: SlackChannelRuntime;
  };
};

const {
  setRuntime: setSlackRuntime,
  clearRuntime: clearSlackRuntime,
  tryGetRuntime: getOptionalSlackRuntime,
<<<<<<< HEAD
  getRuntime: getSlackRuntime,
} = createPluginRuntimeStore<SlackRuntime>("Slack runtime not initialized");
export { clearSlackRuntime, getOptionalSlackRuntime, getSlackRuntime, setSlackRuntime };
=======
} = createPluginRuntimeStore<SlackRuntime>({
  pluginId: "slack",
  errorMessage: "Slack runtime not initialized",
});
export { clearSlackRuntime, getOptionalSlackRuntime, setSlackRuntime };
>>>>>>> upstream/main
