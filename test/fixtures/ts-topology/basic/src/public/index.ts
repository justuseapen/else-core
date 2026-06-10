<<<<<<< HEAD
=======
// TS topology public fixture barrel re-exports public SDK members.
>>>>>>> upstream/main
export {
  aliasedThing,
  sharedThing,
  singleOwnerHelper,
  testOnlyThing,
  unusedThing,
} from "../lib/shared.js";
export { sharedThing as aliasedSharedThing } from "../lib/shared.js";
export type { SharedType } from "../lib/shared.js";
