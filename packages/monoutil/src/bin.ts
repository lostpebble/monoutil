import { Command, InvalidArgumentError } from "commander";
import { match } from "ts-pattern";
import {
  EMonoutilId,
  EUniformRequestType,
  IUtilRequest_TsRemoveEmittedWithSource,
  IUtilRequest_Why,
  TUtilRequest,
  TUtilRequest_UniformUpdate,
} from "./monoutil.types";
import {
  castString,
  notNullEmpty,
  nullEmpty,
} from "./utils/_internal/javascript_type_utils/string.utils";

const program = new Command();

program.name("monoutil").description("CLI for diverse monorepo utils");

let utilRequest: TUtilRequest | undefined;

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
    utilRequest = {
      id: EMonoutilId.why,
      module,
    } satisfies IUtilRequest_Why;
  });

program
  .command("ts_remove_emitted")
  .description("Removes all emitted TypeScript files without deleting the source files")
  .action(async (module) => {
    utilRequest = {
      id: EMonoutilId.ts_remove_emitted,
    } satisfies IUtilRequest_TsRemoveEmittedWithSource;
  });

program
  .command("uniform_update")
  .option("--config [filepath]", "Path to the config file")
  .option("--module [module]", "The dependency module to update in the monorepo")
  .option("--version [version]", "The version to set for the dependency in the monorepo")
  .action(async (command, options) => {
    const config = castString(command.config);
    const module = castString(command.module);
    const version = castString(command.version);

    if (notNullEmpty(module) || notNullEmpty(version)) {
      utilRequest = {
        id: EMonoutilId.uniform_update,
        requestType: EUniformRequestType.direct,
        module,
        version,
      } satisfies TUtilRequest_UniformUpdate;
    } else {
      utilRequest = {
        id: EMonoutilId.uniform_update,
        requestType: EUniformRequestType.config,
        configFilePath: config,
      } satisfies TUtilRequest_UniformUpdate;
    }
  });

await program.parseAsync(process.argv);

if (utilRequest != null) {
  const runUtilFunc = match<TUtilRequest, () => Promise<void>>(utilRequest)
    .with(
      {
        id: EMonoutilId.why,
      },
      (request) => async () => {
        const { why } = await import("./utils/why/why");
        await why(request.module);
      },
    )
    .with(
      {
        id: EMonoutilId.ts_remove_emitted,
      },
      (request) => async () => {
        const { tsRemoveEmittedFromSource } = await import(
          "./utils/ts_remove_emitted/ts_remove_emitted.func"
        );
        await tsRemoveEmittedFromSource();
      },
    )
    .with(
      {
        id: EMonoutilId.uniform_update,
      },
      (request) => async () => {
        const { uniformUpdate, getUniformUpdateConfig } = await import(
          "./utils/uniform_update/uniform_update.func"
        );

        if (request.requestType === EUniformRequestType.config) {
          const config = await getUniformUpdateConfig(request.configFilePath);
          await uniformUpdate(config);
        } else {
          const { module, version } = request;

          if (nullEmpty(module) || nullEmpty(version)) {
            throw new InvalidArgumentError(
              `The version cannot be empty. (required usage): monoutil uniform_update --module "module-name" --version "version-to-set"`,
            );
          }

          await uniformUpdate({
            targetVersions: [
              {
                version: version,
                dependencies: [module],
              },
            ],
          });
        }
      },
    )
    .exhaustive();

  try {
    await runUtilFunc();
  } catch (e) {
    console.error(e);
  }
}
