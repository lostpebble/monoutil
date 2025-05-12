import { z } from "zod";
import { EPackageDependencyType } from "../_internal/monoutil_internal/package_json/package_json.enums";

export const zTargetDependencyTypes = z.object({
  exclude: z.array(z.nativeEnum(EPackageDependencyType)).optional(),
  include: z.array(z.nativeEnum(EPackageDependencyType)).optional(),
});

export const zUniformUpdateTargetVersion = z.object({
  version: z.string(),
  dependencies: z.array(z.string()),
  dependencyTypes: zTargetDependencyTypes.optional(),
});

export const zUniformUpdateConfig = z.object({
  targetVersions: z.array(zUniformUpdateTargetVersion).optional(),
  dependencyTypes: zTargetDependencyTypes.optional(),
});

export type TUniformUpdateConfig = z.infer<typeof zUniformUpdateConfig>;
export type TUniformUpdateTargetVersion = z.infer<typeof zUniformUpdateTargetVersion>;
