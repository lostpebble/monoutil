import { EMonoutilId } from "../../monoutil.types";
import { createLogger } from "../_internal/monoutil_internal/logging";
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
  uniformLogger.info(`[monoutil:uniform_update] Loading config from ${filePath}`);

  const configFile = Bun.file(filePath);

  if (!(await configFile.exists())) {
    throw new Error(`Config file not found at ${filePath}`);
  }

  const fileText = await configFile.text();

  return await Bun.file(filePath).json();
}

export async function uniformUpdate(config: IUniformUpdateConfig): Promise<void> {
  console.log("[monoutil:uniform_update] Running with config", config);

  if (config.targetVersions) {
    for (const targetVersion of config.targetVersions) {
      // console.log(`Updating to version: ${config.targetVersions}`);
      console.log(
        `Updating to version: ${targetVersion} for deps:\n  ${targetVersion.dependencies.join("\n  ")}`,
      );
    }
  }
}
