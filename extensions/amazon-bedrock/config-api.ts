<<<<<<< HEAD
// Narrow barrel for config compatibility helpers consumed outside the plugin.
// Keep this separate from runtime exports so doctor/config code stays lightweight.

=======
/**
 * Narrow config compatibility barrel for Amazon Bedrock. Doctor/config code can
 * import this without loading runtime provider dependencies.
 */
>>>>>>> upstream/main
export { migrateAmazonBedrockLegacyConfig } from "./config-compat.js";
