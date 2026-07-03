import { useState, useEffect, useRef } from "react";
import {
  useListCertificates,
  useCreateCertificate,
  useUpdateCertificate,
  useDeleteCertificate,
  type CertificateInput,
} from "@workspace/api-client-react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Award,
  ExternalLink,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PdfPreview } from "@/components/pdf-preview";

type CertForm = {
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
  description: string;
  duration: string;
  grade: string;
  skills: string[];
  imageUrl: string;
  featured: boolean;
};

const emptyForm: CertForm = {
  title: "",
  issuer: "",
  issueDate: "",
  expirationDate: "",
  credentialId: "",
  credentialUrl: "",
  description: "",
  duration: "",
  grade: "",
  skills: [],
  imageUrl: "",
  featured: false,
};

export default function AdminCertificates() {
  const { data: certs = [], isLoading } = useListCertificates();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<CertForm>(emptyForm);
  const [skillValue, setSkillValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: create, isPending: creating } = useCreateCertificate({
    mutation: {
      onSuccess: () => {
        toast.success("Certificate added");
        setShowForm(false);
        setEditing(null);
        setForm(emptyForm);
      },
      onError: () => toast.error("Failed to add certificate"),
    },
  });

  const { mutate: update, isPending: updating } = useUpdateCertificate({
    mutation: {
      onSuccess: () => {
        toast.success("Certificate updated");
        setEditing(null);
        setShowForm(false);
        setForm(emptyForm);
      },
      onError: () => toast.error("Failed to update certificate"),
    },
  });

  const { mutate: del } = useDeleteCertificate({
    mutation: {
      onSuccess: () => toast.success("Certificate deleted"),
      onError: () => toast.error("Failed to delete certificate"),
    },
  });

  useEffect(() => {
    if (!showForm && !editing) {
      setForm(emptyForm);
      setSkillValue("");
      setImageTab("upload");
    }
  }, [showForm, editing]);

  function openEdit(cert: (typeof certs)[0]) {
    setEditing(cert.id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate ?? "",
      expirationDate: cert.expirationDate ?? "",
      credentialId: cert.credentialId ?? "",
      credentialUrl: cert.credentialUrl ?? "",
      description: cert.description ?? "",
      duration: cert.duration ?? "",
      grade: cert.grade ?? "",
      skills: cert.skills ?? [],
      imageUrl: cert.imageUrl ?? "",
      featured: cert.featured ?? false,
    });
    setShowForm(true);
  }

  function buildPayload(): CertificateInput {
    return {
      title: form.title,
      issuer: form.issuer,
      issueDate: form.issueDate,
      expirationDate: form.expirationDate || undefined,
      credentialId: form.credentialId || undefined,
      credentialUrl: form.credentialUrl || undefined,
      description: form.description || undefined,
      duration: form.duration || undefined,
      grade: form.grade || undefined,
      skills: form.skills.length ? form.skills : undefined,
      imageUrl: form.imageUrl || undefined,
      featured: form.featured,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = buildPayload();
    if (editing) update({ id: editing, data: payload });
    else create({ data: payload });
  }

  function addSkill(value: string) {
    const skill = value.trim();
    if (!skill) return;
    if (form.skills.includes(skill)) {
      toast.error("Skill already added");
      return;
    }
    setForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setSkillValue("");
  }

  function removeSkill(skill: string) {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((item) => item !== skill) }));
  }

  function isPdfFile(file: File) {
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  }

  function isPdfValue(value: string) {
    return (
      value.startsWith("data:application/pdf") ||
      /\.pdf($|[?#])/i.test(value)
    );
  }

  function processFile(file: File) {
    const isImage = file.type.startsWith("image/");
    const isPdf = isPdfFile(file);

    if (!isImage && !isPdf) {
      toast.error("Please select JPG, PNG, WebP, or PDF certificate files.");
      return;
    }

    const maxBytes = isPdf ? 10 * 1024 * 1024 : 4 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(isPdf ? "PDF must be under 10 MB" : "Image must be under 4 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      toast.success(`${isPdf ? "PDF" : "Image"} loaded — save to apply`);
    };
    reader.readAsDataURL(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-muted-foreground text-sm">Manage your credential listings, featured badges, and recruiter-ready details.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Certificate
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 mb-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{editing ? "Edit" : "Add"} Certificate</h2>
              <p className="text-sm text-muted-foreground">Include key metadata, skills, and an optional image to make credentials stand out.</p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" /> Close
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="space-y-1.5"><Label>Issuer *</Label><Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required /></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Issue Date</Label><Input type="month" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required /></div>
                <div className="space-y-1.5"><Label>Expiration Date</Label><Input type="month" value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} /></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="60 Hours" /></div>
                <div className="space-y-1.5"><Label>Grade</Label><Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="A, 92%" /></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Credential ID</Label><Input value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Credential URL</Label><Input type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://" /></div>
              </div>

              <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} maxLength={500} placeholder="Describe the certification and what it validates." /></div>
              <p className="text-xs text-muted-foreground">{form.description.length}/500 characters</p>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                  <Label>Skills</Label>
                  <span className="text-xs text-muted-foreground">Press Enter to add</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="flex items-center gap-2">
                      <span>{skill}</span>
                      <button type="button" onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  value={skillValue}
                  onChange={(e) => setSkillValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(skillValue);
                    }
                  }}
                  placeholder="Add skill and press Enter"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={form.featured} onCheckedChange={(value) => setForm({ ...form, featured: value })} />
                <div>
                  <Label className="text-sm">Featured certificate</Label>
                  <p className="text-xs text-muted-foreground">Featured items appear first on the public portfolio.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" disabled={creating || updating}>
                  <Save className="h-4 w-4" /> {editing ? "Update" : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>
                  Cancel
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-muted p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold">Certificate Image</h3>
                    <p className="text-xs text-muted-foreground">Upload an image or paste a direct URL for preview.</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    <Upload className="h-3.5 w-3.5" /> {imageTab === "upload" ? "Upload" : "URL"}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2 rounded-3xl border border-border p-1 bg-background">
                    <button
                      type="button"
                      className={`flex-1 rounded-2xl px-4 py-2 text-sm font-medium ${imageTab === "upload" ? "bg-card text-foreground" : "text-muted-foreground"}`}
                      onClick={() => setImageTab("upload")}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-2xl px-4 py-2 text-sm font-medium ${imageTab === "url" ? "bg-card text-foreground" : "text-muted-foreground"}`}
                      onClick={() => setImageTab("url")}
                    >
                      Image URL
                    </button>
                  </div>

                  {imageTab === "upload" ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center transition ${isDragging ? "border-primary bg-primary/10" : "border-border bg-background/80"}`}
                    >
                      <Upload className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
                      <p className="font-medium">Drag & drop a file here</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP, PDF · Max 4 MB images / 10 MB PDFs</p>
                      <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileInput} />
                    </div>
                  ) : (
                    <Input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/certificate.png or certificate.pdf" />
                  )}

                  <div className="rounded-3xl border border-border overflow-hidden bg-card">
                    {form.imageUrl ? (
                      isPdfValue(form.imageUrl) ? (
                        <PdfPreview src={form.imageUrl} className="min-h-[192px]" fallbackLabel="Open PDF in a new tab" />
                      ) : (
                        <img src={form.imageUrl} alt="Certificate preview" className="h-48 w-full object-cover" />
                      )
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
                        <Award className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-56 rounded-3xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No certificates yet. Add one to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certs.map((cert) => (
            <div key={cert.id} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-muted-foreground">
                    {cert.featured && <Badge className="bg-amber-100 text-amber-700">Featured</Badge>}
                    {cert.credentialId && <span>#{cert.credentialId}</span>}
                  </div>
                  <h3 className="mt-2 truncate text-lg font-semibold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div>{cert.issueDate}</div>
                {cert.expirationDate && <div>Expires {cert.expirationDate}</div>}
                {cert.duration && <div>Duration: {cert.duration}</div>}
                {cert.grade && <div>Grade: {cert.grade}</div>}
              </div>

              {cert.description && <p className="mt-4 text-sm leading-6 text-foreground/90">{cert.description}</p>}

              {cert.skills && cert.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-wide">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => openEdit(cert)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto text-destructive" onClick={() => { if (confirm("Delete this certificate?")) del({ id: cert.id }); }}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="default" size="sm" className="w-full sm:w-auto">
                      <ExternalLink className="h-3.5 w-3.5" /> View Credential
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
