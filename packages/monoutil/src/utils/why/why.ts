import { getMonorepoProjectPackageJsonFilePaths } from "../_internal/monoutil_internal/package_json/funcs/getMonorepoProjectPackageJsonFilePaths";
import { EPackageDependencyType } from "../_internal/monoutil_internal/package_json/package_json.enums";
import { IWhyModuleVersionInfo } from "./why.types";

const regexMatchCorrectPackageJsonBackslashes = /\\(?:@[^\\]+\\)?[^\\]+\\package\.json$/;

export async function why(module: string) {
  if (module == null) {
    console.log("No module specified. Exiting.");
    throw Error("No module specified");
  }

  const projectPackageJsonPaths = await getMonorepoProjectPackageJsonFilePaths();
  const globDeeper = new Bun.Glob("**/*/package.json");

  const allPackageJsonFilePaths = await Array.fromAsync(globDeeper.scan());

  const projectModuleCheck: {
    [key: string]: boolean;
  } = {};

  for (const projectFilePath of projectPackageJsonPaths) {
    const packageJson = await Bun.file(projectFilePath).json();
    const packageName = packageJson.name;
    projectModuleCheck[packageName] = true;
  }

  console.log("Project module check", projectModuleCheck);

  console.log(
    `Found ${`${projectPackageJsonPaths.length}`.padEnd(5)} [PROJECT]  package.json files`,
  );
  console.log(
    `Found ${`${allPackageJsonFilePaths.length - projectPackageJsonPaths.length}`.padEnd(5)} [EXTERNAL] package.json files`,
  );

  const filterForOnlyPackageJsonFilesAtModuleRoot = [
    ...projectPackageJsonPaths,
    ...allPackageJsonFilePaths.filter((filePath) => {
      return regexMatchCorrectPackageJsonBackslashes.test(filePath);
    }),
  ];

  console.log(
    `Found ${filterForOnlyPackageJsonFilesAtModuleRoot.length} package.json files which fit the criteria.`,
  );

  const slice = filterForOnlyPackageJsonFilesAtModuleRoot.slice(0, 20);
  console.log("Sample", slice);

  const mapModuleInfo = new Map<string, IWhyModuleVersionInfo>();

  const createFreshInfoIfUndefined = (name: string) => {
    if (!mapModuleInfo.has(name)) {
      mapModuleInfo.set(name, {
        name,
        installed_versions: [],
        project_dependants: {
          dev: new Map(),
          prod: new Map(),
        },
        external_dependants: {
          dev: new Map(),
          prod: new Map(),
        },
      });
    }
  };

  const createFreshDependantVersionIfUndefined = (
    name: string,
    version: string,
    type: EPackageDependencyType,
    isProjectModule: boolean,
  ) => {
    createFreshInfoIfUndefined(name);

    const dependantMap = isProjectModule
      ? mapModuleInfo.get(name)!.project_dependants
      : mapModuleInfo.get(name)!.external_dependants;

    if (type === EPackageDependencyType.production && !dependantMap.prod.has(version)) {
      dependantMap.prod.set(version, []);
    }

    if (type === EPackageDependencyType.dev && !dependantMap.dev.has(version)) {
      dependantMap.dev.set(version, []);
    }

    return dependantMap;
  };

  for (const filePath of filterForOnlyPackageJsonFilesAtModuleRoot) {
    const packageJson = await Bun.file(filePath).json();
    const packageName = packageJson.name;
    const packageVersion = packageJson.version;

    const isProjectModule = projectModuleCheck[packageName];

    createFreshInfoIfUndefined(packageName);

    const existingInfo = mapModuleInfo.get(packageName)!;

    existingInfo.installed_versions.push({
      version: packageJson.version,
      path: filePath,
    });

    const dependencies: Record<string, string> = packageJson.dependencies ?? {};

    for (const [dep, version] of Object.entries(dependencies)) {
      const dependantMap = createFreshDependantVersionIfUndefined(
        dep,
        version,
        EPackageDependencyType.production,
        isProjectModule,
      );

      dependantMap.prod.get(version)!.push({
        name: packageName,
        version: packageVersion,
        path: filePath,
      });
    }

    const devDependencies: Record<string, string> = packageJson.devDependencies ?? {};

    for (const [dep, version] of Object.entries(devDependencies)) {
      const dependantMap = createFreshDependantVersionIfUndefined(
        dep,
        version,
        EPackageDependencyType.dev,
        isProjectModule,
      );

      dependantMap.dev.get(version)!.push({
        name: packageName,
        version: packageVersion,
        path: filePath,
      });
    }
  }

  console.log(`"${module}" versions`, mapModuleInfo.get(module));
}
