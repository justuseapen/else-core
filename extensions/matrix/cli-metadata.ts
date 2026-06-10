<<<<<<< HEAD
import { definePluginEntry } from "openclaw/plugin-sdk/core";
=======
// Matrix plugin module implements cli metadata behavior.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
>>>>>>> upstream/main
import { registerMatrixCliMetadata } from "./src/cli-metadata.js";

export { registerMatrixCliMetadata } from "./src/cli-metadata.js";

export default definePluginEntry({
  id: "matrix",
  name: "Matrix",
  description: "Matrix channel plugin (matrix-js-sdk)",
  register: registerMatrixCliMetadata,
});
