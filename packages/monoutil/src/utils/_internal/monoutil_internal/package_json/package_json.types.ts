import { EPackageDependencyType } from "./package_json.enums";

export interface IPackageDependency {
  name: string;
  version: string;
}

export interface IPackageDependencyUpdate extends IPackageDependency {
  updateTypes?: EPackageDependencyType[];
}

export interface IPackageJsonFile {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  overrides?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  resolutions?: Record<string, string>;
}

export interface IUpdatedDep extends IPackageDependency {
  type: EPackageDependencyType;
}
