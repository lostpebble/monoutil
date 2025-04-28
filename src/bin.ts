import { Command, InvalidArgumentError } from "commander";
import { nullEmpty } from "./utils/_internal/javascript_type_utils/string.utils";

const program = new Command();

program.name("monorepo-utils").description("CLI for diverse monorepo utils");

program
  .command("why")
  .description(
    "See all usages of a package in the monorepo, including all their installed versions and dependants",
  )
  .argument("<module>", "The package to inspect", (value) => {
    if (nullEmpty(value)) {
      throw new InvalidArgumentError("The package name cannot be empty");
    }

    return value;
  })
  .action(async (module) => {
    const { why } = await import("./utils/why/why");
    await why(module);
  });

program.parse(process.argv);
