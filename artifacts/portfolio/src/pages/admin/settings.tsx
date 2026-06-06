import { useState, useEffect } from "react";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type SettingsForm = {
  siteTitle: string; siteDescription: string; heroText: string; heroSubtext: string;
  ownerName: string; ownerTitle: string; ownerBio: string; email: string;
  githubUrl: string; linkedinUrl: string; twitterUrl: string; resumeUrl: string;
  metaKeywords: string; googleAnalyticsId: string;
};

const emptyForm: SettingsForm = {
  siteTitle: "", siteDescription: "", heroText: "", heroSubtext: "",
  ownerName: "", ownerTitle: "", ownerBio: "", email: "",
  githubUrl: "", linkedinUrl: "", twitterUrl: "", resumeUrl: "",
  metaKeywords: "", googleAnalyticsId: "",
};

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const [form, setForm] = useState<SettingsForm>(emptyForm);

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
        email: settings.email ?? "",
        githubUrl: settings.githubUrl ?? "",
        linkedinUrl: settings.linkedinUrl ?? "",
        twitterUrl: settings.twitterUrl ?? "",
        resumeUrl: settings.resumeUrl ?? "",
        metaKeywords: settings.metaKeywords ?? "",
        googleAnalyticsId: settings.googleAnalyticsId ?? "",
      });
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
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v || undefined])
    );
    updateSettings({ data: payload });
  }

  const f = (key: keyof SettingsForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  if (isLoading) {
    return <div className="p-6 space-y-4">{[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-card animate-pulse rounded-lg border border-border" />)}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your portfolio's content and appearance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        {/* Site Info */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-3">Site Information</h2>
          <div className="space-y-1.5"><Label>Site Title</Label><Input {...f("siteTitle")} placeholder="Alex Chen | Portfolio" /></div>
          <div className="space-y-1.5"><Label>Site Description</Label><Input {...f("siteDescription")} placeholder="Full Stack Developer & AI Enthusiast" /></div>
          <div className="space-y-1.5"><Label>Hero Text</Label><Input {...f("heroText")} placeholder="Building tomorrow's software, today" /></div>
          <div className="space-y-1.5"><Label>Hero Subtext</Label><Input {...f("heroSubtext")} placeholder="CS Graduate · Full Stack Dev · AI Enthusiast" /></div>
          <div className="space-y-1.5"><Label>Meta Keywords</Label><Input {...f("metaKeywords")} placeholder="full stack developer, react, node.js, AI" /></div>
          <div className="space-y-1.5"><Label>Google Analytics ID</Label><Input {...f("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" /></div>
        </section>

        {/* Owner Info */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-3">About You</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Your Name</Label><Input {...f("ownerName")} /></div>
            <div className="space-y-1.5"><Label>Your Title</Label><Input {...f("ownerTitle")} placeholder="Full Stack Developer" /></div>
          </div>
          <div className="space-y-1.5"><Label>Bio</Label><Textarea {...f("ownerBio")} rows={4} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input {...f("email")} type="email" /></div>
          <div className="space-y-1.5"><Label>Resume URL</Label><Input {...f("resumeUrl")} type="url" placeholder="https://..." /></div>
        </section>

        {/* Social Links */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-3">Social Links</h2>
          <div className="space-y-1.5"><Label>GitHub URL</Label><Input {...f("githubUrl")} type="url" placeholder="https://github.com/username" /></div>
          <div className="space-y-1.5"><Label>LinkedIn URL</Label><Input {...f("linkedinUrl")} type="url" placeholder="https://linkedin.com/in/username" /></div>
          <div className="space-y-1.5"><Label>Twitter / X URL</Label><Input {...f("twitterUrl")} type="url" placeholder="https://twitter.com/username" /></div>
        </section>

        <Button type="submit" size="lg" disabled={isPending}>
          <Save className="h-4 w-4 mr-2" />
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
