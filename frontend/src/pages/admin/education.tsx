import { useState } from "react";
import { useListEducation, useCreateEducation, useUpdateEducation, useDeleteEducation } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type EduForm = { degree: string; institution: string; startDate: string; endDate: string; current: boolean; grade: string; description: string; };
const emptyForm: EduForm = { degree: "", institution: "", startDate: "", endDate: "", current: false, grade: "", description: "" };

export default function AdminEducation() {
  const { data: education = [], isLoading } = useListEducation();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<EduForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { mutate: create, isPending: creating } = useCreateEducation({
    mutation: {
      onSuccess: () => { toast.success("Education added"); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to add education"),
    },
  });
  const { mutate: update, isPending: updating } = useUpdateEducation({
    mutation: {
      onSuccess: () => { toast.success("Updated"); setEditing(null); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to update"),
    },
  });
  const { mutate: del } = useDeleteEducation({
    mutation: {
      onSuccess: () => toast.success("Deleted"),
      onError: () => toast.error("Failed to delete"),
    },
  });

  function openEdit(e: (typeof education)[0]) {
    setEditing(e.id);
    setForm({ degree: e.degree, institution: e.institution, startDate: e.startDate ?? "", endDate: e.endDate ?? "", current: e.current ?? false, grade: e.grade ?? "", description: e.description ?? "" });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, endDate: form.current ? null : (form.endDate || undefined), grade: form.grade || undefined, description: form.description || undefined };
    if (editing) update({ id: editing, data: payload });
    else create({ data: payload });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Education</h1>
          <p className="text-muted-foreground text-sm">{education.length} entries</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{editing ? "Edit" : "New"} Education</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Degree *</Label><Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="B.Sc. Computer Science" required /></div>
            <div className="space-y-1.5"><Label>Institution *</Label><Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Start (YYYY-MM) *</Label><Input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="2019-09" required /></div>
            <div className="space-y-1.5"><Label>End (YYYY-MM)</Label><Input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.current} /></div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="rounded" />
                <span className="text-sm">Currently enrolled</span>
              </label>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Grade / GPA</Label><Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="3.8 GPA" /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={creating || updating}><Save className="h-4 w-4 mr-2" />{editing ? "Update" : "Add"}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-24 bg-card animate-pulse rounded-xl border border-border" />)}</div>
      ) : (
        <div className="space-y-3">
          {education.map((e) => (
            <div key={e.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{e.degree}</h3>
                <p className="text-primary text-sm">{e.institution}</p>
                <p className="text-xs text-muted-foreground mt-1">{e.startDate} — {e.current ? "Present" : (e.endDate ?? "")} {e.grade && `· ${e.grade}`}</p>
                {e.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete?")) del({ id: e.id }); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {education.length === 0 && <div className="text-center py-16 text-muted-foreground border border-border border-dashed rounded-xl">No education entries yet.</div>}
        </div>
      )}
    </div>
  );
}
