import { EPackageDependencyType } from "./package_json.enums";

export interface IPackageDependencyVersion {
  name: string;
  version: string;
}

export interface IPackageDependencyNameChange {
  fromName: string;
  toName: string;
}

export interface IUpdatePackageDependencyVersion extends IPackageDependencyVersion {
  updateType: "version";
}

export interface IUpdatePackageDependencyNameChange extends IPackageDependencyNameChange {
  updateType: "name_change";
}

export type TPackageDependencyUpdate = {
  updateTypes?: EPackageDependencyType[];
} & (IUpdatePackageDependencyVersion | IUpdatePackageDependencyNameChange);

export interface IPackageJsonFile {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  overrides?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  resolutions?: Record<string, string>;
}

export interface IUpdatedDep extends IPackageDependencyVersion {
  type: EPackageDependencyType;
  previousVersion: string;
  previousName?: string;
}
