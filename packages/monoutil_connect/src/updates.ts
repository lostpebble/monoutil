import semver from "semver";
import type { TDependenciesMap, TVersionUpdate } from "./schemas";

export type Fetcher = (url: string) => Promise<Response>;

// Allow passing custom fetch for testability; default to global fetch (available in Bun / modern Node)
async function defaultFetch(url: string) {
  return fetch(url);
}

export async function fetchPackageMetadata(
  name: string,
  fetcher: Fetcher = defaultFetch,
): Promise<any> {
  const res = await fetcher(`https://registry.npmjs.org/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Failed to fetch metadata for ${name}: ${res.status}`);
  return res.json();
}

function pickVersionForRange(versions: string[], currentRange: string, lowest = false) {
  if (!currentRange) return undefined;
  // Find the versions satisfying the current range
  const satisfying = versions.filter((v) => semver.satisfies(v, currentRange));

  if (satisfying.length === 0) return undefined;
  if (lowest) {
    return satisfying.sort(semver.compare)[0];
  } else {
    return satisfying.sort(semver.rcompare)[0];
  }
}

function classifyUpdateType(
  currentPinned: string | undefined,
  tagVersion: string,
): "major" | "minor" | "patch" | "same" | "unknown" {
  if (!semver.valid(tagVersion)) return "unknown";
  if (!currentPinned || !semver.valid(currentPinned)) return "unknown";

  const c = semver.parse(currentPinned)!;
  const t = semver.parse(tagVersion)!;

  if (semver.eq(t, c)) return "same";

  if (t.major > c.major) return "major";
  if (t.major === c.major && t.minor > c.minor) return "minor";
  if (t.major === c.major && t.minor === c.minor && t.patch > c.patch) return "patch";

  // If versions are not greater (e.g., older tag), mark unknown to avoid misleading the user
  return "unknown";
}

function isStable(v: string): boolean {
  return Boolean(semver.valid(v)) && semver.prerelease(v) === null;
}

export async function getVersionUpdates(
  deps: TDependenciesMap,
  fetcher: Fetcher = defaultFetch,
): Promise<TVersionUpdate[]> {
  const results: TVersionUpdate[] = [];
  for (const [name, range] of Object.entries(deps)) {
    try {
      const meta = await fetchPackageMetadata(name, fetcher);
      const versionKeys = Object.keys(meta.versions || {}).filter(semver.valid);
      const sorted = versionKeys.sort(semver.rcompare);

      const currentPinnedLowest = pickVersionForRange(sorted, range, true);

      const distTags = (meta["dist-tags"] || {}) as Record<string, string>;

      const currentPinnedHighest = pickVersionForRange(sorted, range);

      // Build classified tag updates
      const wellKnown = new Set(["latest", "next", "beta", "canary"]);
      const tags = Object.entries(distTags)
        .map(([tag, version]) => ({
          tag,
          version,
          type: classifyUpdateType(currentPinnedHighest, version),
        }))
        .filter((t) => semver.gte(t.version, currentPinnedLowest))
        // Sort: well-known first (by a fixed order), then alphabetically by tag
        .sort((a, b) => {
          const aKnown = wellKnown.has(a.tag) ? 0 : 1;
          const bKnown = wellKnown.has(b.tag) ? 0 : 1;
          if (aKnown !== bKnown) return aKnown - bKnown;
          // Within well-known group, prioritize a fixed rank
          const rank: Record<string, number> = { latest: 0, next: 1, beta: 2, canary: 3 };
          const ra = rank[a.tag] ?? Number.MAX_SAFE_INTEGER;
          const rb = rank[b.tag] ?? Number.MAX_SAFE_INTEGER;
          if (ra !== rb) return ra - rb;
          return a.tag.localeCompare(b.tag);
        });

      const latest = distTags.latest as string | undefined;

      // Compute next patch/minor/major relative to current pinned (if any)
      // Only consider STABLE releases for these suggestions (exclude pre-releases like canary/beta/rc)
      const stableSorted = sorted.filter(isStable);
      let patch: string | undefined;
      let minor: string | undefined;
      let major: string | undefined;

      if (currentPinnedHighest) {
        patch = stableSorted.find(
          (v) =>
            semver.diff(currentPinnedHighest, v) === "patch" && semver.gt(v, currentPinnedHighest),
        );
        minor = stableSorted.find(
          (v) =>
            semver.diff(currentPinnedHighest, v) === "minor" && semver.gt(v, currentPinnedHighest),
        );
        // For major, pick the first stable version with a greater major than current
        major = stableSorted.find((v) => semver.major(v) > semver.major(currentPinnedHighest));
      }

      const homepage = meta?.homepage as string | undefined;
      const repoUrl = (meta?.repository &&
        (typeof meta.repository === "string" ? meta.repository : meta.repository.url)) as
        | string
        | undefined;
      const notesUrl = homepage || repoUrl;

      results.push({
        name,
        current: range,
        latest,
        patch,
        minor,
        major,
        tags,
        notesUrl,
      });
    } catch (e) {
      results.push({ name, current: range });
    }
  }
  return results;
}
