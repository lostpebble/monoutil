interface IUniformUpdateTargetBase {
  matchRepoModules?: string[];
  matchRepoFolders?: string[];
}

export interface IUniformUpdateTargetVersion extends IUniformUpdateTargetBase {
  version: string;
  dependencies: string[];
}

// export interface IDynamicUpdateDefinition_Pick extends IUniformUpdateTargetBase {
//   type: EDynamicUpdateType.pick;
//   dependencies: string[];
// }
//
// export type TDynamicUpdateDefinition = IDynamicUpdateDefinition_Pick;

export interface IUniformUpdateConfig {
  targetVersions?: IUniformUpdateTargetVersion[];
  // dynamic?: TDynamicUpdateDefinition[];
}
