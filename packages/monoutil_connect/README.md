# @monoutil/connect

Tools to connect, collect and analyze multiple JS/TS repositories. It enables:

- Define dependency catalogues with pinned or ranged versions.
- Extend catalogues and apply temporary replacements (e.g., swap a dependency with a fork).
- Compute smart version update suggestions using semver and npm registry metadata.
- Store catalogues and repository links in a git-backed config directory.
- Map repositories to local paths for faster, offline-friendly analysis.

This package provides primitives and is intended to be consumed by higher-level CLIs or UIs.

## Quick Start

```ts
import { ConfigRepo, createCatalogue, extendCatalogue, resolveEffectiveDependencies, getVersionUpdates } from "@monoutil/connect";

// Create a git-backed config store (ensure `~/.monoutil_connect` is a git repo)
const cfg = new ConfigRepo(`${process.env.HOME}/.monoutil_connect`);
console.log("git repo?", cfg.isGitRepo());

// Define a base catalogue
const base = createCatalogue({
  name: "base-web",
  dependencies: {
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    typescript: "^5.5.4",
  },
  replacements: [
    { from: "some-lib", to: "@our-scope/some-lib", reason: "temporary patch" },
  ],
});

// Extend it
const appCat = extendCatalogue(base, {
  name: "my-app",
  dependencies: { "@types/react": "^18.3.3" },
  replacements: [],
});

// Resolve effective deps (after replacements)
const effective = resolveEffectiveDependencies(appCat);

// Suggest updates
const updates = await getVersionUpdates(effective);
console.log(updates);
```

## Notes
- Version updates include patch/minor/major candidates and `latest`.
- Changelog/notes URL is inferred from package homepage or repository metadata when available.
- Git operations are not performed by this package; it only checks whether the config directory appears to be a git repo.
