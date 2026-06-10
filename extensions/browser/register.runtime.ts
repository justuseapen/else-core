<<<<<<< HEAD
export { createBrowserTool } from "./src/browser-tool.js";
export { registerBrowserCli } from "./src/cli/browser-cli.js";
=======
/**
 * Browser runtime registration barrel. Node host commands and plugin
 * registration lazy-load these exports when browser runtime behavior is needed.
 */
export { createBrowserTool } from "./src/browser-tool.js";
>>>>>>> upstream/main
export { handleBrowserGatewayRequest } from "./src/gateway/browser-request.js";
export { runBrowserProxyCommand } from "./src/node-host/invoke-browser.js";
export { createBrowserPluginService } from "./src/plugin-service.js";
export { collectBrowserSecurityAuditFindings } from "./src/security-audit.js";
