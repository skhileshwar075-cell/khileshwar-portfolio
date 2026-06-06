import { useState } from "react";
import { useSubmitContact, useGetSettings } from "@workspace/api-client-react";
import { Github, Linkedin, Twitter, Send, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Contact() {
  const { data: settings } = useGetSettings();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { mutate, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setSent(true);
        toast.success("Message sent! I'll get back to you soon.");
      },
      onError: () => {
        toast.error("Failed to send message. Please try again.");
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ data: form });
  }

  const socialLinks = [
    settings?.githubUrl && {
      href: settings.githubUrl,
      icon: Github,
      label: "GitHub",
      display: settings.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "@"),
    },
    settings?.linkedinUrl && {
      href: settings.linkedinUrl,
      icon: Linkedin,
      label: "LinkedIn",
      display: "Connect on LinkedIn",
    },
    settings?.twitterUrl && {
      href: settings.twitterUrl,
      icon: Twitter,
      label: "Twitter / X",
      display: "Follow on X",
    },
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string; display: string }[];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Contact
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Have a project in mind, a collaboration opportunity, or just want to
            connect? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Let's Talk</h2>
              <p className="text-muted-foreground leading-relaxed">
                I'm open to full-time roles, freelance projects, and interesting
                collaborations. Whether you need a full-stack developer, someone to help
                with AI integrations, or just want to chat about tech — reach out!
              </p>
            </div>

            {socialLinks.length > 0 && (
              <div className="space-y-3">
                {socialLinks.map(({ href, icon: Icon, label, display }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="font-medium text-sm group-hover:text-primary transition-colors">
                        {display}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                Availability
              </div>
              <p className="text-muted-foreground text-sm">
                Currently open to new opportunities — remote preferred, open to hybrid.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-card border border-border rounded-xl min-h-[400px]">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6 max-w-xs">
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-xl p-6 space-y-5"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or idea..."
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  <Send className="h-4 w-4 mr-2" />
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
