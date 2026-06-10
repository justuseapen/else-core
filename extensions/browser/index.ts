/**
 * Browser plugin entry. It wires the browser tool, gateway request handler,
 * node-host command, services, reload policy, and security audit collectors.
 */
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import {
<<<<<<< HEAD
  definePluginEntry,
  type OpenClawPluginToolContext,
  type OpenClawPluginToolFactory,
} from "openclaw/plugin-sdk/plugin-entry";
import {
  collectBrowserSecurityAuditFindings,
  createBrowserPluginService,
  createBrowserTool,
  handleBrowserGatewayRequest,
  registerBrowserCli,
  runBrowserProxyCommand,
} from "./register.runtime.js";
=======
  browserPluginNodeHostCommands,
  browserPluginReload,
  browserSecurityAuditCollectors,
  registerBrowserPlugin,
} from "./plugin-registration.js";
>>>>>>> upstream/main

/** Main Browser plugin entry for runtime registration. */
export default definePluginEntry({
  id: "browser",
  name: "Browser",
  description: "Default browser tool plugin",
<<<<<<< HEAD
  reload: { restartPrefixes: ["browser"] },
  nodeHostCommands: [
    {
      command: "browser.proxy",
      cap: "browser",
      handle: runBrowserProxyCommand,
    },
  ],
  securityAuditCollectors: [collectBrowserSecurityAuditFindings],
  register(api) {
    api.registerTool(((ctx: OpenClawPluginToolContext) =>
      createBrowserTool({
        sandboxBridgeUrl: ctx.browser?.sandboxBridgeUrl,
        allowHostControl: ctx.browser?.allowHostControl,
        agentSessionKey: ctx.sessionKey,
      })) as OpenClawPluginToolFactory);
    api.registerCli(({ program }) => registerBrowserCli(program), { commands: ["browser"] });
    api.registerGatewayMethod("browser.request", handleBrowserGatewayRequest, {
      scope: "operator.write",
    });
    api.registerService(createBrowserPluginService());
  },
=======
  reload: browserPluginReload,
  nodeHostCommands: browserPluginNodeHostCommands,
  securityAuditCollectors: [...browserSecurityAuditCollectors],
  register: registerBrowserPlugin,
>>>>>>> upstream/main
});
