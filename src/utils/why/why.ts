import { EDependantType, type IWhyModuleVersionInfo } from "./why.types";

export async function why(module: string) {
  if (module == null) {
    console.log("No module specified. Exiting.");
    throw Error("No module specified");
  }

  const glob = new Bun.Glob("**/*/package.json");

  const allPackageJsonFilePaths = await Array.fromAsync(glob.scan());

  console.log(`Found ${allPackageJsonFilePaths.length} package.json files`);

  // const regexMatchCorrectPackageJson = /\/(?:@[^\/]+\/)?[^\/]+\/package\.json$/;
  const regexMatchCorrectPackageJsonBackslashes = /\\(?:@[^\\]+\\)?[^\\]+\\package\.json$/;

  console.log(`First one is ${allPackageJsonFilePaths[0]}`);

  const slice = allPackageJsonFilePaths.slice(0, 20);

  console.log("Sample", slice);

  const filterForOnlyPackageJsonFilesAtModuleRoot = allPackageJsonFilePaths.filter((filePath) => {
    return regexMatchCorrectPackageJsonBackslashes.test(filePath);
  });

  console.log(
    `Found ${filterForOnlyPackageJsonFilesAtModuleRoot.length} package.json files which fit the criteria.`,
  );

  const mapModuleInfo = new Map<string, IWhyModuleVersionInfo>();

  const createFreshInfoIfUndefined = (name: string) => {
    if (!mapModuleInfo.has(name)) {
      mapModuleInfo.set(name, {
        name,
        foundVersions: [],
        dependants: new Map(),
        devDependants: new Map(),
      });
    }
  };

  const createFreshDependantVersionIfUndefined = (
    name: string,
    version: string,
    type: EDependantType,
  ) => {
    createFreshInfoIfUndefined(name);
    if (type === EDependantType.prod && !mapModuleInfo.get(name)!.dependants.has(version)) {
      mapModuleInfo.get(name)!.dependants.set(version, []);
    }

    if (type === EDependantType.dev && !mapModuleInfo.get(name)!.devDependants.has(version)) {
      mapModuleInfo.get(name)!.devDependants.set(version, []);
    }
  };

  for (const filePath of filterForOnlyPackageJsonFilesAtModuleRoot) {
    const packageJson = await Bun.file(filePath).json();
    const packageName = packageJson.name;
    const packageVersion = packageJson.version;
    createFreshInfoIfUndefined(packageName);

    const existingInfo = mapModuleInfo.get(packageName)!;

    existingInfo.foundVersions.push({
      version: packageJson.version,
      path: filePath,
    });

    const dependencies: Record<string, string> = packageJson.dependencies ?? {};

    for (const [dep, version] of Object.entries(dependencies)) {
      createFreshDependantVersionIfUndefined(dep, version, EDependantType.prod);

      if (mapModuleInfo.has(dep)) {
        mapModuleInfo.get(dep)!.dependants.get(version)!.push({
          type: EDependantType.prod,
          name: packageName,
          version: packageVersion,
          path: filePath,
        });
      }
    }

    const devDependencies: Record<string, string> = packageJson.devDependencies ?? {};

    for (const [dep, version] of Object.entries(devDependencies)) {
      createFreshDependantVersionIfUndefined(dep, version, EDependantType.dev);

      if (mapModuleInfo.has(dep)) {
        mapModuleInfo.get(dep)!.devDependants.get(version)!.push({
          type: EDependantType.dev,
          name: packageName,
          version: packageVersion,
          path: filePath,
        });
      }
    }
  }

  console.log(`"${module}" versions`, mapModuleInfo.get(module));
}
