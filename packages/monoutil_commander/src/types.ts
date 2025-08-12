export type ProjectType = "monorepo" | "single";

export interface Project {
  id: string;
  path: string;
  type: ProjectType;
  name?: string;
  createdAt: number;
}

export interface CommanderConfig {
  projects: Project[];
}
