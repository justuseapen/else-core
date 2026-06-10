/**
 * Public Bash/process tool barrel.
 * Implementation lives in focused exec, process, schema, and description
 * modules to keep host policy seams local.
 */
export type {
  BashSandboxConfig,
  ExecElevatedDefaults,
  ExecToolDefaults,
  ExecToolDetails,
} from "./bash-tools.exec.js";
<<<<<<< HEAD
export { createExecTool, describeExecTool, execTool } from "./bash-tools.exec.js";
=======
export { describeExecTool, describeProcessTool } from "./bash-tools.descriptions.js";
export { createExecTool, execTool } from "./bash-tools.exec.js";
>>>>>>> upstream/main
export type { ProcessToolDefaults } from "./bash-tools.process.js";
export { createProcessTool, describeProcessTool, processTool } from "./bash-tools.process.js";
