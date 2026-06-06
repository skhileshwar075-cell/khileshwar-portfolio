import { useState } from "react";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, Star, ExternalLink, Github, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STATUSES = ["in-progress", "completed", "archived"];
const CATEGORIES = ["Full Stack", "Frontend", "Backend", "AI", "Mobile", "Other"];

type ProjectForm = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problemStatement: string;
  solution: string;
  features: string;
  techStack: string;
  githubUrl: string;
  liveDemoUrl: string;
  featured: boolean;
  category: string;
  status: string;
  challenges: string;
  futureScope: string;
};

const emptyForm: ProjectForm = {
  title: "", slug: "", shortDescription: "", description: "",
  problemStatement: "", solution: "", features: "", techStack: "",
  githubUrl: "", liveDemoUrl: "", featured: false,
  category: "Full Stack", status: "in-progress",
  challenges: "", futureScope: "",
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProjects() {
  const { data: projects = [], isLoading } = useListProjects({});
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { mutate: create, isPending: creating } = useCreateProject({
    mutation: {
      onSuccess: () => { toast.success("Project created"); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to create project"),
    },
  });
  const { mutate: update, isPending: updating } = useUpdateProject({
    mutation: {
      onSuccess: () => { toast.success("Project updated"); setEditing(null); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to update project"),
    },
  });
  const { mutate: del } = useDeleteProject({
    mutation: {
      onSuccess: () => toast.success("Project deleted"),
      onError: () => toast.error("Failed to delete project"),
    },
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(p: (typeof projects)[0]) {
    setEditing(p.id);
    setForm({
      title: p.title ?? "",
      slug: p.slug ?? "",
      shortDescription: p.shortDescription ?? "",
      description: p.description ?? "",
      problemStatement: p.problemStatement ?? "",
      solution: p.solution ?? "",
      features: p.features ?? "",
      techStack: Array.isArray(p.techStack) ? (p.techStack as string[]).join(", ") : "",
      githubUrl: p.githubUrl ?? "",
      liveDemoUrl: p.liveDemoUrl ?? "",
      featured: p.featured ?? false,
      category: p.category ?? "Full Stack",
      status: p.status ?? "in-progress",
      challenges: p.challenges ?? "",
      futureScope: p.futureScope ?? "",
    });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      githubUrl: form.githubUrl || undefined,
      liveDemoUrl: form.liveDemoUrl || undefined,
      problemStatement: form.problemStatement || undefined,
      solution: form.solution || undefined,
      features: form.features || undefined,
      description: form.description || undefined,
      challenges: form.challenges || undefined,
      futureScope: form.futureScope || undefined,
    };
    if (editing) {
      update({ id: editing, data: payload });
    } else {
      create({ data: payload });
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm">{projects.length} total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{editing ? "Edit Project" : "New Project"}</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} required />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Short Description *</Label>
            <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Problem Statement</Label>
              <Textarea value={form.problemStatement} onChange={(e) => setForm({ ...form, problemStatement: e.target.value })} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Solution</Label>
              <Textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Features (one per line)</Label>
            <Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Tech Stack (comma-separated) *</Label>
            <Input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>GitHub URL</Label>
              <Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} type="url" />
            </div>
            <div className="space-y-1.5">
              <Label>Live Demo URL</Label>
              <Input value={form.liveDemoUrl} onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })} type="url" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Challenges</Label>
              <Textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Future Scope</Label>
              <Textarea value={form.futureScope} onChange={(e) => setForm({ ...form, futureScope: e.target.value })} rows={2} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={creating || updating}>
              <Save className="h-4 w-4 mr-2" /> {editing ? "Update" : "Create"} Project
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-card animate-pulse rounded-xl border border-border" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{p.title}</h3>
                  {p.featured && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 shrink-0" />}
                  <Badge variant="secondary" className="text-xs shrink-0">{p.category}</Badge>
                  <Badge variant={p.status === "completed" ? "default" : "outline"} className="text-xs shrink-0 capitalize">{p.status?.replace("-", " ")}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{p.shortDescription}</p>
                <div className="flex gap-3 mt-2">
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Github className="h-3 w-3" />Code</a>}
                  {p.liveDemoUrl && <a href={p.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ExternalLink className="h-3 w-3" />Demo</a>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm(`Delete "${p.title}"?`)) del({ id: p.id }); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border border-border border-dashed rounded-xl">
              No projects yet. Create your first one!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
