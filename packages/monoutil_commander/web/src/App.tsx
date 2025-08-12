import { useEffect, useMemo, useState } from "react";
import type { Project } from "./api";
import { addProject, getProjects, linkProject, removeProject } from "./api";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPath, setNewPath] = useState("");
  const [newName, setNewName] = useState("");
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [watch, setWatch] = useState(false);

  const sorted = useMemo(() =>
    [...projects].sort((a, b) => a.createdAt - b.createdAt)
  , [projects]);

  async function refresh() {
    try {
      setLoading(true);
      setError(null);
      const list = await getProjects();
      setProjects(list);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newPath.trim()) return;
    try {
      setLoading(true);
      setError(null);
      await addProject(newPath.trim(), newName.trim() || undefined);
      setNewPath("");
      setNewName("");
      await refresh();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(id: string) {
    try {
      setLoading(true);
      setError(null);
      await removeProject(id);
      await refresh();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  async function onLink(p: Project) {
    try {
      setError(null);
      setLinkingId(p.id);
      const res = await linkProject(p.path, watch);
      console.log("link result", res);
      if (!watch) {
        // Not watching; show summarised outcome
        alert(`Link finished with code ${res.code}`);
      } else {
        alert(`Watch started (pid: ${res.pid})`);
      }
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLinkingId(null);
    }
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", padding: 16 }}>
      <h1>Monoutil Commander</h1>
      <p>Manage local projects/monorepos and trigger local-package-link without symlinks.</p>

      <section style={{ marginBottom: 24 }}>
        <h2>Add Project</h2>
        <form onSubmit={onAdd} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Absolute path to project"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            style={{ width: 400, padding: 6 }}
          />
          <input
            type="text"
            placeholder="Optional name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ width: 220, padding: 6 }}
          />
          <button type="submit" disabled={loading || !newPath.trim()}>
            Add
          </button>
        </form>
      </section>

      <section>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Projects</h2>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={watch} onChange={(e) => setWatch(e.target.checked)} /> Watch link
          </label>
          {loading && <span>Loading...</span>}
        </div>
        {error && (
          <div style={{ color: "#b00020", marginTop: 8 }}>Error: {error}</div>
        )}
        {!sorted.length && <p>No projects yet. Add one above.</p>}
        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {sorted.map((p) => (
            <li key={p.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name ?? "(no name)"} <span style={{ fontWeight: 400, color: "#666" }}>• {p.type}</span></div>
                  <div style={{ fontFamily: "monospace", color: "#333" }}>{p.path}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => onLink(p)} disabled={!!linkingId}>
                    {linkingId === p.id ? "Linking..." : watch ? "Start Watch Link" : "Run Link"}
                  </button>
                  <button onClick={() => onRemove(p.id)} disabled={loading}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
