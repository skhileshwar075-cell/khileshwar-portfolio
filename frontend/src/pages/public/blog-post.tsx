import { Link, useParams } from "wouter";
import { useGetBlogPostBySlug } from "@workspace/api-client-react";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function readingTime(content: string | null | undefined) {
  if (!content) return 1;
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

function renderMarkdown(md: string) {
  const html = md
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) =>
      `<pre class="bg-muted rounded-lg p-4 overflow-x-auto my-4 text-sm font-mono"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
    )
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 mb-1"><span class="text-primary mt-1.5 shrink-0">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="mb-1">$2</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80">$1</a>')
    .replace(/\n\n/g, '</p><p class="my-4 leading-relaxed text-muted-foreground">')
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith("<")) return line;
      return line;
    });

  return `<p class="my-4 leading-relaxed text-muted-foreground">${html}</p>`;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useGetBlogPostBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 w-32 bg-card animate-pulse rounded" />
          <div className="h-12 w-3/4 bg-card animate-pulse rounded" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-card animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const tags = (post.tags as string[]) ?? [];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="mb-8 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Button>
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt ?? post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readingTime(post.content)} min read
            </span>
          </div>
        </header>

        {post.content && (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        )}

        {tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-2">
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
