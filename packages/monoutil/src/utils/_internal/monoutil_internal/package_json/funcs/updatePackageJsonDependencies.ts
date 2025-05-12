import { EPackageDependencyType } from "../package_json.enums";
import { ALL_PACKAGE_DEPENDENCY_TYPES } from "../package_json.static";
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

  for (const dep of dependencyUpdates) {
    const updateTypes = dep.updateTypes ?? ALL_PACKAGE_DEPENDENCY_TYPES;

    const updateProd = updateTypes.includes(EPackageDependencyType.production);
    const updateDev = updateTypes.includes(EPackageDependencyType.dev);
    const updatePeer = updateTypes.includes(EPackageDependencyType.peer);
    const updateOverrides = updateTypes.includes(EPackageDependencyType.override);
    const updateResolutions = updateTypes.includes(EPackageDependencyType.resolution);

    if (updateProd && newPackageJson.dependencies?.[dep.name] != null) {
      const previousVersion = newPackageJson.dependencies[dep.name];
      newPackageJson.dependencies[dep.name] = dep.version;

      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.production,
        previousVersion,
      });
    }

    if (updateDev && newPackageJson.devDependencies?.[dep.name] != null) {
      const previousVersion = newPackageJson.devDependencies[dep.name];
      newPackageJson.devDependencies[dep.name] = dep.version;

      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.dev,
        previousVersion,
      });
    }

    if (updatePeer && newPackageJson.peerDependencies?.[dep.name] != null) {
      const previousVersion = newPackageJson.peerDependencies[dep.name];
      newPackageJson.peerDependencies[dep.name] = dep.version;

      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.peer,
        previousVersion,
      });
    }

    if (updateResolutions && newPackageJson.resolutions?.[dep.name] != null) {
      const previousVersion = newPackageJson.resolutions[dep.name];
      newPackageJson.resolutions[dep.name] = dep.version;

      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.resolution,
        previousVersion,
      });
    }

    if (updateOverrides && newPackageJson.overrides?.[dep.name] != null) {
      const previousVersion = newPackageJson.overrides[dep.name];
      newPackageJson.overrides[dep.name] = dep.version;

      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.override,
        previousVersion,
      });
    }
  }

  return {
    newPackageJson,
    updatedDeps,
  };
}
