# monoutil

CLI utilities for monorepo dependency management.

```
npx monoutil <command> [options]
```

---

## Commands

### `why <package>`

Inspect a package across the entire monorepo. Shows every installed version, which project packages depend on it, and which external (node_modules) packages depend on it — split by `prod` and `dev` dependency type.

```bash
monoutil why react
monoutil why zod
```

**Output includes:**
- `installed_versions` — all resolved locations where the package is installed, with path and version
- `project_dependants.prod / .dev` — your own monorepo packages that list it as a dependency, grouped by the version string they specify
- `external_dependants.prod / .dev` — external packages (inside `node_modules`) that depend on it

Useful for diagnosing version conflicts, duplicate installs, or understanding the blast radius before upgrading a package.

---

### `ts_remove_emitted`

Finds and removes TypeScript-emitted files (`.js`, `.mjs`, `.d.ts`) from source directories where a matching `.ts` / `.tsx` source file exists.

```bash
monoutil ts_remove_emitted
```

**Behaviour:**
1. Discovers all monorepo project `src` directories
2. For each directory, finds emitted files that have a corresponding source file (same base path, different extension)
3. Prints the matches and prompts for confirmation before deleting
4. Skips directories with no emitted files

Use this after switching a project from `tsc`-emitting-to-src to a dist-only build, to clean up leftover `.js` / `.d.ts` files that confuse module resolution.

---

### `uniform_update`

Updates dependency versions uniformly across every `package.json` in the monorepo. Supports three modes:

#### Quick update via flags

Set a single package to a specific version across all packages:

```bash
monoutil uniform_update --module zod --version 4.0.0
```

#### Config file

Apply a batch of updates from a JSON config file:

```bash
monoutil uniform_update
# reads ./monoutil/uniform_update.config.json by default

monoutil uniform_update --config path/to/custom.config.json
```

#### Config file format

```json
{
  "dependencyTypes": {
    "include": ["production", "dev"],
    "exclude": []
  },
  "targetVersions": [
    {
      "version": "4.0.0",
      "dependencies": ["zod"],
      "dependencyTypes": { "include": ["production"] }
    }
  ],
  "targetDependencies": [
    {
      "dependencies": {
        "react": "^19.0.0",
        "react-dom": "^19.0.0"
      }
    }
  ],
  "changeDependencyNames": [
    {
      "changes": {
        "old-package-name": "new-package-name"
      }
    }
  ]
}
```

**Config fields:**

| Field | Description |
|---|---|
| `targetVersions` | Set a single `version` string for a list of `dependencies` |
| `targetDependencies` | Set explicit per-package versions as a `{ name: version }` map |
| `changeDependencyNames` | Rename dependency entries (updates the key, preserves the version) |
| `dependencyTypes` | Global default filter applied to all operations |

Each entry also accepts its own `dependencyTypes` override which merges with (and takes precedence over) the global one.

**`dependencyTypes` values:**

Valid values for `include` / `exclude` arrays:

- `"production"` — `dependencies`
- `"dev"` — `devDependencies`
- `"peer"` — `peerDependencies`
- `"resolution"` — `resolutions`
- `"override"` — `overrides`

When no `include` is specified, all types are targeted. `exclude` removes specific types from that set.

After writing each `package.json`, the file is auto-formatted with Biome.
