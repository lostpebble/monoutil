import { type TCatalogue, TDependenciesMap, type TReplacement, zCatalogue } from "./schemas";

export function createCatalogue(input: TCatalogue): TCatalogue {
  return zCatalogue.parse(input);
}

export function extendCatalogue(parent: TCatalogue, child: TCatalogue): TCatalogue {
  const p = zCatalogue.parse(parent);
  const c = zCatalogue.parse(child);

  const mergedDeps: TDependenciesMap = { ...p.dependencies, ...c.dependencies };
  const mergedRepl: TReplacement[] = [...p.replacements, ...c.replacements];

  return {
    name: c.name,
    description: c.description ?? p.description,
    extends: p.name,
    dependencies: mergedDeps,
    replacements: mergedRepl,
  };
}

export function applyReplacements(
  deps: TDependenciesMap,
  replacements: TReplacement[],
): TDependenciesMap {
  const out: TDependenciesMap = { ...deps };
  for (const r of replacements) {
    if (out[r.from]) {
      const version = r.version ?? out[r.from];
      delete out[r.from];
      // keep existing target if present, prefer explicit version override
      out[r.to] = r.version ?? out[r.to] ?? version;
    }
  }
  return out;
}

export function resolveEffectiveDependencies(cat: TCatalogue): TDependenciesMap {
  // In this minimal implementation, cat.extends is informational only; caller should pass a fully merged catalogue when needed.
  return applyReplacements(cat.dependencies, cat.replacements);
}
