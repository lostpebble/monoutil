import { EPackageDependencyType } from "../_internal/monoutil_internal/package_json/package_json.enums";

export interface IVersionFound {
  version: string;
  path: string;
}

export interface IDependant extends IVersionFound {
  name: string;
  type: EPackageDependencyType;
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
