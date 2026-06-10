<<<<<<< HEAD
/** Root OpenClaw configuration Zod schema — the full `openclaw.json` shape. */
export { OpenClawSchema } from "../config/zod-schema.js";
=======
/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Plugin authors should define plugin-local schemas instead of depending on the
 * full root OpenClaw config schema.
 */
export { OpenClawSchema } from "../config/zod-schema.js";
export { validateJsonSchemaValue } from "../plugins/schema-validator.js";
export type { JsonSchemaObject } from "../shared/json-schema.types.js";
>>>>>>> upstream/main
