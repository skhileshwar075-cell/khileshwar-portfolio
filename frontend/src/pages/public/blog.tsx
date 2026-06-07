import { useState } from "react";
import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Calendar, Search, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function readingTime(content: string | null | undefined) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* Category → accent color (top border gradient) */
const CATEGORY_ACCENTS: Record<string, string> = {
  Engineering: "from-blue-500 to-cyan-500",
  Tutorial: "from-green-500 to-emerald-500",
  "AI/ML": "from-pink-500 to-rose-500",
  AI: "from-pink-500 to-rose-500",
  Career: "from-orange-500 to-amber-500",
  Productivity: "from-violet-500 to-purple-500",
  DevOps: "from-yellow-500 to-lime-500",
};

function defaultAccent(category: string | null | undefined): string {
  if (!category) return "from-primary/60 to-violet-500/60";
  return CATEGORY_ACCENTS[category] ?? "from-primary/60 to-violet-500/60";
}

function BlogCard({ post, idx }: { post: ReturnType<typeof useListBlogPosts>["data"] extends (infer T)[] | undefined ? T : never; idx: number }) {
  const delays = ["delay-100", "delay-200", "delay-300", "delay-400"] as const;
  const delay = delays[idx % delays.length];
  const ref = useScrollReveal<HTMLDivElement>(delay);
  const accent = defaultAccent(post.category);

  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`}>
        <article className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer h-full flex flex-col">
          {/* Accent bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

          <div className="p-6 flex flex-col flex-1">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {post.category && (
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              )}
              {((post.tags as string[]) ?? []).slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-muted-foreground text-sm line-clamp-2 flex-1 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTime(post.content)} min read
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                Read <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const { data: posts = [], isLoading } = useListBlogPosts({
    published: true,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{"<"}</span>Blog
            <span className="text-primary">{"/>"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Thoughts on development, AI tools, hackathons, and building
            software in the age of LLMs.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10 animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-card animate-pulse rounded-xl border border-border"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 border border-dashed rounded-xl">
            <p className="text-lg font-medium text-muted-foreground">
              {search ? "No posts match your search." : "No posts published yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post, idx) => (
              <BlogCard key={post.id} post={post} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
