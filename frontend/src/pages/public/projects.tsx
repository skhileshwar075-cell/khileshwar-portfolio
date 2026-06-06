import { useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import { ExternalLink, Github, Star, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Full Stack", "Frontend", "Backend", "AI", "Mobile"];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [featured, setFeatured] = useState<boolean | undefined>(undefined);

  const { data: projects = [], isLoading } = useListProjects({
    search: search || undefined,
    category: category === "All" ? undefined : category,
    featured,
  });

  function goToProject(slug: string) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    window.location.href = `${base}/projects/${slug}`;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Projects
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A collection of things I've built — from hackathon prototypes to production apps,
            powered by AI tools and modern web tech.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
            <Button
              variant={featured ? "default" : "outline"}
              size="sm"
              onClick={() => setFeatured(featured ? undefined : true)}
            >
              <Star className="h-3.5 w-3.5 mr-1" />
              Featured
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-card animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No projects found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group h-full bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => goToProject(project.slug)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                    {project.featured && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />}
                  </div>
                  <Badge variant={project.status === "completed" ? "default" : "outline"} className="text-xs capitalize">
                    {project.status?.replace("-", " ")}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm flex-1 line-clamp-3 mb-4">
                  {project.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {((project.techStack as string[]) ?? []).slice(0, 4).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md font-mono">
                      {tech}
                    </span>
                  ))}
                  {((project.techStack as string[]) ?? []).length > 4 && (
                    <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-md">
                      +{(project.techStack as string[]).length - 4} more
                    </span>
                  )}
                </div>
                <div className="flex gap-3 pt-3 border-t border-border">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-3.5 w-3.5" />Code
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
                      <ExternalLink className="h-3.5 w-3.5" />Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
