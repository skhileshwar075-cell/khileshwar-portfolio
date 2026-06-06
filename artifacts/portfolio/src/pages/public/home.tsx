import { useGetDashboardSummary, useListProjects, useListBlogPosts, useGetSettings, useTrackEvent } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, TerminalSquare, Rocket, BrainCircuit } from "lucide-react";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: settings, isLoading: isSettingsLoading } = useGetSettings();
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: featuredProjects, isLoading: isProjectsLoading } = useListProjects({ featured: true });
  const { data: recentPosts, isLoading: isPostsLoading } = useListBlogPosts({ published: true });
  
  const trackEvent = useTrackEvent();
  
  useEffect(() => {
    trackEvent.mutate({ data: { type: "page_view" } });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 container mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16">
        <div className="flex-1 space-y-6">
          {isSettingsLoading ? (
            <Skeleton className="h-16 w-3/4" />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              {settings?.heroText || "Building with intelligence."}
            </h1>
          )}
          
          {isSettingsLoading ? (
            <Skeleton className="h-6 w-full max-w-lg" />
          ) : (
            <p className="text-xl text-muted-foreground max-w-2xl">
              {settings?.heroSubtext || "Computer Science graduate & software engineer shipping thoughtful, performant applications."}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/projects">
                View Work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-md">
          {isSettingsLoading ? (
            <Skeleton className="aspect-square rounded-xl" />
          ) : settings?.avatarUrl ? (
            <img 
              src={settings.avatarUrl} 
              alt={settings.ownerName || "Developer"} 
              className="w-full aspect-square object-cover rounded-xl shadow-2xl"
            />
          ) : (
            <div className="w-full aspect-square bg-muted rounded-xl flex items-center justify-center border border-border shadow-xl">
              <TerminalSquare className="h-32 w-32 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold font-mono">
                {isSummaryLoading ? "-" : summary?.totalProjects || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Projects</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold font-mono">
                {isSummaryLoading ? "-" : summary?.totalSkills || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Skills</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold font-mono">
                {isSummaryLoading ? "-" : summary?.totalCertificates || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Certifications</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold font-mono">
                {isSummaryLoading ? "-" : summary?.totalExperience || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Work</h2>
            <p className="text-muted-foreground mt-2">A selection of recent projects and experiments.</p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/projects">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isProjectsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-96 w-full rounded-xl" />)}
          </div>
        ) : featuredProjects && featuredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.slice(0, 3).map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col hover-elevate transition-all border-border/50">
                {project.thumbnailUrl && (
                  <div className="aspect-video w-full overflow-hidden border-b bg-muted">
                    <img 
                      src={project.thumbnailUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <Badge variant="secondary">{project.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">{project.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.slice(0, 4).map(tech => (
                      <Badge key={tech} variant="outline" className="font-mono text-xs">{tech}</Badge>
                    ))}
                    {(project.techStack?.length || 0) > 4 && (
                      <Badge variant="outline" className="font-mono text-xs">+{project.techStack!.length - 4}</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/10">
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href={`/projects/${project.slug}`}>
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-xl">
            <Rocket className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">No featured projects yet</p>
            <p className="text-muted-foreground">Check back soon for updates.</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/projects">
              View All Projects
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Latest Writing */}
      <section className="py-20 bg-muted/30 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Writing & Thoughts</h2>
              <p className="text-muted-foreground mt-2">Articles on software engineering, AI, and continuous learning.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/blog">
                Read All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isPostsLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
            </div>
          ) : recentPosts && recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {recentPosts.slice(0, 4).map((post) => (
                <Card key={post.id} className="hover-elevate transition-all border-border/50">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <Badge variant="outline">{post.category || "Article"}</Badge>
                      {post.publishedAt && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl">
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{post.excerpt || post.content?.slice(0, 150) + "..."}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-xl border-border/50">
              <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium">No posts published yet</p>
              <p className="text-muted-foreground">Stay tuned for upcoming articles.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to build something together?</h2>
          <p className="text-xl text-muted-foreground">
            I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          <Button size="lg" className="h-12 px-8 text-lg" asChild>
            <Link href="/contact">Say Hello</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
