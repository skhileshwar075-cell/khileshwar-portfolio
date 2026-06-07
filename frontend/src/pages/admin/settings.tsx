import { useState, useEffect, useRef } from "react";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { Save, User, ImageIcon, AlertCircle, Upload, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type SettingsForm = {
  siteTitle: string;
  siteDescription: string;
  heroText: string;
  heroSubtext: string;
  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  resumeUrl: string;
  metaKeywords: string;
  card1Title: string;
  card1Body: string;
  card2Title: string;
  card2Body: string;
  card3Title: string;
  card3Body: string;
};

const emptyForm: SettingsForm = {
  siteTitle: "", siteDescription: "", heroText: "", heroSubtext: "",
  ownerName: "", ownerTitle: "", ownerBio: "", avatarUrl: "",
  githubUrl: "", linkedinUrl: "", twitterUrl: "", resumeUrl: "",
  metaKeywords: "",
  card1Title: "AI-Augmented Development",
  card1Body: "I treat AI tools as a superpower — GitHub Copilot, Claude, and ChatGPT are part of my daily workflow, letting me ship faster without sacrificing quality.",
  card2Title: "Hackathon Mindset",
  card2Body: "Fast iteration, demo-driven development, and shipping something real. I've placed top 3 in 5 out of 8 hackathons by focusing on impact over perfection.",
  card3Title: "Real Problems, Real Solutions",
  card3Body: "Every project starts with a genuine problem. Whether it's attendance fraud, skill-matching for developers, or personalised learning — the tech serves the mission.",
};

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarTab, setAvatarTab] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        siteTitle: settings.siteTitle ?? "",
        siteDescription: settings.siteDescription ?? "",
        heroText: settings.heroText ?? "",
        heroSubtext: settings.heroSubtext ?? "",
        ownerName: settings.ownerName ?? "",
        ownerTitle: settings.ownerTitle ?? "",
        ownerBio: settings.ownerBio ?? "",
        avatarUrl: settings.avatarUrl ?? "",
        githubUrl: settings.githubUrl ?? "",
        linkedinUrl: settings.linkedinUrl ?? "",
        twitterUrl: settings.twitterUrl ?? "",
        resumeUrl: settings.resumeUrl ?? "",
        metaKeywords: settings.metaKeywords ?? "",
        card1Title: settings.card1Title ?? emptyForm.card1Title,
        card1Body: settings.card1Body ?? emptyForm.card1Body,
        card2Title: settings.card2Title ?? emptyForm.card2Title,
        card2Body: settings.card2Body ?? emptyForm.card2Body,
        card3Title: settings.card3Title ?? emptyForm.card3Title,
        card3Body: settings.card3Body ?? emptyForm.card3Body,
      });
      setAvatarError(false);
    }
  }, [settings]);

  const { mutate: updateSettings, isPending } = useUpdateSettings({
    mutation: {
      onSuccess: () => toast.success("Settings saved!"),
      onError: () => toast.error("Failed to save settings"),
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, string | undefined> = {};
    for (const [k, v] of Object.entries(form)) {
      // avatarUrl must always be sent (even as empty string) so the backend can clear it
      if (k === "avatarUrl") {
        payload[k] = v;
      } else {
        payload[k] = v || undefined;
      }
    }
    updateSettings({ data: payload });
  }

  const field = (key: keyof SettingsForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [key]: e.target.value });
      if (key === "avatarUrl") setAvatarError(false);
    },
  });

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setForm((f) => ({ ...f, avatarUrl: dataUrl }));
      setAvatarError(false);
      toast.success("Photo loaded — click Save Settings to apply");
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

  const APPROACH_CARDS = [
    { num: 1, titleKey: "card1Title" as const, bodyKey: "card1Body" as const, label: "Card 1" },
    { num: 2, titleKey: "card2Title" as const, bodyKey: "card2Body" as const, label: "Card 2" },
    { num: 3, titleKey: "card3Title" as const, bodyKey: "card3Body" as const, label: "Card 3" },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-12 bg-card animate-pulse rounded-lg border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure your portfolio's content and appearance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

        {/* ── Site Info ── */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-3">Site Information</h2>
          <div className="space-y-1.5">
            <Label>Site Title</Label>
            <Input {...field("siteTitle")} placeholder="Shubh Chen | Portfolio" />
          </div>
          <div className="space-y-1.5">
            <Label>Site Description</Label>
            <Input {...field("siteDescription")} placeholder="Full Stack Developer & AI Enthusiast" />
          </div>
          <div className="space-y-1.5">
            <Label>Hero Text</Label>
            <Input {...field("heroText")} placeholder="Building tomorrow's software, today" />
          </div>
          <div className="space-y-1.5">
            <Label>Hero Subtext</Label>
            <Input {...field("heroSubtext")} placeholder="CS Graduate · Full Stack Dev · AI Enthusiast" />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Keywords</Label>
            <Input {...field("metaKeywords")} placeholder="full stack developer, react, node.js, AI" />
          </div>
        </section>

        {/* ── About You ── */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-3">About You</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Your Name</Label>
              <Input {...field("ownerName")} placeholder="Shubh Chen" />
            </div>
            <div className="space-y-1.5">
              <Label>Your Title</Label>
              <Input {...field("ownerTitle")} placeholder="Full Stack Developer" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea {...field("ownerBio")} rows={4} placeholder="A passionate developer who loves building things that matter." />
          </div>
          <div className="space-y-1.5">
            <Label>Resume URL</Label>
            <Input {...field("resumeUrl")} type="url" placeholder="https://..." />
          </div>
        </section>

        {/* ── Profile Picture ── */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-3">Profile Picture</h2>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="flex gap-5 items-start">
            {/* Preview + remove */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {form.avatarUrl && !avatarError ? (
                  <img
                    src={form.avatarUrl}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
                    <User className="h-10 w-10" />
                    <span className="text-[10px] font-medium">No photo</span>
                  </div>
                )}
              </div>
              {form.avatarUrl && !avatarError && (
                <button
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, avatarUrl: "" })); setAvatarError(false); }}
                  className="flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-3">
              {/* Tab switcher */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setAvatarTab("upload")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    avatarTab === "upload"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" /> Upload from device
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarTab("url")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    avatarTab === "url"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link2 className="h-3.5 w-3.5" /> Use URL
                </button>
              </div>

              {avatarTab === "upload" ? (
                /* ── Upload zone ── */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to choose a photo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">or drag & drop here</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">JPG, PNG, WebP · Max 4 MB</p>
                </div>
              ) : (
                /* ── URL input ── */
                <div className="space-y-2">
                  <Input
                    {...field("avatarUrl")}
                    type="url"
                    placeholder="https://avatars.githubusercontent.com/u/..."
                  />
                  {avatarError && form.avatarUrl && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Could not load image — make sure it's a direct image link.
                    </p>
                  )}
                  {!form.avatarUrl && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Paste any public image URL (GitHub, Cloudinary, imgur…)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Approach Cards ── */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-semibold">About Page — Approach Cards</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              The three highlight cards shown on your About page under your bio.
            </p>
          </div>

          {APPROACH_CARDS.map(({ num, titleKey, bodyKey, label }) => (
            <div key={num} className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  {...field(titleKey)}
                  placeholder={`Card ${num} title`}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  {...field(bodyKey)}
                  rows={3}
                  placeholder={`Card ${num} description`}
                />
              </div>
            </div>
          ))}
        </section>

        {/* ── Social Links ── */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-3">Social Links</h2>
          <div className="space-y-1.5">
            <Label>GitHub URL</Label>
            <Input {...field("githubUrl")} type="url" placeholder="https://github.com/username" />
          </div>
          <div className="space-y-1.5">
            <Label>LinkedIn URL</Label>
            <Input {...field("linkedinUrl")} type="url" placeholder="https://linkedin.com/in/username" />
          </div>
          <div className="space-y-1.5">
            <Label>Twitter / X URL</Label>
            <Input {...field("twitterUrl")} type="url" placeholder="https://twitter.com/username" />
          </div>
        </section>

        <Button type="submit" size="lg" disabled={isPending}>
          <Save className="h-4 w-4 mr-2" />
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
