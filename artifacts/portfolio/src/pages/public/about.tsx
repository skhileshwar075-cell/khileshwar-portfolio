import { useGetSettings, useListSkills } from "@workspace/api-client-react";
import { Download, Cpu, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const { data: settings } = useGetSettings();
  const { data: skills = [] } = useListSkills();

  const topSkills = skills.slice(0, 12);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>About
            <span className="text-primary">{"/>"}</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Bio */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {settings?.ownerName ?? "Portfolio Owner"}
              </h2>
              <p className="text-primary font-medium text-lg mb-4">
                {settings?.ownerTitle ?? "Full Stack Developer"}
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {settings?.ownerBio ??
                  "A passionate developer who loves building things that matter."}
              </p>
            </div>

            {settings?.resumeUrl && (
              <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  <Download className="h-4 w-4 mr-2" /> Download Resume
                </Button>
              </a>
            )}
          </div>

          {/* Values/Approach */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Augmented Development</h3>
                <p className="text-muted-foreground text-sm">
                  I treat AI tools as a superpower — GitHub Copilot, Claude, and ChatGPT
                  are part of my daily workflow, letting me ship faster without sacrificing quality.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Hackathon Mindset</h3>
                <p className="text-muted-foreground text-sm">
                  Fast iteration, demo-driven development, and shipping something real.
                  I've placed top 3 in 5 out of 8 hackathons by focusing on impact over perfection.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real Problems, Real Solutions</h3>
                <p className="text-muted-foreground text-sm">
                  Every project starts with a genuine problem. Whether it's attendance fraud,
                  skill-matching for developers, or personalized learning — the tech serves the mission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick skills preview */}
        {topSkills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Tech I Work With</h2>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-sm px-3 py-1.5">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
