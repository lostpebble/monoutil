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

export type TDependantExcludingType = Omit<IDependant, "type">;

export interface IWhyModuleVersionInfo {
  name: string;
  installed_versions: IVersionFound[];
  project_dependants: {
    dev: Map<string, TDependantExcludingType[]>;
    prod: Map<string, TDependantExcludingType[]>;
  };
  external_dependants: {
    dev: Map<string, TDependantExcludingType[]>;
    prod: Map<string, TDependantExcludingType[]>;
  };
}

/* export interface IWhyModuleDependantInfo {
  versionDependants: Map<string, IVersionDepdendantFound>;
} */
