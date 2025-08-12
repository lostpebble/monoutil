export type ProjectType = "monorepo" | "single";
export interface Project {
  id: string;
  path: string;
  type: ProjectType;
  name?: string;
  createdAt: number;
}

const headers = { "Content-Type": "application/json" } as const;

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`/api/projects`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  return res.json();
}

export async function addProject(path: string, name?: string) {
  const res = await fetch(`/api/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({ path, name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function removeProject(id: string) {
  const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function linkProject(projectPath: string, watch = false) {
  const res = await fetch(`/api/link`, {
    method: "POST",
    headers,
    body: JSON.stringify({ projectPath, watch }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getProjectInfo(projectPath: string): Promise<{ modules: string[]; hasLocal: boolean }> {
  const res = await fetch(`/api/project-info?projectPath=${encodeURIComponent(projectPath)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
