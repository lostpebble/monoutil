import { afterAll, describe, expect, test } from "bun:test";
import { chmod, mkdtemp, rm } from "node:fs/promises";
import * as path from "node:path";

/**
 * On Linux (including WSL), bunx executes a package's bin file directly, so the
 * kernel requires a shebang line to know which interpreter to use. Without one,
 * `bunx monoutil` exits with code 1 and no output at all. Windows uses .cmd/.bunx
 * shims instead, so the problem only shows up on Linux/macOS.
 */

const packageDir = path.resolve(import.meta.dir, "..");
const BUN_SHEBANG = "#!/usr/bin/env bun";

interface IBinEntry {
  name: string;
  distRelativePath: string;
  srcRelativePath: string;
}

async function getBinEntries(): Promise<IBinEntry[]> {
  const packageJson = await Bun.file(path.join(packageDir, "package.json")).json();
  const bin: Record<string, string> = packageJson.bin ?? {};

  return Object.entries(bin).map(([name, distRelativePath]) => ({
    name,
    distRelativePath,
    srcRelativePath: distRelativePath.replace(/^dist\//, "src/").replace(/\.js$/, ".ts"),
  }));
}

describe("bin entry points", () => {
  test("package.json declares at least one bin entry", async () => {
    const binEntries = await getBinEntries();
    expect(binEntries.length).toBeGreaterThan(0);
  });

  test("every bin source file starts with a bun shebang", async () => {
    for (const { srcRelativePath } of await getBinEntries()) {
      const source = await Bun.file(path.join(packageDir, srcRelativePath)).text();
      const firstLine = source.split("\n", 1)[0];

      expect(firstLine, `${srcRelativePath} must start with "${BUN_SHEBANG}"`).toBe(BUN_SHEBANG);
    }
  });
});

describe("built bin can be executed the way bunx executes it", () => {
  // Emit inside the package dir so the built bin can still resolve node_modules
  const tempOutDirPromise = mkdtemp(path.join(packageDir, ".bin-exec-test-"));

  afterAll(async () => {
    await rm(await tempOutDirPromise, { recursive: true, force: true });
  });

  test("emitted bin keeps its shebang and runs as a direct executable", async () => {
    const tempOutDir = await tempOutDirPromise;

    const build = Bun.spawn(["bunx", "tsc", "--outDir", tempOutDir], {
      cwd: packageDir,
      stdout: "pipe",
      stderr: "pipe",
    });
    const buildExitCode = await build.exited;
    const buildOutput = await new Response(build.stdout).text();
    expect(buildExitCode, `tsc build failed:\n${buildOutput}`).toBe(0);

    for (const { name, distRelativePath } of await getBinEntries()) {
      // package.json bin paths are relative to the package root, e.g. "dist/bin.js"
      const emittedPath = path.join(tempOutDir, path.relative("dist", distRelativePath));

      const emitted = await Bun.file(emittedPath).text();
      const firstLine = emitted.split("\n", 1)[0];
      expect(firstLine, `emitted "${name}" bin lost its shebang during build`).toBe(BUN_SHEBANG);

      // Execute the file directly (no interpreter prefix), exactly like the
      // kernel does when bunx runs the installed bin symlink on Linux.
      await chmod(emittedPath, 0o755);
      const run = Bun.spawn([emittedPath, "--help"], {
        cwd: tempOutDir,
        stdout: "pipe",
        stderr: "pipe",
      });
      const runExitCode = await run.exited;
      const stderr = await new Response(run.stderr).text();

      expect(runExitCode, `"${name}" bin failed to execute directly:\n${stderr}`).toBe(0);
    }
  }, 60_000);
});
