import fs from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";
import { async as syncDirectoryAsync } from "sync-directory";
import { ILinkedModuleConfig, ILocalPackageLinkConfig } from "./link-local-packages.types";

const dirExists = async (path: string) => {
  try {
    await fs.readdir(path);
    return true;
  } catch (err) {
    return false;
  }
};

export async function linkLocalPackages({ watch }: { watch?: boolean } = {}) {
  console.log("local-package-link: Running");

  const configJsonFilename = "link-local-packages.json";

  const configFile = Bun.file(configJsonFilename);

  if (!(await configFile.exists())) {
    throw new Error(`local-package-link: Config file not found: "${configJsonFilename}"`);
  }

  const configFileJson: ILocalPackageLinkConfig = await configFile.json();
  const linkedModulesMap: Map<string, ILinkedModuleConfig> = new Map<string, ILinkedModuleConfig>(
    configFileJson.modules.map((module) => [
      module.moduleName,
      {
        ...module,
        exclude: [...new Set([...(module.exclude ?? []), ...(configFileJson.exclude ?? [])])],
      },
    ]),
  );

  const localConfigJsonFilename = "link-local-packages.local.json";
  const localConfigFile = Bun.file(localConfigJsonFilename);

  if (await localConfigFile.exists()) {
    console.log("local-package-link: Found .local config file");
    const localLinkedModulesFileJson: ILocalPackageLinkConfig = await localConfigFile.json();
    for (const module of localLinkedModulesFileJson.modules) {
      linkedModulesMap.set(module.moduleName, {
        ...module,
        exclude: [
          ...new Set([...(module.exclude ?? []), ...(localLinkedModulesFileJson.exclude ?? [])]),
        ],
      });
    }
  }

  const promises: Promise<any>[] = [];

  for (const [moduleName, moduleConfig] of linkedModulesMap.entries()) {
    promises.push(syncModule(moduleName, moduleConfig, watch));
  }

  await Promise.all(promises);
}

async function syncModule(moduleName: string, config: ILinkedModuleConfig, watch = false) {
  const absPath = path.join(process.cwd(), config.relativePathToRoot);

  // check if the folder exists at the relative path to root
  const folderExists = await dirExists(absPath);

  if (!folderExists) {
    console.warn(
      `Skipping setup for ${moduleName}: couldn't locate it at "${absPath}", given the relative path to root: "${config.relativePathToRoot}"`,
    );
    return;
  }

  console.log(
    `${watch ? "WATCH MODE: " : ""}Setting up linked module ${moduleName} at a location relative to root: "${config.relativePathToRoot}"`,
  );

  if (!watch) {
    await $`rm -rf node_modules/${moduleName}`;
  }

  await syncDirectoryAsync(config.relativePathToRoot, `node_modules/${moduleName}`, {
    watch,
    exclude: config.exclude,
    onError: (err) => {
      console.error(`Error syncing ${moduleName}:`, err);
    },
    afterEachSync(params?: {
      eventType: string;
      nodeType: string;
      relativePath: string;
      srcPath: string;
      targetPath: string;
    }): any {
      if (params) {
        console.log(
          `[LINKED: ${moduleName}] ${params.eventType} ${params.nodeType} ${params.relativePath}`,
        );
      }
    },
  });

  /*if (watch) {

    await $`bunx syncdir ${config.relativePathToRoot} node_modules/${moduleName} --watch`;
  } else {
    await $`rm -rf node_modules/${moduleName}`;
    await $`bunx syncdir ${config.relativePathToRoot} node_modules/${moduleName} --quiet`;
  }*/
}
