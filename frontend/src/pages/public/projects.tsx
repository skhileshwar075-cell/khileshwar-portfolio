import { useState } from "react";
import { useLocation } from "wouter";
import { useListProjects } from "@workspace/api-client-react";
import { ExternalLink, Github, Star, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "ai", label: "AI" },
  { value: "mobile", label: "Mobile" },
  { value: "devtools", label: "Dev Tools" },
  { value: "fullstack", label: "Full Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
];

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "in-progress": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  archived: "bg-muted text-muted-foreground border-border",
};

export default function Projects() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const { data: projects = [], isLoading } = useListProjects({
    search: search || undefined,
    category: category === "all" ? undefined : category,
    featured: featuredOnly || undefined,
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Projects
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A collection of things I've built — from hackathon prototypes to production
            apps, powered by modern web tech.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat.value)}
                className="h-8"
              >
                {cat.label}
              </Button>
            ))}
            <Button
              variant={featuredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className="h-8"
            >
              <Star className="h-3.5 w-3.5 mr-1.5" />
              Featured
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-card animate-pulse rounded-xl border border-border"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 border border-dashed rounded-xl">
            <p className="text-lg font-medium text-muted-foreground">
              No projects match your filters.
            </p>
            <Button
              variant="ghost"
              className="mt-3"
              onClick={() => { setSearch(""); setCategory("all"); setFeaturedOnly(false); }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const tech = (project.techStack as string[]) ?? [];
                return (
                  <div
                    key={project.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => setLocation(`/projects/${project.slug}`)}
                    onKeyDown={(e) => e.key === "Enter" && setLocation(`/projects/${project.slug}`)}
                    className="group h-full bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {project.category}
                          </Badge>
                          {project.featured && (
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                            STATUS_COLORS[project.status ?? ""] ?? STATUS_COLORS.archived
                          }`}
                        >
                          {project.status?.replace("-", " ")}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm flex-1 line-clamp-3 mb-4 leading-relaxed">
                        {project.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tech.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md font-mono"
                          >
                            {t}
                          </span>
                        ))}
                        {tech.length > 4 && (
                          <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-md">
                            +{tech.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex gap-3">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="h-3.5 w-3.5" />
                              Code
                            </a>
                          )}
                          {project.liveDemoUrl && (
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Demo
                            </a>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          Details <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
