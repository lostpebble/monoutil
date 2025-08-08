import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type TCatalogue, type TConfig, type TRepoLink, zCatalogue, zConfig } from "./schemas";

export class ConfigRepo {
  readonly root: string;
  constructor(root: string) {
    this.root = root;
  }

  // A simple check to verify the directory is a git repo
  isGitRepo(): boolean {
    return existsSync(join(this.root, ".git"));
  }

  private ensureDir() {
    if (!existsSync(this.root)) mkdirSync(this.root, { recursive: true });
  }

  private configPath(): string {
    return join(this.root, "monoutil_connect.config.json");
  }

  load(): TConfig {
    const p = this.configPath();
    if (!existsSync(p)) return { catalogues: {}, repos: [] };
    const json = JSON.parse(readFileSync(p, "utf-8"));
    return zConfig.parse(json);
  }

  save(config: TConfig): void {
    this.ensureDir();
    const p = this.configPath();
    const validated = zConfig.parse(config);
    writeFileSync(p, JSON.stringify(validated, null, 2));
  }

  upsertCatalogue(cat: TCatalogue): void {
    const cfg = this.load();
    const validated = zCatalogue.parse(cat);
    cfg.catalogues[validated.name] = validated;
    this.save(cfg);
  }

  listCatalogues(): TCatalogue[] {
    const cfg = this.load();
    return Object.values(cfg.catalogues);
  }

  getCatalogue(name: string): TCatalogue | undefined {
    const cfg = this.load();
    return cfg.catalogues[name];
  }

  upsertRepoLink(repo: TRepoLink): void {
    const cfg = this.load();
    const idx = cfg.repos.findIndex((r) => r.id === repo.id);
    if (idx >= 0) cfg.repos[idx] = repo;
    else cfg.repos.push(repo);
    this.save(cfg);
  }

  listRepos(): TRepoLink[] {
    return this.load().repos;
  }
}
