import { EMonoutilId } from "../../monoutil.types";
import { readJsonFile } from "../_internal/monoutil_internal/files";
import { createLogger } from "../_internal/monoutil_internal/logging";
import { getMonorepoProjectPackageJsonFilePaths } from "../_internal/monoutil_internal/monorepo";
import { IUniformUpdateConfig } from "./uniform_update.types";

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
): Promise<IUniformUpdateConfig> {
  const filePath = configFilePath ?? "./monoutil/uniform_update.config.json";
  uniformLogger.info(`Loading config from ${filePath}`);

  return readJsonFile(filePath, "uniform update config");
}

export async function uniformUpdate(config: IUniformUpdateConfig): Promise<void> {
  uniformLogger.info("Running with config", config);

  const monorepoPackages = await getMonorepoProjectPackageJsonFilePaths();

  uniformLogger.info(
    `Found ${monorepoPackages.length} package.json files in monorepo:\n  ${monorepoPackages.join("\n  ")}`,
  );

  if (config.targetVersions) {
    for (const targetVersion of config.targetVersions) {
      // console.log(`Updating to version: ${config.targetVersions}`);
      uniformLogger.info(
        `Updating to version: "${targetVersion.version}" for deps:\n  ${targetVersion.dependencies.join("\n  ")}`,
      );
    }
  }
}
