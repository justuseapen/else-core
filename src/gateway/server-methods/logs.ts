<<<<<<< HEAD
import { readConfiguredLogTail } from "../../logging/log-tail.js";
=======
// Logs gateway methods expose bounded tails from the configured gateway log.
>>>>>>> upstream/main
import {
  ErrorCodes,
  errorShape,
  formatValidationErrors,
  validateLogsTailParams,
} from "../../../packages/gateway-protocol/src/index.js";
import { readConfiguredLogTail } from "../../logging/log-tail.js";
import type { GatewayRequestHandlers } from "./types.js";

<<<<<<< HEAD
=======
/** Gateway handler for bounded reads from the configured gateway log. */
>>>>>>> upstream/main
export const logsHandlers: GatewayRequestHandlers = {
  "logs.tail": async ({ params, respond }) => {
    if (!validateLogsTailParams(params)) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid logs.tail params: ${formatValidationErrors(validateLogsTailParams.errors)}`,
        ),
      );
      return;
    }

    const p = params as { cursor?: number; limit?: number; maxBytes?: number };
    try {
<<<<<<< HEAD
=======
      // The log-tail reader enforces cursor/byte limits and source selection;
      // the handler only maps protocol params and failure shape.
>>>>>>> upstream/main
      const result = await readConfiguredLogTail({
        cursor: p.cursor,
        limit: p.limit,
        maxBytes: p.maxBytes,
      });
      respond(true, result, undefined);
    } catch (err) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`),
      );
    }
  },
};
