export enum EPackageDependencyType {
  dev = "dev",
  production = "production",
  peer = "peer",
  resolution = "resolution",
  override = "override",
}

export enum EPackageDependencyUpdateSource {
  targetVersions = "targetVersions",
  targetDependencies = "targetDependencies",
  changeDependencyName = "changeDependencyName",
}
