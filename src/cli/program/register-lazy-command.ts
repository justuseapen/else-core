<<<<<<< HEAD
import type { Command } from "commander";
import { reparseProgramFromActionArgs } from "./action-reparse.js";
import { removeCommandByName } from "./command-tree.js";
=======
// Lazy Commander placeholder registration used to keep CLI startup imports small.
import type { Command } from "commander";
import { reparseProgramFromActionArgs } from "./action-reparse.js";
import { removeCommandByName } from "./command-tree.js";
import { resolveCommandOptionArgs } from "./helpers.js";
>>>>>>> upstream/main

type RegisterLazyCommandParams = {
  program: Command;
  name: string;
  description: string;
<<<<<<< HEAD
=======
  options?: readonly {
    flags: string;
    description: string;
  }[];
>>>>>>> upstream/main
  removeNames?: string[];
  register: () => Promise<void> | void;
};

<<<<<<< HEAD
=======
/** Register a placeholder that loads the real command and reparses the original invocation. */
>>>>>>> upstream/main
export function registerLazyCommand({
  program,
  name,
  description,
<<<<<<< HEAD
=======
  options,
>>>>>>> upstream/main
  removeNames,
  register,
}: RegisterLazyCommandParams): void {
  const placeholder = program.command(name).description(description);
<<<<<<< HEAD
  placeholder.allowUnknownOption(true);
  placeholder.allowExcessArguments(true);
  placeholder.action(async (...actionArgs) => {
=======
  for (const option of options ?? []) {
    placeholder.option(option.flags, option.description);
  }
  placeholder.allowUnknownOption(true);
  placeholder.allowExcessArguments(true);
  placeholder.action(async (...actionArgs) => {
    const actionCommand = actionArgs.at(-1) as (Command & { args?: string[] }) | undefined;
    if (actionCommand) {
      // Commander separates option values from positional args on placeholders; restore them
      // before reparsing so the real command sees the original token order.
      actionCommand.args = [
        ...resolveCommandOptionArgs(actionCommand),
        ...(actionCommand.args ?? []),
      ];
    }
>>>>>>> upstream/main
    for (const commandName of new Set(removeNames ?? [name])) {
      removeCommandByName(program, commandName);
    }
    await register();
    await reparseProgramFromActionArgs(program, actionArgs);
  });
}
