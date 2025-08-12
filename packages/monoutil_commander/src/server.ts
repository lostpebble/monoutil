import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { addProject, loadConfig, removeProject } from "./storage";
import { Project, ProjectType } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono();

// Enable CORS for API routes (useful in dev with Vite)
app.use("/api/*", cors());

app.get("/api/health", (c) => c.json({ status: "ok" }));

// Utilities
async function pathExists(p: string) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function detectProjectType(projectPath: string): Promise<ProjectType> {
  const pkgPath = path.join(projectPath, "package.json");
  try {
    const pkgRaw = await fs.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw);
    if (pkg && (pkg.workspaces || pkg.packages)) return "monorepo";
  } catch {}
  return "single";
}

app.get("/api/projects", async (c) => {
  const cfg = await loadConfig();
  return c.json(cfg.projects);
});

// Optional helper: get link-local-packages modules info for a project
app.get("/api/project-info", async (c) => {
  const url = new URL(c.req.url);
  const projectPathParam = url.searchParams.get("projectPath");
  if (!projectPathParam) return c.json({ error: "projectPath is required" }, 400);
  const projectPath = path.resolve(projectPathParam);
  if (!(await pathExists(projectPath))) return c.json({ error: "projectPath does not exist" }, 400);
  const cfgPath = path.join(projectPath, "link-local-packages.json");
  const localCfgPath = path.join(projectPath, "link-local-packages.local.json");
  const result: { modules: string[]; hasLocal: boolean } = { modules: [], hasLocal: false };
  try {
    const raw = await fs.readFile(cfgPath, "utf8");
    const json = JSON.parse(raw);
    if (Array.isArray(json?.modules)) {
      result.modules = json.modules.map((m: any) => m?.moduleName).filter(Boolean);
    }
  } catch {}
  try {
    await fs.stat(localCfgPath);
    result.hasLocal = true;
  } catch {}
  return c.json(result);
});

app.post("/api/projects", async (c) => {
  try {
    const body = (await c.req.json()) as {
      path: string;
      type?: ProjectType;
      name?: string;
      id?: string;
    };
    if (!body?.path) return c.json({ error: "path is required" }, 400);
    const normalizedPath = path.resolve(body.path);
    if (!(await pathExists(normalizedPath))) return c.json({ error: "path does not exist" }, 400);
    const computedType = body.type ?? (await detectProjectType(normalizedPath));
    const proj: Project = {
      id: body.id ?? crypto.randomUUID(),
      path: normalizedPath,
      type: computedType,
      name: body.name ?? path.basename(normalizedPath),
      createdAt: Date.now(),
    };
    await addProject(proj);
    return c.json(proj);
  } catch (err: any) {
    return c.json({ error: String(err?.message ?? err) }, 500);
  }
});

app.delete("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const removed = await removeProject(id);
  return c.json({ removed });
});

// Run linking using local-package-link via a Bun subprocess in the target cwd
app.post("/api/link", async (c) => {
  try {
    const body = (await c.req.json()) as { projectPath: string; watch?: boolean };
    if (!body?.projectPath) return c.json({ error: "projectPath is required" }, 400);
    const projectPath = path.resolve(body.projectPath);
    if (!(await pathExists(projectPath)))
      return c.json({ error: "projectPath does not exist" }, 400);

    const runnerPath = path.join(__dirname, "link-runner.ts");
    const cmd = ["bun", runnerPath, ...(body.watch ? ["--watch"] : [])];

    const proc = Bun.spawn({
      cmd,
      cwd: projectPath,
      stdout: "pipe",
      stderr: "pipe",
    });

    if (body.watch) {
      // Return immediately with PID for watch mode
      return c.json({ pid: proc.pid, status: "running" });
    } else {
      const stdout = await new Response(proc.stdout).text();
      const stderr = await new Response(proc.stderr).text();
      const code = await proc.exited;
      return c.json({ code, stdout, stderr });
    }
  } catch (err: any) {
    return c.json({ error: String(err?.message ?? err) }, 500);
  }
});

// Start server
const PORT = Number(process.env.PORT ?? 8787);
export default {
  port: PORT,
  fetch: app.fetch,
};

if (!process.env.VITEST) {
  Bun.serve({ port: PORT, fetch: app.fetch });
  console.log(`[monoutil_commander] listening on http://localhost:${PORT}`);
}
