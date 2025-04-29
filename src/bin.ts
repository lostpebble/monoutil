import { Command, InvalidArgumentError } from "commander";
import { match } from "ts-pattern";
import {
  EMonoutilId,
  EUniformRequestType,
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
/*.action(async (module) => {
    const { why } = await import("./utils/why/why");
    await why(module);
  });*/

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
        config,
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
        id: EMonoutilId.uniform_update,
      },
      (request) => async () => {
        const { uniformUpdate, getUniformUpdateConfig } = await import(
          "./utils/uniform_update/uniform_update.func"
        );

        if (request.requestType === EUniformRequestType.config) {
          const config = await getUniformUpdateConfig(request.config);
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
    const resp = await runUtilFunc();
    console.log("Response", resp);
  } catch (e) {
    console.error(e);
  }
}

// program
//   .command("uniform_update")
//   .description("Update monorepo packages to the same version uniformly")
//   .option("--config [config]", "Path to the config file", async (configFileLocation) => {
//     return await getUniformUpdateConfig();
//   });

// .addOption(
//   new Option("--module <module>", "The dependency module to update in the monorepo").implies([
//     "version",
//   ]),
// )
// .addOption(
//   new Option(
//     "--version <version>",
//     "The version to set it to in the monorepo project modules",
//   ).implies(["module"]),
// );

/*program
  .command("uniform_update")
  .description("Update monorepo packages to the same version uniformly")
  .option(
    "--module <module> <version>",
    "The dependency module to update and the version to set it to in the monorepo project modules",
  )
  .action(async (module?: string, version?: string) => {
    const { uniformUpdate, getUniformUpdateConfig } = await import(
      "./utils/uniform_update/uniform_update.func"
    );
    let config: IUniformUpdateConfig;

    if (nullEmpty(module) && nullEmpty(version)) {
      console.log("Getting uniform update config");
      config = await getUniformUpdateConfig();
      console.log("Getting uniform update config", config);
    } else {
      if (nullEmpty(module) || nullEmpty(version)) {
        throw new InvalidArgumentError(`The version cannot be empty. (required usage):
monoutil uniform_update "module-name" "version-to-set"`);
      }

      config = {
        targetVersions: [
          {
            version,
            dependencies: [module],
          },
        ],
      };
    }

    await uniformUpdate(config);
  });*/

// program.parse(process.argv);
