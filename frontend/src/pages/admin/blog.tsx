import { useState } from "react";
import { useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, X, Save, Globe, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type BlogForm = { title: string; slug: string; excerpt: string; content: string; category: string; tags: string; published: boolean; };
const emptyForm: BlogForm = { title: "", slug: "", excerpt: "", content: "", category: "", tags: "", published: false };

export default function AdminBlog() {
  const { data: posts = [], isLoading } = useListBlogPosts({});
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { mutate: create, isPending: creating } = useCreateBlogPost({
    mutation: {
      onSuccess: () => { toast.success("Post created"); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to create post"),
    },
  });
  const { mutate: update, isPending: updating } = useUpdateBlogPost({
    mutation: {
      onSuccess: () => { toast.success("Post updated"); setEditing(null); setShowForm(false); setForm(emptyForm); },
      onError: () => toast.error("Failed to update post"),
    },
  });
  const { mutate: del } = useDeleteBlogPost({
    mutation: {
      onSuccess: () => toast.success("Post deleted"),
      onError: () => toast.error("Failed to delete post"),
    },
  });

  function openEdit(p: (typeof posts)[0]) {
    setEditing(p.id);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", content: p.content ?? "", category: p.category ?? "", tags: Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : "", published: p.published ?? false });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, excerpt: form.excerpt || undefined, category: form.category || undefined, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), content: form.content || undefined };
    if (editing) update({ id: editing, data: payload });
    else create({ data: payload });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground text-sm">{posts.filter((p) => p.published).length} published, {posts.filter((p) => !p.published).length} drafts</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{editing ? "Edit Post" : "New Post"}</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} required /></div>
            <div className="space-y-1.5"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="AI Development, Tutorial, etc." /></div>
            <div className="space-y-1.5"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, AI, TypeScript" /></div>
          </div>
          <div className="space-y-1.5"><Label>Excerpt</Label><Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div className="space-y-1.5">
            <Label>Content (Markdown)</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="font-mono text-sm" placeholder="# Title&#10;&#10;Write your post in markdown..." />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
            <span className="text-sm">Published (visible to public)</span>
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={creating || updating}><Save className="h-4 w-4 mr-2" />{editing ? "Update" : "Create"} Post</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl border border-border" />)}</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium">{p.title}</h3>
                  {p.published ? (
                    <Badge variant="default" className="text-xs gap-1"><Globe className="h-2.5 w-2.5" />Published</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs gap-1"><EyeOff className="h-2.5 w-2.5" />Draft</Badge>
                  )}
                  {p.category && <Badge variant="secondary" className="text-xs">{p.category}</Badge>}
                </div>
                {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-1">{p.excerpt}</p>}
                {p.publishedAt && <p className="text-xs text-muted-foreground mt-1">{new Date(p.publishedAt).toLocaleDateString()}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm(`Delete "${p.title}"?`)) del({ id: p.id }); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div className="text-center py-16 text-muted-foreground border border-border border-dashed rounded-xl">No posts yet. Write your first one!</div>}
        </div>
      )}
    </div>
  );
}
