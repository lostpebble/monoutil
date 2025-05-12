import { $ } from "bun";
import { EMonoutilId } from "../../monoutil.types";
import { readJsonFile } from "../_internal/monoutil_internal/files";
import { createLogger } from "../_internal/monoutil_internal/logging";
import { getMonorepoProjectPackageJsonFilePaths } from "../_internal/monoutil_internal/package_json/funcs/getMonorepoProjectPackageJsonFilePaths";
import { readPackageJsonFile } from "../_internal/monoutil_internal/package_json/funcs/readPackageJsonFile";
import { updatePackageJsonDependencies } from "../_internal/monoutil_internal/package_json/funcs/updatePackageJsonDependencies";
import { writePackageJsonFile } from "../_internal/monoutil_internal/package_json/funcs/writePackageJsonFile";
import { EPackageDependencyType } from "../_internal/monoutil_internal/package_json/package_json.enums";
import { ALL_PACKAGE_DEPENDENCY_TYPES } from "../_internal/monoutil_internal/package_json/package_json.static";
import {
  IPackageDependencyUpdate,
  IUpdatedDep,
} from "../_internal/monoutil_internal/package_json/package_json.types";
import {
  TUniformUpdateConfig,
  TUniformUpdateDependencyTypes,
  zUniformUpdateConfig,
} from "./uniform_update.zod";

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
        `Updating to dependency versions:\n  - ${targetVersion.dependencies.map((name) => `"${name}": "${targetVersion.version}"`).join("\n  - ")}`,
      );
    }
  }

  for (const monoPackage of monorepoPackages) {
    const packageJson = await readPackageJsonFile(monoPackage);

    let latestPackageJson = packageJson;
    const updatedDeps: IUpdatedDep[] = [];
    const packageUpdates: IPackageDependencyUpdate[] = [];

    if (config.targetVersions) {
      for (const targetVersion of config.targetVersions) {
        // console.log(`Updating to version: ${config.targetVersions}`);
        // uniformLogger.info(
        //   `Updating to version: "${targetVersion.version}" for deps:\n  - ${targetVersion.dependencies.join("\n  - ")}`,
        // );
        const updateTypes = getDependencyTypes(
          config.dependencyTypes,
          targetVersion.dependencyTypes,
        );

        // uniformLogger.info(
        //   `Attempting update of dependencies ["${targetVersion.dependencies.join(`", "`)}"] to version "${targetVersion.version}" in "./${monoPackage}" for package dependency types: ${updateTypes.join(", ")}`,
        // );
        packageUpdates.push(
          ...targetVersion.dependencies.map(
            (depName): IPackageDependencyUpdate => ({
              updateTypes,
              version: targetVersion.version,
              name: depName,
            }),
          ),
        );

        /*const update = updatePackageJsonDependencies({
          packageJson,
          dependencyUpdates: targetVersion.dependencies.map(
            (depName): IPackageDependencyUpdate => ({
              updateTypes,
              version: targetVersion.version,
              name: depName,
            }),
          ),
        });*/
      }
    }

    if (config.targetDependencies != null) {
      for (const targetDependencyObject of config.targetDependencies) {
        const updateTypes = getDependencyTypes(
          config.dependencyTypes,
          targetDependencyObject.dependencyTypes,
        );

        const depNames = Object.keys(targetDependencyObject.dependencies);

        // uniformLogger.info(
        //   `Updating dependencies:\n  - ${depNames.map((depName) => `"${depName}": ${targetDependencyObject.dependencies[depName]}`).join("\n  - ")}`,
        // );

        const packageUpdate = depNames.map((depName): IPackageDependencyUpdate => {
          return {
            updateTypes,
            version: targetDependencyObject.dependencies[depName],
            name: depName,
          };
        });

        packageUpdates.push(...packageUpdate);
      }
    }

    const update = updatePackageJsonDependencies({
      packageJson,
      dependencyUpdates: packageUpdates,
    });

    if (update.updatedDeps.length > 0) {
      latestPackageJson = update.newPackageJson;
      updatedDeps.push(...update.updatedDeps);
    }

    if (latestPackageJson !== packageJson) {
      await writePackageJsonFile(monoPackage, latestPackageJson);
      await $`bunx biome format --write ${monoPackage}`;

      if (updatedDeps.length > 0) {
        uniformLogger.log(
          `Updated dependencies in "./${monoPackage}":\n  - ${updatedDeps.map((updatedDep) => `(${updatedDep.type} dependency) [${updatedDep.name}] "${updatedDep.version}" (was "${updatedDep.previousVersion}")`).join("\n  - ")}`,
        );
      }
    }
  }
}

function getDependencyTypes(
  ...depTypes: (TUniformUpdateDependencyTypes | undefined)[]
): EPackageDependencyType[] {
  const mergedIncludes = [...new Set(depTypes.flatMap((d) => d?.include))].filter((d) => d != null);
  const mergedExcludes = [...new Set(depTypes.flatMap((d) => d?.exclude))].filter((d) => d != null);

  return (mergedIncludes.length === 0 ? [...ALL_PACKAGE_DEPENDENCY_TYPES] : mergedIncludes).filter(
    (dep) => !mergedExcludes.includes(dep),
  );
}
