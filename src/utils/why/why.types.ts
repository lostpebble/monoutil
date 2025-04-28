export interface IVersionFound {
  version: string;
  path: string;
}

export enum EDependantType {
  dev = "dev",
  prod = "prod",
}

export interface IDependant extends IVersionFound {
  name: string;
  type: EDependantType;
}

export interface IWhyModuleVersionInfo {
  name: string;
  foundVersions: IVersionFound[];
  dependants: Map<string, IDependant[]>;
  devDependants: Map<string, IDependant[]>;
}

/* export interface IWhyModuleDependantInfo {
  versionDependants: Map<string, IVersionDepdendantFound>;
} */
