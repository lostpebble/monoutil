export interface ILinkedModuleConfig {
  moduleName: string;
  relativePathToRoot: string;
  addToPackages: string[];
  exclude?: string[];
}

export interface ILocalPackageLinkConfig {
  modules: ILinkedModuleConfig[];
  exclude?: string[];
}
