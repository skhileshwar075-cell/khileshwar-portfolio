import { Link } from "wouter";
import { useGetProjectBySlug } from "@workspace/api-client-react";
import { ExternalLink, Github, ArrowLeft, Star, CheckCircle2, Lightbulb, Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: { slug: string };
}

export default function ProjectDetail({ params }: Props) {
  const { data: project, isLoading, isError } = useGetProjectBySlug({ slug: params.slug });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-32 bg-card animate-pulse rounded" />
          <div className="h-12 w-3/4 bg-card animate-pulse rounded" />
          <div className="h-64 bg-card animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link href="/projects">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const techStack = (project.techStack as string[]) ?? [];
  const features = typeof project.features === "string"
    ? project.features.split("\n").filter(Boolean)
    : [];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-8 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary">{project.category}</Badge>
            <Badge
              variant={project.status === "completed" ? "default" : "outline"}
              className="capitalize"
            >
              {project.status?.replace("-", " ")}
            </Badge>
            {project.featured && (
              <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                <Star className="h-4 w-4 fill-yellow-500" /> Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{project.shortDescription}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-mono"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4 mr-2" /> View Code
                </Button>
              </a>
            )}
            {project.liveDemoUrl && (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          {project.problemStatement && (
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Bug className="h-5 w-5 text-destructive" /> The Problem
              </h2>
              <p className="text-muted-foreground leading-relaxed">{project.problemStatement}</p>
            </section>
          )}

          {project.solution && (
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" /> The Solution
              </h2>
              <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
            </section>
          )}

          {project.description && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </section>
          )}

          {features.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.challenges && (
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3">Challenges & Solutions</h2>
              <p className="text-muted-foreground leading-relaxed">{project.challenges}</p>
            </section>
          )}

          {project.futureScope && (
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3">Future Plans</h2>
              <p className="text-muted-foreground leading-relaxed">{project.futureScope}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
