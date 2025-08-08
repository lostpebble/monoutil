import { z } from "zod";

export const zDependencyName = z.string().min(1);
export const zSemver = z.string().min(1);

// A mapping of dependency name -> semver range or pinned version
export const zDependenciesMap = z.record(zDependencyName, zSemver);

export const zReplacement = z.object({
  from: zDependencyName,
  to: zDependencyName,
  // Optional version to force on the replacement (otherwise use target version)
  version: zSemver.optional(),
  reason: z.string().optional(),
  temporary: z.boolean().default(true).optional(),
});
export type TReplacement = z.infer<typeof zReplacement>;

export const zCatalogueBase = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  // versions for dependencies in this catalogue
  dependencies: zDependenciesMap.default({}),
  // replacement rules that apply when resolving effective dependencies
  replacements: z.array(zReplacement).default([]),
});

export type TCatalogueBase = z.infer<typeof zCatalogueBase>;

export const zCatalogue = zCatalogueBase.extend({
  // Optional parent this catalogue extends (by name)
  extends: z.string().optional(),
});
export type TCatalogue = z.infer<typeof zCatalogue>;

export const zRepoLink = z.object({
  id: z.string().min(1),
  gitUrl: z.string().url().optional(),
  // Use localPath to refer to a local directory (faster analysis)
  localPath: z.string().optional(),
  // Whether to prefer local path instead of remote
  preferLocal: z.boolean().default(true).optional(),
});
export type TRepoLink = z.infer<typeof zRepoLink>;

export const zConfig = z.object({
  // Known catalogues keyed by name
  catalogues: z.record(z.string(), zCatalogue).default({}),
  // Known repos to analyze
  repos: z.array(zRepoLink).default([]),
});
export type TConfig = z.infer<typeof zConfig>;

export const zTagUpdate = z.object({
  tag: z.string(),
  version: zSemver,
  // classification relative to current pinned version
  type: z.enum(["patch", "minor", "major", "same", "unknown"]).optional(),
});
export type TTagUpdate = z.infer<typeof zTagUpdate>;

export const zVersionUpdate = z.object({
  name: zDependencyName,
  current: zSemver.optional(),
  // candidate versions
  latest: zSemver.optional(),
  major: zSemver.optional(),
  minor: zSemver.optional(),
  patch: zSemver.optional(),
  // all dist-tags with classification
  tags: z.array(zTagUpdate).optional(),
  // optional notes URL (e.g., changelog)
  notesUrl: z.string().url().optional(),
});

export type TVersionUpdate = z.infer<typeof zVersionUpdate>;
export type TDependenciesMap = z.infer<typeof zDependenciesMap>;
