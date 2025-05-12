import { EPackageDependencyType } from "../package_json.enums";
import { ALL_PACKAGE_DEPENDENCY_TYPES, DEPENDENCY_TYPE_TO_KEY } from "../package_json.static";
import { IPackageDependencyUpdate, IPackageJsonFile, IUpdatedDep } from "../package_json.types";

interface IUpdatePackageDependencies_Input<P extends IPackageJsonFile> {
  packageJson: P;
  dependencyUpdates: IPackageDependencyUpdate[];
}

interface IUpdatePackageDependencies_Output<P extends IPackageJsonFile> {
  newPackageJson: P;
  updatedDeps: IUpdatedDep[];
}

export function updatePackageJsonDependencies<P extends IPackageJsonFile>({
  packageJson,
  dependencyUpdates,
}: IUpdatePackageDependencies_Input<P>): IUpdatePackageDependencies_Output<P> {
  const newPackageJson: P = {
    ...packageJson,
  };

  const updatedDeps: IUpdatedDep[] = [];

  function updateDependency(type: EPackageDependencyType, depUpdate: IPackageDependencyUpdate) {
    if (
      newPackageJson[DEPENDENCY_TYPE_TO_KEY[type]]?.[depUpdate.name] != null &&
      newPackageJson[DEPENDENCY_TYPE_TO_KEY[type]]![depUpdate.name] !== depUpdate.version
    ) {
      const previousVersion = newPackageJson[DEPENDENCY_TYPE_TO_KEY[type]]![depUpdate.name];
      newPackageJson[DEPENDENCY_TYPE_TO_KEY[type]]![depUpdate.name] = depUpdate.version;

      updatedDeps.push({
        name: depUpdate.name,
        version: depUpdate.version,
        type,
        previousVersion,
      });
    }
  }

  for (const dep of dependencyUpdates) {
    const updateTypes = dep.updateTypes ?? ALL_PACKAGE_DEPENDENCY_TYPES;

    const updateProd = updateTypes.includes(EPackageDependencyType.production);
    const updateDev = updateTypes.includes(EPackageDependencyType.dev);
    const updatePeer = updateTypes.includes(EPackageDependencyType.peer);
    const updateOverrides = updateTypes.includes(EPackageDependencyType.override);
    const updateResolutions = updateTypes.includes(EPackageDependencyType.resolution);

    if (updateProd) {
      updateDependency(EPackageDependencyType.production, dep);
    }

    if (updateDev) {
      updateDependency(EPackageDependencyType.dev, dep);
    }

    if (updatePeer) {
      updateDependency(EPackageDependencyType.peer, dep);
    }

    if (updateResolutions) {
      updateDependency(EPackageDependencyType.resolution, dep);
    }

    if (updateOverrides) {
      updateDependency(EPackageDependencyType.override, dep);
    }
  }

  return {
    newPackageJson,
    updatedDeps,
  };
}
