import { useListSkills } from "@workspace/api-client-react";
import { Code2, Database, Server, TestTube, Cpu } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="h-5 w-5" />,
  Backend: <Server className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />,
  Testing: <TestTube className="h-5 w-5" />,
  "AI Tools": <Cpu className="h-5 w-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  Backend: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  Database: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  Testing: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
  "AI Tools": "from-pink-500/20 to-rose-500/20 border-pink-500/30",
};

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

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-card animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(grouped).map(([category, catSkills]) => (
              <div
                key={category}
                className={`bg-gradient-to-br ${CATEGORY_COLORS[category] ?? "from-muted/50 to-muted/30 border-border"} border rounded-xl p-6`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-background/60 rounded-lg">
                    {CATEGORY_ICONS[category] ?? <Code2 className="h-5 w-5" />}
                  </div>
                  <h2 className="text-lg font-semibold">{category}</h2>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {catSkills.length} skills
                  </span>
                </div>

                <div className="space-y-3">
                  {catSkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">
                          {skill.level != null
                            ? skill.level >= 85
                              ? "Expert"
                              : skill.level >= 70
                                ? "Advanced"
                                : skill.level >= 55
                                  ? "Intermediate"
                                  : "Beginner"
                            : ""}
                        </span>
                      </div>
                      {skill.level != null && (
                        <div className="h-1.5 bg-background/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
