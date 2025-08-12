import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { CommanderConfig, Project } from "./types";

const APP_FOLDER = "monoutil_commander";
const CONFIG_FILENAME = "config.json";

const defaultConfig: CommanderConfig = { projects: [] };

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

export function getStorageDir() {
  const tmp = os.tmpdir();
  return path.join(tmp, APP_FOLDER);
}

export function getConfigPath() {
  return path.join(getStorageDir(), CONFIG_FILENAME);
}

export async function loadConfig(): Promise<CommanderConfig> {
  const storageDir = getStorageDir();
  await ensureDir(storageDir);
  const cfgPath = getConfigPath();
  try {
    const buf = await fs.readFile(cfgPath, "utf8");
    return JSON.parse(buf) as CommanderConfig;
  } catch (err: any) {
    // Create default if doesn't exist or invalid
    await saveConfig(defaultConfig);
    return { ...defaultConfig };
  }
}

export async function saveConfig(cfg: CommanderConfig) {
  const storageDir = getStorageDir();
  await ensureDir(storageDir);
  await fs.writeFile(getConfigPath(), JSON.stringify(cfg, null, 2), "utf8");
}

export async function addProject(proj: Project) {
  const cfg = await loadConfig();
  const existingIdx = cfg.projects.findIndex((p) => p.id === proj.id || p.path === proj.path);
  if (existingIdx !== -1) {
    cfg.projects[existingIdx] = proj;
  } else {
    cfg.projects.push(proj);
  }
  await saveConfig(cfg);
  return proj;
}

export async function removeProject(id: string) {
  const cfg = await loadConfig();
  const before = cfg.projects.length;
  cfg.projects = cfg.projects.filter((p) => p.id !== id);
  const removed = before !== cfg.projects.length;
  await saveConfig(cfg);
  return removed;
}
