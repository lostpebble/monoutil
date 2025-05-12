import { EMonoutilId } from "../../monoutil.types";
import { readJsonFile } from "../_internal/monoutil_internal/files";
import { createLogger } from "../_internal/monoutil_internal/logging";
import { getMonorepoProjectPackageJsonFilePaths } from "../_internal/monoutil_internal/package_json/funcs/getMonorepoProjectPackageJsonFilePaths";
import { TUniformUpdateConfig, zUniformUpdateConfig } from "./uniform_update.zod";

const uniformLogger = createLogger(EMonoutilId.uniform_update);

function updateDependencyObject(
  dependencies: Record<string, string>,
  depsToUpdate: string[],
  newVersion: string,
): Record<string, string> {
  for (const [depName] of Object.entries(dependencies)) {
    if (depsToUpdate.includes(depName)) {
      dependencies[depName] = newVersion;
    }
  }

  return dependencies;
}

export async function getUniformUpdateConfig(
  configFilePath?: string,
): Promise<TUniformUpdateConfig> {
  const filePath = configFilePath ?? "./monoutil/uniform_update.config.json";
  uniformLogger.info(`Loading config from ${filePath}`);

  const configJson = await readJsonFile(filePath, "uniform update config");

  return zUniformUpdateConfig.parse(configJson);
}

export async function uniformUpdate(config: TUniformUpdateConfig): Promise<void> {
  uniformLogger.info("Running with config", config);

  const monorepoPackages = await getMonorepoProjectPackageJsonFilePaths();

  uniformLogger.info(
    `Found ${monorepoPackages.length} package.json files in monorepo:\n  - ${monorepoPackages.join("\n  - ")}`,
  );

  if (config.targetVersions) {
    for (const targetVersion of config.targetVersions) {
      // console.log(`Updating to version: ${config.targetVersions}`);
      uniformLogger.info(
        `Updating to version: "${targetVersion.version}" for deps:\n  - ${targetVersion.dependencies.join("\n  - ")}`,
      );
    }
  }
}
