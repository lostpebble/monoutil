import { EPackageDependencyType } from "./package_json.enums";

export const ALL_PACKAGE_DEPENDENCY_TYPES = [
  EPackageDependencyType.production,
  EPackageDependencyType.dev,
  EPackageDependencyType.peer,
  EPackageDependencyType.resolution,
  EPackageDependencyType.override,
];
