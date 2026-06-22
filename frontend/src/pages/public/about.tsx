import { useGetSettings, useListSkills } from "@workspace/api-client-react";
import { Download, Cpu, Zap, Heart, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function Reveal({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay?: "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500";
  className?: string;
}) {
  const ref = useScrollReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const CARD_STYLES = [
  {
    defaultIcon: <Cpu className="h-5 w-5 text-primary" />,
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/20",
  },
  {
    defaultIcon: <Zap className="h-5 w-5 text-yellow-500" />,
    gradient: "from-yellow-500/10 to-orange-500/10",
    border: "border-yellow-500/20",
  },
  {
    defaultIcon: <Heart className="h-5 w-5 text-rose-500" />,
    gradient: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-500/20",
  },
];

const DEFAULT_CARDS = [
  {
    title: "AI-Augmented Development",
    body: "I treat AI tools as a superpower — GitHub Copilot, Claude, and ChatGPT are part of my daily workflow, letting me ship faster without sacrificing quality.",
  },
  {
    title: "Hackathon Mindset",
    body: "Fast iteration, demo-driven development, and shipping something real. I've placed top 3 in 5 out of 8 hackathons by focusing on impact over perfection.",
  },
  {
    title: "Real Problems, Real Solutions",
    body: "Every project starts with a genuine problem. Whether it's attendance fraud, skill-matching, or personalised learning — the tech serves the mission.",
  },
];

export default function About() {
  const { data: settings } = useGetSettings();
  const { data: skills = [] } = useListSkills();

  const topSkills = skills.slice(0, 14);
  const ownerName = settings?.ownerName ?? "Portfolio Owner";

  const approachCards = [
    {
      title: settings?.card1Title ?? DEFAULT_CARDS[0].title,
      body: settings?.card1Body ?? DEFAULT_CARDS[0].body,
      ...CARD_STYLES[0],
    },
    {
      title: settings?.card2Title ?? DEFAULT_CARDS[1].title,
      body: settings?.card2Body ?? DEFAULT_CARDS[1].body,
      ...CARD_STYLES[1],
    },
    {
      title: settings?.card3Title ?? DEFAULT_CARDS[2].title,
      body: settings?.card3Body ?? DEFAULT_CARDS[2].body,
      ...CARD_STYLES[2],
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <Reveal className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>About
            <span className="text-primary">{"/>"}</span>
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16 items-start w-full">
          {/* Avatar + bio */}
          <Reveal className="lg:col-span-2 space-y-6 w-full">
            {/* Avatar */}
            <div className="relative w-fit mx-auto lg:mx-0">
              {settings?.avatarUrl ? (
                <img
                  src={settings.avatarUrl}
                  alt={ownerName}
                  className="w-40 h-40 rounded-2xl object-cover shadow-xl border border-border"
                />
              ) : (
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-xl border border-border">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-violet-600/80" />
                  <div className="relative flex items-center justify-center h-full">
                    <span className="text-5xl font-bold text-white/90 select-none">
                      {getInitials(ownerName)}
                    </span>
                  </div>
                </div>
              )}
              {/* Available badge */}
              <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1.5 bg-background border border-border rounded-full px-2.5 py-1 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Available</span>
              </div>
            </div>

            {/* Name & title */}
            <div>
              <h2 className="text-2xl font-bold mb-1">{ownerName}</h2>
              <p className="text-primary font-medium mb-4">
                {settings?.ownerTitle ?? "Full Stack Developer"}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {settings?.ownerBio ??
                  "A passionate developer who loves building things that matter."}
              </p>
            </div>

            {/* Social + resume */}
            <div className="flex flex-wrap gap-2">
              {settings?.resumeUrl && (
                <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="gap-2">
                    <Download className="h-3.5 w-3.5" /> Resume
                  </Button>
                </a>
              )}
              {settings?.githubUrl && (
                <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="px-3">
                    <Github className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="px-3">
                    <Linkedin className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="px-3">
                    <Twitter className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
            </div>
          </Reveal>

          {/* Approach cards */}
          <div className="lg:col-span-3 space-y-4 w-full">
            {approachCards.map((card, i) => {
              const delays = ["delay-100", "delay-200", "delay-300"] as const;
              return (
                <Reveal key={i} delay={delays[i]}>
                  <div
                    className={`bg-gradient-to-br ${card.gradient} border ${card.border} rounded-xl p-5 flex gap-4 hover:shadow-md transition-all`}
                  >
                    <div className="p-2 bg-background/70 rounded-lg h-fit shrink-0 shadow-sm">
                      {card.defaultIcon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{card.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Skills cloud */}
        {topSkills.length > 0 && (
          <Reveal className="w-full">
            <div className="border border-border rounded-xl p-6 bg-muted/20">
              <h2 className="text-xl font-bold mb-4">Tech I Work With</h2>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="text-sm px-3 py-1.5 hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
