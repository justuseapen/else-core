<<<<<<< HEAD
=======
// OpenClaw root resolution imports fs through this facade so tests can replace
// filesystem behavior without mocking node:fs globally.
>>>>>>> upstream/main
export { default as openClawRootFsSync } from "node:fs";
export { default as openClawRootFs } from "node:fs/promises";
