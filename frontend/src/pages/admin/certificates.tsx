import { useState } from "react";
import { useListCertificates, useCreateCertificate, useUpdateCertificate, useDeleteCertificate } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, X, Save, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type CertForm = { title: string; issuer: string; issueDate: string; expirationDate: string; credentialId: string; credentialUrl: string; };
const emptyForm: CertForm = { title: "", issuer: "", issueDate: "", expirationDate: "", credentialId: "", credentialUrl: "" };

export default function AdminCertificates() {
  const { data: certs = [], isLoading } = useListCertificates();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<CertForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { mutate: create, isPending: creating } = useCreateCertificate({
    mutation: {
      onSuccess: () => { toast.success("Certificate added"); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to add certificate"),
    },
  });
  const { mutate: update, isPending: updating } = useUpdateCertificate({
    mutation: {
      onSuccess: () => { toast.success("Updated"); setEditing(null); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to update"),
    },
  });
  const { mutate: del } = useDeleteCertificate({
    mutation: {
      onSuccess: () => toast.success("Deleted"),
      onError: () => toast.error("Failed to delete"),
    },
  });

  function openEdit(c: (typeof certs)[0]) {
    setEditing(c.id);
    setForm({ title: c.title, issuer: c.issuer, issueDate: c.issueDate ?? "", expirationDate: c.expirationDate ?? "", credentialId: c.credentialId ?? "", credentialUrl: c.credentialUrl ?? "" });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, issueDate: form.issueDate || undefined, expirationDate: form.expirationDate || undefined, credentialId: form.credentialId || undefined, credentialUrl: form.credentialUrl || undefined };
    if (editing) update({ id: editing, data: payload });
    else create({ data: payload });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Certifications</h1>
          <p className="text-muted-foreground text-sm">{certs.length} total</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Certificate
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{editing ? "Edit" : "New"} Certificate</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Issuer *</Label><Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Issue Date (YYYY-MM)</Label><Input value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} placeholder="2023-06" /></div>
            <div className="space-y-1.5"><Label>Expiration (YYYY-MM)</Label><Input value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Credential ID</Label><Input value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Credential URL</Label><Input value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} type="url" /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={creating || updating}><Save className="h-4 w-4 mr-2" />{editing ? "Update" : "Add"}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-card animate-pulse rounded-xl border border-border" />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex gap-3">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-sm text-primary">{c.issuer}</p>
                {c.issueDate && <p className="text-xs text-muted-foreground mt-1">{c.issueDate}{c.expirationDate ? ` → ${c.expirationDate}` : ""}</p>}
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline"><ExternalLink className="h-3 w-3" />View Credential</a>}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete?")) del({ id: c.id }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
          {certs.length === 0 && <div className="text-center py-16 text-muted-foreground border border-border border-dashed rounded-xl col-span-2">No certificates yet.</div>}
        </div>
      )}
    </div>
  );
}
