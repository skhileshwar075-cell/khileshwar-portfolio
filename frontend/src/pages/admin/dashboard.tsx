import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderKanban,
  Code2,
  FileText,
  Mail,
  BarChart3,
  Award,
  Star,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

function StatCard({
  label,
  value,
  icon: Icon,
  link,
  loading,
}: {
  label: string;
  value?: number;
  icon: React.ElementType;
  link: string;
  loading: boolean;
}) {
  return (
    <Link href={link}>
      <Card className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-3xl font-bold">{value ?? 0}</div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdminDashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  const stats = [
    { label: "Total Projects", value: summary?.totalProjects, icon: FolderKanban, link: "/admin/projects" },
    { label: "Skills Listed", value: summary?.totalSkills, icon: Code2, link: "/admin/skills" },
    { label: "Blog Posts", value: summary?.totalBlogPosts, icon: FileText, link: "/admin/blog" },
    { label: "Certificates", value: summary?.totalCertificates, icon: Award, link: "/admin/certificates" },
    { label: "Unread Messages", value: summary?.unreadContacts, icon: Mail, link: "/admin/contacts" },
    { label: "Total Visitors", value: summary?.totalVisitors, icon: BarChart3, link: "/admin/analytics" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your portfolio content and visitor metrics.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} loading={isLoading} />
        ))}
      </div>

      {/* Content breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Content Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Featured Projects", value: summary?.featuredProjects, icon: Star },
                  { label: "Published Posts", value: summary?.publishedPosts, icon: BookOpen },
                  { label: "Draft Posts", value: summary?.draftPosts, icon: FileText },
                  { label: "Work Experience Entries", value: summary?.totalExperience, icon: FolderKanban },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                    <span className="font-semibold tabular-nums">{value ?? 0}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { href: "/admin/projects", label: "Manage Projects", icon: FolderKanban },
                { href: "/admin/blog", label: "Write a Blog Post", icon: FileText },
                { href: "/admin/contacts", label: "View Messages", icon: Mail },
                { href: "/admin/settings", label: "Update Site Settings", icon: Code2 },
                { href: "/admin/analytics", label: "View Analytics", icon: BarChart3 },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
