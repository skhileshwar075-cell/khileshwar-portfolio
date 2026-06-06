import { useListSkills } from "@workspace/api-client-react";
import { Code2, Database, Server, Cpu, Wrench, Globe, Layers, FlaskConical } from "lucide-react";

const CATEGORY_META: Record<string, { icon: React.ReactNode; gradient: string; border: string }> = {
  Languages: {
    icon: <Code2 className="h-5 w-5" />,
    gradient: "from-indigo-500/20 to-violet-500/20",
    border: "border-indigo-500/30",
  },
  Frontend: {
    icon: <Globe className="h-5 w-5" />,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
  },
  Backend: {
    icon: <Server className="h-5 w-5" />,
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
  },
  Database: {
    icon: <Database className="h-5 w-5" />,
    gradient: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/30",
  },
  DevOps: {
    icon: <Wrench className="h-5 w-5" />,
    gradient: "from-yellow-500/20 to-lime-500/20",
    border: "border-yellow-500/30",
  },
  "AI/ML": {
    icon: <Cpu className="h-5 w-5" />,
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
  },
  "AI Tools": {
    icon: <Cpu className="h-5 w-5" />,
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
  },
  Testing: {
    icon: <FlaskConical className="h-5 w-5" />,
    gradient: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/30",
  },
  Other: {
    icon: <Layers className="h-5 w-5" />,
    gradient: "from-muted/50 to-muted/30",
    border: "border-border",
  },
};

const DEFAULT_META = {
  icon: <Code2 className="h-5 w-5" />,
  gradient: "from-muted/50 to-muted/30",
  border: "border-border",
};

function levelLabel(level: number | null | undefined) {
  if (level == null) return "";
  if (level >= 85) return "Expert";
  if (level >= 70) return "Advanced";
  if (level >= 55) return "Intermediate";
  return "Beginner";
}

function levelColor(level: number | null | undefined) {
  if (level == null) return "bg-primary";
  if (level >= 85) return "bg-emerald-500";
  if (level >= 70) return "bg-blue-500";
  if (level >= 55) return "bg-yellow-500";
  return "bg-muted-foreground";
}

export default function Skills() {
  const { data: skills = [], isLoading } = useListSkills();

  const grouped = skills.reduce(
    (acc, skill) => {
      const cat = skill.category ?? "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>,
  );

  const categoryOrder = [
    "Languages", "Frontend", "Backend", "Database", "DevOps", "AI/ML", "AI Tools", "Testing", "Other"
  ];
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Skills
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Technologies and tools I work with — from building UIs to training models,
            with AI tools woven throughout the workflow.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-card animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCategories.map((category) => {
              const meta = CATEGORY_META[category] ?? DEFAULT_META;
              const catSkills = grouped[category];
              return (
                <div
                  key={category}
                  className={`bg-gradient-to-br ${meta.gradient} ${meta.border} border rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-background/60 rounded-lg shrink-0">
                      {meta.icon}
                    </div>
                    <h2 className="text-lg font-semibold">{category}</h2>
                    <span className="ml-auto text-sm text-muted-foreground shrink-0">
                      {catSkills.length} skill{catSkills.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {catSkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {levelLabel(skill.level)}
                          </span>
                        </div>
                        {skill.level != null && (
                          <div className="h-1.5 bg-background/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${levelColor(skill.level)} rounded-full transition-all duration-700`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
