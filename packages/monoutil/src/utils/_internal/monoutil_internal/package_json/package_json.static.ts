import { EPackageDependencyType } from "./package_json.enums";

export const ALL_PACKAGE_DEPENDENCY_TYPES = [
  EPackageDependencyType.production,
  EPackageDependencyType.dev,
  EPackageDependencyType.peer,
  EPackageDependencyType.resolution,
  EPackageDependencyType.override,
];

export const DEPENDENCY_TYPE_TO_KEY = {
  [EPackageDependencyType.production]: "dependencies",
  [EPackageDependencyType.dev]: "devDependencies",
  [EPackageDependencyType.peer]: "peerDependencies",
  [EPackageDependencyType.resolution]: "resolutions",
  [EPackageDependencyType.override]: "overrides",
} as const;
