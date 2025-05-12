export interface IRepoDepCompareOutput {
  matchedProjectDeps: string[];
  // Excludes project deps (even if they are deep matched)
  matchedDeepDeps: string[];
}
