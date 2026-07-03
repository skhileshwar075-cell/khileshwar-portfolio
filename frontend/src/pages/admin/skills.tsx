import { useState } from "react";
import { useListSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CATEGORIES = ["Languages", "Frontend", "Backend", "Database", "Testing", "AI Tools", "DevOps", "Other"];

type SkillForm = { name: string; category: string; level: string; };
const emptyForm: SkillForm = { name: "", category: "Frontend", level: "80" };

export default function AdminSkills() {
  const { data: skills = [], isLoading } = useListSkills();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<SkillForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { mutate: create, isPending: creating } = useCreateSkill({
    mutation: {
      onSuccess: () => { toast.success("Skill added"); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to add skill"),
    },
  });
  const { mutate: update, isPending: updating } = useUpdateSkill({
    mutation: {
      onSuccess: () => { toast.success("Skill updated"); setEditing(null); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to update skill"),
    },
  });
  const { mutate: del } = useDeleteSkill({
    mutation: {
      onSuccess: () => toast.success("Skill deleted"),
      onError: () => toast.error("Failed to delete skill"),
    },
  });

  function openEdit(s: (typeof skills)[0]) {
    setEditing(s.id);
    setForm({ name: s.name, category: s.category ?? "Frontend", level: String(s.level ?? 80) });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: form.name, category: form.category, level: parseInt(form.level) };
    if (editing) update({ id: editing, data: payload });
    else create({ data: payload });
  }

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-muted-foreground text-sm">{skills.length} total</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Skill
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editing ? "Edit Skill" : "New Skill"}</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Level (0–100)</Label>
              <Input type="number" min="0" max="100" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={creating || updating}><Save className="h-4 w-4 mr-2" />{editing ? "Update" : "Add"}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="h-40 bg-card animate-pulse rounded-xl border border-border" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h2>
              <div className="space-y-2">
                {catSkills.map((s) => (
                  <div key={s.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-muted-foreground">{s.level ?? 0}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${s.level ?? 0}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm(`Delete "${s.name}"?`)) del({ id: s.id }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border border-border border-dashed rounded-xl">No skills yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
