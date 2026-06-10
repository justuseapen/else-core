<<<<<<< HEAD
export { zaloPlugin } from "./src/channel.js";
export * from "./setup-api.js";
=======
// Zalo API module exposes the plugin public contract.
export { zaloPlugin } from "./src/channel.js";
export {
  createZaloSetupWizardProxy,
  resolveZaloRuntimeGroupPolicy,
  zaloDmPolicy,
  zaloSetupAdapter,
  zaloSetupWizard,
} from "./setup-api.js";
>>>>>>> upstream/main
