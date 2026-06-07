import { useState, useEffect, useRef } from "react";
import {
  useGetPublicSummary,
  useListProjects,
  useListBlogPosts,
  useGetSettings,
  useTrackEvent,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star, Calendar, Clock } from "lucide-react";

/* ── Animated counter ─────────────────────────────────────────────── */
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ran.current) {
          ran.current = true;
          observer.disconnect();
          const steps = 40;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            setCount(Math.round(target * (step / steps)));
            if (step >= steps) clearInterval(timer);
          }, 1200 / steps);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

/* ── Typing effect ─────────────────────────────────────────────────── */
function TypingText({
  text,
  speed = 55,
  delay = 0,
}: {
  text: string;
  speed?: number;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  useEffect(() => {
    if (!started || !text) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, started]);

  return (
    <>
      {displayed}
      {!done && <span className="animate-blink text-primary">|</span>}
    </>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */
function readingTime(content: string | null | undefined) {
  if (!content) return 1;
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

function formatDate(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  ai: "from-pink-500/30 to-purple-500/30",
  web: "from-blue-500/30 to-cyan-500/30",
  mobile: "from-green-500/30 to-emerald-500/30",
  devtools: "from-orange-500/30 to-amber-500/30",
  fullstack: "from-indigo-500/30 to-blue-500/30",
  frontend: "from-sky-500/30 to-blue-500/30",
  backend: "from-emerald-500/30 to-teal-500/30",
};

const CATEGORY_LABEL_COLORS: Record<string, string> = {
  ai: "text-pink-500",
  web: "text-blue-500",
  mobile: "text-green-500",
  devtools: "text-orange-500",
};

/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { data: settings, isLoading: isSettingsLoading } = useGetSettings();
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetPublicSummary();
  const { data: featuredProjects, isLoading: isProjectsLoading } = useListProjects({ featured: true });
  const { data: recentPosts, isLoading: isPostsLoading } = useListBlogPosts({ published: true });
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent.mutate({ data: { type: "page_view" } });
  }, []);

  const stats = [
    { label: "Projects", value: summary?.totalProjects ?? 0 },
    { label: "Skills", value: summary?.totalSkills ?? 0 },
    { label: "Certifications", value: summary?.totalCertificates ?? 0 },
    { label: "Roles", value: summary?.totalExperience ?? 0 },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4 md:px-6">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)",
              backgroundSize: "36px 36px",
            }}
          />
        </div>

        <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Text */}
          <div className="flex-1 space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Open to opportunities
            </div>

            {isSettingsLoading ? (
              <Skeleton className="h-16 w-3/4" />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                {settings?.heroText || "Building with intelligence."}
              </h1>
            )}

            {isSettingsLoading ? (
              <Skeleton className="h-6 w-full max-w-lg" />
            ) : (
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                {settings?.heroSubtext ||
                  "Computer Science graduate & software engineer shipping thoughtful, performant applications."}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25" asChild>
                <Link href="/projects">
                  View Work <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Right: Avatar or Terminal */}
          <div className="flex-1 w-full max-w-md animate-fade-in">
            {settings?.avatarUrl ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 to-violet-500/25 rounded-2xl blur-2xl scale-95" />
                <img
                  src={settings.avatarUrl}
                  alt={settings.ownerName || "Developer"}
                  className="relative w-full aspect-square object-cover rounded-2xl shadow-2xl border border-border"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/15 to-violet-500/15 rounded-3xl blur-2xl" />
                <div className="relative bg-card border border-border/70 rounded-xl overflow-hidden shadow-2xl">
                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/60">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-3 text-xs text-muted-foreground font-mono">portfolio.ts</span>
                  </div>
                  {/* Code content */}
                  <div className="p-5 font-mono text-sm leading-7">
                    <p className="text-muted-foreground/50 text-xs mb-2">{"// always building, always learning"}</p>
                    <p>
                      <span className="text-blue-400">const</span>{" "}
                      <span className="text-green-400">developer</span>{" "}
                      <span className="text-foreground">= {"{"}</span>
                    </p>
                    <p className="pl-5">
                      <span className="text-muted-foreground">name: </span>
                      <span className="text-orange-400">
                        "{isSettingsLoading ? "..." : settings?.ownerName ?? "Developer"}"
                      </span>
                      <span className="text-foreground">,</span>
                    </p>
                    <p className="pl-5">
                      <span className="text-muted-foreground">role: </span>
                      <span className="text-orange-400">
                        "
                        {isSettingsLoading ? (
                          "..."
                        ) : (
                          <TypingText
                            text={settings?.ownerTitle ?? "Full Stack Developer"}
                            delay={600}
                          />
                        )}
                        "
                      </span>
                      <span className="text-foreground">,</span>
                    </p>
                    <p className="pl-5">
                      <span className="text-muted-foreground">projects: </span>
                      <span className="text-cyan-400">
                        {isSummaryLoading ? "..." : summary?.totalProjects ?? 0}
                      </span>
                      <span className="text-foreground">,</span>
                    </p>
                    <p className="pl-5">
                      <span className="text-muted-foreground">status: </span>
                      <span className="text-green-400">"open to work"</span>
                      <span className="text-foreground">,</span>
                    </p>
                    <p>
                      <span className="text-foreground">{"}"}</span>
                    </p>
                    <p className="mt-3 flex items-center gap-1.5">
                      <span className="text-muted-foreground">$</span>
                      <span className="animate-blink text-primary font-bold">█</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="py-14 border-y bg-gradient-to-r from-muted/50 via-muted/20 to-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          {isSummaryError ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Unable to load public stats right now. Please refresh the page.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <div className="text-4xl md:text-5xl font-bold font-mono text-primary">
                    {isSummaryLoading ? (
                      <span className="opacity-25">—</span>
                    ) : (
                      <AnimatedCounter target={value} />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ FEATURED PROJECTS ══════════════ */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Work</h2>
            <p className="text-muted-foreground mt-1.5">
              A selection of projects I'm proud of.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2" asChild>
            <Link href="/projects">
              All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isProjectsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        ) : featuredProjects && featuredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.slice(0, 3).map((project, idx) => {
              const key = (project.category ?? "").toLowerCase();
              const gradient = CATEGORY_GRADIENTS[key] ?? "from-muted/40 to-muted/20";
              return (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <article
                    className="group h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col animate-slide-up"
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    {/* Gradient thumbnail or image */}
                    {project.thumbnailUrl ? (
                      <div className="aspect-video overflow-hidden border-b border-border">
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                      </div>
                    ) : (
                      <div
                        className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
                      >
                        <span className="text-5xl font-bold font-mono opacity-20 select-none">
                          {"</>"}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Star className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm flex-1 line-clamp-2 mb-4 leading-relaxed">
                        {project.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {((project.techStack as string[]) ?? []).slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md font-mono"
                          >
                            {t}
                          </span>
                        ))}
                        {((project.techStack as string[]) ?? []).length > 4 && (
                          <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-md">
                            +{((project.techStack as string[]) ?? []).length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={`capitalize text-xs ${CATEGORY_LABEL_COLORS[key] ?? ""}`}
                      >
                        {project.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        View details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-xl">
            <p className="text-muted-foreground">No featured projects yet.</p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </section>

      {/* ══════════════ LATEST WRITING ══════════════ */}
      <section className="py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Writing & Thoughts</h2>
              <p className="text-muted-foreground mt-1.5">
                Engineering, AI, and building in the age of LLMs.
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2" asChild>
              <Link href="/blog">
                All Posts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isPostsLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : recentPosts && recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {recentPosts.slice(0, 4).map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article
                    className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col animate-slide-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2 flex-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                      <Clock className="h-3 w-3" />
                      {readingTime(post.content)} min read
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-xl">
              <p className="text-muted-foreground">No posts published yet. Stay tuned.</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to build something{" "}
            <span className="gradient-text">great</span> together?
          </h2>
          <p className="text-xl text-muted-foreground">
            I'm open to new opportunities and interesting conversations.
            Let's connect.
          </p>
          <Button
            size="lg"
            className="h-12 px-8 text-base shadow-lg shadow-primary/25"
            asChild
          >
            <Link href="/contact">Say Hello →</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
