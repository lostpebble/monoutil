export enum EMonoutilId {
  why = "why",
  uniform_update = "uniform_update",
  ts_remove_emitted = "ts_remove_emitted",
}

export interface IUtilRequest_Why {
  id: EMonoutilId.why;
  module: string;
}

export interface IUtilRequest_TsRemoveEmittedWithSource {
  id: EMonoutilId.ts_remove_emitted;
}

export enum EUniformRequestType {
  config = "config",
  direct = "direct",
}

export interface IUtilRequest_UniformUpdate_Config {
  id: EMonoutilId.uniform_update;
  requestType: EUniformRequestType.config;
  configFilePath?: string;
}

export interface IUtilRequest_UniformUpdate_Direct {
  id: EMonoutilId.uniform_update;
  requestType: EUniformRequestType.direct;
  module?: string;
  version?: string;
}

export type TUtilRequest_UniformUpdate =
  | IUtilRequest_UniformUpdate_Config
  | IUtilRequest_UniformUpdate_Direct;

export type TUtilRequest =
  | IUtilRequest_Why
  | TUtilRequest_UniformUpdate
  | IUtilRequest_TsRemoveEmittedWithSource;
