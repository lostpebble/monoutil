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

    const updateProd = updateTypes.includes(EPackageDependencyType.prod);
    const updateDev = updateTypes.includes(EPackageDependencyType.dev);
    const updatePeer = updateTypes.includes(EPackageDependencyType.peer);
    const updateOverrides = updateTypes.includes(EPackageDependencyType.override);
    const updateResolutions = updateTypes.includes(EPackageDependencyType.resolution);

    if (updateProd && newPackageJson.dependencies?.[dep.name] != null) {
      newPackageJson.dependencies[dep.name] = dep.version;
      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.prod,
      });
    }

    if (updateDev && newPackageJson.devDependencies?.[dep.name] != null) {
      newPackageJson.devDependencies[dep.name] = dep.version;
      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.dev,
      });
    }

    if (updatePeer && newPackageJson.peerDependencies?.[dep.name] != null) {
      newPackageJson.peerDependencies[dep.name] = dep.version;
      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.peer,
      });
    }

    if (updateResolutions && newPackageJson.resolutions?.[dep.name] != null) {
      newPackageJson.resolutions[dep.name] = dep.version;
      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.resolution,
      });
    }

    if (updateOverrides && newPackageJson.overrides?.[dep.name] != null) {
      newPackageJson.overrides[dep.name] = dep.version;
      updatedDeps.push({
        name: dep.name,
        version: dep.version,
        type: EPackageDependencyType.override,
      });
    }
  }

  return {
    newPackageJson,
    updatedDeps,
  };
}
