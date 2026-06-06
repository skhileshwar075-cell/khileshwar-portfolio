import { useState } from "react";
import { useListExperience, useCreateExperience, useUpdateExperience, useDeleteExperience } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, X, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type ExpForm = { organization: string; position: string; location: string; startDate: string; endDate: string; current: boolean; description: string; };
const emptyForm: ExpForm = { organization: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" };

export default function AdminExperience() {
  const { data: experience = [], isLoading } = useListExperience();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ExpForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { mutate: create, isPending: creating } = useCreateExperience({
    mutation: {
      onSuccess: () => { toast.success("Experience added"); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to add experience"),
    },
  });
  const { mutate: update, isPending: updating } = useUpdateExperience({
    mutation: {
      onSuccess: () => { toast.success("Updated"); setEditing(null); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to update"),
    },
  });
  const { mutate: del } = useDeleteExperience({
    mutation: {
      onSuccess: () => toast.success("Deleted"),
      onError: () => toast.error("Failed to delete"),
    },
  });

  function openEdit(e: (typeof experience)[0]) {
    setEditing(e.id);
    setForm({ organization: e.organization, position: e.position, location: e.location ?? "", startDate: e.startDate ?? "", endDate: e.endDate ?? "", current: e.current ?? false, description: e.description ?? "" });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, location: form.location || undefined, endDate: form.current ? null : (form.endDate || undefined), description: form.description || undefined };
    if (editing) update({ id: editing, data: payload });
    else create({ data: payload });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Experience</h1>
          <p className="text-muted-foreground text-sm">{experience.length} entries</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{editing ? "Edit" : "New"} Experience</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Position *</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Organization *</Label><Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required /></div>
          </div>
          <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country or Remote" /></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Start Date (YYYY-MM) *</Label><Input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="2023-01" required /></div>
            <div className="space-y-1.5"><Label>End Date (YYYY-MM)</Label><Input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="2024-06" disabled={form.current} /></div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? "" : form.endDate })} className="rounded" />
                <span className="text-sm">Currently working here</span>
              </label>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
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
          {experience.map((e) => (
            <div key={e.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium">{e.position}</h3>
                  <span className="text-muted-foreground">@</span>
                  <span className="text-primary">{e.organization}</span>
                  {e.current && <Badge variant="default" className="text-xs">Current</Badge>}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3" />
                  {e.startDate} — {e.current ? "Present" : (e.endDate ?? "Present")}
                  {e.location && <span className="ml-2">· {e.location}</span>}
                </div>
                {e.description && <p className="text-sm text-muted-foreground line-clamp-2">{e.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete this experience?")) del({ id: e.id }); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {experience.length === 0 && <div className="text-center py-16 text-muted-foreground border border-border border-dashed rounded-xl">No experience entries yet.</div>}
        </div>
      )}
    </div>
  );
}
