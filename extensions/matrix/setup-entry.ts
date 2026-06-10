<<<<<<< HEAD
=======
// Matrix plugin module implements setup entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./channel-plugin-api.js",
    exportName: "matrixPlugin",
=======
    specifier: "./setup-plugin-api.js",
    exportName: "matrixSetupPlugin",
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
  runtime: {
    specifier: "./runtime-setter-api.js",
    exportName: "setMatrixRuntime",
>>>>>>> upstream/main
  },
});
