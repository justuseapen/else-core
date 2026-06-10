<<<<<<< HEAD
import { logVerbose } from "../../globals.js";
import { resolveSendPolicy } from "../../sessions/send-policy.js";
import { shouldHandleTextCommands } from "../commands-registry.js";
import { emitResetCommandHooks } from "./commands-reset-hooks.js";
=======
// Dispatches chat commands to registered handlers and formats their results.
import { createLazyImportLoader } from "../../shared/lazy-promise.js";
import { shouldHandleTextCommands } from "../commands-registry.js";
>>>>>>> upstream/main
import { maybeHandleResetCommand } from "./commands-reset.js";
import type {
  CommandHandler,
  CommandHandlerResult,
  HandleCommandsParams,
} from "./commands-types.js";
<<<<<<< HEAD
export { emitResetCommandHooks } from "./commands-reset-hooks.js";
let commandHandlersRuntimePromise: Promise<typeof import("./commands-handlers.runtime.js")> | null =
  null;
=======
const commandHandlersRuntimeLoader = createLazyImportLoader(
  () => import("./commands-handlers.runtime.js"),
);
>>>>>>> upstream/main

function loadCommandHandlersRuntime() {
  return commandHandlersRuntimeLoader.load();
}

let HANDLERS: CommandHandler[] | null = null;

<<<<<<< HEAD
=======
function normalizeCommandHandlerResult(result: CommandHandlerResult): CommandHandlerResult {
  if (!result.reply) {
    return result;
  }
  return {
    ...result,
    reply: {
      ...result.reply,
      replyToId: undefined,
      replyToCurrent: false,
    },
  };
}

>>>>>>> upstream/main
export async function handleCommands(params: HandleCommandsParams): Promise<CommandHandlerResult> {
  if (HANDLERS === null) {
    HANDLERS = (await loadCommandHandlersRuntime()).loadCommandHandlers();
  }
  const resetResult = await maybeHandleResetCommand(params);
  if (resetResult) {
<<<<<<< HEAD
    return resetResult;
=======
    return normalizeCommandHandlerResult(resetResult);
>>>>>>> upstream/main
  }

  const allowTextCommands = shouldHandleTextCommands({
    cfg: params.cfg,
    surface: params.command.surface,
    commandSource: params.ctx.CommandSource,
  });

  for (const handler of HANDLERS) {
    const result = await handler(params, allowTextCommands);
    if (result) {
      return normalizeCommandHandlerResult(result);
    }
  }

  // sendPolicy "deny" is now handled downstream in dispatch-from-config.ts
  // by suppressing outbound delivery while still allowing the agent to process
  // the inbound message (context, memory, tool calls). See #53328.
  return { shouldContinue: true };
}
